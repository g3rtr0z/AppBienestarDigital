import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Button, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ScreenTimeCard } from "./screen-time-card";
import { useSettings } from "../context/settings-context";
import { HydrationReminder } from "./hydration-reminder";
import { ActiveBreaksCard } from "./active-breaks-card";
import { useNotifications } from "../context/notifications-context";
import { useAppState } from "../context/app-state-context";

import { motion } from "framer-motion";

export const Dashboard: React.FC = () => {
  const { screenTimeLimit, screenTimeEnabled, activeBreaksEnabled, hydrationEnabled, notificationsEnabled, waterGoal, breakGoal } = useSettings();
  const { addNotification } = useNotifications();
  const { 
    currentScreenTime, 
    waterIntake, 
    breaksTaken, 
    isTimerStarted 
  } = useAppState();

  const handleBreakNow = () => {
    if (notificationsEnabled) {
    addNotification({
      id: Date.now().toString(),
      title: "¡Pausa activa iniciada!",
      message: "Tómate 5 minutos para estirar y descansar la vista.",
      type: "success",
      read: false
    });
    }
  };

  // Calcular porcentajes reales
  const getScreenTimeProgress = () => {
    const limitInMinutes = screenTimeLimit * 60;
    const progress = Math.min((currentScreenTime / limitInMinutes) * 100, 100);
    return Math.round(progress);
  };

  const getScreenTimeStatus = () => {
    const progress = getScreenTimeProgress();
    if (progress < 50) return { text: "Óptimo", color: "success" as const };
    if (progress < 80) return { text: "Bueno", color: "primary" as const };
    if (progress < 95) return { text: "Atención", color: "warning" as const };
    return { text: "Crítico", color: "danger" as const };
  };

  const getHydrationProgress = () => {
    const progress = Math.min((waterIntake / waterGoal) * 100, 100); // Usar waterGoal del contexto
    return Math.round(progress);
  };

  const getHydrationStatus = () => {
    const progress = getHydrationProgress();
    if (progress >= 100) return { text: "Completado", color: "success" as const };
    if (progress >= 75) return { text: "Bueno", color: "primary" as const };
    if (progress >= 50) return { text: "Regular", color: "warning" as const };
    return { text: "Bajo", color: "danger" as const };
  };

  const getBreaksProgress = () => {
    // Usar la meta de pausas del contexto
    const progress = Math.min((breaksTaken / breakGoal) * 100, 100);
    return Math.round(progress);
  };

  const getBreaksStatus = () => {
    const progress = getBreaksProgress();
    if (progress >= 100) return { text: "Excelente", color: "success" as const };
    if (progress >= 75) return { text: "Bueno", color: "primary" as const };
    if (progress >= 50) return { text: "Regular", color: "warning" as const };
    return { text: "Bajo", color: "danger" as const };
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {screenTimeEnabled && (
      <motion.div
        className="lg:col-span-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ScreenTimeCard />
      </motion.div>
      )}

      {hydrationEnabled && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <HydrationReminder />
      </motion.div>
      )}

      {activeBreaksEnabled && (
      <motion.div
        className="lg:col-span-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <ActiveBreaksCard onBreakNow={handleBreakNow} />
      </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="h-full">
          <CardHeader className="flex gap-3">
            <Icon icon="lucide:check-circle" className="text-primary text-xl" />
            <div className="flex flex-col">
              <p className="text-md font-semibold">Estado de bienestar</p>
              <p className="text-small text-default-500">Resumen diario</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              {screenTimeEnabled && (
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-small font-medium">Tiempo de pantalla</span>
                    <span className={`text-small text-${getScreenTimeStatus().color}`}>
                      {getScreenTimeStatus().text}
                    </span>
                  </div>
                  <Progress value={getScreenTimeProgress()} color={getScreenTimeStatus().color} className="h-2" />
                  <p className="text-xs text-default-500 mt-1">
                    {Math.floor(currentScreenTime / 60)}h {currentScreenTime % 60}m de {screenTimeLimit}h límite
                  </p>
                </div>
              )}

              {activeBreaksEnabled && (
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-small font-medium">Pausas activas</span>
                    <span className={`text-small text-${getBreaksStatus().color}`}>
                      {getBreaksStatus().text}
                    </span>
                  </div>
                  <Progress value={getBreaksProgress()} color={getBreaksStatus().color} className="h-2" />
                  <p className="text-xs text-default-500 mt-1">
                    {breaksTaken} de {breakGoal} pausas realizadas hoy
                  </p>
                </div>
              )}

              {hydrationEnabled && (
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-small font-medium">Hidratación</span>
                    <span className={`text-small text-${getHydrationStatus().color}`}>
                      {getHydrationStatus().text}
                    </span>
                  </div>
                  <Progress value={getHydrationProgress()} color={getHydrationStatus().color} className="h-2" />
                  <p className="text-xs text-default-500 mt-1">
                    {waterIntake} de {waterGoal} vasos consumidos
                  </p>
                </div>
              )}

              {!screenTimeEnabled && !activeBreaksEnabled && !hydrationEnabled && (
                <div className="text-center py-8">
                  <Icon icon="lucide:settings" className="text-default-400 text-4xl mx-auto mb-4" />
                  <p className="text-default-500">Activa las funcionalidades en Configuración para ver tu estado de bienestar</p>
              </div>
              )}
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
};