# 🚌 Bus Booking Chatbot

An intelligent AI-powered chatbot for booking bus tickets using Google Gemini AI and RedBus API.

![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-v25-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-TypeScript-61DAFB?logo=react&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

---

## ✨ Features

- 🤖 **AI-Powered Conversations** - Natural language interaction using Google Gemini AI
- 🔐 **Admin System** - Complete admin controls for user management
- 📊 **Rate Limiting** - 5 unique users per day, 4 requests per user
- 🚫 **User Blocking** - Automatic blocking after 3 no-shows
- 📱 **Responsive UI** - Modern React TypeScript frontend
- 🐳 **Docker Support** - One-command deployment
- 💾 **SQLite Database** - Persistent chat history and user data
- 🔄 **CORS Enabled** - Secure cross-origin requests

---

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Start everything with one command
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:4000
```

### Manual Setup

**Backend:**
```bash
cd api
npm install
node index.js
```

**Frontend:**
```bash
cd ui
npm install
npm run dev
```

---

## 📦 Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **Google Gemini AI** - Conversational AI
- **SQLite** & **Sequelize** - Database & ORM
- **Axios** - HTTP client for RedBus API

### Frontend
- **React** with **TypeScript** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Lucide React** - Icons

### DevOps
- **Docker** & **Docker Compose** - Containerization
- **Nginx** - Frontend server (in Docker)

---

## 📁 Project Structure

```
basBookingChatBot/
├── api/                          # Backend application
│   ├── src/
│   │   ├── controller/
│   │   │   ├── chat.controller.js    # Chat logic
│   │   │   └── admin.controller.js   # Admin endpoints
│   │   ├── routes/
│   │   ├── db/                       # Database models
│   │   └── utils/                    # Helpers & prompts
│   ├── index.js                  # Entry point
│   ├── Dockerfile
│   └── package.json
├── ui/                           # Frontend application
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── App.tsx              # Main app
│   │   └── main.tsx             # Entry point
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml            # Orchestration
└── *.md                          # Documentation

```

---

## 🔧 Configuration

### Environment Variables

**Backend (`api/.env`):**
```env
GEMINI_API_KEY=your_gemini_api_key
REDBUS_API_KEY=your_redbus_api_key
CORS_URL=http://localhost:5173
```

**Frontend (`ui/.env`):**
```env
VITE_BACKEND_URL=http://localhost:4000
```

---

## 📖 Documentation

Comprehensive guides are available:

- **[SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)** - Complete setup guide
- **[DOCKER_GUIDE.md](DOCKER_GUIDE.md)** - Docker usage & commands
- **[ADMIN_GUIDE.md](ADMIN_GUIDE.md)** - Admin features
- **[RATE_LIMITING.md](RATE_LIMITING.md)** - Rate limiting system
- **[USER_BLOCKING_SYSTEM.md](USER_BLOCKING_SYSTEM.md)** - Blocking system
- **[REDBUS_INTEGRATION.md](REDBUS_INTEGRATION.md)** - API integration
- **[SYSTEM_SUMMARY.md](SYSTEM_SUMMARY.md)** - Architecture overview

---

## 🎯 Key Features

### 1️⃣ Rate Limiting
- ✅ Max 5 unique users per day
- ✅ Max 4 booking requests per user per day
- ✅ Automatic daily reset at midnight
- ✅ Admin has unlimited access

### 2️⃣ User Blocking System
- ✅ Track no-shows per user
- ✅ Block after 3 no-shows
- ✅ Admin can manually block/unblock
- ✅ View blocked users list

### 3️⃣ Admin Controls
- ✅ Reset all limits (admin only)
- ✅ View system statistics
- ✅ Manage blocked users
- ✅ Monitor daily usage

---

## 🐳 Docker Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose build --no-cache

# Check status
docker-compose ps
```

---

## 🧪 API Endpoints

### Chat Endpoints
```bash
POST /chat
Content-Type: application/json
{
  "userId": "user123",
  "message": "I want to book a bus from Delhi to Mumbai"
}
```

### Admin Endpoints
```bash
# Reset all limits (admin only)
POST /admin/system/reset-all
{
  "adminId": "ADMIN_123"
}

# View statistics
GET /admin/stats

# Health check
GET /health
```

---

## 📊 Database Schema

**Users Table:**
- userId (Primary Key)
- dailyRequestCount
- isBlocked
- noShowCount
- lastRequestDate

**ChatHistory Table:**
- id (Primary Key)
- userId
- message
- response
- timestamp

---

## 🛡️ Security Features

- ✅ Environment variables for sensitive data
- ✅ CORS protection
- ✅ Admin ID verification
- ✅ Rate limiting per user
- ✅ Input validation
- ✅ Database security with Sequelize

---

## 🚦 Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd basBookingChatBot
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cp api/.env.example api/.env
   # Edit api/.env with your API keys
   
   # Frontend
   cp ui/.env.example ui/.env
   # Edit ui/.env with backend URL
   ```

3. **Start with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Abhishek Singh**

---

## 🙏 Acknowledgments

- Google Gemini AI for conversational intelligence
- RedBus for bus booking API
- Docker community for containerization tools

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check documentation in the `/docs` folder

---

## 🎯 Roadmap

- [ ] Add payment gateway integration
- [ ] Implement real RedBus API
- [ ] Add email notifications
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Advanced analytics dashboard

---

**Made with ❤️ by Abhishek Singh**
