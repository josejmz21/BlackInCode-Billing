# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .
RUN bun run build

# Serve stage using Nginx
FROM nginx:alpine

# Copy built assets from builder stage to nginx serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
