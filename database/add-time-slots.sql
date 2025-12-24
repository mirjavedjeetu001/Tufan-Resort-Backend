-- Add time slot columns to bookings table
ALTER TABLE bookings 
ADD COLUMN checkInTime TIME NULL AFTER checkInDate,
ADD COLUMN checkOutTime TIME NULL AFTER checkOutDate;

-- Add time slot columns to convention_bookings table
ALTER TABLE convention_bookings 
ADD COLUMN startTime TIME NULL AFTER eventDate,
ADD COLUMN endTime TIME NULL AFTER startTime,
MODIFY COLUMN timeSlot VARCHAR(255) NULL;

-- Update existing records with default time slots
UPDATE bookings 
SET checkInTime = '14:00:00', 
    checkOutTime = '12:00:00' 
WHERE checkInTime IS NULL;

UPDATE convention_bookings 
SET startTime = '09:00:00', 
    endTime = '18:00:00' 
WHERE startTime IS NULL;
