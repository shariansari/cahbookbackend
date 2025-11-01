# Cashbook Backend API

A Node.js backend API for user authentication with email/phone support.

## Features

- User registration with email and phone
- Login with email or phone
- JWT-based authentication
- Input validation
- Error handling
- MongoDB database

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update MongoDB URI and JWT secret

3. Start MongoDB service

4. Run the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

#### Login User (with Email)
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login User (with Phone)
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "phone": "9876543210",
  "password": "password123"
}
```

#### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`

#### Search User
- **GET** `/api/auth/search?email=user@example.com`
- **GET** `/api/auth/search?phone=9876543210`
- **Headers:** `Authorization: Bearer <token>`

## Project Structure

```
cadhbookbackend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validator.js
│   ├── models/
│   │   └── User.js
│   └── routes/
│       └── authRoutes.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation
