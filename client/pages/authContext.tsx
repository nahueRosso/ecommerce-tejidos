import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface AuthContextProps {
  children: ReactNode;
}

interface AuthState {
  isAuthenticated: boolean;
  isPasswordEntered: boolean;
  login: (password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  const [isPasswordEntered, setPasswordEntered] = useState<boolean>(false);
  const router = useRouter();

  const login = (password: string) => {
    if (password === 'huanguelen') {
      setAuthenticated(true);
      setPasswordEntered(true);
      router.push(`${router.asPath}`);
    } else {
      setAuthenticated(false);
      setPasswordEntered(false);
    }
  };

  const logout = () => {
    setAuthenticated(false);
    setPasswordEntered(false);
    router.push('/');
  };

  useEffect(() => {
    setAuthenticated(true);  // Simular autenticación inicial
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isPasswordEntered, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



export const useAuthImagen = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
