import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Bell, Shield, Palette, Globe, HelpCircle, LogOut, Save, Eye, EyeOff, Mail, Smartphone } from 'lucide-react';

type UserSettings = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
  language: string;
  timezone: string;
  currency: string;
  theme: 'light' | 'dark' | 'system';
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  privacy: {
    profileVisibility: 'public' | 'private';
    showEmail: boolean;
    showPhone: boolean;
  };
};

const Settings = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    marketingEmails: true,
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    language: 'en',
    timezone: 'Africa/Nairobi',
    currency: 'KES',
    theme: 'system',
    twoFactorEnabled: false,
    sessionTimeout: 30,
    privacy: {
      profileVisibility: 'private',
      showEmail: false,
      showPhone: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'privacy' | 'security' | 'preferences'>('notifications');

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Load settings from localStorage (in a real app, this would come from an API)
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem(`settings_${user.id}`);
        if (saved) {
          setSettings(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, [user, isLoaded]);

  const saveSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Save to localStorage (in a real app, this would save to backend)
      localStorage.setItem(`settings_${user.id}`, JSON.stringify(settings));
      // Show success message (in a real app, this would be a toast notification)
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // In a real app, this would call an API to change the password
      await user.updatePassword({ newPassword });
      alert('Password changed successfully');
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updatePrivacySetting = <K extends keyof UserSettings['privacy']>(key: K, value: UserSettings['privacy'][K]) => {
    setSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value }
    }));
  };

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
          <Settings className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary-900 mb-2">Sign in to manage settings</h1>
          <p className="text-primary-700 mb-6">Please sign in to access your account settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8 lg:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 font-display mb-2">Settings</h1>
          <p className="text-primary-700">Manage your account preferences and privacy settings.</p>
        </div>

        {/* Settings Tabs */}
        <div className="bg-white rounded-2xl border border-primary-100 shadow-card mb-8">
          <div className="flex flex-wrap border-b border-primary-100">
            {[
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'privacy', label: 'Privacy', icon: Shield },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'preferences', label: 'Preferences', icon: Palette }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === id
                    ? 'text-primary-900 border-primary-600'
                    : 'text-primary-600 border-transparent hover:text-primary-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-4">Email Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'orderUpdates', label: 'Order updates and shipping notifications', description: 'Get notified about your order status and delivery' },
                      { key: 'marketingEmails', label: 'Marketing emails', description: 'Receive emails about new products and special offers' },
                      { key: 'newsletter', label: 'Newsletter', description: 'Monthly updates and embroidery tips' }
                    ].map(({ key, label, description }) => (
                      <div key={key} className="flex items-start justify-between py-3">
                        <div>
                          <p className="font-medium text-primary-900">{label}</p>
                          <p className="text-sm text-primary-600">{description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings[key as keyof UserSettings] as boolean}
                            onChange={(e) => updateSetting(key as keyof UserSettings, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-4">Push Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'pushNotifications', label: 'Push notifications', description: 'Receive push notifications in your browser' },
                      { key: 'smsNotifications', label: 'SMS notifications', description: 'Get important updates via SMS' }
                    ].map(({ key, label, description }) => (
                      <div key={key} className="flex items-start justify-between py-3">
                        <div>
                          <p className="font-medium text-primary-900">{label}</p>
                          <p className="text-sm text-primary-600">{description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings[key as keyof UserSettings] as boolean}
                            onChange={(e) => updateSetting(key as keyof UserSettings, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-4">Profile Visibility</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-2">Who can see your profile</label>
                      <select
                        value={settings.privacy.profileVisibility}
                        onChange={(e) => updatePrivacySetting('profileVisibility', e.target.value as 'public' | 'private')}
                        className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                      >
                        <option value="private">Only me</option>
                        <option value="public">Everyone</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'showEmail', label: 'Show email address', icon: Mail },
                      { key: 'showPhone', label: 'Show phone number', icon: Smartphone }
                    ].map(({ key, label, icon: Icon }) => (
                      <div key={key} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-primary-500" />
                          <span className="font-medium text-primary-900">{label}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.privacy[key as keyof UserSettings['privacy']] as boolean}
                            onChange={(e) => updatePrivacySetting(key as keyof UserSettings['privacy'], e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-4">Password</h3>
                  {!showPasswordForm ? (
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="px-4 py-2 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
                    >
                      Change Password
                    </button>
                  ) : (
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-primary-700 mb-2">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-3 pr-12 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(!showPasswords)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-500"
                          >
                            {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary-700 mb-2">New Password</label>
                        <input
                          type={showPasswords ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary-700 mb-2">Confirm New Password</label>
                        <input
                          type={showPasswords ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                          required
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
                        >
                          Update Password
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPasswordForm(false)}
                          className="px-4 py-2 bg-surface text-primary-800 font-medium rounded-xl hover:bg-primary-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-primary-900">Enable 2FA</p>
                      <p className="text-sm text-primary-600">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.twoFactorEnabled}
                        onChange={(e) => updateSetting('twoFactorEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-4">Session Management</h3>
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">Session timeout (minutes)</label>
                    <select
                      value={settings.sessionTimeout}
                      onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-4">Appearance</h3>
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">Theme</label>
                    <select
                      value={settings.theme}
                      onChange={(e) => updateSetting('theme', e.target.value as 'light' | 'dark' | 'system')}
                      className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                    >
                      <option value="system">System</option>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-4">Regional Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-2">Language</label>
                      <select
                        value={settings.language}
                        onChange={(e) => updateSetting('language', e.target.value)}
                        className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                      >
                        <option value="en">English</option>
                        <option value="sw">Swahili</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-2">Timezone</label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => updateSetting('timezone', e.target.value)}
                        className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                      >
                        <option value="Africa/Nairobi">Nairobi (EAT)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-2">Currency</label>
                      <select
                        value={settings.currency}
                        onChange={(e) => updateSetting('currency', e.target.value)}
                        className="w-full px-4 py-3 border border-primary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-400/50"
                      >
                        <option value="KES">KES - Kenyan Shilling</option>
                        <option value="USD">USD - US Dollar</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={saveSettings}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center justify-center px-6 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
