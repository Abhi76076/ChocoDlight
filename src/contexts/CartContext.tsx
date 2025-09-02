import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import apiService from '../services/api';

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: { items: any[]; total: number } };

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
  loadCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
      } else {
        const newItems = [...state.items, { product: action.payload, quantity: 1 }];
        return {
          items: newItems,
          total: calculateTotal(newItems)
        };
      }
    }
    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(item => item.product.id !== action.payload);
      return {
        items: filteredItems,
        total: calculateTotal(filteredItems)
      };
    }
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const filteredItems = state.items.filter(item => item.product.id !== action.payload.productId);
        return {
          items: filteredItems,
          total: calculateTotal(filteredItems)
        };
      }
      const updatedItems = state.items.map(item =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    }
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    case 'LOAD_CART':
      return {
        items: action.payload.items.map((item: any) => ({
          product: {
            id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            images: item.product.images,
            category: item.product.category,
            description: item.product.description,
            ingredients: item.product.ingredients,
            nutritionalInfo: item.product.nutritionalInfo,
            rating: item.product.rating,
            reviewCount: item.product.reviewCount,
            inStock: item.product.inStock,
            featured: item.product.featured,
            popularity: item.product.popularity
          },
          quantity: item.quantity
        })),
        total: action.payload.total
      };
    default:
      return state;
  }
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  const { user } = useAuth();

  // Load cart from database when user logs in
  React.useEffect(() => {
    if (user) {
      loadCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;
    try {
      const cartData = await apiService.getCart();
      dispatch({ type: 'LOAD_CART', payload: cartData });
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  const addItem = async (product: Product, quantity: number = 1): Promise<void> => {
    if (!user) {
      throw new Error('Please login to add items to cart');
      return;
    }
    
    try {
      const cartData = await apiService.addToCart(product.id, quantity);
      dispatch({ type: 'LOAD_CART', payload: cartData });
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeItem = async (productId: string): Promise<void> => {
    if (!user) {
      throw new Error('Please login to manage cart');
      return;
    }
    
    try {
      const cartData = await apiService.removeFromCart(productId);
      dispatch({ type: 'LOAD_CART', payload: cartData });
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (productId: string, quantity: number): Promise<void> => {
    if (!user) {
      throw new Error('Please login to manage cart');
      return;
    }
    
    try {
      const cartData = await apiService.updateCartItem(productId, quantity);
      dispatch({ type: 'LOAD_CART', payload: cartData });
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  };

  const clearCart = async (): Promise<void> => {
    if (!user) {
      dispatch({ type: 'CLEAR_CART' });
      return;
    }
    
    try {
      await apiService.clearCart();
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  const getItemCount = (): number => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemCount,
      loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};