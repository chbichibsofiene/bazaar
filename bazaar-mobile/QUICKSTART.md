# Quick Start Guide - Bazaar Mobile App

## Prerequisites Checklist

- ✅ Node.js installed (v14+)
- ✅ npm or yarn installed
- ✅ Expo CLI installed globally: `npm install -g expo-cli`
- ✅ Expo Go app on your phone (download from App Store/Play Store)
- ✅ Backend server running on port 5454

## Step-by-Step Setup

### 1. Navigate to Project
```bash
cd "c:\Users\scsof\OneDrive\Documents\e-commece multivendor\bazaar-mobile"
```

### 2. Verify Installation
All dependencies are already installed. If you need to reinstall:
```bash
npm install
```

### 3. Configure API Connection

**For Emulator/Simulator:**
- Default configuration works (`http://localhost:5454`)

**For Physical Device:**
1. Find your computer's IP address:
   - Windows: Run `ipconfig` in Command Prompt
   - Look for "IPv4 Address" (e.g., 192.168.1.5)

2. Update `.env` file:
   ```
   API_BASE_URL=http://YOUR_IP_ADDRESS:5454
   ```
   (Replace YOUR_IP_ADDRESS with your actual IP)

3. Ensure your phone and computer are on the same WiFi network

### 4. Start Backend Server

In a separate terminal, start your Spring Boot backend:
```bash
cd "c:\Users\scsof\OneDrive\Documents\e-commece multivendor\e-commece-multivendor"
mvn spring-boot:run
```

Verify backend is running at: http://localhost:5454

### 5. Start Mobile App

```bash
npm start
```

This will:
- Start the Expo development server
- Display a QR code in the terminal
- Open Expo DevTools in your browser

### 6. Run on Device

**Option A: Physical Device (Recommended for Testing)**
1. Open Expo Go app on your phone
2. Scan the QR code from the terminal
3. App will load on your device

**Option B: Android Emulator**
- Press `a` in the terminal
- Requires Android Studio with emulator setup

**Option C: iOS Simulator (macOS only)**
- Press `i` in the terminal
- Requires Xcode installed

## Testing the App

### 1. Login/Signup Flow
1. App opens to login screen
2. Enter email: `test10@example.com` (or any email)
3. Click "Send OTP"
4. Check backend console for OTP
5. Enter OTP and login

### 2. Browse Products
- View products on home screen
- Search for products
- Tap on product to view details

### 3. Add to Cart
- Select size (if available)
- Choose quantity
- Click "Add to Cart"
- Navigate to Cart tab

### 4. Checkout
- Review cart items
- Click "Proceed to Checkout"
- Fill in delivery address
- Select payment method
- Place order

### 5. View Orders
- Go to Profile tab
- Click "Order History"
- View your orders

## Troubleshooting

### Cannot Connect to Backend

**Problem:** App shows network error

**Solutions:**
1. Verify backend is running: Visit http://localhost:5454 in browser
2. Check firewall settings (allow port 5454)
3. For physical device: Update `.env` with your IP address
4. Restart Expo server: Press `r` in terminal

### App Won't Load

**Problem:** White screen or crash

**Solutions:**
1. Clear Expo cache: `npx expo start -c`
2. Reinstall dependencies:
   ```bash
   rm -rf node_modules
   npm install
   ```
3. Check Expo Go app is updated to latest version

### Images Not Loading

**Problem:** Product images show placeholder

**Solutions:**
1. Check internet connection
2. Verify backend is serving images correctly
3. Check image URLs in backend data

### OTP Not Received

**Problem:** Can't login/signup

**Solutions:**
1. Check backend console for OTP
2. Verify email service is configured in backend
3. Use any 6-digit number for testing (if backend allows)

## Development Tips

### Hot Reload
- Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
- Select "Enable Fast Refresh"
- Changes auto-reload as you edit code

### Debug Menu
- Shake device to open developer menu
- Options: Reload, Debug, Performance Monitor

### View Logs
- Terminal shows console.log output
- Use React Native Debugger for advanced debugging

## Project Structure Reference

```
bazaar-mobile/
├── app/                    # Screens
│   ├── (auth)/            # Login/Signup
│   ├── (tabs)/            # Main app tabs
│   ├── product/           # Product screens
│   └── order/             # Order screens
├── components/            # Reusable components
├── services/              # API integration
├── context/               # State management
├── constants/             # Theme & colors
└── .env                   # Configuration
```

## Available Commands

```bash
# Start development server
npm start

# Start with cache cleared
npx expo start -c

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web (experimental)
npm run web
```

## Next Steps

1. ✅ Test all features
2. ✅ Customize theme colors in `constants/colors.js`
3. ✅ Add your own product images
4. ✅ Configure real payment gateway
5. ✅ Add push notifications
6. ✅ Deploy to App Store/Play Store

## Support

For issues or questions:
1. Check the [README.md](./README.md) for detailed documentation
2. Review the [walkthrough.md](../walkthrough.md) for implementation details
3. Check Expo documentation: https://docs.expo.dev

---

**Ready to go!** Run `npm start` and start testing your mobile app! 🚀
