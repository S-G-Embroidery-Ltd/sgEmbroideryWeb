import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { paymentsAPI } from '../services/api';
import { useCart } from '../hooks/useCart';

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');

    if (!reference) {
      setStatus('error');
      setMessage('Missing payment reference. If you completed payment, check your email or orders.');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const { data } = await paymentsAPI.verify(reference);
        if (cancelled) return;
        if (data.status === 'success') {
          clearCart();
          setStatus('success');
          setMessage('Payment successful. Thank you for your order!');
        } else {
          setStatus('error');
          setMessage(`Payment status: ${data.status || 'unknown'}`);
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const msg =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
            : null;
        setStatus('error');
        setMessage(msg || 'Could not verify payment. Contact support with your Paystack reference.');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, clearCart]);

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
