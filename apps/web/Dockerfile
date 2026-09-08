FROM oven/bun:1 AS base
WORKDIR /app
COPY package.json bun.lockb* ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/ui-kit/package.json ./packages/ui-kit/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json
RUN bun install
COPY . .
RUN bun --filter web build
EXPOSE 4321
CMD ["bun", "--filter", "web", "preview", "--host", "0.0.0.0", "--port", "4321"]
