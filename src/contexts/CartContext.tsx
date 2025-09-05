import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import apiService from '../services/api';

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_CART'; payload: { items: CartItem[]; total: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_ITEM_OPTIMISTIC'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM_OPTIMISTIC'; payload: string };

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
  loadCart: () => Promise<void>;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        loading: false,
        error: null
      };
    case 'CLEAR_CART':
      return { items: [], total: 0, loading: false, error: null };
    case 'ADD_ITEM_OPTIMISTIC':
      const existingItemIndex = state.items.findIndex(item => item.product.id === action.payload.product.id);
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        };
      } else {
        const newItems = [...state.items, { product: action.payload.product, quantity: action.payload.quantity }];
        return {
          ...state,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        };
      }
    case 'REMOVE_ITEM_OPTIMISTIC':
      const filteredItems = state.items.filter(item => item.product.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { 
    items: [], 
    total: 0, 
    loading: false, 
    error: null 
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [user]);

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
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 4000);
  };

  const loadCart = async () => {
    if (!user) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const cartData = await apiService.getCart();
      
      if (cartData && cartData.items) {
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
    } catch (error: any) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  const addItem = async (product: Product, quantity: number = 1): Promise<void> => {
    if (!user) {
      showNotification('Please login to add items to cart', 'error');
      throw new Error('Please login to add items to cart');
    }

    if (!product.inStock) {
      showNotification('This product is out of stock', 'error');
      throw new Error('This product is out of stock');
    }
    
    // Optimistic update
    dispatch({ type: 'ADD_ITEM_OPTIMISTIC', payload: { product, quantity } });
    showNotification(`${product.name} added to cart!`, 'success');
    
    try {
      const response = await apiService.addToCart(product.id, quantity);
      
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
      // Revert optimistic update
      await loadCart();
      showNotification('Failed to add item to cart. Please try again.', 'error');
      throw error;
    }
  };

  const removeItem = async (productId: string): Promise<void> => {
    if (!user) {
      showNotification('Please login to manage cart', 'error');
      throw new Error('Please login to manage cart');
    }
    
    // Optimistic update
    dispatch({ type: 'REMOVE_ITEM_OPTIMISTIC', payload: productId });
    showNotification('Item removed from cart', 'info');
    
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
      // Revert optimistic update
      await loadCart();
      showNotification('Failed to remove item. Please try again.', 'error');
      throw error;
    }
  };

  const updateQuantity = async (productId: string, quantity: number): Promise<void> => {
    if (!user) {
      showNotification('Please login to manage cart', 'error');
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
      showNotification('Failed to update quantity. Please try again.', 'error');
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
      showNotification('Cart cleared successfully', 'info');
    } catch (error) {
      console.error('Error clearing cart:', error);
      dispatch({ type: 'CLEAR_CART' });
      showNotification('Cart cleared locally', 'info');
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
      loadCart,
      showNotification
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