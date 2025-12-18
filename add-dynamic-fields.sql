-- Add new dynamic fields to resort_info table
ALTER TABLE resort_info 
ADD COLUMN IF NOT EXISTS resortName VARCHAR(255),
ADD COLUMN IF NOT EXISTS resortTagline VARCHAR(255),
ADD COLUMN IF NOT EXISTS logoUrl VARCHAR(500),
ADD COLUMN IF NOT EXISTS navbarTitle VARCHAR(255),
ADD COLUMN IF NOT EXISTS footerDescription TEXT,
ADD COLUMN IF NOT EXISTS facebookUrl VARCHAR(500),
ADD COLUMN IF NOT EXISTS instagramUrl VARCHAR(500),
ADD COLUMN IF NOT EXISTS twitterUrl VARCHAR(500),
ADD COLUMN IF NOT EXISTS copyrightText TEXT;

-- Set default values if resort_info already has a record
UPDATE resort_info 
SET 
  resortName = COALESCE(resortName, 'Tufan Resort'),
  resortTagline = COALESCE(resortTagline, 'Your Lakeside Paradise'),
  navbarTitle = COALESCE(navbarTitle, 'Tufan Resort'),
  footerDescription = COALESCE(footerDescription, 'Experience luxury and tranquility in the heart of nature. Where every moment becomes a cherished memory.'),
  copyrightText = COALESCE(copyrightText, '© ২০২৫ Tufan Resort. সর্বস্বত্ব সংরক্ষিত / All rights reserved.\n\nMade in Bangladesh 🇧🇩 with ❤️')
WHERE id = 1;
