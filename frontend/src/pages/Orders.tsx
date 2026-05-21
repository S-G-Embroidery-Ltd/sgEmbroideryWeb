import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, DollarSign, ArrowRight, Filter, Search, X } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { ordersAPI } from '../services/api';

type Order = {
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

const Orders = () => {
  const { user, isLoaded } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await ordersAPI.getMyOrders({ limit: 100 });
        setOrders(response.data.orders || []);
      } catch (err) {
        setError('Failed to load orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isLoaded]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items?.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function paymentStatusLabel(status: string): string {
    if (status === 'awaiting_manual_confirmation') return 'Awaiting M-Pesa verification';
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function getPaymentStatusColor(status: string): string {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

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
          <Package className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary-900 mb-2">Sign in to view orders</h1>
          <p className="text-primary-700 mb-6">Please sign in to view your order history.</p>
          <Link to="/login" className="inline-flex items-center px-6 py-3 bg-primary-800 text-white font-medium rounded-xl hover:bg-primary-900 transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8 lg:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 font-display mb-2">My Orders</h1>
          <p className="text-primary-700">Track and manage all your orders in one place.</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'processing', 'shipped', 'delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-surface text-primary-800 hover:bg-primary-50'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-800">{error}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-12 text-center">
            <Package className="w-16 h-16 text-primary-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary-900 mb-2">No orders found</h3>
            <p className="text-primary-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters or search terms.'
                : 'When you place orders, they will appear here.'
              }
            </p>
            <Link 
              to="/shop" 
              className="inline-flex items-center px-6 py-3 bg-secondary-500 text-primary-900 font-medium rounded-xl hover:bg-secondary-600 transition-colors"
            >
              Start Shopping <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border border-primary-100 shadow-card p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <h3 className="font-semibold text-primary-900">{order.orderNumber}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {paymentStatusLabel(order.paymentStatus)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-primary-600 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                    </p>

                    {order.items && order.items.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-primary-800 mb-1">Items:</p>
                        <div className="text-sm text-primary-600">
                          {order.items.map((item, index) => (
                            <span key={index}>
                              {item.name} × {item.quantity}
                              {index < order.items!.length - 1 && ' • '}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {order.digitizing?.originalFileName && (
                      <p className="text-sm text-primary-600">
                        File: {order.digitizing.originalFileName}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-primary-600">Total</p>
                      <p className="text-xl font-bold text-primary-900">
                        <DollarSign className="w-5 h-5 inline" />
                        {order.total.toLocaleString()}
                      </p>
                    </div>
                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
