import DeliveryZone, { IDeliveryZone } from '../models/DeliveryZone';

export interface DeliveryCalculation {
  zone: IDeliveryZone | null;
  price: number;
  estimatedDelivery: string;
  freeShipping: boolean;
  error?: string;
}

export interface DeliveryAddress {
  country: string;
  county?: string;
  town: string;
  postalCode?: string;
}

export interface DeliveryQuoteRequest {
  address: DeliveryAddress;
  orderValue: number;
}

export interface DeliveryQuoteResponse {
  success: boolean;
  calculation?: DeliveryCalculation;
  error?: string;
}

class DeliveryService {
  private static FREE_SHIPPING_THRESHOLD = 5000; // KES

  /**
   * Calculate delivery cost based on address and order value
   */
  static async calculateDelivery(request: DeliveryQuoteRequest): Promise<DeliveryQuoteResponse> {
    try {
      const { address, orderValue } = request;

      // Validate address
      if (!address.town || !address.country) {
        return {
          success: false,
          error: 'Town and country are required for delivery calculation',
        };
      }

      // Find delivery zone for the town
      const zone = await this.findZoneForTown(address.town, address.country);
      
      if (!zone) {
        return {
          success: false,
          error: `No delivery zone found for ${address.town}, ${address.country}`,
        };
      }

      // Calculate delivery cost
      const basePrice = zone.basePrice;
      const isFreeShipping = orderValue >= this.FREE_SHIPPING_THRESHOLD;
      const finalPrice = isFreeShipping ? 0 : basePrice;

      const calculation: DeliveryCalculation = {
        zone,
        price: finalPrice,
        estimatedDelivery: this.getEstimatedDeliveryText(zone.estimatedDays),
        freeShipping: isFreeShipping,
      };

      return {
        success: true,
        calculation,
      };
    } catch (error) {
      console.error('Error calculating delivery:', error);
      return {
        success: false,
        error: 'Failed to calculate delivery cost',
      };
    }
  }

  /**
   * Find delivery zone for a specific town
   */
  private static async findZoneForTown(town: string, country: string): Promise<IDeliveryZone | null> {
    try {
      // Normalize town name for comparison
      const normalizedTown = town.toLowerCase().trim();
      
      // Find zone where town matches (case-insensitive)
      const zone = await DeliveryZone.findOne({
        country: country,
        towns: { $regex: new RegExp(`^${normalizedTown}$`, 'i') },
        isActive: true,
      });

      return zone;
    } catch (error) {
      console.error('Error finding delivery zone:', error);
      return null;
    }
  }

  /**
   * Get human-readable estimated delivery text
   */
  private static getEstimatedDeliveryText(days: number): string {
    if (days === 1) {
      return '1 business day';
    } else if (days <= 3) {
      return `${days} business days`;
    } else if (days <= 7) {
      return `${days} business days`;
    } else {
      return `${days} business days (remote area)`;
    }
  }

  /**
   * Get all available delivery zones
   */
  static async getAllZones(): Promise<IDeliveryZone[]> {
    try {
      return await DeliveryZone.find({ isActive: true }).sort({ zoneId: 1 });
    } catch (error) {
      console.error('Error fetching delivery zones:', error);
      return [];
    }
  }

  /**
   * Get zones by country
   */
  static async getZonesByCountry(country: string): Promise<IDeliveryZone[]> {
    try {
      return await DeliveryZone.find({ 
        country: country, 
        isActive: true 
      }).sort({ zoneId: 1 });
    } catch (error) {
      console.error('Error fetching delivery zones by country:', error);
      return [];
    }
  }

  /**
   * Get all unique towns from active zones
   */
  static async getAllTowns(country?: string): Promise<string[]> {
    try {
      const query: any = { isActive: true };
      if (country) {
        query.country = country;
      }

      const zones = await DeliveryZone.find(query);
      const towns = new Set<string>();
      
      zones.forEach(zone => {
        zone.towns.forEach(town => towns.add(town));
      });

      return Array.from(towns).sort();
    } catch (error) {
      console.error('Error fetching all towns:', error);
      return [];
    }
  }

  /**
   * Get towns by county (if we implement county mapping)
   */
  static async getTownsByCounty(county: string, country: string): Promise<string[]> {
    try {
      // For now, return all towns for the country
      // In future, we can implement county-town mapping
      const allTowns = await this.getAllTowns(country);
      
      // Simple county matching based on town names (can be enhanced)
      return allTowns.filter(town => 
        town.toLowerCase().includes(county.toLowerCase()) ||
        county.toLowerCase().includes(town.toLowerCase())
      );
    } catch (error) {
      console.error('Error fetching towns by county:', error);
      return [];
    }
  }

  /**
   * Initialize default delivery zones for Kenya
   */
  static async initializeKenyaZones(): Promise<void> {
    try {
      const existingZones = await DeliveryZone.countDocuments({ country: 'Kenya' });
      if (existingZones > 0) {
        console.log('Kenya delivery zones already initialized');
        return;
      }

      const kenyaZones = [
        {
          zoneId: 'ZONE_1',
          name: 'Mombasa Local',
          towns: ['Kongowea', 'Mombasa CBD', 'Nyali', 'Mombasa Island', 'Diani'],
          basePrice: 150,
          estimatedDays: 1,
          country: 'Kenya',
        },
        {
          zoneId: 'ZONE_2',
          name: 'Coastal Region',
          towns: ['Kilifi', 'Malindi', 'Watamu', 'Voi'],
          basePrice: 250,
          estimatedDays: 2,
          country: 'Kenya',
        },
        {
          zoneId: 'ZONE_3',
          name: 'Nairobi Region',
          towns: ['Nairobi CBD', 'Nairobi', 'Thika', 'Athi River'],
          basePrice: 400,
          estimatedDays: 2,
          country: 'Kenya',
        },
        {
          zoneId: 'ZONE_4',
          name: 'Major Towns',
          towns: ['Kisumu', 'Nakuru', 'Eldoret', 'Meru', 'Kakamega'],
          basePrice: 550,
          estimatedDays: 3,
          country: 'Kenya',
        },
        {
          zoneId: 'ZONE_5',
          name: 'Other Major Towns',
          towns: ['Kitale', 'Bungoma', 'Moyale', 'Garissa'],
          basePrice: 650,
          estimatedDays: 4,
          country: 'Kenya',
        },
        {
          zoneId: 'ZONE_6',
          name: 'Remote Areas',
          towns: ['Lodwar', 'Marsabit', 'Wajir', 'Lamu'],
          basePrice: 850,
          estimatedDays: 5,
          country: 'Kenya',
        },
      ];

      await DeliveryZone.insertMany(kenyaZones);
      console.log('Kenya delivery zones initialized successfully');
    } catch (error) {
      console.error('Error initializing Kenya delivery zones:', error);
    }
  }

  /**
   * Update delivery zone pricing (admin function)
   */
  static async updateZonePricing(zoneId: string, newPrice: number): Promise<boolean> {
    try {
      const result = await DeliveryZone.updateOne(
        { zoneId },
        { basePrice: newPrice }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating zone pricing:', error);
      return false;
    }
  }
}

export default DeliveryService;
