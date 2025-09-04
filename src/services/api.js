const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      console.log(`Making request to: ${url}`, config);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        console.error('API Error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      console.error('Request failed:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
  }

  // Auth methods
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async forgotPassword(data) {
    return await this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data) {
    return await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Product methods
  async getProducts() {
    return await this.request('/products');
  }

  async getProduct(id) {
    return await this.request(`/products/${id}`);
  }

  async createProduct(productData) {
    return await this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return await this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return await this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Cart methods
  async getCart() {
    try {
      const response = await this.request('/cart');
      console.log('Get cart response:', response);
      return response || { items: [], total: 0 };
    } catch (error) {
      console.error('Get cart error:', error);
      return { items: [], total: 0 };
    }
  }

  async addToCart(productId, quantity = 1) {
    console.log('API: Adding to cart:', { productId, quantity });
    const response = await this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
    console.log('API: Add to cart response:', response);
    return response;
  }

  async updateCartItem(productId, quantity) {
    console.log('API: Updating cart item:', { productId, quantity });
    const response = await this.request('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
    console.log('API: Update cart response:', response);
    return response;
  }

  async removeFromCart(productId) {
    console.log('API: Removing from cart:', productId);
    const response = await this.request(`/cart/remove/${productId}`, {
      method: 'DELETE',
    });
    console.log('API: Remove from cart response:', response);
    return response;
  }

  async clearCart() {
    const response = await this.request('/cart/clear', {
      method: 'DELETE',
    });
    console.log('API: Clear cart response:', response);
    return response;
  }

  // Order methods
  async createOrder(orderData) {
    console.log('API: Creating order:', orderData);
    const response = await this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    console.log('API: Create order response:', response);
    return response;
  }

  async getMyOrders() {
    return await this.request('/orders/my-orders');
  }

  async cancelOrder(orderId) {
    return await this.request(`/orders/${orderId}/cancel`, {
      method: 'PATCH',
    });
  }

  // Favorites methods
  async getFavorites() {
    try {
      const response = await this.request('/favorites');
      console.log('Get favorites response:', response);
      return response || [];
    } catch (error) {
      console.error('Get favorites error:', error);
      return [];
    }
  }

  async addToFavorites(productId) {
    console.log('API: Adding to favorites:', productId);
    const response = await this.request('/favorites/add', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
    console.log('API: Add to favorites response:', response);
    return response;
  }

  async removeFromFavorites(productId) {
    console.log('API: Removing from favorites:', productId);
    const response = await this.request(`/favorites/remove/${productId}`, {
      method: 'DELETE',
    });
    console.log('API: Remove from favorites response:', response);
    return response;
  }

  // Admin methods
  async getCustomers() {
    return await this.request('/admin/customers');
  }

  async updateCustomer(id, customerData) {
    return await this.request(`/admin/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  }

  async deleteCustomer(id) {
    return await this.request(`/admin/customers/${id}`, {
      method: 'DELETE',
    });
  }

  async getDashboardStats() {
    return await this.request('/admin/dashboard');
  }

  async getAllOrders() {
    return await this.request('/orders/admin/all');
  }

  async updateOrderStatus(orderId, status) {
    return await this.request(`/orders/admin/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Reviews methods
  async getProductReviews(productId) {
    return await this.request(`/reviews/product/${productId}`);
  }

  async addReview(productId, rating, comment) {
    return await this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify({ productId, rating, comment }),
    });
  }

  logout() {
    this.setToken(null);
  }
}

const apiService = new ApiService();
export default apiService;