import express from 'express';
import mongoose from 'mongoose';
import Favorite from '../models/Favorite.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

// Get user's favorites
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id }).populate('productId');
    res.json(favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to favorites
router.post('/add', auth, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    const productObjectId = new ObjectId(productId);

    const existingFavorite = await Favorite.findOne({ userId: req.user._id, productId: productObjectId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Product already in favorites' });
    }

    const favorite = new Favorite({ userId: req.user._id, productId: productObjectId });
    await favorite.save();
    await favorite.populate('productId');

    res.status(201).json(favorite);
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from favorites
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    const productObjectId = new ObjectId(productId);

    await Favorite.findOneAndDelete({ userId: req.user._id, productId: productObjectId });
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
