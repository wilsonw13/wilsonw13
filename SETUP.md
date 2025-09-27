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
  - [Production Deployment with Docker](#production-deployment-with-docker)
    - [Prerequisites](#prerequisites-1)
    - [Deployment Steps](#deployment-steps)

---

## Tech Stack

This is a monorepo project built with the following core technologies:

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, TypeScript, Mongoose
- **Build & Tooling**: pnpm Workspaces, ESLint, Prettier
- **Deployment**: Docker, Nginx (as a reverse proxy)

---

## Prerequisites

Before you begin, ensure you have the following tools installed on your system.

1.  **Node.js**: This project uses Node.js v22 (LTS) or later. It's recommended to use a version manager like [nvm-windows](https://github.com/coreybutler/nvm-windows) to manage Node versions. If you do install nvm, you must uninstall any existing Node.js installations to avoid conflicts.
2.  **pnpm**: This project uses pnpm for fast and efficient package management. Install it globally via npm:
    ```bash
    npm install -g pnpm
    ```

---

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

---

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

---

## Running for Development

You can run both the frontend and backend development servers with a single command from the project's **root directory**.

```bash
pnpm dev
```

The frontend will be available at `http://localhost:3010`, and the backend API will be running on port `3000`.

Alternatively, if you are using VS Code, you can press `Ctrl + Shift + B` to run the default build task, which will also start both servers.

---

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