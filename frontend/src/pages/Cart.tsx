import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, X, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.16; // 16% tax
  const shipping = subtotal > 5000 ? 0 : 300; // Free shipping over 5000
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-primary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-900 mb-2 font-sans">Shopping Cart</h1>
          <p className="text-lg text-primary-700">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-medium p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-primary-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary-900 mb-2">Your cart is empty</h3>
            <p className="text-primary-700 mb-6">
              Looks like you haven't added any items to your cart yet
            </p>
            <button
              onClick={() => window.location.href = '/shop'}
              className="btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-medium p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex-shrink-0"></div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-primary-900">{item.name}</h3>
                          <p className="text-sm text-primary-700">
                            Color: {item.color} | Size: {item.size}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-primary-400 hover:text-accent-600 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Price and Quantity */}
                      <div className="flex justify-between items-end">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-bold text-primary-600">
                            KES {item.price.toLocaleString()}
                          </span>
                          <span className="text-primary-600">each</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-primary-700 hover:text-primary-600 border border-primary-200 rounded-lg"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-primary-700 hover:text-primary-600 border border-primary-200 rounded-lg"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Item Total */}
                      <div className="mt-2 text-right">
                        <span className="text-sm text-primary-700">Item total:</span>
                        <p className="text-lg font-bold text-primary-900">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Clear Cart Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleClearCart}
                  className="flex items-center space-x-2 text-accent-600 hover:text-accent-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear Cart</span>
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-medium p-6 sticky top-8">
                <h3 className="text-xl font-bold text-primary-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-primary-700">Subtotal</span>
                    <span className="font-semibold">KES {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-700">Tax (16%)</span>
                    <span className="font-semibold">KES {tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-700">Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? 'FREE' : `KES ${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <div className="text-sm text-primary-600 bg-primary-50 p-2 rounded-lg">
                      Add KES {(5000 - subtotal).toLocaleString()} more for free shipping!
                    </div>
                  )}
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-primary-900">Total</span>
                      <span className="text-2xl font-bold text-primary-600">
                        KES {total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-primary-800 mb-2">
                    Promo Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-primary-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button className="btn-outline px-4 py-2">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    to="/checkout"
                    className="btn-primary w-full py-3 inline-flex items-center justify-center"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                  <button
                    onClick={() => window.location.href = '/shop'}
                    className="btn-outline w-full py-3"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Security Badge */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-primary-600 mb-2">Secure Checkout</p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-12 h-8 bg-primary-200 rounded"></div>
                    <div className="w-12 h-8 bg-primary-200 rounded"></div>
                    <div className="w-12 h-8 bg-primary-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
