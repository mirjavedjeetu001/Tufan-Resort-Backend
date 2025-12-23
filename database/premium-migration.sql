-- Premium Hotel & Convention Management System - Database Migration
-- Run this script to add all new features

-- 1. Add room number to rooms table
ALTER TABLE rooms ADD COLUMN roomNumber VARCHAR(50) UNIQUE AFTER id;

-- 2. Add guest photo and document uploads to bookings
ALTER TABLE bookings ADD COLUMN customerPhoto VARCHAR(255) AFTER customerNid;
ALTER TABLE bookings ADD COLUMN customerNidDocument VARCHAR(255) AFTER customerPhoto;

-- 3. Add extra charges to bookings
ALTER TABLE bookings ADD COLUMN extraCharges DECIMAL(10,2) DEFAULT 0 AFTER remainingPayment;
ALTER TABLE bookings ADD COLUMN extraChargesDescription TEXT AFTER extraCharges;

-- 4. Add check-in/check-out times
ALTER TABLE bookings ADD COLUMN checkInTime TIME AFTER notes;
ALTER TABLE bookings ADD COLUMN checkOutTime TIME AFTER checkInTime;

-- 5. Create food packages table
CREATE TABLE IF NOT EXISTS food_packages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  pricePerPerson DECIMAL(10,2) NOT NULL,
  items TEXT NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. Create addon services table
CREATE TABLE IF NOT EXISTS addon_services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category ENUM('decoration', 'sound_system', 'photography', 'catering', 'transport', 'other') DEFAULT 'other',
  price DECIMAL(10,2) NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 7. Enhance convention bookings table
ALTER TABLE convention_bookings ADD COLUMN organizationName VARCHAR(255) AFTER eventType;
ALTER TABLE convention_bookings ADD COLUMN eventDescription TEXT AFTER organizationName;
ALTER TABLE convention_bookings ADD COLUMN foodPackageId INT AFTER numberOfGuests;
ALTER TABLE convention_bookings ADD COLUMN foodCost DECIMAL(10,2) DEFAULT 0 AFTER foodPackageId;
ALTER TABLE convention_bookings ADD COLUMN selectedAddons JSON AFTER foodCost;
ALTER TABLE convention_bookings ADD COLUMN addonsCost DECIMAL(10,2) DEFAULT 0 AFTER selectedAddons;
ALTER TABLE convention_bookings ADD COLUMN hallRent DECIMAL(10,2) DEFAULT 0 AFTER addonsCost;
ALTER TABLE convention_bookings ADD COLUMN discount DECIMAL(10,2) DEFAULT 0 AFTER hallRent;

-- 8. Insert sample food packages
INSERT INTO food_packages (name, description, pricePerPerson, items, isActive) VALUES
('Package A - Basic', 'Simple meal with essential items', 350.00, 'Rice,Dal,Chicken Curry,Vegetable,Salad,Soft Drink', TRUE),
('Package B - Standard', 'Standard meal with variety', 550.00, 'Rice,Polao,Dal,Chicken Curry,Beef Curry,Vegetable,Salad,Raita,Soft Drink,Dessert', TRUE),
('Package C - Premium', 'Premium meal with full course', 850.00, 'Rice,Polao,Biryani,Dal,Chicken Roast,Beef Curry,Fish Fry,Vegetable,Salad,Raita,Soft Drink,Juice,Ice Cream,Firni', TRUE),
('Package D - Deluxe', 'Luxury buffet with all items', 1200.00, 'Rice,Polao,Biryani,Khichuri,Dal,Chicken Roast,Mutton Curry,Beef Curry,Fish Fry,Prawn,Vegetable,Mixed Salad,Raita,Borhani,Soft Drink,Juice,Ice Cream,Halwa,Firni', TRUE);

-- 9. Insert sample addon services
INSERT INTO addon_services (name, description, category, price, isActive) VALUES
('Stage Decoration', 'Beautiful stage decoration with flowers and lights', 'decoration', 15000.00, TRUE),
('Sound System', 'Professional sound system with microphone', 'sound_system', 8000.00, TRUE),
('Photography', 'Professional photographer for full event coverage', 'photography', 20000.00, TRUE),
('Videography', 'Professional video coverage with editing', 'photography', 35000.00, TRUE),
('LED Screen', 'Large LED screen for presentations', 'sound_system', 12000.00, TRUE),
('Flower Decoration', 'Fresh flower decoration for tables and entrance', 'decoration', 10000.00, TRUE),
('Welcome Arch', 'Decorative welcome arch at entrance', 'decoration', 5000.00, TRUE),
('Extra Chairs', 'Additional chairs (per 50 chairs)', 'other', 2000.00, TRUE),
('AC Service', 'Additional AC units for comfort', 'other', 5000.00, TRUE),
('Generator', 'Backup power generator', 'other', 8000.00, TRUE);

-- 10. Update existing rooms with room numbers (if not already set)
UPDATE rooms SET roomNumber = CONCAT('R', LPAD(id, 3, '0')) WHERE roomNumber IS NULL;

-- Verification Queries
SELECT 'Rooms with room numbers:' as 'Status', COUNT(*) as 'Count' FROM rooms WHERE roomNumber IS NOT NULL;
SELECT 'Food Packages created:' as 'Status', COUNT(*) as 'Count' FROM food_packages;
SELECT 'Addon Services created:' as 'Status', COUNT(*) as 'Count' FROM addon_services;
