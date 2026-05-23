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
    town: '',
    county: '',
    postalCode: '',
    ...initialAddress,
  });

  const [availableTowns, setAvailableTowns] = useState<string[]>([]);
  const [loadingTowns, setLoadingTowns] = useState(false);
  const [calculatingDelivery, setCalculatingDelivery] = useState(false);
  const [deliveryCalculation, setDeliveryCalculation] = useState<DeliveryCalculation | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Kenya counties list
  const kenyaCounties = [
    'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', // Coast
    'Taita Taveta', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', // North Eastern
    'Isiolo', 'Meru', 'Tharaka Nithi', 'Embu', 'Kitui', // Eastern
    'Machakos', 'Makueni', 'Kajiado', 'Kiambu', 'Muranga', // Central
    'Nyeri', 'Kirinyaga', 'Nyandarua', // Central continued
    'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', // Rift Valley
    'Uasin Gishu', 'Elgeyo Marakwet', 'Nandi', 'Baringo', // Rift Valley continued
    'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Bomet', // Rift Valley continued
    'Kakamega', 'Vihiga', 'Bungoma', 'Busia', // Western
    'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', // Nyanza
    'Nairobi', // Nairobi
  ];

  const fetchTowns = async (country: string) => {
    try {
      setLoadingTowns(true);
      const response = await deliveryAPI.getTowns(country);
      setAvailableTowns(response.data.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching towns:', error);
      setError('Failed to fetch towns');
      setAvailableTowns([]);
    } finally {
      setLoadingTowns(false);
    }
  };

  const calculateDeliveryCost = useCallback(async () => {
    if (!address.town || !address.country || orderValue <= 0) {
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

  // Fetch towns when country changes
  useEffect(() => {
    if (address.country) {
      fetchTowns(address.country);
    }
  }, [address.country]);

  // Calculate delivery cost when address or order value changes
  useEffect(() => {
    if (address.country && address.town && orderValue > 0) {
      calculateDeliveryCost();
    }
  }, [address, orderValue, calculateDeliveryCost]);

  const handleInputChange = (field: keyof DeliveryAddress, value: string) => {
    const newAddress = { ...address, [field]: value };
    setAddress(newAddress);
    onAddressChange(newAddress);
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
              disabled
            >
              <option value="Kenya">Kenya</option>
              {/* Add more countries when expanding internationally */}
            </select>
            <p className="text-xs text-primary-600 mt-1">
              Currently serving Kenya only. International shipping coming soon.
            </p>
          </div>

          {/* County/State */}
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              County/State *
            </label>
            <select
              value={address.county}
              onChange={(e) => handleInputChange('county', e.target.value)}
              className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select County</option>
              {kenyaCounties.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>

          {/* Town/City */}
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              Town/City *
            </label>
            {loadingTowns ? (
              <div className="w-full px-4 py-2 border border-primary-200 rounded-lg flex items-center">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm text-primary-600">Loading towns...</span>
              </div>
            ) : (
              <select
                value={address.town}
                onChange={(e) => handleInputChange('town', e.target.value)}
                className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select Town</option>
                {availableTowns.map((town) => (
                  <option key={town} value={town}>
                    {town}
                  </option>
                ))}
              </select>
            )}
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
