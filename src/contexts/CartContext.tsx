import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import apiService from '../services/api';

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_CART'; payload: { items: CartItem[]; total: number } }
  | { type: 'CLEAR_CART' };

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
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        loading: false
      };
    case 'CLEAR_CART':
      return { items: [], total: 0, loading: false };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, loading: false });
  const { user } = useAuth();

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cartData = await apiService.getCart();
      
      if (cartData && cartData.items) {
        // Transform backend cart data to frontend format
        const transformedItems: CartItem[] = cartData.items.map((item: any) => ({
          product: {
            id: item.product._id || item.product.id,
            name: item.product.name,
            price: item.product.price,
            originalPrice: item.product.originalPrice,
            category: item.product.category,
            description: item.product.description,
            ingredients: item.product.ingredients || [],
            nutritionalInfo: item.product.nutritionalInfo || { calories: 0, fat: 0, sugar: 0, protein: 0 },
            images: item.product.images || [],
            rating: item.product.rating || 0,
            reviewCount: item.product.reviewCount || 0,
            inStock: item.product.inStock !== false,
            featured: item.product.featured || false,
            popularity: item.product.popularity || 0
          },
          quantity: item.quantity
        }));

        dispatch({ 
          type: 'LOAD_CART', 
          payload: { 
            items: transformedItems, 
            total: cartData.total || 0
          } 
        });
      } else {
        dispatch({ type: 'CLEAR_CART' });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  const addItem = async (product: Product, quantity: number = 1): Promise<void> => {
    if (!user) {
      throw new Error('Please login to add items to cart');
    }
    
    try {
      console.log('Adding to cart:', { productId: product.id, quantity });
      const response = await apiService.addToCart(product.id, quantity);
      console.log('Add to cart response:', response);
      
      if (response && response.items) {
        const transformedItems: CartItem[] = response.items.map((item: any) => ({
          product: {
            id: item.product._id || item.product.id,
            name: item.product.name,
            price: item.product.price,
            originalPrice: item.product.originalPrice,
            category: item.product.category,
            description: item.product.description,
            ingredients: item.product.ingredients || [],
            nutritionalInfo: item.product.nutritionalInfo || { calories: 0, fat: 0, sugar: 0, protein: 0 },
            images: item.product.images || [],
            rating: item.product.rating || 0,
            reviewCount: item.product.reviewCount || 0,
            inStock: item.product.inStock !== false,
            featured: item.product.featured || false,
            popularity: item.product.popularity || 0
          },
          quantity: item.quantity
        }));

        dispatch({ 
          type: 'LOAD_CART', 
          payload: { 
            items: transformedItems, 
            total: response.total || 0
          } 
        });
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      throw new Error(error.message || 'Failed to add item to cart');
    }
  };

  const removeItem = async (productId: string): Promise<void> => {
    if (!user) {
      throw new Error('Please login to manage cart');
    }
    
    try {
      const response = await apiService.removeFromCart(productId);
      if (response && response.items) {
        const transformedItems: CartItem[] = response.items.map((item: any) => ({
          product: {
            id: item.product._id || item.product.id,
            name: item.product.name,
            price: item.product.price,
            originalPrice: item.product.originalPrice,
            category: item.product.category,
            description: item.product.description,
            ingredients: item.product.ingredients || [],
            nutritionalInfo: item.product.nutritionalInfo || { calories: 0, fat: 0, sugar: 0, protein: 0 },
            images: item.product.images || [],
            rating: item.product.rating || 0,
            reviewCount: item.product.reviewCount || 0,
            inStock: item.product.inStock !== false,
            featured: item.product.featured || false,
            popularity: item.product.popularity || 0
          },
          quantity: item.quantity
        }));

        dispatch({ 
          type: 'LOAD_CART', 
          payload: { 
            items: transformedItems, 
            total: response.total || 0
          } 
        });
      } else {
        dispatch({ type: 'CLEAR_CART' });
      }
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      throw new Error(error.message || 'Failed to remove item from cart');
    }
  };

  const updateQuantity = async (productId: string, quantity: number): Promise<void> => {
    if (!user) {
      throw new Error('Please login to manage cart');
    }
    
    try {
      if (quantity <= 0) {
        await removeItem(productId);
      } else {
        const response = await apiService.updateCartItem(productId, quantity);
        if (response && response.items) {
          const transformedItems: CartItem[] = response.items.map((item: any) => ({
            product: {
              id: item.product._id || item.product.id,
              name: item.product.name,
              price: item.product.price,
              originalPrice: item.product.originalPrice,
              category: item.product.category,
              description: item.product.description,
              ingredients: item.product.ingredients || [],
              nutritionalInfo: item.product.nutritionalInfo || { calories: 0, fat: 0, sugar: 0, protein: 0 },
              images: item.product.images || [],
              rating: item.product.rating || 0,
              reviewCount: item.product.reviewCount || 0,
              inStock: item.product.inStock !== false,
              featured: item.product.featured || false,
              popularity: item.product.popularity || 0
            },
            quantity: item.quantity
          }));

          dispatch({ 
            type: 'LOAD_CART', 
            payload: { 
              items: transformedItems, 
              total: response.total || 0
            } 
          });
        }
      }
    } catch (error: any) {
      console.error('Error updating cart:', error);
      throw new Error(error.message || 'Failed to update cart');
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