# 🌿 GreenBasket - Organic Grocery Store

GreenBasket is a full-stack e-commerce application designed to provide users with a seamless, intuitive, and secure platform to purchase organic groceries. Built with modern web technologies, it features a responsive user interface, JWT-based authentication, and a robust RESTful API.

## 🔗 Live Links
- **Live Demo**: [https://green-basket-ecommerce.vercel.app/](https://green-basket-ecommerce.vercel.app/)
- **Backend API**: [https://greenbasket-ecommerce.onrender.com/](https://greenbasket-ecommerce.onrender.com/)

## 🚀 Features

- **User Authentication**: Secure signup and login using JWT (JSON Web Tokens) and bcrypt password hashing.
- **Product Catalog**: Browse featured products, bestsellers, and filter by categories (Fruits, Vegetables, Dairy, Grains).
- **Search & Filtering**: Advanced search by product name, category, price limit, organic status, and sale status.
- **Shopping Cart**: Add, remove, and update quantities with real-time state management using Angular 18 Signals.
- **Order Management**: Place orders with various payment methods (COD, Card, UPI) and track order history and status.
- **Responsive Design**: A sleek, modern UI built with CSS Grid/Flexbox that works flawlessly on desktop and mobile.

## 🎥 Demo Video

Here is a quick walkthrough of the application:
<video width="100%" controls>
  <source src="./demo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## 💻 Tech Stack

### Frontend
- **Framework**: Angular 18 (Standalone Components, Signals)
- **Language**: TypeScript, HTML5, CSS3
- **Routing**: Angular Router

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript
- **Database**: MongoDB with Mongoose ODM
- **Security**: jsonwebtoken (JWT), bcryptjs

## 🏗️ Architecture & Folder Structure

The project is structured as a mono-repo separating the frontend and backend:

```
greenbasket/
├── backend/                  # Node.js + Express API
│   ├── config/               # Database configuration
│   ├── controllers/          # Business logic (Auth, Product, Order)
│   ├── middleware/           # JWT auth and Error handling
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API endpoint definitions
│   └── server.js             # Application entry point
│
├── frontend/                 # Angular 18 Web App
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # UI Components (Cart, Checkout, Home, etc.)
│   │   │   ├── models/       # TypeScript interfaces
│   │   │   ├── services/     # Angular services (API communication, State)
│   │   │   └── app.routes.ts # Frontend routing
│   │   └── styles.css        # Global CSS variables and styles
│   └── angular.json          # Angular CLI configuration
│
├── .gitignore
├── .env.example
└── README.md
```

## 🛠️ Installation Guide

### Prerequisites
- Node.js (v18+)
- Angular CLI (`npm install -g @angular/cli`)
- MongoDB (Local or Atlas URI)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your MongoDB URI and JWT Secret.
4. (Optional) Seed the database with sample products:
   ```bash
   node seed.js
   ```
5. Start the server:
   ```bash
   npm run dev
   ```
   *The backend runs on http://localhost:3000*

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   *The frontend runs on http://localhost:4200*

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & get token
- `GET /api/auth/profile` - Get current user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/bestsellers` - Get top selling products
- `GET /api/products/categories` - Get product categories
- `GET /api/products/:id` - Get a single product by ID

### Orders (Protected)
- `POST /api/orders` - Place a new order
- `GET /api/orders` - Get order history for user
- `GET /api/orders/:id` - Get specific order details

## 🔮 Future Enhancements
- Integrate a real payment gateway (Stripe / Razorpay).
- Build an Admin Dashboard for managing products and orders.
- Implement product reviews and ratings.
- Add user wishlists.

## 🎓 Learning Outcomes
Building this project demonstrated proficiency in:
- Architecting a decoupled Full-Stack application.
- Utilizing Angular 18's new Reactivity model (Signals) for state management.
- Designing a RESTful API following MVC patterns.
- Securing routes and handling authentication via JWT.
- Managing NoSQL database schemas and queries using Mongoose.
