import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

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
  const totalScreenTime = screenTimeData.reduce((acc, curr) => acc + curr.minutes, 0);
  const hours = Math.floor(totalScreenTime / 60);
  const minutes = totalScreenTime % 60;

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
                  strokeDashoffset={58 * 2 * Math.PI * (1 - totalScreenTime / 480)}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="58"
                  cx="64"
                  cy="64"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-2xl font-bold">{hours}h {minutes}m</p>
                <p className="text-xs text-default-500">de 8h límite</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={screenTimeData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--heroui-primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--heroui-primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--heroui-default-200))" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => `${value}m`}
                />
                <RechartsTooltip 
                  formatter={(value: number) => [`${value} minutos`, 'Tiempo de pantalla']}
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
        
        <div className="flex justify-between text-small">
          <div>
            <p className="font-medium">Aplicaciones más usadas</p>
            <div className="flex items-center mt-2 gap-2">
              <Tooltip content="Navegador">
                <div className="p-2 bg-primary-100 rounded-md">
                  <Icon icon="lucide:globe" className="text-primary" />
                </div>
              </Tooltip>
              <Tooltip content="Documentos">
                <div className="p-2 bg-warning-100 rounded-md">
                  <Icon icon="lucide:file-text" className="text-warning" />
                </div>
              </Tooltip>
              <Tooltip content="Correo">
                <div className="p-2 bg-success-100 rounded-md">
                  <Icon icon="lucide:mail" className="text-success" />
                </div>
              </Tooltip>
            </div>
          </div>
          <div>
            <p className="font-medium">Tiempo restante hoy</p>
            <p className="text-xl font-bold mt-1">{8 - hours}h {60 - minutes}m</p>
          </div>
        </div>
      </CardBody>
      <CardFooter>
        <Button 
          color="primary" 
          variant="flat" 
          startContent={<Icon icon="lucide:settings" />}
          fullWidth
        >
          Ajustar límites
        </Button>
      </CardFooter>
    </Card>
  );
};