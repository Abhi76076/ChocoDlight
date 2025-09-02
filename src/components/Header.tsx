import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, X, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onToggleCart: () => void;
  onSearch?: (searchTerm: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onToggleCart }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { getItemCount } = useCart();
  const { user, logout } = useAuth();

  const itemCount = getItemCount();

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'Shop', id: 'shop' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' }
  ];

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (onSearch) {
        onSearch(searchTerm);
      }
      // Navigate to shop page with search
      onNavigate('shop');
      setIsSearchOpen(false);
      setSearchTerm('');
    }
  };
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button 
              onClick={() => handleNavigation('home')}
              className="text-2xl font-bold text-amber-900 font-serif hover:text-amber-800 transition-colors"
            >
              ChocoDelight
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-amber-900 border-b-2 border-amber-900'
                    : 'text-gray-700 hover:text-amber-900'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-700 hover:text-amber-900 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Favorites */}
            <button 
              onClick={() => handleNavigation('profile')}
              className="p-2 text-gray-700 hover:text-amber-900 transition-colors"
            >
              <Heart className="w-5 h-5" />
            </button>

            {/* Cart */}
            {user && (
              <button 
                onClick={onToggleCart}
                className="p-2 relative text-gray-700 hover:text-amber-900 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            )}

            {/* User */}
            <div className="relative">
              {user ? (
                <div className="flex items-center space-x-2">
                  {user.role === 'admin' && (
                    <button 
                      onClick={() => handleNavigation('admin')}
                      className="text-sm bg-amber-600 text-white px-3 py-1 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Admin
                    </button>
                  )}
                  <button 
                    onClick={() => handleNavigation('profile')}
                    className="p-2 text-gray-700 hover:text-amber-900 transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  <button
                    onClick={logout}
                    className="text-sm text-gray-700 hover:text-amber-900 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => handleNavigation('login')}
                  className="p-2 text-gray-700 hover:text-amber-900 transition-colors"
                >
                  <User className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-amber-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for chocolates..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`block px-3 py-2 text-base font-medium w-full text-left transition-colors ${
                  currentPage === item.id
                    ? 'text-amber-900 bg-amber-50'
                    : 'text-gray-700 hover:text-amber-900 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};