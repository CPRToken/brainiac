//src/contexts/auth/firebase/auth-context.ts
import { createContext } from 'react';
import type { Profile } from 'src/types/social';

import { Issuer } from 'src/utils/auth';

export interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: Profile | null;
}

export const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

export interface AuthContextType extends State {
  issuer: Issuer.Firebase;
  createUserWithEmailAndPassword: (email: string, password: string) => Promise<any>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  issuer: Issuer.Firebase,
  createUserWithEmailAndPassword: () => Promise.resolve(),
  signInWithEmailAndPassword: () => Promise.resolve(),

  signOut: () => Promise.resolve(),
});
