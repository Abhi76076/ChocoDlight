import React, { useState } from 'react';
import { Header } from './components/Header';
import { Cart } from './components/Cart';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Footer } from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  const handleNavigate = (page: string, productId?: string) => {
    setCurrentPage(page);
    if (productId) {
      setSelectedProductId(productId);
    }
    setIsCartOpen(false);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentPage('checkout');
  };

  const handleSearch = (searchTerm: string) => {
    setGlobalSearchTerm(searchTerm);
  };
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'shop':
        return <ShopPage onNavigate={handleNavigate} initialSearchTerm={globalSearchTerm} />;
      case 'product-detail':
        return selectedProductId ? (
          <ProductDetailPage productId={selectedProductId} onNavigate={handleNavigate} />
        ) : (
          <ShopPage onNavigate={handleNavigate} initialSearchTerm={globalSearchTerm} />
        );
      case 'checkout':
        return <CheckoutPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'order-success':
        return <OrderSuccessPage onNavigate={handleNavigate} />;
      case 'about':
        return (
          <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-4xl font-bold text-center mb-8 font-serif">About ChocoDelight</h1>
              <div className="prose prose-lg mx-auto">
                <p className="text-gray-700 leading-relaxed">
                  Since 1985, ChocoDelight has been dedicated to creating the finest artisan chocolates using traditional European techniques and premium ingredients sourced from around the world. Our passion for chocolate craftsmanship drives us to create unforgettable taste experiences.
                </p>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4">
              <h1 className="text-4xl font-bold text-center mb-8 font-serif">Contact Us</h1>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <p className="text-gray-700 mb-6">We'd love to hear from you! Get in touch with us.</p>
                <div className="space-y-4">
                  <p><strong>Email:</strong> info@chocodlight.com</p>
                  <p><strong>Phone:</strong> (555) 123-4567</p>
                  <p><strong>Address:</strong> 123 Chocolate Ave, Sweet City, SC 12345</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Header 
            currentPage={currentPage} 
            onNavigate={handleNavigate}
            onToggleCart={() => setIsCartOpen(!isCartOpen)}
            onSearch={handleSearch}
          />
          {renderPage()}
          <Cart 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)}
            onCheckout={handleCheckout}
          />
          <Footer onNavigate={handleNavigate} />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;