import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Seeding database...');

  // Hash passwords
  const hashedPassword = await bcrypt.hash('secret123', 12);

  // Create test admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true,
      isActive: true
    }
  });

  // Create test regular user
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'USER',
      isVerified: true,
      isActive: true
    }
  });

  // Create test unverified user
  const unverifiedUser = await prisma.user.upsert({
    where: { email: 'unverified@test.com' },
    update: {},
    create: {
      email: 'unverified@test.com',
      password: hashedPassword,
      firstName: 'Unverified',
      lastName: 'User',
      role: 'USER',
      isVerified: false,
      isActive: true
    }
  });

  // Create library categories
  const categories = await Promise.all([
    prisma.libraryCategory.upsert({
      where: { name: 'Fantasy' },
      update: {},
      create: {
        name: 'Fantasy',
        description: 'Livres de fantasy et de magie',
        color: '#8B5CF6'
      }
    }),
    prisma.libraryCategory.upsert({
      where: { name: 'Thriller' },
      update: {},
      create: {
        name: 'Thriller',
        description: 'Romans à suspense et thrillers',
        color: '#EF4444'
      }
    }),
    prisma.libraryCategory.upsert({
      where: { name: 'Science-Fiction' },
      update: {},
      create: {
        name: 'Science-Fiction',
        description: 'Science-fiction et futurisme',
        color: '#06B6D4'
      }
    }),
    prisma.libraryCategory.upsert({
      where: { name: 'Romance' },
      update: {},
      create: {
        name: 'Romance',
        description: 'Romans d\'amour et romance',
        color: '#F59E0B'
      }
    }),
    prisma.libraryCategory.upsert({
      where: { name: 'Développement Personnel' },
      update: {},
      create: {
        name: 'Développement Personnel',
        description: 'Livres de développement personnel et motivation',
        color: '#10B981'
      }
    }),
    prisma.libraryCategory.upsert({
      where: { name: 'Histoire' },
      update: {},
      create: {
        name: 'Histoire',
        description: 'Livres d\'histoire et biographies',
        color: '#92400E'
      }
    })
  ]);

  console.log('📚 Categories created:', categories.length);

  console.log('✅ Données de seeding créées:');
  console.log('📧 Utilisateur Admin:', adminUser.email);
  console.log('📧 Utilisateur Régulier:', regularUser.email);
  console.log('📧 Utilisateur Non Vérifié:', unverifiedUser.email);
  console.log('🔑 Mot de passe pour tous les utilisateurs de test: secret123');
  console.log('📚 Catégories:', categories.length);
}

main()
  .catch((e) => {
    console.error('❌ Échec du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });