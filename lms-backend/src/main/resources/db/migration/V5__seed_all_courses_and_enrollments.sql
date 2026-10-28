
-- ========================================================
-- V5: Seed Course Sections, Lessons, Quizzes & Demo Enrollments
-- ========================================================

-- Ensure all courses are PUBLISHED
UPDATE courses SET status = 'PUBLISHED' WHERE id IN (1, 2, 3, 4, 5);

-- Update existing Course 1 lessons with valid video embeds
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/nu_pCVPKzTk' WHERE id = 1 AND (video_url IS NULL OR video_url = '');
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/VqCgcpAypFQ' WHERE id = 2 AND (video_url IS NULL OR video_url = '');
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/mU6anWqZJcc' WHERE id = 3 AND (video_url IS NULL OR video_url = '');
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/mU6anWqZJcc' WHERE id = 4 AND (video_url IS NULL OR video_url = '');
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/1Rs2ND1ryYc' WHERE id = 5 AND (video_url IS NULL OR video_url = '');
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/fYq5PXgSsbE' WHERE id = 6 AND (video_url IS NULL OR video_url = '');
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/W6NZfCO5SIk' WHERE id = 7 AND (video_url IS NULL OR video_url = '');
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/W6NZfCO5SIk' WHERE id = 8 AND (video_url IS NULL OR video_url = '');
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/PoRJizFvM7s' WHERE id = 9 AND (video_url IS NULL OR video_url = '');
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/bMknfKXIFA8' WHERE id = 10 AND (video_url IS NULL OR video_url = '');
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/bMknfKXIFA8' WHERE id = 11 AND (video_url IS NULL OR video_url = '');
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/bMknfKXIFA8' WHERE id = 12 AND (video_url IS NULL OR video_url = '');

-- Auto-enroll existing students in all courses
INSERT IGNORE INTO enrollments (user_id, course_id, status, enrolled_at, progress_pct)
SELECT u.id, c.id, 'ACTIVE', NOW(), 0.00
FROM users u
CROSS JOIN courses c
WHERE u.role = 'STUDENT';

-- Sync enrollment counts
UPDATE courses c
SET enrollment_count = (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id);
