# ChocoDlight - Premium Chocolate E-commerce Platform 🍫

A modern, full-stack e-commerce application for premium chocolate shopping built with React, TypeScript, Node.js, Express, and MongoDB. Features a beautiful, responsive design with comprehensive shopping cart, user authentication, and admin management capabilities.

![ChocoDlight Banner](https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&cs=tinysrgb&w=1200)

## 🌟 Live Demo

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

## ✨ Key Features

### 🛍️ **Customer Experience**
- **Beautiful Product Catalog**: Browse premium chocolates with advanced filtering and search
- **Smart Shopping Cart**: Persistent cart with real-time updates and optimistic UI
- **Wishlist/Favorites**: Save favorite products for later purchase
- **Secure Checkout**: Multi-step checkout with form validation and error handling
- **Order Tracking**: Complete order history and status tracking
- **User Profiles**: Manage personal information and shipping addresses
- **Responsive Design**: Optimized for all devices from mobile to desktop

### 🔐 **Authentication & Security**
- **JWT Authentication**: Secure token-based authentication
- **Password Reset**: OTP-based password recovery via email
- **Role-based Access**: Customer and admin role management
- **Session Management**: Automatic token validation and refresh

### 👨‍💼 **Admin Dashboard**
- **Product Management**: Add, edit, delete products with inventory tracking
- **Order Management**: View and update order status, handle cancellations
- **Customer Management**: View customer profiles and order history
- **Analytics Dashboard**: Sales statistics and business insights
- **Inventory Control**: Stock level monitoring and management

### 🎨 **User Experience Enhancements**
- **Loading States**: Smooth loading indicators throughout the app
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Notifications**: Toast notifications for user actions
- **Confirmation Dialogs**: User-friendly confirmation for destructive actions
- **Optimistic Updates**: Immediate UI feedback for better perceived performance

## 🚀 Technology Stack

### **Frontend**
- **React 18** with TypeScript for type-safe development
- **Tailwind CSS** for modern, responsive styling
- **Lucide React** for beautiful, consistent icons
- **Vite** for fast development and optimized builds
- **Context API** for state management

### **Backend**
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Nodemailer** for email functionality
- **CORS** for cross-origin resource sharing

### **Development Tools**
- **ESLint** for code quality
- **TypeScript** for type safety
- **Concurrently** for running multiple processes
- **Nodemon** for development auto-restart

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** for version control
- **Modern web browser**

## 🛠️ Installation & Setup

### 1. **Clone Repository**
```bash
git clone https://github.com/Abhi76076/ChocoDlight.git
cd ChocoDlight
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Environment Configuration**

Create a `.env` file in the root directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/chocolate-shop
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/chocolate-shop

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_PORT=587

# Frontend Configuration
VITE_API_URL=http://localhost:5000/api

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 4. **Database Setup**

#### **Option A: Local MongoDB**
1. Install MongoDB on your system
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

#### **Option B: MongoDB Atlas (Recommended)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and update `MONGODB_URI` in `.env`
4. Whitelist your IP address in Atlas dashboard

### 5. **Email Configuration (Optional)**

For password reset functionality with Gmail:

1. Enable 2-factor authentication on your Google account
2. Generate App Password in Google Account settings
3. Use the App Password as `EMAIL_PASS` in `.env`

### 6. **Start the Application**

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run server:dev  # Backend only
npm run client      # Frontend only
```

### 7. **Access the Application**

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

## 👥 User Roles & Features

### 🛍️ **Customer Features**
- Browse products with advanced filtering (category, price, rating)
- Search products by name and description
- Add items to cart with quantity selection
- Manage favorites/wishlist
- Secure multi-step checkout process
- View order history and track deliveries
- Update profile and shipping addresses
- Cancel orders (within time limit)
- Leave product reviews and ratings

### 🔧 **Admin Features**
- **Dashboard Overview**: Sales statistics, order counts, customer metrics
- **Product Management**: 
  - Add new products with images, descriptions, and nutritional info
  - Edit existing products and manage inventory
  - Delete products and handle stock levels
- **Order Management**:
  - View all orders with status filtering
  - Update order status (pending → processing → shipped → delivered)
  - Handle order cancellations and refunds
- **Customer Management**:
  - View customer profiles and order history
  - Manage customer accounts

### 🔐 **Creating Admin User**

1. Register as a normal user through the website
2. Connect to your MongoDB database
3. Update the user role to admin:
   ```javascript
   // Using MongoDB Compass or CLI
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```
4. Refresh the page to access admin features

## 🗂️ Project Structure

```
ChocoDlight/
├── server/                   # Backend application
│   ├── config/
│   │   └── database.js      # MongoDB connection
│   ├── middleware/
│   │   └── auth.js          # Authentication middleware
│   ├── models/              # Mongoose models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   ├── Favorite.js
│   │   └── Review.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── cart.js
│   │   ├── favorites.js
│   │   └── admin.js
│   ├── utils/
│   │   └── email.js         # Email utilities
│   └── server.js            # Express server setup
├── src/                     # Frontend application
│   ├── components/          # Reusable React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── Cart.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ConfirmDialog.tsx
│   ├── contexts/            # React context providers
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx
│   │   ├── ShopPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── AdminDashboard.tsx
│   ├── services/           # API service layer
│   │   └── api.js
│   ├── types/              # TypeScript definitions
│   │   └── index.ts
│   └── data/               # Static data
│       └── products.ts
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
└── README.md              # Project documentation
```

## 🔌 API Documentation

### **Authentication Endpoints**
```
POST /api/auth/register          # User registration
POST /api/auth/login             # User login
POST /api/auth/forgot-password   # Request password reset OTP
POST /api/auth/reset-password    # Reset password with OTP
GET  /api/auth/me               # Get current user info
PUT  /api/auth/profile          # Update user profile
```

### **Product Endpoints**
```
GET    /api/products            # Get all products
GET    /api/products/:id        # Get single product
POST   /api/products            # Create product (admin only)
PUT    /api/products/:id        # Update product (admin only)
DELETE /api/products/:id        # Delete product (admin only)
```

### **Cart Endpoints**
```
GET    /api/cart                # Get user's cart
POST   /api/cart/add            # Add item to cart
PUT    /api/cart/update         # Update cart item quantity
DELETE /api/cart/remove/:id     # Remove item from cart
DELETE /api/cart/clear          # Clear entire cart
```

### **Order Endpoints**
```
POST   /api/orders              # Create new order
GET    /api/orders/my-orders    # Get user's orders
PATCH  /api/orders/:id/cancel   # Cancel order
GET    /api/orders/admin/all    # Get all orders (admin)
PATCH  /api/orders/admin/:id/status # Update order status (admin)
```

### **Favorites Endpoints**
```
GET    /api/favorites           # Get user's favorites
POST   /api/favorites/add       # Add to favorites
DELETE /api/favorites/remove/:id # Remove from favorites
```

## 🎨 Available Scripts

```bash
# Development
npm run dev          # Start both frontend and backend
npm run client       # Start frontend only (Vite)
npm run server       # Start backend only (production)
npm run server:dev   # Start backend with nodemon (development)

# Production
npm run build        # Build frontend for production
npm run preview      # Preview production build
npm start           # Start development servers

# Code Quality
npm run lint         # Run ESLint for code quality
```

## 🔒 Security Features

- **Password Security**: Bcrypt hashing with 12 salt rounds
- **JWT Authentication**: Secure tokens with 7-day expiration
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for specific frontend domain
- **Role-based Access**: Protected admin routes and functionality
- **Email Verification**: OTP-based password reset system
- **Error Boundaries**: Graceful error handling throughout the app

## 🐛 Troubleshooting

### **Common Issues & Solutions**

#### **1. "Failed to fetch" error**
- Ensure backend server is running on port 5000
- Check MongoDB connection status
- Verify `.env` configuration
- Check browser console for CORS errors

#### **2. MongoDB connection error**
- **Local MongoDB**: Ensure MongoDB service is running
- **MongoDB Atlas**: Check connection string and network access
- Verify database name in connection string
- Check firewall settings

#### **3. Cart items not persisting**
- Check user authentication status
- Verify MongoDB connection
- Clear browser cache and cookies
- Check browser console for errors

#### **4. Email OTP not working**
- Verify email credentials in `.env`
- For Gmail: Use App Password, not regular password
- Check spam/junk folder for OTP emails
- Ensure 2FA is enabled for Gmail

#### **5. Build errors**
- Delete `node_modules` and run `npm install`
- Clear npm cache: `npm cache clean --force`
- Check Node.js version compatibility

### **Development Tips**

- **Browser DevTools**: Use Network tab to monitor API calls
- **MongoDB Compass**: Visual tool for database inspection
- **Postman**: Test API endpoints independently
- **Console Logging**: Check both browser and server console logs

## 🚀 Deployment

### **Frontend Deployment (Netlify/Vercel)**
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables
4. Set up redirects for SPA routing

### **Backend Deployment (Railway/Render)**
1. Set up environment variables
2. Configure MongoDB Atlas connection
3. Update CORS settings for production domain
4. Deploy server code

### **Environment Variables for Production**
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### **Contribution Guidelines**
- Follow existing code style and conventions
- Add TypeScript types for new features
- Test your changes thoroughly
- Update documentation if needed
- Ensure all linting passes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Contact

For support, questions, or feature requests:

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/ChocoDlight/issues)
- **Email**: support@ChocoDlight.com
- **Documentation**: Check this README and inline code comments

## 🙏 Acknowledgments

- **Pexels**: For beautiful chocolate product images
- **React Team**: For the amazing React framework
- **MongoDB**: For the flexible NoSQL database
- **Tailwind CSS**: For the utility-first CSS framework
- **Lucide**: For the beautiful icon library
- **TypeScript**: For type-safe development

## 📈 Roadmap

### **Upcoming Features**
- [ ] Real-time order notifications
- [ ] Advanced product recommendations
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Advanced analytics dashboard
- [ ] Customer loyalty program
- [ ] Bulk order management
- [ ] Product reviews and ratings system
- [ ] Advanced search with filters

---

**Made with ❤️ for chocolate lovers everywhere! 🍫✨**

*Happy coding and enjoy your premium chocolate shopping experience!*