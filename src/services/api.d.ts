import { Product, CartItem, User, Address, Order, Review } from '../types';

declare class ApiService {
  constructor();
  setToken(token: string | null): void;
  getHeaders(): Record<string, string>;
  request(endpoint: string, options?: RequestInit): Promise<any>;

  // Auth methods
  register(userData: { name: string; email: string; password: string }): Promise<{ user: User; token: string }>;
  login(credentials: { email: string; password: string }): Promise<{ user: User; token: string }>;
  forgotPassword(data: { email: string }): Promise<any>;
  resetPassword(data: { token: string; password: string }): Promise<any>;
  getCurrentUser(): Promise<User>;
  updateProfile(profileData: Partial<User>): Promise<User>;

  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product>;
  createProduct(productData: Partial<Product>): Promise<Product>;
  updateProduct(id: string, productData: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

  // Cart methods
  getCart(): Promise<{ items: CartItem[]; total: number }>;
  addToCart(productId: string, quantity?: number): Promise<{ items: CartItem[]; total: number }>;
  updateCartItem(productId: string, quantity: number): Promise<{ items: CartItem[]; total: number }>;
  removeFromCart(productId: string): Promise<{ items: CartItem[]; total: number }>;
  clearCart(): Promise<void>;

  // Order methods
  createOrder(orderData: { items: { productId: string; quantity: number; price: number }[]; total: number; shippingAddress: Address; paymentMethod: string }): Promise<Order>;
  getMyOrders(): Promise<Order[]>;
  cancelOrder(orderId: string): Promise<Order>;

  // Favorites methods
  getFavorites(): Promise<Product[]>;
  addToFavorites(productId: string): Promise<Product[]>;
  removeFromFavorites(productId: string): Promise<Product[]>;

  // Admin methods
  getCustomers(): Promise<User[]>;
  updateCustomer(id: string, customerData: Partial<User>): Promise<User>;
  deleteCustomer(id: string): Promise<void>;
  getDashboardStats(): Promise<any>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: string): Promise<Order>;

  // Reviews methods
  getProductReviews(productId: string): Promise<Review[]>;
  addReview(productId: string, rating: number, comment: string): Promise<Review>;

  // Tree Data methods (for debugging/visualization)
  getTreeData(sessionId: string): Promise<any[]>;
  saveTreeData(treeData: any): Promise<any>;

  // Performance Metrics methods
  getPerformanceMetrics(timeRange?: string): Promise<any[]>;
  logPerformanceMetric(metric: any): Promise<any>;

  logout(): void;
}

declare const apiService: ApiService;
export default apiService;
