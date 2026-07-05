# frontend/Dockerfile

# --- Stage 1: Build các file tĩnh (HTML/CSS/JS) ---
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Lệnh build của Vite sẽ sinh ra thư mục 'dist'
RUN npm run build

# --- Stage 2: Dùng Nginx để host giao diện ---
FROM nginx:alpine
# Xóa trắng thư mục mặc định của Nginx
RUN rm -rf /usr/share/nginx/html/*
# Copy thư mục 'dist' từ Stage 1 sang thư mục host của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
