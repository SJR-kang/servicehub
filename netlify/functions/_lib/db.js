const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

let prisma;

if (!global.__servicehubPrisma) {
  const connectionString = process.env.DATABASE_URL;
  const adapter = new PrismaPg({ connectionString });
  global.__servicehubPrisma = new PrismaClient({ adapter });
}

prisma = global.__servicehubPrisma;

module.exports = { prisma };

