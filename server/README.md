# Aadikshar E-Commerce Website

Server-side (backend) application for the Aadikshar E-Commerce platform. Built with **Node.js**, **TypeScript**, and **Express.js**, using **MongoDB/Mongoose** for data persistence and **JSON Web Tokens (JWT)** for authentication.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Install Dependencies](#2-install-dependencies)
    - [3. Configure Environment Variables](#3-configure-environment-variables)
    - [4. Run the Application](#4-run-the-application)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Building for Production](#building-for-production)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack

| Category         | Technology             |
| ---------------- | ---------------------- |
| Runtime          | Node.js                |
| Language         | TypeScript             |
| Web Framework    | Express.js             |
| Database         | MongoDB (via Mongoose) |
| Authentication   | JSON Web Token (JWT)   |
| Package Managers | Yarn / npm             |

## Features

- RESTful API architecture built with Express.js
- Type-safe codebase using TypeScript
- MongoDB integration via Mongoose ODM (schemas, models, validation)
- Secure authentication and authorization using JWT
- Modular, scalable project structure suited for e-commerce workflows (users, products, orders, etc.)

## Prerequisites

Before setting up the project locally, make sure you have the following installed:

- **Node.js** (v18.x or later recommended) — [Download](https://nodejs.org/)
- **npm** (bundled with Node.js) or **Yarn** (`npm install --global yarn`)
- **MongoDB** — a local instance or a cloud instance (e.g., [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Git**

You can verify your installations with:

```bash
node -v
npm -v
yarn -v
git --version
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AadiGodzilla/aadikshar-ecommerce-website.git
cd aadikshar-ecommerce-website
```

### 2. Install Dependencies

Using **Yarn**:

```bash
yarn install
```

Using **npm**:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following variables (update values as needed):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aes
JWT_SECRET=your_jwt_secret_key
KHALTI_AUTH_KEY=khalti_merchant_secret_key
```

> **Note:** Never commit your `.env` file to version control. Make sure it is listed in `.gitignore`.

### 4. Run the Application

**Development mode** (with hot-reload):

Using Yarn:

```bash
yarn dev
```

Using npm:

```bash
npm run dev
```

**Production mode** (after building):

Using Yarn:

```bash
yarn build
yarn start
```

Using npm:

```bash
npm run build
npm start
```

The server should now be running at `http://localhost:5000` (or the port you configured).

## Available Scripts

| Script  | Description                                           |
| ------- | ----------------------------------------------------- |
| `dev`   | Runs the server in development mode with live reload  |
| `build` | Compiles TypeScript into JavaScript (`dist/` folder)  |
| `start` | Runs the compiled JavaScript build in production mode |
| `lint`  | Runs ESLint to check code quality (if configured)     |
| `test`  | Runs the test suite (if configured)                   |

> Update this table to match the actual scripts defined in your `package.json`.

## Project Structure

A typical structure for this project might look like:

```
aadikshar-ecommerce-website/
├── src/
│   ├── config/          # Configuration files (DB connection, env setup)
│   ├── apis/     # Route controllers / business logic
│   ├── middeware/     # Custom Express middlewares (auth, file handling, transaction verification)
│   ├── models/          # Mongoose schemas & models
│   ├── routes/          # API route definitions
│   ├── types/           # Custom TypeScript types & interfaces
│   └── index.ts         # Application entry point
├── .env                  # Environment variables (not committed)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Building for Production

To compile the TypeScript source into JavaScript:

```bash
yarn build
# or
npm run build
```

This will generate a `dist/` folder containing the compiled output, which can then be run with:

```bash
yarn dev
# or
npm run dev
```
