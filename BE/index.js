import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import product from './routes/product.js';
import shop from './routes/shop.js';
import scraperRouter from './routes/scraperRouter.js';
import mlRoutes from './routes/ml.route.js';  // ✅ ML routes import
import cookieParser from 'cookie-parser';
import path from 'path';
import fileUpload from 'express-fileupload';
import { fileURLToPath } from 'url';
import cors from 'cors';

dotenv.config();

// ✅ FIXED: Change MONGO to MONGO_URI for consistency
mongoose
  .connect(process.env.MONGO_URI || process.env.MONGO)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.log('❌ MongoDB connection error:', err);
  });

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ FIXED: Updated CORS configuration for better frontend compatibility
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type', 'Accept'],
  credentials: true,
}));

// ✅ FIXED: Middleware order - CORS should come first
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API Routes (in logical order)
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/shop", shop);
app.use("/api/product", product);
app.use("/api/scrapedata", scraperRouter);
app.use('/api/ml', mlRoutes);  // ✅ ML routes for price prediction, anomaly detection, vendor scoring

// ✅ ENHANCED: Better health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Government Procurement Price Benchmarking API is running',
    timestamp: new Date().toISOString(),
    ml_enabled: true,
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    version: '1.0.0'
  });
});

// ✅ ENHANCED: Root API endpoint with better documentation
app.get('/api', (req, res) => {
  res.json({
    message: 'Government Procurement Price Benchmarking API',
    version: '1.0.0',
    status: 'Active',
    endpoints: {
      health: '/api/health - System health check',
      ml: {
        'price-prediction': '/api/ml/predict-price - AI price prediction',
        'anomaly-detection': '/api/ml/detect-anomalies - Price anomaly detection',
        'vendor-scoring': '/api/ml/score-vendor - Vendor assessment',
        'model-status': '/api/ml/model-status - ML system status'
      },
      users: '/api/user/* - User management',
      auth: '/api/auth/* - Authentication',
      shops: '/api/shop/* - Shop management',
      products: '/api/product/* - Product management',
      scraping: '/api/scrapedata/* - Data scraping services'
    },
    documentation: 'Government procurement price benchmarking and ML analysis'
  });
});

// ✅ FIXED: Better 404 handling for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`,
    available_endpoints: ['/api/health', '/api/ml/model-status', '/api/auth/*', '/api/user/*']
  });
});

// ✅ FIXED: Remove or update the React static file serving (since you don't have client/dist)
// Only serve static React files if they exist
const clientDistPath = path.join(__dirname, 'client', 'dist', 'index.html');
try {
  // Check if React build exists
  if (require('fs').existsSync(clientDistPath)) {
    app.use(express.static(path.join(__dirname, '/client/dist')));
    app.get('*', (req, res) => {
      res.sendFile(clientDistPath);
    });
  } else {
    // Fallback for non-API routes when React build doesn't exist
    app.get('*', (req, res) => {
      res.status(200).json({
        message: 'Government Procurement Price Benchmarking Backend',
        note: 'Frontend is running separately on http://localhost:5173',
        api_base: '/api'
      });
    });
  }
} catch (error) {
  console.log('📝 Note: React build not found, serving API only');
  app.get('*', (req, res) => {
    res.status(200).json({
      message: 'Government Procurement Price Benchmarking Backend API',
      frontend: 'Running separately on http://localhost:5173',
      api_documentation: '/api'
    });
  });
}

// ✅ ENHANCED: Better error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  console.error('🚨 Server Error:', {
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  return res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : message,
    statusCode,
    timestamp: new Date().toISOString()
  });
});

// ✅ Start server with better logging
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log('\n🚀 Government Procurement Price Benchmarking Server Started!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 Backend API: http://localhost:${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 ML Endpoints: http://localhost:${PORT}/api/ml/`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api`);
  console.log(`🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Ready for government procurement analysis\n');
});

// ✅ Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

export default app;