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
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `HTTP error! status: ${response.status}` };
        }
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
    try {
      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      if (response.token) {
        this.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (response.token) {
        this.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async forgotPassword(data) {
    try {
      return await this.request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  async resetPassword(data) {
    try {
      return await this.request('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.request('/auth/me');
      return response.user ? response : { user: response };
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      return await this.request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Product methods
  async getProducts() {
    try {
      return await this.request('/products');
    } catch (error) {
      console.error('Get products error:', error);
      return [];
    }
  }

  async getProduct(id) {
    try {
      return await this.request(`/products/${id}`);
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  }

  async createProduct(productData) {
    try {
      return await this.request('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  }

  async updateProduct(id, productData) {
    try {
      return await this.request(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      return await this.request(`/products/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
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
    try {
      console.log('API: Adding to cart:', { productId, quantity });
      const response = await this.request('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      });
      console.log('API: Add to cart response:', response);
      return response;
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    }
  }

  async updateCartItem(productId, quantity) {
    try {
      console.log('API: Updating cart item:', { productId, quantity });
      const response = await this.request('/cart/update', {
        method: 'PUT',
        body: JSON.stringify({ productId, quantity }),
      });
      console.log('API: Update cart response:', response);
      return response;
    } catch (error) {
      console.error('Update cart error:', error);
      throw error;
    }
  }

  async removeFromCart(productId) {
    try {
      console.log('API: Removing from cart:', productId);
      const response = await this.request(`/cart/remove/${productId}`, {
        method: 'DELETE',
      });
      console.log('API: Remove from cart response:', response);
      return response;
    } catch (error) {
      console.error('Remove from cart error:', error);
      throw error;
    }
  }

  async clearCart() {
    try {
      const response = await this.request('/cart/clear', {
        method: 'DELETE',
      });
      console.log('API: Clear cart response:', response);
      return response;
    } catch (error) {
      console.error('Clear cart error:', error);
      throw error;
    }
  }

  // Order methods
  async createOrder(orderData) {
    try {
      console.log('API: Creating order:', orderData);
      const response = await this.request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      console.log('API: Create order response:', response);
      return response;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }

  async getMyOrders() {
    try {
      return await this.request('/orders/my-orders');
    } catch (error) {
      console.error('Get orders error:', error);
      return [];
    }
  }

  async cancelOrder(orderId) {
    try {
      return await this.request(`/orders/${orderId}/cancel`, {
        method: 'PATCH',
      });
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  }

  // Favorites methods
  async getFavorites() {
    try {
      const response = await this.request('/favorites');
      console.log('Get favorites response:', response);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Get favorites error:', error);
      return [];
    }
  }

  async addToFavorites(productId) {
    try {
      console.log('API: Adding to favorites:', productId);
      const response = await this.request('/favorites/add', {
        method: 'POST',
        body: JSON.stringify({ productId }),
      });
      console.log('API: Add to favorites response:', response);
      return response;
    } catch (error) {
      console.error('Add to favorites error:', error);
      throw error;
    }
  }

  async removeFromFavorites(productId) {
    try {
      console.log('API: Removing from favorites:', productId);
      const response = await this.request(`/favorites/remove/${productId}`, {
        method: 'DELETE',
      });
      console.log('API: Remove from favorites response:', response);
      return response;
    } catch (error) {
      console.error('Remove from favorites error:', error);
      throw error;
    }
  }

  // Admin methods
  async getCustomers() {
    try {
      return await this.request('/admin/customers');
    } catch (error) {
      console.error('Get customers error:', error);
      return [];
    }
  }

  async updateCustomer(id, customerData) {
    try {
      return await this.request(`/admin/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(customerData),
      });
    } catch (error) {
      console.error('Update customer error:', error);
      throw error;
    }
  }

  async deleteCustomer(id) {
    try {
      return await this.request(`/admin/customers/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Delete customer error:', error);
      throw error;
    }
  }

  async getDashboardStats() {
    try {
      return await this.request('/admin/dashboard');
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      return { stats: { totalCustomers: 0, totalProducts: 0, totalOrders: 0, pendingOrders: 0 } };
    }
  }

  async getAllOrders() {
    try {
      return await this.request('/orders/admin/all');
    } catch (error) {
      console.error('Get all orders error:', error);
      return [];
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      return await this.request(`/orders/admin/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  }

  // Reviews methods
  async getProductReviews(productId) {
    try {
      return await this.request(`/reviews/product/${productId}`);
    } catch (error) {
      console.error('Get product reviews error:', error);
      return [];
    }
  }

  async addReview(productId, rating, comment) {
    try {
      return await this.request('/reviews', {
        method: 'POST',
        body: JSON.stringify({ productId, rating, comment }),
      });
    } catch (error) {
      console.error('Add review error:', error);
      throw error;
    }
  }

  logout() {
    this.setToken(null);
  }
}

const apiService = new ApiService();
export default apiService;