# Social Scheduler

Social Scheduler is a full-stack social media management platform designed to simplify content planning, publishing, and AI-assisted automation across multiple social platforms. It brings together account management, scheduling workflows, media uploads, and AI-powered content generation in a single dashboard.

Live application: https://social-scheduler-m4xe.onrender.com

## Overview

Social Scheduler is built for creators, marketers, agencies, and businesses that need a more efficient way to manage social media publishing without switching between multiple tools. The platform allows users to authenticate their social accounts, draft content, upload media, schedule posts, and monitor publishing activity from one place.

The system combines a modern React client with a secure Express + MongoDB backend, enabling a streamlined workflow for both manual and automated publishing.

## Features

- Secure user authentication and protected routes
- Social account integration with OAuth-based connection flow
- Account syncing and platform management
- Post scheduling with automated publishing
- Media upload support for image and video content
- AI-assisted caption and content generation
- AI image generation support
- Dashboard analytics for connected accounts and publishing activity
- Responsive UI built for desktop and modern browsers
- Activity tracking for recent scheduled and published actions

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads
- Node-cron for automation

### External Services
- Zernio for account connection and social publishing
- Cloudinary for media storage and delivery
- Google Gemini for AI-powered content generation
- Leonardo AI for AI image generation

## Architecture

The application follows a clean full-stack architecture:

- The frontend handles the UI, routing, authentication state, and user interactions.
- The backend exposes RESTful routes for authentication, accounts, posts, activity, and OAuth flows.
- MongoDB stores users, account data, post records, generated content, and activity logs.
- Scheduled jobs run on the backend and publish posts automatically when their execution time is reached.

## Project Structure

```text
social-scheduler/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── api/                # API configuration
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # Auth provider and context
│   │   ├── pages/              # Application screens
│   │   └── assets/             # Static assets
│   └── package.json
├── server/                     # Express + TypeScript backend
│   ├── config/                 # DB, Cloudinary, multer, and API config
│   ├── controllers/            # Request handlers
│   ├── middlewares/            # Auth and error handling
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API routes
│   ├── utils/                  # Helper functions and scheduler logic
│   ├── server.ts               # App entry point
│   └── package.json
├── .gitignore
├── README.md
└── package.json (if present in repo root)
```

## Prerequisites

Before running the application locally, ensure you have:

- Node.js 18+
- npm
- MongoDB Atlas or a local MongoDB instance
- API credentials for:
  - Zernio
  - Google Gemini
  - Leonardo AI
  - Cloudinary

## Environment Variables

Create a `.env` file inside the `server` folder with the following values:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
JWT_SECRET=your_jwt_secret

ZERNIO_API_KEY=your_zernio_api_key
GEMINI_API_KEY=your_gemini_api_key
LEONARDO_API_KEY=your_leonardo_api_key
LEONARDO_MODEL_ID=your_leonardo_model_id

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

A sample template is also available in [server/.env.example](server/.env.example).

## Local Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd social-scheduler
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Start the backend

```bash
cd server
npm run dev
```

### 5. Start the frontend

Open a new terminal and run:

```bash
cd client
npm run dev
```

The frontend will run locally in development mode, while the backend serves the API and scheduler logic.

## Available Scripts

### Client
- `npm run dev` — run the Vite development server
- `npm run build` — create a production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint checks

### Server
- `npm run dev` — start the backend in development mode with nodemon
- `npm run build` — compile TypeScript to JavaScript
- `npm start` — start the built server

## Production Deployment

This project is deployed and available at:

https://social-scheduler-m4xe.onrender.com

The platform is configured to run as a frontend static deployment and a backend web service, with environment variables managed securely in the hosting environment.

## Notes

- Full functionality depends on valid external service credentials for social platform integration, AI generation, and media storage.
- The scheduled publishing engine runs in the backend and processes queued content automatically.
- Media uploads are handled through Cloudinary to keep the app lightweight and the asset delivery efficient.

## Summary

Social Scheduler is designed to reduce the operational overhead of social media management by consolidating workflow steps into one platform. It helps teams and individuals publish content consistently, automate recurring tasks, and generate high-quality creative assets more efficiently.

