import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder
dotenv.config({ path: path.resolve(__dirname, '.env') });
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import skuRoutes from './routes/skuRoutes.js';
import warehouseRoutes from './routes/warehouseRoutes.js';
import purchaseOrderRoutes from './routes/purchaseOrderRoutes.js';
import purchaseIndentRoutes from './routes/purchaseIndentRoutes.js';
import salesOrderRoutes from './routes/salesOrderRoutes.js';
import salesReturnRoutes from './routes/salesReturnRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import stockAdjustmentRoutes from './routes/stockAdjustmentRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import vendorMappingRoutes from './routes/vendorMappingRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import permissionRoutes from './routes/permissionRoutes.js';

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/skus', skuRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/purchase-indents', purchaseIndentRoutes);
app.use('/api/sales-orders', salesOrderRoutes);
app.use('/api/sales-returns', salesReturnRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/stock-adjustments', stockAdjustmentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/vendor-mappings', vendorMappingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/permissions', permissionRoutes);

// Handle production build
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  const distPath = path.resolve(__dirname, '../frontend/dist');
  app.use(express.static(distPath));

  // Any route that is not api will be redirected to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error handling middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
};

// Custom error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});