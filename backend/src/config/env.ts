import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || 'BetMines',
  appDomain: process.env.APP_DOMAIN || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || '',
  redisUrl: process.env.REDIS_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_betmines_jwt_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  defaultAffiliateTag: process.env.DEFAULT_AFFILIATE_TAG || 'betmines_official'
};
