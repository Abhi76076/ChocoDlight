import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { products, categories } from '../data/products';
import { Product } from '../types';

interface ShopPageProps {
  onNavigate: (page: string, productId?: string) => void;
  initialSearchTerm?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onNavigate, initialSearchTerm = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Update search term when initialSearchTerm changes
  React.useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);
  const handleViewDetails = (product: Product) => {
    onNavigate('product-detail', product.id);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popularity':
        default:
          return b.popularity - a.popularity;
      }
    });
  }, [searchTerm, selectedCategory, sortBy, priceRange]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-serif mb-4">Our Products</h1>
          <p className="text-gray-600">Discover our complete collection of premium chocolates</p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name A-Z</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-amber-600 text-white' : 'bg-white text-gray-600'} transition-colors`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-amber-600 text-white' : 'bg-white text-gray-600'} transition-colors`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ${priceRange.min} - ${priceRange.max}
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredAndSortedProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewDetails}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setPriceRange({ min: 0, max: 100 });
                }}
                className="mt-4 text-amber-600 hover:text-amber-700 font-semibold"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};