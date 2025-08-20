import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [
      { name_es: 'Hogar', name_en: 'Home', slug_es: 'hogar', slug_en: 'home' },
      { name_es: 'Plomería', name_en: 'Plumbing', slug_es: 'plomeria', slug_en: 'plumbing' },
      { name_es: 'Electricidad', name_en: 'Electricity', slug_es: 'electricidad', slug_en: 'electricity' },
      { name_es: 'Jardinería', name_en: 'Gardening', slug_es: 'jardineria', slug_en: 'gardening' },
      { name_es: 'Educación', name_en: 'Education', slug_es: 'educacion', slug_en: 'education' },
      { name_es: 'Clases Particulares', name_en: 'Private Lessons', slug_es: 'clases-particulares', slug_en: 'private-lessons' },
      { name_es: 'Tecnología', name_en: 'Technology', slug_es: 'tecnologia', slug_en: 'technology' },
      { name_es: 'Reparación de Computadoras', name_en: 'Computer Repair', slug_es: 'reparacion-computadoras', slug_en: 'computer-repair' },
      { name_es: 'Salud', name_en: 'Health', slug_es: 'salud', slug_en: 'health' },
      { name_es: 'Bienestar', name_en: 'Wellness', slug_es: 'bienestar', slug_en: 'wellness' },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => console.log('✅ Categorías insertadas'))
  .catch((e) => {
    console.error('❌ Error insertando categorías:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
