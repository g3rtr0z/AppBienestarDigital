import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppState } from "../context/app-state-context";
import { useSettings } from "../context/settings-context";

export const ScreenTimeCard: React.FC = () => {
  // Usa el contexto global para el estado de tiempo de pantalla
  const {
    elapsedScreenTimeSeconds, setElapsedScreenTimeSeconds,
    currentScreenTime, setCurrentScreenTime,
    isScreenTimeTrackingRunning, setIsScreenTimeTrackingRunning,
    screenTimeHistory, setScreenTimeHistory
  } = useAppState();
  const { screenTimeLimit } = useSettings();

  // Estado para rastrear la hora actual
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [secondsInCurrentHour, setSecondsInCurrentHour] = useState(0);

  const remainingTimeSeconds = Math.max(0, (screenTimeLimit * 3600) - elapsedScreenTimeSeconds);
  const remainingHours = Math.floor(remainingTimeSeconds / 3600);
  const remainingMin = Math.floor((remainingTimeSeconds % 3600) / 60);
  const remainingSeconds = remainingTimeSeconds % 60;
  const screenTimeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Función para obtener la hora actual en formato AM/PM
  const getCurrentHourLabel = () => {
    const currentHour = new Date().getHours();
    return currentHour === 0 ? "12AM" : 
           currentHour === 12 ? "12PM" : 
           currentHour > 12 ? `${currentHour - 12}PM` : `${currentHour}AM`;
  };

  // Función para actualizar el historial con datos reales
  const updateScreenTimeHistory = () => {
    const currentHourLabel = getCurrentHourLabel();
    const minutesInCurrentHour = Math.floor(secondsInCurrentHour / 60);
    
    setScreenTimeHistory(prev => {
      const newHistory = [...prev];
      const existingIndex = newHistory.findIndex(item => item.hour === currentHourLabel);
      if (existingIndex >= 0) {
        // Actualizar hora existente
        newHistory[existingIndex] = { ...newHistory[existingIndex], minutes: minutesInCurrentHour };
      }
      return newHistory;
    });
  };

  useEffect(() => {
    if (isScreenTimeTrackingRunning) {
      screenTimeIntervalRef.current = setInterval(() => {
        setElapsedScreenTimeSeconds((prev) => prev + 1);
        setSecondsInCurrentHour((prev) => prev + 1);
      }, 1000);
    } else {
      if (screenTimeIntervalRef.current) clearInterval(screenTimeIntervalRef.current);
    }

    return () => {
      if (screenTimeIntervalRef.current) clearInterval(screenTimeIntervalRef.current);
    };
  }, [isScreenTimeTrackingRunning, setElapsedScreenTimeSeconds]);

  useEffect(() => {
    if (elapsedScreenTimeSeconds % 60 === 0 && elapsedScreenTimeSeconds !== 0) {
      setCurrentScreenTime((prev) => prev + 1);
      // Actualizar historial cada minuto
      updateScreenTimeHistory();
    }
  }, [elapsedScreenTimeSeconds, setCurrentScreenTime]);

  // Actualizar hora actual cada minuto y detectar cambios de hora
  useEffect(() => {
    const updateCurrentHour = () => {
      const now = new Date();
      const newHour = now.getHours();
      
      // Si la hora ha cambiado, actualizar el estado y reiniciar el contador de segundos de la hora
      if (newHour !== currentHour) {
        setCurrentHour(newHour);
        setSecondsInCurrentHour(0);
      }
    };

    // Actualizar cada minuto
    const hourUpdateInterval = setInterval(updateCurrentHour, 60 * 1000);
    
    // Actualizar inmediatamente
    updateCurrentHour();
    
    return () => clearInterval(hourUpdateInterval);
  }, [currentHour]);

  // Actualizar ventana deslizante cuando cambie la hora actual
  useEffect(() => {
    const updateSlidingWindow = () => {
      const windowSize = 10;
      let startHour = currentHour - Math.floor(windowSize / 2);
      let endHour = currentHour + Math.floor(windowSize / 2);
      
      // Ajustar si la ventana se sale del rango del día
      if (startHour < 0) {
        startHour = 0;
        endHour = windowSize - 1;
      } else if (endHour > 23) {
        endHour = 23;
        startHour = 23 - windowSize + 1;
      }
      
      // Asegurar que siempre tengamos exactamente 10 horas
      while (endHour - startHour + 1 < windowSize) {
        if (startHour > 0) {
          startHour--;
        } else if (endHour < 23) {
          endHour++;
        } else {
          break;
        }
      }
      
      // Generar las horas esperadas para la nueva ventana
      const expectedHours = [];
      for (let i = startHour; i <= endHour; i++) {
        const hourLabel = i === 0 ? "12AM" :
                         i === 12 ? "12PM" : 
                         i > 12 ? `${i - 12}PM` : `${i}AM`;
        expectedHours.push(hourLabel);
      }
      
      // Verificar si la ventana ha cambiado
      const currentData = generateChartData();
      const currentHours = currentData.map(item => item.hour);
      
      if (JSON.stringify(currentHours) !== JSON.stringify(expectedHours)) {
        // Crear nuevo historial con la ventana actualizada
        const newHistory = [];
        for (let i = startHour; i <= endHour; i++) {
          const hourLabel = i === 0 ? "12AM" :
                           i === 12 ? "12PM" : 
                           i > 12 ? `${i - 12}PM` : `${i}AM`;
          
          // Buscar datos existentes para esta hora
          const existingItem = screenTimeHistory.find(item => item.hour === hourLabel);
          newHistory.push({ 
            hour: hourLabel, 
            minutes: existingItem ? existingItem.minutes : 0 
          });
        }
        
        setScreenTimeHistory(newHistory);
      }
    };

    // Actualizar ventana cuando cambie la hora actual
    updateSlidingWindow();
  }, [currentHour, screenTimeHistory]);

  const hours = Math.floor(currentScreenTime / 60);
  const minutes = currentScreenTime % 60;

  // Generar datos para el gráfico basados en el historial real
  const generateChartData = () => {
    const data = [];
    
    // Ventana deslizante de 10 horas centrada en la hora actual
    const windowSize = 10;
    let startHour = currentHour - Math.floor(windowSize / 2);
    let endHour = currentHour + Math.floor(windowSize / 2);
    
    // Ajustar si la ventana se sale del rango del día
    if (startHour < 0) {
      startHour = 0;
      endHour = windowSize - 1;
    } else if (endHour > 23) {
      endHour = 23;
      startHour = 23 - windowSize + 1;
    }
    
    // Asegurar que siempre tengamos exactamente 10 horas
    while (endHour - startHour + 1 < windowSize) {
      if (startHour > 0) {
        startHour--;
      } else if (endHour < 23) {
        endHour++;
      } else {
        break; // Si no podemos extender más, mantener lo que tenemos
      }
    }
    
    for (let i = startHour; i <= endHour; i++) {
      const hourLabel = i === 0 ? "12AM" :
                       i === 12 ? "12PM" : 
                       i > 12 ? `${i - 12}PM` : `${i}AM`;
      
      const historyItem = screenTimeHistory.find(item => item.hour === hourLabel);
      let minutes = historyItem ? historyItem.minutes : 0;
      
      // Si es la hora actual, mostrar el tiempo parcial, incluso si está en pausa
      if (i === currentHour) {
        const currentMinutes = Math.floor(secondsInCurrentHour / 60);
        minutes = Math.max(minutes, currentMinutes);
      }
      
      data.push({ hour: hourLabel, minutes });
    }
    
    return data;
  };

  const chartData = generateChartData();

  return (
    <Card className="h-full">
      <CardHeader className="flex gap-3">
        <Icon icon="lucide:monitor" className="text-primary text-xl" />
        <div className="flex flex-col">
          <p className="text-md font-semibold">Tiempo de pantalla</p>
          <p className="text-small text-default-500">Hoy</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col md:flex-row gap-4 items-center mb-4 px-4">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
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
                  strokeDashoffset={
                    58 * 2 * Math.PI * (1 - currentScreenTime / (screenTimeLimit * 60))
                  }
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="58"
                  cx="64"
                  cy="64"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-2xl font-bold">
                  {hours}h {minutes}m
                </p>
                <p className="text-xs text-default-500">de {screenTimeLimit}h límite</p>
              </div>
            </div>
          </div>

          <div className="w-full h-40 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--heroui-primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--heroui-primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--heroui-default-200))"
                />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}m`}
                />
                <RechartsTooltip
                  formatter={(value: number) => [`${value} minutos`, "Tiempo de pantalla"]}
                  labelFormatter={(label) => `${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="minutes"
                  stroke="hsl(var(--heroui-primary))"
                  fillOpacity={1}
                  fill="url(#colorMinutes)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <CardBody>
          <div className="flex justify-between text-small flex-col md:flex-row gap-4 md:gap-0 px-6 pb-2">
            <div>
              <p className="font-medium">Tiempo restante hoy</p>
              <p className="text-xl font-bold mt-1">{remainingHours}h {remainingMin}m {remainingSeconds}s</p>
            </div>
          </div>
        </CardBody>
      </CardBody>
      <CardFooter className="flex gap-2">
        <Button
          color="primary"
          variant={isScreenTimeTrackingRunning ? "flat" : "solid"}
          startContent={<Icon icon={isScreenTimeTrackingRunning ? "lucide:pause" : "lucide:play"} />}
          fullWidth
          onClick={() => setIsScreenTimeTrackingRunning((prev) => !prev)}
        >
          {isScreenTimeTrackingRunning ? "Pausar" : "Iniciar"}
        </Button>
        <Tooltip content="Reiniciar contador">
          <Button
            isIconOnly
            color="danger"
            variant="solid"
            onClick={() => {
              setElapsedScreenTimeSeconds(0);
              setCurrentScreenTime(0);
              setIsScreenTimeTrackingRunning(false);
              // Reiniciar historial con ventana deslizante de 10 horas
              const currentHour = new Date().getHours();
              const resetHistory = [];
              
              // Ventana deslizante de 10 horas
              const windowSize = 10;
              let startHour = currentHour - Math.floor(windowSize / 2);
              let endHour = currentHour + Math.floor(windowSize / 2);
              
              // Ajustar si la ventana se sale del rango del día
              if (startHour < 0) {
                startHour = 0;
                endHour = windowSize - 1;
              } else if (endHour > 23) {
                endHour = 23;
                startHour = 23 - windowSize + 1;
              }
              
              // Asegurar que siempre tengamos exactamente 10 horas
              while (endHour - startHour + 1 < windowSize) {
                if (startHour > 0) {
                  startHour--;
                } else if (endHour < 23) {
                  endHour++;
                } else {
                  break;
                }
              }
              
              for (let i = startHour; i <= endHour; i++) {
                const hourLabel = i === 0 ? "12AM" :
                                 i === 12 ? "12PM" : 
                                 i > 12 ? `${i - 12}PM` : `${i}AM`;
                resetHistory.push({ hour: hourLabel, minutes: 0 });
              }
              setScreenTimeHistory(resetHistory);
              
              // Limpiar localStorage
              localStorage.removeItem('screenTimeHistory');
              localStorage.removeItem('elapsedScreenTimeSeconds');
              localStorage.removeItem('currentScreenTime');
              localStorage.removeItem('isScreenTimeTrackingRunning');
            }}
          >
            <Icon icon="lucide:rotate-ccw" className="text-lg" />
          </Button>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};
