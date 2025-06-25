const cors = require('cors');
const helmet = require('helmet');
const express = require('express');

const rateLimit = require('express-rate-limit');
require('dotenv').config();

module.exports = (app) => {
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

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};