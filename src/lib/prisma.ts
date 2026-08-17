import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  max: 5,
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 10_000,
});

export const prisma = new PrismaClient({
  adapter,
  log: ['query'],
  transactionOptions: {
    maxWait: 10_000,
    timeout: 10_000,
  },
});
