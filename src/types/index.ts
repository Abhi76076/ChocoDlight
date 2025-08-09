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
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  shippingAddress: Address;
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