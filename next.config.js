const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/items': ['./prisma/dev.db', './prisma/schema.prisma'],
      '/items/[id]': ['./prisma/dev.db', './prisma/schema.prisma'],
    },
  },
};

module.exports = nextConfig;