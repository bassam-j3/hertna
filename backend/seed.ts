import { config } from 'dotenv';
config();
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: '0933000000@haretna.com' }, // Must use unique field for upsert
    update: {
      passwordHash: hashedPassword,
      name: 'QA Test User',
      city: 'دمشق',
      neighborhood: 'حي الروضة',
      phone: '0933000000',
      userType: 'admin'
    },
    create: {
      id: 'test-user-0933000000',
      email: '0933000000@haretna.com',
      passwordHash: hashedPassword,
      name: 'QA Test User',
      phone: '0933000000',
      city: 'دمشق',
      neighborhood: 'حي الروضة',
      lat: 33.5138,
      lng: 36.2765,
      userType: 'admin'
    },
  });
  console.log('Upserted User:', user.name);

  // Seed Posts
  const post1 = await prisma.post.upsert({
    where: { id: 'seed-post-1' },
    update: { title: 'مطلوب سلم ألمنيوم 5 درجات', description: 'أحتاج لاستعارة سلم ألمنيوم لمدة يومين لتركيب مصابيح، سأحافظ عليه.', type: 'REQUEST', category: 'أدوات منزلية', lat: 33.5150, lng: 36.2780 },
    create: {
      id: 'seed-post-1',
      title: 'مطلوب سلم ألمنيوم 5 درجات',
      description: 'أحتاج لاستعارة سلم ألمنيوم لمدة يومين لتركيب مصابيح، سأحافظ عليه.',
      category: 'أدوات منزلية',
      type: 'REQUEST',
      urgent: false,
      location: 'دمشق, حي الروضة',
      lat: 33.5150,
      lng: 36.2780,
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=300&q=80',
      userId: user.id
    }
  });

  const post2 = await prisma.post.upsert({
    where: { id: 'seed-post-2' },
    update: { title: 'مطلوب وجبة طعام لأسرة', description: 'نحتاج لمساعدة بوجبة غداء مطبوخة اليوم، جزاكم الله خيراً.', type: 'REQUEST', category: 'طلب مساعدة', lat: 33.5120, lng: 36.2740 },
    create: {
      id: 'seed-post-2',
      title: 'مطلوب وجبة طعام لأسرة',
      description: 'نحتاج لمساعدة بوجبة غداء مطبوخة اليوم، جزاكم الله خيراً.',
      category: 'طلب مساعدة',
      type: 'REQUEST',
      urgent: false,
      location: 'دمشق, حي الروضة',
      lat: 33.5120,
      lng: 36.2740,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80',
      userId: user.id
    }
  });

  const post3 = await prisma.post.upsert({
    where: { id: 'seed-post-3' },
    update: { title: 'مطلوب مياه شرب ضروري', description: 'انقطعت المياه لدينا ونحتاج إلى تعبئة غالون.', type: 'REQUEST', category: 'احتياجات عاجلة', lat: 33.5135, lng: 36.2710 },
    create: {
      id: 'seed-post-3',
      title: 'مطلوب مياه شرب ضروري',
      description: 'انقطعت المياه لدينا ونحتاج إلى تعبئة غالون.',
      category: 'احتياجات عاجلة',
      type: 'REQUEST',
      urgent: true,
      location: 'دمشق, المزة',
      lat: 33.5135,
      lng: 36.2710,
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=300&q=80',
      userId: user.id
    }
  });

  console.log('Upserted Posts (Damascus):', post1.title, post2.title, post3.title);

  // Homs Posts (34.7324, 36.7137)
  const homsPost1 = await prisma.post.upsert({
    where: { id: 'seed-post-homs-1' },
    update: { title: 'مطلوب مساعدة في نقل أثاث', description: 'أحتاج لشخص يساعدني في نقل كنبة صغيرة.', type: 'REQUEST', category: 'طلب مساعدة', lat: 34.7330, lng: 36.7140 },
    create: {
      id: 'seed-post-homs-1', title: 'مطلوب مساعدة في نقل أثاث', description: 'أحتاج لشخص يساعدني في نقل كنبة صغيرة.', category: 'طلب مساعدة', type: 'REQUEST', urgent: false, location: 'حمص, حي الإنشاءات', lat: 34.7330, lng: 36.7140, image: 'https://images.unsplash.com/photo-1549423696-2beeb21e0eb7?auto=format&fit=crop&w=300&q=80', userId: user.id
    }
  });

  const homsPost2 = await prisma.post.upsert({
    where: { id: 'seed-post-homs-2' },
    update: { title: 'عربة أطفال للإعارة', description: 'عربة أطفال بحالة جيدة لمن يحتاجها.', type: 'OFFER', category: 'مستلزمات أطفال', lat: 34.7310, lng: 36.7120 },
    create: {
      id: 'seed-post-homs-2', title: 'عربة أطفال للإعارة', description: 'عربة أطفال بحالة جيدة لمن يحتاجها.', category: 'مستلزمات أطفال', type: 'OFFER', urgent: false, location: 'حمص, الغوطة', lat: 34.7310, lng: 36.7120, image: 'https://images.unsplash.com/photo-1544621945-8b368db51f49?auto=format&fit=crop&w=300&q=80', userId: user.id
    }
  });

  // Hama Posts (35.1318, 36.7578)
  const hamaPost1 = await prisma.post.upsert({
    where: { id: 'seed-post-hama-1' },
    update: { title: 'مطلوب دواء ضغط', description: 'بحاجة ماسة لدواء ضغط غير متوفر في الصيدليات القريبة.', type: 'REQUEST', category: 'احتياجات عاجلة', lat: 35.1325, lng: 36.7580 },
    create: {
      id: 'seed-post-hama-1', title: 'مطلوب دواء ضغط', description: 'بحاجة ماسة لدواء ضغط غير متوفر في الصيدليات القريبة.', category: 'احتياجات عاجلة', type: 'REQUEST', urgent: true, location: 'حماة, حي الحاضر', lat: 35.1325, lng: 36.7580, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ad?auto=format&fit=crop&w=300&q=80', userId: user.id
    }
  });

  const hamaPost2 = await prisma.post.upsert({
    where: { id: 'seed-post-hama-2' },
    update: { title: 'كرسي متحرك للإعارة', description: 'متوفر كرسي متحرك للمرضى وكبار السن للإعارة المؤقتة.', type: 'OFFER', category: 'مطلوب للإعارة', lat: 35.1305, lng: 36.7565 },
    create: {
      id: 'seed-post-hama-2', title: 'كرسي متحرك للإعارة', description: 'متوفر كرسي متحرك للمرضى وكبار السن للإعارة المؤقتة.', category: 'مطلوب للإعارة', type: 'OFFER', urgent: false, location: 'حماة, الشريعة', lat: 35.1305, lng: 36.7565, image: 'https://images.unsplash.com/photo-1585806623696-654dbda41215?auto=format&fit=crop&w=300&q=80', userId: user.id
    }
  });

  console.log('Upserted Additional Posts for Homs and Hama.');

  // Seed Second User for Swaps
  const test2User = await prisma.user.upsert({
    where: { email: 'test2@haretna.com' },
    update: {
      passwordHash: hashedPassword,
      name: 'Secondary Test User',
      city: 'دمشق',
      neighborhood: 'حي الروضة',
      phone: '0933000001'
    },
    create: {
      id: 'test-user-0933000001',
      email: 'test2@haretna.com',
      passwordHash: hashedPassword,
      name: 'Secondary Test User',
      phone: '0933000001',
      city: 'دمشق',
      neighborhood: 'حي الروضة',
      lat: 33.5139,
      lng: 36.2766
    }
  });

  // Seed SwapItems
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);

  await prisma.swapItem.upsert({
    where: { id: 'seed-swap-1' },
    update: { status: 'pending' },
    create: {
      id: 'seed-swap-1',
      title: 'طلب استعارة سلم',
      startDate: now,
      dueDate: nextWeek,
      status: 'pending',
      actionType: 'MESSAGE',
      borrowerId: user.id,
      lenderId: test2User.id
    }
  });

  await prisma.swapItem.upsert({
    where: { id: 'seed-swap-2' },
    update: { status: 'active' },
    create: {
      id: 'seed-swap-2',
      title: 'إعارة كرسي متحرك',
      startDate: now,
      dueDate: nextWeek,
      status: 'active',
      actionType: 'MESSAGE',
      borrowerId: test2User.id,
      lenderId: user.id
    }
  });

  await prisma.swapItem.upsert({
    where: { id: 'seed-swap-3' },
    update: { status: 'completed' },
    create: {
      id: 'seed-swap-3',
      title: 'طلب تبرع طعام',
      startDate: now,
      dueDate: now,
      status: 'completed',
      actionType: 'MESSAGE',
      borrowerId: user.id,
      lenderId: test2User.id
    }
  });

  console.log('Upserted SwapItems (pending, active, completed).');

  // Admin Panel Fake Data
  const blockedUser = await prisma.user.upsert({
    where: { email: 'baduser@haretna.com' },
    update: { status: 'blocked', warnings: 3 },
    create: {
      id: 'seed-user-blocked',
      email: 'baduser@haretna.com',
      passwordHash: hashedPassword,
      name: 'مستخدم محظور (تجريبي)',
      phone: '0933999999',
      city: 'دمشق',
      neighborhood: 'الميدان',
      status: 'blocked',
      warnings: 3
    }
  });

  await prisma.supportTicket.upsert({
    where: { id: 'seed-ticket-1' },
    update: { status: 'open' },
    create: {
      id: 'seed-ticket-1',
      type: 'إبلاغ عن مستخدم',
      message: 'هذا المستخدم تأخر جداً في إرجاع السلم ولم يعد يجيب على الرسائل.',
      status: 'open',
      userId: user.id
    }
  });

  await prisma.supportTicket.upsert({
    where: { id: 'seed-ticket-2' },
    update: { status: 'resolved' },
    create: {
      id: 'seed-ticket-2',
      type: 'مشكلة تقنية',
      message: 'الخريطة لا تظهر موقعي الحالي بشكل دقيق في حي الروضة.',
      status: 'resolved',
      userId: test2User.id
    }
  });

  await prisma.communityInitiative.upsert({
    where: { id: 'seed-init-1' },
    update: { status: 'ACTIVE' },
    create: {
      id: 'seed-init-1',
      title: 'حملة تنظيف الحديقة العامة',
      description: 'ندعوكم للمشاركة في تنظيف حديقة الحي يوم الجمعة القادم.',
      category: 'CLEANUP',
      categoryLabel: 'مبادرة تنظيف',
      date: '2026-08-30',
      time: '08:00 AM',
      location: 'دمشق, الحديقة العامة',
      maxParticipants: 50,
      status: 'ACTIVE',
      organizerId: user.id
    }
  });

  console.log('Upserted Admin Panel Fake Data (Tickets, Blocked User, Initiative).');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

