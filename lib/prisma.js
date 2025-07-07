import { PrismaClient } from '@prisma/client';

// Padrão singleton para instanciar o Prisma Client.
// Isto evita criar múltiplas conexões com a base de dados, especialmente em desenvolvimento.
const prismaGlobal = global;
const prisma = prismaGlobal.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma;
}

export default prisma;