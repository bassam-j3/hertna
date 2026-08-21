import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/haretna_db?schema=public';
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const res = await prisma.user.updateMany({
    where: { phone: '0933000000' },
    data: { userType: 'committee' }
  });
  console.log(`Successfully updated ${res.count} users to committee role.`);
  
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
