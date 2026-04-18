import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Lock, ArrowLeft } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { ordersAPI, paymentsAPI } from '../services/api';

const TAX_RATE = 0.16;
const FREE_SHIPPING_THRESHOLD = 5000;
const STANDARD_SHIPPING = 300;

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
    if (!authLoading && cartItems.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [authLoading, cartItems.length, navigate]);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePayWithPaystack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const { data: orderRes } = await ordersAPI.create({
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
          <p className="text-primary-700 mb-6">You need an account to place an order and pay with Paystack.</p>
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

  return (
    <div className="min-h-screen bg-primary-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/cart" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to cart
        </Link>

        <h1 className="text-3xl font-bold text-primary-900 mb-2">Checkout</h1>
        <p className="text-primary-700 mb-8">Shipping details and secure payment with Paystack</p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <form onSubmit={handlePayWithPaystack} className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl shadow-medium p-6">
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
                  Redirecting to Paystack…
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Pay KES {total.toLocaleString()} with Paystack
                </>
              )}
            </button>
            <p className="text-xs text-primary-600 text-center">
              You will be redirected to Paystack to complete payment securely. Use test keys in development.
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
