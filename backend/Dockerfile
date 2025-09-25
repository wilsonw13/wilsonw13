FROM node:22
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate

# layer caching - don't need to run this part again if these files don't change
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

EXPOSE 3001
CMD ["pnpm", "start"]
