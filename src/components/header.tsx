import React from "react";
import { Navbar, NavbarBrand, NavbarContent, Button, Tooltip, Badge } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNotifications } from "../context/notifications-context";

export const Header: React.FC = () => {
  const { notifications, markAllAsRead } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Navbar maxWidth="xl" className="border-b border-divider">
      <NavbarBrand>
        <Icon icon="lucide:activity" className="text-primary text-2xl mr-2" />
        <p className="font-bold text-inherit">Bienestar Digital</p>
      </NavbarBrand>

      <NavbarContent justify="end">
        <Tooltip content="Notificaciones">
          <Badge content={unreadCount} isInvisible={unreadCount === 0} color="danger">
            <Button 
              isIconOnly 
              variant="light" 
              aria-label="Notificaciones"
              onPress={markAllAsRead}
            >
              <Icon icon="lucide:bell" className="text-xl" />
            </Button>
          </Badge>
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