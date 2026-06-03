import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { paymentsAPI } from '../services/api';
import { useCart } from '../hooks/useCart';

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'cancelled'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    const cancelled = searchParams.get('cancelled');

    // Handle explicit cancellation from Paystack
    if (cancelled === 'true') {
      setStatus('cancelled');
      setMessage('Payment was cancelled. You can try again whenever you\'re ready.');
      return;
    }

    if (!reference) {
      setStatus('error');
      setMessage('Missing payment reference. If you completed payment, check your email or orders.');
      return;
    }

    let isCancelled = false;

    (async () => {
      try {
        console.log('Verifying payment with reference:', reference);
        const { data } = await paymentsAPI.verify(reference);
        console.log('Verification response:', data);
        
        if (isCancelled) return;
        
        if (data.status === 'success') {
          clearCart();
          setStatus('success');
          setMessage('Payment successful. Thank you for your order!');
          
          // Redirect to order details after 2 seconds
          setTimeout(() => {
            if (data.orderId) {
              navigate(`/orders/${data.orderId}`, { replace: true });
            } else {
              navigate('/my-activity', { replace: true });
            }
          }, 2000);
        } else {
          // Handle failed or cancelled payments
          setStatus('cancelled');
          setMessage(`Payment ${data.status || 'was cancelled'}. No worries, you can try again.`);
        }
      } catch (err: unknown) {
        console.error('Payment verification error:', err);
        if (isCancelled) return;
        const msg =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
            : null;
        setStatus('error');
        setMessage(msg || 'Payment verification failed. Please check your connection or try again.');
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [searchParams, clearCart, navigate]);

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-medium p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-bold text-primary-900 mb-2">Verifying payment…</h1>
            <p className="text-primary-700 text-sm">Please wait while we confirm your transaction with Paystack.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-14 h-14 text-secondary-600 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-primary-900 mb-2">Payment confirmed</h1>
            <p className="text-primary-700 mb-6">{message}</p>
            <div className="flex flex-col gap-3">
              <Link to="/my-activity" className="btn-primary">
                View my activity
              </Link>
              <Link to="/shop" className="btn-outline">
                Continue shopping
              </Link>
            </div>
          </>
        )}

        {status === 'cancelled' && (
          <>
            <AlertCircle className="w-14 h-14 text-primary-600 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-primary-900 mb-2">Payment cancelled</h1>
            <p className="text-primary-700 mb-6 text-sm">{message}</p>
            <div className="flex flex-col gap-3">
              <Link to="/checkout" className="btn-primary">
                Try payment again
              </Link>
              <Link to="/cart" className="btn-outline">
                Review your cart
              </Link>
              <Link to="/shop" className="text-sm text-primary-600 hover:text-primary-800 mt-2">
                Continue shopping
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-14 h-14 text-accent-600 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-primary-900 mb-2">Verification issue</h1>
            <p className="text-primary-700 mb-6 text-sm">{message}</p>
            <div className="flex flex-col gap-3">
              <Link to="/cart" className="btn-primary">
                Return to cart
              </Link>
              <Link to="/" className="btn-outline">
                Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentVerify;
