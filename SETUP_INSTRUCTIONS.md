# 🚌 Bus Booking Chatbot - Setup Instructions

## ⚠️ IMPORTANT: Configure API Key

The chatbot requires a Google Gemini API key to work. Follow these steps:

### 1. Get Your Gemini API Key

1. Visit: **https://makersuite.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated API key

### 2. Add API Key to .env File

Open the file: `basBookingChatBot/api/.env`

Replace `YOU GEMINI API KEY` with your actual API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
CORS_URL=http://localhost:5173
```

### 3. Restart the Backend Server

After adding the API key, restart the backend:

```bash
# Kill the current backend process
lsof -ti:4000 | xargs kill -9

# Start backend again
cd /Users/abhisheksingh/boking/basBookingChatBot/api
node index.js
```

## 🚀 How to Use

### Start Both Servers

**Backend (Port 4000):**
```bash
cd /Users/abhisheksingh/boking/basBookingChatBot/api
node index.js
```

**Frontend (Port 5173):**
```bash
cd /Users/abhisheksingh/boking/basBookingChatBot/ui
npm run dev
```

### Test the Chatbot

Open: **http://localhost:5173**

Try these queries:
1. "Hello" - AI will greet and ask where you want to travel
2. "Show buses from Delhi to Mumbai on 15th December"
3. "Book bus BUS001 for 2 seats"
4. Provide your details when asked

## ✅ Features

- 🚌 Search buses between any two cities
- 💺 Check availability and seat types
- 🎫 Instant booking with PNR
- 💬 Natural language understanding
- 📱 Mobile-friendly interface

## 🔧 Troubleshooting

### AI Not Responding?
- Check if GEMINI_API_KEY is set correctly in `.env`
- Restart the backend server after changing `.env`
- Check backend console for errors

### Port Already in Use?
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Mock Data
Currently using mock bus data for testing. To integrate real RedBus API:
- Contact RedBus for API access
- Add `REDBUS_API_KEY` to `.env`
- Update API endpoints in `chat.controller.js`

## 📝 Notes

- The chatbot uses mock data for development
- All bookings are simulated
- Conversation history is saved in SQLite database
- Supports Hindi and English languages

