# Snitch

## Project Overview

Snitch is a full-stack application with a Node.js backend and a modern React frontend. The backend is built using Express and MongoDB, providing secure authentication with user registration and login, including password hashing and JWT cookie-based authentication. Additionally, Google OAuth 2.0 authentication is supported for seamless social login.

## Frontend

```
Snitch/
    └──frontend/
         ├── node_modules/
         ├── src/
         │   ├── app/
         │   │   ├── App.css
         │   │   ├── App.jsx
         │   │   ├── app.routes.jsx
         │   │   └── app.store.js
         │   ├── features/
         │   │   └── auth/
         │   │       ├── hook/
         │   │       │   └── useAuth.js
         │   │       ├── pages/
         │   │       │   ├── Register.jsx
         │   │       │   └── Login.jsx
         │   │       ├── service/
         │   │       │   └── auth.api.js
         │   │       └── state/
         │   │           └── auth.slice.js
         │   └── main.jsx
         ├── public/
         |   └── snitch.editorial.png
         ├── .gitignore
         ├── eslint.config.js
         ├── index.html
         ├── package-lock.json
         ├── package.json
         ├── README.md
         └── vite.config.js
```

The Vite development server is configured to proxy API requests to the backend, so frontend API calls to `/api` will be forwarded to `http://localhost:3000`.

## Dependencies

The frontend dependencies are defined in `frontend/package.json`:

- `npm install tailwindcss @tailwindcss/vite` — installs Tailwind CSS and its Vite plugin for styling
- `npm install axios` — HTTP client for making API requests
- `npm install react-redux` — bindings to connect React with Redux
- `npm install @reduxjs/toolkit` — official, simplified way to write Redux logic
- `npm install react-router` — routing library for navigation in React apps

---

## Backend

```
Snitch/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── config/
│       │   ├── config.js
│       │   └── db.js
│       ├── controllers/
│       │   └── auth.controller.js
│       ├── models/
│       │   └── user.model.js
│       ├── routes/
│       │   └── auth.routes.js
│       └── validator/
│           └── auth.validator.js
├── frontend/
└── README.md
```

### Backend file responsibilities

- `backend/server.js`: entry point, loads environment variables, connects to MongoDB, starts Express server.
- `backend/src/app.js`: configures middleware and mounts routes.
- `backend/src/config/config.js`: reads required environment variables.
- `backend/src/config/db.js`: connects to MongoDB using Mongoose.
- `backend/src/routes/auth.routes.js`: defines `/api/auth/register`, `/api/auth/login`, and Google OAuth (`/api/auth/google`, `/api/auth/google/callback`) routes.
- `backend/src/controllers/auth.controller.js`: implements registration, login, and Google OAuth callback behavior.
- `backend/src/models/user.model.js`: defines the user schema and password hashing logic.
- `backend/src/validator/auth.validator.js`: validates incoming request payloads.

---

## Authentication Flow

### Registration (`POST /api/auth/register`)

1. Client sends JSON payload with `email`, `contact`, `password`, and `fullname`.
2. Validation checks:
   - `email` must be valid
   - `contact` must be a 10-digit number
   - `password` must be at least 6 characters
   - `fullname` must be at least 3 characters
   - `isSeller` is optional but must be boolean if provided (determines user role: `seller` or `buyer`)
3. The controller checks whether a user already exists with the same email or contact.
4. If no existing user is found, the backend creates a new user.
5. The `user.model` schema hashes `password` before saving.
6. A JWT token is generated and sent back as a cookie.
7. The response contains `user` details and `success: true`.

### Login (`POST /api/auth/login`)

1. Client sends JSON payload with `email` and `password`.
2. Validation checks:
   - `email` must be valid
   - `password` is required
3. The controller finds the user by email.
4. The password is compared using bcrypt.
5. If valid, a JWT token is issued as a cookie.
6. The response returns `user` details and `success: true`.

### Google OAuth Login (`GET /api/auth/google`)

1. User clicks “Sign in with Google” which redirects to `/api/auth/google`.
2. Passport redirects to Google’s consent screen.
3. After consent, Google redirects to `/api/auth/google/callback` with an authorization code.
4. Passport exchanges the code for user profile data.
5. The profile is passed to the `googleCallback` controller, which can create or authenticate the user (currently redirects to frontend dashboard).
6. A JWT token can be issued similarly to the email/password flow.

---

## API Endpoints

### Register

- URL: `POST http://localhost:3000/api/auth/register`
- Body example:
  ```json
  {
    "email": "test@gmail.com",
    "contact": "9876543210",
    "password": "Test@123",
    "fullname": "Test West",
    "isSeller": true
  }
  ```

### Login

- URL: `POST http://localhost:3000/api/auth/login`
- Body example:

  ```json
  {
    "email": "test@gmail.com",
    "password": "Test@123"
  }
  ```

### Google OAuth

- **Initiate OAuth flow**: `GET http://localhost:3000/api/auth/google`
- **OAuth callback**: `GET http://localhost:3000/api/auth/google/callback` (handled by Passport)

Simply navigate to `http://localhost:3000/api/auth/google` in your browser or use a frontend link to start the Google sign‑in flow.

---

## Dependencies

The backend dependencies are defined in `backend/package.json`:

-
- `npm init -y` — initializes a Node.js project (creates package.json)
- `npm instal express` — web framework
- `npm instal mongoose` — MongoDB object modeling
- `npm instal dotenv` — environment variable management
- `npm instal bcryptjs` — password hashing
- `npm instal cookie-parser` — cookie parsing middleware
- `npm instal express-validator` — request validation
- `npm instal jsonwebtoken` — JWT token creation
- `npm instal morgan` — request logging
- `npm install cors` — middleware to enable Cross-Origin Resource Sharing (allows frontend and backend to communicate across different origins)
- `npm install passport` — authentication middleware
- `npm install passport-google-oauth20` — Google OAuth 2.0 strategy for Passport

---

## Environment Variables

Create a `.env` file in `backend/` with the following values:

```env
FRONTEND_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PORT=3000
```

- `FRONTEND_URL`: URL of the frontend development server (used for CORS).
- `MONGO_URI`: required MongoDB connection string.
- `JWT_SECRET`: required secret for signing JWT tokens.
- `GOOGLE_CLIENT_ID`: Google OAuth 2.0 client ID (from Google Cloud Console).
- `GOOGLE_CLIENT_SECRET`: Google OAuth 2.0 client secret.
- `PORT`: optional port for the server (defaults to `3000`).

---

## Running the Backend

From the `backend/` folder:

```bash
npm install
npm run dev
```

The server will start on port `3000` by default.

---
