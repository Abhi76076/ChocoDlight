import { Review } from '../types';

export const reviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: 'user1',
    userName: 'Sarah Johnson',
    rating: 5,
    comment: 'Absolutely divine! The best truffles I\'ve ever tasted. The dark chocolate is rich and the flavors are perfectly balanced.',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    productId: '1',
    userId: 'user2',
    userName: 'Michael Chen',
    rating: 4,
    comment: 'Great quality chocolates. The packaging is elegant and they arrived in perfect condition.',
    createdAt: '2024-01-12'
  },
  {
    id: '3',
    productId: '2',
    userId: 'user3',
    userName: 'Emma Thompson',
    rating: 5,
    comment: 'These pralines are incredible! The heart shape makes them perfect for Valentine\'s Day.',
    createdAt: '2024-01-10'
  },
  {
    id: '4',
    productId: '4',
    userId: 'user4',
    userName: 'David Rodriguez',
    rating: 5,
    comment: 'Bought this as a gift and it was a huge hit! Beautiful presentation and amazing taste.',
    createdAt: '2024-01-08'
  }
];