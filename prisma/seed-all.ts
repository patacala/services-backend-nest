import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // 1. USERS
  console.log('Seeding Users...')
  const users = await Promise.all([
    prisma.user.upsert({
      where: { id: '9d8dd6cd-9344-449e-bd5c-b582bc87a6b7' },
      update: {},
      create: {
        id: '9d8dd6cd-9344-449e-bd5c-b582bc87a6b7',
        firebaseUid: 'hAAPC5J89DVtjx2FC7nBSl8YVGo2',
        phone: '+16505551235',
        role: 'seeker',
        createdAt: new Date('2025-09-26T01:20:34.839Z'),
        updatedAt: new Date('2025-09-26T01:20:34.839Z'),
      },
    }),
    prisma.user.upsert({
      where: { id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0' },
      update: {},
      create: {
        id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
        firebaseUid: 'CDFQOYIk2Yak2PxtVhvyo4rOBaU2',
        phone: '+16505551234',
        role: 'both',
        createdAt: new Date('2025-09-25T22:07:42.835Z'),
        updatedAt: new Date('2025-09-25T22:07:42.835Z'),
      },
    }),
    prisma.user.upsert({
      where: { id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd1' },
      update: {},
      create: {
        id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd1',
        firebaseUid: 'kFnsleP49ehLf1BNDhnkJT12Fjl1',
        phone: '+16505551236',
        role: 'both',
        createdAt: new Date('2025-09-25T22:07:42.835Z'),
        updatedAt: new Date('2025-09-25T22:07:42.835Z'),
      },
    }),
    prisma.user.upsert({
      where: { id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd2' },
      update: {},
      create: {
        id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd2',
        firebaseUid: 'uMFicUsJt2aAeY5phc1tDUiLIla2',
        phone: '+16505551237',
        role: 'both',
        createdAt: new Date('2025-09-25T22:07:42.835Z'),
        updatedAt: new Date('2025-09-25T22:07:42.835Z'),
      },
    }),
    prisma.user.upsert({
      where: { id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3' },
      update: {},
      create: {
        id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3',
        firebaseUid: 'AFWA74jMsQV9csweUOQ1vlvGEDH3',
        phone: '+16505551238',
        role: 'both',
        createdAt: new Date('2025-09-25T22:07:42.835Z'),
        updatedAt: new Date('2025-09-25T22:07:42.835Z'),
      },
    }),
    prisma.user.upsert({
      where: { id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd4' },
      update: {},
      create: {
        id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd4',
        firebaseUid: 'W0NiuN2mSWYKz38sC9Pco7OxUq93',
        phone: '+16505551239',
        role: 'both',
        createdAt: new Date('2025-09-25T22:07:42.835Z'),
        updatedAt: new Date('2025-09-25T22:07:42.835Z'),
      },
    }),
  ])
  console.log(`Created ${users.length} users`)

  // 2. CATEGORIES
  console.log('Seeding Categories...')
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 1n },
      update: {},
      create: {
        id: 1n,
        name_es: 'Hogar',
        name_en: 'Home',
        slug_es: 'hogar',
        slug_en: 'home',
        parent_id: null,
      },
    }),
    prisma.category.upsert({
      where: { id: 4n },
      update: {},
      create: {
        id: 4n,
        name_es: 'Jardinería',
        name_en: 'Gardening',
        slug_es: 'jardineria',
        slug_en: 'gardening',
        parent_id: null,
      },
    }),
    prisma.category.upsert({
      where: { id: 5n },
      update: {},
      create: {
        id: 5n,
        name_es: 'Educación',
        name_en: 'Education',
        slug_es: 'educacion',
        slug_en: 'education',
        parent_id: null,
      },
    }),
    prisma.category.upsert({
      where: { id: 7n },
      update: {},
      create: {
        id: 7n,
        name_es: 'Tecnología',
        name_en: 'Technology',
        slug_es: 'tecnologia',
        slug_en: 'technology',
        parent_id: null,
      },
    }),
    prisma.category.upsert({
      where: { id: 9n },
      update: {},
      create: {
        id: 9n,
        name_es: 'Salud',
        name_en: 'Health',
        slug_es: 'salud',
        slug_en: 'health',
        parent_id: null,
      },
    }),
  ])

  // Categories with parents
  await Promise.all([
    prisma.category.upsert({
      where: { id: 2n },
      update: {},
      create: {
        id: 2n,
        name_es: 'Plomería',
        name_en: 'Plumbing',
        slug_es: 'plomeria',
        slug_en: 'plumbing',
        parent_id: 1n,
      },
    }),
    prisma.category.upsert({
      where: { id: 3n },
      update: {},
      create: {
        id: 3n,
        name_es: 'Electricidad',
        name_en: 'Electricity',
        slug_es: 'electricidad',
        slug_en: 'electricity',
        parent_id: 1n,
      },
    }),
    prisma.category.upsert({
      where: { id: 6n },
      update: {},
      create: {
        id: 6n,
        name_es: 'Clases Particulares',
        name_en: 'Private Lessons',
        slug_es: 'clases-particulares',
        slug_en: 'private-lessons',
        parent_id: 5n,
      },
    }),
    prisma.category.upsert({
      where: { id: 8n },
      update: {},
      create: {
        id: 8n,
        name_es: 'Reparación Computadoras',
        name_en: 'Computer Repair',
        slug_es: 'reparacion-computadoras',
        slug_en: 'computer-repair',
        parent_id: 7n,
      },
    }),
    prisma.category.upsert({
      where: { id: 10n },
      update: {},
      create: {
        id: 10n,
        name_es: 'Bienestar',
        name_en: 'Wellness',
        slug_es: 'bienestar',
        slug_en: 'wellness',
        parent_id: 9n,
      },
    }),
  ])
  console.log(`Created 10 categories`)

  // 3. MEDIA LINKS
  console.log('Seeding MediaLinks...')
  const mediaLinks = [
    {
      media_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c75',
      owner_type: 'profile' as const,
      owner_id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd4',
    },
    {
      media_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c76',
      owner_type: 'profile' as const,
      owner_id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3',
    },
    {
      media_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c77',
      owner_type: 'profile' as const,
      owner_id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd2',
    },
    {
      media_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c78',
      owner_type: 'profile' as const,
      owner_id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd1',
    },
    {
      media_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c79',
      owner_type: 'profile' as const,
      owner_id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
    },
    {
      media_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c80',
      owner_type: 'service' as const,
      owner_id: '1c609e03-64eb-4306-948d-4d28e73ab50a',
    },
    {
      media_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c81',
      owner_type: 'service' as const,
      owner_id: '1c609e03-64eb-4306-948d-4d28e73ab50b',
    },
    {
      media_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c82',
      owner_type: 'service' as const,
      owner_id: '1c609e03-64eb-4306-948d-4d28e73ab50d',
    },
    {
      media_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c83',
      owner_type: 'service' as const,
      owner_id: '1c609e03-64eb-4306-948d-4d28e73ab50f',
    },
    {
      media_id: '873cc777-f464-4b31-8b5f-081ae63a9a51',
      owner_type: 'service' as const,
      owner_id: '66cc01a2-eef9-4eb1-a8e2-c7dfcc198e52',
    },
    {
      media_id: '87d9c3ab-0bbc-40b3-89af-4bb41cb5892b',
      owner_type: 'service' as const,
      owner_id: 'fb48b9d6-aef0-421e-bf06-3e052bdba61b',
    },
    {
      media_id: '8d3186ce-f04b-4178-ba31-f9f47b923805',
      owner_type: 'service' as const,
      owner_id: '1c609e03-64eb-4306-948d-4d28e73ab50c',
    },
    {
      media_id: 'dbbcd9e2-2bff-4a19-a4d0-ec014e602b6b',
      owner_type: 'profile' as const,
      owner_id: '9d8dd6cd-9344-449e-bd5c-b582bc87a6b7',
    },
  ]

  for (const link of mediaLinks) {
    await prisma.mediaLink.upsert({
      where: { media_id: link.media_id },
      update: {},
      create: {
        media_id: link.media_id,
        owner_type: link.owner_type,
        owner_id: link.owner_id,
        created_at: new Date('2025-09-28T00:29:35.575Z'),
      },
    })
  }
  console.log(`Created ${mediaLinks.length} media links`)

  // 4. PROFILES
  console.log('Seeding Profiles...')
  const profiles = [
    {
      user_id: '9d8dd6cd-9344-449e-bd5c-b582bc87a6b7',
      name: 'Darius Robinson',
      email: 'dariusrobinson@gmail.com',
      phone: '+16505551235',
      location_city: 'Miami',
      address: 'Mi dirección',
      media_link_id: 'dbbcd9e2-2bff-4a19-a4d0-ec014e602b6b',
    },
    {
      user_id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      name: 'Alberto Lopez',
      email: 'ajcnazar@gmail.com',
      phone: '+16505551234',
      location_city: 'Miami',
      address: 'Mi dirección',
      media_link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c79',
    },
    {
      user_id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd1',
      name: 'Juan Pérez',
      email: 'ajcnazar1@gmail.com',
      phone: '+16505551236',
      location_city: 'Miami',
      address: 'Mi dirección 1',
      media_link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c78',
    },
    {
      user_id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd2',
      name: 'María García',
      email: 'ajcnazar2@gmail.com',
      phone: '+16505551237',
      location_city: 'Miami',
      address: 'Mi dirección 2',
      media_link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c77',
    },
    {
      user_id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3',
      name: 'Ana Martínez',
      email: 'ajcnazar3@gmail.com',
      phone: '+16505551238',
      location_city: 'Miami',
      address: 'Mi dirección 3',
      media_link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c76',
    },
    {
      user_id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd4',
      name: 'Diego Rodríguez',
      email: 'ajcnazar4@gmail.com',
      phone: '+16505551239',
      location_city: 'Miami',
      address: 'Mi dirección 4',
      media_link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c75',
    },
  ]

  for (const profile of profiles) {
    await prisma.profile.upsert({
      where: { user_id: profile.user_id },
      update: {},
      create: {
        ...profile,
        created_at: new Date('2025-09-25T22:13:38.383Z'),
        updated_at: new Date('2025-09-25T22:13:38.383Z'),
      },
    })
  }
  console.log(`Created ${profiles.length} profiles`)

  // 5. USER CATEGORIES
  console.log('Seeding UserCategories...')
  const userCategories = [
    { userId: '9d8dd6cd-9344-449e-bd5c-b582bc87a6b7', categoryId: 1n },
    { userId: '9d8dd6cd-9344-449e-bd5c-b582bc87a6b7', categoryId: 2n },
    { userId: '9d8dd6cd-9344-449e-bd5c-b582bc87a6b7', categoryId: 3n },
    { userId: '9d8dd6cd-9344-449e-bd5c-b582bc87a6b7', categoryId: 4n },
    { userId: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0', categoryId: 1n },
  ]

  for (const uc of userCategories) {
    await prisma.userCategory.upsert({
      where: {
        userId_categoryId: {
          userId: uc.userId,
          categoryId: uc.categoryId,
        },
      },
      update: {},
      create: uc,
    })
  }
  console.log(`Created ${userCategories.length} user-category relations`)

  // 6. SERVICES
  console.log('📝 Seeding Services...')
  const services = [
    {
      id: '1c609e03-64eb-4306-948d-4d28e73ab50c',
      user_id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      title: 'Servicio 01',
      description: 'Descripción del servicio',
      base_price_cents: 30,
      location_city: 'Miami',
      media_link_id: '8d3186ce-f04b-4178-ba31-f9f47b923805',
    },
    {
      id: '66cc01a2-eef9-4eb1-a8e2-c7dfcc198e52',
      user_id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      title: 'Servicio 02',
      description: 'Descripción del servicio de plomería',
      base_price_cents: 33,
      location_city: 'Miami',
      media_link_id: '873cc777-f464-4b31-8b5f-081ae63a9a51',
    },
    {
      id: '1c609e03-64eb-4306-948d-4d28e73ab50a',
      user_id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd1',
      title: 'Servicio 03',
      description: 'Descripción del servicio 3',
      base_price_cents: 30,
      location_city: 'Miami',
      media_link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c80',
    },
    {
      id: '1c609e03-64eb-4306-948d-4d28e73ab50b',
      user_id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd2',
      title: 'Servicio 04',
      description: 'Descripción del servicio 4',
      base_price_cents: 30,
      location_city: 'Miami',
      media_link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c81',
    },
    {
      id: '1c609e03-64eb-4306-948d-4d28e73ab50d',
      user_id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3',
      title: 'Servicio 05',
      description: 'Descripción del servicio 5',
      base_price_cents: 30,
      location_city: 'Miami',
      media_link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c82',
    },
    {
      id: '1c609e03-64eb-4306-948d-4d28e73ab50f',
      user_id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd4',
      title: 'Servicio 06',
      description: 'Descripción del servicio 6',
      base_price_cents: 30,
      location_city: 'Miami',
      media_link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c83',
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: {},
      create: {
        ...service,
        currency: 'USD',
        status: 'published',
        created_at: new Date('2025-09-28T01:16:21.553Z'),
        updated_at: new Date('2025-09-28T01:16:21.553Z'),
      },
    })
  }
  console.log(`Created ${services.length} services`)

  // 7. SERVICE CATEGORIES
  console.log('Seeding ServiceCategories...')
  const serviceCategories = [
    { service_id: '1c609e03-64eb-4306-948d-4d28e73ab50a', category_id: 3n },
    { service_id: '1c609e03-64eb-4306-948d-4d28e73ab50b', category_id: 4n },
    { service_id: '1c609e03-64eb-4306-948d-4d28e73ab50c', category_id: 1n },
    { service_id: '1c609e03-64eb-4306-948d-4d28e73ab50d', category_id: 6n },
    { service_id: '1c609e03-64eb-4306-948d-4d28e73ab50f', category_id: 8n },
    { service_id: '66cc01a2-eef9-4eb1-a8e2-c7dfcc198e52', category_id: 2n },
  ]

  for (const sc of serviceCategories) {
    await prisma.serviceCategory.upsert({
      where: {
        service_id_category_id: {
          service_id: sc.service_id,
          category_id: sc.category_id,
        },
      },
      update: {},
      create: sc,
    })
  }
  console.log(`Created ${serviceCategories.length} service-category relations`)

  // 8. MEDIA FILES (Due to size, showing first batch - you'll need to add all)
  console.log('Seeding MediaFiles...');
  const mediaFilesData = [
    {
      id: '0259e511-2c5d-4fdb-b66c-121c62670911',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd4',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '83788e7a-eca7-497d-ff0d-f862e5d78600',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/83788e7a-eca7-497d-ff0d-f862e5d78600/public',
      type_variant: 'public',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c83',
      position: 0
    },
    {
      id: '0259e511-2c5d-4fdb-b66c-121c62670a22',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd1',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'd5dcb62a-5253-44c4-a1fe-94796a345500',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/d5dcb62a-5253-44c4-a1fe-94796a345500/public',
      type_variant: 'public',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c80',
      position: 1
    },
    {
      id: '0259e511-2c5d-4fdb-b66c-121c62670a32',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd2',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '689585c3-565c-446a-f5b6-b43afac59800',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/689585c3-565c-446a-f5b6-b43afac59800/public',
      type_variant: 'public',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c77',
      position: 0
    },
    {
      id: '0259e511-2c5d-4fdb-b66c-121c62670a33',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd1',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'f17af5cb-5046-410f-2240-09d1beae3200',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/f17af5cb-5046-410f-2240-09d1beae3200/public',
      type_variant: 'public',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c78',
      position: 0
    },
    {
      id: '0259e511-2c5d-4fdb-b66c-121c62670a37',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'b5c63199-667b-4188-2ee1-c25dd0dc8900',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/b5c63199-667b-4188-2ee1-c25dd0dc8900/public',
      type_variant: 'public',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c76',
      position: 0
    },
    {
      id: '0259e511-2c5d-4fdb-b66c-121c62670a38',
      uploaded_by: '9d8dd6cd-9344-449e-bd5c-b582bc87a6b7',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'c06f3905-1eb5-4771-aca5-213345f3e800',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/c06f3905-1eb5-4771-aca5-213345f3e800/public',
      type_variant: 'public',
      link_id: 'dbbcd9e2-2bff-4a19-a4d0-ec014e602b6b',
      position: 0
    },
    {
      id: '0259e511-2c5d-4fdb-b66c-121c62670a42',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd2',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'ea19242b-9d0c-4f01-8d6d-675501479500',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/ea19242b-9d0c-4f01-8d6d-675501479500/public',
      type_variant: 'public',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c81',
      position: 1
    },
    {
      id: '0259e511-2c5d-4fdb-b66c-121c62670a48',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd4',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '68ea96e3-b612-44e1-0b09-474d49ee7b00',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/68ea96e3-b612-44e1-0b09-474d49ee7b00/public',
      type_variant: 'public',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c75',
      position: 0
    },
    {
      id: '0259e511-2c5d-4fdb-b66c-121c62670ad3',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd1',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '06d3a0f2-0f0d-465b-96ae-d26fca47fe00',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/06d3a0f2-0f0d-465b-96ae-d26fca47fe00/public',
      type_variant: 'public',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c80',
      position: 0
    },
    {
      id: '0259e511-2c5d-4fdb-b66c-121c62670ada',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd2',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '19450618-1a95-4f74-ee13-ce4eb70ba300',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/19450618-1a95-4f74-ee13-ce4eb70ba300/public',
      type_variant: 'public',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c81',
      position: 0
    },
    {
      id: '0259e511-2c5d-4fdb-b66c-121c62670b75',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '378ef8f1-1aa2-4cb2-3431-6caaf6a69700',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/378ef8f1-1aa2-4cb2-3431-6caaf6a69700/public',
      type_variant: 'public',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c82',
      position: 1
    },
    {
      id: '0259e511-2c5d-4fdb-b66c-121c62670ed3',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '64ec8936-89b6-4fb6-529a-6b80f981f900',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/64ec8936-89b6-4fb6-529a-6b80f981f900/public',
      type_variant: 'public',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c82',
      position: 0
    },
    {
      id: '0259e511-2c5d-4fdb-b66c-121c62670f8f',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd4',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'd070a296-8915-41e9-a4b3-64e54f1d4f00',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/d070a296-8915-41e9-a4b3-64e54f1d4f00/public',
      type_variant: 'public',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c83',
      position: 1
    },
    {
      id: '16226a59-517f-4240-82bb-2dbc645c2ed8',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '36d54c48-0d42-4f54-347e-6bd41a4e1200',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/36d54c48-0d42-4f54-347e-6bd41a4e1200/cover',
      type_variant: 'cover',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c79',
      position: 0
    },
    {
      id: '210a1218-b852-4e1a-bda1-a114a57224ad',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '235886a2-fde8-4729-5265-c7f9a767ed00',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/235886a2-fde8-4729-5265-c7f9a767ed00/thumbnail',
      type_variant: 'thumbnail',
      link_id: '8d3186ce-f04b-4178-ba31-f9f47b923805',
      position: 1
    },
    {
      id: '21fa314a-b398-4787-b6a9-0e8d7f0690ac',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '235886a2-fde8-4729-5265-c7f9a767ed00',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/235886a2-fde8-4729-5265-c7f9a767ed00/public',
      type_variant: 'public',
      link_id: '8d3186ce-f04b-4178-ba31-f9f47b923805',
      position: 1
    },
    {
      id: '24cee03a-645d-4883-81ae-cd2ec672b714',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd4',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '83788e7a-eca7-497d-ff0d-f862e5d78600',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/83788e7a-eca7-497d-ff0d-f862e5d78600/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c83',
      position: 0
    },
    {
      id: '24cee03a-645d-4883-81ae-cd2ec672bb22',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd1',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'd5dcb62a-5253-44c4-a1fe-94796a345500',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/d5dcb62a-5253-44c4-a1fe-94796a345500/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c80',
      position: 1
    },
    {
      id: '24cee03a-645d-4883-81ae-cd2ec672bb72',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd2',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '689585c3-565c-446a-f5b6-b43afac59800',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/689585c3-565c-446a-f5b6-b43afac59800/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c77',
      position: 0
    },
    {
      id: '24cee03a-645d-4883-81ae-cd2ec672bb73',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd4',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '68ea96e3-b612-44e1-0b09-474d49ee7b00',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/68ea96e3-b612-44e1-0b09-474d49ee7b00/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c75',
      position: 0
    },
    {
      id: '24cee03a-645d-4883-81ae-cd2ec672bb74',
      uploaded_by: '9d8dd6cd-9344-449e-bd5c-b582bc87a6b7',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'c06f3905-1eb5-4771-aca5-213345f3e800',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/c06f3905-1eb5-4771-aca5-213345f3e800/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: 'dbbcd9e2-2bff-4a19-a4d0-ec014e602b6b',
      position: 0
    },
    {
      id: '24cee03a-645d-4883-81ae-cd2ec672bb75',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd1',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'f17af5cb-5046-410f-2240-09d1beae3200',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/f17af5cb-5046-410f-2240-09d1beae3200/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c78',
      position: 0
    },
    {
      id: '24cee03a-645d-4883-81ae-cd2ec672bb76',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'b5c63199-667b-4188-2ee1-c25dd0dc8900',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/b5c63199-667b-4188-2ee1-c25dd0dc8900/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c76',
      position: 0
    },
    {
      id: '24cee03a-645d-4883-81ae-cd2ec672bba5',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd2',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '19450618-1a95-4f74-ee13-ce4eb70ba300',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/19450618-1a95-4f74-ee13-ce4eb70ba300/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c81',
      position: 0
    },
    {
      id: '24cee03a-645d-4883-81ae-cd2ec672bba8',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '378ef8f1-1aa2-4cb2-3431-6caaf6a69700',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/378ef8f1-1aa2-4cb2-3431-6caaf6a69700/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c82',
      position: 1
    },
    {
      id: '24cee03a-645d-4883-81ae-cd2ec672bbb5',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd1',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '06d3a0f2-0f0d-465b-96ae-d26fca47fe00',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/06d3a0f2-0f0d-465b-96ae-d26fca47fe00/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c80',
      position: 0
    },
    {
      id: '24cee03a-645d-4883-81ae-cd2ec672bbe2',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd2',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'ea19242b-9d0c-4f01-8d6d-675501479500',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/ea19242b-9d0c-4f01-8d6d-675501479500/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c81',
      position: 1
    },
    {
      id: '24cee03a-645d-4883-81ae-cd2ec672bcb5',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '64ec8936-89b6-4fb6-529a-6b80f981f900',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/64ec8936-89b6-4fb6-529a-6b80f981f900/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c82',
      position: 0
    },
    {
      id: '24cee03a-645d-4883-81ae-cd2ec672bed8',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd4',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'd070a296-8915-41e9-a4b3-64e54f1d4f00',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/d070a296-8915-41e9-a4b3-64e54f1d4f00/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c83',
      position: 1
    },
    {
      id: '27ceabec-f0d5-458d-9e64-fcd726dccbba',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '0de50321-f008-4729-eb88-1db06b470e00',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/0de50321-f008-4729-eb88-1db06b470e00/thumbnail',
      type_variant: 'thumbnail',
      link_id: '87d9c3ab-0bbc-40b3-89af-4bb41cb5892b',
      position: 1
    },
    {
      id: '331d3bbf-b3e0-4e06-9fd3-c41a893f46ed',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'f12cdfe9-e6f5-486a-f4ed-0cd82722c600',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/f12cdfe9-e6f5-486a-f4ed-0cd82722c600/public',
      type_variant: 'public',
      link_id: '873cc777-f464-4b31-8b5f-081ae63a9a51',
      position: 1
    },
    {
      id: '36420e1f-fe0b-4e02-90bb-5c3795650561',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'e90143d7-4f78-4478-d488-e8ab0538d700',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/e90143d7-4f78-4478-d488-e8ab0538d700/thumbnail',
      type_variant: 'thumbnail',
      link_id: '873cc777-f464-4b31-8b5f-081ae63a9a51',
      position: 2
    },
    {
      id: '394e0c81-3b14-42ea-837a-5aa007eb95fc',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'f12cdfe9-e6f5-486a-f4ed-0cd82722c600',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/f12cdfe9-e6f5-486a-f4ed-0cd82722c600/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '873cc777-f464-4b31-8b5f-081ae63a9a51',
      position: 1
    },
    {
      id: '3a75c62b-6070-48dc-b3fb-d039deb73778',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'e90143d7-4f78-4478-d488-e8ab0538d700',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/e90143d7-4f78-4478-d488-e8ab0538d700/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '873cc777-f464-4b31-8b5f-081ae63a9a51',
      position: 2
    },
    {
      id: '3cab1a9c-244e-46bd-8b29-b577fb0d665a',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'ef53acfc-cadd-44f0-da9b-abbd68033800',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/ef53acfc-cadd-44f0-da9b-abbd68033800/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '87d9c3ab-0bbc-40b3-89af-4bb41cb5892b',
      position: 2
    },
    {
      id: '3fd748c7-dd21-4871-a82f-99e1d7c78579',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '7e88a5c1-bae2-49bc-5c61-ce6d2f3e2400',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/7e88a5c1-bae2-49bc-5c61-ce6d2f3e2400/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '8d3186ce-f04b-4178-ba31-f9f47b923805',
      position: 2
    },
    {
      id: '501055ff-5075-4861-81c6-3698f903aa32',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd4',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '83788e7a-eca7-497d-ff0d-f862e5d78600',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/83788e7a-eca7-497d-ff0d-f862e5d78600/thumbnail',
      type_variant: 'thumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c83',
      position: 0
    },
    {
      id: '501055ff-5075-4861-81c6-3698f903ace6',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd4',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'd070a296-8915-41e9-a4b3-64e54f1d4f00',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/d070a296-8915-41e9-a4b3-64e54f1d4f00/thumbnail',
      type_variant: 'thumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c83',
      position: 1
    },
    {
      id: '501055ff-5075-4861-81c6-3698f903ada1',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd2',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '19450618-1a95-4f74-ee13-ce4eb70ba300',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/19450618-1a95-4f74-ee13-ce4eb70ba300/thumbnail',
      type_variant: 'thumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c81',
      position: 0
    },
    {
      id: '501055ff-5075-4861-81c6-3698f903ada6',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd1',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '06d3a0f2-0f0d-465b-96ae-d26fca47fe00',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/06d3a0f2-0f0d-465b-96ae-d26fca47fe00/thumbnail',
      type_variant: 'thumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c80',
      position: 0
    },
    {
      id: '501055ff-5075-4861-81c6-3698f903adb1',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '378ef8f1-1aa2-4cb2-3431-6caaf6a69700',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/378ef8f1-1aa2-4cb2-3431-6caaf6a69700/thumbnail',
      type_variant: 'thumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c82',
      position: 1
    },
    {
      id: '501055ff-5075-4861-81c6-3698f903add2',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd4',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '68ea96e3-b612-44e1-0b09-474d49ee7b00',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/68ea96e3-b612-44e1-0b09-474d49ee7b00/thumbnail',
      type_variant: 'thumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c75',
      position: 0
    },
    {
      id: '501055ff-5075-4861-81c6-3698f903add6',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd1',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'f17af5cb-5046-410f-2240-09d1beae3200',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/f17af5cb-5046-410f-2240-09d1beae3200/thumbnail',
      type_variant: 'thumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c78',
      position: 0
    },
    {
      id: '501055ff-5075-4861-81c6-3698f903add7',
      uploaded_by: '9d8dd6cd-9344-449e-bd5c-b582bc87a6b7',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'c06f3905-1eb5-4771-aca5-213345f3e800',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/c06f3905-1eb5-4771-aca5-213345f3e800/thumbnail',
      type_variant: 'thumbnail',
      link_id: 'dbbcd9e2-2bff-4a19-a4d0-ec014e602b6b',
      position: 0
    },
    {
      id: '501055ff-5075-4861-81c6-3698f903add8',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd2',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '689585c3-565c-446a-f5b6-b43afac59800',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/689585c3-565c-446a-f5b6-b43afac59800/thumbnail',
      type_variant: 'thumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c77',
      position: 0
    },
    {
      id: '501055ff-5075-4861-81c6-3698f903add9',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'b5c63199-667b-4188-2ee1-c25dd0dc8900',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/b5c63199-667b-4188-2ee1-c25dd0dc8900/thumbnail',
      type_variant: 'thumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c76',
      position: 0
    },
    {
      id: '501055ff-5075-4861-81c6-3698f903adf7',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd2',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'ea19242b-9d0c-4f01-8d6d-675501479500',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/ea19242b-9d0c-4f01-8d6d-675501479500/thumbnail',
      type_variant: 'thumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c81',
      position: 1
    },
    {
      id: '501055ff-5075-4861-81c6-3698f903adf8',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd1',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'd5dcb62a-5253-44c4-a1fe-94796a345500',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/d5dcb62a-5253-44c4-a1fe-94796a345500/thumbnail',
      type_variant: 'thumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c80',
      position: 1
    },
    {
      id: '501055ff-5075-4861-81c6-3698f903aea6',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '64ec8936-89b6-4fb6-529a-6b80f981f900',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/64ec8936-89b6-4fb6-529a-6b80f981f900/thumbnail',
      type_variant: 'thumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c82',
      position: 0
    },
    {
      id: '504b5e39-66f5-4e44-b54c-5ca9be2d2a27',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '994835c9-51e3-4551-cc1c-7beb95a31900',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/994835c9-51e3-4551-cc1c-7beb95a31900/cover',
      type_variant: 'cover',
      link_id: '8d3186ce-f04b-4178-ba31-f9f47b923805',
      position: 0
    },
    {
      id: '55552b2c-d64f-4e8b-ade6-6f1b688b7d4b',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '994835c9-51e3-4551-cc1c-7beb95a31900',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/994835c9-51e3-4551-cc1c-7beb95a31900/thumbnail',
      type_variant: 'thumbnail',
      link_id: '8d3186ce-f04b-4178-ba31-f9f47b923805',
      position: 0
    },
    {
      id: '564aef1b-fe9b-46b6-987c-278f6ac25387',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'e90143d7-4f78-4478-d488-e8ab0538d700',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/e90143d7-4f78-4478-d488-e8ab0538d700/cover',
      type_variant: 'cover',
      link_id: '873cc777-f464-4b31-8b5f-081ae63a9a51',
      position: 2
    },
    {
      id: '5a0a5523-660e-469b-bf58-1389c2ee6911',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '36d54c48-0d42-4f54-347e-6bd41a4e1200',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/36d54c48-0d42-4f54-347e-6bd41a4e1200/thumbnail',
      type_variant: 'thumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c79',
      position: 0
    },
    {
      id: '62bb337e-d7f6-4849-bfb6-3dcd6e4b6958',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '70f43e34-2ed2-4e9d-e320-6b21e6e62100',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/70f43e34-2ed2-4e9d-e320-6b21e6e62100/cover',
      type_variant: 'cover',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c82',
      position: 2
    },
    {
      id: '64961c93-78be-4615-aecb-6c133d361522',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'f12cdfe9-e6f5-486a-f4ed-0cd82722c600',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/f12cdfe9-e6f5-486a-f4ed-0cd82722c600/thumbnail',
      type_variant: 'thumbnail',
      link_id: '873cc777-f464-4b31-8b5f-081ae63a9a51',
      position: 1
    },
    {
      id: '89c8ddce-79a8-4672-b49d-9d4997f06d56',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '235886a2-fde8-4729-5265-c7f9a767ed00',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/235886a2-fde8-4729-5265-c7f9a767ed00/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '8d3186ce-f04b-4178-ba31-f9f47b923805',
      position: 1
    },
    {
      id: '902be80f-f1b6-45ae-8605-27f65342f277',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd4',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'd070a296-8915-41e9-a4b3-64e54f1d4f00',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/d070a296-8915-41e9-a4b3-64e54f1d4f00/cover',
      type_variant: 'cover',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c83',
      position: 1
    },
    {
      id: '902be80f-f1b6-45ae-8605-27f65342f5c4',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd4',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '83788e7a-eca7-497d-ff0d-f862e5d78600',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/83788e7a-eca7-497d-ff0d-f862e5d78600/cover',
      type_variant: 'cover',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c83',
      position: 0
    },
    {
      id: '902be80f-f1b6-45ae-8605-27f65342f677',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '378ef8f1-1aa2-4cb2-3431-6caaf6a69700',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/378ef8f1-1aa2-4cb2-3431-6caaf6a69700/cover',
      type_variant: 'cover',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c82',
      position: 1
    },
    {
      id: '902be80f-f1b6-45ae-8605-27f65342f713',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'b5c63199-667b-4188-2ee1-c25dd0dc8900',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/b5c63199-667b-4188-2ee1-c25dd0dc8900/cover',
      type_variant: 'cover',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c76',
      position: 0
    },
    {
      id: '902be80f-f1b6-45ae-8605-27f65342f714',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd1',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'f17af5cb-5046-410f-2240-09d1beae3200',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/f17af5cb-5046-410f-2240-09d1beae3200/cover',
      type_variant: 'cover',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c78',
      position: 0
    },
    {
      id: '902be80f-f1b6-45ae-8605-27f65342f717',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd2',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '689585c3-565c-446a-f5b6-b43afac59800',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/689585c3-565c-446a-f5b6-b43afac59800/cover',
      type_variant: 'cover',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c77',
      position: 0
    },
    {
      id: '902be80f-f1b6-45ae-8605-27f65342f71b',
      uploaded_by: '9d8dd6cd-9344-449e-bd5c-b582bc87a6b7',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'c06f3905-1eb5-4771-aca5-213345f3e800',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/c06f3905-1eb5-4771-aca5-213345f3e800/cover',
      type_variant: 'cover',
      link_id: 'dbbcd9e2-2bff-4a19-a4d0-ec014e602b6b',
      position: 0
    },
    {
      id: '902be80f-f1b6-45ae-8605-27f65342f767',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd4',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '68ea96e3-b612-44e1-0b09-474d49ee7b00',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/68ea96e3-b612-44e1-0b09-474d49ee7b00/cover',
      type_variant: 'cover',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c75',
      position: 0
    },
    {
      id: '902be80f-f1b6-45ae-8605-27f65342f777',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd1',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'd5dcb62a-5253-44c4-a1fe-94796a345500',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/d5dcb62a-5253-44c4-a1fe-94796a345500/cover',
      type_variant: 'cover',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c80',
      position: 1
    },
    {
      id: '902be80f-f1b6-45ae-8605-27f65342f7a9',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd2',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'ea19242b-9d0c-4f01-8d6d-675501479500',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/ea19242b-9d0c-4f01-8d6d-675501479500/cover',
      type_variant: 'cover',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c81',
      position: 1
    },
    {
      id: '902be80f-f1b6-45ae-8605-27f65342f7c3',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd2',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '19450618-1a95-4f74-ee13-ce4eb70ba300',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/19450618-1a95-4f74-ee13-ce4eb70ba300/cover',
      type_variant: 'cover',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c81',
      position: 0
    },
    {
      id: '902be80f-f1b6-45ae-8605-27f65342f7c4',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd1',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '06d3a0f2-0f0d-465b-96ae-d26fca47fe00',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/06d3a0f2-0f0d-465b-96ae-d26fca47fe00/cover',
      type_variant: 'cover',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c80',
      position: 0
    },
    {
      id: '902be80f-f1b6-45ae-8605-27f65342f8c4',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '64ec8936-89b6-4fb6-529a-6b80f981f900',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/64ec8936-89b6-4fb6-529a-6b80f981f900/cover',
      type_variant: 'cover',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c82',
      position: 0
    },
    {
      id: '910628bd-0462-436c-8acf-e82ab59ad975',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'e90143d7-4f78-4478-d488-e8ab0538d700',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/e90143d7-4f78-4478-d488-e8ab0538d700/public',
      type_variant: 'public',
      link_id: '873cc777-f464-4b31-8b5f-081ae63a9a51',
      position: 2
    },
    {
      id: '93e9b51e-aa9b-4caf-b0a0-3396ad24f31d',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '235886a2-fde8-4729-5265-c7f9a767ed00',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/235886a2-fde8-4729-5265-c7f9a767ed00/cover',
      type_variant: 'cover',
      link_id: '8d3186ce-f04b-4178-ba31-f9f47b923805',
      position: 1
    },
    {
      id: '97b9a2fb-02c3-4c72-bfa7-eaa8c19567fd',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '7e88a5c1-bae2-49bc-5c61-ce6d2f3e2400',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/7e88a5c1-bae2-49bc-5c61-ce6d2f3e2400/cover',
      type_variant: 'cover',
      link_id: '8d3186ce-f04b-4178-ba31-f9f47b923805',
      position: 2
    },
    {
      id: '9839a7de-e808-41ae-bcff-80b9accc7cf9',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '70f43e34-2ed2-4e9d-e320-6b21e6e62100',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/70f43e34-2ed2-4e9d-e320-6b21e6e62100/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c82',
      position: 2
    },
    {
      id: '99d98e0b-35f9-42a5-8459-f274345bc56c',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '0de50321-f008-4729-eb88-1db06b470e00',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/0de50321-f008-4729-eb88-1db06b470e00/public',
      type_variant: 'public',
      link_id: '87d9c3ab-0bbc-40b3-89af-4bb41cb5892b',
      position: 1
    },
    {
      id: '9a9bd378-52ea-4f97-b95f-f36fc0ac5464',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '70f43e34-2ed2-4e9d-e320-6b21e6e62100',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/70f43e34-2ed2-4e9d-e320-6b21e6e62100/public',
      type_variant: 'public',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c82',
      position: 2
    },
    {
      id: 'a3032eb2-d544-402c-958c-d5ecb7a031df',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'ef53acfc-cadd-44f0-da9b-abbd68033800',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/ef53acfc-cadd-44f0-da9b-abbd68033800/public',
      type_variant: 'public',
      link_id: '87d9c3ab-0bbc-40b3-89af-4bb41cb5892b',
      position: 2
    },
    {
      id: 'af7bfe44-3be8-4a54-9595-969097e3ee7d',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '994835c9-51e3-4551-cc1c-7beb95a31900',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/994835c9-51e3-4551-cc1c-7beb95a31900/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '8d3186ce-f04b-4178-ba31-f9f47b923805',
      position: 0
    },
    {
      id: 'b2c8e49e-9146-4018-a620-8f74ebb06481',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'f12cdfe9-e6f5-486a-f4ed-0cd82722c600',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/f12cdfe9-e6f5-486a-f4ed-0cd82722c600/cover',
      type_variant: 'cover',
      link_id: '873cc777-f464-4b31-8b5f-081ae63a9a51',
      position: 1
    },
    {
      id: 'b5b82dc7-5a0c-4fc3-a364-f6a176078436',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '0de50321-f008-4729-eb88-1db06b470e00',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/0de50321-f008-4729-eb88-1db06b470e00/cover',
      type_variant: 'cover',
      link_id: '87d9c3ab-0bbc-40b3-89af-4bb41cb5892b',
      position: 1
    },
    {
      id: 'b757b7b9-2063-41ef-826a-1116725a7ce6',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '36d54c48-0d42-4f54-347e-6bd41a4e1200',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/36d54c48-0d42-4f54-347e-6bd41a4e1200/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c79',
      position: 0
    },
    {
      id: 'bf2501ee-2d79-44ad-8f27-e44829617a20',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'ef53acfc-cadd-44f0-da9b-abbd68033800',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/ef53acfc-cadd-44f0-da9b-abbd68033800/thumbnail',
      type_variant: 'thumbnail',
      link_id: '87d9c3ab-0bbc-40b3-89af-4bb41cb5892b',
      position: 2
    },
    {
      id: 'caa74d5c-96cf-4863-8574-3ee08889940a',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'video',
      provider: 'cloudflare_images',
      provider_ref: 'f01f2000d845335e143f7215e425b3f2',
      url: 'https://customer-kb0znv13nolt7e8g.cloudflarestream.com/f01f2000d845335e143f7215e425b3f2/manifest/video.m3u8',
      type_variant: 'public',
      link_id: '87d9c3ab-0bbc-40b3-89af-4bb41cb5892b',
      position: 0
    },
    {
      id: 'cb6867c5-525f-4e64-a977-5c3b06a2687f',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'video',
      provider: 'cloudflare_images',
      provider_ref: 'dc54304e5a92695641abff6c498ecfe1',
      url: 'https://customer-kb0znv13nolt7e8g.cloudflarestream.com/dc54304e5a92695641abff6c498ecfe1/manifest/video.m3u8',
      type_variant: 'public',
      link_id: '873cc777-f464-4b31-8b5f-081ae63a9a51',
      position: 0
    },
    {
      id: 'cdd5b71f-3c18-4ca1-a096-63e14a68da6f',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd3',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '70f43e34-2ed2-4e9d-e320-6b21e6e62100',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/70f43e34-2ed2-4e9d-e320-6b21e6e62100/thumbnail',
      type_variant: 'thumbnail',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c82',
      position: 2
    },
    {
      id: 'd2af48ec-2db1-440c-b845-03bf7ea1ff8f',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '36d54c48-0d42-4f54-347e-6bd41a4e1200',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/36d54c48-0d42-4f54-347e-6bd41a4e1200/public',
      type_variant: 'public',
      link_id: '052cfdb7-dc04-4ef0-9ec3-13e8c40f2c79',
      position: 0
    },
    {
      id: 'dcfaee06-45cd-4458-b249-d6b3c6fcebcc',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '7e88a5c1-bae2-49bc-5c61-ce6d2f3e2400',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/7e88a5c1-bae2-49bc-5c61-ce6d2f3e2400/public',
      type_variant: 'public',
      link_id: '8d3186ce-f04b-4178-ba31-f9f47b923805',
      position: 2
    },
    {
      id: 'e2bbd93c-65c4-4c40-a621-f4bd3cb74935',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '994835c9-51e3-4551-cc1c-7beb95a31900',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/994835c9-51e3-4551-cc1c-7beb95a31900/public',
      type_variant: 'public',
      link_id: '8d3186ce-f04b-4178-ba31-f9f47b923805',
      position: 0
    },
    {
      id: 'e38f1cf2-46b2-4e28-af2e-eac5f7226524',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '7e88a5c1-bae2-49bc-5c61-ce6d2f3e2400',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/7e88a5c1-bae2-49bc-5c61-ce6d2f3e2400/thumbnail',
      type_variant: 'thumbnail',
      link_id: '8d3186ce-f04b-4178-ba31-f9f47b923805',
      position: 2
    },
    {
      id: 'eb93710e-dd8b-43a1-9962-90a07534687a',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: 'ef53acfc-cadd-44f0-da9b-abbd68033800',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/ef53acfc-cadd-44f0-da9b-abbd68033800/cover',
      type_variant: 'cover',
      link_id: '87d9c3ab-0bbc-40b3-89af-4bb41cb5892b',
      position: 2
    },
    {
      id: 'f96039b8-e9ae-457c-94d0-26cb86f36850',
      uploaded_by: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      kind: 'image',
      provider: 'cloudflare_images',
      provider_ref: '0de50321-f008-4729-eb88-1db06b470e00',
      url: 'https://imagedelivery.net/uusH4IRLf6yhlCMhPld_6A/0de50321-f008-4729-eb88-1db06b470e00/profileThumbnail',
      type_variant: 'profileThumbnail',
      link_id: '87d9c3ab-0bbc-40b3-89af-4bb41cb5892b',
      position: 1
    }
  ];
  
  let mediaFileCount = 0
  for (const mf of mediaFilesData) {
    await prisma.mediaFile.upsert({
      where: { id: mf.id },
      update: {},
      create: {
        ...mf,
        kind: mf.kind as any,
        provider: mf.provider as any,
        type_variant: mf.type_variant as any,
        created_at: new Date('2025-09-28T01:36:18.726Z'),
      },
    })
    mediaFileCount++
  }
  console.log(`Created ${mediaFileCount} media files (partial - add remaining files)`)

  // 9. FAVORITES
  console.log('Seeding Favorites...')
  const favorites = [
    {
      user_id: '9d8dd6cd-9344-449e-bd5c-b582bc87a6b7',
      service_id: '1c609e03-64eb-4306-948d-4d28e73ab50a',
      created_at: new Date('2025-10-29T21:39:18.493Z'),
    },
    {
      user_id: '9d8dd6cd-9344-449e-bd5c-b582bc87a6b7',
      service_id: '66cc01a2-eef9-4eb1-a8e2-c7dfcc198e52',
      created_at: new Date('2025-10-29T16:13:53.217Z'),
    },
  ]

  for (const fav of favorites) {
    await prisma.favorite.upsert({
      where: {
        user_id_service_id: {
          user_id: fav.user_id,
          service_id: fav.service_id,
        },
      },
      update: {},
      create: fav,
    })
  }
  console.log(`Created ${favorites.length} favorites`)

  // 10. BOOK SERVICES
  console.log('Seeding BookServices...')
  const bookServices = [
    {
      id: '9223a318-923d-4870-895b-aa8d46248bdc',
      service_id: '1c609e03-64eb-4306-948d-4d28e73ab50d',
      service_name: 'Servicio 05',
      user_id: 'fe2bbc80-f561-48e8-96ea-4586e682fbd0',
      date_time: new Date('2025-10-31T12:38:53.076Z'),
      address: 'Dirección',
      comments: 'Comentario rápido',
      responsible_name: 'Alberto',
      phone_number: '650555121',
      status: 'cancelled',
      created_at: new Date('2025-10-31T00:39:34.141Z'),
      updated_at: new Date('2025-10-31T00:40:22.289Z'),
    },
    {
      id: 'c2a6fa3f-e104-477a-9ac2-9e41ab24933a',
      service_id: '1c609e03-64eb-4306-948d-4d28e73ab50c',
      service_name: 'Servicio 01',
      user_id: '9d8dd6cd-9344-449e-bd5c-b582bc87a6b7',
      date_time: new Date('2025-09-28T13:00:06.053Z'),
      address: 'Dirección del servicio',
      comments: 'Comentario de petición',
      responsible_name: 'Juan',
      phone_number: '6505551236',
      status: 'completed',
      created_at: new Date('2025-09-28T01:35:52.808Z'),
      updated_at: new Date('2025-10-31T00:43:05.519Z'),
    },
  ]

  for (const booking of bookServices) {
    await prisma.bookService.upsert({
      where: { id: booking.id },
      update: {},
      create: {
        ...booking,
        status: booking.status as any,
      },
    })
  }
  console.log(`Created ${bookServices.length} bookings`)

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })