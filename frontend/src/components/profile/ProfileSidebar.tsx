import { User, FileText, Users, Mail, Settings } from 'lucide-react';

type ProfileSection = 'profile' | 'orders' | 'saved-items' | 'payment-methods' | 'settings';

interface ProfileSidebarProps {
  activeSection: ProfileSection;
  onSectionChange: (section: ProfileSection) => void;
}

const ProfileSidebar = ({ activeSection, onSectionChange }: ProfileSidebarProps) => {
  const menuItems = [
    { icon: User, label: 'Profile details', section: 'profile' as ProfileSection },
    { icon: FileText, label: 'Quote requests', section: 'orders' as ProfileSection },
    { icon: Users, label: 'Volunteer apps', section: 'saved-items' as ProfileSection },
    { icon: Mail, label: 'Contact messages', section: 'payment-methods' as ProfileSection },
    { icon: Settings, label: 'Settings', section: 'settings' as ProfileSection },
  ];

  return (
    <nav className="rounded-2xl bg-white border border-primary-100 p-4 shadow-card space-y-1 lg:p-4 lg:space-y-1 md:p-3 md:space-y-1 p-3 space-y-1">
      {menuItems.map(({ icon: Icon, label, section }) => (
        <button
          key={section}
          onClick={() => onSectionChange(section)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-colors lg:flex md:flex sm:flex flex ${
            activeSection === section 
              ? 'bg-primary-100 text-primary-900 shadow-sm' 
              : 'text-primary-800 hover:bg-surface'
          }`}
        >
          <Icon className={`w-4 h-4 ${activeSection === section ? 'text-primary-600' : 'text-primary-500'} flex-shrink-0`} />
          <span className="hidden sm:inline">{label}</span>
          <span className="sm:hidden text-xs">
            {label.split(' ')[0]}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default ProfileSidebar;
