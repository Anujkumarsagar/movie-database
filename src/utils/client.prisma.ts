import { PrismaClient } from '@prisma/client';
import { createPrismaRedisCache } from 'prisma-redis-middleware';
import { Redis } from 'ioredis';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME,
    db: Number(process.env.REDIS_DB),
    tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
});

const cacheMiddleware = createPrismaRedisCache({
    models: [
        { model: 'Movies', cacheTime: 300 }, // Cache Movies for 5 minutes
        { model: 'Genre', cacheTime: 600 },  // Cache Genre for 10 minutes
    ],
    storage: {
        type: 'redis',
        options: {
            client: redis,
            invalidation: { referencesTTL: 300 },
            log: console,
        },
    },
    onHit: (key) => console.log('Cache hit:', key),
    onMiss: (key) => console.log('Cache miss:', key),
    onError: (key) => console.error('Cache error:', key),
});

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query', 'error', 'warn'],
    });

prisma.$use(cacheMiddleware);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
