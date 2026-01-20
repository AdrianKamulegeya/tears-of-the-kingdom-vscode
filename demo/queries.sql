-- Tears of the Kingdom - Shrine Database Schema
-- SQL Demo for VSCode Theme

-- Create shrines table
CREATE TABLE IF NOT EXISTS shrines (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    region VARCHAR(50) NOT NULL,
    type ENUM('Combat', 'Puzzle', 'Blessing', 'Test') NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    location_x DECIMAL(10, 2),
    location_y DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shrine_id VARCHAR(50),
    reward_type VARCHAR(50),
    reward_name VARCHAR(100),
    quantity INT DEFAULT 1,
    FOREIGN KEY (shrine_id) REFERENCES shrines(id) ON DELETE CASCADE
);

-- Insert sample shrines
INSERT INTO shrines (id, name, region, type, location_x, location_y, completed)
VALUES 
    ('shrine_001', 'Oman Au Shrine', 'Central Hyrule', 'Combat', 100.5, 200.3, TRUE),
    ('shrine_002', 'Ja Baij Shrine', 'Central Hyrule', 'Puzzle', 150.2, 180.7, FALSE),
    ('shrine_003', 'Keh Namut Shrine', 'Hebra Mountains', 'Blessing', 95.8, 220.1, TRUE),
    ('shrine_004', 'Owa Daim Shrine', 'Gerudo Desert', 'Test', 300.1, 150.5, FALSE);

-- Insert rewards
INSERT INTO rewards (shrine_id, reward_type, reward_name, quantity)
VALUES 
    ('shrine_001', 'item', 'Spirit Orb', 1),
    ('shrine_001', 'weapon', 'Traveler''s Sword', 1),
    ('shrine_002', 'item', 'Spirit Orb', 1),
    ('shrine_003', 'item', 'Spirit Orb', 1),
    ('shrine_003', 'armor', 'Climber''s Bandana', 1);

-- Query: Get all completed shrines
SELECT 
    s.name,
    s.region,
    s.type,
    COUNT(r.id) AS reward_count
FROM shrines s
LEFT JOIN rewards r ON s.id = r.shrine_id
WHERE s.completed = TRUE
GROUP BY s.id, s.name, s.region, s.type
ORDER BY s.name;

-- Query: Find shrines by region with rewards
SELECT 
    s.name AS shrine_name,
    s.region,
    s.type,
    r.reward_type,
    r.reward_name,
    r.quantity
FROM shrines s
INNER JOIN rewards r ON s.id = r.shrine_id
WHERE s.region = 'Central Hyrule'
ORDER BY s.name, r.reward_type;

-- Query: Calculate completion statistics
SELECT 
    region,
    COUNT(*) AS total_shrines,
    SUM(CASE WHEN completed THEN 1 ELSE 0 END) AS completed_shrines,
    ROUND(
        (SUM(CASE WHEN completed THEN 1 ELSE 0 END) * 100.0) / COUNT(*),
        2
    ) AS completion_percentage
FROM shrines
GROUP BY region
ORDER BY completion_percentage DESC;

-- Query: Find nearest incomplete shrine (simplified)
SELECT 
    id,
    name,
    region,
    type,
    SQRT(
        POWER(location_x - 110.0, 2) + 
        POWER(location_y - 205.0, 2)
    ) AS distance
FROM shrines
WHERE completed = FALSE
ORDER BY distance ASC
LIMIT 1;

-- Update shrine completion status
UPDATE shrines
SET completed = TRUE,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'shrine_002';

-- View: Shrine summary
CREATE OR REPLACE VIEW shrine_summary AS
SELECT 
    s.id,
    s.name,
    s.region,
    s.type,
    s.completed,
    GROUP_CONCAT(r.reward_name SEPARATOR ', ') AS rewards
FROM shrines s
LEFT JOIN rewards r ON s.id = r.shrine_id
GROUP BY s.id, s.name, s.region, s.type, s.completed;

-- Query the view
SELECT * FROM shrine_summary
WHERE region IN ('Central Hyrule', 'Hebra Mountains')
ORDER BY name;
