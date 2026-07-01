# AES E-Commerce Client

The frontend client for the **AES E-Commerce** platform, built with React 19, TypeScript, and Vite. It provides the customer-facing shopping experience — browsing products, managing a cart, and checking out — talking to a backend API over HTTP.

## Tech Stack

- **React 19** + **TypeScript** — UI and type safety
- **Vite** — dev server and build tooling
- **React Router v7** — client-side routing
- **Tailwind CSS v4** — utility-first styling
- **Axios** — HTTP client for API requests
- **React Toastify** — toast notifications
- **React Icons** — icon library
- **ESLint** — linting

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [Yarn](https://yarnpkg.com/) (a `yarn.lock` is included) — npm can also be used if you prefer

## Getting Started

1. **Clone the repository**

    ```bash
    git clone https://github.com/AadiGodzilla/aes-ecommerce-client.git
    cd aes-ecommerce-client
    ```

2. **Install dependencies**

    ```bash
    yarn install
    # or: npm install
    ```

3. **Configure environment variables**

    Create a `.env` file in the project root and point the client at your backend API, for example:

    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```

    Adjust the variable name/value to match how the API URL is consumed in the codebase and where your backend is running.

4. **Run the development server**

    ```bash
    yarn dev
    # or: npm run dev
    ```

    The app will be available at the URL Vite prints in the terminal (typically `http://localhost:5173`).

## Available Scripts

| Script         | Description                                         |
| -------------- | --------------------------------------------------- |
| `yarn dev`     | Start the Vite dev server with hot module reloading |
| `yarn build`   | Type-check the project and build for production     |
| `yarn lint`    | Run ESLint across the codebase                      |
| `yarn preview` | Preview the production build locally                |

## Project Structure

```
aes-ecommerce-client/
├── public/          # Static assets served as-is
├── src/             # Application source code (components, pages, routes, etc.)
├── index.html        # HTML entry point
├── vite.config.ts    # Vite configuration
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig*.json     # TypeScript configuration
└── package.json
```

## Building for Production

```bash
yarn build
```

The optimized output is written to the `dist/` directory, ready to be deployed to any static hosting provider (Vercel, Netlify, S3/CloudFront, etc.).
