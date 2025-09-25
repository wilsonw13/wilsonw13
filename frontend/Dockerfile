FROM node:22
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate

# layer caching - don't need to run this part again if these files don't change
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy index.html and public assets first
COPY . .
RUN pnpm run build
RUN pnpm add serve

EXPOSE 3000
CMD ["pnpm", "serve", "-s", "dist", "-l", "3000"]
