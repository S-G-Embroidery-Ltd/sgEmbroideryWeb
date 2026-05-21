import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Package, Heart, Settings, CreditCard, Mail, Phone, MapPin, Edit3, Save, X } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const Profile = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
  });

  // Initialize form data when user loads
  if (isLoaded && clerkUser && !formData.fullName) {
    setFormData({
      fullName: clerkUser.fullName || clerkUser.username || '',
      email: clerkUser.primaryEmailAddress?.emailAddress || '',
      phone: clerkUser.phoneNumbers?.[0]?.phoneNumber || '',
      city: '', // Clerk doesn't provide city by default
    });
  }
  return (
    <div className="min-h-screen bg-surface py-8 lg:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-primary-600 mb-2">Account template</p>
        <h1 className="text-3xl font-bold text-primary-900 font-display mb-8">My profile</h1>

        <div className="grid lg:grid-cols-[220px_1fr] gap-8 items-start">
          {/* Sidebar navigation */}
          <nav className="rounded-2xl bg-white border border-primary-100 p-4 shadow-card space-y-1">
            {[
              { icon: User, label: 'Profile details', href: '/profile', active: location.pathname === '/profile' },
              { icon: Package, label: 'Orders', href: '/orders', active: location.pathname === '/orders' },
              { icon: Heart, label: 'Saved items', href: '/saved-items', active: location.pathname === '/saved-items' },
              { icon: CreditCard, label: 'Payment methods', href: '/payment-methods', active: location.pathname === '/payment-methods' },
              { icon: Settings, label: 'Settings', href: '/settings', active: location.pathname === '/settings' },
            ].map(({ icon: Icon, label, href, active }) => (
              <Link
                key={label}
                to={href}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-colors ${
                  active 
                    ? 'bg-primary-100 text-primary-900 shadow-sm' 
                    : 'text-primary-800 hover:bg-surface'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-primary-600' : 'text-primary-500'}`} />
                {label}
              </Link>
            ))}
          </nav>

          <div className="space-y-8">
            {/* Profile header with real user data */}
            <div className="rounded-2xl bg-white border border-primary-100 p-6 sm:p-8 shadow-card flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="w-24 h-24 rounded-full bg-surface-muted border-2 border-primary-100 flex items-center justify-center shrink-0 overflow-hidden">
                {clerkUser?.imageUrl ? (
                  <img 
                    src={clerkUser.imageUrl} 
                    alt={clerkUser.fullName || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-primary-300" />
                )}
              </div>
              <div className="flex-1 space-y-3 w-full max-w-md">
                <h2 className="text-xl font-bold text-primary-900">
                  {clerkUser?.fullName || clerkUser?.username || 'User'}
                </h2>
                <p className="text-primary-600">
                  {clerkUser?.primaryEmailAddress?.emailAddress}
                </p>
                <p className="text-sm text-primary-500">
                  Member since {clerkUser?.createdAt ? new Date(clerkUser.createdAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>

            {/* Contact information form */}
            <div className="rounded-2xl bg-white border border-primary-100 p-6 sm:p-8 shadow-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-primary-900 font-display">Contact information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-secondary-500 hover:bg-secondary-600 rounded-xl transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium text-primary-600 mb-2 block">Full name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-surface-muted border border-primary-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-primary-600 mb-2 block flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-surface-muted border border-primary-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-primary-600 mb-2 block flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-surface-muted border border-primary-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-primary-600 mb-2 block flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl bg-surface-muted border border-primary-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                    placeholder="Enter your city"
                  />
                </div>
              </div>
            </div>

            {/* Recent orders */}
            <div>
              <h2 className="font-bold text-primary-900 mb-4 font-display">Recent orders</h2>
              <div className="text-center py-12 bg-white rounded-2xl border border-primary-100">
                <Package className="w-12 h-12 text-primary-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-primary-900 mb-2">No orders yet</h3>
                <p className="text-primary-600 mb-6">When you place orders, they'll appear here</p>
                <button
                  onClick={() => window.location.href = '/shop'}
                  className="inline-flex items-center px-6 py-3 bg-secondary-500 hover:bg-secondary-600 text-primary-900 font-medium rounded-xl transition-colors"
                >
                  Start shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
