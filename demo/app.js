/**
 * Demo application for Tears of the Kingdom VSCode Theme
 * @author Link
 * @version 1.0.0
 */

const express = require('express');
const path = require('path');

// Constants
const PORT = process.env.PORT || 3000;
const API_KEY = 'demo-api-key-123';

class Application {
  constructor(config) {
    this.config = config;
    this.server = null;
    this.routes = new Map();
  }

  /**
   * Initialize the application
   */
  async initialize() {
    const app = express();
    
    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Routes
    app.get('/', (req, res) => {
      res.json({
        message: 'Welcome to Hyrule!',
        timestamp: new Date().toISOString(),
        status: 'active'
      });
    });

    app.post('/api/shrines', async (req, res) => {
      try {
        const { name, location, type } = req.body;
        const shrine = await this.createShrine(name, location, type);
        res.status(201).json(shrine);
      } catch (error) {
        console.error('Error creating shrine:', error);
        res.status(500).json({ error: error.message });
      }
    });

    this.server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }

  async createShrine(name, location, type = 'combat') {
    return {
      id: Math.random().toString(36).substr(2, 9),
      name,
      location,
      type,
      completed: false,
      rewards: ['Spirit Orb']
    };
  }

  shutdown() {
    if (this.server) {
      this.server.close();
      console.log('Server shut down');
    }
  }
}

// Export
module.exports = Application;
