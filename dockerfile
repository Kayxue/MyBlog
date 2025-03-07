FROM oven/bun:alpine AS builder

WORKDIR /app
COPY . .

RUN bun install
RUN bun run build

FROM joseluisq/static-web-server:2

WORKDIR /

COPY --from=builder /app/dist/ ./public/
