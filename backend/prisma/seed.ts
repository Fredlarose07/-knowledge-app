import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Créer l'utilisateur unique pour le MVP
  const user = await prisma.user.upsert({
    where: { email: 'demo@knowledge.app' },
    update: {},
    create: {
      email: 'demo@knowledge.app',
      name: 'Demo User',
    },
  });

  console.log('✅ Seed user created:', user);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });