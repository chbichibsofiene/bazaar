# Bazaar Mobile - React Native Expo App

A comprehensive e-commerce mobile application built with React Native and Expo for the Bazaar multivendor platform.

## Features

- 🔐 **OTP-based Authentication** - Secure login and signup with email OTP
- 🏠 **Home Screen** - Browse featured products with search functionality
- 📦 **Product Details** - View product information, images, sizes, and reviews
- 🛒 **Shopping Cart** - Add products, manage quantities, and checkout
- ❤️ **Wishlist** - Save favorite products for later
- 📱 **Categories** - Browse products by category
- 👤 **User Profile** - Manage account and view order history
- 📋 **Order Management** - Track orders and view order history

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)
- Backend server running on `http://localhost:5454`

## Installation

1. Navigate to the project directory:
```bash
cd bazaar-mobile
```

2. Install dependencies:
```bash
npm install
```

3. Configure the API base URL:
   - For emulator/simulator: The default `http://localhost:5454` should work
   - For physical device: Update `.env` file with your computer's local IP:
     ```
     API_BASE_URL=http://192.168.1.x:5454
     ```
     (Replace `192.168.1.x` with your actual IP address)

## Running the App

1. Start the Expo development server:
```bash
npm start
```

2. Choose your platform:
   - Press `a` for Android emulator
   - Press `i` for iOS simulator (macOS only)
   - Scan the QR code with Expo Go app on your physical device

## Project Structure

```
bazaar-mobile/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication screens
│   │   ├── login.jsx
│   │   └── signup.jsx
│   ├── (tabs)/            # Main tab navigation
│   │   ├── index.jsx      # Home
│   │   ├── categories.jsx
│   │   ├── cart.jsx
│   │   ├── wishlist.jsx
│   │   └── profile.jsx
│   ├── product/           # Product screens
│   │   └── [id].jsx       # Product details
│   └── order/             # Order screens
├── components/            # Reusable components
├── services/              # API services
│   ├── api.js
│   ├── authService.js
│   ├── productService.js
│   ├── cartService.js
│   ├── orderService.js
│   ├── wishlistService.js
│   └── reviewService.js
├── context/               # React Context
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── constants/             # Theme and constants
│   ├── colors.js
│   └── theme.js
└── utils/                 # Utility functions
```

## API Integration

The app integrates with the following backend endpoints:

- **Authentication**: `/auth/signup`, `/auth/signing`, `/auth/sent/login-signup-otp`
- **Products**: `/products`, `/products/{id}`, `/products/search`
- **Cart**: `/api/cart`, `/api/cart/add`, `/api/cart/item/{id}`
- **Orders**: `/api/orders`, `/api/orders/user`, `/api/orders/{id}/cancel`
- **Wishlist**: `/api/wishlist`, `/api/wishlist/add-product/{id}`
- **Reviews**: `/api/products/{id}/reviews`

## Testing

### Test User Credentials

You can use existing accounts from the web application:
- Email: `test10@example.com`
- Password: Not needed (OTP-based auth)

### Testing Flow

1. **Login/Signup**:
   - Enter email
   - Request OTP
   - Enter OTP received
   - Login/Signup

2. **Browse Products**:
   - View products on home screen
   - Search for products
   - Browse by category

3. **Product Details**:
   - Tap on any product
   - View images, description, price
   - Select size and quantity
   - Add to cart or wishlist

4. **Cart & Checkout**:
   - View cart items
   - Update quantities
   - Remove items
   - Proceed to checkout

5. **Profile**:
   - View user information
   - Access order history
   - Logout

## Troubleshooting

### Cannot connect to backend

- **Emulator**: Make sure backend is running on `localhost:5454`
- **Physical Device**: 
  - Ensure your phone and computer are on the same network
  - Update `.env` with your computer's IP address
  - Check firewall settings

### App crashes on startup

- Clear Expo cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Images not loading

- Check network connection
- Verify backend is serving images correctly
- Check console for CORS errors

## Built With

- **React Native** - Mobile framework
- **Expo** - Development platform
- **Expo Router** - File-based routing
- **Axios** - HTTP client
- **React Native Paper** - UI components
- **Expo Secure Store** - Secure token storage

## Future Enhancements

- [ ] Seller dashboard
- [ ] Native payment integration
- [ ] Push notifications
- [ ] Offline support
- [ ] Product reviews and ratings UI
- [ ] Order tracking with maps
- [ ] Social sharing
- [ ] Dark mode

## License

This project is part of the Bazaar e-commerce platform.
