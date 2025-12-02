FROM node:latest as builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . .
RUN npm run build

# Production stage
FROM nginx:latest

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Create custom nginx config
RUN echo 'server { \n\
    listen 5173; \n\
    server_name localhost; \n\
    root /usr/share/nginx/html; \n\
    index index.html; \n\
    location / { \n\
        try_files $uri $uri/ /index.html; \n\
    } \n\
}' > /etc/nginx/conf.d/default.conf

# Expose port 5173
EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
