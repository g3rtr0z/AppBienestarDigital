import React, { useEffect, useRef } from "react";
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

const screenTimeData = [
  { hour: "8AM", minutes: 25 },
  { hour: "9AM", minutes: 45 },
  { hour: "10AM", minutes: 35 },
  { hour: "11AM", minutes: 50 },
  { hour: "12PM", minutes: 15 },
  { hour: "1PM", minutes: 5 },
  { hour: "2PM", minutes: 40 },
  { hour: "3PM", minutes: 55 },
  { hour: "4PM", minutes: 30 },
  { hour: "5PM", minutes: 20 },
];

export const ScreenTimeCard: React.FC = () => {
  // Usa el contexto global para el estado de tiempo de pantalla
  const {
    elapsedScreenTimeSeconds, setElapsedScreenTimeSeconds,
    currentScreenTime, setCurrentScreenTime,
    isScreenTimeTrackingRunning, setIsScreenTimeTrackingRunning,
    screenTimeHistory, setScreenTimeHistory
  } = useAppState();
  const { screenTimeLimit } = useSettings();

  const remainingTimeSeconds = Math.max(0, (screenTimeLimit * 3600) - elapsedScreenTimeSeconds);
  const remainingHours = Math.floor(remainingTimeSeconds / 3600);
  const remainingMin = Math.floor((remainingTimeSeconds % 3600) / 60);
  const remainingSeconds = remainingTimeSeconds % 60;
  const screenTimeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isScreenTimeTrackingRunning) {
      screenTimeIntervalRef.current = setInterval(() => {
        setElapsedScreenTimeSeconds((prev) => prev + 1);
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
    }
  }, [elapsedScreenTimeSeconds, setCurrentScreenTime]);

  const hours = Math.floor(currentScreenTime / 60);
  const minutes = currentScreenTime % 60;

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
        <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
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
                    58 * 2 * Math.PI * (1 - currentScreenTime / screenTimeLimit)
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
                data={screenTimeData}
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
        <Button
          color="danger"
          variant="flat"
          startContent={<Icon icon="lucide:rotate-ccw" />}
          fullWidth
          onClick={() => {
            setElapsedScreenTimeSeconds(0);
            setCurrentScreenTime(0);
            setIsScreenTimeTrackingRunning(false);
          }}
        >
          Reiniciar
        </Button>

      </CardFooter>

    </Card>
  );
};
