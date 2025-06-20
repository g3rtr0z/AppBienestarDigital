import React from "react";
import { Card, CardHeader, CardBody, Slider } from "@heroui/react";
import { useSettings } from "../context/settings-context";
import { Icon } from "@iconify/react";

export const SettingsQuickSection: React.FC = () => {
  const { screenTimeLimit, setScreenTimeLimit, waterGoal, setWaterGoal } = useSettings();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex gap-3">
          <Icon icon="lucide:monitor" className="text-primary text-xl" />
          <div>
            <p className="text-md font-semibold">Límite de tiempo en pantalla</p>
            <p className="text-small text-default-500">Define tus horas máximas diarias</p>
          </div>
        </CardHeader>
        <CardBody>
          <p className="mb-2 text-small font-medium">Horas por día: {screenTimeLimit}h</p>
          <Slider
            aria-label="Límite diario de pantalla"
            minValue={1}
            maxValue={12}
            step={1}
            value={screenTimeLimit}
            onChange={value => setScreenTimeLimit(Array.isArray(value) ? value[0] : value)}
            className="max-w-md"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex gap-3">
          <Icon icon="lucide:droplet" className="text-blue-500 text-xl" />
          <div>
            <p className="text-md font-semibold">Meta diaria de agua</p>
            <p className="text-small text-default-500">¿Cuántos vasos quieres tomar al día?</p>
          </div>
        </CardHeader>
        <CardBody>
          <p className="mb-2 text-small font-medium">Vasos al día: {waterGoal}</p>
          <Slider
            aria-label="Meta diaria de agua"
            minValue={4}
            maxValue={12}
            step={1}
            value={waterGoal}
            onChange={value => setWaterGoal(Array.isArray(value) ? value[0] : value)}
            className="max-w-md"
          />
        </CardBody>
      </Card>
    </div>
  );
};
