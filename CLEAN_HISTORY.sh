#!/bin/bash

# Script to create fresh git history with only your commits
# This will make you the ONLY contributor

echo "🔥 WARNING: This will create a NEW git history!"
echo "   - AnkitKumar8080 will be removed from contributors"
echo "   - You will be the sole author"
echo ""
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Cancelled"
    exit 0
fi

echo ""
echo "📦 Creating backup..."
cd /Users/abhisheksingh/boking
tar -czf basBookingChatBot_backup_$(date +%Y%m%d_%H%M%S).tar.gz basBookingChatBot/
echo "✅ Backup created in: $(pwd)"

echo ""
echo "🗑️  Removing old git history..."
cd basBookingChatBot
rm -rf .git

echo "🆕 Initializing new git repository..."
git init
git add .
git commit -m "🚌 Initial commit: Bus Booking Chatbot

Features:
- 🤖 AI-powered chatbot using Google Gemini
- 🔐 Complete admin system with user management
- 📊 Rate limiting: 5 users/day, 4 requests/user
- 🚫 Auto-blocking after 3 no-shows
- 🐳 Docker support with docker-compose
- 📱 Modern React TypeScript UI
- 💾 SQLite database with Sequelize ORM
- 📚 Comprehensive documentation

Author: Abhishek Singh"

echo ""
echo "✅ New git history created!"
echo ""
echo "📤 To push to GitHub:"
echo "   1. Delete your current repository on GitHub"
echo "   2. Create a new one with the same name"
echo "   3. Run: git remote add origin https://github.com/AbhishekSingh1011E/basBookingChatBot.git"
echo "   4. Run: git push -u origin main --force"
echo ""
echo "🎉 You will be the ONLY contributor!"
