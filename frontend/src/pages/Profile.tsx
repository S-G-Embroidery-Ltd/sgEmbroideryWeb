import { useState } from 'react';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileContent from '../components/profile/ProfileContent';

type ProfileSection = 'profile' | 'orders' | 'saved-items' | 'payment-methods' | 'settings';

const Profile = () => {
  const [activeSection, setActiveSection] = useState<ProfileSection>('profile');

  return (
    <div className="min-h-screen bg-surface py-8 lg:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-primary-600 mb-2">Account template</p>
        <h1 className="text-3xl font-bold text-primary-900 font-display mb-8">My profile</h1>

        <div className="grid lg:grid-cols-[220px_1fr] gap-8 items-start">
          {/* Sidebar navigation */}
          <ProfileSidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />

          {/* Content area */}
          <ProfileContent activeSection={activeSection} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
