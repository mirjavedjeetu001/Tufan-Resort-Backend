-- Tufan Resort Database Setup
-- Run this script to set up the database and create initial data

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS tufan_resort CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tufan_resort;

-- Note: Tables will be auto-created by TypeORM on backend startup

-- Sample data insertion queries (run after backend starts and tables are created)

-- Sample Resort Info
-- INSERT INTO resort_info (id, aboutText, missionText, address, phone, email, mapEmbedUrl, facilities, socialLinks, updatedAt)
-- VALUES (
--   1,
--   'Welcome to Tufan Resort, where luxury meets nature. Nestled in the heart of pristine landscapes, we offer world-class hospitality and unforgettable experiences.',
--   'Our mission is to provide guests with exceptional service, comfort, and memorable experiences that exceed expectations.',
--   '123 Resort Lane, Beautiful City, Country',
--   '+880-123-456789',
--   'info@tufanresort.com',
--   'https://www.google.com/maps/embed?pb=...',
--   '["Swimming Pool","Spa & Wellness","Restaurant","Gym","Garden","Parking"]',
--   '{"facebook":"https://facebook.com/tufanresort","instagram":"https://instagram.com/tufanresort"}',
--   NOW()
-- );

-- Sample Rooms (run after backend creates tables)
-- INSERT INTO rooms (name, type, description, pricePerNight, maxGuests, numberOfBeds, amenities, images, status, createdAt, updatedAt)
-- VALUES 
-- ('Deluxe Ocean View', 'deluxe', 'Spacious room with stunning ocean views, perfect for couples.', 150.00, 2, 1, 'WiFi,AC,TV,Mini Bar,Ocean View', '[]', 'available', NOW(), NOW()),
-- ('Family Suite', 'family', 'Large family suite with separate bedroom and living area.', 250.00, 6, 3, 'WiFi,AC,TV,Mini Bar,Kitchenette,Balcony', '[]', 'available', NOW(), NOW()),
-- ('Standard Room', 'standard', 'Comfortable standard room with all basic amenities.', 80.00, 2, 1, 'WiFi,AC,TV', '[]', 'available', NOW(), NOW());

-- Sample Convention Hall
-- INSERT INTO convention_hall (name, description, dimensions, maxCapacity, amenities, images, eventTypes, timeSlots, createdAt, updatedAt)
-- VALUES (
--   'Grand Ballroom',
--   'State-of-the-art convention hall perfect for weddings, conferences, and corporate events.',
--   5000.00,
--   200,
--   'Sound System,Projector,Stage,AC,Catering Kitchen,Parking',
--   '[]',
--   'Wedding,Conference,Corporate Event,Birthday Party,Cultural Event',
--   'Morning (8AM-12PM),Afternoon (1PM-5PM),Evening (6PM-10PM),Full Day (8AM-10PM)',
--   NOW(),
--   NOW()
-- );

-- Sample Hero Slides
-- INSERT INTO hero_slides (title, description, image, `order`, isActive, createdAt, updatedAt)
-- VALUES 
-- ('Welcome to Tufan Resort', 'Discover Luxury & Tranquility', '/uploads/hero/slide1.jpg', 0, 1, NOW(), NOW()),
-- ('Premium Accommodations', 'Experience World-Class Comfort', '/uploads/hero/slide2.jpg', 1, 1, NOW(), NOW()),
-- ('Convention Facilities', 'Perfect Venue for Your Events', '/uploads/hero/slide3.jpg', 2, 1, NOW(), NOW());

-- Admin user creation (use API endpoint instead)
-- POST /auth/register
-- {
--   "email": "owner@tufanresort.com",
--   "password": "SecurePass123!",
--   "name": "Resort Owner",
--   "role": "owner"
-- }

SELECT 'Database setup script completed. Run backend to create tables, then insert sample data.' AS message;
