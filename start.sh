#!/bin/bash

echo "🏨 Tufan Resort Website - Quick Start Script"
echo "============================================="
echo ""

# Check if MySQL is running
echo "📋 Checking MySQL status..."
if ! systemctl is-active --quiet mysql; then
    echo "❌ MySQL is not running. Please start MySQL first:"
    echo "   sudo systemctl start mysql"
    exit 1
fi
echo "✅ MySQL is running"
echo ""

# Check if database exists
echo "📋 Checking database..."
DB_EXISTS=$(mysql -u root -p -e "SHOW DATABASES LIKE 'tufan_resort';" | grep "tufan_resort" > /dev/null; echo "$?")
if [ $DB_EXISTS -ne 0 ]; then
    echo "⚠️  Database 'tufan_resort' does not exist."
    echo "Creating database..."
    mysql -u root -p -e "CREATE DATABASE tufan_resort CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    echo "✅ Database created"
else
    echo "✅ Database exists"
fi
echo ""

# Start backend
echo "🚀 Starting backend server..."
cd lakeview-backend
npm run start:dev &
BACKEND_PID=$!
echo "✅ Backend started on http://localhost:3001 (PID: $BACKEND_PID)"
echo ""

# Wait for backend to initialize
echo "⏳ Waiting for backend to initialize..."
sleep 5
echo ""

# Start frontend
echo "🚀 Starting frontend application..."
cd ../lakeview-frontend
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started on http://localhost:3000 (PID: $FRONTEND_PID)"
echo ""

echo "============================================="
echo "✨ Tufan Resort Website is now running!"
echo "============================================="
echo ""
echo "📍 Access Points:"
echo "   • Public Website: http://localhost:3000"
echo "   • Admin Dashboard: http://localhost:3000/admin"
echo "   • API Server: http://localhost:3001"
echo ""
echo "🔑 Default Admin Credentials:"
echo "   • Email: owner@tufanresort.com"
echo "   • Password: SecurePass123!"
echo "   (Create this user via API first - see README.md)"
echo ""
echo "📖 For detailed documentation, see README.md"
echo ""
echo "To stop the servers, press Ctrl+C or run:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Keep script running
wait
