export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  ingredients: string[];
  nutritionalInfo: {
    calories: number;
    fat: number;
    sugar: number;
    protein: number;
  };
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured: boolean;
  popularity: number;
  stockQuantity?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  address?: Address;
  role: 'customer' | 'admin';
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  _id?: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: Address;
  paymentMethod: string;
  canCancel?: boolean;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export interface FavoriteItem {
  id: string;
  productId: Product | string;
  userId: string;
  createdAt: string;
}