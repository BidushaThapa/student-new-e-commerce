import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  authApi,
  type LoginInput,
  type RegisterInput,
} from '../../api/authApi';
import type { User } from '../../types/api';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(
    Boolean(localStorage.getItem('token')),
  );

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      return;
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      async login(input) {
        const result = await authApi.login(input);
        localStorage.setItem('token', result.token);
        localStorage.setItem('role', result.role);
        const currentUser = await authApi.me();
        setUser(currentUser);
        return currentUser;
      },
      async register(input) {
        const registeredUser = await authApi.register(input);
        return registeredUser;
      },
      logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}
