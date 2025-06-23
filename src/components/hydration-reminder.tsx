import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Button, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNotifications } from "../context/notifications-context";
import { useAppState } from "../context/app-state-context";
import { useSettings } from "../context/settings-context";
import { motion } from "framer-motion";

export const HydrationReminder: React.FC = () => {
  const { waterIntake, setWaterIntake, nextReminder, setNextReminder, mostrarRecordatorio, setMostrarRecordatorio, elapsedHydrationSeconds, setElapsedHydrationSeconds } = useAppState();
  const { addNotification } = useNotifications();
  const { waterGoal, waterReminderInterval, notificationsEnabled } = useSettings();

  // Calcular el tiempo restante basado en el tiempo transcurrido y el intervalo configurado
  const remainingHydrationSeconds = nextReminder !== null ? 
    Math.max(0, (waterReminderInterval * 60) - elapsedHydrationSeconds) : null;

  // Actualizar el recordatorio cuando cambie el intervalo de configuración
  React.useEffect(() => {
    if (nextReminder !== null) {
      // Mantener el tiempo transcurrido y recalcular el tiempo restante
      const newRemainingSeconds = Math.max(0, (waterReminderInterval * 60) - elapsedHydrationSeconds);
      setNextReminder(newRemainingSeconds);
    }
  }, [waterReminderInterval, elapsedHydrationSeconds, setNextReminder]);

  React.useEffect(() => {
    // Detener recordatorios si ya se alcanzó la meta
    if (waterIntake >= waterGoal) {
      setNextReminder(null);
      setElapsedHydrationSeconds(0);
      return;
    }

    if (nextReminder === null) return; // si no hay contador activo, no hacer nada

    let hasNotified = false;

    const timer = setInterval(() => {
      setElapsedHydrationSeconds((prev) => {
        const newElapsed = prev + 1;
        const totalInterval = waterReminderInterval * 60;
        
        if (newElapsed >= totalInterval) {
          if (!hasNotified && notificationsEnabled) {
            setMostrarRecordatorio(true);
            addNotification({
              id: Date.now().toString(),
              title: "Recordatorio",
              message: "¡Es hora de tomar un vaso de agua!",
              type: "info",
              read: false,
            });
            hasNotified = true;
            setTimeout(() => setMostrarRecordatorio(false), 10000);
          }
          return 0; // Reiniciar el tiempo transcurrido
        }
        hasNotified = false;
        return newElapsed;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [nextReminder, addNotification, setElapsedHydrationSeconds, setMostrarRecordatorio, notificationsEnabled, waterIntake, waterGoal, waterReminderInterval]);

  const handleAddWater = () => {
    if (waterIntake < waterGoal) {
      setWaterIntake((prev) => prev + 1);

      // Iniciar el recordatorio solo cuando se registra un vaso
      if (nextReminder === null) {
        setNextReminder(waterReminderInterval * 60); // iniciar contador usando configuración
        setElapsedHydrationSeconds(0); // reiniciar tiempo transcurrido
      } else {
        setElapsedHydrationSeconds(0); // reiniciar tiempo transcurrido
      }

      if (notificationsEnabled) {
        addNotification({
          id: Date.now().toString(),
          title: "¡Bien hecho!",
          message: "Has registrado un vaso de agua más.",
          type: "success",
          read: false,
        });
      }
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex gap-3">
        <Icon icon="lucide:droplet" className="text-primary text-xl" />
        <div className="flex flex-col">
          <p className="text-md font-semibold">Hidratación</p>
          <p className="text-small text-default-500">Consumo diario</p>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col items-center justify-center">
        <div className="relative w-full flex justify-center mb-6">
          <motion.div
            className="relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg width="120" height="160" viewBox="0 0 120 160">
              <path
                d="M30,10 L90,10 L80,150 C80,155 70,160 60,160 C50,160 40,155 40,150 Z"
                fill="hsl(var(--heroui-default-100))"
                stroke="hsl(var(--heroui-default-300))"
                strokeWidth="2"
              />
              <motion.path
                d={`M30,${150 - (waterIntake / waterGoal) * 140} L90,${150 - (waterIntake / waterGoal) * 140} L80,150 C80,155 70,160 60,160 C50,160 40,155 40,150 Z`}
                fill="hsl(var(--heroui-primary-200))"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 0.8 }}
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-2xl font-bold">{waterIntake}/{waterGoal}</p>
              <p className="text-xs text-default-500">vasos</p>
            </div>
          </motion.div>
        </div>

        <div className="w-full">
          <div className="flex justify-between mb-1">
            <span className="text-small">Progreso</span>
            <span className="text-small">{Math.round((waterIntake / waterGoal) * 100)}%</span>
          </div>
          <Progress
            value={(waterIntake / waterGoal) * 100}
            color="primary"
            className="h-2"
          />
        </div>

        <div className="mt-6 text-center">
          {waterIntake >= waterGoal ? (
            <p className="text-xl font-semibold text-success">¡Meta completada!</p>
          ) : nextReminder === null ? (
            <p className="text-small text-default-500 max-w-[200px] mx-auto">Presiona "Registrar vaso" para iniciar recordatorios</p>
          ) : (
            <>
              <p className="text-small text-default-500">Próximo recordatorio en</p>
              <p className="text-xl font-semibold">
                {Math.floor(remainingHydrationSeconds! / 60)}:{(remainingHydrationSeconds! % 60).toString().padStart(2, '0')}
              </p>
            </>
          )}
        </div>
      </CardBody>
      <CardFooter>
        <Button
          color="primary"
          startContent={<Icon icon="lucide:plus" />}
          fullWidth
          onPress={handleAddWater}
          isDisabled={waterIntake >= waterGoal}
        >
          Registrar vaso
        </Button>
      </CardFooter>
    </Card>
  );
};