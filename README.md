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

## Docker Deployment

### Building the Docker Image

Build the Docker image using the provided Dockerfile:

```bash
docker build -t cadhbook-backend .
```

### Running with Docker

#### Basic Run

```bash
docker run -p 5000:5000 --env-file .env cadhbook-backend
```

#### Run with Environment Variables

```bash
docker run -p 5000:5000 \
  -e PORT=5000 \
  -e MONGODB_URI=mongodb://mongo:27017/cashbook \
  -e JWT_SECRET=your_jwt_secret \
  cadhbook-backend
```

#### Run with Volume for Uploads

```bash
docker run -p 5000:5000 \
  --env-file .env \
  -v $(pwd)/uploads:/app/uploads \
  cadhbook-backend
```

### Docker Compose (Recommended)

Create a `docker-compose.yml` file for easier deployment with MongoDB:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    container_name: cashbook-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: cashbook

  backend:
    build: .
    container_name: cashbook-backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    volumes:
      - ./uploads:/app/uploads
    environment:
      - PORT=5000
      - MONGODB_URI=mongodb://mongodb:27017/cashbook
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb

volumes:
  mongodb_data:
```

Run with Docker Compose:

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Environment Variables for Docker

Create a `.env` file in the project root:

```env
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/cashbook
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
```

### Docker Commands Reference

```bash
# Build image
docker build -t cadhbook-backend .

# Run container
docker run -p 5000:5000 --env-file .env cadhbook-backend

# Run in detached mode
docker run -d -p 5000:5000 --env-file .env cadhbook-backend

# View running containers
docker ps

# View logs
docker logs <container_id>

# Stop container
docker stop <container_id>

# Remove container
docker rm <container_id>

# Remove image
docker rmi cadhbook-backend




docker tag cadhbook-backend shariq508/cadhbook-backend:latest


docker push shariq508/cadhbook-backend:latest


docker buildx build --platform linux/amd64 -t shariq508/cadhbook-backend:latest .




```

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation
- Docker & Docker Compose
