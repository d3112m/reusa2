const nextConfig = {
  // Configuração para garantir que o ficheiro da base de dados SQLite seja incluído no build da Vercel.
  // Isto é crucial para que o Prisma encontre a base de dados no ambiente de produção.
  experimental: {
    outputFileTracingIncludes: {
      '/items': ['./prisma/dev.db'],
      '/items/[id]': ['./prisma/dev.db'],
    },
  },
};

module.exports = nextConfig;