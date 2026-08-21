import { config } from 'dotenv';
config();
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Wiping DB...');
  await prisma.swapItem.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.supportTicket.deleteMany({});
  await prisma.initiativeParticipant.deleteMany({});
  await prisma.communityInitiative.deleteMany({});
  await prisma.rating.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.itemAlert.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('DB wiped cleanly.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
