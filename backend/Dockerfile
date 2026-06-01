# Use the official Bun image
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./
COPY src ./src
COPY drizzle.config.ts ./
COPY tsconfig.json ./

# Install dependencies
RUN bun install

# Copy everything and run build (if you had a build step, here we just copy for runtime)

FROM oven/bun:1-slim

WORKDIR /app

# Copy installed dependencies and source code
COPY --from=builder /app /app

ENV NODE_ENV=production

CMD ["bun", "run", "start"]
