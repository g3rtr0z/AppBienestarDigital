import React from "react";
import { Tabs, Tab } from "@heroui/react";
import { Dashboard } from "./components/dashboard";
import {Settings} from './components/settings';
import { Header } from "./components/header";
import { NotificationsProvider } from "./context/notifications-context";
import { NotificationToasts } from "./components/NotificationToasts";

export default function App() {
  const [selected, setSelected] = React.useState<string>("dashboard");
  

  return (
    <NotificationsProvider>
      <NotificationToasts />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
          <Tabs 
            aria-label="Opciones" 
            selectedKey={selected} 
            onSelectionChange={(key) => setSelected(key as string)}
            className="mb-8"
            variant="underlined"
            color="primary"
          >
            <Tab key="dashboard" title="Dashboard">
              <Dashboard />
            </Tab>
            <Tab key="settings" title="Configuraciones">
              <Settings />
            </Tab>
          </Tabs>
        </main>
      </div>
    </NotificationsProvider>
  );
}
