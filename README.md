# Bazaar - E-Commerce Multivendor Platform

A comprehensive e-commerce multivendor platform with web, mobile, and backend applications.

## 🏗️ Project Structure

This monorepo contains three main applications:

```
bazaar/                    # React Web Frontend
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   └── store/           # Redux store
└── package.json

e-commece-multivendor/    # Spring Boot Backend
├── src/
│   └── main/
│       ├── java/        # Java source code
│       └── resources/   # Configuration files
└── pom.xml

bazaar-mobile/            # React Native Mobile App
├── app/                 # Expo Router pages
├── components/          # Mobile components
├── services/            # API services
└── package.json
```

## 🚀 Features

### Customer Features
- Browse products by category
- Product search and filtering
- Shopping cart management
- Wishlist functionality
- Order tracking
- Product reviews and ratings
- Product discussions
- Secure checkout with Stripe integration

### Seller Features
- Seller dashboard with analytics
- Product management (CRUD operations)
- Order management
- Subscription plans (Free, Basic, Premium)
- Sales tracking
- Inventory management

### Admin Features
- User management
- Seller approval and management
- Product moderation
- Category management
- Order oversight
- Platform analytics

## 🛠️ Technology Stack

### Frontend (Web)
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS + Custom CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Payment**: Stripe

### Mobile
- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **UI**: React Native Paper
- **State Management**: Context API
- **HTTP Client**: Axios

### Backend
- **Framework**: Spring Boot 3.x
- **Database**: MySQL
- **ORM**: Hibernate/JPA
- **Security**: Spring Security with JWT
- **Payment**: Stripe API
- **Build Tool**: Maven

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **Java**: JDK 17 or higher
- **Maven**: 3.8 or higher
- **MySQL**: 8.0 or higher
- **npm** or **yarn**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/chbichibsofiene/bazaar.git
cd bazaar
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE bazaar_db;
```

Run the seed SQL files:

```bash
mysql -u root -p bazaar_db < seed_data.sql
mysql -u root -p bazaar_db < create_admin_user.sql
```

### 3. Backend Setup

```bash
cd e-commece-multivendor

# Configure database connection
# Edit src/main/resources/application.properties
# Update the following:
# spring.datasource.url=jdbc:mysql://localhost:3306/bazaar_db
# spring.datasource.username=your_username
# spring.datasource.password=your_password

# Build and run
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup

```bash
cd bazaar

# Install dependencies
npm install

# Configure environment
# Create .env file with:
# VITE_API_BASE_URL=http://localhost:8080/api

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### 5. Mobile App Setup

```bash
cd bazaar-mobile

# Install dependencies
npm install

# Start Expo development server
npm start

# Or run on specific platform
npm run android  # For Android
npm run ios      # For iOS
npm run web      # For Web
```

## 🔑 Default Credentials

### Admin
- Email: `admin@bazaar.com`
- Password: `admin123`

### Test Seller
- Email: `test10@example.com`
- Password: `12345678`

## 📱 API Documentation

The backend API documentation is available at:
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- API Docs JSON: See `api-docs.json` in the root directory

## 🎨 Key Features Implementation

### Subscription System
Sellers can choose from three subscription tiers:
- **Free**: Basic features, 5 products max
- **Basic**: $29.99/month, 50 products, priority support
- **Premium**: $99.99/month, unlimited products, advanced analytics

### Payment Integration
- Stripe integration for secure payments
- Support for credit/debit cards
- Subscription management
- Order payment processing

### Review & Discussion System
- Customers can leave reviews with ratings
- Product discussions for Q&A
- Seller responses to reviews and discussions

## 🚀 Deployment

### Backend Deployment
```bash
cd e-commece-multivendor
mvn clean package
java -jar target/bazaar-backend.jar
```

### Frontend Deployment
```bash
cd bazaar
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Mobile Deployment
```bash
cd bazaar-mobile
# For production build
eas build --platform android
eas build --platform ios
```

## 📝 Environment Variables

### Backend (.env or application.properties)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bazaar_db
spring.datasource.username=root
spring.datasource.password=yourpassword
stripe.api.key=your_stripe_secret_key
jwt.secret=your_jwt_secret
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### Mobile (.env)
```env
API_BASE_URL=http://localhost:8080/api
STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Chbichib Sofiene**
- GitHub: [@chbichibsofiene](https://github.com/chbichibsofiene)

## 🙏 Acknowledgments

- React and Spring Boot communities
- Stripe for payment processing
- All contributors and testers

---

**Note**: Make sure to configure your Stripe API keys and database credentials before running the application.
