import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// In-memory storage for demo purposes
// In production, you'd use a proper database
let performanceMetrics = [];
let treeData = [];

// Get performance metrics
router.get('/performance-metrics', auth, (req, res) => {
  try {
    const { range = '1 hour' } = req.query;

    // Filter metrics based on time range
    const now = new Date();
    let timeFilter = now.getTime();

    switch (range) {
      case '1 hour':
        timeFilter = now.getTime() - (60 * 60 * 1000);
        break;
      case '24 hours':
        timeFilter = now.getTime() - (24 * 60 * 60 * 1000);
        break;
      case '7 days':
        timeFilter = now.getTime() - (7 * 24 * 60 * 60 * 1000);
        break;
    }

    const filteredMetrics = performanceMetrics.filter(
      metric => new Date(metric.created_at).getTime() > timeFilter
    );

    res.json(filteredMetrics);
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({ message: 'Failed to fetch performance metrics' });
  }
});

// Log performance metric
router.post('/performance-metrics', auth, (req, res) => {
  try {
    const metric = {
      id: Date.now().toString(),
      ...req.body,
      created_at: new Date().toISOString()
    };

    performanceMetrics.push(metric);

    // Keep only last 1000 metrics to prevent memory issues
    if (performanceMetrics.length > 1000) {
      performanceMetrics = performanceMetrics.slice(-1000);
    }

    res.status(201).json(metric);
  } catch (error) {
    console.error('Error logging performance metric:', error);
    res.status(500).json({ message: 'Failed to log performance metric' });
  }
});

// Get tree data for session
router.get('/tree-data/:sessionId', auth, (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessionData = treeData.filter(item => item.sessionId === sessionId);
    res.json(sessionData);
  } catch (error) {
    console.error('Error fetching tree data:', error);
    res.status(500).json({ message: 'Failed to fetch tree data' });
  }
});

// Save tree data
router.post('/tree-data', auth, (req, res) => {
  try {
    const data = {
      id: Date.now().toString(),
      ...req.body,
      created_at: new Date().toISOString()
    };

    treeData.push(data);

    // Keep only last 100 tree data entries
    if (treeData.length > 100) {
      treeData = treeData.slice(-100);
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error saving tree data:', error);
    res.status(500).json({ message: 'Failed to save tree data' });
  }
});

export default router;
