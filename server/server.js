require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const db = require('./config/db'); // Placeholder for DB connection module

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes'); // New
const orderRoutes = require('./routes/orderRoutes');   // New

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Database connection (example)
/*
db.connect((err) => {
  if (err) {
    console.error('Error connecting to DB:', err);
    // Potentially exit the process or implement retry logic
    process.exit(1);
  }
  console.log('MySQL Connected...');
});
*/

// Routes
app.get('/', (req, res) => {
  res.send('Admin Panel API Running');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes); // New
app.use('/api/v1/orders', orderRoutes);     // New

// Global error handler (very basic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something broke!', error: err.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
