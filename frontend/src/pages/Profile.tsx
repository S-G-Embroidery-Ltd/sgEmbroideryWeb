import { User, Package, Heart, Settings, CreditCard } from 'lucide-react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-surface py-8 lg:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-primary-600 mb-2">Account template</p>
        <h1 className="text-3xl font-bold text-primary-900 font-display mb-8">My profile</h1>

        <div className="grid lg:grid-cols-[220px_1fr] gap-8 items-start">
          {/* Sidebar wireframe */}
          <nav className="rounded-2xl bg-white border border-dashed border-primary-200 p-4 shadow-card space-y-1">
            {[
              { icon: User, label: 'Profile details' },
              { icon: Package, label: 'Orders' },
              { icon: Heart, label: 'Saved items' },
              { icon: CreditCard, label: 'Payment methods' },
              { icon: Settings, label: 'Settings' },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-primary-800 hover:bg-surface transition-colors"
              >
                <Icon className="w-4 h-4 text-primary-500" />
                {label}
              </button>
            ))}
          </nav>

          <div className="space-y-8">
            {/* Profile header mock */}
            <div className="rounded-2xl bg-white border border-dashed border-primary-200 p-6 sm:p-8 shadow-card flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="w-24 h-24 rounded-full bg-surface-muted border-2 border-dashed border-primary-200 flex items-center justify-center shrink-0">
                <User className="w-10 h-10 text-primary-300" />
              </div>
              <div className="flex-1 space-y-3 w-full max-w-md">
                <div className="h-4 bg-primary-100 rounded w-48" />
                <div className="h-3 bg-primary-50 rounded w-full" />
                <div className="h-3 bg-primary-50 rounded w-2/3" />
              </div>
            </div>

            {/* Form placeholders */}
            <div className="rounded-2xl bg-white border border-dashed border-primary-200 p-6 sm:p-8 shadow-card">
              <h2 className="font-bold text-primary-900 mb-6 font-display">Contact information</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {['Full name', 'Email', 'Phone', 'City'].map((label) => (
                  <div key={label}>
                    <div className="text-xs font-medium text-primary-600 mb-2">{label}</div>
                    <div className="h-11 rounded-xl bg-surface-muted border border-dashed border-primary-100" />
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-3">
                <div className="h-11 w-28 rounded-xl bg-secondary-200" />
                <div className="h-11 w-24 rounded-xl bg-primary-100" />
              </div>
            </div>

            {/* Order cards mock */}
            <div>
              <h2 className="font-bold text-primary-900 mb-4 font-display">Recent orders</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-white border border-dashed border-primary-200 p-5 shadow-card flex gap-4"
                  >
                    <div className="w-16 h-16 rounded-xl bg-surface-muted shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-primary-100 rounded w-3/4" />
                      <div className="h-3 bg-primary-50 rounded w-1/2" />
                      <div className="h-8 w-20 rounded-lg bg-primary-50 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
