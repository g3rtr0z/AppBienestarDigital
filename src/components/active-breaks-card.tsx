import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../context/app-state-context";
import { useSettings } from "../context/settings-context";

interface ActiveBreaksCardProps {
  onBreakNow: () => void;
}

export const ActiveBreaksCard: React.FC<ActiveBreaksCardProps> = ({ onBreakNow }) => {
  const { 
    nextBreak, setNextBreak, 
    breaksTaken, setBreaksTaken, 
    isBreakActive, setIsBreakActive, 
    breakTime, setBreakTime, 
    isTimerStarted, setIsTimerStarted,
    elapsedBreakSeconds, setElapsedBreakSeconds
  } = useAppState();
  const { breakInterval, breakDuration, notificationsEnabled, breakStartDelay } = useSettings();

  // Calcular el tiempo restante basado en el tiempo transcurrido y la configuración
  const remainingBreakSeconds = isBreakActive ? 
    Math.max(0, (breakDuration * 60) - elapsedBreakSeconds) :
    Math.max(0, (breakInterval * 60) - elapsedBreakSeconds);

  // Actualizar los contadores cuando cambien los intervalos de configuración
  React.useEffect(() => {
    if (isTimerStarted) {
      // Mantener el tiempo transcurrido y recalcular el tiempo restante
      if (isBreakActive) {
        // Si está en pausa activa, recalcular el tiempo de pausa restante
        const newRemainingBreakTime = Math.max(0, (breakDuration * 60) - elapsedBreakSeconds);
        setBreakTime(newRemainingBreakTime);
      } else {
        // Si está en tiempo de trabajo, recalcular el próximo break
        const newRemainingWorkTime = Math.max(0, (breakInterval * 60) - elapsedBreakSeconds);
        setNextBreak(newRemainingWorkTime);
      }
    }
  }, [breakInterval, breakDuration, isTimerStarted, isBreakActive, elapsedBreakSeconds, setNextBreak, setBreakTime]);

  React.useEffect(() => {
    if (!isTimerStarted) return;

    const timer = setInterval(() => {
      setElapsedBreakSeconds((prev) => {
        const newElapsed = prev + 1;
        const totalInterval = isBreakActive ? breakDuration * 60 : breakInterval * 60;
        
        if (newElapsed >= totalInterval) {
          if (isBreakActive) {
            // Terminar pausa activa
            setIsBreakActive(false);
            return 0; // Reiniciar tiempo transcurrido
          } else {
            // Terminar tiempo de trabajo, iniciar pausa
            setIsBreakActive(true);
            return 0; // Reiniciar tiempo transcurrido
          }
        }
        return newElapsed;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreakActive, isTimerStarted, setElapsedBreakSeconds, setIsBreakActive, breakDuration, breakInterval]);

  const handleStartBreak = () => {
    setIsBreakActive(true);
    setBreaksTaken((prev) => prev + 1);
    setElapsedBreakSeconds(0);
    if (notificationsEnabled) {
      onBreakNow();
    }
  };

  const recommendations = [
    "Mantén una postura ergonómica",
    "Hidrátate regularmente",
    "Respira profundamente cada 10 minutos",
    "Mantén el área de trabajo organizada",
    "Evita distracciones del teléfono",
    "Estira el cuello y los hombros",
    "Parpadea con frecuencia para lubricar los ojos"
  ];

  const [currentRecommendationIndex, setCurrentRecommendationIndex] = React.useState(0);

  React.useEffect(() => {
    let recommendationTimer: NodeJS.Timeout;

    if (isTimerStarted && !isBreakActive) {
      recommendationTimer = setInterval(() => {
        setCurrentRecommendationIndex(prevIndex => (prevIndex + 1) % recommendations.length);
      }, 30000); // Cambia cada 30 segundos
    }

    return () => {
      clearInterval(recommendationTimer);
    };
  }, [isTimerStarted, isBreakActive, recommendations.length]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex gap-3">
        <Icon icon="lucide:timer" className="text-info text-xl" />
        <div className="flex flex-col">
          <p className="text-md font-semibold">Pausas activas</p>
          <p className="text-small text-default-500">Técnica Pomodoro</p>
        </div>
      </CardHeader>

      <CardBody>
        {!isTimerStarted ? (
          <CardBody className="flex items-center justify-center text-center min-h-[200px]">
          <div className="flex flex-col items-center justify-center">
            <p className="text-default-500 font-medium mb-4">Haz clic para comenzar</p>
            <Button 
              color="primary" 
              startContent={<Icon icon="lucide:play" />} 
              onPress={() => {
                setIsTimerStarted(true);
                setNextBreak(breakInterval * 60);
                setBreakTime(breakDuration * 60);
                setElapsedBreakSeconds(0);
              }}
            >
              Iniciar
            </Button>
          </div>
        </CardBody>
        
        ) : (
          <div className="flex flex-col md:flex-row gap-14 justify-center items-center pl-7">
            <div className="flex flex-col items-center justify-center">
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
                        className="text-primary progress-ring"
                        strokeWidth="8"
                        strokeDasharray={58 * 2 * Math.PI}
                        strokeDashoffset={58 * 2 * Math.PI * (remainingBreakSeconds / (breakDuration * 60))}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="58"
                        cx="64"
                        cy="64"
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <p className="text-2xl font-bold">{formatTime(remainingBreakSeconds)}</p>
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
                        className="text-primary progress-ring"
                        strokeWidth="8"
                        strokeDasharray={58 * 2 * Math.PI}
                        strokeDashoffset={58 * 2 * Math.PI * (1 - remainingBreakSeconds / (breakInterval * 60))}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="58"
                        cx="64"
                        cy="64"
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <p className="text-2xl font-bold">{formatTime(remainingBreakSeconds)}</p>
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

            {/* Sección de recomendaciones para el estudio */}
            {!isBreakActive && isTimerStarted && (
              <div className="w-full md:max-w-xs flex flex-col justify-center">
                <div className="bg-primary-50 rounded-lg p-4 border border-primary-200 h-auto flex flex-col">
                  <div className="text-center mb-3">
                    <Icon icon="lucide:lightbulb" className="text-primary text-xl mx-auto mb-2" />
                    <h3 className="text-sm font-semibold text-primary">Recomendaciones</h3>
                  </div>
                  <div className="flex-grow flex items-center justify-center text-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentRecommendationIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-2 text-xs text-default-600"
                      >
                        <div className="flex items-center gap-2">
                          <Icon icon="lucide:check-circle" className="text-success text-sm mt-0.5 flex-shrink-0" />
                          <span>{recommendations[currentRecommendationIndex]}</span>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardBody>

      <CardFooter>
        {isTimerStarted && (
          isBreakActive ? (
            <Button 
              color="danger" 
              variant="flat" 
              startContent={<Icon icon="lucide:x" />}
              fullWidth
              onPress={() => {
                setIsBreakActive(false);
                setBreakTime(breakDuration * 60);
                setNextBreak(breakInterval * 60);
                setElapsedBreakSeconds(0);
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
              isDisabled={remainingBreakSeconds > (breakInterval - breakStartDelay) * 60}
            >
              Iniciar pausa ahora
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
};
