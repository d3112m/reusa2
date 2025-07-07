import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import fs from 'fs';

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
        // Usa o npx para garantir que o comando prisma seja encontrado no ambiente da Vercel.
        execSync('npx prisma migrate deploy', {
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

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Em desenvolvimento, use uma instância global para evitar criar múltiplas
  // conexões com a base de dados durante o hot-reloading.
  if (!global.prisma) {
    global.prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
    });
  }
  prisma = global.prisma;
}

export default prisma;