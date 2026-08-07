const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const setupSockets = require('./sockets/socketHandler');

const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const workerRoutes = require('./routes/workerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.set('io', io);
setupSockets(io);

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/worker', workerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'JanSetu API is running smoothly 🚀' });
});

// Production Static Asset Serving
if (process.env.NODE_ENV === 'production') {
  const fs = require('fs');
  const distIndexPath = path.resolve(__dirname, '../../frontend/dist/index.html');
  if (fs.existsSync(distIndexPath)) {
    app.use(express.static(path.join(__dirname, '../../frontend/dist')));
    app.get('*', (req, res) => {
      res.sendFile(distIndexPath);
    });
  } else {
    app.get('/', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'JanSetu Civic Resolution API Service is running Live 🚀',
        healthCheck: '/api/health',
      });
    });
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 JanSetu Server listening on port ${PORT}`);
});
