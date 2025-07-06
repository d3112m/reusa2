import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Lógica para copiar a base de dados para um local com permissão de escrita em produção
if (process.env.NODE_ENV === 'production') {
  const dbFile = 'dev.db';
  const bundledDbPath = path.join(process.cwd(), '.next/server/app', dbFile);
  const writableDbPath = `/tmp/${dbFile}`;

  // Se a base de dados ainda não foi copiada para /tmp, copie-a.
  if (!fs.existsSync(writableDbPath)) {
    // Tenta encontrar o ficheiro da base de dados no local esperado do build.
    // O caminho pode variar ligeiramente dependendo da versão do Next.js.
    // Este é um fallback para o caminho antigo.
    const oldBundledDbPath = path.join(process.cwd(), 'prisma', dbFile);

    let sourcePath;
    if (fs.existsSync(bundledDbPath)) {
      sourcePath = bundledDbPath;
    } else if (fs.existsSync(oldBundledDbPath)) {
      sourcePath = oldBundledDbPath;
    } else {
        // Se o ficheiro não for encontrado no build, isto pode indicar um problema no `outputFileTracingIncludes`.
        // No entanto, o `prisma migrate deploy` deve criar um ficheiro vazio em /tmp se não existir.
        console.warn(`Database file not found at ${bundledDbPath} or ${oldBundledDbPath}. Prisma will attempt to create a new one at ${writableDbPath}.`);
    }

    if(sourcePath) {
        try {
            fs.copyFileSync(sourcePath, writableDbPath);
            console.log(`Database copied from ${sourcePath} to ${writableDbPath}`);
        } catch (error) {
            console.error("Error copying database file:", error);
        }
    }
  }
}

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;