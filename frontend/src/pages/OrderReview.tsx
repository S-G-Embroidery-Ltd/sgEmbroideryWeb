import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const OrderReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Record<string, { rating: number; title: string; comment: string }>>({});
  const [submitting, setSubmitting] = useState(false);

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await ordersAPI.getById(id!);
      return response.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (order?.items) {
      const initialReviews: Record<string, { rating: number; title: string; comment: string }> = {};
      order.items.forEach((item: { productId?: string }) => {
        if (item.productId) {
          initialReviews[item.productId] = { rating: 5, title: '', comment: '' };
        }
      });
      setReviews(initialReviews);
    }
  }, [order]);

  const handleRatingChange = (productId: string, rating: number) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], rating },
    }));
  };

  const handleFieldChange = (productId: string, field: 'title' | 'comment', value: string) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const handleSubmit = async () => {
    if (!order || !user) return;

    const reviewsArray = Object.entries(reviews)
      .filter(([productId, review]) => {
        // Only submit reviews for items that haven't been reviewed yet
        return !order.reviewSubmitted?.includes(productId) && review.comment.trim().length >= 10;
      })
      .map(([productId, review]) => ({
        productId,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
      }));

    if (reviewsArray.length === 0) {
      alert('Please add at least one review with a comment (minimum 10 characters).');
      return;
    }

    try {
      setSubmitting(true);
      await ordersAPI.submitReview(order._id, reviewsArray);
      navigate('/orders');
    } catch (err) {
      console.error('Error submitting reviews:', err);
      alert('Failed to submit reviews. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-surface py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-card p-8 text-center">
          <p className="text-primary-700">Please sign in to review your order.</p>
          <Link to="/login" className="inline-block mt-4 text-primary-600 hover:text-primary-800">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-surface py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-card p-8 text-center">
          <p className="text-primary-700">Order not found</p>
          <Link to="/orders" className="inline-block mt-4 text-primary-600 hover:text-primary-800">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (order.status !== 'delivered') {
    return (
      <div className="min-h-screen bg-surface py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-card p-8 text-center">
          <p className="text-primary-700">You can only review delivered orders.</p>
          <Link to="/orders" className="inline-block mt-4 text-primary-600 hover:text-primary-800">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const reviewableItems = order.items?.filter((item: { productId?: string }) => item.productId && !order.reviewSubmitted?.includes(item.productId)) || [];

  if (reviewableItems.length === 0) {
    return (
      <div className="min-h-screen bg-surface py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-card p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary-900 mb-2">All items reviewed!</h2>
          <p className="text-primary-700 mb-6">You have already reviewed all items in this order.</p>
          <Link to="/orders" className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/orders" className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-primary-900">Review Your Order</h1>
          <p className="text-primary-600 mt-2">Order #{order.orderNumber}</p>
        </div>

        <div className="space-y-6">
          {reviewableItems.map((item: { productId?: string; name: string; quantity: number; image?: string }) => {
            const review = reviews[item.productId!] || { rating: 5, title: '', comment: '' };
            return (
              <div key={item.productId} className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-start gap-4 mb-4">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  )}
                  <div>
                    <h3 className="font-semibold text-primary-900">{item.name}</h3>
                    <p className="text-sm text-primary-600">Quantity: {item.quantity}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRatingChange(item.productId!, star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= review.rating ? 'text-secondary-400 fill-current' : 'text-primary-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-2">Title (optional)</label>
                    <input
                      type="text"
                      value={review.title}
                      onChange={(e) => handleFieldChange(item.productId!, 'title', e.target.value)}
                      placeholder="Summarize your experience"
                      className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-2">Review *</label>
                    <textarea
                      value={review.comment}
                      onChange={(e) => handleFieldChange(item.productId!, 'comment', e.target.value)}
                      placeholder="Tell us about your experience with this product (minimum 10 characters)"
                      className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      rows={4}
                      minLength={10}
                      maxLength={1000}
                    />
                    <p className="text-xs text-primary-500 mt-1">{review.comment.length}/1000 characters</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Link
            to="/orders"
            className="inline-flex items-center px-6 py-3 bg-primary-100 text-primary-800 font-medium rounded-xl hover:bg-primary-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Reviews'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;
