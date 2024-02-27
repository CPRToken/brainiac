import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

// Simplified User type
interface User {
  uid: string;
  role?: string; // Assume role is stored as a string
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, role: userDoc.data().role as string });
        } else {
          setUser({ uid: firebaseUser.uid }); // User exists but no role set
        }
      } else {
        setUser(null); // No user
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, isLoading };
};

export const useProtectedPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Redirect to login if no user is found
        router.push('/login');
      } else if (user.role?.includes('free')) { // Updated this line
        // Redirect to subscription page if user has the 'free' role
        router.push('/pricing');
      }
      // Add more conditions as needed based on other roles
    }
  }, [user, isLoading, router]);
};
