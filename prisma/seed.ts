import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Insertar categorías
  const categories = [
    { id: 1, name_en: 'Home', name_es: 'Hogar', slug_en: 'home', slug_es: 'hogar', parent_id: null },
    { id: 2, name_en: 'Plumbing', name_es: 'Plomería', slug_en: 'plumbing', slug_es: 'plomeria', parent_id: 1 },
    { id: 3, name_en: 'Electricity', name_es: 'Electricidad', slug_en: 'electricity', slug_es: 'electricidad', parent_id: 1 },
    { id: 4, name_en: 'Gardening', name_es: 'Jardinería', slug_en: 'gardening', slug_es: 'jardineria', parent_id: null },
    { id: 5, name_en: 'Education', name_es: 'Educación', slug_en: 'education', slug_es: 'educacion', parent_id: null },
    { id: 6, name_en: 'Private Lessons', name_es: 'Clases Particulares', slug_en: 'private-lessons', slug_es: 'clases-particulares', parent_id: 5 },
    { id: 7, name_en: 'Technology', name_es: 'Tecnología', slug_en: 'technology', slug_es: 'tecnologia', parent_id: null },
    { id: 8, name_en: 'Computer Repair', name_es: 'Reparación de Computadoras', slug_en: 'computer-repair', slug_es: 'reparacion-computadoras', parent_id: 7 },
    { id: 9, name_en: 'Health', name_es: 'Salud', slug_en: 'health', slug_es: 'salud', parent_id: null },
    { id: 10, name_en: 'Wellness', name_es: 'Bienestar', slug_en: 'wellness', slug_es: 'bienestar', parent_id: 9 },
  ];

  console.log('Iniciando seed de categorías...');

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {
        name_en: category.name_en,
        name_es: category.name_es,
        slug_en: category.slug_en,
        slug_es: category.slug_es,
        parent_id: category.parent_id,
      },
      create: {
        id: category.id,
        name_en: category.name_en,
        name_es: category.name_es,
        slug_en: category.slug_en,
        slug_es: category.slug_es,
        parent_id: category.parent_id,
      },
    });
  }

  console.log('Seed de categorías completado!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
