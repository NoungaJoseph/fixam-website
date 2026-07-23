import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
  image?: string;
  avatar?: string;
  fullName?: string;
  phone?: string;
  preferredLanguage?: string;
  location?: string;
  providerProfile?: any;
  isOnline?: boolean;
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success && response.data.user) {
        setUser({
          id: response.data.user.id,
          firstName: response.data.user.firstName || response.data.user.fullName?.split(' ')[0] || '',
          lastName: response.data.user.lastName || response.data.user.fullName?.split(' ')[1] || '',
          fullName: response.data.user.fullName,
          email: response.data.user.email,
          role: response.data.user.role,
          image: response.data.user.avatar,
          avatar: response.data.user.avatar,
          phone: response.data.user.phone,
          preferredLanguage: response.data.user.preferredLanguage,
          location: response.data.user.location,
          providerProfile: response.data.user.providerProfile,
          isOnline: response.data.user.isOnline,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to refresh user", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (token: string, userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout failed", error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
