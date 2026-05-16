import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
  supabase: {
    url: process.env.SUPABASE_URL || '',
    jwtSecret: process.env.SUPABASE_JWT_SECRET || '',
  },
};

// Validate critical config
if (isNaN(config.port) || config.port < 1 || config.port > 65535) {
  console.warn(`[Config] WARNING: Invalid PORT (${process.env.PORT}) provided, falling back to 4000`);
  config.port = 4000;
}
