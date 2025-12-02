# 🐳 Docker Setup Guide - Bus Booking Chatbot

## ⚠️ Current Status

**Docker is NOT installed** on your system.

---

## 📦 What is Docker?

Docker allows you to run your application in **isolated containers** that:
- Work consistently across all environments
- Are easy to deploy and scale
- Include all dependencies
- Can be started/stopped with simple commands

---

## 🔧 Installation

### For macOS (Your System):

**Option 1: Docker Desktop (Recommended)**

1. Download Docker Desktop:
   - Visit: https://www.docker.com/products/docker-desktop
   - Download for Mac (Apple Silicon or Intel)

2. Install:
   - Open the downloaded `.dmg` file
   - Drag Docker to Applications folder
   - Launch Docker Desktop
   - Complete the setup wizard

3. Verify Installation:
```bash
docker --version
docker-compose --version
```

**Option 2: Homebrew**

```bash
brew install --cask docker
```

Then launch Docker Desktop from Applications.

---

## 🚀 Using Docker with Your Bus Booking App

Once Docker is installed, you have **3 Dockerfiles ready**:

### Files Created:
1. **`api/Dockerfile`** - Backend container
2. **`ui/Dockerfile`** - Frontend container  
3. **`docker-compose.yml`** - Orchestrates both containers
4. **`.env.docker`** - Environment variables

---

## 🎯 Quick Start (After Installing Docker)

### 1. Start Everything with One Command:

```bash
cd /Users/abhisheksingh/boking/basBookingChatBot
docker-compose up -d
```

**This will:**
- Build backend container
- Build frontend container
- Start both services
- Connect them in a network

### 2. Check Status:

```bash
docker-compose ps
```

### 3. Access Your App:

- **Backend:** http://localhost:4000
- **Frontend:** http://localhost:5173

### 4. View Logs:

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### 5. Stop Everything:

```bash
docker-compose down
```

---

## 📝 Individual Container Commands

### Build Containers:

```bash
# Backend
docker build -t bus-booking-backend ./api

# Frontend
docker build -t bus-booking-frontend ./ui
```

### Run Containers:

```bash
# Backend (manual)
docker run -d \
  --name backend \
  -p 4000:4000 \
  -e GEMINI_API_KEY=AIzaSyDGzvaSxcuKcZAgnWsxQUEsVPaMWB2Hs5s \
  -e CORS_URL=http://localhost:5173 \
  -v $(pwd)/api/chatHistory.db:/app/chatHistory.db \
  bus-booking-backend

# Frontend (manual)
docker run -d \
  --name frontend \
  -p 5173:5173 \
  -e VITE_BACKEND_URL=http://localhost:4000 \
  bus-booking-frontend
```

### Stop Containers:

```bash
docker stop backend frontend
```

### Remove Containers:

```bash
docker rm backend frontend
```

### View Running Containers:

```bash
docker ps
```

### View All Containers:

```bash
docker ps -a
```

---

## 🎛️ Docker Compose Commands

| Command | Description |
|---------|-------------|
| `docker-compose up` | Start all services (foreground) |
| `docker-compose up -d` | Start all services (background) |
| `docker-compose down` | Stop and remove all services |
| `docker-compose ps` | List running services |
| `docker-compose logs` | View logs |
| `docker-compose restart` | Restart all services |
| `docker-compose build` | Rebuild containers |
| `docker-compose exec backend sh` | Access backend shell |
| `docker-compose exec frontend sh` | Access frontend shell |

---

## 🔄 Development Workflow

### Standard Development (Without Docker):

```bash
# Terminal 1 - Backend
cd api && node index.js

# Terminal 2 - Frontend
cd ui && npm run dev
```

### With Docker:

```bash
# Single command for everything
docker-compose up -d

# View logs in real-time
docker-compose logs -f
```

---

## 🐛 Troubleshooting

### Issue: "docker: command not found"

**Solution:** Docker is not installed. Install Docker Desktop first.

```bash
# Download from:
https://www.docker.com/products/docker-desktop
```

### Issue: "Cannot connect to the Docker daemon"

**Solution:** Start Docker Desktop application.

```bash
# On Mac, launch from Applications folder
open -a Docker
```

### Issue: "Port 4000 is already in use"

**Solution:** Stop the non-Docker backend first.

```bash
# Kill existing processes
pkill -9 -f "node index.js"
pkill -9 -f "vite"

# Then start Docker
docker-compose up -d
```

### Issue: "Database not persisting"

**Solution:** Ensure volume is mounted correctly.

```bash
# In docker-compose.yml, check:
volumes:
  - ./api/chatHistory.db:/app/chatHistory.db
```

### Issue: "Container keeps restarting"

**Solution:** Check logs for errors.

```bash
docker-compose logs backend
docker-compose logs frontend
```

---

## 🔒 Environment Variables

### Using .env.docker:

The `.env.docker` file contains your API keys. Docker Compose loads it automatically.

```bash
# Edit environment variables
nano .env.docker

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

---

## 📊 Monitoring Containers

### Resource Usage:

```bash
docker stats
```

### Container Details:

```bash
docker inspect bus-booking-backend
docker inspect bus-booking-frontend
```

### Network Information:

```bash
docker network ls
docker network inspect bus-booking-network
```

---

## 🚀 Production Deployment

### Build Production Images:

```bash
# Build with specific tags
docker build -t bus-booking-backend:v1.0 ./api
docker build -t bus-booking-frontend:v1.0 ./ui
```

### Push to Docker Hub (Optional):

```bash
# Tag images
docker tag bus-booking-backend:v1.0 yourusername/bus-booking-backend:v1.0
docker tag bus-booking-frontend:v1.0 yourusername/bus-booking-frontend:v1.0

# Push to registry
docker push yourusername/bus-booking-backend:v1.0
docker push yourusername/bus-booking-frontend:v1.0
```

### Deploy on Server:

```bash
# On your server
docker-compose pull
docker-compose up -d
```

---

## 📁 Docker Files Structure

```
basBookingChatBot/
├── api/
│   ├── Dockerfile          ← Backend container config
│   ├── index.js
│   └── ...
├── ui/
│   ├── Dockerfile          ← Frontend container config
│   └── ...
├── docker-compose.yml      ← Orchestration config
├── .env.docker            ← Environment variables
└── DOCKER_GUIDE.md        ← This guide
```

---

## 🎯 Advantages of Docker

### Without Docker:
```bash
# Need to run multiple terminals
Terminal 1: cd api && node index.js
Terminal 2: cd ui && npm run dev

# Dependencies issues
"Works on my machine" problems
Manual environment setup
```

### With Docker:
```bash
# Single command
docker-compose up -d

# Benefits:
✅ Consistent environment
✅ Easy deployment
✅ Isolated dependencies
✅ Simple scaling
✅ Production-ready
```

---

## 🔧 Advanced Configuration

### Scale Services:

```bash
# Run multiple backend instances
docker-compose up -d --scale backend=3
```

### Custom Network:

```yaml
# In docker-compose.yml
networks:
  bus-booking-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16
```

### Health Checks:

```yaml
# Already configured in docker-compose.yml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:4000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

---

## 📝 Next Steps

1. **Install Docker Desktop**
   - Download: https://www.docker.com/products/docker-desktop
   - Install and launch

2. **Test Installation**
   ```bash
   docker --version
   docker-compose --version
   ```

3. **Start Your App**
   ```bash
   cd /Users/abhisheksingh/boking/basBookingChatBot
   docker-compose up -d
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000

5. **Monitor**
   ```bash
   docker-compose logs -f
   ```

---

## 🎓 Learning Resources

- **Docker Official Docs:** https://docs.docker.com/
- **Docker Compose Docs:** https://docs.docker.com/compose/
- **Docker Hub:** https://hub.docker.com/

---

## ✅ Summary

**Current Setup:**
- ✅ Dockerfiles created (backend & frontend)
- ✅ Docker Compose configuration ready
- ✅ Environment variables configured
- ⚠️ Docker needs to be installed

**Once Docker is Installed:**
```bash
# One command to rule them all
docker-compose up -d

# Access your app
# Backend: http://localhost:4000
# Frontend: http://localhost:5173

# Stop everything
docker-compose down
```

---

**Your Docker setup is ready! Just install Docker Desktop and run `docker-compose up -d`** 🐳


