//src/hooks/use-protectedpage.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

// Simplified User type
interface User {
  uid: string;
  plan?: string; // Assume role is stored as a string
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
          setUser({ uid: firebaseUser.uid, plan: userDoc.data().plan as string });
        } else {
          setUser({ uid: firebaseUser.uid }); // User exists but no plan set
        }
      } else {
        setUser(null); // No user
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]); // Add 'auth' and 'db' to the dependencies array

  return { user, isLoading };
};

export const useProtectedPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {

        router.push('/login');
      } else if (['Expired', 'Canceled', 'canceled', 'Basic', 'Trial'].includes(user.plan ?? '')) {
        router.push('/pricing');
      }

      // Add more conditions as needed based on other plans
    }
  }, [user, isLoading, router]);
};
