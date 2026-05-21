import { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, Check, AlertCircle, Smartphone } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

type PaymentMethod = {
  id: string;
  type: 'card' | 'mobile';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  provider?: string;
  phoneNumber?: string;
  createdAt: string;
};

const PaymentMethods = () => {
  const { user, isLoaded } = useUser();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: 'card' as 'card' | 'mobile',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    nameOnCard: '',
    phoneNumber: '',
    provider: 'mpesa' as 'mpesa' | 'airtel' | 'tkash'
  });

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Load payment methods from localStorage (in a real app, this would come from an API)
    const loadPaymentMethods = () => {
      try {
        const saved = localStorage.getItem(`paymentMethods_${user.id}`);
        if (saved) {
          setPaymentMethods(JSON.parse(saved));
        } else {
          // Add some demo data for development
          const demoMethods: PaymentMethod[] = [
            {
              id: '1',
              type: 'card',
              last4: '4242',
              brand: 'visa',
              expiryMonth: 12,
              expiryYear: 2025,
              isDefault: true,
              createdAt: new Date().toISOString()
            },
            {
              id: '2',
              type: 'mobile',
              provider: 'mpesa',
              phoneNumber: '+254712345678',
              isDefault: false,
              createdAt: new Date().toISOString()
            }
          ];
          setPaymentMethods(demoMethods);
          localStorage.setItem(`paymentMethods_${user.id}`, JSON.stringify(demoMethods));
        }
      } catch (error) {
        console.error('Error loading payment methods:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPaymentMethods();
  }, [user, isLoaded]);

  const handleAddPaymentMethod = () => {
    if (!user) return;

    const method: PaymentMethod = {
      id: Date.now().toString(),
      type: newMethod.type,
      isDefault: paymentMethods.length === 0,
      createdAt: new Date().toISOString()
    };

    if (newMethod.type === 'card') {
      method.last4 = newMethod.cardNumber.slice(-4);
      method.brand = getCardBrand(newMethod.cardNumber);
      method.expiryMonth = parseInt(newMethod.expiryMonth);
      method.expiryYear = parseInt(newMethod.expiryYear);
    } else {
      method.provider = newMethod.provider;
      method.phoneNumber = newMethod.phoneNumber;
    }

    const updated = [...paymentMethods, method];
    setPaymentMethods(updated);
    localStorage.setItem(`paymentMethods_${user.id}`, JSON.stringify(updated));

    // Reset form
    setNewMethod({
      type: 'card',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      nameOnCard: '',
      phoneNumber: '',
      provider: 'mpesa'
    });
    setShowAddForm(false);
  };

  const removePaymentMethod = (id: string) => {
    if (!user) return;
    
    const updated = paymentMethods.filter(method => method.id !== id);
    setPaymentMethods(updated);
    localStorage.setItem(`paymentMethods_${user.id}`, JSON.stringify(updated));
  };

  const setDefaultMethod = (id: string) => {
    if (!user) return;
    
    const updated = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    }));
    setPaymentMethods(updated);
    localStorage.setItem(`paymentMethods_${user.id}`, JSON.stringify(updated));
  };

  const getCardBrand = (cardNumber: string): string => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    return 'unknown';
  };

  const getCardIcon = (brand: string) => {
    switch (brand) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'amex': return '💳';
      default: return '💳';
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface py-12 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-card p-8 text-center">
          <CreditCard className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary-900 mb-2">Sign in to manage payment methods</h1>
          <p className="text-primary-700 mb-6">Please sign in to view and manage your payment methods.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8 lg:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 font-display mb-2">Payment Methods</h1>
          <p className="text-primary-700">Manage your payment methods for faster checkout.</p>
        </div>

        {/* Add Payment Method Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-6 py-3 bg-secondary-500 text-primary-900 font-medium rounded-xl hover:bg-secondary-600 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Payment Method
          </button>
        </div>

        {/* Add Payment Method Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 mb-8">
            <h2 className="text-xl font-semibold text-primary-900 mb-6">Add New Payment Method</h2>
            
            {/* Type Selection */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setNewMethod({...newMethod, type: 'card'})}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-colors ${
                  newMethod.type === 'card'
                    ? 'border-primary-600 bg-primary-50 text-primary-900'
                    : 'border-primary-200 text-primary-600 hover:border-primary-300'
                }`}
              >
                <CreditCard className="w-5 h-5 inline mr-2" />
                Credit/Debit Card
              </button>
              <button
                onClick={() => setNewMethod({...newMethod, type: 'mobile'})}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-colors ${
                  newMethod.type === 'mobile'
                    ? 'border-primary-600 bg-primary-50 text-primary-900'
                    : 'border-primary-200 text-primary-600 hover:border-primary-300'
                }`}
              >
                <Smartphone className="w-5 h-5 inline mr-2" />
                Mobile Money
              </button>
            </div>

            {newMethod.type === 'card' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={newMethod.cardNumber}
                    onChange={(e) => setNewMethod({...newMethod, cardNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Name on Card</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={newMethod.nameOnCard}
                    onChange={(e) => setNewMethod({...newMethod, nameOnCard: e.target.value})}
                    className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">Expiry Month</label>
                    <select
                      value={newMethod.expiryMonth}
                      onChange={(e) => setNewMethod({...newMethod, expiryMonth: e.target.value})}
                      className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                    >
                      <option value="">MM</option>
                      {Array.from({length: 12}, (_, i) => (
                        <option key={i + 1} value={i + 1}>{String(i + 1).padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">Expiry Year</label>
                    <select
                      value={newMethod.expiryYear}
                      onChange={(e) => setNewMethod({...newMethod, expiryYear: e.target.value})}
                      className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                    >
                      <option value="">YYYY</option>
                      {Array.from({length: 10}, (_, i) => (
                        <option key={new Date().getFullYear() + i} value={new Date().getFullYear() + i}>
                          {new Date().getFullYear() + i}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={newMethod.cvv}
                      onChange={(e) => setNewMethod({...newMethod, cvv: e.target.value})}
                      className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Mobile Provider</label>
                  <select
                    value={newMethod.provider}
                    onChange={(e) => setNewMethod({...newMethod, provider: e.target.value as 'mpesa' | 'airtel' | 'tkash'})}
                    className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                  >
                    <option value="mpesa">M-Pesa</option>
                    <option value="airtel">Airtel Money</option>
                    <option value="tkash">T-Kash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+254712345678"
                    value={newMethod.phoneNumber}
                    onChange={(e) => setNewMethod({...newMethod, phoneNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddPaymentMethod}
                className="flex-1 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
              >
                Add Payment Method
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-3 bg-surface text-primary-800 font-medium rounded-xl hover:bg-primary-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Payment Methods List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-12 text-center">
            <CreditCard className="w-16 h-16 text-primary-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary-900 mb-2">No payment methods yet</h3>
            <p className="text-primary-600 mb-6">Add a payment method to make checkout faster.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="bg-white rounded-2xl border border-primary-100 shadow-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      {method.type === 'card' ? getCardIcon(method.brand || 'unknown') : '📱'}
                    </div>
                    <div>
                      {method.type === 'card' ? (
                        <>
                          <p className="font-semibold text-primary-900">
                            {method.brand?.toUpperCase()} •••• {method.last4}
                          </p>
                          <p className="text-sm text-primary-600">
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-primary-900">
                            {method.provider?.toUpperCase()}
                          </p>
                          <p className="text-sm text-primary-600">{method.phoneNumber}</p>
                        </>
                      )}
                      {method.isDefault && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                          <Check className="w-3 h-3 mr-1" />
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => setDefaultMethod(method.id)}
                        className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors"
                      >
                        Set as default
                      </button>
                    )}
                    <button
                      onClick={() => removePaymentMethod(method.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Secure Payment Processing</h3>
              <p className="text-sm text-blue-800">
                Your payment information is encrypted and securely stored. We never share your payment details with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
