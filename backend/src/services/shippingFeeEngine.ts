/**
 * Shipping Fee Calculation Engine
 * Deterministic location-based pricing for Kenya, Uganda, Tanzania, Rwanda, and International
 */

export interface ShippingFeeRequest {
  country: string;
  county: string;
}

export interface ShippingFeeResponse {
  country: string;
  location: string;
  delivery_zone: string;
  delivery_fee: number;
  currency: string;
  estimated_days: string;
}

class ShippingFeeEngine {
  /**
   * Calculate shipping fee based on location
   * Returns deterministic pricing based on country and city/county
   */
  static calculateShippingFee(request: ShippingFeeRequest): ShippingFeeResponse {
    const { country, county } = request;
    const normalizedCountry = country.toLowerCase().trim();
    const normalizedCounty = county.toLowerCase().trim();

    let deliveryFee = 0;
    let deliveryZone = '';
    let estimatedDays = '';

    // KENYA PRICING
    if (normalizedCountry === 'kenya') {
      if (normalizedCounty === 'mombasa') {
        deliveryFee = 150;
        deliveryZone = 'Mombasa County';
        estimatedDays = '1–2 days';
      } else if (
        normalizedCounty === 'kilifi' ||
        normalizedCounty === 'kwale' ||
        normalizedCounty === 'lamu' ||
        normalizedCounty === 'taita–taveta' ||
        normalizedCounty === 'tana river'
      ) {
        deliveryFee = 200;
        deliveryZone = 'Coastal Region';
        estimatedDays = '2–3 days';
      } else if (
        normalizedCounty === 'nairobi' ||
        normalizedCounty === 'kisumu' ||
        normalizedCounty === 'nakuru' ||
        normalizedCounty === 'uasin gishu' ||
        normalizedCounty === 'mombasa'
      ) {
        deliveryFee = 300;
        deliveryZone = 'Major Counties';
        estimatedDays = '2–3 days';
      } else {
        deliveryFee = 350;
        deliveryZone = 'Other Counties';
        estimatedDays = '3–5 days';
      }
    }
    // UGANDA PRICING
    else if (normalizedCountry === 'uganda') {
      if (normalizedCounty === 'kampala' || normalizedCounty === 'wakiso') {
        deliveryFee = 500;
        deliveryZone = 'Central Region';
        estimatedDays = '2–3 days';
      } else {
        deliveryFee = 700;
        deliveryZone = 'Other Districts';
        estimatedDays = '3–5 days';
      }
    }
    // TANZANIA PRICING
    else if (normalizedCountry === 'tanzania') {
      if (normalizedCounty === 'dar es salaam') {
        deliveryFee = 500;
        deliveryZone = 'Dar es Salaam';
        estimatedDays = '2–3 days';
      } else {
        deliveryFee = 700;
        deliveryZone = 'Other Regions';
        estimatedDays = '3–5 days';
      }
    }
    // RWANDA PRICING
    else if (normalizedCountry === 'rwanda') {
      if (normalizedCounty === 'kigali') {
        deliveryFee = 600;
        deliveryZone = 'Kigali';
        estimatedDays = '2–3 days';
      } else {
        deliveryFee = 750;
        deliveryZone = 'Other Provinces';
        estimatedDays = '3–5 days';
      }
    }
    // INTERNATIONAL PRICING
    else {
      deliveryFee = 1200;
      deliveryZone = 'International';
      estimatedDays = '7–21 days';
    }

    // Build location string
    const location = `${county}, ${country}`;

    return {
      country,
      location,
      delivery_zone: deliveryZone,
      delivery_fee: deliveryFee,
      currency: 'KES',
      estimated_days: estimatedDays,
    };
  }

  /**
   * Get supported countries
   */
  static getSupportedCountries(): string[] {
    return ['Kenya', 'Uganda', 'Tanzania', 'Rwanda'];
  }

  /**
   * Check if a country is supported (returns true for all countries, international pricing applies)
   */
  static isCountrySupported(country: string): boolean {
    return true; // All countries supported with international pricing
  }
}

export default ShippingFeeEngine;
