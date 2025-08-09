import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Order } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  orders: Order[];
  favorites: string[];
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Load user data from localStorage on mount
    const savedUser = localStorage.getItem('user');
    const savedOrders = localStorage.getItem('orders');
    const savedFavorites = localStorage.getItem('favorites');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'demo@chocodlight.com' && password === 'password') {
      const userData: User = {
        id: '1',
        name: 'Demo User',
        email: 'demo@chocodlight.com'
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData: User = {
      id: Date.now().toString(),
      name,
      email
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
      login,
      register,
      logout,
      orders,
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