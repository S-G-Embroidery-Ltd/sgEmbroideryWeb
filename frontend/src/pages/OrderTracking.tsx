import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, CreditCard, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { ordersAPI, paymentsAPI } from '../services/api';

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  productId?: string;
  image?: string;
};

type DeliveryInfo = {
  zoneName?: string;
  finalCost?: number;
  estimatedDelivery?: string;
  freeShippingApplied?: boolean;
};

type Order = {
  _id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  status: string;
  paymentStatus: string;
  paymentChannel?: string;
  paymentId?: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    address: string;
    county: string;
    country: string;
    postalCode?: string;
  };
  deliveryInfo?: DeliveryInfo;
  deliveredAt?: string;
  deliveryConfirmedAt?: string;
};

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initiatingPayment, setInitiatingPayment] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await ordersAPI.getById(id);
        setOrder(response.data);
      } catch (err) {
        setError('Failed to load order details');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handlePayNow = async () => {
    if (!order) return;
    
    try {
      setInitiatingPayment(true);
      const response = await paymentsAPI.initiate({
        orderId: order._id,
        email: order.shippingAddress.email,
      });
      
      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      }
    } catch (err) {
      console.error('Error initiating payment:', err);
      setError('Failed to initiate payment');
    } finally {
      setInitiatingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-surface py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/my-activity?tab=orders" className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
          <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-8 text-center">
            <AlertCircle className="w-12 h-12 text-accent-600 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-primary-900 mb-2">Error Loading Order</h1>
            <p className="text-primary-700">{error || 'Order not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/my-activity?tab=orders" className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 font-display mb-2">Order Details</h1>
          <p className="text-primary-700">Order #{order.orderNumber}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6">
              <h2 className="text-lg font-semibold text-primary-900 mb-4">Order Status</h2>
              <div className="flex flex-wrap gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus === 'pending' ? 'Payment Pending' : order.paymentStatus}
                </span>
              </div>
              <p className="text-sm text-primary-600 mt-3">
                <Calendar className="w-4 h-4 inline mr-1" />
                Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6">
              <h2 className="text-lg font-semibold text-primary-900 mb-4">Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-primary-100 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-primary-900">{item.name}</p>
                      <p className="text-sm text-primary-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary-900">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-sm text-primary-600">
                        KES {item.price.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6">
              <h2 className="text-lg font-semibold text-primary-900 mb-4">Shipping Address</h2>
              <div className="space-y-2">
                <p className="text-primary-900 font-medium">{order.shippingAddress.name}</p>
                <p className="text-primary-600">{order.shippingAddress.address}</p>
                <p className="text-primary-600">{order.shippingAddress.county}, {order.shippingAddress.country}</p>
                {order.shippingAddress.postalCode && (
                  <p className="text-primary-600">{order.shippingAddress.postalCode}</p>
                )}
                <p className="text-primary-600">{order.shippingAddress.phone}</p>
                <p className="text-primary-600">{order.shippingAddress.email}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6">
              <h2 className="text-lg font-semibold text-primary-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-primary-700">
                  <span>Subtotal</span>
                  <span>KES {order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-primary-700">
                  <span>VAT (16%)</span>
                  <span>KES {order.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-primary-700">
                  <span>Shipping</span>
                  <span>KES {order.shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary-900 pt-3 border-t border-primary-200">
                  <span>Total</span>
                  <span>KES {order.total.toLocaleString()}</span>
                </div>
              </div>

              {order.paymentStatus === 'pending' && (
                <button
                  onClick={handlePayNow}
                  disabled={initiatingPayment}
                  className="w-full mt-6 inline-flex items-center justify-center px-4 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {initiatingPayment ? 'Processing...' : 'Pay Now'}
                </button>
              )}
            </div>

            {/* Delivery Info */}
            {order.deliveryInfo && (
              <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6">
                <h2 className="text-lg font-semibold text-primary-900 mb-4">Delivery Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center text-primary-700">
                    <Truck className="w-4 h-4 mr-2" />
                    <span className="text-sm">Zone: {order.deliveryInfo.zoneName}</span>
                  </div>
                  <div className="flex items-center text-primary-700">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">Est. Delivery: {order.deliveryInfo.estimatedDelivery}</span>
                  </div>
                  {order.deliveryInfo.freeShippingApplied && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Free Shipping Applied</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Info */}
            {order.paymentStatus === 'paid' && (
              <div className="bg-white rounded-2xl border border-primary-100 shadow-card p-6">
                <h2 className="text-lg font-semibold text-primary-900 mb-4">Payment Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center text-primary-700">
                    <CreditCard className="w-4 h-4 mr-2" />
                    <span className="text-sm">Method: {order.paymentChannel?.toUpperCase() || 'Paystack'}</span>
                  </div>
                  {order.paymentId && (
                    <div className="flex items-center text-primary-700">
                      <Package className="w-4 h-4 mr-2" />
                      <span className="text-sm">Ref: {order.paymentId}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
