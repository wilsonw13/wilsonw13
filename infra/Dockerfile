# ---- Base Stage ----
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

# ---- Dependencies Stage ----
FROM base AS dependencies
WORKDIR /app
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN pnpm install --frozen-lockfile

# ---- Builder Stage ----
FROM base AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
COPY frontend/.env* ./frontend/
RUN pnpm build

# ---- Production Stage ----
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production

# Prune node_modules to production-only dependencies for the backend
COPY --from=dependencies /app/node_modules ./node_modules
COPY backend/package.json ./
RUN pnpm prune --prod

# Copy the built backend and frontend assets from the builder stage
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/frontend/dist ./dist/public

# Copy the non-secret environment files for the backend.
COPY backend/.env* ./

EXPOSE 3000
CMD [ "pnpm", "start" ]