import { Socket } from 'socket.io';

export const authMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token;

  // Preparation for Supabase JWT validation
  if (!token) {
    console.warn(`[Auth] Connection attempt without token: ${socket.id}`);
    // For now we allow but warn, in production we would: return next(new Error('Authentication error'));
    return next();
  }

  try {
    // Future: verify JWT using jsonwebtoken and SUPABASE_JWT_SECRET
    // const payload = jwt.verify(token, process.env.SUPABASE_JWT_SECRET!);
    // socket.data.user = payload;
    
    console.log(`[Auth] User authenticated on socket: ${socket.id}`);
    next();
  } catch (err) {
    console.error(`[Auth] Invalid token on socket: ${socket.id}`);
    next(new Error('Authentication error'));
  }
};
