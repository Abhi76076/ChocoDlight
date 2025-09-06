import React, { useState } from 'react';
import { ArrowLeft, User, Package, Heart, Settings, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { products } from '../data/products';

interface ProfilePageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, logout, favorites, loadFavorites } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'favorites'>('profile');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || 'US'
    }
  });

  React.useEffect(() => {
    if (user && activeTab === 'orders') {
      loadOrders();
    }
    if (user && activeTab === 'favorites') {
      loadFavorites();
    }
  }, [user, activeTab]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await apiService.getMyOrders();
      console.log('Loaded orders:', ordersData);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await apiService.cancelOrder(orderId);
        loadOrders(); // Reload orders
      } catch (error: any) {
        alert(error.message || 'Failed to cancel order');
      }
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.updateProfile(profileData);
      alert('Profile updated successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to update profile');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <button
            onClick={() => onNavigate('login')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Get favorite products with proper error handling
  const favoriteProducts = favorites
    .map(fav => {
      if (fav.productId) {
        // If productId is an object (populated), return it directly
        if (typeof fav.productId === 'object' && fav.productId._id) {
          return fav.productId;
        }
        // If productId is a string, find the product in our local data
        return products.find(p => p.id === fav.productId);
      }
      return null;
    })
    .filter(Boolean);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'favorites', label: `Favorites (${favoriteProducts.length})`, icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center text-gray-600 hover:text-amber-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-amber-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="opacity-90">{user.email}</p>
                  {user.role === 'admin' && (
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm">Admin</span>
                  )}
                </div>
              </div>
              <button
                onClick={logout}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Tabs */}
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

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Account Information
                  </h3>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Update Profile
                    </button>
                  </form>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Shipping Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={profileData.address.street}
                      onChange={(e) => setProfileData(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, street: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={profileData.address.city}
                      onChange={(e) => setProfileData(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, city: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={profileData.address.state}
                      onChange={(e) => setProfileData(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, state: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={profileData.address.zipCode}
                      onChange={(e) => setProfileData(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, zipCode: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Order History</h3>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p>Loading orders...</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">Order #{order._id.slice(-8)}</p>
                            <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' || order.status === 'packed' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            {order.canCancel && order.status !== 'cancelled' && (
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                className="ml-2 text-red-600 hover:text-red-800 text-sm font-semibold"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-lg font-semibold text-amber-900">
                          Total: ${order.total.toFixed(2)}
                        </p>
                        <div className="mt-3 border-t pt-3">
                          <h4 className="font-medium mb-2">Items:</h4>
                          {order.items.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm text-gray-600">
                              <span>{item.product?.name || 'Unknown Product'} x {item.quantity}</span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No orders yet</p>
                    <button
                      onClick={() => onNavigate('shop')}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Favorite Products</h3>
                {favoriteProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteProducts.map((product) => (
                      <div key={product._id || product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-semibold mb-2">{product.name}</h4>
                        <p className="text-amber-900 font-bold">${product.price.toFixed(2)}</p>
                        <button
                          onClick={() => onNavigate('product-detail', product._id || product.id)}
                          className="mt-3 w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-semibold transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No favorite products yet</p>
                    <button
                      onClick={() => onNavigate('shop')}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg"
                    >
                      Browse Products
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};