import React from "react";
import { Card, CardBody, CardHeader, Input, Switch, Slider, Button, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export const Settings: React.FC = () => {
  const [screenTimeLimit, setScreenTimeLimit] = React.useState<number>(8);
  const [waterGoal, setWaterGoal] = React.useState<number>(8);
  const [breakInterval, setBreakInterval] = React.useState<number>(25);
  const [breakDuration, setBreakDuration] = React.useState<number>(5);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = React.useState<boolean>(true);
  const [accessibilityMode, setAccessibilityMode] = React.useState<boolean>(false);
  const [theme, setTheme] = React.useState<string>("system");

  const handleSaveSettings = () => {
    // Aquí se guardarían los ajustes
    console.log({
      screenTimeLimit,
      waterGoal,
      breakInterval,
      breakDuration,
      notificationsEnabled,
      soundEnabled,
      accessibilityMode,
      theme
    });
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex gap-3">
          <Icon icon="lucide:monitor" className="text-primary text-xl" />
          <div className="flex flex-col">
            <p className="text-md font-semibold">Tiempo de pantalla</p>
            <p className="text-small text-default-500">Configura tus límites diarios</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          <div>
            <p className="text-small font-medium mb-2">Límite diario: {screenTimeLimit} horas</p>
            <Slider 
              aria-label="Límite de tiempo de pantalla" 
              step={0.5}
              minValue={1}
              maxValue={12}
              value={screenTimeLimit}
              onChange={setScreenTimeLimit}
              className="max-w-md"
            />
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Notificaciones de límite</p>
                <p className="text-small text-default-500">Avisar cuando se acerque al límite</p>
              </div>
              <Switch isSelected={true} />
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Bloqueo automático</p>
                <p className="text-small text-default-500">Bloquear apps al alcanzar el límite</p>
              </div>
              <Switch isSelected={false} />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex gap-3">
          <Icon icon="lucide:timer" className="text-warning text-xl" />
          <div className="flex flex-col">
            <p className="text-md font-semibold">Pausas activas</p>
            <p className="text-small text-default-500">Configura tus intervalos de descanso</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          <div>
            <p className="text-small font-medium mb-2">Intervalo de trabajo: {breakInterval} minutos</p>
            <Slider 
              aria-label="Intervalo de trabajo" 
              step={5}
              minValue={15}
              maxValue={60}
              value={breakInterval}
              onChange={setBreakInterval}
              className="max-w-md"
            />
          </div>
          
          <div>
            <p className="text-small font-medium mb-2">Duración de la pausa: {breakDuration} minutos</p>
            <Slider 
              aria-label="Duración de la pausa" 
              step={1}
              minValue={1}
              maxValue={15}
              value={breakDuration}
              onChange={setBreakDuration}
              className="max-w-md"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Pausas forzadas</p>
              <p className="text-small text-default-500">Mostrar pantalla de pausa obligatoria</p>
            </div>
            <Switch isSelected={true} />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex gap-3">
          <Icon icon="lucide:droplet" className="text-primary text-xl" />
          <div className="flex flex-col">
            <p className="text-md font-semibold">Hidratación</p>
            <p className="text-small text-default-500">Configura tus recordatorios de agua</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          <div>
            <p className="text-small font-medium mb-2">Meta diaria: {waterGoal} vasos</p>
            <Slider 
              aria-label="Meta diaria de agua" 
              step={1}
              minValue={4}
              maxValue={12}
              value={waterGoal}
              onChange={setWaterGoal}
              className="max-w-md"
            />
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Recordatorios automáticos</p>
                <p className="text-small text-default-500">Notificar periódicamente</p>
              </div>
              <Switch isSelected={true} />
            </div>
            
            <div className="max-w-xs">
              <p className="text-small font-medium mb-2">Intervalo de recordatorio</p>
              <Select 
                label="Intervalo" 
                defaultSelectedKeys={["45"]}
              >
                <SelectItem key="30" value="30">Cada 30 minutos</SelectItem>
                <SelectItem key="45" value="45">Cada 45 minutos</SelectItem>
                <SelectItem key="60" value="60">Cada 1 hora</SelectItem>
                <SelectItem key="90" value="90">Cada 1.5 horas</SelectItem>
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex gap-3">
          <Icon icon="lucide:settings" className="text-default-500 text-xl" />
          <div className="flex flex-col">
            <p className="text-md font-semibold">Configuración general</p>
            <p className="text-small text-default-500">Ajustes de la aplicación</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Notificaciones</p>
                <p className="text-small text-default-500">Activar notificaciones</p>
              </div>
              <Switch 
                isSelected={notificationsEnabled} 
                onValueChange={setNotificationsEnabled} 
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Sonidos</p>
                <p className="text-small text-default-500">Activar sonidos de alerta</p>
              </div>
              <Switch 
                isSelected={soundEnabled} 
                onValueChange={setSoundEnabled} 
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Modo de accesibilidad</p>
                <p className="text-small text-default-500">Mayor contraste y texto más grande</p>
              </div>
              <Switch 
                isSelected={accessibilityMode} 
                onValueChange={setAccessibilityMode} 
              />
            </div>
            
            <div className="max-w-xs">
              <p className="text-small font-medium mb-2">Tema</p>
              <Select 
                label="Tema" 
                defaultSelectedKeys={[theme]}
                onChange={(e) => setTheme(e.target.value)}
              >
                <SelectItem key="light" value="light">Claro</SelectItem>
                <SelectItem key="dark" value="dark">Oscuro</SelectItem>
                <SelectItem key="system" value="system">Sistema</SelectItem>
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="flat" color="default">
          Restaurar valores predeterminados
        </Button>
        <Button color="primary" onPress={handleSaveSettings}>
          Guardar configuración
        </Button>
      </div>
    </motion.div>
  );
};