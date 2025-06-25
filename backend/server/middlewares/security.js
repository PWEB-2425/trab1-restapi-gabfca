const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

exports.securityMiddleware = (app) => {
  // Security Middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*'
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);
};