import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse, RegisterRequest, LoginRequest } from '../types';
import apiService from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  favorites: any[];
  addToFavorites: (productId: string) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  loadFavorites: () => Promise<void>;
  isFavorite: (productId: string) => boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    initAuth();
  }, []);

  const clearError = () => setError(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all transform translate-x-0 max-w-sm ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="mr-3">
            ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
          </div>
          <div class="text-sm font-medium">${message}</div>
        </div>
        <button class="ml-4 text-white hover:text-gray-200 font-bold text-lg" onclick="this.parentElement.parentElement.remove()">×</button>
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
        if (response && response.user) {
          setUser(response.user);
          await loadFavorites();
        } else if (response && response.id) {
          // Handle case where response is the user object directly
          setUser(response);
          await loadFavorites();
        } else {
          // Invalid response, clear token
          localStorage.removeItem('token');
          apiService.setToken(null);
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('token');
        apiService.setToken(null);
        setError('Session expired. Please login again.');
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

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const loginData: LoginRequest = { email, password };
      const response: AuthResponse = await apiService.login(loginData);
      
      if (response && response.user && response.token) {
        setUser(response.user);
        await loadFavorites();
        showNotification(`Welcome back, ${response.user.name}!`, 'success');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Login failed. Please try again.';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      const registerData: RegisterRequest = { name, email, password, confirmPassword };
      const response: AuthResponse = await apiService.register(registerData);
      
      if (response && response.user && response.token) {
        setUser(response.user);
        await loadFavorites();
        showNotification(`Welcome to ChocoDelight, ${response.user.name}!`, 'success');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
    setError(null);
    apiService.logout();
    showNotification('You have been logged out successfully', 'info');
  };

  const addToFavorites = async (productId: string) => {
    if (!user) {
      const errorMessage = 'Please login to add favorites';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      throw new Error(errorMessage);
    }
    
    try {
      await apiService.addToFavorites(productId);
      await loadFavorites();
      showNotification('Added to favorites!', 'success');
    } catch (error: any) {
      console.error('Error adding to favorites:', error);
      const errorMessage = error.message || 'Failed to add to favorites';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      throw error;
    }
  };

  const removeFromFavorites = async (productId: string) => {
    if (!user) {
      const errorMessage = 'Please login to manage favorites';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      throw new Error(errorMessage);
    }
    
    try {
      await apiService.removeFromFavorites(productId);
      await loadFavorites();
      showNotification('Removed from favorites', 'info');
    } catch (error: any) {
      console.error('Error removing from favorites:', error);
      const errorMessage = error.message || 'Failed to remove from favorites';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      logout,
      favorites,
      addToFavorites,
      removeFromFavorites,
      loadFavorites,
      isFavorite,
      clearError
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