
import express from 'express';
import DeliveryService from '../services/deliveryService';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * Get all delivery zones
 * GET /api/delivery/zones
 */
router.get('/zones', async (req, res) => {
  try {
    const { country } = req.query;
    
    let zones;
    if (country && typeof country === 'string') {
      zones = await DeliveryService.getZonesByCountry(country);
    } else {
      zones = await DeliveryService.getAllZones();
    }

    res.json({
      success: true,
      data: zones,
      count: zones.length,
    });
  } catch (error) {
    console.error('Error fetching delivery zones:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch delivery zones',
    });
  }
});

/**
 * Calculate delivery cost
 * POST /api/delivery/calculate
 */
router.post('/calculate', async (req, res) => {
  try {
    const { address, orderValue } = req.body;

    // Validate request body
    if (!address || !orderValue) {
      return res.status(400).json({
        success: false,
        error: 'Address and orderValue are required',
      });
    }

    if (typeof orderValue !== 'number' || orderValue < 0) {
      return res.status(400).json({
        success: false,
        error: 'Order value must be a positive number',
      });
    }

    const result = await DeliveryService.calculateDelivery({
      address,
      orderValue,
    });

    if (result.success) {
      res.json({
        success: true,
        data: result.calculation,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Error calculating delivery:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate delivery cost',
    });
  }
});

/**
 * Get all available towns
 * GET /api/delivery/towns
 */
router.get('/towns', async (req, res) => {
  try {
    const { country } = req.query;
    
    let towns;
    if (country && typeof country === 'string') {
      towns = await DeliveryService.getAllTowns(country);
    } else {
      towns = await DeliveryService.getAllTowns();
    }

    res.json({
      success: true,
      data: towns,
      count: towns.length,
    });
  } catch (error) {
    console.error('Error fetching towns:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch towns',
    });
  }
});

/**
 * Get towns by county
 * GET /api/delivery/towns/:county
 */
router.get('/towns/:county', async (req, res) => {
  try {
    const { county } = req.params;
    const { country = 'Kenya' } = req.query;

    if (!county) {
      return res.status(400).json({
        success: false,
        error: 'County parameter is required',
      });
    }

    const towns = await DeliveryService.getTownsByCounty(county, country as string);

    res.json({
      success: true,
      data: towns,
      count: towns.length,
    });
  } catch (error) {
    console.error('Error fetching towns by county:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch towns by county',
    });
  }
});

export default router;
