# 🚫 User Blocking System - Bus Booking Chatbot

## ✅ What Was Implemented

Your bus booking chatbot now has a complete **user management and blocking system** with these features:

### 1. **Automatic User Blocking** 
- Users who don't show up for their bookings are tracked
- After **3 no-shows**, users are automatically **blocked**
- Blocked users cannot make any more bookings

### 2. **Admin-Only Access**
- Only admin users can:
  - View all users and bookings
  - Block/unblock users
  - Update booking statuses
  - Make other users admins
- Regular users cannot access admin features

### 3. **Booking Status Tracking**
- **pending** - Booking created, waiting for travel date
- **completed** - User completed the journey successfully
- **no-show** - User didn't show up for their booking
- **cancelled** - Booking was cancelled

---

## 🔐 Your Admin Credentials

**Admin User ID:** `admin123`  
**Name:** Admin User  
**Email:** admin@example.com  
**Phone:** 9999999999

Use the Admin User ID (`admin123`) in all admin API requests.

---

## 🚀 How It Works

### For Regular Users:

1. **User Books a Bus:**
   - User chats with the bot and books a ticket
   - Booking is saved with status: `pending`
   - User info is saved in database

2. **User Doesn't Show Up:**
   - Admin marks booking as `no-show`
   - User's no-show counter increases
   - After 3 no-shows: **User is automatically blocked**

3. **Blocked User Tries to Book:**
   - User sends message to chatbot
   - Bot checks if user is blocked
   - If blocked, returns error: *"Your account has been blocked. Reason: Multiple no-shows"*
   - User cannot proceed with booking

### For Admin Users:

1. **Monitor Users:**
   - View all users and their booking history
   - Check no-show counts
   - See blocked/active users

2. **Manage Bookings:**
   - Mark bookings as completed/no-show/cancelled
   - View all bookings in the system

3. **User Management:**
   - Block problematic users manually
   - Unblock users who deserve a second chance
   - Create additional admin users

---

## 📊 Example Scenarios

### Scenario 1: User with 3 No-Shows Gets Blocked

```
Day 1: User books BUS001 (Delhi → Mumbai)
       → Doesn't show up
       → Admin marks as "no-show"
       → noShowCount = 1 ✅ Still active

Day 5: User books BUS002 (Bangalore → Chennai)
       → Doesn't show up again
       → Admin marks as "no-show"
       → noShowCount = 2 ⚠️ Warning (still active)

Day 10: User books BUS003 (Pune → Mumbai)
        → Doesn't show up AGAIN
        → Admin marks as "no-show"
        → noShowCount = 3
        → 🚫 USER AUTOMATICALLY BLOCKED!

Day 15: User tries to book another bus
        → Bot: "Your account has been blocked. Reason: Blocked due to 3 no-shows"
        → ❌ Cannot proceed
```

### Scenario 2: Admin Manually Blocks User

```
Admin notices fraudulent activity:
1. Admin calls: POST /admin/users/block
2. Provides userId and reason
3. User is immediately blocked
4. User cannot make any bookings
```

### Scenario 3: Admin Gives Second Chance

```
User contacts admin after being blocked:
1. Admin reviews user's history
2. Admin calls: POST /admin/users/unblock
3. User's noShowCount resets to 0
4. User can book again ✅
```

---

## 🛠️ Quick Admin Commands

### Check All Users
```bash
curl -X POST http://localhost:4000/admin/users \
  -H "Content-Type: application/json" \
  -d '{"adminId": "admin123"}'
```

### Block a User
```bash
curl -X POST http://localhost:4000/admin/users/block \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "admin123",
    "userId": "problem_user",
    "reason": "Repeated no-shows"
  }'
```

### Unblock a User
```bash
curl -X POST http://localhost:4000/admin/users/unblock \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "admin123",
    "userId": "reformed_user"
  }'
```

### View All Bookings
```bash
curl -X POST http://localhost:4000/admin/bookings \
  -H "Content-Type: application/json" \
  -d '{"adminId": "admin123"}'
```

### Mark Booking as No-Show
```bash
curl -X POST http://localhost:4000/admin/bookings/update-status \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "admin123",
    "bookingId": "RB123456",
    "status": "no-show"
  }'
```

### Get User Details
```bash
curl -X GET http://localhost:4000/admin/users/user123 \
  -H "Content-Type: application/json" \
  -d '{"adminId": "admin123"}'
```

---

## 📁 Database Structure

### Users Table
- `userId` - Unique user identifier
- `fullName` - User's full name
- `email` - User's email
- `phone` - User's phone number
- `isBlocked` - Whether user is blocked (true/false)
- `isAdmin` - Whether user is admin (true/false)
- `noShowCount` - Number of no-shows
- `blockedReason` - Reason for blocking

### Bookings Table
- `bookingId` - Unique booking ID (e.g., RB123456)
- `userId` - User who made the booking
- `pnr` - PNR number
- `busId` - Bus ID
- `busName` - Name of the bus
- `from` - Source city
- `to` - Destination city
- `date` - Journey date
- `seats` - Number of seats
- `totalPrice` - Total price
- `status` - pending/completed/no-show/cancelled
- `passengerName` - Passenger name
- `passengerEmail` - Passenger email
- `passengerPhone` - Passenger phone

---

## 🔒 Admin Protection

- **Admins cannot be blocked** - Even with no-shows, admin accounts remain active
- **Admin check on all endpoints** - Every admin endpoint verifies admin status
- **Multiple admins supported** - You can create multiple admin accounts

---

## 📱 User Experience

### When User is Active:
```
User: Hello
Bot: 🚌 Welcome to RedBus! Where would you like to travel?
User: Delhi to Mumbai
Bot: [Shows available buses]
✅ Everything works normally
```

### When User is Blocked:
```
User: Hello
Bot: ❌ Your account has been blocked. 
     Reason: Blocked due to 3 no-shows. 
     Please contact admin.
     
User: [Cannot proceed with booking]
```

---

## 🎯 Summary

### ✅ What You Have Now:

1. **User Tracking System**
   - All users are tracked in database
   - No-show counts monitored
   - Automatic blocking at 3 no-shows

2. **Admin Panel (API)**
   - View all users
   - Block/unblock users
   - Manage bookings
   - Update booking statuses
   - Make other users admins

3. **Booking Management**
   - All bookings saved to database
   - Status tracking (pending/completed/no-show/cancelled)
   - Linked to user accounts

4. **Access Control**
   - Blocked users cannot book
   - Only admins can access admin endpoints
   - Admins are immune to blocking

---

## 📖 Documentation Files

1. **ADMIN_GUIDE.md** - Complete admin API documentation
2. **USER_BLOCKING_SYSTEM.md** - This file (overview)
3. **QUICK_START.md** - How to run the chatbot
4. **REDBUS_INTEGRATION.md** - RedBus API integration guide

---

## 🚀 Next Steps

1. **Test the System:**
   - Book a ticket as a regular user
   - Mark it as no-show as admin
   - See the counter increase

2. **Create More Admins:**
   ```bash
   cd api
   node scripts/quickAdmin.js
   ```
   Edit the script to add different credentials

3. **Build Admin Dashboard:**
   - Create a web interface for admin panel
   - Show user statistics
   - Display no-show trends

4. **Add Notifications:**
   - Email users after 2 no-shows
   - SMS alerts for blocked accounts
   - Admin notifications for fraudulent activity

---

**Your bus booking chatbot now has enterprise-level user management!** 🎉


