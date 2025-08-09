import React from 'react';
import { CheckCircle, Home, Package } from 'lucide-react';

interface OrderSuccessPageProps {
  onNavigate: (page: string) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ onNavigate }) => {
  const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Successful!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Order Number</p>
          <p className="text-lg font-bold text-gray-900">#{orderId}</p>
        </div>

        <div className="text-left mb-6">
          <h3 className="font-semibold mb-3">What's Next?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              You'll receive an email confirmation shortly
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Your order will be processed within 1-2 business days
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Estimated delivery: 3-5 business days
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onNavigate('profile')}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            <Package className="w-5 h-5 mr-2" />
            Track Your Order
          </button>
          <button
            onClick={() => onNavigate('shop')}
            className="w-full border border-amber-600 text-amber-600 hover:bg-amber-50 py-3 rounded-lg font-semibold transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="w-full text-gray-600 hover:text-gray-800 py-2 font-semibold transition-colors flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};