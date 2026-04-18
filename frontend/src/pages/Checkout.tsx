import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Lock, ArrowLeft } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { checkoutInfoAPI, ordersAPI, paymentsAPI } from '../services/api';

const TAX_RATE = 0.16;
const FREE_SHIPPING_THRESHOLD = 5000;
const STANDARD_SHIPPING = 300;

type MpesaInfo = {
  mpesaTill: string;
  mpesaPaybill: string;
  mpesaAccountLabel: string;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { cartItems, getCartTotal } = useCart();

  const subtotal = getCartTotal();
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const total = Math.round((subtotal + tax + shipping) * 100) / 100;

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Kenya',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'mpesa_manual'>('paystack');
  const [mpesaInfo, setMpesaInfo] = useState<MpesaInfo | null>(null);
  const [mpesaStepOrderId, setMpesaStepOrderId] = useState<string | null>(null);
  const [mpesaCode, setMpesaCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: user.name || f.name,
        email: user.email || f.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && cartItems.length === 0 && !mpesaStepOrderId) {
      navigate('/cart', { replace: true });
    }
  }, [authLoading, cartItems.length, navigate, mpesaStepOrderId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await checkoutInfoAPI.get();
        if (!cancelled) {
          setMpesaInfo({
            mpesaTill: (data as MpesaInfo).mpesaTill || '',
            mpesaPaybill: (data as MpesaInfo).mpesaPaybill || '',
            mpesaAccountLabel: (data as MpesaInfo).mpesaAccountLabel || '',
          });
        }
      } catch {
        if (!cancelled) setMpesaInfo({ mpesaTill: '', mpesaPaybill: '', mpesaAccountLabel: '' });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const { data: orderRes } = await ordersAPI.create({
        paymentChannel: paymentMethod,
        items: cartItems.map((i) => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          color: i.color,
          size: i.size,
          image: i.image,
          id: i.id,
        })),
        shippingAddress: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          country: form.country.trim(),
          postalCode: form.postalCode.trim(),
        },
      });

      const order = orderRes.order as { _id: string };
      const orderId = order._id;

      if (paymentMethod === 'mpesa_manual') {
        setMpesaStepOrderId(orderId);
        setSubmitting(false);
        return;
      }

      const { data: payRes } = await paymentsAPI.initiate({
        orderId,
        email: form.email.trim(),
      });

      const url = payRes.paymentUrl as string;
      if (!url) {
        throw new Error('No payment URL returned');
      }

      window.location.href = url;
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setError(message || (err instanceof Error ? err.message : 'Checkout failed'));
      setSubmitting(false);
    }
  };

  const handleSubmitMpesaCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mpesaStepOrderId) return;
    setError(null);
    setSubmitting(true);
    try {
      await ordersAPI.submitMpesaCode(mpesaStepOrderId, mpesaCode.trim());
      setMpesaCode('');
      navigate('/my-activity?tab=orders', { replace: true });
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setError(message || (err instanceof Error ? err.message : 'Could not submit code'));
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-primary-50 py-12 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-medium p-8 text-center">
          <Lock className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary-900 mb-2">Sign in to checkout</h1>
          <p className="text-primary-700 mb-6">You need an account to place an order and complete payment.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login" className="btn-primary text-center">
              Log in
            </Link>
            <Link to="/register" className="btn-outline text-center">
              Create account
            </Link>
          </div>
          <Link to="/cart" className="inline-flex items-center gap-2 text-primary-600 mt-6 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to cart
          </Link>
        </div>
      </div>
    );
  }

  if (mpesaStepOrderId) {
    return (
      <div className="min-h-screen bg-primary-50 py-8">
        <div className="max-w-lg mx-auto px-4">
          <Link to="/cart" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to cart
          </Link>
          <div className="bg-white rounded-2xl shadow-medium p-6 space-y-4">
            <h1 className="text-2xl font-bold text-primary-900">Pay with M-Pesa</h1>
            <p className="text-primary-700 text-sm">
              Pay <strong>KES {total.toLocaleString()}</strong> using Buy Goods / Till or Pay Bill, then enter the M-Pesa confirmation code below.
            </p>
            <ul className="text-sm text-primary-800 space-y-2 list-disc list-inside bg-primary-50 rounded-xl p-4">
              {mpesaInfo?.mpesaTill ? (
                <li>
                  <strong>Till / Buy Goods:</strong> {mpesaInfo.mpesaTill}
                </li>
              ) : null}
              {mpesaInfo?.mpesaPaybill ? (
                <li>
                  <strong>Pay Bill:</strong> {mpesaInfo.mpesaPaybill}
                  {mpesaInfo.mpesaAccountLabel ? ` — ${mpesaInfo.mpesaAccountLabel}` : ''}
                </li>
              ) : null}
              {!mpesaInfo?.mpesaTill && !mpesaInfo?.mpesaPaybill ? (
                <li>Payment details are being configured. Contact us if you need help completing payment.</li>
              ) : null}
            </ul>
            {error && (
              <div className="bg-accent-50 border border-accent-200 text-accent-800 px-4 py-3 rounded-xl text-sm">{error}</div>
            )}
            <form onSubmit={handleSubmitMpesaCode} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-primary-800 mb-1">M-Pesa confirmation code</label>
                <input
                  required
                  value={mpesaCode}
                  onChange={(e) => setMpesaCode(e.target.value)}
                  className="w-full px-4 py-2 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g. SH12ABC345"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-3 inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                Submit code
              </button>
            </form>
            <p className="text-xs text-primary-600">
              We will verify your payment manually. You will receive an email when your order is confirmed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/cart" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to cart
        </Link>

        <h1 className="text-3xl font-bold text-primary-900 mb-2">Checkout</h1>
        <p className="text-primary-700 mb-8">Shipping details and payment</p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl shadow-medium p-6">
              <h2 className="text-lg font-semibold text-primary-900 mb-4">Payment method</h2>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <label className="flex items-center gap-2 cursor-pointer border border-primary-200 rounded-xl px-4 py-3 flex-1 has-[:checked]:border-primary-600 has-[:checked]:bg-primary-50">
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'paystack'}
                    onChange={() => setPaymentMethod('paystack')}
                    className="text-primary-600"
                  />
                  <span className="text-sm font-medium text-primary-900">Card / Paystack</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer border border-primary-200 rounded-xl px-4 py-3 flex-1 has-[:checked]:border-primary-600 has-[:checked]:bg-primary-50">
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'mpesa_manual'}
                    onChange={() => setPaymentMethod('mpesa_manual')}
                    className="text-primary-600"
                  />
                  <span className="text-sm font-medium text-primary-900">M-Pesa (manual)</span>
                </label>
              </div>

              <h2 className="text-lg font-semibold text-primary-900 mb-4">Delivery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-primary-800 mb-1">Full name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full px-4 py-2 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-800 mb-1">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-4 py-2 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-800 mb-1">Phone</label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+254 ..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-primary-800 mb-1">Address</label>
                  <input
                    required
                    value={form.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    className="w-full px-4 py-2 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-800 mb-1">City</label>
                  <input
                    required
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="w-full px-4 py-2 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-800 mb-1">Postal code</label>
                  <input
                    required
                    value={form.postalCode}
                    onChange={(e) => updateField('postalCode', e.target.value)}
                    className="w-full px-4 py-2 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-primary-800 mb-1">Country</label>
                  <input
                    required
                    value={form.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    className="w-full px-4 py-2 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-accent-50 border border-accent-200 text-accent-800 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-4 text-lg inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {paymentMethod === 'paystack' ? 'Redirecting to Paystack…' : 'Placing order…'}
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  {paymentMethod === 'paystack'
                    ? `Pay KES ${total.toLocaleString()} with Paystack`
                    : `Place order — KES ${total.toLocaleString()} (M-Pesa)`}
                </>
              )}
            </button>
            <p className="text-xs text-primary-600 text-center">
              {paymentMethod === 'paystack'
                ? 'You will be redirected to Paystack to complete payment securely.'
                : 'You will enter your M-Pesa confirmation code on the next step.'}
            </p>
          </form>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-medium p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-primary-900 mb-4">Order summary</h2>
              <ul className="divide-y divide-primary-100 mb-4 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <li key={item.id} className="py-3 flex justify-between gap-2 text-sm">
                    <span className="text-primary-900">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-primary-900 whitespace-nowrap">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between text-primary-700">
                  <span>Subtotal</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-primary-700">
                  <span>Tax (16%)</span>
                  <span>KES {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-primary-700">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `KES ${shipping.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary-900 pt-2 border-t">
                  <span>Total</span>
                  <span>KES {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
