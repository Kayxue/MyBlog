FROM oven/bun:alpine AS builder

WORKDIR /app
COPY . .

RUN bun install
RUN bun run build

FROM joseluisq/static-web-server:latest

WORKDIR /

COPY --from=builder /app/dist/ ./public/
