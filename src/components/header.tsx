import React, { useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, Button, Tooltip, Badge, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User, Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNotifications } from "../context/notifications-context";
import { useAuth } from "../context/auth-context";
import { AuthContainer } from "./auth/AuthContainer";
import { Settings } from "./settings";

export const Header: React.FC = () => {
  const { notifications, markAllAsRead } = useNotifications();
  const { currentUser, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      <div className="border-b border-divider">
        <div className="max-w-[1200px] mx-auto">
          <Navbar maxWidth="xl" className="border-b-0">
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
                    <User
                      as="button"
                      avatarProps={{
                        isBordered: true,
                        src: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
                      }}
                      className="transition-transform cursor-pointer"
                      description={currentUser.email}
                      name={currentUser.displayName || currentUser.email?.split('@')[0]}
                    />
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Perfil">
                    <DropdownItem key="profile">
                      <Icon icon="lucide:user" className="mr-2" />
                      Mi perfil
                    </DropdownItem>
                    <DropdownItem key="settings" onPress={() => setSettingsOpen(true)}>
                      <Icon icon="lucide:settings" className="mr-2" />
                      Configuración
                    </DropdownItem>
                    <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                      <Icon icon="lucide:log-out" className="mr-2" />
                      Cerrar sesión
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              ) : (
                // Usuario no autenticado - mostrar botón de perfil
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button 
                      variant="flat" 
                      color="primary"
                      startContent={<Icon icon="lucide:user" />}
                    >
                      Perfil
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Opciones de perfil">
                    <DropdownItem key="login" onPress={() => setAuthModalOpen(true)}>
                      <Icon icon="lucide:log-in" className="mr-2" />
                      Iniciar sesión
                    </DropdownItem>
                    <DropdownItem key="register" onPress={() => setAuthModalOpen(true)}>
                      <Icon icon="lucide:user-plus" className="mr-2" />
                      Registrarse
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
            </NavbarContent>
          </Navbar>
        </div>
      </div>

      {/* Modal de autenticación */}
      <Modal isOpen={authModalOpen} onOpenChange={setAuthModalOpen} size="lg" backdrop="blur">
        <ModalContent>
          <ModalHeader className="flex justify-between items-center">
            Iniciar sesión / Registrarse
          </ModalHeader>
          <ModalBody className="max-h-[90vh] overflow-auto py-6">
            <AuthContainer onAuthSuccess={() => setAuthModalOpen(false)} />
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