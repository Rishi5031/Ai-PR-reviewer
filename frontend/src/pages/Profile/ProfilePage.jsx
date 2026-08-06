import React, { useState } from 'react';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { PersonalInformation } from '../../components/profile/PersonalInformation';
import { SecuritySettings } from '../../components/profile/SecuritySettings';
import { ConnectedAccounts } from '../../components/profile/ConnectedAccounts';
import { AccountInformation } from '../../components/profile/AccountInformation';
import { ProfileSkeleton } from '../../components/profile/ProfileSkeleton';
import { useProfile } from '../../hooks/useProfile';
import { cn } from '../../lib/utils';
import { User, Shield, Link2, Info } from 'lucide-react';

const tabs = [
  { id: 'personal', label: 'Personal Information', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'connections', label: 'Connected Accounts', icon: Link2 },
  { id: 'account', label: 'Account Information', icon: Info },
];

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal information and account security.</p>
        </div>
        <ProfileSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile</h1>
        <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">
          Failed to load profile. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and account security.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Card Header */}
        <ProfileHeader profile={profile} />

        {/* Custom Tabs Navigation */}
        <div className="border-b border-border">
          <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2",
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="pt-2">
          {activeTab === 'personal' && <PersonalInformation profile={profile} />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'connections' && <ConnectedAccounts />}
          {activeTab === 'account' && <AccountInformation profile={profile} />}
        </div>
      </div>
    </div>
  );
};
