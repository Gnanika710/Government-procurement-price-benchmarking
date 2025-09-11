import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import product from './routes/product.js';
import shop from './routes/shop.js';
import scraperRouter from './routes/scraperRouter.js';
import mlRoutes from './routes/ml.route.js';  // 🆕 Add ML routes import
import cookieParser from 'cookie-parser';
import path from 'path';
import fileUpload from 'express-fileupload';
import { fileURLToPath } from 'url';
import cors from 'cors';

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.log('❌ MongoDB connection error:', err);
  });

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Authorization','Content-Type'],
  credentials: true,
}));

app.use(fileUpload({
  createParentPath: true
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '/client/dist')));

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/shop", shop);
app.use("/api/product", product);
app.use("/api/scrapedata", scraperRouter);
app.use('/api/ml', mlRoutes);  // 🆕 ML routes for price prediction, anomaly detection, vendor scoring

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Government Procurement Price Benchmarking API is running',
    timestamp: new Date().toISOString(),
    ml_enabled: true
  });
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Government Procurement Price Benchmarking API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      ml: '/api/ml/*',
      users: '/api/user/*',
      auth: '/api/auth/*',
      shops: '/api/shop/*',
      products: '/api/product/*',
      scraping: '/api/scrapedata/*'
    }
  });
});

// Catch-all handler for React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.error('Server Error:', message);
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('🚀 Government Procurement Price Benchmarking Server is running!');
  console.log(`📊 Backend API: http://localhost:${PORT}`);
  console.log(`🤖 ML Endpoints: http://localhost:${PORT}/api/ml/`);
  console.log('✅ Ready for government procurement analysis');
});