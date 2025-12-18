-- Seed Default Navbar Links and Footer Sections
-- Run this file to populate default navigation and footer content
-- mysql -u tufan_user -pTufanResort2025 tufan_resort < seed-navbar-footer.sql

-- Insert Navbar Links (using correct column names: label, displayOrder)
INSERT INTO navbar_links (label, url, displayOrder, isActive) VALUES
('Home', '/', 1, 1),
('Rooms', '/rooms', 2, 1),
('Convention Hall', '/convention-hall', 3, 1),
('About', '/about', 4, 1)
ON DUPLICATE KEY UPDATE label=VALUES(label), url=VALUES(url);

-- Insert Footer Sections (using correct column names: title, displayOrder)
INSERT INTO footer_sections (title, displayOrder, isActive) VALUES
('Quick Links', 1, 1),
('Services', 2, 1),
('Contact', 3, 1)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Get section IDs (will be used in links)
SET @quickLinksId = (SELECT id FROM footer_sections WHERE title = 'Quick Links' LIMIT 1);
SET @servicesId = (SELECT id FROM footer_sections WHERE title = 'Services' LIMIT 1);
SET @contactId = (SELECT id FROM footer_sections WHERE title = 'Contact' LIMIT 1);

-- Insert Footer Links for Quick Links section
INSERT INTO footer_links (label, url, sectionId, displayOrder, isActive) VALUES
('Home', '/', @quickLinksId, 1, 1),
('Rooms', '/rooms', @quickLinksId, 2, 1),
('About', '/about', @quickLinksId, 3, 1)
ON DUPLICATE KEY UPDATE label=VALUES(label), url=VALUES(url);

-- Insert Footer Links for Services section
INSERT INTO footer_links (label, url, sectionId, displayOrder, isActive) VALUES
('Room Booking', '/rooms', @servicesId, 1, 1),
('Convention Hall', '/convention-hall', @servicesId, 2, 1)
ON DUPLICATE KEY UPDATE label=VALUES(label), url=VALUES(url);

-- Insert Footer Links for Contact section
INSERT INTO footer_links (label, url, sectionId, displayOrder, isActive) VALUES
('Email Us', 'mailto:info@lakeviewresort.com', @contactId, 1, 1),
('Call Us', 'tel:+1234567890', @contactId, 2, 1),
('Visit Us', '#address', @contactId, 3, 1)
ON DUPLICATE KEY UPDATE label=VALUES(label), url=VALUES(url);

-- Show inserted data
SELECT 'Navbar Links:' as 'Section';
SELECT * FROM navbar_links;

SELECT 'Footer Sections:' as 'Section';
SELECT * FROM footer_sections;

SELECT 'Footer Links:' as 'Section';
SELECT fl.*, fs.title as section_title 
FROM footer_links fl 
JOIN footer_sections fs ON fl.sectionId = fs.id 
ORDER BY fs.displayOrder, fl.displayOrder;
