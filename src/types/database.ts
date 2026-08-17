import type { Prisma } from '../generated/prisma/client.js';
import type { prisma } from '../lib/prisma.js';

export type DbClient = Prisma.TransactionClient | typeof prisma;
