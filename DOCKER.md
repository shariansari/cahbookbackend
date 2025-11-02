# Docker Setup Guide

## Quick Start

### 1. Setup Environment Variables

Copy the example environment file and update with your values:
```bash
cp .env.example .env
```

Edit `.env` and set your actual values for:
- `JWT_SECRET` - Use a strong random secret
- `MONGO_PASSWORD` - Use a secure password
- Other variables as needed

### 2. Run with Docker Compose

**Production mode:**
```bash
docker-compose up -d
```

**Development mode (with hot reload):**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 3. View Logs
```bash
docker-compose logs -f app
```

### 4. Stop Services
```bash
docker-compose down
```

### 5. Stop and Remove Volumes (WARNING: This deletes your database)
```bash
docker-compose down -v
```

## Services

- **App**: Node.js application running on port 5000
- **MongoDB**: MongoDB database on port 27017

## Environment Variables

The application supports environment variables from:
1. `.env` file (for Docker Compose)
2. Direct environment variables (for container orchestration like Kubernetes)

Required variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `JWT_EXPIRE` - JWT expiration time (default: 7d)
- `NODE_ENV` - Environment mode (development/production)

Optional variables:
- `MONGO_USERNAME` - MongoDB username (default: admin)
- `MONGO_PASSWORD` - MongoDB password (default: password)

## Building the Image Manually

```bash
docker build -t cashbook-backend .
```

## Running Without Docker Compose

```bash
# Start MongoDB
docker run -d --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  -p 27017:27017 \
  mongo:7

# Run the application
docker run -d --name cashbook-app \
  -p 5000:5000 \
  --env-file .env \
  --link mongodb:mongodb \
  cashbook-backend
```

## Troubleshooting

### .env file not found error
This is expected when running in Docker. The `.env` file is intentionally excluded from the Docker image for security. Environment variables should be passed at runtime via:
- Docker Compose `env_file` directive
- `--env-file` flag with docker run
- `-e` flags for individual variables

### MongoDB connection issues
Make sure the `MONGODB_URI` in your `.env` uses `mongodb` as the hostname (not `localhost`) when running with Docker Compose:
```
MONGODB_URI=mongodb://admin:password@mongodb:27017/cashbook?authSource=admin
```

### Port already in use
If port 5000 or 27017 is already in use, you can change it in `.env`:
```
PORT=3000
```
And update the port mapping in `docker-compose.yml` if needed.
