const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');
const supplierRoutes = require('./routes/suppliers');

// Initialize DB connections
const connectMongo = require('./config/mongo');
const pool = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => res.json({ ServerStatus: 'ok' }));

// Routes
app.use('/users', authRoutes);          // POST /users/register, POST /users/login
app.use('/me', userRoutes);             // GET /me, GET /me/ (admin)
app.use('/transactions', transactionRoutes); // GET/POST /transactions
app.use('/suppliers', supplierRoutes);  // GET /suppliers, PUT /suppliers/:id

const start = async () => {
  try {
    await connectMongo();
    console.log('✅ MongoDB connected');

    // BUG FIXED: Was logging 'MySQL connected' inside connectMongo callback (misleading)
    // Verify MySQL pool is accessible
    await pool.query('SELECT 1');
    console.log('✅ MySQL connected');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Startup error:', err.message);
    process.exit(1);
  }
};

start();
