import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "src/libs/firebase";

// Define the context type
interface MemoryUsageContextType {
  totalUsage: number;
}

// Create the context with the correct type
const MemoryUsageContext = createContext<MemoryUsageContextType | undefined>(undefined);

// Provider Component
export const MemoryUsageProvider = ({ children, uid }: { children: React.ReactNode; uid: string }) => {
  const [totalUsage, setTotalUsage] = useState(0);

  useEffect(() => {
    const fetchTotalUsage = async () => {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setTotalUsage(userData.totalUsage || 0);
      }
    };

    if (uid) {
      fetchTotalUsage();
    }
  }, [uid]);

  return (
    <MemoryUsageContext.Provider value={{ totalUsage }}>
      {children}
    </MemoryUsageContext.Provider>
  );
};

// Hook to Access Context
export const useMemoryUsage = () => {
  const context = useContext(MemoryUsageContext);
  if (!context) {
    throw new Error("useMemoryUsage must be used within a MemoryUsageProvider");
  }
  return context;
};
