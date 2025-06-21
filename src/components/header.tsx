import React, { useState, useEffect } from "react";
import { Navbar, NavbarBrand, NavbarContent, Button, Tooltip, Badge, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User, Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNotifications } from "../context/notifications-context";
import { useAuth } from "../context/auth-context";
import { AuthContainer } from "./auth/AuthContainer";
import { Settings } from "./settings";
import { Profile } from "./Profile";

export const Header: React.FC = () => {
  const { notifications, markAllAsRead } = useNotifications();
  const { currentUser, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Cerrar modal automáticamente cuando el usuario se autentique
  useEffect(() => {
    if (currentUser && authModalOpen) {
      setAuthModalOpen(false);
    }
  }, [currentUser, authModalOpen]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
  };

  return (
    <>
      <div className="bg-white border-b border-divider">
        <div className="max-w-[1200px] mx-auto">
          <Navbar maxWidth="full" className="border-b-0">
            <NavbarBrand>
              <Icon icon="lucide:activity" className="text-primary text-2xl mr-2" />
              <p className="font-bold text-inherit">Bienestar Digital</p>
            </NavbarBrand>

            <NavbarContent justify="end">
              <Tooltip content="Configuraciones">
                <Button 
                  isIconOnly 
                  variant="light" 
                  aria-label="Configuraciones"
                  onPress={() => setSettingsOpen(true)}
                >
                  <Icon icon="lucide:settings" className="text-xl" />
                </Button>
              </Tooltip>

              {currentUser ? (
                // Usuario autenticado - mostrar perfil
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button 
                      isIconOnly 
                      variant="light" 
                      aria-label="Perfil"
                      className="w-10 h-10 rounded-full bg-primary text-white"
                    >
                      <Icon icon="lucide:activity" className="text-xl" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Perfil">
                    <DropdownItem key="profile" onPress={() => setProfileOpen(true)}>
                      <Icon icon="lucide:user" className="mr-2" />
                      Mi perfil
                    </DropdownItem>
                    <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                      <Icon icon="lucide:log-out" className="mr-2" />
                      Cerrar sesión
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              ) : (
                // Usuario no autenticado - mostrar botón de perfil que abre directamente el modal
                <Button 
                  variant="flat" 
                  color="primary"
                  startContent={<Icon icon="lucide:user" />}
                  onPress={() => setAuthModalOpen(true)}
                >
                  Perfil
                </Button>
              )}
            </NavbarContent>
          </Navbar>
        </div>
      </div>

      {/* Modal de autenticación */}
      <Modal isOpen={authModalOpen} onOpenChange={setAuthModalOpen} size="md" backdrop="blur" placement="center">
        <ModalContent className="max-w-md mx-auto">
          <ModalBody className="py-4 flex justify-center">
            <AuthContainer onAuthSuccess={handleAuthSuccess} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal de perfil */}
      <Modal isOpen={profileOpen} onOpenChange={setProfileOpen} size="md" backdrop="blur" placement="center">
        <ModalContent className="max-w-md mx-auto">
          <ModalBody className="py-4 flex justify-center">
            <Profile />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal de configuración */}
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
    </>
  );
};