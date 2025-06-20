import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Input, Button, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/auth-context';

interface LoginProps {
  onSwitchToRegister: () => void;
  onAuthSuccess?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSwitchToRegister, onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      if (onAuthSuccess) {
        onAuthSuccess();
      }
    } catch (error: any) {
      console.error('Error completo:', error);
      
      // Manejar errores específicos de Firebase
      if (error.message.includes('user-not-found')) {
        setError('No existe una cuenta con este email.');
      } else if (error.message.includes('wrong-password')) {
        setError('Contraseña incorrecta.');
      } else if (error.message.includes('invalid-email')) {
        setError('El formato del email no es válido.');
      } else if (error.message.includes('network')) {
        setError('Error de conexión. Verifica tu internet e intenta de nuevo.');
      } else {
        setError(`Error al iniciar sesión: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full min-h-[400px]"
    >
      <Card className="w-full shadow-none border-0 h-full">
        <CardHeader className="flex flex-col items-center gap-3 pb-6">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:activity" className="text-primary text-2xl" />
            <h1 className="text-xl font-bold text-foreground">Bienestar Digital</h1>
          </div>
          <p className="text-default-500 text-center text-sm">Inicia sesión en tu cuenta</p>
        </CardHeader>
        
        <CardBody className="space-y-6 px-0 flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Correo electrónico"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
              size="sm"
              startContent={<Icon icon="lucide:mail" className="text-default-400 text-sm" />}
            />
            
            <Input
              type="password"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
              size="sm"
              startContent={<Icon icon="lucide:lock" className="text-default-400 text-sm" />}
            />

            {error && (
              <div className="text-danger text-xs bg-danger-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              color="primary"
              className="w-full"
              size="sm"
              isLoading={loading}
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>

          <div className="text-center pt-4">
            <p className="text-default-500 text-xs">
              ¿No tienes una cuenta?{' '}
              <Link
                color="primary"
                href="#"
                onPress={() => onSwitchToRegister()}
                className="font-medium text-xs"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}; 