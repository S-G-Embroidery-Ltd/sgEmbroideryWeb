import ShippingFeeEngine, { ShippingFeeRequest, ShippingFeeResponse } from './shippingFeeEngine';

export interface DeliveryCalculation {
  zone: {
    zoneId: string;
    name: string;
    basePrice: number;
    estimatedDays: number;
    country: string;
  };
  price: number;
  estimatedDelivery: string;
  freeShipping: boolean;
  error?: string;
}

export interface DeliveryAddress {
  country: string;
  county: string;
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
   * Uses the new shipping fee engine for deterministic pricing
   */
  static async calculateDelivery(request: DeliveryQuoteRequest): Promise<DeliveryQuoteResponse> {
    try {
      const { address, orderValue } = request;

      // Validate address
      if (!address.county || !address.country) {
        return {
          success: false,
          error: 'County and country are required for delivery calculation',
        };
      }

      // Use the shipping fee engine to calculate cost
      const shippingRequest: ShippingFeeRequest = {
        country: address.country,
        county: address.county,
      };

      const shippingResult = ShippingFeeEngine.calculateShippingFee(shippingRequest);

      // Apply free shipping threshold
      const isFreeShipping = orderValue >= this.FREE_SHIPPING_THRESHOLD;
      const finalPrice = isFreeShipping ? 0 : shippingResult.delivery_fee;

      // Parse estimated days to get numeric value
      const estimatedDays = this.parseEstimatedDays(shippingResult.estimated_days);

      const calculation: DeliveryCalculation = {
        zone: {
          zoneId: shippingResult.delivery_zone.replace(/\s+/g, '_').toUpperCase(),
          name: shippingResult.delivery_zone,
          basePrice: shippingResult.delivery_fee,
          estimatedDays,
          country: shippingResult.country,
        },
        price: finalPrice,
        estimatedDelivery: shippingResult.estimated_days,
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
   * Parse estimated days string to get numeric value
   */
  private static parseEstimatedDays(estimatedDays: string): number {
    const match = estimatedDays.match(/(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (estimatedDays.includes('–') || estimatedDays.includes('-')) {
        // Return the upper bound for range
        const parts = estimatedDays.split(/–|-/);
        if (parts.length === 2) {
          const upper = parseInt(parts[1].match(/(\d+)/)?.[1] || '0', 10);
          return upper || num;
        }
      }
      return num;
    }
    return 5; // Default to 5 days
  }

  /**
   * Get all available delivery zones (static data from shipping engine)
   */
  static async getAllZones(): Promise<any[]> {
    // Return static zone information based on the shipping fee engine
    const countries = ShippingFeeEngine.getSupportedCountries();
    const zones: any[] = [];

    countries.forEach(country => {
      zones.push({
        zoneId: country.toUpperCase(),
        name: country,
        basePrice: 0, // Will be calculated dynamically
        estimatedDays: 0,
        country,
        isActive: true,
      });
    });

    // Add international zone
    zones.push({
      zoneId: 'INTERNATIONAL',
      name: 'International',
      basePrice: 1200,
      estimatedDays: 21,
      country: 'International',
      isActive: true,
    });

    return zones;
  }

  /**
   * Get zones by country (static data from shipping engine)
   */
  static async getZonesByCountry(country: string): Promise<any[]> {
    const zones = await this.getAllZones();
    return zones.filter(zone => zone.country === country);
  }

  /**
   * Get all unique towns for a country (static list)
   */
  static async getAllTowns(country?: string): Promise<string[]> {
    // Return a comprehensive list of towns for supported countries
    const townsByCountry: Record<string, string[]> = {
      kenya: [
        'Mombasa', 'Kilifi', 'Kwale', 'Malindi', 'Nairobi', 'Kisumu', 'Nakuru', 'Eldoret',
        'Thika', 'Athi River', 'Meru', 'Kakamega', 'Kitale', 'Bungoma', 'Moyale', 'Garissa',
        'Lodwar', 'Marsabit', 'Wajir', 'Lamu', 'Nyeri', 'Kiambu', 'Muranga', 'Kirinyaga',
        'Nyandarua', 'Machakos', 'Makueni', 'Kajiado', 'Embu', 'Tharaka Nithi', 'Kitui',
        'Isiolo', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu',
        'Elgeyo Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Narok', 'Bomet', 'Kakamega',
        'Vihiga', 'Busia', 'Siaya', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Taita Taveta',
        'Tana River', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo',
      ],
      uganda: [
        'Kampala', 'Entebbe', 'Jinja', 'Gulu', 'Mbarara', 'Mbale', 'Arua', 'Lira',
        'Fort Portal', 'Hoima', 'Masaka', 'Soroti', 'Kasese', 'Mbale', 'Gulu',
      ],
      tanzania: [
        'Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Tanga', 'Morogoro', 'Zanzibar',
        'Kigoma', 'Tabora', 'Iringa', 'Mbeya', 'Songea', 'Lindi', 'Mtwara', 'Bukoba',
        'Musoma', 'Shinyanga', 'Singida', 'Sumbawanga',
      ],
      rwanda: [
        'Kigali', 'Butare', 'Gitarama', 'Ruhengeri', 'Gisenyi', 'Kibuye', 'Cyangugu',
        'Byumba', 'Kibungo', 'Rwamagana',
      ],
    };

    if (country) {
      const normalizedCountry = country.toLowerCase();
      return townsByCountry[normalizedCountry] || [];
    }

    // Return all towns if no country specified
    return Object.values(townsByCountry).flat();
  }

  /**
   * Get towns by county (simplified implementation)
   */
  static async getTownsByCounty(county: string, country: string): Promise<string[]> {
    const allTowns = await this.getAllTowns(country);
    
    // Simple county matching based on town names
    return allTowns.filter(town => 
      town.toLowerCase().includes(county.toLowerCase()) ||
      county.toLowerCase().includes(town.toLowerCase())
    );
  }
}

export default DeliveryService;
