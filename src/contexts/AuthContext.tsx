import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import apiService from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  favorites: any[];
  addToFavorites: (productId: string) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  loadFavorites: () => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    // Load user data and check token validity
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          apiService.setToken(token);
          const response = await apiService.getCurrentUser();
          setUser(response.user);
          await loadFavorites();
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          apiService.setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loadFavorites = async () => {
    try {
      const favoritesData = await apiService.getFavorites();
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    }
  };

  const isFavorite = (productId: string): boolean => {
    return favorites.some(fav => 
      (fav.productId && fav.productId._id === productId) || 
      (fav.productId === productId)
    );
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login({ email, password });
      setUser(response.user);
      await loadFavorites();
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.register({ name, email, password, confirmPassword: password });
      setUser(response.user);
      await loadFavorites();
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
    apiService.logout();
  };

  const addToFavorites = async (productId: string) => {
    if (!user) return;
    try {
      await apiService.addToFavorites(productId);
      await loadFavorites();
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  };

  const removeFromFavorites = async (productId: string) => {
    if (!user) return;
    try {
      await apiService.removeFromFavorites(productId);
      await loadFavorites();
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
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
      removeFromFavorites,
      loadFavorites,
      isFavorite
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