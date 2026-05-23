import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Heart, Settings, CreditCard, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const menuItems = [
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: Package, label: 'Orders', href: '/orders' },
    { icon: Heart, label: 'Saved items', href: '/saved-items' },
    { icon: CreditCard, label: 'Payment methods', href: '/payment-methods' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-900 hover:text-primary-700 transition-colors max-w-[140px] px-2 py-1.5 rounded-full hover:bg-primary-50"
      >
        <User className="w-[1.125rem] h-[1.125rem] shrink-0" strokeWidth={2} />
        <span className="truncate">{user?.name}</span>
        <svg 
          className={`w-3.5 h-3.5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          strokeWidth={2}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full pt-2 z-50">
            <div className="w-48 bg-white rounded-2xl shadow-float py-2 px-1 border border-primary-100/50">
              {menuItems.map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  to={href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
                >
                  <Icon className="w-4 h-4 inline mr-2" />
                  {label}
                </Link>
              ))}
              <hr className="my-2 border-primary-100" />
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-primary-800 rounded-xl hover:bg-surface transition-colors"
              >
                <LogOut className="w-4 h-4 inline mr-2" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;
