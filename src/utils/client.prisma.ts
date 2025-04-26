import { Prisma, PrismaClient } from '@prisma/client';
import { createPrismaRedisCache } from 'prisma-redis-middleware';
import Redis from 'ioredis';

// Initialize Redis client
// export const redis = new Redis({
//   host: process.env.REDIS_HOST,
//   port: Number(process.env.REDIS_PORT),
//   password: process.env.REDIS_PASSWORD,
//   username: process.env.REDIS_USERNAME,
//   db: Number(process.env.REDIS_DB),
//   tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
// });

export const redis = new Redis();
// Initialize Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// Create Prisma Redis Cache middleware
const cacheMiddleware : Prisma.Middleware = createPrismaRedisCache({
  models: [
    { model: 'Movies', excludeMethods: ['findMany'], cacheTime: 300 }, // 5 min
    { model: 'Genre', cacheTime: 600 }, // 10 min
  ],
  storage: {
    type: 'redis',
    options: {
    //@ts-ignore
      client: redis,
      invalidation: { referencesTTL: 300 },
      log: console,
    },
  },
  onHit: (key) => console.log('Cache hit:', key),
  onMiss: (key) => console.log('Cache miss:', key),
  onError: (key) => console.error('Cache error:', key),
});

// Apply the middleware
prisma.$use(cacheMiddleware);

// For development: Singleton Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const client = globalForPrisma.prisma ?? prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;
