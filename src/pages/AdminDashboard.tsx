import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Package, ShoppingCart, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import apiService from '../services/api';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'customers' | 'orders'>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: 'truffles',
    description: '',
    ingredients: '',
    nutritionalInfo: {
      calories: '',
      fat: '',
      sugar: '',
      protein: ''
    },
    images: '',
    stockQuantity: '',
    featured: false
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardData, productsData, customersData, ordersData] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getProducts(),
        apiService.getCustomers(),
        apiService.getAllOrders()
      ]);

      setStats(dashboardData.stats);
      setProducts(productsData);
      setCustomers(customersData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        ingredients: productForm.ingredients.split(',').map(i => i.trim()),
        nutritionalInfo: {
          calories: parseInt(productForm.nutritionalInfo.calories),
          fat: parseFloat(productForm.nutritionalInfo.fat),
          sugar: parseFloat(productForm.nutritionalInfo.sugar),
          protein: parseFloat(productForm.nutritionalInfo.protein)
        },
        images: productForm.images.split(',').map(i => i.trim()),
        stockQuantity: parseInt(productForm.stockQuantity),
        popularity: Math.floor(Math.random() * 100)
      };

      if (editingProduct) {
        await apiService.updateProduct(editingProduct._id, productData);
      } else {
        await apiService.createProduct(productData);
      }

      setShowProductForm(false);
      setEditingProduct(null);
      resetProductForm();
      loadDashboardData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: '',
      category: 'truffles',
      description: '',
      ingredients: '',
      nutritionalInfo: { calories: '', fat: '', sugar: '', protein: '' },
      images: '',
      stockQuantity: '',
      featured: false
    });
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      ingredients: product.ingredients.join(', '),
      nutritionalInfo: {
        calories: product.nutritionalInfo.calories.toString(),
        fat: product.nutritionalInfo.fat.toString(),
        sugar: product.nutritionalInfo.sugar.toString(),
        protein: product.nutritionalInfo.protein.toString()
      },
      images: product.images.join(', '),
      stockQuantity: product.stockQuantity.toString(),
      featured: product.featured
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiService.deleteProduct(productId);
        loadDashboardData();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await apiService.deleteCustomer(customerId);
        loadDashboardData();
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Error deleting customer');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await apiService.updateOrderStatus(orderId, status);
      loadDashboardData();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Package },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingCart }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center text-gray-600 hover:text-amber-600 mr-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Admin Dashboard</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-6 py-4 font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-amber-600 text-amber-600'
                      : 'text-gray-600 hover:text-amber-600'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && stats && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <Users className="w-8 h-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">Total Customers</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.totalCustomers}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <Package className="w-8 h-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">Total Products</p>
                        <p className="text-2xl font-bold text-green-900">{stats.totalProducts}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <ShoppingCart className="w-8 h-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-purple-600">Total Orders</p>
                        <p className="text-2xl font-bold text-purple-900">{stats.totalOrders}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="w-8 h-8 text-orange-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-orange-600">Pending Orders</p>
                        <p className="text-2xl font-bold text-orange-900">{stats.pendingOrders}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Products Management</h2>
                  <button
                    onClick={() => {
                      setShowProductForm(true);
                      setEditingProduct(null);
                      resetProductForm();
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </button>
                </div>

                {showProductForm && (
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Product Name"
                        value={productForm.name}
                        onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={productForm.price}
                        onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="truffles">Truffles</option>
                        <option value="pralines">Pralines</option>
                        <option value="bars">Bars</option>
                        <option value="bonbons">Bonbons</option>
                        <option value="gift-sets">Gift Sets</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Stock Quantity"
                        value={productForm.stockQuantity}
                        onChange={(e) => setProductForm(prev => ({ ...prev, stockQuantity: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                      <textarea
                        placeholder="Description"
                        value={productForm.description}
                        onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                        className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        rows={3}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Ingredients (comma separated)"
                        value={productForm.ingredients}
                        onChange={(e) => setProductForm(prev => ({ ...prev, ingredients: e.target.value }))}
                        className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Image URLs (comma separated)"
                        value={productForm.images}
                        onChange={(e) => setProductForm(prev => ({ ...prev, images: e.target.value }))}
                        className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                      <div className="md:col-span-2 grid grid-cols-4 gap-4">
                        <input
                          type="number"
                          placeholder="Calories"
                          value={productForm.nutritionalInfo.calories}
                          onChange={(e) => setProductForm(prev => ({ 
                            ...prev, 
                            nutritionalInfo: { ...prev.nutritionalInfo, calories: e.target.value }
                          }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Fat (g)"
                          value={productForm.nutritionalInfo.fat}
                          onChange={(e) => setProductForm(prev => ({ 
                            ...prev, 
                            nutritionalInfo: { ...prev.nutritionalInfo, fat: e.target.value }
                          }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Sugar (g)"
                          value={productForm.nutritionalInfo.sugar}
                          onChange={(e) => setProductForm(prev => ({ 
                            ...prev, 
                            nutritionalInfo: { ...prev.nutritionalInfo, sugar: e.target.value }
                          }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Protein (g)"
                          value={productForm.nutritionalInfo.protein}
                          onChange={(e) => setProductForm(prev => ({ 
                            ...prev, 
                            nutritionalInfo: { ...prev.nutritionalInfo, protein: e.target.value }
                          }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>
                      <div className="md:col-span-2 flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={productForm.featured}
                          onChange={(e) => setProductForm(prev => ({ ...prev, featured: e.target.checked }))}
                          className="mr-2"
                        />
                        <label htmlFor="featured">Featured Product</label>
                      </div>
                      <div className="md:col-span-2 flex space-x-4">
                        <button
                          type="submit"
                          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg"
                        >
                          {editingProduct ? 'Update Product' : 'Add Product'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowProductForm(false);
                            setEditingProduct(null);
                            resetProductForm();
                          }}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img className="h-10 w-10 rounded-full object-cover" src={product.images[0]} alt={product.name} />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{product.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stockQuantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="text-amber-600 hover:text-amber-900 mr-4"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Customers Management</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customers.map((customer) => (
                        <tr key={customer._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDeleteCustomer(customer._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Orders Management</h2>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">Order #{order._id.slice(-8)}</h3>
                          <p className="text-sm text-gray-600">Customer: {order.userId?.name}</p>
                          <p className="text-sm text-gray-600">Email: {order.userId?.email}</p>
                          <p className="text-sm text-gray-600">Total: ${order.total}</p>
                        </div>
                        <div className="text-right">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="packed">Packed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Items:</h4>
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.product?.name} x {item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};