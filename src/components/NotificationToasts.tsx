// components/NotificationToasts.tsx
import React, { useEffect, useState } from "react";
import { useNotifications } from "../context/notifications-context";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

export const NotificationToasts: React.FC = () => {
  const { notifications, markAsRead } = useNotifications();
  const [visible, setVisible] = useState<string[]>([]);

  useEffect(() => {
    const unread = notifications.filter((n) => !n.read);
    unread.forEach((n) => {
      if (!visible.includes(n.id)) {
        setVisible((prev) => [...prev, n.id]);
        setTimeout(() => {
          setVisible((prev) => prev.filter((id) => id !== n.id));
          markAsRead(n.id);
        }, 4000);
      }
    });
  }, [notifications]);

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-success",
          border: "border-success-300",
          icon: "lucide:check-circle",
          iconColor: "text-success-600"
        };
      case "info":
        return {
          bg: "bg-info",
          border: "border-info-300",
          icon: "lucide:info",
          iconColor: "text-info-600"
        };
      case "warning":
        return {
          bg: "bg-warning",
          border: "border-warning-300",
          icon: "lucide:alert-triangle",
          iconColor: "text-warning-600"
        };
      case "error":
      case "danger":
        return {
          bg: "bg-danger",
          border: "border-danger-300",
          icon: "lucide:x-circle",
          iconColor: "text-danger-600"
        };
      case "primary":
        return {
          bg: "bg-primary",
          border: "border-primary-300",
          icon: "lucide:heart",
          iconColor: "text-primary-600"
        };
      default:
        return {
          bg: "bg-primary",
          border: "border-primary-300",
          icon: "lucide:bell",
          iconColor: "text-primary-600"
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {notifications
          .filter((n) => visible.includes(n.id))
          .map((n) => {
            const styles = getNotificationStyles(n.type);
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className={`px-4 py-3 rounded-lg shadow-lg border ${styles.bg} ${styles.border} text-white min-w-[300px]`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center ${styles.iconColor}`}>
                    <Icon
                      icon={styles.icon}
                      className="text-sm font-bold w-4 h-4"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm mb-1">{n.title}</p>
                    <p className="text-xs opacity-90">{n.message}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </AnimatePresence>
    </div>
  );
};
