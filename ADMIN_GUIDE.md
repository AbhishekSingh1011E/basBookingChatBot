# 🔐 Admin System Guide - Bus Booking Chatbot

## Overview

The admin system allows you to:
- **Block/Unblock Users** - Prevent users from making bookings
- **Automatic Blocking** - Users with 3+ no-shows are auto-blocked
- **View All Users** - See all registered users and their status
- **Manage Bookings** - View and update booking statuses
- **Track No-Shows** - Monitor users who don't show up for their bookings

---

## 🚀 Quick Start

### 1. Create Admin User

Run this command to create your first admin:

```bash
cd /Users/abhisheksingh/boking/basBookingChatBot/api
node scripts/createAdmin.js
```

Follow the prompts to enter:
- Admin User ID (this will be your admin login ID)
- Full Name (optional)
- Email (optional)
- Phone (optional)

**Example:**
```
Enter Admin User ID: admin123
Enter Full Name: Admin User
Enter Email: admin@example.com
Enter Phone: 9876543210
```

---

## 🔧 Admin API Endpoints

All admin endpoints require `adminId` in the request body for authentication.

### Base URL
```
http://localhost:4000/admin
```

---

### 📋 **1. Get All Users**

Get a list of all registered users.

**Endpoint:** `POST /admin/users`

**Request:**
```bash
curl -X POST http://localhost:4000/admin/users \
  -H "Content-Type: application/json" \
  -d '{"adminId": "admin123"}'
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "users": [
    {
      "id": 1,
      "userId": "user123",
      "fullName": "Abhishek Singh",
      "email": "abhishek@email.com",
      "phone": "9876543210",
      "isBlocked": false,
      "isAdmin": false,
      "noShowCount": 0,
      "blockedReason": null,
      "createdAt": "2025-12-02T10:30:00.000Z"
    }
  ]
}
```

---

### 🚫 **2. Block User**

Block a user from making bookings.

**Endpoint:** `POST /admin/users/block`

**Request:**
```bash
curl -X POST http://localhost:4000/admin/users/block \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "admin123",
    "userId": "user123",
    "reason": "Fraudulent activity detected"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User user123 has been blocked",
  "reason": "Fraudulent activity detected"
}
```

---

### ✅ **3. Unblock User**

Unblock a previously blocked user.

**Endpoint:** `POST /admin/users/unblock`

**Request:**
```bash
curl -X POST http://localhost:4000/admin/users/unblock \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "admin123",
    "userId": "user123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User user123 has been unblocked"
}
```

---

### 👤 **4. Get User Info**

Get detailed information about a specific user.

**Endpoint:** `GET /admin/users/:userId`

**Request:**
```bash
curl -X GET http://localhost:4000/admin/users/user123 \
  -H "Content-Type: application/json" \
  -d '{"adminId": "admin123"}'
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "userId": "user123",
    "fullName": "Abhishek Singh",
    "email": "abhishek@email.com",
    "phone": "9876543210",
    "isBlocked": false,
    "isAdmin": false,
    "noShowCount": 2,
    "blockedReason": null
  },
  "bookings": [...],
  "bookingCount": 5
}
```

---

### 🎫 **5. Get All Bookings**

View all bookings in the system.

**Endpoint:** `POST /admin/bookings`

**Request:**
```bash
curl -X POST http://localhost:4000/admin/bookings \
  -H "Content-Type: application/json" \
  -d '{"adminId": "admin123"}'
```

**Response:**
```json
{
  "success": true,
  "count": 50,
  "bookings": [
    {
      "id": 1,
      "bookingId": "RB123456",
      "userId": "user123",
      "pnr": "ABC123XYZ",
      "busId": "BUS001",
      "busName": "Volvo AC Multi-Axle",
      "from": "Delhi",
      "to": "Mumbai",
      "date": "2025-12-15",
      "seats": 2,
      "totalPrice": 2400,
      "status": "pending",
      "passengerName": "Abhishek Singh",
      "passengerEmail": "abhishek@email.com",
      "passengerPhone": "9876543210",
      "createdAt": "2025-12-02T10:30:00.000Z"
    }
  ]
}
```

---

### 📝 **6. Update Booking Status**

Update the status of a booking (completed, no-show, cancelled).

**Endpoint:** `POST /admin/bookings/update-status`

**Request:**
```bash
curl -X POST http://localhost:4000/admin/bookings/update-status \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "admin123",
    "bookingId": "RB123456",
    "status": "no-show"
  }'
```

**Valid Status Values:**
- `pending` - Booking created, awaiting travel
- `completed` - User completed the journey
- `no-show` - User didn't show up (increments no-show count)
- `cancelled` - Booking cancelled

**Response:**
```json
{
  "success": true,
  "message": "Booking RB123456 status updated to no-show"
}
```

**⚠️ Important:** When a booking is marked as `no-show`:
- User's no-show count is incremented
- If no-show count reaches 3, the user is **automatically blocked**

---

### 👑 **7. Make User Admin**

Grant admin privileges to another user.

**Endpoint:** `POST /admin/users/make-admin`

**Request:**
```bash
curl -X POST http://localhost:4000/admin/users/make-admin \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "admin123",
    "userId": "user456"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User user456 is now an admin"
}
```

---

## 🔒 How Automatic Blocking Works

### No-Show Tracking:

1. **First Booking:** User books a bus ticket
2. **No-Show:** Admin marks booking as "no-show"
3. **Counter Increment:** User's `noShowCount` increases by 1
4. **Threshold:** After 3 no-shows, user is **automatically blocked**

### Example Flow:

```
Booking 1: no-show → noShowCount = 1 ✅ Active
Booking 2: no-show → noShowCount = 2 ⚠️ Warning
Booking 3: no-show → noShowCount = 3 🚫 BLOCKED
```

**Blocked users:**
- Cannot make new bookings
- Receive error message when trying to chat
- Must be manually unblocked by admin

---

## 🛡️ Admin Protection

- **Admins cannot be blocked** - Admin users are immune to blocking
- **Admin authentication required** - All admin endpoints check for admin privileges
- **Multiple admins supported** - You can have multiple admin users

---

## 📊 User States

| State | Description | Can Book? |
|-------|-------------|-----------|
| **Active** | Normal user, no issues | ✅ Yes |
| **Warning** | 1-2 no-shows | ⚠️ Yes |
| **Blocked** | 3+ no-shows or admin blocked | ❌ No |
| **Admin** | Admin privileges | ✅ Yes (Cannot be blocked) |

---

## 🔧 Common Admin Tasks

### Block a Problematic User
```bash
curl -X POST http://localhost:4000/admin/users/block \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "admin123",
    "userId": "problem_user",
    "reason": "Repeated cancellations"
  }'
```

### Check User's Booking History
```bash
curl -X GET http://localhost:4000/admin/users/problem_user \
  -H "Content-Type: application/json" \
  -d '{"adminId": "admin123"}'
```

### Mark Booking as Completed
```bash
curl -X POST http://localhost:4000/admin/bookings/update-status \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "admin123",
    "bookingId": "RB123456",
    "status": "completed"
  }'
```

### Give Someone a Second Chance
```bash
curl -X POST http://localhost:4000/admin/users/unblock \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "admin123",
    "userId": "reformed_user"
  }'
```

---

## 📱 Integration with Frontend

The chatbot automatically handles blocked users:

```javascript
// User tries to send message
// Backend checks if user is blocked
// If blocked, returns 403 error

{
  "error": "Access Denied",
  "message": "Your account has been blocked. Reason: Multiple no-shows. Please contact admin.",
  "isBlocked": true
}
```

---

## 🎯 Best Practices

1. **Monitor no-show rates** - Regularly check users with high no-show counts
2. **Provide warnings** - Contact users after 2 no-shows before auto-block
3. **Document blocks** - Always provide a clear reason when manually blocking
4. **Review regularly** - Periodically review blocked users for unblocking
5. **Multiple admins** - Create multiple admin accounts for backup

---

## 🐛 Troubleshooting

### "Access Denied" when using admin endpoints
- Verify your `adminId` is correct
- Check if your user has admin privileges
- Run `createAdmin.js` script to create/verify admin

### User not getting blocked after 3 no-shows
- Check if user is an admin (admins can't be blocked)
- Verify booking status is being set to "no-show"
- Check database for correct `noShowCount`

### Can't unblock a user
- Verify user exists in database
- Check spelling of `userId`
- Ensure you have admin privileges

---

## 📞 Support

For issues with the admin system, check:
1. Backend logs at `/tmp/backend.log`
2. Database file at `api/chatHistory.db`
3. Admin routes at `api/src/routes/admin.route.js`

---

**Your admin system is now ready to use!** 🎉


