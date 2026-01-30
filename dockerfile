# 1. Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Enable pnpm
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm config set registry https://registry.npmmirror.com/
RUN pnpm install

COPY . .
RUN pnpm run build

# 2. Production stage
FROM node:18-alpine
WORKDIR /app

# Enable pnpm
RUN corepack enable

COPY --from=build /app .

# Ensure upload directory exists
RUN mkdir -p public/image

EXPOSE 8080
CMD ["pnpm", "start"]