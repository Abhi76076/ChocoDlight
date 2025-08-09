import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Dark Chocolate Truffle Collection',
    price: 24.99,
    originalPrice: 29.99,
    category: 'truffles',
    description: 'Indulge in our signature dark chocolate truffles, handcrafted with premium Belgian cocoa and infused with exotic flavors.',
    ingredients: ['Dark chocolate (70% cocoa)', 'Heavy cream', 'Butter', 'Natural flavors', 'Sea salt'],
    nutritionalInfo: { calories: 120, fat: 8, sugar: 10, protein: 2 },
    images: [
      'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3778570/pexels-photo-3778570.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    featured: true,
    popularity: 95
  },
  {
    id: '2',
    name: 'Milk Chocolate Praline Hearts',
    price: 18.99,
    category: 'pralines',
    description: 'Delicate heart-shaped pralines filled with smooth milk chocolate and crunchy hazelnut pieces.',
    ingredients: ['Milk chocolate', 'Hazelnuts', 'Sugar', 'Cocoa butter', 'Vanilla extract'],
    nutritionalInfo: { calories: 95, fat: 6, sugar: 8, protein: 1.5 },
    images: [
      'https://images.pexels.com/photos/3992133/pexels-photo-3992133.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2373520/pexels-photo-2373520.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    featured: true,
    popularity: 87
  },
  {
    id: '3',
    name: 'White Chocolate Raspberry Bars',
    price: 15.99,
    category: 'bars',
    description: 'Creamy white chocolate bars embedded with freeze-dried raspberries for a perfect sweet-tart balance.',
    ingredients: ['White chocolate', 'Freeze-dried raspberries', 'Sugar', 'Cocoa butter', 'Milk powder'],
    nutritionalInfo: { calories: 110, fat: 7, sugar: 12, protein: 2 },
    images: [
      'https://images.pexels.com/photos/3992140/pexels-photo-3992140.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.4,
    reviewCount: 67,
    inStock: true,
    featured: false,
    popularity: 73
  },
  {
    id: '4',
    name: 'Artisan Chocolate Gift Box',
    price: 49.99,
    originalPrice: 59.99,
    category: 'gift-sets',
    description: 'An elegant gift box featuring our finest selection of artisan chocolates, perfect for special occasions.',
    ingredients: ['Assorted premium chocolates', 'Various fillings', 'Natural flavors'],
    nutritionalInfo: { calories: 150, fat: 10, sugar: 15, protein: 3 },
    images: [
      'https://images.pexels.com/photos/3992139/pexels-photo-3992139.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.9,
    reviewCount: 156,
    inStock: true,
    featured: true,
    popularity: 98
  },
  {
    id: '5',
    name: 'Heart-Shaped Chocolate',
    price: 21.99,
    category: 'bonbons',
    description: 'Luxurious bonbons filled with silky Heart-Shaped Chocolate in premium dark chocolate.',
    ingredients: ['Dark chocolate', 'Caramel', 'Heavy cream', 'Butter'],
    nutritionalInfo: { calories: 105, fat: 7, sugar: 9, protein: 1.8 },
    images: [
      'https://as1.ftcdn.net/v2/jpg/08/94/08/66/1000_F_894086638_gm7SO0RLk8f2miuzYhyRs1mFPxTRJy8O.jpg'
    ],
    rating: 4.7,
    reviewCount: 92,
    inStock: true,
    featured: false,
    popularity: 84
  },
  {
    id: '6',
    name: 'White Chocolate Squares Shattering',
    price: 19.99,
    category: 'bars',
    description: 'Rich White chocolate squares infused with premium espresso, perfect for coffee lovers.',
    ingredients: ['Dark chocolate (85% cocoa)', 'Espresso', 'Sugar', 'Natural coffee flavor'],
    nutritionalInfo: { calories: 115, fat: 8, sugar: 7, protein: 2.5 },
    images: [
      'https://as2.ftcdn.net/v2/jpg/13/26/78/69/1000_F_1326786937_Fdp1WA2yoRWaTctnUfsNezAL6ZCsxIBT.jpg'
    ],
    rating: 4.5,
    reviewCount: 78,
    inStock: false,
    featured: false,
    popularity: 76
  }
];

export const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'truffles', name: 'Truffles' },
  { id: 'pralines', name: 'Pralines' },
  { id: 'bars', name: 'Chocolate Bars' },
  { id: 'bonbons', name: 'Bonbons' },
  { id: 'gift-sets', name: 'Gift Sets' }
];