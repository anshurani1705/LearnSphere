-- Migration: Course Management & Category Improvements for Company LMS

-- 1. Modify courses table to support UNPUBLISHED status, category, and target_audience
ALTER TABLE courses
    DROP CHECK chk_course_status;

ALTER TABLE courses
    ADD CONSTRAINT chk_course_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED'));

ALTER TABLE courses
    ADD COLUMN category VARCHAR(100) NOT NULL DEFAULT 'General',
    ADD COLUMN target_audience JSON;

CREATE INDEX idx_courses_category ON courses(category);

-- 2. Create Categories table
CREATE TABLE categories (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL UNIQUE,
    slug            VARCHAR(100) NOT NULL UNIQUE,
    description     TEXT,
    icon            VARCHAR(50),
    display_order   INT NOT NULL DEFAULT 0,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_categories_slug ON categories(slug);

-- 3. Seed default company categories
INSERT INTO categories (name, slug, description, icon, display_order) VALUES
('Web Development', 'web-development', 'Modern web technologies, frameworks, and full-stack development.', 'Code', 1),
('Data Science & AI', 'data-science-ai', 'Machine learning, python data science, visualization, and artificial intelligence.', 'Database', 2),
('Cloud & DevOps', 'cloud-devops', 'Cloud infrastructure, containerization, CI/CD pipelines, and cloud architecture.', 'Cloud', 3),
('Digital Marketing', 'digital-marketing', 'SEO, social media marketing, content marketing, and online brand acceleration.', 'Megaphone', 4),
('Business & Management', 'business-management', 'Product management, strategic planning, team leadership, and agile delivery.', 'Briefcase', 5);

-- Update existing sample courses with appropriate categories
UPDATE courses SET category = 'Web Development' WHERE slug = 'full-stack-web-development-bootcamp';
UPDATE courses SET category = 'Data Science & AI' WHERE slug = 'data-science-with-python';
UPDATE courses SET category = 'Digital Marketing' WHERE slug = 'digital-marketing-masterclass';
UPDATE courses SET category = 'Cloud & DevOps' WHERE slug = 'cloud-architecture-with-aws';
