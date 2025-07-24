require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool, testConnection } = require('./db');
const resumeRoutes = require('./routes/resumeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Validate required environment variables
const validateEnvironment = () => {
  const required = ['DB_USER', 'DB_PASSWORD', 'DB_DATABASE', 'GOOGLE_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('Please check your .env file');
    process.exit(1);
  }
  
  console.log('✅ Environment variables validated');
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/resumes', resumeRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbResult = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      message: 'Resume Analyzer API is running',
      database: 'Connected',
      ai_integration: process.env.GOOGLE_API_KEY ? 'Configured' : 'Not Configured',
      timestamp: dbResult.rows[0].now
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  
  if (error.code === 'MISSING_FIELD_NAME') {
    return res.status(400).json({ 
      error: 'Field name missing. Make sure to use "resume" as the field name in form-data.' 
    });
  }
  
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large (max 5MB)' });
  }
  
  if (error.message === 'Only PDF files are allowed') {
    return res.status(400).json({ error: 'Only PDF files are allowed' });
  }
  
  res.status(500).json({ error: error.message || 'Internal server error' });
});

// Start server with validation
const startServer = async () => {
  console.log('🚀 Starting Resume Analyzer Server...');
  
  // Validate environment
  validateEnvironment();
  
  // Test database connection
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('❌ Failed to connect to database');
    process.exit(1);
  }
  
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🤖 AI Integration: ${process.env.GOOGLE_API_KEY ? 'Enabled' : 'Disabled'}`);
    console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  });
};

startServer();
