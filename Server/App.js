// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./Config/db');

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON requests

// Routes
app.use('/api/v1/auth', require('./routes/userRoutes'));

// Global error handler to ensure JSON responses
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));