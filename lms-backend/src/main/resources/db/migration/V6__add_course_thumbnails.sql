-- ========================================================
-- V6: Set Realistic Educational Thumbnails For All Courses
-- ========================================================

UPDATE courses 
SET thumbnail_url = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
WHERE slug = 'full-stack-web-development-bootcamp' OR id = 1;

UPDATE courses 
SET thumbnail_url = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
WHERE slug = 'data-science-with-python' OR id = 2;

UPDATE courses 
SET thumbnail_url = 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80'
WHERE slug = 'digital-marketing-masterclass' OR id = 3;

UPDATE courses 
SET thumbnail_url = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
WHERE slug = 'cloud-architecture-with-aws' OR id = 4;

