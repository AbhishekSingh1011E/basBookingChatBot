# Use official Node.js image as base
FROM node:latest

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy application files
COPY . .

# Expose port 4000
EXPOSE 4000

# Start the backend
CMD ["node", "index.js"]
