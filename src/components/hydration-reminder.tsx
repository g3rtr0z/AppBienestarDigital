import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Button, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNotifications } from "../context/notifications-context";
import { motion } from "framer-motion";

export const HydrationReminder: React.FC = () => {
  const [waterIntake, setWaterIntake] = React.useState<number>(0);
  const [nextReminder, setNextReminder] = React.useState<number | null>(null); // null = no iniciado
  const { addNotification } = useNotifications();
  const goalIntake = 8;
  const [mostrarRecordatorio, setMostrarRecordatorio] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (nextReminder === null) return; // si no hay contador activo, no hacer nada

    const REMINDER_INTERVAL = 45 * 60; // 45 minutos

    let hasNotified = false;

    const timer = setInterval(() => {
      setNextReminder((prev) => {
        if (prev === null) return null; // por si cambia a null durante ejecución

        if (prev <= 1) {
          if (!hasNotified) {
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
          return REMINDER_INTERVAL;
        }
        hasNotified = false;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [nextReminder, addNotification]);

  const handleAddWater = () => {
    if (waterIntake < goalIntake) {
      setWaterIntake((prev) => prev + 1);

      // Si no hay contador, iniciar el recordatorio:
      if (nextReminder === null) {
        setNextReminder(45 * 60); // iniciar contador 45 minutos
      }

      addNotification({
        id: Date.now().toString(),
        title: "¡Bien hecho!",
        message: "Has registrado un vaso de agua más.",
        type: "success",
        read: false,
      });
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
                d={`M30,${150 - (waterIntake / goalIntake) * 140} L90,${150 - (waterIntake / goalIntake) * 140} L80,150 C80,155 70,160 60,160 C50,160 40,155 40,150 Z`}
                fill="hsl(var(--heroui-primary-200))"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 0.8 }}
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-2xl font-bold">{waterIntake}/{goalIntake}</p>
              <p className="text-xs text-default-500">vasos</p>
            </div>
          </motion.div>
        </div>

        <div className="w-full">
          <div className="flex justify-between mb-1">
            <span className="text-small">Progreso</span>
            <span className="text-small">{Math.round((waterIntake / goalIntake) * 100)}%</span>
          </div>
          <Progress
            value={(waterIntake / goalIntake) * 100}
            color="primary"
            className="h-2"
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-small text-default-500">Próximo recordatorio en</p>
          <p className="text-xl font-semibold">{Math.floor(nextReminder / 60)}:{(nextReminder % 60).toString().padStart(2, '0')}</p>
        </div>
      </CardBody>
      <CardFooter>
        <Button
          color="primary"
          startContent={<Icon icon="lucide:plus" />}
          fullWidth
          onPress={handleAddWater}
          isDisabled={waterIntake >= goalIntake}
        >
          Registrar vaso
        </Button>
      </CardFooter>
    </Card>
  );
};