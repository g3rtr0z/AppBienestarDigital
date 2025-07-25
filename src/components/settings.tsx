import React from "react";
import { Card, CardBody, CardHeader, Input, Switch, Slider, Button, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useSettings } from "../context/settings-context";


export const Settings: React.FC = () => {
  const {
    screenTimeLimit, setScreenTimeLimit,
    waterGoal, setWaterGoal,
    waterReminderInterval, setWaterReminderInterval,
    breakInterval, setBreakInterval,
    breakDuration, setBreakDuration,
    notificationsEnabled, setNotificationsEnabled,
    soundEnabled, setSoundEnabled,
    accessibilityMode, setAccessibilityMode,
    theme, setTheme,
    screenTimeEnabled, setScreenTimeEnabled,
    activeBreaksEnabled, setActiveBreaksEnabled,
    hydrationEnabled, setHydrationEnabled,
    breakGoal, 
    setBreakGoal,
    breakStartDelay,
    setBreakStartDelay
  } = useSettings();

  const handleRestoreDefaults = () => {
    setScreenTimeLimit(8);
    setWaterGoal(8);
    setWaterReminderInterval(45);
    setBreakInterval(25);
    setBreakDuration(5);
    setBreakGoal(6);
    setBreakStartDelay(2);
    setNotificationsEnabled(true);
    setSoundEnabled(true);
    setAccessibilityMode(false);
    setTheme("system");
    setScreenTimeEnabled(true);
    setActiveBreaksEnabled(true);
    setHydrationEnabled(true);

    // Guardar los valores por defecto en localStorage
    const defaultSettings = {
      screenTimeLimit: 8,
      waterGoal: 8,
      waterReminderInterval: 45,
      breakInterval: 25,
      breakDuration: 5,
      breakGoal: 6,
      breakStartDelay: 2,
      notificationsEnabled: true,
      soundEnabled: true,
      accessibilityMode: false,
      theme: "system",
      screenTimeEnabled: true,
      activeBreaksEnabled: true,
      hydrationEnabled: true
    };

    localStorage.setItem("userSettings", JSON.stringify(defaultSettings));
  };

  const handleSaveSettings = () => {
    const settings = {
      screenTimeLimit,
      waterGoal,
      waterReminderInterval,
      breakInterval,
      breakDuration,
      breakGoal,
      breakStartDelay,
      notificationsEnabled,
      soundEnabled,
      accessibilityMode,
      theme
    };

    localStorage.setItem("userSettings", JSON.stringify(settings));
  };

  React.useEffect(() => {
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setScreenTimeLimit(parsed.screenTimeLimit ?? 8);
      setWaterGoal(parsed.waterGoal ?? 8);
      setWaterReminderInterval(parsed.waterReminderInterval ?? 45);
      setBreakInterval(parsed.breakInterval ?? 25);
      setBreakDuration(parsed.breakDuration ?? 5);
      setBreakGoal(parsed.breakGoal ?? 6);
      setBreakStartDelay(parsed.breakStartDelay ?? 2);
      setNotificationsEnabled(parsed.notificationsEnabled ?? true);
      setSoundEnabled(parsed.soundEnabled ?? true);
      setAccessibilityMode(parsed.accessibilityMode ?? false);
      setTheme(parsed.theme ?? "system");
    }
  }, []);

  return (
    <motion.div
      className="space-y-6 pb-4"
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
          
          {screenTimeEnabled && (
            <>
              <div>
                <p className="text-small font-medium mb-2">Límite diario: {screenTimeLimit} horas</p>
                <Slider
                  aria-label="Límite de tiempo de pantalla"
                  step={0.5}
                  minValue={1}
                  maxValue={12}
                  value={screenTimeLimit}
                  onChange={value => setScreenTimeLimit(Array.isArray(value) ? value[0] : value)}
                  className="max-w-md"
                />
              </div>
            </>
          )}
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

          
          {activeBreaksEnabled && (
            <>
              <div>
                <p className="text-small font-medium mb-2">Intervalo de trabajo: {breakInterval} minutos</p>
                <Slider
                  aria-label="Intervalo de trabajo"
                  step={5}
                  minValue={15}
                  maxValue={60}
                  value={breakInterval}
                  onChange={value => setBreakInterval(Array.isArray(value) ? value[0] : value)}
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
                  onChange={value => setBreakDuration(Array.isArray(value) ? value[0] : value)}
                  className="max-w-md"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <p className="text-small font-medium mb-2">Meta de pausas diarias</p>
                  <Select
                    label="Número de pausas"
                    selectedKeys={[breakGoal.toString()]}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      setBreakGoal(parseInt(selectedKey, 10));
                    }}
                  >
                    {[...Array(9).keys()].map(i => {
                      const num = i + 2;
                      return <SelectItem key={num.toString()}>{`${num} pausas`}</SelectItem>
                    })}
                  </Select>
                </div>

                <div className="flex-1">
                  <p className="text-small font-medium mb-2">Habilitar 'Pausa ahora' después de</p>
                  <Select
                    label="Minutos de espera"
                    selectedKeys={[breakStartDelay.toString()]}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      setBreakStartDelay(parseInt(selectedKey, 10));
                    }}
                  >
                    {[...Array(6).keys()].map(i => (
                      <SelectItem key={i.toString()}>
                        {i === 0 ? "Inmediatamente" : `${i} ${i === 1 ? 'minuto' : 'minutos'}`}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

            </>
          )}
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
          
          {hydrationEnabled && (
            <>
              <div>
                <p className="text-small font-medium mb-2">Meta diaria: {waterGoal} vasos</p>
                <Slider
                  aria-label="Meta diaria de agua"
                  step={1}
                  minValue={4}
                  maxValue={12}
                  value={waterGoal}
                  onChange={value => setWaterGoal(Array.isArray(value) ? value[0] : value)}
                  className="max-w-md"
                />
              </div>

              <div className="flex flex-col gap-4">
                <div className="max-w-xs">
                  <p className="text-small font-medium mb-2">Intervalo de recordatorio</p>
                  <Select
                    label="Intervalo"
                    selectedKeys={[waterReminderInterval.toString()]}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      setWaterReminderInterval(parseInt(selectedKey));
                    }}
                  >
                    <SelectItem key="30">Cada 30 minutos</SelectItem>
                    <SelectItem key="45">Cada 45 minutos</SelectItem>
                    <SelectItem key="60">Cada 1 hora</SelectItem>
                    <SelectItem key="90">Cada 1.5 horas</SelectItem>
                  </Select>
                </div>
              </div>
            </>
          )}
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
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-end gap-2 mb-4">
        <Button variant="flat" color="default" onPress={handleRestoreDefaults}>
          Restaurar valores predeterminados
        </Button>
      </div>
    </motion.div>
  );
};