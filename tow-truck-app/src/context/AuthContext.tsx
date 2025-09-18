import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadUser, saveUser } from '@/storage/storage';
import { UserProfile } from '@/types';

type AuthContextType = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  signInWithPhone: (phone: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      const loaded = await loadUser();
      setUser(loaded);
      setIsReady(true);
    })();
  }, []);

  const signInWithPhone = async (phone: string, name?: string) => {
    const profile: UserProfile = { phone, name };
    setUser(profile);
    await saveUser(profile);
  };

  const signOut = async () => {
    setUser(null);
    await saveUser(null);
  };

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, signInWithPhone, signOut }),
    [user]
  );

  if (!isReady) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

