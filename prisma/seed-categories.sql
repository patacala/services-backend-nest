-- Insertar categorías base
INSERT INTO "Category" (id, name_en, name_es, slug_en, slug_es, parent_id)
VALUES
  (1, 'Home', 'Hogar', 'home', 'hogar', NULL),
  (2, 'Plumbing', 'Plomería', 'plumbing', 'plomeria', 1),
  (3, 'Electricity', 'Electricidad', 'electricity', 'electricidad', 1),
  (4, 'Gardening', 'Jardinería', 'gardening', 'jardineria', NULL),
  (5, 'Education', 'Educación', 'education', 'educacion', NULL),
  (6, 'Private Lessons', 'Clases Particulares', 'private-lessons', 'clases-particulares', 5),
  (7, 'Technology', 'Tecnología', 'technology', 'tecnologia', NULL),
  (8, 'Computer Repair', 'Reparación de Computadoras', 'computer-repair', 'reparacion-computadoras', 7),
  (9, 'Health', 'Salud', 'health', 'salud', NULL),
  (10, 'Wellness', 'Bienestar', 'wellness', 'bienestar', 9)
ON CONFLICT (id) DO UPDATE 
SET name_en = EXCLUDED.name_en, 
    name_es = EXCLUDED.name_es, 
    slug_en = EXCLUDED.slug_en, 
    slug_es = EXCLUDED.slug_es, 
    parent_id = EXCLUDED.parent_id;
