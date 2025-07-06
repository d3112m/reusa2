const nextConfig = {
  // Garante que o ficheiro da base de dados seja incluído no build
  // para que possa ser copiado para /tmp em produção.
  experimental: {
    outputFileTracingIncludes: {
      '/**': ['./prisma/dev.db'],
    },
  },
};

module.exports = nextConfig;