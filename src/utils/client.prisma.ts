import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

// Initialize Redis client with environment variables for better configurability
export const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  username: process.env.REDIS_USERNAME || undefined,
  db: Number(process.env.REDIS_DB) || 0,
  tls: process.env.REDIS_TLS === 'true' ? {} : undefined, // Enable TLS if specified
});

// Log Redis connection status
redis.on('connect', () => {
  console.log('Connected to Redis successfully.');
});
redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Initialize Prisma Client with logging for development
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Ensure Prisma Client is a singleton in development to avoid multiple instances
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const client = globalForPrisma.prisma ?? prisma;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = client;
}

// Graceful shutdown for Prisma and Redis
process.on('SIGINT', async () => {
  console.log('Closing Prisma and Redis connections...');
  await prisma.$disconnect();
  redis.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Closing Prisma and Redis connections...');
  await prisma.$disconnect();
  redis.disconnect();
  process.exit(0);
});
