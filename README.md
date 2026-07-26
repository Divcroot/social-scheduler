# Social Scheduler

Social Scheduler is a full-stack social media management platform built with React, TypeScript, Express, and MongoDB. It allows users to connect social accounts, schedule posts, track publishing activity, and generate AI-assisted content for multiple platforms from a single dashboard.

The project combines a modern frontend experience with a robust backend workflow for authentication, media handling, OAuth-based account connection, and automated publishing.

## Overview

This application is designed for creators, marketers, and businesses who want to manage their social presence more efficiently. Instead of juggling multiple tools and manual posting workflows, users can:

- create an account and log in securely
- connect supported social media accounts
- schedule content in advance
- upload media with posts
- generate post ideas and copy using AI
- monitor activity and publishing history

## Key Features

- Secure authentication and protected routes
- Social account connection through OAuth integration
- Dashboard with scheduled, published, and connected account statistics
- Manual post composer with platform selection and media upload
- AI-powered content generation for captions and image prompts
- Scheduled publishing with automatic execution
- Activity logging for published actions
- Responsive UI with a polished dashboard experience

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
- Node-cron for automated scheduling

### Integrations
- Zernio for social account connection and publishing
- Cloudinary for media storage
- Google Gemini for AI-generated content
- Leonardo AI for AI image generation

## Project Structure

```text
social-scheduler/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Page-level views
│   │   └── api/            # Axios configuration
│   └── package.json
├── server/                 # Express + TypeScript backend
│   ├── controllers/        # Request handlers
│   ├── routes/             # API routes
│   ├── models/             # MongoDB schemas
│   ├── config/             # DB, Cloudinary, multer, and API config
│   ├── utils/              # Helpers and scheduler logic
│   └── package.json
└── README.md
```

## Architecture Summary

The project follows a simple but effective full-stack architecture:

- The frontend handles the user interface, routing, and interaction with the API.
- The backend exposes RESTful endpoints for authentication, account syncing, post scheduling, and AI generation.
- MongoDB stores users, accounts, posts, generations, and activity logs.
- A cron job runs on the server to publish scheduled posts automatically when their execution time arrives.

## Prerequisites

Before running the project, make sure you have:

- Node.js 18 or higher
- npm or pnpm
- A MongoDB instance (local or cloud-based)
- API credentials for the following services:
  - Zernio
  - Google Gemini
  - Leonardo AI
  - Cloudinary

## Environment Variables

Create a .env file inside the server directory with the following variables:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_google_gemini_key
LEONARDO_API_KEY=your_leonardo_ai_key
ZERNIO_API_KEY=your_zernio_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd social-scheduler
```

### 2. Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

### 3. Start the development servers

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in a separate terminal:

```bash
cd client
npm run dev
```

The frontend should open on the Vite local port, and the backend will run on the configured server port.

## Available Scripts

### Client
- npm run dev — start the Vite development server
- npm run build — build the production bundle
- npm run preview — preview the production build
- npm run lint — run ESLint checks

### Server
- npm run dev — start the backend with nodemon
- npm run build — compile TypeScript
- npm start — run the built server

## API Highlights

The backend exposes endpoints for:

- Authentication: register and login
- OAuth: generate social connect URLs and sync connected accounts
- Accounts: manage connected social accounts
- Posts: create, retrieve, and schedule posts
- AI generation: generate content and optional images
- Activity: fetch recent publishing activity

## Notes

- The app relies on external APIs for social publishing and AI generation, so proper credentials are required for full functionality.
- The scheduler runs as a background cron service and publishes posts automatically when their scheduled time arrives.
- Media files are uploaded to Cloudinary and stored with the related post data.

