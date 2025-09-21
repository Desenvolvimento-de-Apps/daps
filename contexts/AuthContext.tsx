import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { router } from 'expo-router';

interface AuthContextType {
  user: User | null;
  roles: { [key: string]: boolean };
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  roles: {},
  isAuthenticated: false,
  isLoading: true,
  logout: async () => Promise.resolve(),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Força a atualização do token para obter as custom claims mais recentes.
        const idTokenResult = await user.getIdTokenResult(true);
        setRoles(idTokenResult.claims.roles || {});
      } else {
        setRoles({});
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    roles,
    isAuthenticated: !!user,
    logout: async () => {
      await auth.signOut();
      setUser(null);
      setRoles({});
      router.replace('/login');
    },
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
