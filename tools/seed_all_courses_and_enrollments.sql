-- ========================================================
-- Seed Data for All Courses (Sections, Lessons, Quizzes)
-- and Auto-enroll all existing students in all courses
-- ========================================================

USE skillforge_lms;

-- 1. Ensure all courses are PUBLISHED
UPDATE courses SET status = 'PUBLISHED' WHERE id IN (1, 2, 3, 4, 5);

-- 2. Update existing Course 1 lessons with valid video embeds
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/nu_pCVPKzTk' WHERE id = 1;
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/VqCgcpAypFQ' WHERE id = 2;
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/mU6anWqZJcc' WHERE id = 3;
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/mU6anWqZJcc' WHERE id = 4;
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/1Rs2ND1ryYc' WHERE id = 5;
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/fYq5PXgSsbE' WHERE id = 6;
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/W6NZfCO5SIk' WHERE id = 7;
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/W6NZfCO5SIk' WHERE id = 8;
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/PoRJizFvM7s' WHERE id = 9;
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/bMknfKXIFA8' WHERE id = 10;
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/bMknfKXIFA8' WHERE id = 11;
UPDATE lessons SET video_url = 'https://www.youtube-nocookie.com/embed/bMknfKXIFA8' WHERE id = 12;

-- ========================================================
-- COURSE 2: Data Science with Python (id = 2)
-- ========================================================
DELETE FROM course_sections WHERE course_id = 2;
INSERT INTO course_sections (id, course_id, title, description, sort_order) VALUES
(201, 2, 'Python Fundamentals for Data Science', 'Set up Python, Jupyter Notebooks, and grasp essential data structures.', 1),
(202, 2, 'Data Wrangling with NumPy & Pandas', 'Master tabular data manipulation, filtering, aggregation, and time series.', 2),
(203, 2, 'Exploratory Data Analysis & Visualization', 'Create production data visuals using Matplotlib, Seaborn, and statistical tests.', 3),
(204, 2, 'Applied Machine Learning with Scikit-Learn', 'Train supervised and unsupervised models, cross-validate, and evaluate metrics.', 4);

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, sort_order, is_preview, is_mandatory) VALUES
(201, 2, 'Welcome to Data Science with Python', 'Roadmap of the course, setting up Anaconda, Jupyter Lab, and VS Code.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/rfscVS0vtbw', 720, 1, 1, 0),
(201, 2, 'Python Syntax, Lists & Dictionaries', 'Core Python structures optimized for analytical operations.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/rfscVS0vtbw', 1200, 2, 0, 1),
(201, 2, 'Working with Virtual Environments & PIP', 'Isolating dependencies and managing reproducible data science workflows.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/rfscVS0vtbw', 900, 3, 0, 1),
(202, 2, 'NumPy N-Dimensional Arrays', 'Vectorized math, array broadcasting, and memory-efficient computations.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/vmEHCJofslg', 1500, 1, 0, 1),
(202, 2, 'Pandas Series and DataFrames', 'Loading CSV, JSON, and SQL datasets into high-performance DataFrames.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/vmEHCJofslg', 1800, 2, 0, 1),
(202, 2, 'Handling Missing Data & Outliers', 'Imputation techniques, boolean indexing, and IQR outlier detection.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/vmEHCJofslg', 1600, 3, 0, 1),
(203, 2, 'Statistical Charts with Matplotlib', 'Line plots, bar charts, histograms, and customizable subplots.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/a9UrKTVEeZA', 1400, 1, 0, 1),
(203, 2, 'Advanced Heatmaps & Correlation in Seaborn', 'Pairplots, categorical distributions, and multi-variable correlation matrices.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/a9UrKTVEeZA', 1700, 2, 0, 1),
(204, 2, 'Linear & Logistic Regression Models', 'Feature scaling, train/test splitting, cost functions, and accuracy scores.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/0B5eIE_1vpU', 2200, 1, 0, 1),
(204, 2, 'Capstone: End-to-End Prediction Pipeline', 'Build and serialize a machine learning model ready for REST API deployment.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/0B5eIE_1vpU', 2600, 2, 0, 1);

-- Quiz for Course 2
DELETE FROM quizzes WHERE course_id = 2;
INSERT INTO quizzes (id, course_id, title, description, passing_score, is_required, sort_order) VALUES
(2, 2, 'Data Science & Machine Learning Assessment', 'Test your knowledge on Pandas, NumPy, statistical analysis, and ML algorithms.', 70, 1, 1);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order) VALUES
(2, 'Which Pandas function is used to read a CSV file into a DataFrame?', 'SINGLE_CHOICE', 'pd.read_csv() is the standard Pandas function for importing CSV files.', 1, 1),
(2, 'What does the shape attribute of a NumPy array return?', 'SINGLE_CHOICE', 'The shape attribute returns a tuple representing the dimensionality (rows, columns) of the array.', 1, 2),
(2, 'Which metric is best suited for evaluating an imbalanced classification problem?', 'SINGLE_CHOICE', 'F1-Score or ROC-AUC are much better than simple Accuracy for imbalanced target classes.', 1, 3),
(2, 'Which of the following are supervised machine learning algorithms?', 'MULTIPLE_CHOICE', 'Linear Regression, Random Forest, and Support Vector Machines require labeled training data.', 2, 4);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(LAST_INSERT_ID() - 3, 'pd.read_csv()', 1, 1),
(LAST_INSERT_ID() - 3, 'pd.import_csv()', 0, 2),
(LAST_INSERT_ID() - 3, 'pd.load_csv()', 0, 3),
(LAST_INSERT_ID() - 3, 'pd.open_csv()', 0, 4),
(LAST_INSERT_ID() - 2, 'A tuple with array dimensions (rows, columns)', 1, 1),
(LAST_INSERT_ID() - 2, 'The total byte size of the array', 0, 2),
(LAST_INSERT_ID() - 2, 'The data type of array elements', 0, 3),
(LAST_INSERT_ID() - 2, 'A list of column names', 0, 4),
(LAST_INSERT_ID() - 1, 'F1-Score / Precision-Recall AUC', 1, 1),
(LAST_INSERT_ID() - 1, 'Raw Accuracy percentage', 0, 2),
(LAST_INSERT_ID() - 1, 'Mean Squared Error (MSE)', 0, 3),
(LAST_INSERT_ID() - 1, 'R-Squared', 0, 4),
(LAST_INSERT_ID(), 'Linear Regression', 1, 1),
(LAST_INSERT_ID(), 'Random Forest Classifier', 1, 2),
(LAST_INSERT_ID(), 'K-Means Clustering', 0, 3),
(LAST_INSERT_ID(), 'Support Vector Machine (SVM)', 1, 4);

-- ========================================================
-- COURSE 3: Digital Marketing Masterclass (id = 3)
-- ========================================================
DELETE FROM course_sections WHERE course_id = 3;
INSERT INTO course_sections (id, course_id, title, description, sort_order) VALUES
(301, 3, 'Search Engine Optimization (SEO) Architecture', 'Technical SEO, site speed, Google Search Console, and backlink strategies.', 1),
(302, 3, 'Paid Performance Marketing (Google & Meta Ads)', 'High-ROI pay-per-click ad campaigns, custom audiences, and pixel tracking.', 2),
(303, 3, 'Content Strategy & Conversion Rate Optimization', 'Landing page A/B testing, email automation, and conversion funnels.', 3);

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, sort_order, is_preview, is_mandatory) VALUES
(301, 3, 'SEO Foundations & Search Intent', 'How search crawlers index pages and rank content according to user intent.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/nU-IIXBWlS4', 900, 1, 1, 0),
(301, 3, 'Keyword Research with Semrush & Ahrefs', 'Finding low-competition, high-volume transactional keywords.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/DvwS7cV9GmQ', 1500, 2, 0, 1),
(301, 3, 'On-Page SEO & Schema Markup', 'Optimizing title tags, meta descriptions, OpenGraph, and JSON-LD structured data.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/DvwS7cV9GmQ', 1400, 3, 0, 1),
(302, 3, 'Google Search & Display Campaigns', 'Setting up bidding strategies, negative keyword lists, and quality score boosting.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/jZ_n5f9bXGg', 1800, 1, 0, 1),
(302, 3, 'Meta Pixel Tracking & Custom Audiences', 'Configuring conversion API, lookalike audiences, and retargeting ads.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/jZ_n5f9bXGg', 1600, 2, 0, 1),
(303, 3, 'High-Converting Landing Pages', 'Copywriting frameworks, CTA hierarchy, and eliminating purchase friction.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/nU-IIXBWlS4', 1200, 1, 0, 1),
(303, 3, 'Google Analytics 4 & Attribution Models', 'Tracking UTM parameters, event measurement, and cross-channel attribution.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/nU-IIXBWlS4', 1700, 2, 0, 1);

-- Quiz for Course 3
DELETE FROM quizzes WHERE course_id = 3;
INSERT INTO quizzes (id, course_id, title, description, passing_score, is_required, sort_order) VALUES
(3, 3, 'Digital Marketing Strategy Certification Quiz', 'Validate your expertise in SEO, PPC ad campaign management, and GA4 analytics.', 70, 1, 1);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order) VALUES
(3, 'What does CPC stand for in paid advertising?', 'SINGLE_CHOICE', 'CPC stands for Cost Per Click, the amount paid each time a user clicks an ad.', 1, 1),
(3, 'Which HTTP status code is used for permanent page redirects for SEO preservation?', 'SINGLE_CHOICE', 'A 301 redirect permanently routes traffic and passes ~90-99% of link equity.', 1, 2),
(3, 'What is the primary purpose of Google Analytics 4 (GA4) UTM parameters?', 'SINGLE_CHOICE', 'UTM tags track campaign source, medium, and name across marketing channels.', 1, 3);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(LAST_INSERT_ID() - 2, 'Cost Per Click', 1, 1),
(LAST_INSERT_ID() - 2, 'Cost Per Customer', 0, 2),
(LAST_INSERT_ID() - 2, 'Campaign Performance Count', 0, 3),
(LAST_INSERT_ID() - 2, 'Conversion Page Click', 0, 4),
(LAST_INSERT_ID() - 1, '301 Moved Permanently', 1, 1),
(LAST_INSERT_ID() - 1, '302 Found', 0, 2),
(LAST_INSERT_ID() - 1, '404 Not Found', 0, 3),
(LAST_INSERT_ID() - 1, '500 Server Error', 0, 4),
(LAST_INSERT_ID(), 'To attribute incoming traffic to specific marketing campaigns', 1, 1),
(LAST_INSERT_ID(), 'To speed up page loading on mobile devices', 0, 2),
(LAST_INSERT_ID(), 'To encrypt user passwords on forms', 0, 3),
(LAST_INSERT_ID(), 'To bypass ad-blockers automatically', 0, 4);

-- ========================================================
-- COURSE 4: Cloud Architecture with AWS (id = 4)
-- ========================================================
DELETE FROM course_sections WHERE course_id = 4;
INSERT INTO course_sections (id, course_id, title, description, sort_order) VALUES
(401, 4, 'Cloud Computing Core & AWS Global Infrastructure', 'Regions, Availability Zones, IAM Security, and AWS CLI integration.', 1),
(402, 4, 'Compute, Storage & High Availability', 'EC2 Auto Scaling, Application Load Balancers, S3 Lifecycle Policies, and EBS.', 2),
(403, 4, 'Serverless Architecture & Cloud Security', 'AWS Lambda, API Gateway, DynamoDB, VPC subnets, and CloudFront CDN.', 3);

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, sort_order, is_preview, is_mandatory) VALUES
(401, 4, 'Introduction to AWS Cloud Architecture', 'Core principles of AWS Well-Architected Framework and reliability pillars.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/SOTamWNgDKc', 800, 1, 1, 0),
(401, 4, 'IAM Policies, Roles & Multi-Factor Auth', 'Zero-trust identity management and least-privilege security policies.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/SOTamWNgDKc', 1400, 2, 0, 1),
(402, 4, 'Amazon EC2 Instances & Security Groups', 'Launching Linux instances, configuring key pairs, and inbound firewall rules.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/ulprqHHWlng', 1800, 1, 0, 1),
(402, 4, 'Amazon S3 Object Storage & Bucket Policies', 'Managing secure object storage, versioning, and presigned access URLs.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/ulprqHHWlng', 1600, 2, 0, 1),
(402, 4, 'Elastic Load Balancing & Auto-Scaling Groups', 'Designing self-healing, horizontally scalable web server fleets.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/ulprqHHWlng', 2100, 3, 0, 1),
(403, 4, 'VPC Networking, Subnets & Route Tables', 'Public vs private subnets, NAT Gateways, and network ACL security.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/Ia-UEOoLk3g', 2400, 1, 0, 1),
(403, 4, 'Serverless Functions with AWS Lambda', 'Event-driven microservices with zero idle server provisioning.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/Ia-UEOoLk3g', 1800, 2, 0, 1);

-- Quiz for Course 4
DELETE FROM quizzes WHERE course_id = 4;
INSERT INTO quizzes (id, course_id, title, description, passing_score, is_required, sort_order) VALUES
(4, 4, 'AWS Certified Solutions Architect Practice Exam', 'Test your understanding of AWS compute, storage, networking, and cloud security.', 70, 1, 1);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order) VALUES
(4, 'Which AWS service is designed for object storage with 99.999999999% durability?', 'SINGLE_CHOICE', 'Amazon S3 provides 11 9s of durability across multiple availability zones.', 1, 1),
(4, 'What is the purpose of an AWS Application Load Balancer (ALB)?', 'SINGLE_CHOICE', 'ALB operates at Layer 7 (HTTP/HTTPS) and routes traffic based on URL paths and headers.', 1, 2),
(4, 'Which component allows instances in a private subnet to connect to the Internet?', 'SINGLE_CHOICE', 'A NAT Gateway deployed in a public subnet allows private instances outbound internet access.', 1, 3);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(LAST_INSERT_ID() - 2, 'Amazon S3 (Simple Storage Service)', 1, 1),
(LAST_INSERT_ID() - 2, 'Amazon EBS (Elastic Block Store)', 0, 2),
(LAST_INSERT_ID() - 2, 'Amazon EFS (Elastic File System)', 0, 3),
(LAST_INSERT_ID() - 2, 'AWS Storage Gateway', 0, 4),
(LAST_INSERT_ID() - 1, 'Distribute incoming HTTP/HTTPS traffic across multiple targets at Layer 7', 1, 1),
(LAST_INSERT_ID() - 1, 'Cache database queries in memory', 0, 2),
(LAST_INSERT_ID() - 1, 'Generate SSL certificates automatically', 0, 3),
(LAST_INSERT_ID() - 1, 'Store server log files permanently', 0, 4),
(LAST_INSERT_ID(), 'NAT Gateway', 1, 1),
(LAST_INSERT_ID(), 'Internet Gateway', 0, 2),
(LAST_INSERT_ID(), 'VPC Endpoint', 0, 3),
(LAST_INSERT_ID(), 'Direct Connect', 0, 4);

-- ========================================================
-- COURSE 5: AIML & DEEP LEARNING (id = 5)
-- ========================================================
DELETE FROM course_sections WHERE course_id = 5;
INSERT INTO course_sections (id, course_id, title, description, sort_order) VALUES
(501, 5, 'Foundations of Neural Networks', 'Perceptrons, activation functions, backpropagation, and gradient descent.', 1),
(502, 5, 'Deep Learning Frameworks with PyTorch', 'Tensors, autograd, building deep models, and GPU hardware acceleration.', 2),
(503, 5, 'Computer Vision & Natural Language Processing', 'Convolutional Neural Networks (CNNs), Transformers, and LLM fine-tuning.', 3);

INSERT INTO lessons (section_id, course_id, title, description, content_type, video_url, video_duration_seconds, sort_order, is_preview, is_mandatory) VALUES
(501, 5, 'Welcome to Artificial Intelligence & Deep Learning', 'Introduction to modern AI, deep learning frontiers, and course syllabus.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/i_LwzRVP7bg', 750, 1, 1, 0),
(501, 5, 'Mathematics for Deep Learning: Vectors & Matrices', 'Linear algebra, partial derivatives, and probability foundations.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/i_LwzRVP7bg', 1600, 2, 0, 1),
(502, 5, 'Introduction to PyTorch & Tensor Computing', 'Creating tensors, computing gradients with autograd, and CUDA execution.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/GIsg-ZUy0MY', 2100, 1, 0, 1),
(502, 5, 'Training Your First Multi-Layer Perceptron', 'Loss functions, optimizers (Adam, SGD), and preventing overfitting.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/GIsg-ZUy0MY', 2400, 2, 0, 1),
(503, 5, 'Convolutional Neural Networks for Image Classification', 'Convolutions, pooling layers, ResNet architectures, and transfer learning.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/aircAruvnKk', 2700, 1, 0, 1),
(503, 5, 'Transformers, Self-Attention & LLMs', 'Understanding the Attention Mechanism, BERT, GPT, and generative prompt engineering.', 'VIDEO', 'https://www.youtube-nocookie.com/embed/aircAruvnKk', 3100, 2, 0, 1);

-- Quiz for Course 5
DELETE FROM quizzes WHERE course_id = 5;
INSERT INTO quizzes (id, course_id, title, description, passing_score, is_required, sort_order) VALUES
(5, 5, 'Artificial Intelligence & Deep Learning Assessment', 'Test your knowledge of neural networks, backpropagation, and transformer architectures.', 70, 1, 1);

INSERT INTO quiz_questions (quiz_id, question_text, question_type, explanation, points, sort_order) VALUES
(5, 'What algorithm is primarily used to compute gradients in a neural network?', 'SINGLE_CHOICE', 'Backpropagation uses the calculus chain rule to calculate gradients layer-by-layer backwards.', 1, 1),
(5, 'Which activation function is most widely used in hidden layers of modern deep neural networks?', 'SINGLE_CHOICE', 'ReLU (Rectified Linear Unit) avoids vanishing gradient issues and is computationally fast.', 1, 2),
(5, 'What key mechanism enables Transformer models to process sequences in parallel?', 'SINGLE_CHOICE', 'The Self-Attention mechanism allows models to compute dependencies between all tokens simultaneously.', 1, 3);

INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(LAST_INSERT_ID() - 2, 'Backpropagation (Reverse-Mode Automatic Differentiation)', 1, 1),
(LAST_INSERT_ID() - 2, 'Forward Dynamic Programming', 0, 2),
(LAST_INSERT_ID() - 2, 'Monte Carlo Search', 0, 3),
(LAST_INSERT_ID() - 2, 'Breadth-First Search', 0, 4),
(LAST_INSERT_ID() - 1, 'ReLU (Rectified Linear Unit)', 1, 1),
(LAST_INSERT_ID() - 1, 'Sigmoid', 0, 2),
(LAST_INSERT_ID() - 1, 'Linear (Identity)', 0, 3),
(LAST_INSERT_ID() - 1, 'Step Function', 0, 4),
(LAST_INSERT_ID(), 'Self-Attention Mechanism', 1, 1),
(LAST_INSERT_ID(), 'Recurrent Feedback Loop', 0, 2),
(LAST_INSERT_ID(), 'Max-Pooling Operation', 0, 3),
(LAST_INSERT_ID(), 'Dropout Regularization', 0, 4);

-- ========================================================
-- AUTO-ENROLL EXISTING STUDENTS IN ALL COURSES
-- (Prevents 'Access Denied' for student users)
-- ========================================================
INSERT IGNORE INTO enrollments (user_id, course_id, status, enrolled_at, progress_pct)
SELECT u.id, c.id, 'ACTIVE', NOW(), 0.00
FROM users u
CROSS JOIN courses c
WHERE u.role = 'STUDENT';

-- Update enrollment count on courses table
UPDATE courses c
SET enrollment_count = (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id);
