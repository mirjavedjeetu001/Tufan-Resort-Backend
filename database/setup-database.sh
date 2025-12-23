#!/bin/bash

echo "==================================="
echo "Tufan Resort - Database Setup"
echo "==================================="
echo ""

# Check if MySQL is running
if ! systemctl is-active --quiet mysql 2>/dev/null && ! pgrep -x mysqld > /dev/null; then
    echo "⚠️  MySQL is not running. Starting MySQL..."
    sudo systemctl start mysql
    sleep 2
fi

echo "📋 Please provide your MySQL root password when prompted."
echo ""

# Create database and set up user
mysql -u root -p <<MYSQL_SCRIPT
-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS tufan_resort CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create a dedicated user for the application (optional but recommended)
-- If you prefer to use root, skip this and just update .env with your root password
CREATE USER IF NOT EXISTS 'tufan_user'@'localhost' IDENTIFIED BY 'TufanResort2025!';
GRANT ALL PRIVILEGES ON tufan_resort.* TO 'tufan_user'@'localhost';
FLUSH PRIVILEGES;

-- Show databases
SHOW DATABASES LIKE 'tufan_resort';

-- Show user privileges
SHOW GRANTS FOR 'tufan_user'@'localhost';
MYSQL_SCRIPT

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database setup completed successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Update lakeview-backend/.env with one of these options:"
    echo ""
    echo "      Option A - Use dedicated user (recommended):"
    echo "      DATABASE_USER=tufan_user"
    echo "      DATABASE_PASSWORD=TufanResort2025!"
    echo ""
    echo "      Option B - Use root user:"
    echo "      DATABASE_USER=root"
    echo "      DATABASE_PASSWORD=your_root_password"
    echo ""
    echo "   2. Restart the backend server"
    echo ""
else
    echo ""
    echo "❌ Database setup failed. Please check your MySQL installation and credentials."
fi
