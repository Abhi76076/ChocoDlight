import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addItem } = useCart();
  const { user, isFavorite, addToFavorites, removeFromFavorites } = useAuth();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const isProductFavorite = user ? isFavorite(product.id) : false;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    if (!product.inStock) {
      alert('This product is out of stock');
      return;
    }

    setIsAddingToCart(true);
    try {
      await addItem(product, 1);
    } catch (error: any) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      alert('Please login to manage favorites');
      return;
    }

    setIsTogglingFavorite(true);
    try {
      if (isProductFavorite) {
        await removeFromFavorites(product.id);
      } else {
        await addToFavorites(product.id);
      }
    } catch (error: any) {
      console.error('Error managing favorites:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden transform hover:-translate-y-1"
      onClick={() => onViewDetails(product)}
    >
      <div className="relative overflow-hidden bg-gray-100">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="small" message="" />
          </div>
        )}
        
        {imageError ? (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-2xl mb-2">🍫</div>
              <p className="text-sm">Image not available</p>
            </div>
          </div>
        ) : (
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        
        {/* Overlay buttons */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center mx-2"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </button>
        </div>
        
        {/* Sale badge */}
        {product.originalPrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
            Sale
          </div>
        )}
        
        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg bg-red-600 px-4 py-2 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
        
        {/* Favorite button */}
        {user && (
          <button
            onClick={handleToggleFavorite}
            disabled={isTogglingFavorite}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 disabled:opacity-50 ${
              isProductFavorite 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
            }`}
          >
            {isTogglingFavorite ? (
              <LoadingSpinner size="small" message="" />
            ) : (
              <Heart className={`w-4 h-4 ${isProductFavorite ? 'fill-current' : ''}`} />
            )}
          </button>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {product.rating.toFixed(1)} ({product.reviewCount})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-amber-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {user ? (
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAddingToCart}
              className={`p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                product.inStock && !isAddingToCart
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500'
              }`}
            >
              {isAddingToCart ? (
                <LoadingSpinner size="small" message="" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                alert('Please login to add items to cart');
              }}
              className="p-2 rounded-full bg-gray-300 text-gray-500 transition-colors hover:bg-gray-400"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};