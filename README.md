# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 💳 Payment integration with Stripe (credit card) and PIX
- 📖 [React Router docs](https://reactrouter.com/)

## Team
- [Bruna Letícia](https://github.com/brunaletsleticia)
- [Leticia Ramos](https://github.com/rrleticia)
- [Maria Luiza](https://github.com/MariaLuizaCavalcanti)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

You need to run both the backend and the frontend in separate terminals:

#### Backend

```bash
node index.js
```

#### Frontend
```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Payment Setup

This project includes payment integration using Stripe for credit cards and a simulated PIX flow.

### Environment Variables

Create a `.env` file in the root of the project to store your secret keys.  


## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
