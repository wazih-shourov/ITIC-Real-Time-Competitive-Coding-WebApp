import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from './config';
import { registerHandlers } from './handlers';
import { authMiddleware } from './middleware/auth';

const app = express();
const port = config.port;

app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));

const httpServer = createServer(app);

// Initialize Socket.IO with CORS settings
const io = new Server(httpServer, {
  cors: {
    origin: config.clientUrl,
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Register middleware
io.use(authMiddleware);

// Basic heartbeat/health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Server time endpoint for synchronization
app.get('/time', (req, res) => {
  res.status(200).json({ timestamp: new Date().toISOString() });
});

// Realtime orchestration
io.on('connection', (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`);

  // Register modular handlers
  registerHandlers(io, socket);

  // Basic diagnostic events
  socket.on('ping', () => {
    socket.emit('pong');
  });

  socket.on('disconnect', (reason) => {
    console.log(`[Socket] User disconnected: ${socket.id} (${reason})`);
  });

  socket.on('error', (error) => {
    console.error(`[Socket] Error on socket ${socket.id}:`, error);
  });
});

const startServer = (portToTry: number) => {
  const onListening = () => {
    console.log(`[Server] Realtime server running on port ${portToTry} in ${config.nodeEnv} mode`);
    httpServer.off('error', onError);
  };

  const onError = (err: any) => {
    httpServer.off('listening', onListening);
    if (err.code === 'EADDRINUSE') {
      console.error(`[Server] Error: Port ${portToTry} is already in use.`);
      
      if (config.nodeEnv === 'development') {
        const nextPort = portToTry + 1;
        console.log(`[Server] Retrying on port ${nextPort}...`);
        startServer(nextPort);
      } else {
        console.error('[Server] Fatal: Port is already in use. Please free the port or specify a different PORT.');
        process.exit(1);
      }
    } else {
      console.error('[Server] Fatal startup error:', err);
      process.exit(1);
    }
  };

  httpServer.once('listening', onListening);
  httpServer.once('error', onError);
  httpServer.listen(portToTry);
};

startServer(port);

export { io };
