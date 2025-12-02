# 🔄 Admin Reset Commands - Rate Limits

## 🔐 Admin-Only Access

Only users with **admin privileges** can reset rate limits. Regular users cannot access these endpoints.

**Your Admin ID:** `admin123`

---

## 🎯 Reset Options

You have 4 different reset options:

### 1️⃣ Reset Single User's Limit
### 2️⃣ Reset Daily System Limit (5 users/day)
### 3️⃣ Reset All Users' Limits
### 4️⃣ Complete System Reset (Everything)

---

## 📝 Commands

### 1. Reset Single User's Daily Limit

Give a specific user fresh 4 requests:

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

**Use When:**
- A user needs extra requests today
- Testing a specific user
- VIP user needs exception

---

### 2. Reset Daily System Limit

Clear the 5 users/day limit (allow 5 new users):

```bash
curl -X POST http://localhost:4000/admin/system/reset-daily-limit \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "admin123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Daily system access limit has been reset. System now accepts 5 new users.",
  "previousUsers": 5,
  "availableSlots": 5
}
```

**Use When:**
- Today's 5 user slots are filled
- Need to allow more users today
- Testing system access

---

### 3. Reset All Users' Limits

Reset every user's request counter (4 requests each):

```bash
curl -X POST http://localhost:4000/admin/system/reset-all-users \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "admin123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "All users' daily request limits have been reset.",
  "usersReset": 15
}
```

**Use When:**
- All users need fresh requests
- End of testing phase
- System maintenance

---

### 4. Complete System Reset ⚡

Reset EVERYTHING - both system limit and all user limits:

```bash
curl -X POST http://localhost:4000/admin/system/reset-all \
  -H "Content-Type: application/json" \
  -d '{
    "adminId": "admin123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Complete system reset successful!",
  "systemLimit": "Reset (5 slots available)",
  "usersReset": 15,
  "note": "All users can now make 4 new requests each"
}
```

**Use When:**
- Fresh start needed
- After heavy testing
- Start of new day manually
- System debugging

---

## 🎯 Quick Reference

| What to Reset | Command | Effect |
|---------------|---------|--------|
| **One User** | `/admin/users/reset-limit` | User gets 4 new requests |
| **System Limit** | `/admin/system/reset-daily-limit` | Allow 5 new users today |
| **All Users** | `/admin/system/reset-all-users` | Everyone gets 4 requests |
| **Everything** | `/admin/system/reset-all` | Full system reset |

---

## 📊 Check Before Reset

Always check current status first:

```bash
# View daily system stats
curl -X POST http://localhost:4000/admin/stats/daily \
  -H "Content-Type: application/json" \
  -d '{"adminId":"admin123"}'

# Check specific user
curl -X GET http://localhost:4000/admin/users/user123 \
  -H "Content-Type: application/json" \
  -d '{"adminId":"admin123"}'
```

---

## 💡 Common Scenarios

### Scenario 1: System Full (5/5 users)

```bash
# Check status
curl -X POST http://localhost:4000/admin/stats/daily \
  -H "Content-Type: application/json" \
  -d '{"adminId":"admin123"}'

# Result: "uniqueUsers": 5, "remainingSlots": 0

# Reset system limit
curl -X POST http://localhost:4000/admin/system/reset-daily-limit \
  -H "Content-Type: application/json" \
  -d '{"adminId":"admin123"}'

# Now: 5 new users can access
```

### Scenario 2: User Exhausted Requests (4/4)

```bash
# Check user
curl -X GET http://localhost:4000/admin/users/user123 \
  -H "Content-Type: application/json" \
  -d '{"adminId":"admin123"}'

# Result: "dailyRequests": 4, "remainingRequests": 0

# Reset that user
curl -X POST http://localhost:4000/admin/users/reset-limit \
  -H "Content-Type: application/json" \
  -d '{"adminId":"admin123","userId":"user123"}'

# Now: User has 4 new requests
```

### Scenario 3: After Heavy Testing

```bash
# Full reset - clean slate
curl -X POST http://localhost:4000/admin/system/reset-all \
  -H "Content-Type: application/json" \
  -d '{"adminId":"admin123"}'

# Everything is fresh:
# - System: 0/5 users
# - All users: 0/4 requests each
```

---

## 🚨 Important Notes

1. **Admin Only** - Only admins can reset limits
2. **No Undo** - Resets are immediate and permanent
3. **Logs Tracked** - All resets are logged with admin ID
4. **No Effect on Blocking** - Resets don't unblock blocked users
5. **Admins Exempt** - Admin users always have unlimited access

---

## 🔒 Security

### Who Can Reset?
- Only users with `isAdmin: true`
- Must provide valid `adminId` in request
- Failed attempts are logged

### What Gets Reset?
- **User Limit:** `dailyRequestCount` → 0
- **System Limit:** `DailyAccesses` table cleared
- **Doesn't Reset:** User blocks, no-show counts, bookings

---

## 📝 Reset vs Unblock

**Reset Limit:**
```bash
# Gives user fresh requests
curl -X POST http://localhost:4000/admin/users/reset-limit \
  -d '{"adminId":"admin123","userId":"user123"}'
```

**Unblock User:**
```bash
# Removes block status
curl -X POST http://localhost:4000/admin/users/unblock \
  -d '{"adminId":"admin123","userId":"user123"}'
```

**Both may be needed:**
```bash
# 1. Unblock user
curl -X POST http://localhost:4000/admin/users/unblock \
  -d '{"adminId":"admin123","userId":"user123"}'

# 2. Reset their limit
curl -X POST http://localhost:4000/admin/users/reset-limit \
  -d '{"adminId":"admin123","userId":"user123"}'
```

---

## 🧪 Testing Resets

```bash
# 1. Check current state
curl -X POST http://localhost:4000/admin/stats/daily \
  -d '{"adminId":"admin123"}'

# 2. Perform reset
curl -X POST http://localhost:4000/admin/system/reset-all \
  -d '{"adminId":"admin123"}'

# 3. Verify reset
curl -X POST http://localhost:4000/admin/stats/daily \
  -d '{"adminId":"admin123"}'

# Should show: uniqueUsers: 0, remainingSlots: 5
```

---

## 📞 Error Handling

### Error: "You do not have admin privileges"
```json
{"error":"Access Denied","message":"You do not have admin privileges"}
```
**Fix:** Use correct admin ID (`admin123`)

### Error: "User not found"
```json
{"error":"User not found"}
```
**Fix:** Check userId spelling or create user first

---

## 🎯 Best Practices

1. **Check First** - Always view stats before resetting
2. **Log Actions** - Keep track of manual resets
3. **Inform Users** - Let users know if you reset their limits
4. **Scheduled Resets** - Consider automated midnight resets
5. **Test in Development** - Test resets before using in production

---

## 🔄 Automated Reset (Optional)

To automatically reset at midnight, add a cron job:

```javascript
// In your backend code
import cron from 'node-cron';

// Reset at midnight every day
cron.schedule('0 0 * * *', async () => {
  console.log('🔄 Automatic midnight reset...');
  // Call reset functions here
});
```

---

**You now have complete admin control over rate limits!** 🎛️


