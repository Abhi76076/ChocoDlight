import React from 'react';
import { Banner } from '../components/Banner';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';
import { Product } from '../types';
import { Star, Award, Truck, Shield } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const featuredProducts = products.filter(product => product.featured);

  const handleViewDetails = (product: Product) => {
    onNavigate('product-detail', product.id);
  };

  const features = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "Only the finest ingredients and traditional craftsmanship"
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Free delivery on orders over $50"
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "Your transactions are safe and secure"
    },
    {
      icon: Star,
      title: "Customer Rated",
      description: "Trusted by thousands of chocolate lovers"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <Banner onNavigate={onNavigate} />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                  <feature.icon className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium chocolates, crafted with love and the finest ingredients from around the world.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('shop')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-6">
                Our Story
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Since 1985, ChocoDelight has been crafting exceptional chocolates using traditional European techniques and the finest ingredients from around the world. Our master chocolatiers combine time-honored methods with innovative flavors to create unforgettable experiences.
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Every piece is handcrafted in small batches to ensure the highest quality and freshness. We source our cocoa beans directly from sustainable farms, supporting local communities while delivering the rich, complex flavors that make our chocolates truly special.
              </p>
              <button
                onClick={() => onNavigate('about')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Learn More
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3992140/pexels-photo-3992140.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Chocolate making process"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};