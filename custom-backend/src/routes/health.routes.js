const express = require('express');
const router = express.Router();
const { testConnection } = require('../db/config');

router.get('/', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    
    res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: dbConnected ? 'connected' : 'disconnected',
        uptime: process.uptime()
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Health check failed',
        details: error.message
      }
    });
  }
});

module.exports = router;
