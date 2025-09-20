import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Verifique o caminho para seu firebaseConfig

interface AuthContextType {
  user: User | null;
  roles: { [key: string]: boolean };
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  roles: {},
  isAuthenticated: false,
  isLoading: true,
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
        // Supondo que suas claims estarão em um objeto 'roles'.
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
    isAuthenticated: !!user && !user.isAnonymous, // Consideramos não anônimos como "autenticados" para fins de acesso a certas áreas
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

// Default export for compatibility with routing systems expecting a React component
export default AuthProvider;
