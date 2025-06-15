import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface ActiveBreaksCardProps {
  onBreakNow: () => void;
}

export const ActiveBreaksCard: React.FC<ActiveBreaksCardProps> = ({ onBreakNow }) => {
  const [nextBreak, setNextBreak] = React.useState<number>(25 * 60); // 25 minutes in seconds
  const [breaksTaken, setBreaksTaken] = React.useState<number>(2);
  const [isBreakActive, setIsBreakActive] = React.useState<boolean>(false);
  const [breakTime, setBreakTime] = React.useState<number>(5 * 60); // 5 minutes in seconds

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (isBreakActive) {
        setBreakTime((prev) => {
          if (prev <= 1) {
            setIsBreakActive(false);
            setBreakTime(5 * 60);
            setNextBreak(25 * 60);
            return 5 * 60;
          }
          return prev - 1;
        });
      } else {
        setNextBreak((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreakActive]);

  const handleStartBreak = () => {
    setIsBreakActive(true);
    setBreaksTaken((prev) => prev + 1);
    onBreakNow();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const exercises = [
    { id: 1, name: "Estirar cuello", icon: "lucide:activity", completed: true },
    { id: 2, name: "Ejercicios oculares", icon: "lucide:eye", completed: true },
    { id: 3, name: "Estirar brazos", icon: "lucide:arm-up", completed: false },
    { id: 4, name: "Caminar", icon: "lucide:footprints", completed: false },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="flex gap-3">
        <Icon icon="lucide:timer" className="text-warning text-xl" />
        <div className="flex flex-col">
          <p className="text-md font-semibold">Pausas activas</p>
          <p className="text-small text-default-500">Técnica Pomodoro</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col items-center justify-center">
            {isBreakActive ? (
              <motion.div 
                className="text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-success font-medium mb-2">¡Pausa activa en curso!</p>
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full">
                    <circle
                      className="text-default-200"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className="text-success progress-ring"
                      strokeWidth="8"
                      strokeDasharray={58 * 2 * Math.PI}
                      strokeDashoffset={58 * 2 * Math.PI * (breakTime / (5 * 60))}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-2xl font-bold">{formatTime(breakTime)}</p>
                    <p className="text-xs text-default-500">restantes</p>
                  </div>
                </div>
                <p className="mt-4 text-small text-default-500">
                  Realiza los ejercicios sugeridos
                </p>
              </motion.div>
            ) : (
              <motion.div 
                className="text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-default-500 font-medium mb-2">Próxima pausa en</p>
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full">
                    <circle
                      className="text-default-200"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className="text-warning progress-ring"
                      strokeWidth="8"
                      strokeDasharray={58 * 2 * Math.PI}
                      strokeDashoffset={58 * 2 * Math.PI * (1 - nextBreak / (25 * 60))}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-2xl font-bold">{formatTime(nextBreak)}</p>
                    <p className="text-xs text-default-500">restantes</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-small text-default-500">
                    Pausas realizadas hoy: <span className="font-semibold">{breaksTaken}</span>
                  </p>
                </div>
              </motion.div>
            )}
          </div>
          
        </div>
      </CardBody>
      <CardFooter>
        {isBreakActive ? (
          <Button 
            color="danger" 
            variant="flat" 
            startContent={<Icon icon="lucide:x" />}
            fullWidth
            onPress={() => {
              setIsBreakActive(false);
              setBreakTime(5 * 60);
              setNextBreak(25 * 60);
            }}
          >
            Terminar pausa
          </Button>
        ) : (
          <Button 
            color="success" 
            startContent={<Icon icon="lucide:play" />}
            fullWidth
            onPress={handleStartBreak}
            isDisabled={nextBreak > 0 && nextBreak > 23 * 60}
          >
            Iniciar pausa ahora
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};