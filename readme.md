# 🛒 Mini D-Mart

A full-stack grocery shopping and store management web application built using **React, Node.js, Express.js, and MongoDB**.

Mini D-Mart provides a simple online grocery shopping experience for customers while also providing role-based management features for Staff, Managers, and Administrators.

---

## 📌 Project Overview

Mini D-Mart is designed to simulate a real-world grocery store management system.

Customers can browse products, manage their cart, place orders, choose between home delivery and store pickup, track their orders, and request returns or exchanges.

Staff and Managers can manage store operations such as order processing, inventory, and return/exchange requests, while Administrators have complete management access including user and role management.

The project follows a simple **Client–Server Architecture** using REST APIs.

---

## ✨ Features

### 👤 User Management

* User Registration
* User Login
* JWT-based Authentication
* Secure Password Hashing using bcrypt
* User Profile
* Multiple User Roles
* Role-Based Access Control (RBAC)
* Protected APIs and Frontend Routes
* Admin User Management
* Role Management

### 🛍️ Product Management

* Product Categories
* Product Listing
* Product Details
* Product Search
* Category Filtering
* Product Pricing
* Inventory / Stock Management
* Product CRUD operations for authorized users

### 🛒 Shopping Cart

* Add products to cart
* Remove products from cart
* Quantity management
* Stock validation
* Cart total calculation
* Persistent cart handling

### 📦 Checkout & Orders

* Checkout
* Order calculation
* Stock validation
* Home Delivery
* Store Pickup
* Order creation
* Order history
* Order details
* Order status tracking
* Customer order cancellation
* Automatic stock restoration after eligible cancellation

### 🔄 Return & Exchange

* Return requests
* Exchange requests
* Return eligibility validation
* Request status tracking
* Staff/Manager/Admin review
* Approve / Reject requests
* Return completion
* Exchange processing
* Inventory updates after completed returns/exchanges

### 🏪 Store Operations

#### Staff

* Staff Dashboard
* View customer orders
* Update order status
* Process return/exchange requests
* View pickup and delivery orders

#### Manager

* Manager Dashboard
* Product management
* Inventory management
* Order management
* Return/exchange processing

#### Admin

* Admin Dashboard
* User Management
* Role Management
* Product Management
* Inventory Management
* Order Management
* Return/Exchange Management

---

---

## 🏗️ Architecture

The application follows a simple **Client–Server Architecture**.

```text
                    ┌─────────────────────┐
                    │      React          │
                    │     Frontend        │
                    └──────────┬──────────┘
                               │
                         REST API / Axios
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Express.js       │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
                         Mongoose ODM
                               │
                               ▼
                    ┌─────────────────────┐
                    │    MongoDB Atlas    │
                    │      Database       │
                    └─────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* React
* JavaScript
* React Router
* Axios
* HTML
* CSS

### Backend

* Node.js
* Express.js
* REST APIs
* JWT
* bcrypt

### Database

* MongoDB Atlas
* Mongoose

### Development Tools

* VS Code
* npm
* Git
* GitHub

---

---

## 🗄️ Database Design

The application uses MongoDB Atlas with Mongoose.

### User

Stores:

* Name
* Email
* Password
* Role

Roles:

```text
CUSTOMER
STAFF
MANAGER
ADMIN
```

### Product

Stores:

* Product name
* Description
* Price
* Category
* Stock
* Image

### Category

Stores product categories such as:

```text
Dairy
Snacks
Beverages
Groceries
```

### Cart

Stores:

* User
* Products
* Quantity

### Order

Stores:

* Customer
* Ordered products
* Price snapshot
* Quantity
* Total amount
* Fulfillment type
* Shipping address
* Order status
* Creation date

Order status:

```text
PLACED
PREPARING
READY
OUT_FOR_DELIVERY
COMPLETED
CANCELLED
```

Fulfillment types:

```text
PICKUP
DELIVERY
```

### ReturnRequest

Stores:

* User
* Order
* Request type
* Reason
* Status
* Admin/Staff comment
* Requested replacement product for exchanges

Request types:

```text
RETURN
EXCHANGE
```

---

## 🔑 Authentication & Authorization

The application uses **JWT authentication**.

### Authentication Flow

```text
User Registration
       ↓
Password hashed using bcrypt
       ↓
User stored in MongoDB
       ↓
User Login
       ↓
Credentials verified
       ↓
JWT generated
       ↓
Token used for protected API requests
```

### Authorization

After authentication, the user's role is checked before accessing protected resources.

For example:

```text
JWT Authentication
        ↓
Identify User
        ↓
Check User Role
        ↓
Allow / Deny Request
```

This prevents unauthorized users from accessing administrative operations.

---

## 🔗 Main API Groups

### Authentication

```text
/api/auth
```

Handles:

* Registration
* Login
* Profile

### Products

```text
/api/products
```

Handles:

* Product listing
* Product details
* Product creation
* Product updates
* Product deletion
* Search
* Filtering

### Categories

```text
/api/categories
```

Handles category operations.

### Cart

```text
/api/cart
```

Handles:

* Add to cart
* Update quantity
* Remove from cart
* Cart retrieval

### Orders

```text
/api/orders
```

Handles:

* Create order
* My orders
* Order details
* Order cancellation
* Order status updates
* Admin order management

### Returns

```text
/api/returns
```

Handles:

* Return requests
* Exchange requests
* Request status
* Return/exchange processing

### Users

```text
/api/users
```

Handles:

* View users
* Role management

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/mini-dmart.git
cd mini-dmart
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

### Important

Do **not** upload the actual `.env` file to GitHub.

The `.env` file should be included in `.gitignore`.

For other developers, provide an `.env.example` file containing:

```env
PORT=5000
MONGO_URI=
JWT_SECRET=
```

---

## ▶️ Running the Application

### Start Backend

From:

```text
backend/
```

run:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Start Frontend

From:

```text
frontend/
```

run:

```bash
npm start
```

The frontend runs on:

```text
http://localhost:3000
```

---

## 🧪 Testing

The main application flows can be tested using the following roles.

### Customer Testing

```text
Register/Login
      ↓
Browse Products
      ↓
Add to Cart
      ↓
Checkout
      ↓
Select Pickup/Delivery
      ↓
Place Order
      ↓
My Orders
      ↓
Order Details
      ↓
Cancel eligible order
```

### Staff Testing

An existing user can be promoted to STAFF through Admin User Management.

Test:

```text
Login
 ↓
Staff Dashboard
 ↓
Orders
 ↓
Update Order Status
 ↓
Manage Returns
```

### Manager Testing

An existing user can be promoted to MANAGER through Admin User Management.

Test:

```text
Login
 ↓
Manager Dashboard
 ↓
Products
 ↓
Inventory
 ↓
Orders
 ↓
Manage Returns
```

### Admin Testing

Test:

```text
Login
 ↓
Users
 ↓
Change User Role
 ↓
Products
 ↓
Manage Orders
 ↓
Manage Returns
```

---

## 🛡️ Security

The project implements basic application security practices including:

* JWT authentication
* bcrypt password hashing
* Protected API routes
* Role-based authorization
* Input validation
* Environment variables for secrets
* Access control for user-specific resources
* Backend-side authorization checks

Sensitive credentials such as MongoDB connection strings and JWT secrets are not included in the repository.

---

## 🚧 Known Limitations

This project is designed as an academic/practical full-stack application.

Current limitations may include:

* No real online payment gateway
* No email/SMS notification system
* No advanced analytics
* No production-grade distributed architecture
* Basic inventory management
* Basic return/exchange workflow

These features can be added in future versions.

---

## 🚀 Future Enhancements

Possible future improvements include:

* Online payment integration
* Email notifications
* Order tracking
* Advanced inventory reports
* Sales analytics
* Product reviews and ratings
* Wishlist
* Coupon/discount management
* Improved mobile responsiveness
* Automated testing
* Production monitoring

---

## 📚 Learning Outcomes

Through this project, the following concepts were implemented:

* React component development
* React routing
* REST API development
* Node.js and Express.js
* MongoDB database design
* Mongoose schemas and relationships
* JWT authentication
* bcrypt password hashing
* Role-Based Access Control
* CRUD operations
* Shopping cart logic
* Order management
* Inventory validation
* Backend validation
* Error handling
* Git and GitHub workflow

---

