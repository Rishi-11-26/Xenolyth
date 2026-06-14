'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export type UserData = {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  betaStatus: 'none' | 'pending' | 'approved' | 'rejected';
  productBetaStatuses?: Record<string, 'none' | 'pending' | 'approved' | 'rejected'>;
  createdAt: any;
};

type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, userData: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          
          const isFounder = firebaseUser.email?.toLowerCase() === 'xenolyth26@gmail.com';
          
          if (!userSnap.exists()) {
            // Create user document if it doesn't exist
            const newUserData: UserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              role: isFounder ? 'admin' : 'user',
              betaStatus: isFounder ? 'approved' : 'none',
              productBetaStatuses: {
                sentinel: isFounder ? 'approved' : 'none',
                argus: isFounder ? 'approved' : 'none'
              },
              createdAt: serverTimestamp()
            };
            await setDoc(userRef, newUserData);
            setUserData(newUserData);
          } else {
            let data = userSnap.data() as UserData;
            let needsMerge = false;
            const updatedFields: Partial<UserData> = {};

            // Enforce founder permissions
            if (isFounder && (data.role !== 'admin' || data.productBetaStatuses?.sentinel !== 'approved')) {
              updatedFields.role = 'admin';
              updatedFields.betaStatus = 'approved';
              updatedFields.productBetaStatuses = {
                sentinel: 'approved',
                argus: 'approved'
              };
              needsMerge = true;
            }

            // Backfill productBetaStatuses if it doesn't exist
            if (!data.productBetaStatuses && !isFounder) {
              updatedFields.productBetaStatuses = {
                sentinel: data.betaStatus || 'none',
                argus: 'none'
              };
              needsMerge = true;
            }

            if (needsMerge) {
              await setDoc(userRef, updatedFields, { merge: true });
              data = { ...data, ...updatedFields };
            }
            
            setUserData(data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
