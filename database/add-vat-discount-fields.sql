-- Add VAT and enhanced discount fields to convention_bookings table

ALTER TABLE convention_bookings 
ADD COLUMN discountType ENUM('flat', 'percentage') DEFAULT 'flat' AFTER discount,
ADD COLUMN discountValue DECIMAL(10,2) DEFAULT 0 AFTER discountType,
ADD COLUMN vatAmount DECIMAL(10,2) DEFAULT 0 AFTER discountValue,
ADD COLUMN vatPercentage DECIMAL(10,2) DEFAULT 0 AFTER vatAmount;

-- Update existing records to set discountValue = discount for backward compatibility
UPDATE convention_bookings SET discountValue = discount WHERE discount > 0;

SELECT 'VAT and discount fields added successfully!' as Status;
