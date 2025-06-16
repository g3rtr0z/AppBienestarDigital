import React, { useState } from "react";
import { Card, CardBody, CardHeader, Input, Button, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";

export const PerfilTab: React.FC = () => {
  const [nombre, setNombre] = useState("Uziel C.");
  const [correo, setCorreo] = useState("uziel@correo.com");

  const guardarCambios = () => {
    alert("Cambios guardados correctamente");
    // Aquí puedes hacer una llamada a una API si es necesario
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="flex items-center gap-4">
        <Avatar isBordered radius="full" src="https://i.pravatar.cc/150?img=8" />
        <div>
          <p className="text-lg font-semibold">{nombre}</p>
          <p className="text-sm text-default-500">{correo}</p>
        </div>
      </CardHeader>

      <CardBody className="flex flex-col gap-4">
        <Input
          type="text"
          label="Nombre completo"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <Input
          type="email"
          label="Correo electrónico"
          placeholder="correo@ejemplo.com"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <Button
          color="primary"
          startContent={<Icon icon="lucide:save" />}
          onClick={guardarCambios}
        >
          Guardar cambios
        </Button>
      </CardBody>
    </Card>
  );
};
