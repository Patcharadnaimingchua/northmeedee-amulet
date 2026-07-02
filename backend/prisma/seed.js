const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ===========================
  // Admin
  // ===========================
  const adminPassword = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.upsert({
    where: {
      email: 'admin@northamulet.com',
    },
    update: {},
    create: {
      email: 'admin@northamulet.com',
      password: adminPassword,
      name: 'Administrator',
      role: 'ADMIN',
    },
  });

  await prisma.cart.upsert({
    where: {
      userId: admin.id,
    },
    update: {},
    create: {
      userId: admin.id,
    },
  });

  console.log('✅ Admin Ready');

  // ===========================
  // Categories
  // ===========================

  const categories = [
    {
      name: 'เหรียญพระคณาจารย์',
      slug: 'rian-khanachan',
    },
    {
      name: 'รูปถ่าย',
      slug: 'photograph',
    },
    {
      name: 'พระเนื้อผง',
      slug: 'amulet',
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
      },
      create: category,
    });
  }

  console.log('✅ Categories Ready');

  console.log('');
  console.log('===================================');
  console.log('NorthAmulet Seed Complete');
  console.log('===================================');
  console.log('');
  console.log('Admin Login');
  console.log('Email    : admin@northamulet.com');
  console.log('Password : Admin@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });