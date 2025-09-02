import React, { useState } from 'react';
import { ArrowLeft, Star, Heart, ShoppingCart, Minus, Plus } from 'lucide-react';
import { products } from '../data/products';
import { reviews } from '../data/reviews';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId, onNavigate }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'reviews'>('description');
  
  const { addItem } = useCart();
  const { user, isFavorite, addToFavorites, removeFromFavorites } = useAuth();

  const product = products.find(p => p.id === productId);
  const productReviews = reviews.filter(r => r.productId === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const isProductFavorite = isFavorite(product.id);

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    if (!product.inStock) {
      alert('This product is out of stock');
      return;
    }

    try {
      // Add the specified quantity at once
      await addItem(product, quantity);
      console.log(`${quantity} item(s) added to cart successfully!`);
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      alert('Please login to manage favorites');
      return;
    }

    try {
      if (isProductFavorite) {
        await removeFromFavorites(product.id);
        alert('Removed from favorites');
      } else {
        await addToFavorites(product.id);
        alert('Added to favorites');
      }
    } catch (error) {
      console.error('Error managing favorites:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center text-gray-600 hover:text-amber-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Shop
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex space-x-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-amber-600' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-serif mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-amber-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                product.inStock 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </div>

              {/* Quantity and Add to Cart */}
              {user && product.inStock && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 min-w-16 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </button>
                    <button
                      onClick={handleToggleFavorite}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        isProductFavorite
                          ? 'border-red-500 bg-red-50 text-red-500'
                          : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isProductFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              )}

              {!user && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 text-center">
                    Please <button 
                      onClick={() => onNavigate('login')}
                      className="text-amber-600 hover:text-amber-700 font-semibold underline"
                    >
                      login
                    </button> to add items to cart or favorites
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="border-t">
            <div className="flex border-b">
              {[
                { id: 'description', label: 'Description' },
                { id: 'ingredients', label: 'Ingredients' },
                { id: 'reviews', label: `Reviews (${productReviews.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-amber-600 text-amber-600'
                      : 'text-gray-600 hover:text-amber-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-8">
              {activeTab === 'description' && (
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Nutritional Info (per serving)</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Calories: {product.nutritionalInfo.calories}</p>
                        <p>Fat: {product.nutritionalInfo.fat}g</p>
                        <p>Sugar: {product.nutritionalInfo.sugar}g</p>
                        <p>Protein: {product.nutritionalInfo.protein}g</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div>
                  <h4 className="font-semibold mb-4">Ingredients</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  {productReviews.length > 0 ? (
                    <div className="space-y-6">
                      {productReviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold">{review.userName}</h5>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">{review.comment}</p>
                          <p className="text-sm text-gray-500">{review.createdAt}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};