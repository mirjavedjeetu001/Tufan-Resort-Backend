-- Add new dynamic fields to resort_info table (MySQL 8.0 compatible)

-- Add resortName column
ALTER TABLE resort_info ADD COLUMN resortName VARCHAR(255);

-- Add resortTagline column
ALTER TABLE resort_info ADD COLUMN resortTagline VARCHAR(255);

-- Add logoUrl column
ALTER TABLE resort_info ADD COLUMN logoUrl VARCHAR(500);

-- Add navbarTitle column
ALTER TABLE resort_info ADD COLUMN navbarTitle VARCHAR(255);

-- Add footerDescription column
ALTER TABLE resort_info ADD COLUMN footerDescription TEXT;

-- Add facebookUrl column
ALTER TABLE resort_info ADD COLUMN facebookUrl VARCHAR(500);

-- Add instagramUrl column
ALTER TABLE resort_info ADD COLUMN instagramUrl VARCHAR(500);

-- Add twitterUrl column
ALTER TABLE resort_info ADD COLUMN twitterUrl VARCHAR(500);

-- Add copyrightText column
ALTER TABLE resort_info ADD COLUMN copyrightText TEXT;

-- Set default values for existing record
UPDATE resort_info 
SET 
  resortName = 'Tufan Resort',
  resortTagline = 'Your Lakeside Paradise',
  navbarTitle = 'Tufan Resort',
  footerDescription = 'Experience luxury and tranquility in the heart of nature. Where every moment becomes a cherished memory.',
  copyrightText = '© ২০২৫ Tufan Resort. সর্বস্বত্ব সংরক্ষিত / All rights reserved.\n\nMade in Bangladesh 🇧🇩 with ❤️'
WHERE id = 1;
