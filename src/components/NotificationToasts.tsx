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

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {notifications
          .filter((n) => visible.includes(n.id))
          .map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`px-4 py-3 rounded-lg shadow-lg text-white ${
                n.type === "success"
                  ? "bg-green-500"
                  : n.type === "info"
                  ? "bg-blue-500"
                  : n.type === "warning"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  icon={
                    n.type === "success"
                      ? "lucide:check-circle"
                      : n.type === "info"
                      ? "lucide:info"
                      : n.type === "warning"
                      ? "lucide:alert-triangle"
                      : "lucide:x-circle"
                  }
                  className="text-lg"
                />
                <div>
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-sm">{n.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
};
