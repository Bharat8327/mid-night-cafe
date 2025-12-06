import app from './app.js';
import config from './config/config.js';
import dbConnect from './config/dbConnect.js';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { Server } from 'socket.io';
import http from 'http';

app.use(cookieParser());

// Create HTTP server for Socket.IO
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.ALLOW_ORIGIN, // React app
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// 🔹 Socket.IO user mapping (supports multiple tabs)
const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('⚡ User connected:', socket.id);

  socket.on('register', (userId) => {
    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    userSockets.get(userId).add(socket.id);
    console.log(`📌 Registered user ${userId} with socket ${socket.id}`);
  });

  socket.on('disconnect', () => {
    for (const [userId, socketSet] of userSockets.entries()) {
      if (socketSet.has(socket.id)) {
        socketSet.delete(socket.id);
        if (socketSet.size === 0) userSockets.delete(userId);
        console.log(`❌ User ${userId} disconnected socket ${socket.id}`);
      }
    }
  });
});

// 🔹 Notify user utility
export const notifyUser = (userId, event, data) => {
  const socketSet = userSockets.get(userId);
  if (socketSet) {
    socketSet.forEach((socketId) => io.to(socketId).emit(event, data));
  }
};

// Swagger setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cafe API',
      version: '1.0.0',
      description: 'A simple express api',
    },
    servers: [{ url: `${process.env.ALLOW_ORIGIN}` }],
  },
  apis: ['./routes/*.js'],
};
const specs = swaggerJSDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

// Routes
app.use('/u', authRoutes);
app.use('/u', userRoutes);
app.use('/u', productRoutes);
app.use('/user/products', paymentRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).send('Sorry, the requested resource was not found.');
});

// Start server
server.listen(config.app.PORT, () => {
  console.log(`Server running on port ${config.app.PORT}`);
  dbConnect();
});
