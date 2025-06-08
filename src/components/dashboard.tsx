import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Button, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ScreenTimeCard } from "./screen-time-card";
import { HydrationReminder } from "./hydration-reminder";
import { ActiveBreaksCard } from "./active-breaks-card";
import { useNotifications } from "../context/notifications-context";
import { motion } from "framer-motion";

export const Dashboard: React.FC = () => {
  const { addNotification } = useNotifications();
  
  const handleBreakNow = () => {
    addNotification({
      id: Date.now().toString(),
      title: "¡Pausa activa iniciada!",
      message: "Tómate 5 minutos para estirar y descansar la vista.",
      type: "success",
      read: false
    });
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="lg:col-span-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ScreenTimeCard />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <HydrationReminder />
      </motion.div>

      <motion.div 
        className="lg:col-span-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <ActiveBreaksCard onBreakNow={handleBreakNow} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="h-full">
          <CardHeader className="flex gap-3">
            <Icon icon="lucide:check-circle" className="text-success text-xl" />
            <div className="flex flex-col">
              <p className="text-md font-semibold">Estado de bienestar</p>
              <p className="text-small text-default-500">Resumen diario</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-small font-medium">Tiempo de pantalla</span>
                  <span className="text-small text-success">Óptimo</span>
                </div>
                <Progress value={65} color="success" className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-small font-medium">Pausas activas</span>
                  <span className="text-small text-warning">Regular</span>
                </div>
                <Progress value={45} color="warning" className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-small font-medium">Hidratación</span>
                  <span className="text-small text-primary">Bueno</span>
                </div>
                <Progress value={75} color="primary" className="h-2" />
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button 
              color="primary" 
              variant="flat" 
              startContent={<Icon icon="lucide:refresh-cw" />}
              fullWidth
            >
              Actualizar estado
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};