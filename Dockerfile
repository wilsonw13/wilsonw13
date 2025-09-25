# Stage 1: Build the frontend
FROM node:22 AS frontend-build
WORKDIR /frontend
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend ./
RUN pnpm run build

# Stage 2: Build the backend and serve the frontend
FROM node:22
WORKDIR /backend
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate
COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY backend ./
COPY --from=frontend-build /frontend/dist ./dist-frontend
RUN pnpm run build

EXPOSE 3000
CMD ["pnpm", "start"]