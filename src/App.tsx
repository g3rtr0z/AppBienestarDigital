import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/auth-context';
import { AppStateProvider } from './context/app-state-context';
import { SettingsProvider } from './context/settings-context';
import { NotificationsProvider } from './context/notifications-context';
import { Header } from './components/header';
import { Dashboard } from './components/dashboard';
import { NotificationToasts } from './components/NotificationToasts';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-[1200px]">
        <Dashboard />
      </main>
      <NotificationToasts />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppStateProvider>
        <SettingsProvider>
          <NotificationsProvider>
            <AppContent />
          </NotificationsProvider>
        </SettingsProvider>
      </AppStateProvider>
    </AuthProvider>
  );
};

export default App;
