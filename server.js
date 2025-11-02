const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file if it exists
// In production/Docker/Railway, environment variables may be provided directly
const result = dotenv.config({ path: path.join(__dirname, '.env') });

if (result.error) {
  if (result.error.code === 'ENOENT') {
    console.warn('Warning: .env file not found. Using environment variables from system.');
    console.warn('Make sure required environment variables (MONGODB_URI, JWT_SECRET, etc.) are set.');
  } else {
    console.error('Error loading .env file:', result.error);
    process.exit(1);
  }
}

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');
const authRoutes = require('./src/routes/authRoutes');
const expenseRoutes = require('./src/routes/expenseRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const roleRoutes = require('./src/routes/roleRoutes');

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('\n❌ ERROR: Missing required environment variables:');
  missingEnvVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n📝 If deploying to Railway.app, Docker, or other platforms:');
  console.error('   Set these variables in your platform\'s dashboard or configuration.');
  console.error('\n📝 For local development:');
  console.error('   Make sure you have a .env file with all required variables.');
  console.error('   Copy .env.example to .env and fill in your values.\n');
  process.exit(1);
}

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Cashbook API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/', expenseRoutes);
app.use('/', uploadRoutes);
app.use('/', roleRoutes);

// Error handler middleware (should be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
