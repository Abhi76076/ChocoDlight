const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['truffles', 'pralines', 'bars', 'bonbons', 'gift-sets']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  ingredients: [{
    type: String,
    required: true
  }],
  nutritionalInfo: {
    calories: { type: Number, required: true },
    fat: { type: Number, required: true },
    sugar: { type: Number, required: true },
    protein: { type: Number, required: true }
  },
  images: [{
    type: String,
    required: true
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 100,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  popularity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);