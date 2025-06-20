import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Input, Button, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from '../../context/auth-context';
import { set } from 'firebase/database';

interface LoginProps {
  onSwitchToRegister: () => void;
  onAuthSuccess?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSwitchToRegister, onAuthSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        setTimeout(() => {
          onAuthSuccess();
        }, 100);
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
        setError(`Error al iniciar sesión, vuelve a intentarlo.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-sm">
        <Card className="shadow-none border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-center mb-3">
              <Icon icon="lucide:user" className="text-primary text-2xl mr-2" />
              <h1 className="text-xl font-bold">Iniciar Sesión</h1>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startContent={<Icon icon="lucide:mail" className="text-gray-400" />}
                size="md"
                variant="bordered"
                isRequired
              />
              <Input
                type="password"
                label="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                startContent={<Icon icon="lucide:lock" className="text-gray-400" />}
                size="md"
                variant="bordered"
                isRequired
              />
              
              {error && (
                <div className="text-red-500 text-xs bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                size="md"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link 
                  href="#" 
                  onPress={onSwitchToRegister}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}; 