import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', page: 'home' },
    { name: 'Shop', page: 'shop' },
    { name: 'About Us', page: 'about' },
    { name: 'Contact', page: 'contact' }
  ];

  const categories = [
    { name: 'Dark Chocolate', page: 'shop' },
    { name: 'Milk Chocolate', page: 'shop' },
    { name: 'White Chocolate', page: 'shop' },
    { name: 'Gift Sets', page: 'shop' },
    { name: 'Truffles', page: 'shop' },
    { name: 'Seasonal', page: 'shop' }
  ];

  const customerService = [
    { name: 'My Account', page: 'profile' },
    { name: 'Order Tracking', page: 'profile' },
    { name: 'Shipping Info', page: 'contact' },
    { name: 'Returns', page: 'contact' },
    { name: 'FAQ', page: 'contact' },
    { name: 'Support', page: 'contact' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  return (
    <footer className="bg-amber-900 text-amber-50">
      {/* Newsletter Section */}
      <div className="bg-amber-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold font-serif mb-4">
              Sweet Deals & Updates
            </h3>
            <p className="text-amber-200 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about new products, 
              exclusive offers, and chocolate-making tips from our master chocolatiers.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <button 
                onClick={() => onNavigate('home')}
                className="text-2xl font-bold font-serif text-amber-100 hover:text-white transition-colors mb-4"
              >
                ChocoDelight
              </button>
              <p className="text-amber-200 mb-6 leading-relaxed">
                Crafting premium artisan chocolates since 1985. We use only the finest 
                ingredients and traditional European techniques to create unforgettable 
                chocolate experiences.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="text-amber-200">
                    <p>123 Chocolate Avenue</p>
                    <p>Sweet City, SC 12345</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span className="text-amber-200">(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span className="text-amber-200">info@chocodelght.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-amber-100 mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => onNavigate(link.page)}
                      className="text-amber-200 hover:text-white transition-colors"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Product Categories */}
            <div>
              <h4 className="text-lg font-semibold text-amber-100 mb-6">Categories</h4>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.name}>
                    <button
                      onClick={() => onNavigate(category.page)}
                      className="text-amber-200 hover:text-white transition-colors"
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-lg font-semibold text-amber-100 mb-6">Customer Service</h4>
              <ul className="space-y-3">
                {customerService.map((service) => (
                  <li key={service.name}>
                    <button
                      onClick={() => onNavigate(service.page)}
                      className="text-amber-200 hover:text-white transition-colors"
                    >
                      {service.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-amber-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-amber-200">
              <span>© {currentYear} ChocoDelight. Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span>for chocolate lovers everywhere.</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-amber-200 mr-2">Follow us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-amber-300 hover:text-white transition-colors p-2 hover:bg-amber-800 rounded-full"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div className="mt-6 pt-6 border-t border-amber-800 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <button className="text-amber-300 hover:text-white transition-colors text-sm">
              Privacy Policy
            </button>
            <button className="text-amber-300 hover:text-white transition-colors text-sm">
              Terms of Service
            </button>
            <button className="text-amber-300 hover:text-white transition-colors text-sm">
              Cookie Policy
            </button>
            <button className="text-amber-300 hover:text-white transition-colors text-sm">
              Accessibility
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};