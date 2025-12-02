#!/bin/bash

# Script to push to your own GitHub repository
# Usage: ./PUSH_TO_GITHUB.sh YOUR_GITHUB_USERNAME YOUR_REPO_NAME

USERNAME=$1
REPO_NAME=$2

if [ -z "$USERNAME" ] || [ -z "$REPO_NAME" ]; then
    echo "❌ Error: Missing arguments"
    echo ""
    echo "Usage: ./PUSH_TO_GITHUB.sh YOUR_GITHUB_USERNAME YOUR_REPO_NAME"
    echo ""
    echo "Example: ./PUSH_TO_GITHUB.sh AbhishekSingh1011E busBookingChatbot"
    exit 1
fi

echo "🔄 Removing old remote..."
git remote remove origin 2>/dev/null || true

echo "➕ Adding new remote..."
git remote add origin "https://github.com/$USERNAME/$REPO_NAME.git"

echo "📤 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Your code is on GitHub!"
    echo ""
    echo "🌐 Repository URL:"
    echo "   https://github.com/$USERNAME/$REPO_NAME"
    echo ""
    echo "📝 View your README:"
    echo "   https://github.com/$USERNAME/$REPO_NAME/blob/main/README.md"
else
    echo ""
    echo "❌ Push failed. You may need to:"
    echo "   1. Create the repository on GitHub first"
    echo "   2. Authenticate with GitHub"
    echo "   3. Check your GitHub username and repo name"
fi

