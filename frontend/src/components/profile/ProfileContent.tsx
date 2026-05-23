import { useState, useEffect } from 'react';
import { User, Package, Heart, Settings, CreditCard, Edit3, Save, X, FileText, Users, Mail, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

type ProfileSection = 'profile' | 'orders' | 'saved-items' | 'payment-methods' | 'settings';

interface ProfileContentProps {
  activeSection: ProfileSection;
}

const ProfileContent = ({ activeSection }: ProfileContentProps) => {
  const { user: authUser, isLoading: isLoaded } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
  });
  
  // State for tracking user forms
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [volunteerApplications, setVolunteerApplications] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when user loads
  if (isLoaded && authUser && !formData.fullName) {
    setFormData({
      fullName: authUser.name || '',
      email: authUser.email || '',
      phone: '', // Custom auth doesn't provide phone by default
      city: '', // Custom auth doesn't provide city by default
    });
  }

  // Fetch user's form data when component mounts or user changes
  useEffect(() => {
    if (isLoaded && authUser) {
      fetchUserForms();
    }
  }, [isLoaded, authUser]);

  const fetchUserForms = async () => {
    setIsLoading(true);
    try {
      if (!authUser?.id) return;
      
      // Fetch user's quote requests
      const quoteResponse = await api.get('/api/quote-requests');
      setQuoteRequests(quoteResponse.data.filter((req: { userId?: string }) => req.userId === authUser.id));

      // Fetch user's volunteer applications
      const volunteerResponse = await api.get('/api/volunteer');
      setVolunteerApplications(volunteerResponse.data.filter((app: { userId?: string }) => app.userId === authUser.id));

      // Fetch user's contact messages
      const contactResponse = await api.get('/api/contact');
      setContactMessages(contactResponse.data.filter((msg: { userId?: string }) => msg.userId === authUser.id));
    } catch (error) {
      console.error('Error fetching user forms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    // Here you would save the data to your backend
    console.log('Saving profile data:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data
    if (authUser) {
      setFormData({
        fullName: authUser.name || '',
        email: authUser.email || '',
        phone: '',
        city: '',
      });
    }
    setIsEditing(false);
  };

  const renderProfileDetails = () => (
    <div className="space-y-8">
      {/* Profile header */}
      <div className="rounded-2xl bg-white border border-primary-100 p-6 sm:p-8 shadow-card flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <div className="w-24 h-24 rounded-full bg-surface-muted border-2 border-primary-100 flex items-center justify-center shrink-0 overflow-hidden">
          {authUser?.avatar ? (
            <img 
              src={authUser.avatar} 
              alt={authUser.name || 'User'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-10 h-10 text-primary-300" />
          )}
        </div>
        <div className="flex-1 space-y-3 w-full max-w-md">
          <h2 className="text-xl font-bold text-primary-900">
            {authUser?.name || 'User'}
          </h2>
          <p className="text-primary-600">
            {authUser?.email}
          </p>
          <p className="text-sm text-primary-500">
            Member since Recently
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
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-colors"
              />
            ) : (
              <p className="text-primary-900">{formData.fullName || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">Email Address</label>
            <p className="text-primary-900">{formData.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-colors"
              />
            ) : (
              <p className="text-primary-900">{formData.phone || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">City</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-colors"
              />
            ) : (
              <p className="text-primary-900">{formData.city || 'Not set'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="rounded-2xl bg-white border border-primary-100 p-6 sm:p-8 shadow-card">
      <h2 className="font-bold text-primary-900 font-display mb-6">Your Quote Requests</h2>
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-primary-600">Loading your quote requests...</p>
        </div>
      ) : quoteRequests.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-primary-300 mx-auto mb-4" />
          <p className="text-primary-600 mb-2">No quote requests yet</p>
          <p className="text-sm text-primary-500">When you submit quote requests, they'll appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quoteRequests.map((quote: any) => (
            <div key={quote._id} className="border border-primary-200 rounded-xl p-4 hover:border-primary-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-primary-900 mb-2">{quote.description.substring(0, 100)}...</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {quote.brandingTypes?.map((type: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                        {type}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-primary-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(quote.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  {quote.quantity && (
                    <p className="text-sm text-primary-600 mt-2">Quantity: {quote.quantity}</p>
                  )}
                </div>
                <div className="ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    quote.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                    quote.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                    quote.status === 'closed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {quote.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSavedItems = () => (
    <div className="rounded-2xl bg-white border border-primary-100 p-6 sm:p-8 shadow-card">
      <h2 className="font-bold text-primary-900 font-display mb-6">Volunteer Applications</h2>
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-primary-600">Loading your applications...</p>
        </div>
      ) : volunteerApplications.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-primary-300 mx-auto mb-4" />
          <p className="text-primary-600 mb-2">No volunteer applications yet</p>
          <p className="text-sm text-primary-500">When you apply to volunteer, they'll appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {volunteerApplications.map((app: any) => (
            <div key={app._id} className="border border-primary-200 rounded-xl p-4 hover:border-primary-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-primary-900 mb-2">{app.volunteerType}</h3>
                  <p className="text-sm text-primary-600 mb-2">{app.skills}</p>
                  <p className="text-sm text-primary-600 mb-2">Availability: {app.availability}</p>
                  {app.message && (
                    <p className="text-sm text-primary-600 mb-2">{app.message.substring(0, 100)}...</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-primary-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(app.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    app.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    app.status === 'reviewing' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'contacted' ? 'bg-purple-100 text-purple-800' :
                    app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="rounded-2xl bg-white border border-primary-100 p-6 sm:p-8 shadow-card">
      <h2 className="font-bold text-primary-900 font-display mb-6">Contact Messages</h2>
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-primary-600">Loading your messages...</p>
        </div>
      ) : contactMessages.length === 0 ? (
        <div className="text-center py-12">
          <Mail className="w-16 h-16 text-primary-300 mx-auto mb-4" />
          <p className="text-primary-600 mb-2">No contact messages yet</p>
          <p className="text-sm text-primary-500">When you send contact messages, they'll appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contactMessages.map((msg: any) => (
            <div key={msg._id} className="border border-primary-200 rounded-xl p-4 hover:border-primary-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-primary-900 mb-2">{msg.subject}</h3>
                  <p className="text-sm text-primary-600 mb-2">{msg.message.substring(0, 150)}...</p>
                  <div className="flex items-center gap-4 text-sm text-primary-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    msg.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    msg.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                    msg.status === 'responded' ? 'bg-green-100 text-green-800' :
                    msg.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {msg.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="rounded-2xl bg-white border border-primary-100 p-6 sm:p-8 shadow-card">
      <h2 className="font-bold text-primary-900 font-display mb-6">Settings</h2>
      <div className="text-center py-12">
        <Settings className="w-16 h-16 text-primary-300 mx-auto mb-4" />
        <p className="text-primary-600 mb-2">Settings coming soon</p>
        <p className="text-sm text-primary-500">Account settings and preferences will appear here</p>
      </div>
    </div>
  );

  switch (activeSection) {
    case 'profile':
      return renderProfileDetails();
    case 'orders':
      return renderOrders();
    case 'saved-items':
      return renderSavedItems();
    case 'payment-methods':
      return renderPaymentMethods();
    case 'settings':
      return renderSettings();
    default:
      return renderProfileDetails();
  }
};

export default ProfileContent;
