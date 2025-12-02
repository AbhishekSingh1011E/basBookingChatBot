# ⏱️ Rate Limiting System - Bus Booking Chatbot

## 🎯 Overview

Your bus booking chatbot now has **strict rate limiting** to control access:

### 📊 Limits:
1. **Daily System Limit:** Only **5 unique users** can access per day (24 hours)
2. **Per-User Limit:** Each user can make **4 booking requests** per day (24 hours)
3. **Admin Exemption:** Admin users bypass all rate limits

---

## 🔢 How It Works

### System-Wide Daily Limit (5 Users/Day)

```
Day 1, 8:00 AM:
- User1 accesses → ✅ Allowed (1/5)
- User2 accesses → ✅ Allowed (2/5)
- User3 accesses → ✅ Allowed (3/5)
- User4 accesses → ✅ Allowed (4/5)
- User5 accesses → ✅ Allowed (5/5) FULL!

Day 1, 2:00 PM:
- User6 tries to access → ❌ DENIED!
  "Daily access limit reached. Only 5 users can access per day. Try again tomorrow."

- User2 tries again → ✅ Allowed (already in today's list)
- User1 tries again → ✅ Allowed (already in today's list)

Day 2, 12:00 AM:
- Counter resets → 0/5
- User6 can now access ✅
```

### Per-User Request Limit (4 Requests/Day)

```
User "abhishek":
- Request 1: "Hello" → ✅ Allowed (1/4, 3 remaining)
- Request 2: "Delhi to Mumbai" → ✅ Allowed (2/4, 2 remaining)
- Request 3: "Book BUS001" → ✅ Allowed (3/4, 1 remaining)
- Request 4: "2 seats" → ✅ Allowed (4/4, 0 remaining)
- Request 5: "Confirm" → ❌ DENIED!
  "You have reached your daily booking limit (4 requests per day). Try again tomorrow."

Next day at 12:00 AM:
- Counter resets → 0/4
- User can make 4 new requests ✅
```

### Admin Bypass

```
User "admin123" (isAdmin: true):
- Request 1 → ✅ Allowed
- Request 2 → ✅ Allowed
- Request 3 → ✅ Allowed
- ...
- Request 100 → ✅ Allowed

⭐ Admins have unlimited access!
```

---

## 📝 Error Messages

### When Daily System Limit Reached:
```json
{
  "error": "Daily Limit Reached",
  "message": "Daily access limit reached. Only 5 users can access per day. Try again tomorrow.",
  "currentCount": 5,
  "limit": 5,
  "rateLimited": true
}
```
**HTTP Status:** `429 Too Many Requests`

### When User Request Limit Exceeded:
```json
{
  "error": "Request Limit Exceeded",
  "message": "You have reached your daily booking limit (4 requests per day). Try again tomorrow.",
  "count": 4,
  "limit": 4,
  "rateLimited": true
}
```
**HTTP Status:** `429 Too Many Requests`

---

## 🛠️ Admin Tools

### View Daily System Stats

See how many users have accessed today:

```bash
curl -X POST http://localhost:4000/admin/stats/daily \
  -H "Content-Type: application/json" \
  -d '{"adminId": "admin123"}'
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "date": "2025-12-02",
    "uniqueUsers": 3,
    "remainingSlots": 2,
    "userIds": ["user1", "user2", "user3"]
  }
}
```

### View User Stats

Check a specific user's usage:

```bash
curl -X GET http://localhost:4000/admin/users/user123 \
  -H "Content-Type: application/json" \
  -d '{"adminId": "admin123"}'
```

**Response includes:**
```json
{
  "success": true,
  "user": {...},
  "stats": {
    "dailyRequests": 3,
    "remainingRequests": 1,
    "lastRequestDate": "2025-12-02",
    "noShowCount": 0,
    "isBlocked": false,
    "isAdmin": false
  }
}
```

### Reset User's Daily Limit

Give a user extra requests:

```bash
curl -X POST http://localhost:4000/admin/users/reset-limit \
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
  "message": "User user123's daily limit has been reset"
}
```

---

## 🔄 Reset Schedule

### Automatic Resets:

Both limits reset automatically at **midnight (00:00)** every day:

| Time | System Limit | User Limits |
|------|--------------|-------------|
| 11:59 PM | 5/5 users | user1: 4/4 requests |
| 12:00 AM | **0/5 users** ✅ | **user1: 0/4 requests** ✅ |

**Note:** Resets are based on **date**, not 24-hour sliding window.

---

## 💡 Use Cases

### Use Case 1: High-Traffic Day

```
Scenario: 10 people try to use the chatbot in one day

Result:
- First 5 users: ✅ Get full access (4 requests each)
- Next 5 users: ❌ Denied - must wait until tomorrow
- Total requests handled: 5 users × 4 requests = 20 requests max
```

### Use Case 2: User Tries to Spam

```
User "spammer" sends 10 messages rapidly:

Message 1: ✅ "Hello" (1/4)
Message 2: ✅ "Show buses" (2/4)
Message 3: ✅ "Book ticket" (3/4)
Message 4: ✅ "Confirm" (4/4)
Message 5: ❌ BLOCKED - "Daily limit reached"
Message 6-10: ❌ BLOCKED
```

### Use Case 3: VIP/Admin User

```
Admin needs to test the system with 50 test bookings:

All 50 requests: ✅ Allowed
No limits apply to admins
```

---

## 📊 Database Tracking

### User Table (Updated):
```
- dailyRequestCount: Number of requests today
- lastRequestDate: Date of last request (YYYY-MM-DD)
```

### DailyAccess Table (New):
```
- date: Current date (YYYY-MM-DD)
- uniqueUsers: Count of unique users
- userIds: JSON array of user IDs who accessed today
```

---

## 🎯 Benefits

1. **Prevents Abuse** - Stops users from spamming the system
2. **Fair Access** - Ensures everyone gets a chance to use the service
3. **Resource Management** - Controls server load
4. **Scalability** - Easy to adjust limits (change 5 to 10, or 4 to 8)
5. **Admin Control** - Admins can override limits when needed

---

## ⚙️ Customizing Limits

Want to change the limits? Edit these values in `/api/src/db/index.js`:

### Change Daily User Limit (currently 5):
```javascript
// Line ~295
if (userIdsList.length >= 5) {  // Change this number
```

### Change Per-User Request Limit (currently 4):
```javascript
// Line ~320
if (user.dailyRequestCount >= 4) {  // Change this number
```

**Don't forget to restart the backend after changes!**

---

## 🧪 Testing Rate Limits

### Test 1: System Limit

```bash
# As user1
curl -X POST http://localhost:4000/chat \
  -H "Content-Type: application/json" \
  -d '{"userId":"user1","message":"Hello"}'

# As user2-5 (repeat with different userIds)
# ...

# As user6 (should be denied)
curl -X POST http://localhost:4000/chat \
  -H "Content-Type: application/json" \
  -d '{"userId":"user6","message":"Hello"}'
```

### Test 2: User Request Limit

```bash
# Send 5 messages as same user
for i in {1..5}; do
  curl -X POST http://localhost:4000/chat \
    -H "Content-Type: application/json" \
    -d "{\"userId\":\"test_user\",\"message\":\"Request $i\"}"
  echo ""
done

# Last message should be denied
```

### Test 3: Admin Bypass

```bash
# Send 10 messages as admin (all should work)
for i in {1..10}; do
  curl -X POST http://localhost:4000/chat \
    -H "Content-Type: application/json" \
    -d "{\"userId\":\"admin123\",\"message\":\"Admin request $i\"}"
  echo ""
done
```

---

## 🚨 Important Notes

1. **Date-Based Reset** - Limits reset at midnight, not 24 hours after first access
2. **Admin Immunity** - Admins are never rate limited
3. **First Access Counts** - Once a user accesses, they're counted in daily limit even if they don't complete booking
4. **Per-Request Count** - Every chat message counts as a request (not just bookings)
5. **Database Persistent** - Counters survive server restarts

---

## 📞 User Communication

When users hit limits, show friendly messages:

### Frontend Integration Example:
```javascript
try {
  const response = await axios.post('/chat', { userId, message });
  // Handle normal response
} catch (error) {
  if (error.response?.data?.rateLimited) {
    if (error.response.data.error === 'Daily Limit Reached') {
      alert('Sorry, the system has reached its daily limit of 5 users. Please try again tomorrow!');
    } else if (error.response.data.error === 'Request Limit Exceeded') {
      alert('You have used all 4 of your daily requests. Please come back tomorrow!');
    }
  }
}
```

---

## 📈 Monitoring

Track usage patterns:

```bash
# Daily overview
curl -X POST http://localhost:4000/admin/stats/daily \
  -H "Content-Type: application/json" \
  -d '{"adminId":"admin123"}'

# Individual user check
curl -X GET http://localhost:4000/admin/users/user123 \
  -H "Content-Type: application/json" \
  -d '{"adminId":"admin123"}'
```

---

**Your rate limiting system is now active!** ⏱️

- ✅ Max 5 users per day
- ✅ Max 4 requests per user per day
- ✅ Admins unlimited
- ✅ Auto-resets at midnight
- ✅ Admin controls available


