import React from "react";
import { Tabs, Tab, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Dashboard } from "./components/dashboard";
import {Settings} from './components/settings';
import { Header } from "./components/header";
import { NotificationsProvider } from "./context/notifications-context";
import { NotificationToasts } from "./components/NotificationToasts";

export default function App() {
  const [selected, setSelected] = React.useState<string>("dashboard");
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <NotificationsProvider>
      <NotificationToasts />
      <div className="min-h-screen bg-background flex flex-col">
        <Header onSettingsClick={() => setSettingsOpen(true)} />
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
          </Tabs>
        </main>
        <Modal isOpen={settingsOpen} onOpenChange={setSettingsOpen} size="2xl" backdrop="blur">
          <ModalContent>
            <ModalHeader className="flex justify-between items-center">
              Configuración
            </ModalHeader>
            <ModalBody className="max-h-[80vh] overflow-auto">
              <Settings />
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </NotificationsProvider>
  );
}
