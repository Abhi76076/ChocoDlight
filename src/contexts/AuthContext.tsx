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
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    initAuth();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all transform translate-x-0 ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
      <div class="flex items-center">
        <div class="mr-3">
          ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
        </div>
        <div>${message}</div>
        <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }
    }, 5000);
  };

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
        showNotification('Session expired. Please login again.', 'info');
      }
    }
    setLoading(false);
  };

  const loadFavorites = async () => {
    try {
      const favoritesData = await apiService.getFavorites();
      setFavorites(Array.isArray(favoritesData) ? favoritesData : []);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    }
  };

  const isFavorite = (productId: string): boolean => {
    if (!favorites || favorites.length === 0) return false;
    
    return favorites.some(fav => {
      if (fav.productId) {
        if (typeof fav.productId === 'object' && fav.productId._id) {
          return fav.productId._id === productId;
        }
        return fav.productId === productId;
      }
      return false;
    });
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login({ email, password });
      setUser(response.user);
      await loadFavorites();
      showNotification(`Welcome back, ${response.user.name}!`, 'success');
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      showNotification(error.message || 'Login failed. Please try again.', 'error');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.register({ name, email, password, confirmPassword: password });
      setUser(response.user);
      await loadFavorites();
      showNotification(`Welcome to ChocoDelight, ${response.user.name}!`, 'success');
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      showNotification(error.message || 'Registration failed. Please try again.', 'error');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
    apiService.logout();
    showNotification('You have been logged out successfully', 'info');
  };

  const addToFavorites = async (productId: string) => {
    if (!user) {
      showNotification('Please login to add favorites', 'error');
      throw new Error('Please login to add favorites');
    }
    
    try {
      await apiService.addToFavorites(productId);
      await loadFavorites();
      showNotification('Added to favorites!', 'success');
    } catch (error: any) {
      console.error('Error adding to favorites:', error);
      showNotification(error.message || 'Failed to add to favorites', 'error');
      throw error;
    }
  };

  const removeFromFavorites = async (productId: string) => {
    if (!user) {
      showNotification('Please login to manage favorites', 'error');
      throw new Error('Please login to manage favorites');
    }
    
    try {
      await apiService.removeFromFavorites(productId);
      await loadFavorites();
      showNotification('Removed from favorites', 'info');
    } catch (error: any) {
      console.error('Error removing from favorites:', error);
      showNotification(error.message || 'Failed to remove from favorites', 'error');
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
      isFavorite,
      showNotification
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