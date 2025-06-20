import React from "react";
import { Navbar, NavbarBrand, NavbarContent, Button, Tooltip, Badge } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNotifications } from "../context/notifications-context";

interface HeaderProps {
  onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  const { notifications, markAllAsRead } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Navbar maxWidth="xl" className="border-b border-divider">
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
            onPress={onSettingsClick}
          >
            <Icon icon="lucide:settings" className="text-xl" />
          </Button>
        </Tooltip>
        <Tooltip content="Perfil">
          <Button isIconOnly variant="light" aria-label="Perfil">
            <Icon icon="lucide:user" className="text-xl" />
          </Button>
        </Tooltip>
      </NavbarContent>
    </Navbar>
  );
};