import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Loader2,
  Lock,
  Package,
  FileText,
  Image as ImageIcon,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ordersAPI, quoteRequestsAPI } from '../services/api';

type TabId = 'orders' | 'quotes' | 'logos';

function paymentStatusLabel(s: string): string {
  if (s === 'awaiting_manual_confirmation') return 'Awaiting M-Pesa verification';
  return s;
}

type ApiOrder = {
  _id: string;
  orderNumber: string;
  orderType?: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items?: Array<{ name: string; quantity: number; price: number }>;
  digitizing?: { originalFileName?: string };
};

type ApiQuote = {
  _id: string;
  description: string;
  status: string;
  createdAt: string;
  quantity?: string;
  timeline?: string;
};

const tabs: { id: TabId; label: string; short: string; icon: typeof Package }[] = [
  { id: 'orders', label: 'Shop orders', short: 'Orders', icon: Package },
  { id: 'quotes', label: 'Project quotes', short: 'Quotes', icon: FileText },
  { id: 'logos', label: 'Logo digitizing', short: 'Logos', icon: ImageIcon },
];

const MyActivity = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab') as TabId | null;
  const activeTab: TabId =
    tabParam === 'quotes' || tabParam === 'logos' || tabParam === 'orders' ? tabParam : 'orders';

  const setTab = (id: TabId) => {
    setSearchParams({ tab: id }, { replace: true });
  };

  const [ordersLoading, setOrdersLoading] = useState(true);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [quotesError, setQuotesError] = useState<string | null>(null);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [quotes, setQuotes] = useState<ApiQuote[]>([]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    (async () => {
      setOrdersLoading(true);
      setOrdersError(null);
      try {
        const { data } = await ordersAPI.getMyOrders({ limit: 100 });
        if (!cancelled) setOrders((data.orders as ApiOrder[]) || []);
      } catch {
        if (!cancelled) setOrdersError('Could not load orders.');
      } finally {
        if (!cancelled) setOrdersLoading(false);
      }
    })();

    (async () => {
      setQuotesLoading(true);
      setQuotesError(null);
      try {
        const { data } = await quoteRequestsAPI.getMy();
        if (!cancelled) setQuotes((data.quoteRequests as ApiQuote[]) || []);
      } catch {
        if (!cancelled) setQuotesError('Could not load quote requests.');
      } finally {
        if (!cancelled) setQuotesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const shopOrders = useMemo(
    () => orders.filter((o) => !o.orderType || o.orderType === 'standard'),
    [orders]
  );

  const digitizingOrders = useMemo(
    () => orders.filter((o) => o.orderType === 'digitizing'),
    [orders]
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface py-12 px-4">
        <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-card p-8 text-center">
          <Lock className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary-900 mb-2 font-display">Sign in to view activity</h1>
          <p className="text-primary-700 mb-6">
            See your shop orders, project quote requests, and logo digitizing jobs in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login" className="btn-primary text-center">
              Log in
            </Link>
            <Link to="/register" className="btn-outline text-center">
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-2 font-display">My activity</h1>
          <p className="text-primary-700">
            Orders from the shop, estimates you&apos;ve requested for projects, and paid logo digitizing work — together in
            one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-white rounded-2xl border border-primary-100 shadow-card w-fit max-w-full">
          {tabs.map(({ id, label, short, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-primary-800 hover:bg-primary-50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{short}</span>
            </button>
          ))}
        </div>

        {activeTab === 'orders' && (
          <section aria-labelledby="tab-orders">
            <h2 id="tab-orders" className="sr-only">
              Shop orders
            </h2>
            {ordersLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              </div>
            ) : ordersError ? (
              <p className="text-accent-700 bg-accent-50 rounded-2xl p-4 border border-accent-100">{ordersError}</p>
            ) : shopOrders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-primary-200 bg-white p-10 text-center">
                <Package className="w-12 h-12 text-primary-300 mx-auto mb-4" />
                <p className="text-primary-800 font-medium mb-2">No shop orders yet</p>
                <p className="text-primary-600 text-sm mb-6">When you buy from the store and pay, your orders show up here.</p>
                <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
                  Browse shop <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {shopOrders.map((o) => (
                  <li
                    key={o._id}
                    className="rounded-2xl bg-white border border-primary-100 shadow-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div>
                      <p className="font-semibold text-primary-900">{o.orderNumber}</p>
                      <p className="text-sm text-primary-600">
                        {new Date(o.createdAt).toLocaleString()} · {paymentStatusLabel(o.paymentStatus)} · {o.status}
                      </p>
                      {o.items && o.items.length > 0 && (
                        <p className="text-sm text-primary-700 mt-2 line-clamp-2">
                          {o.items.map((i) => `${i.name} ×${i.quantity}`).join(' · ')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-lg font-bold text-primary-900">KES {o.total.toLocaleString()}</span>
                      <Link to={`/orders/${o._id}`} className="btn-outline text-sm py-2 px-4">
                        Details
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {activeTab === 'quotes' && (
          <section aria-labelledby="tab-quotes">
            <h2 id="tab-quotes" className="sr-only">
              Project quotes
            </h2>
            {quotesLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              </div>
            ) : quotesError ? (
              <p className="text-accent-700 bg-accent-50 rounded-2xl p-4 border border-accent-100">{quotesError}</p>
            ) : quotes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-primary-200 bg-white p-10 text-center">
                <FileText className="w-12 h-12 text-primary-300 mx-auto mb-4" />
                <p className="text-primary-800 font-medium mb-2">No project quotes yet</p>
                <p className="text-primary-600 text-sm mb-6 max-w-md mx-auto">
                  Request an estimate for uniforms, bulk work, or mixed jobs — we&apos;ll reply with pricing tailored to your
                  scope.
                </p>
                <Link to="/quote" className="btn-primary inline-flex items-center gap-2">
                  Request a project estimate <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {quotes.map((q) => (
                  <li key={q._id} className="rounded-2xl bg-white border border-primary-100 shadow-card p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-secondary-700">
                        {q.status}
                      </span>
                      <span className="text-sm text-primary-600">{new Date(q.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-primary-900 leading-relaxed line-clamp-4">{q.description}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-primary-600">
                      {q.quantity && <span>Qty: {q.quantity}</span>}
                      {q.timeline && <span>Timeline: {q.timeline}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {activeTab === 'logos' && (
          <section aria-labelledby="tab-logos">
            <h2 id="tab-logos" className="sr-only">
              Logo digitizing
            </h2>
            {ordersLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              </div>
            ) : ordersError ? (
              <p className="text-accent-700 bg-accent-50 rounded-2xl p-4 border border-accent-100">{ordersError}</p>
            ) : digitizingOrders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-primary-200 bg-white p-10 text-center">
                <ImageIcon className="w-12 h-12 text-primary-300 mx-auto mb-4" />
                <p className="text-primary-800 font-medium mb-2">No logo digitizing orders</p>
                <p className="text-primary-600 text-sm mb-6 max-w-md mx-auto">
                  Submit your PNG or JPEG and pay the origination fee — completed jobs appear here with payment status.
                </p>
                <Link to="/logo-embroidery" className="btn-primary inline-flex items-center gap-2">
                  Embroidery from your logo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {digitizingOrders.map((o) => (
                  <li
                    key={o._id}
                    className="rounded-2xl bg-white border border-primary-100 shadow-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div>
                      <p className="font-semibold text-primary-900">{o.orderNumber}</p>
                      <p className="text-sm text-primary-600">
                        {new Date(o.createdAt).toLocaleString()} · Payment: {paymentStatusLabel(o.paymentStatus)}
                      </p>
                      {o.digitizing?.originalFileName && (
                        <p className="text-sm text-primary-700 mt-1">File: {o.digitizing.originalFileName}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-lg font-bold text-primary-900">KES {o.total.toLocaleString()}</span>
                      <Link to={`/orders/${o._id}`} className="btn-outline text-sm py-2 px-4">
                        Details
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default MyActivity;
