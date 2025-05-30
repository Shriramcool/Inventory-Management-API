# Inventory-Management-API

# 📦 Inventory Management API

A production-ready backend API for managing inventory, stock levels, suppliers, and analytics. Built using **Node.js**, **Express**, and **MongoDB**, with JWT authentication and role-based access control.

---

## 🚀 Features

- 🔐 User Authentication (JWT-based)
- 🧾 Product Management (CRUD)
- 📥 Stock Management (Add, Update)
- 📊 Inventory Analytics (Stock value, reorder suggestions, top-selling)
- 📈 Sales vs Restock tracking
- 📁 File Uploads (optional)
- 🔒 Secure routes with role-based access
- 🧼 Validated and sanitized inputs
- 🧱 Modular MVC structure

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT, bcrypt
- **Validation**: express-validator
- **Dev Tools**: Nodemon, dotenv

---

## 📁 Project Structure

```plaintext
inventory-api/
│
├── controllers/                     # Handles request logic
│   ├── authController.js            # Handles user registration/login
│   ├── productController.js         # CRUD operations for products
│   ├── stockController.js           # Handles stock logic (add/view/update stock)
│   ├── stockLogController.js        # Logs for stock movements (restock/sale)
│   ├── supplierController.js        # Supplier CRUD operations
│   └── analyticsController.js       # Reports and business summaries
│
├── models/                          # Mongoose schemas/models for MongoDB
│   ├── User.js                      # User schema (roles: admin/manager/staff)
│   ├── Product.js                   # Product schema
│   ├── Stock.js                     # Stock schema
│   ├── StockLog.js                  # Stock log schema
│   └── Supplier.js                  # Supplier schema
│
├── routes/                          # Express route handlers
│   ├── auth.js                      # /api/auth routes
│   ├── products.js                  # /api/products routes
│   ├── stocks.js                    # /api/stocks routes
│   ├── stockLogs.js                 # /api/stock-logs routes
│   ├── suppliers.js                 # /api/suppliers routes
│   └── analytics.js                 # /api/analytics routes
│
├── middleware/                      # Custom middleware
│   ├── authMiddleware.js            # Verifies JWT tokens and user roles
│   └── validateRequest.js           # Input validation for requests
│
├── config/
│   └── db.js                        # MongoDB connection logic using mongoose
│
├── utils/                           # Utility/helper functions
│   └── generateToken.js             # JWT token generation using user data
│
├── uploads/                         # Uploaded CSV or asset files (e.g., bulk product upload)
│   └── sample.csv                   # Example upload file format
│
├── .env                             # Environment variables (JWT_SECRET, MONGO_URI, PORT, etc.)
├── .gitignore                       # Specifies files/folders to ignore in Git (node_modules, .env, etc.)
├── app.js                           # Entry point of the application
├── package.json                     # Project metadata and dependencies
└── README.md                        # Project documentation
```


---

## ⚙️ Installation

```bash
# Clone the repo
git clone https://github.com/Shriramcool/Inventory-Management-API.git
cd Inventory-Management-API

# Install dependencies
npm install

# Create .env file
touch .env
✏️ .env File

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=3000

▶️ Running the Server

# Run in dev mode
npm run dev

# Run in production

node app.js

🔐 Authentication Endpoints

Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login user

📦 Product Endpoints

Method	Endpoint	Description
GET	/api/products	Get all products
POST	/api/products	Create a product
PUT	/api/products/:id	Update product
DELETE	/api/products/:id	Delete product

📥 Stock Endpoints

Method	Endpoint	Description
GET	/api/stocks	Get all stock items
POST	/api/stocks	Add/Update stock

🚚 Stock Log Endpoints

Method	Endpoint	Description
GET	/api/stock-logs	Get all stock logs
POST	/api/stock-logs	Log stock movement

📊 Analytics Endpoints

Method	Endpoint	Description
GET	/api/analytics/summary	Product summary stats
GET	/api/analytics/reorder	Low stock suggestions
GET	/api/analytics/top-selling	Top 5 selling products
GET	/api/analytics/sales-vs-restocks	Monthly sales vs restocks

🧪 Testing the API

You can test using Postman or curl.



