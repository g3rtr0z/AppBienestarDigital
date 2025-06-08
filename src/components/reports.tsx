import React from "react";
import { Card, CardBody, CardHeader, Tabs, Tab, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";

const screenTimeData = [
  { day: "Lun", hours: 6.5 },
  { day: "Mar", hours: 7.2 },
  { day: "Mié", hours: 5.8 },
  { day: "Jue", hours: 8.1 },
  { day: "Vie", hours: 6.3 },
  { day: "Sáb", hours: 4.2 },
  { day: "Dom", hours: 3.5 },
];

const breakData = [
  { day: "Lun", count: 5 },
  { day: "Mar", count: 4 },
  { day: "Mié", count: 6 },
  { day: "Jue", count: 3 },
  { day: "Vie", count: 5 },
  { day: "Sáb", count: 2 },
  { day: "Dom", count: 1 },
];

const hydrationData = [
  { day: "Lun", glasses: 7 },
  { day: "Mar", glasses: 8 },
  { day: "Mié", glasses: 6 },
  { day: "Jue", glasses: 5 },
  { day: "Vie", glasses: 8 },
  { day: "Sáb", glasses: 7 },
  { day: "Dom", glasses: 6 },
];

const appUsageData = [
  { name: "Navegador", value: 35 },
  { name: "Documentos", value: 25 },
  { name: "Correo", value: 20 },
  { name: "Mensajería", value: 15 },
  { name: "Otros", value: 5 },
];

const COLORS = ["#006FEE", "#F5A524", "#17C964", "#7828C8", "#F31260"];

export const Reports: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState<string>("week");

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Informes de bienestar</h2>
        <div className="max-w-xs">
          <Select 
            label="Periodo" 
            defaultSelectedKeys={[timeRange]}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-40"
          >
            <SelectItem key="day" value="day">Hoy</SelectItem>
            <SelectItem key="week" value="week">Esta semana</SelectItem>
            <SelectItem key="month" value="month">Este mes</SelectItem>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex gap-3">
            <Icon icon="lucide:monitor" className="text-primary text-xl" />
            <div className="flex flex-col">
              <p className="text-md font-semibold">Tiempo de pantalla</p>
              <p className="text-small text-default-500">Horas por día</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={screenTimeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--heroui-default-200))" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} horas`, 'Tiempo de pantalla']} />
                  <Bar dataKey="hours" fill="hsl(var(--heroui-primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-between text-small">
              <div>
                <p className="font-medium">Promedio diario</p>
                <p className="text-xl font-bold">6.2h</p>
              </div>
              <div>
                <p className="font-medium">Día más productivo</p>
                <p className="text-xl font-bold">Miércoles</p>
              </div>
              <div>
                <p className="font-medium">Tendencia</p>
                <p className="text-xl font-bold text-success">-5%</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex gap-3">
            <Icon icon="lucide:timer" className="text-warning text-xl" />
            <div className="flex flex-col">
              <p className="text-md font-semibold">Pausas activas</p>
              <p className="text-small text-default-500">Cantidad por día</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={breakData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--heroui-default-200))" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} pausas`, 'Pausas activas']} />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="hsl(var(--heroui-warning))" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: "hsl(var(--heroui-warning))" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-between text-small">
              <div>
                <p className="font-medium">Total de pausas</p>
                <p className="text-xl font-bold">26</p>
              </div>
              <div>
                <p className="font-medium">Promedio diario</p>
                <p className="text-xl font-bold">3.7</p>
              </div>
              <div>
                <p className="font-medium">Tendencia</p>
                <p className="text-xl font-bold text-success">+12%</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex gap-3">
            <Icon icon="lucide:droplet" className="text-primary text-xl" />
            <div className="flex flex-col">
              <p className="text-md font-semibold">Hidratación</p>
              <p className="text-small text-default-500">Vasos de agua por día</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={hydrationData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--heroui-default-200))" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} vasos`, 'Hidratación']} />
                  <Bar dataKey="glasses" fill="hsl(var(--heroui-primary-300))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-between text-small">
              <div>
                <p className="font-medium">Total de vasos</p>
                <p className="text-xl font-bold">47</p>
              </div>
              <div>
                <p className="font-medium">Promedio diario</p>
                <p className="text-xl font-bold">6.7</p>
              </div>
              <div>
                <p className="font-medium">Meta alcanzada</p>
                <p className="text-xl font-bold text-warning">84%</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex gap-3">
            <Icon icon="lucide:pie-chart" className="text-secondary text-xl" />
            <div className="flex flex-col">
              <p className="text-md font-semibold">Uso de aplicaciones</p>
              <p className="text-small text-default-500">Distribución del tiempo</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {appUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje de uso']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 justify-center text-small">
              {appUsageData.map((app, index) => (
                <div key={app.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>{app.name}: {app.value}%</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </motion.div>
  );
};