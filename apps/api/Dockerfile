FROM oven/bun:1 AS base
WORKDIR /app
COPY package.json bun.lockb* ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json
RUN bun install
COPY . .
EXPOSE 3001
CMD ["bun", "run", "apps/api/src/index.ts"]
