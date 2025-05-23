const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Mongoose DB
const app = express();

// Load env variables
dotenv.config();

// Security & sanitation middleware
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const { apiLimiter } = require('./middleware/rateLimiter');
const auditLogger = require('./middleware/auditLogger');

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const stockRoutes = require('./routes/stockRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const movementRoutes = require('./routes/movementRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const csvRoutes = require('./routes/csvRoutes');

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use('/api/', apiLimiter);
app.use(['/api/products', '/api/stock', '/api/suppliers'], auditLogger);

// Route setup
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/movements', movementRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/csv', csvRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Inventory Management API is running.');
});

const PORT = process.env.PORT || 3000;

// Connect DB and start server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
