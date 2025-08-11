import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    enum: ['credit-card', 'paypal', 'cash-on-delivery'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  canCancel: {
    type: Boolean,
    default: true
  },
  cancelledAt: Date,
  packedAt: Date,
  shippedAt: Date,
  deliveredAt: Date
}, {
  timestamps: true
});

// Automatically disable cancellation after 5 minutes or when packed
orderSchema.pre('save', function(next) {
  if (this.isNew) {
    // Set timer to disable cancellation after 5 minutes
    setTimeout(() => {
      this.canCancel = false;
      this.save();
    }, 5 * 60 * 1000); // 5 minutes
  }
  
  // Disable cancellation when order is packed
  if (this.status === 'packed' && !this.packedAt) {
    this.packedAt = new Date();
    this.canCancel = false;
  }
  
  next();
});

export default mongoose.model('Order', orderSchema);