import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { ConfirmDialog } from './ConfirmDialog';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, onCheckout }) => {
  const { state, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
  }>({ isOpen: false, productId: '', productName: '' });

  if (!user || !isOpen) {
    return null;
  }

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error: any) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeItem(productId);
      setConfirmDialog({ isOpen: false, productId: '', productName: '' });
    } catch (error: any) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = () => {
    if (state.items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    onCheckout();
  };

  const showRemoveConfirm = (productId: string, productName: string) => {
    setConfirmDialog({ isOpen: true, productId, productName });
  };

  return (
    <>
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-amber-50">
              <h2 className="text-lg font-semibold flex items-center text-amber-900">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shopping Cart ({state.items.length})
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-amber-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error State */}
            {state.error && (
              <div className="p-4 bg-red-50 border-b border-red-200">
                <p className="text-red-700 text-sm">{state.error}</p>
              </div>
            )}

            {/* Loading State */}
            {state.loading && (
              <div className="flex-1 flex items-center justify-center">
                <LoadingSpinner message="Loading cart..." />
              </div>
            )}

            {/* Cart Items */}
            {!state.loading && (
              <div className="flex-1 overflow-y-auto p-4">
                {state.items.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">Your cart is empty</p>
                    <p className="text-sm mb-4">Add some delicious chocolates to get started!</p>
                    <button
                      onClick={onClose}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {state.items.map((item) => (
                      <div key={item.product.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyMEM0MC44MzY2IDIwIDQ4IDI3LjE2MzQgNDggMzZDNDggNDQuODM2NiA0MC44MzY2IDUyIDMyIDUyQzIzLjE2MzQgNTIgMTYgNDQuODM2NiAxNiAzNkMxNiAyNy4xNjM0IDIzLjE2MzQgMjAgMzIgMjBaIiBmaWxsPSIjRTVFN0VCIi8+CjxwYXRoIGQ9Ik0zMiAyOEMzNi40MTgzIDI4IDQwIDMxLjU4MTcgNDAgMzZDNDAgNDAuNDE4MyAzNi40MTgzIDQ0IDMyIDQ0QzI3LjU4MTcgNDQgMjQgNDAuNDE4MyAyNCAzNkMyNCAzMS41ODE3IDI3LjU4MTcgMjggMzIgMjhaIiBmaWxsPSIjRDFENUREIi8+Cjx0ZXh0IHg9IjMyIiB5PSIzOCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjc3NDhGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn42rPC90ZXh0Pgo8L3N2Zz4K';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                          <p className="text-amber-900 font-semibold">
                            ${item.product.price.toFixed(2)}
                          </p>
                          <div className="flex items-center mt-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="mx-3 min-w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => showRemoveConfirm(item.product.id, item.product.name)}
                              className="ml-3 p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-amber-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            {!state.loading && state.items.length > 0 && (
              <div className="border-t p-4 space-y-4 bg-white">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-amber-900">${state.total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition-colors transform hover:scale-105"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={onClose}
                  className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Remove Item"
        message={`Are you sure you want to remove "${confirmDialog.productName}" from your cart?`}
        confirmText="Remove"
        cancelText="Keep"
        type="warning"
        onConfirm={() => handleRemoveItem(confirmDialog.productId)}
        onCancel={() => setConfirmDialog({ isOpen: false, productId: '', productName: '' })}
      />
    </>
  );
};