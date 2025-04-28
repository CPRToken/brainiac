//src/libs/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from 'src/config';

export const firebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp(); // 👈 EXPORT it here

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
