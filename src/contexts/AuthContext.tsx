import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import ApiService from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  favorites: string[];
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Load user data and check token validity
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          ApiService.setToken(token);
          const response = await ApiService.getCurrentUser();
          setUser(response.user);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          ApiService.setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await ApiService.login({ email, password });
      setUser(response.user);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message.includes('not authorized')) {
        throw new Error('You are not authorized. Please signup first.');
      }
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await ApiService.register({ name, email, password, confirmPassword: password });
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    ApiService.logout();
  };

  const addToFavorites = (productId: string) => {
    const newFavorites = [...favorites, productId];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const removeFromFavorites = (productId: string) => {
    const newFavorites = favorites.filter(id => id !== productId);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      favorites,
      addToFavorites,
      removeFromFavorites
    }}>
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