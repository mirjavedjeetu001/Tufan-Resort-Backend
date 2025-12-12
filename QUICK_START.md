# 🏨 Tufan Resort - Quick Start Guide

## 📋 Current Status

✅ **Frontend**: Running at http://localhost:3000  
⚠️ **Backend**: Running but waiting for database connection  
❌ **Database**: Needs setup

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Setup Database

Run the setup script:
```bash
cd /home/javed/Desktop/javed/lake-view
./setup-database.sh
```

This will:
- Create `tufan_resort` database
- Create a dedicated `tufan_user` with password `TufanResort2025!`

### Step 2: Update Backend Configuration

**Option A - Use dedicated user (Recommended):**
```bash
cd lakeview-backend
nano .env
```

Update these lines:
```env
DATABASE_USER=tufan_user
DATABASE_PASSWORD=TufanResort2025!
```

**Option B - Use root user:**
Update `.env` with your MySQL root password:
```env
DATABASE_USER=root
DATABASE_PASSWORD=your_actual_root_password
```

### Step 3: Restart Backend

```bash
cd /home/javed/Desktop/javed/lake-view/lakeview-backend
npm run start:dev
```

The backend will:
- Connect to MySQL successfully ✅
- Auto-create all tables (users, rooms, bookings, etc.)
- Start API server on http://localhost:3001

---

## 🎯 After Database Setup

### Create Your First Admin Account

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tufanresort.com",
    "password": "Admin@123",
    "name": "Resort Admin",
    "role": "owner"
  }'
```

### Login to Admin Dashboard

1. Visit: http://localhost:3000/admin
2. Email: `admin@tufanresort.com`
3. Password: `Admin@123`

---

## 📂 Project Structure

```
lake-view/
├── lakeview-backend/          # NestJS API Server
│   ├── src/
│   │   ├── entities/          # Database models
│   │   ├── auth/              # Authentication
│   │   ├── rooms/             # Room management
│   │   ├── bookings/          # Booking system
│   │   ├── convention-hall/   # Hall management
│   │   └── ...
│   ├── .env                   # Configuration
│   ├── API_TESTING.md        # API documentation
│   └── DEPLOYMENT.md         # Deployment guide
│
└── lakeview-frontend/         # Next.js Website
    ├── app/
    │   ├── page.tsx           # Homepage
    │   ├── rooms/             # Rooms pages
    │   ├── convention-hall/   # Hall page
    │   ├── about/             # About page
    │   └── admin/             # Admin dashboard
    └── components/            # Reusable components
```

---

## 🔧 Common Commands

### Start Both Servers
```bash
# Terminal 1 - Backend
cd /home/javed/Desktop/javed/lake-view/lakeview-backend
npm run start:dev

# Terminal 2 - Frontend  
cd /home/javed/Desktop/javed/lake-view/lakeview-frontend
npm run dev
```

### Check MySQL Status
```bash
systemctl status mysql
```

### Access MySQL Console
```bash
mysql -u tufan_user -p tufan_resort
# Password: TufanResort2025!
```

### View All Tables
```sql
USE tufan_resort;
SHOW TABLES;
```

---

## 🌐 Application URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Public website |
| Admin Login | http://localhost:3000/admin | Admin panel login |
| Backend API | http://localhost:3001 | REST API server |
| API Docs | `lakeview-backend/API_TESTING.md` | All endpoints |

---

## 📝 Features Implemented

### ✅ Public Website
- Homepage with hero carousel
- Rooms listing and details
- Convention hall showcase
- About and contact page
- Responsive design with Tailwind CSS

### ✅ Backend API
- JWT authentication
- User management (owner/staff roles)
- Room CRUD operations
- Booking system
- Convention hall management
- Hero slides (homepage carousel)
- Resort information management
- File uploads (room images)

### ⏳ Admin Dashboard (Structure Ready)
- Login/authentication ✅
- Dashboard overview ✅
- Rooms management (needs UI)
- Bookings management (needs UI)
- Convention hall settings (needs UI)
- Hero slides editor (needs UI)
- User management (needs UI)

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 3001 is in use
lsof -i :3001
# Kill process if needed
kill -9 <PID>
```

### Frontend won't start
```bash
# Check if port 3000 is in use
lsof -i :3000
# Kill process if needed
kill -9 <PID>
```

### Database connection errors
```bash
# Verify MySQL is running
systemctl status mysql

# Test connection
mysql -u tufan_user -p
# If this fails, re-run setup-database.sh
```

### Can't login to admin
- Make sure backend is connected to database
- Create admin user using curl command above
- Check browser console for errors

---

## 📚 Next Steps

1. **Setup Database** (see Step 1 above)
2. **Create Admin Account** (curl command above)
3. **Add Sample Data**:
   - Upload hero slides for homepage
   - Add rooms with images
   - Configure convention hall details
   - Update resort information

4. **Complete Admin Dashboard**:
   - Build room management UI
   - Build booking management UI  
   - Build content editors
   - Add image upload forms

5. **Testing**:
   - Test all public pages
   - Test booking flow
   - Test admin operations
   - Test on mobile devices

---

## 💡 Tips

- **Development**: Both servers auto-reload on file changes
- **Database**: All tables auto-create on first backend start
- **Images**: Upload to `lakeview-backend/uploads/` folder
- **Logs**: Check terminal output for errors
- **API Testing**: Use Postman or curl (see API_TESTING.md)

---

## 🆘 Need Help?

Check these files:
- `lakeview-backend/API_TESTING.md` - All API endpoints
- `lakeview-backend/DEPLOYMENT.md` - Production deployment
- `lakeview-backend/database-setup.sql` - Manual DB setup

---

**Built with**: NestJS + Next.js + MySQL + TypeScript + Tailwind CSS
