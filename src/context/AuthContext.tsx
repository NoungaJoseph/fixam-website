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
  dob?: string;
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

// Persist user data alongside the token so we can restore it on refresh
const STORED_USER_KEY = 'fixam_user_data';

const saveUserToStorage = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORED_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORED_USER_KEY);
  }
};

const loadUserFromStorage = (): User | null => {
  try {
    const raw = localStorage.getItem(STORED_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialise with stored user so the UI is populated immediately on refresh
  const [user, setUser] = useState<User | null>(loadUserFromStorage);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem('fixam_token');

    // No token — definitely not logged in
    if (!token) {
      setUser(null);
      saveUserToStorage(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      if (response.data.success && response.data.user) {
        const freshUser: User = {
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
          dob: response.data.user.dob,
        };
        setUser(freshUser);
        saveUserToStorage(freshUser);
      } else {
        // Server explicitly says not authenticated — clear everything
        setUser(null);
        saveUserToStorage(null);
        localStorage.removeItem('fixam_token');
      }
    } catch (error: any) {
      console.error('Failed to refresh user', error);
      // 401 = genuinely invalid/expired token → log out
      if (error.response?.status === 401) {
        setUser(null);
        saveUserToStorage(null);
        localStorage.removeItem('fixam_token');
      }
      // Any other error (network, 500, CORS hiccup) → keep existing stored user
      // so a temporary server blip doesn't log the user out
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('fixam_token', token);
    setUser(userData);
    saveUserToStorage(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout failed", error);
    }
    localStorage.removeItem('fixam_token');
    saveUserToStorage(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
