import { useState, useEffect, useCallback } from 'react';
import { MapPin, Globe, Check, AlertCircle, Loader2 } from 'lucide-react';
import { deliveryAPI, type DeliveryAddress, type DeliveryCalculationRequest } from '../../services/api';

interface DeliveryZone {
  _id: string;
  zoneId: string;
  name: string;
  towns: string[];
  basePrice: number;
  estimatedDays: number;
  isActive: boolean;
  country: string;
}

interface DeliveryCalculation {
  zone: DeliveryZone;
  price: number;
  estimatedDelivery: string;
  freeShipping: boolean;
}

interface DeliveryAddressFormProps {
  onAddressChange: (address: DeliveryAddress) => void;
  onDeliveryCalculation: (calculation: DeliveryCalculation | null) => void;
  orderValue: number;
  initialAddress?: Partial<DeliveryAddress>;
}

const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = ({
  onAddressChange,
  onDeliveryCalculation,
  orderValue,
  initialAddress = {},
}) => {
  const [address, setAddress] = useState<DeliveryAddress>({
    country: 'Kenya',
    county: '',
    streetAddress: '',
    postalCode: '',
    ...initialAddress,
  });

  const [calculatingDelivery, setCalculatingDelivery] = useState(false);
  const [deliveryCalculation, setDeliveryCalculation] = useState<DeliveryCalculation | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Supported countries
  const countries = ['Kenya', 'Uganda', 'Tanzania', 'Rwanda'];

  // Kenya counties list (official 47 counties)
  const kenyaCounties = [
    'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita–Taveta', // Coast
    'Garissa', 'Wajir', 'Mandera', // North Eastern
    'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', // Eastern
    'Nyandarua', 'Nyeri', 'Kirinyaga', 'Murang\'a', 'Kiambu', // Central
    'Turkana', 'West Pokot', 'Samburu', 'Trans-Nzoia', 'Uasin Gishu', 'Elgeyo-Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', // Rift Valley
    'Kakamega', 'Vihiga', 'Bungoma', 'Busia', // Western
    'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', // Nyanza
    'Nairobi', // Nairobi
  ];

  // Uganda districts list (major districts - Uganda has 135+ districts)
  const ugandaDistricts = [
    'Kampala', 'Wakiso', 'Mukono', 'Mpigi', 'Jinja', 'Gulu', 'Lira', 'Mbarara',
    'Arua', 'Mbale', 'Fort Portal', 'Hoima', 'Masaka', 'Soroti', 'Kasese',
    'Iganga', 'Mityana', 'Luweero', 'Ntungamo', 'Rukungiri', 'Kabale', 'Tororo',
    'Busia', 'Kiboga', 'Kyenjojo', 'Kamwenge', 'Bundibugyo', 'Ntoroko', 'Kyegegwa',
  ];

  // Tanzania regions list (official 31 regions)
  const tanzaniaRegions = [
    'Arusha', 'Dar es Salaam', 'Dodoma', 'Geita', 'Iringa', 'Kagera', 'Katavi',
    'Kigoma', 'Kilimanjaro', 'Lindi', 'Manyara', 'Mara', 'Mbeya', 'Mjini Magharibi (Zanzibar)',
    'Morogoro', 'Mtwara', 'Mwanza', 'Njombe', 'Pemba North', 'Pemba South', 'Pwani (Coast)',
    'Rukwa', 'Ruvuma', 'Shinyanga', 'Simiyu', 'Singida', 'Songwe', 'Tabora', 'Tanga',
    'Unguja North', 'Unguja South',
  ];

  // Rwanda provinces list
  const rwandaProvinces = [
    'Kigali', 'Northern', 'Southern', 'Eastern', 'Western',
  ];

  const calculateDeliveryCost = useCallback(async () => {
    if (!address.county || !address.country || orderValue <= 0) {
      return;
    }

    try {
      setCalculatingDelivery(true);
      setError(null);

      const request: DeliveryCalculationRequest = {
        address,
        orderValue,
      };

      const response = await deliveryAPI.calculateCost(request);
      
      if (response.data.success) {
        const calculation = response.data.data;
        setDeliveryCalculation(calculation);
        onDeliveryCalculation(calculation);
        setError(null);
      } else {
        setError(response.data.error || 'Failed to calculate delivery cost');
        setDeliveryCalculation(null);
        onDeliveryCalculation(null);
      }
    } catch (error) {
      console.error('Error calculating delivery:', error);
      setError('Failed to calculate delivery cost');
      setDeliveryCalculation(null);
      onDeliveryCalculation(null);
    } finally {
      setCalculatingDelivery(false);
    }
  }, [address, orderValue, onDeliveryCalculation]);

  // Calculate delivery cost when address or order value changes
  useEffect(() => {
    if (address.country && address.county && orderValue > 0) {
      calculateDeliveryCost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address.country, address.county, orderValue]);

  const handleInputChange = (field: keyof DeliveryAddress, value: string) => {
    const newAddress = { ...address, [field]: value };
    
    // Reset county when country changes
    if (field === 'country') {
      newAddress.county = '';
    }
    
    setAddress(newAddress);
    onAddressChange(newAddress);
  };

  // Get counties/districts/regions based on selected country
  const getCountiesForCountry = () => {
    switch (address.country) {
      case 'Kenya':
        return kenyaCounties;
      case 'Uganda':
        return ugandaDistricts;
      case 'Tanzania':
        return tanzaniaRegions;
      case 'Rwanda':
        return rwandaProvinces;
      default:
        return [];
    }
  };

  const getCountyLabel = () => {
    switch (address.country) {
      case 'Kenya':
        return 'County';
      case 'Uganda':
        return 'District';
      case 'Tanzania':
        return 'Region';
      case 'Rwanda':
        return 'Province';
      default:
        return 'State/Province';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center mb-6">
          <MapPin className="w-5 h-5 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-primary-900">Delivery Address</h3>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              Country *
            </label>
            <select
              value={address.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
              <option value="Other">Other (International)</option>
            </select>
          </div>

          {/* County/State */}
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              {getCountyLabel()} *
            </label>
            <select
              value={address.county}
              onChange={(e) => handleInputChange('county', e.target.value)}
              className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select {getCountyLabel()}</option>
              {getCountiesForCountry().map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>

          {/* Street Address */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-primary-900 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              value={address.streetAddress}
              onChange={(e) => handleInputChange('streetAddress', e.target.value)}
              placeholder="Street address, building, house number, etc."
              className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Postal Code (Optional) */}
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              Postal Code (Optional)
            </label>
            <input
              type="text"
              value={address.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
              placeholder="Enter postal code"
              className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Delivery Calculation Results */}
      {calculatingDelivery && (
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center">
            <Loader2 className="w-5 h-5 animate-spin text-primary-600 mr-2" />
            <span className="text-primary-700">Calculating delivery cost...</span>
          </div>
        </div>
      )}

      {deliveryCalculation && !calculatingDelivery && (
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center mb-4">
            <Globe className="w-5 h-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-semibold text-primary-900">Delivery Options</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-primary-100">
              <span className="text-primary-700">Delivery Zone:</span>
              <span className="font-medium text-primary-900">{deliveryCalculation.zone?.name}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-primary-100">
              <span className="text-primary-700">Estimated Delivery:</span>
              <span className="font-medium text-primary-900">{deliveryCalculation.estimatedDelivery}</span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-primary-700">Delivery Cost:</span>
              <div className="text-right">
                {deliveryCalculation.freeShipping ? (
                  <div>
                    <span className="text-green-600 font-medium">FREE</span>
                    <p className="text-xs text-green-600">Free shipping applied!</p>
                  </div>
                ) : (
                  <span className="font-medium text-primary-900">
                    KES {deliveryCalculation.price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {deliveryCalculation.freeShipping && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm text-green-700">
                  Free shipping applied for orders over KES 5,000
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryAddressForm;
