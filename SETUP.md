# Project Setup & Documentation

This document provides all the necessary instructions for setting up the development environment, running the application, and deploying it to production.

## Table of Contents

- [Project Setup \& Documentation](#project-setup--documentation)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Prerequisites](#prerequisites)
  - [Development Setup](#development-setup)
      - [1. Clone \& Install Dependencies](#1-clone--install-dependencies)
      - [2. VS Code Configuration](#2-vs-code-configuration)
  - [Available Scripts](#available-scripts)
  - [Running for Development](#running-for-development)
    - [Updated `Dockerfile` to Include Base Config ⚙️](#updated-dockerfile-to-include-base-config-️)
    - [Updated `SETUP.md` Instructions for Production 📜](#updated-setupmd-instructions-for-production-)
  - [Production Deployment with Docker](#production-deployment-with-docker)
    - [Prerequisites](#prerequisites-1)
    - [Deployment Steps](#deployment-steps)

***

## Tech Stack

This is a monorepo project built with the following core technologies:

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, TypeScript, Mongoose
- **Build & Tooling**: pnpm Workspaces, ESLint, Prettier
- **Deployment**: Docker, Nginx (as a reverse proxy)

***

## Prerequisites

Before you begin, ensure you have the following tools installed on your system.

1.  **Node.js**: This project uses Node.js v22 (LTS) or later. It's recommended to use a version manager like [nvm-windows](https://github.com/coreybutler/nvm-windows) to manage Node versions. If you do install nvm, you must uninstall any existing Node.js installations to avoid conflicts.
2.  **pnpm**: This project uses pnpm for fast and efficient package management. Install it globally via npm:
    ```bash
    npm install -g pnpm
    ```

***

## Development Setup

#### 1. Clone & Install Dependencies

Clone the repository to your local machine and run the install command from the **root** of the project. This single command will install all dependencies for the entire monorepo (`frontend`, `backend`, and root).

```bash
# Clone the repository (replace with your actual repo URL)
git clone <your-repository-url>
cd <your-repository-name>

# Install all dependencies
pnpm install
```

#### 2. VS Code Configuration

This repository includes a `.vscode/` directory with settings and extension recommendations to ensure a consistent development experience.

- **Extensions**: When you first open this project in VS Code, you should be prompted to install the recommended extensions. Please accept this prompt for the best experience.
- **Settings**: The `.vscode/settings.json` file contains project-specific settings for formatting (Prettier) and linting (ESLint) that will be applied automatically. You do not need to modify your global user settings.

***

## Available Scripts

The most important commands are available as pnpm scripts in the root `package.json`. Run these from the **root directory**.

- `pnpm dev`
  - Starts both the frontend and backend development servers in parallel.

- `pnpm build`
  - Builds both the frontend and backend applications for production.

- `pnpm type-check`
  - Runs the TypeScript compiler to check for type errors across the entire project.

- `pnpm lint`
  - Lints all code in the project using ESLint.

- `pnpm format`
  - Formats all code in the project using Prettier.

***

## Running for Development

You can run both the frontend and backend development servers with a single command from the project's **root directory**.

```bash
pnpm dev
```

The frontend will be available at `http://localhost:3010`, and the backend API will be running on port `3000`.

Alternatively, if you are using VS Code, you can press `Ctrl + Shift + B` to run the default build task, which will also start both servers.

***

You are absolutely right. Thank you for providing your environment loading code; it clarifies your application's configuration strategy perfectly.

My previous advice was based on the general best practice of externalizing all configuration. However, your setup uses a common and practical hybrid approach:

  * **Base Config**: Non-secret defaults are stored in `.env` and `.env.production` and are safe to be part of the build.
  * **Secret Overrides**: Sensitive values from `.env.local` are provided at runtime.

Your `dotenv` code with `override: true` is perfectly designed for this. We will update the `Dockerfile` to match this logic.

-----

### Updated `Dockerfile` to Include Base Config ⚙️

This version copies your non-secret `.env` and `.env.production` files into the final image. The `.dockerignore` file we configured previously already correctly excludes `.env.local`, so no changes are needed there.

**Updated `infra/Dockerfile`:**

```dockerfile
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
# Copy frontend .env files needed for the Vite build process.
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

# V V V ADD THIS SECTION V V V
# Copy the non-secret environment files for the backend.
# The app will load these first, then override with runtime secrets.
COPY backend/.env ./
COPY backend/.env.production ./

EXPOSE 3000
CMD [ "pnpm", "start" ]
```

### Updated `SETUP.md` Instructions for Production 📜

The deployment instructions remain almost the same, but the explanation of the environment file is now more precise. It should contain **only your secrets**.

-----

## Production Deployment with Docker

This guide outlines how to build and run the application as a Docker container.

### Prerequisites

1.  **Docker**: The production server must have Docker installed.
2.  **Reverse Proxy (Nginx)**: A reverse proxy like Nginx must be installed and configured on the host server to forward traffic to the application container's port (3000).

### Deployment Steps

1.  **Create a Secrets File on the Server**

    The Docker image contains the base, non-secret configuration. You must provide a separate file on the server containing **only your production secrets**. Create a file (e.g., at `/opt/secrets/prod.env`) with the content that would normally be in `.env.local`.

    **Example `/opt/secrets/prod.env`:**

    ```
    DATABASE_URL=mongodb://user:SECRET_PASSWORD@host...
    JWT_SECRET=YOUR_PRODUCTION_JWT_SECRET
    ```

2.  **Build and Run the Docker Container**

    From your project's root directory on the server, run the following commands.

      * First, build the Docker image:

        ```bash
        docker build . -f ./infra/Dockerfile -t <image-name>
        ```

      * Then, run the container, securely injecting your secrets file using the `--env-file` flag:

        ```bash
        docker run -d -p 3000:3000 --name <container-name> --restart unless-stopped --env-file /opt/secrets/prod.env <image-name>
        ```

Your application will now start, load the base configuration from the files inside the image, and then override them with the secrets you provided at runtime. This is a secure and robust pattern that perfectly matches your code.

Your application is now running. Your pre-configured Nginx instance will handle routing external traffic to the Node.js application running inside the Docker container.