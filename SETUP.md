# Bazaar E-Commerce Platform - Setup Guide

## 📦 What's Included

This repository contains a complete e-commerce multivendor platform with:

1. **Backend** (`e-commece-multivendor/`) - Spring Boot REST API
2. **Frontend** (`bazaar/`) - React web application
3. **Mobile App** (`bazaar-mobile/`) - React Native Expo application
4. **Database Scripts** - SQL files for initial setup

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18+ and npm
- **Java JDK** 17+
- **Maven** 3.8+
- **MySQL** 8.0+
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/chbichibsofiene/bazaar.git
cd bazaar
```

### Step 2: Database Setup

1. Create a MySQL database:

```sql
CREATE DATABASE bazaar_db;
```

2. Import the seed data:

```bash
mysql -u root -p bazaar_db < seed_data.sql
mysql -u root -p bazaar_db < create_admin_user.sql
```

### Step 3: Backend Configuration

1. Navigate to the backend directory:

```bash
cd e-commece-multivendor/src/main/resources
```

2. Copy the example configuration:

```bash
cp application.properties.example application.properties
```

3. Edit `application.properties` and configure:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/bazaar_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Email (Gmail)
spring.mail.username=your_email@gmail.com
spring.mail.password=your_gmail_app_password

# Stripe
stripe.secret.key=your_stripe_secret_key
stripe.webhook.secret=your_stripe_webhook_secret

# Gemini API (optional)
gemini.api.key=your_gemini_api_key
```

4. Start the backend:

```bash
cd ../../..  # Back to e-commece-multivendor root
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:5454`

### Step 4: Frontend Setup

1. Navigate to the frontend directory:

```bash
cd bazaar
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:5454/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```

4. Start the development server:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### Step 5: Mobile App Setup (Optional)

1. Navigate to the mobile directory:

```bash
cd bazaar-mobile
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```bash
API_BASE_URL=http://YOUR_LOCAL_IP:5454/api
STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```

4. Start the Expo development server:

```bash
npm start
```

## 🔑 Default Login Credentials

### Admin Account
- **Email**: admin@bazaar.com
- **Password**: admin123
- **Access**: Full platform administration

### Test Seller Account
- **Email**: test10@example.com
- **Password**: 12345678
- **Access**: Seller dashboard and features

## 📱 API Endpoints

The backend API runs on port **5454** by default. Key endpoints include:

- **Auth**: `/api/auth/*`
- **Products**: `/api/products/*`
- **Orders**: `/api/orders/*`
- **Cart**: `/api/cart/*`
- **Sellers**: `/api/sellers/*`
- **Admin**: `/api/admin/*`

Full API documentation is available in `api-docs.json`

## 🎨 Features

### Customer Features
✅ Product browsing and search  
✅ Shopping cart  
✅ Wishlist  
✅ Order tracking  
✅ Product reviews  
✅ Product discussions  
✅ Stripe checkout  

### Seller Features
✅ Seller dashboard  
✅ Product management  
✅ Order management  
✅ Subscription plans (Free/Basic/Premium)  
✅ Sales analytics  

### Admin Features
✅ User management  
✅ Seller approval  
✅ Product moderation  
✅ Category management  
✅ Platform analytics  

## 🔧 Configuration Details

### Gmail App Password Setup

To enable email functionality:

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password for "Mail"
4. Use this password in `application.properties`

### Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Dashboard
3. Use test keys for development (starts with `sk_test_` and `pk_test_`)
4. Configure webhook endpoint: `http://your-domain/api/payment/webhook`

### Gemini API (Optional)

The Gemini API is used for AI-powered features. Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🏗️ Project Structure

```
bazaar/
├── e-commece-multivendor/     # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/bazar/
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── model/
│   │   │   │   └── config/
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
├── bazaar/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── bazaar-mobile/              # React Native Mobile
│   ├── app/
│   ├── components/
│   ├── services/
│   └── package.json
│
├── seed_data.sql               # Database seed data
├── create_admin_user.sql       # Admin user creation
└── README.md
```

## 🐛 Troubleshooting

### Backend won't start
- Check MySQL is running
- Verify database credentials in `application.properties`
- Ensure port 5454 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 5454
- Check `VITE_API_BASE_URL` in `.env`
- Check browser console for CORS errors

### Mobile app can't connect
- Use your local IP address, not `localhost`
- Ensure backend allows connections from your IP
- Check firewall settings

## 📝 Development Tips

### Running in Production

**Backend:**
```bash
mvn clean package
java -jar target/e-commece-multivendor-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Database Migrations

The application uses Hibernate with `ddl-auto=update`. For production, consider:
- Using Flyway or Liquibase for migrations
- Setting `ddl-auto=validate` or `ddl-auto=none`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Support

For issues and questions:
- Open an issue on GitHub
- Contact: scsofien@gmail.com

---

**Happy Coding! 🚀**
