USE skillforge_lms;

-- Clean existing answer options and reset
DELETE FROM answer_options;

-- ========================================================
-- Quiz 1: Full-Stack Web Development (Questions 1 to 5)
-- ========================================================
-- Q1: What does HTML stand for?
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(1, 'HyperText Markup Language', 1, 1),
(1, 'High-Level Text Machine Language', 0, 2),
(1, 'HyperTransfer Markup Language', 0, 3),
(1, 'Home Tool Markup Language', 0, 4);

-- Q2: Which CSS property is used to create space between the element's border and inner content?
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(2, 'padding', 1, 1),
(2, 'margin', 0, 2),
(2, 'border-spacing', 0, 3),
(2, 'gap', 0, 4);

-- Q3: What is the correct way to declare a constant in modern JavaScript?
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(3, 'const x = 10', 1, 1),
(3, 'var x = 10', 0, 2),
(3, 'constant x = 10', 0, 3),
(3, 'define x = 10', 0, 4);

-- Q4: In React, what hook is used to manage component state?
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(4, 'useState', 1, 1),
(4, 'useRef', 0, 2),
(4, 'useEffect', 0, 3),
(4, 'useMemo', 0, 4);

-- Q5: Which of the following are valid HTTP methods? (MULTIPLE_CHOICE)
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(5, 'GET', 1, 1),
(5, 'POST', 1, 2),
(5, 'SEND', 0, 3),
(5, 'DELETE', 1, 4);

-- ========================================================
-- Quiz 2: Data Science with Python (Questions 6 to 9)
-- ========================================================
-- Q6: Which Pandas function is used to read a CSV file into a DataFrame?
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(6, 'pd.read_csv()', 1, 1),
(6, 'pd.import_csv()', 0, 2),
(6, 'pd.load_csv()', 0, 3),
(6, 'pd.open_csv()', 0, 4);

-- Q7: What does the shape attribute of a NumPy array return?
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(7, 'A tuple with array dimensions (rows, columns)', 1, 1),
(7, 'The total byte size of the array', 0, 2),
(7, 'The data type of array elements', 0, 3),
(7, 'A list of column names', 0, 4);

-- Q8: Which metric is best suited for evaluating an imbalanced classification problem?
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(8, 'F1-Score / Precision-Recall AUC', 1, 1),
(8, 'Raw Accuracy percentage', 0, 2),
(8, 'Mean Squared Error (MSE)', 0, 3),
(8, 'R-Squared', 0, 4);

-- Q9: Which of the following are supervised machine learning algorithms? (MULTIPLE_CHOICE)
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(9, 'Random Forest Classifier', 1, 1),
(9, 'Linear Regression', 1, 2),
(9, 'K-Means Clustering', 0, 3),
(9, 'Support Vector Machine (SVM)', 1, 4);

-- ========================================================
-- Quiz 3: Digital Marketing Strategy (Questions 10 to 12)
-- ========================================================
-- Q10: What does CPC stand for in paid advertising?
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(10, 'Cost Per Click', 1, 1),
(10, 'Cost Per Customer', 0, 2),
(10, 'Campaign Performance Count', 0, 3),
(10, 'Conversion Page Click', 0, 4);

-- Q11: Which HTTP status code is used for permanent page redirects for SEO preservation?
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(11, '301 Moved Permanently', 1, 1),
(11, '302 Found', 0, 2),
(11, '404 Not Found', 0, 3),
(11, '500 Server Error', 0, 4);

-- Q12: What is the primary purpose of Google Analytics 4 (GA4) UTM parameters?
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(12, 'To attribute incoming traffic to specific marketing campaigns', 1, 1),
(12, 'To speed up page loading on mobile devices', 0, 2),
(12, 'To encrypt user passwords on forms', 0, 3),
(12, 'To bypass ad-blockers automatically', 0, 4);

-- ========================================================
-- Quiz 4: AWS Cloud Architecture (Questions 13 to 15)
-- ========================================================
-- Q13: Which AWS service is designed for object storage with 99.999999999% durability?
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(13, 'Amazon S3', 1, 1),
(13, 'Amazon EBS', 0, 2),
(13, 'Amazon EFS', 0, 3),
(13, 'Amazon RDS', 0, 4);

-- Q14: What is the purpose of an AWS Application Load Balancer (ALB)?
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(14, 'Distribute HTTP/HTTPS traffic across targets in multiple Availability Zones', 1, 1),
(14, 'Provision virtual servers on demand', 0, 2),
(14, 'Store relational databases with replication', 0, 3),
(14, 'Encrypt data at rest with KMS keys', 0, 4);

-- Q15: Which component allows instances in a private subnet to connect to the Internet?
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(15, 'NAT Gateway', 1, 1),
(15, 'Internet Gateway attached to private subnet', 0, 2),
(15, 'Direct Connect line', 0, 3),
(15, 'VPC Peering connection', 0, 4);

-- ========================================================
-- Quiz 5: Artificial Intelligence & Deep Learning (Questions 16 to 18)
-- ========================================================
-- Q16: What algorithm is primarily used to compute gradients in a neural network?
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(16, 'Backpropagation', 1, 1),
(16, 'Dijkstra Algorithm', 0, 2),
(16, 'Breadth-First Search', 0, 3),
(16, 'PageRank', 0, 4);

-- Q17: Which activation function is most widely used in hidden layers of modern deep neural networks?
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(17, 'ReLU (Rectified Linear Unit)', 1, 1),
(17, 'Sigmoid', 0, 2),
(17, 'Step Function', 0, 3),
(17, 'Linear identity', 0, 4);

-- Q18: What key mechanism enables Transformer models to process sequences in parallel?
INSERT INTO answer_options (question_id, option_text, is_correct, sort_order) VALUES
(18, 'Self-Attention Mechanism', 1, 1),
(18, 'Recurrent Hidden Loops', 0, 2),
(18, 'Max Pooling', 0, 3),
(18, 'Batch Normalization', 0, 4);
