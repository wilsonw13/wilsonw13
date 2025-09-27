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
RUN pnpm build

# ---- Production Stage ----
FROM base AS production
WORKDIR /app
ENV NODE_ENV production
COPY backend/package.json ./
RUN pnpm install --prod --frozen-lockfile

# Copy the built backend and frontend assets from the builder stage
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/frontend/dist ./dist/public

EXPOSE 3000
# This is correct. It runs the 'start' script from the backend/package.json
CMD [ "pnpm", "start" ]