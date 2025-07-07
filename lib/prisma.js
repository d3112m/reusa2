import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import fs from 'fs';

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

// Lógica para garantir que a base de dados exista e esteja migrada em produção.
if (process.env.NODE_ENV === 'production') {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith('file:')) {
    const dbPath = dbUrl.substring(5); // Remove o prefixo "file:"
    
    // Se a base de dados não existir no local de escrita (/tmp),
    // execute `prisma migrate deploy` para criá-la e aplicar as migrações.
    if (!fs.existsSync(dbPath)) {
      console.log('Database file not found, running migrations...');
      try {
        // Usa o executável do Prisma que está nas dependências do projeto.
        const prismaPath = require.resolve('prisma');
        const prismaCliPath = prismaPath.replace('/build/index.js', '/build/index.js'); // Ajuste para encontrar o CLI
        execSync(`node ${prismaCliPath} migrate deploy`, {
          stdio: 'inherit',
        });
        console.log('Migrations applied successfully.');
      } catch (e) {
        console.error('Failed to apply migrations:', e);
        process.exit(1);
      }
    }
  }
}

export const prisma: PrismaClient =
  prismaGlobal.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma;
}

export default prisma;