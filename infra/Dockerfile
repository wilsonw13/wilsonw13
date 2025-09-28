# ---- Base Stage ----
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

# ---- Builder Stage ----
# This stage now copies the source code first, then installs all dependencies
# This is a more robust pattern for pnpm workspaces in Docker.
FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build

# ---- Production Stage ----
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production

# Prune node_modules to production-only dependencies for the backend
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/package.json ./
RUN pnpm prune --prod

# Copy the built backend and frontend assets from the builder stage
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/frontend/dist ./dist/public

# Copy the non-secret environment files for the backend.
COPY backend/.env* ./

EXPOSE 3000
CMD [ "pnpm", "start" ]