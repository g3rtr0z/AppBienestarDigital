import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Input, Button, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/auth-context';

interface RegisterProps {
  onSwitchToLogin: () => void;
  onAuthSuccess?: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, onAuthSuccess }) => {
  const { register, testFirestoreConnection, testFirebaseConfiguration } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Función para probar la conexión con Firebase
  const testFirebaseConnection = async () => {
    try {
      console.log('Probando conexión con Firebase...');
      
      // Verificar configuración general
      const configResult = await testFirebaseConfiguration();
      if (!configResult.success) {
        setError(`Error de configuración: ${configResult.error}`);
        return;
      }
      
      // Probar también Firestore
      const firestoreWorks = await testFirestoreConnection();
      if (firestoreWorks) {
        setError('✅ Conexión con Firebase y Firestore exitosa');
      } else {
        setError('⚠️ Firebase Auth funciona pero Firestore tiene problemas');
      }
    } catch (error) {
      console.error('Error al conectar con Firebase:', error);
      setError(`Error de conexión: ${error}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await register(email, password, name);
      if (onAuthSuccess) {
        onAuthSuccess();
      }
    } catch (error: any) {
      console.error('Error completo:', error);
      
      // Manejar errores específicos de Firebase
      if (error.message.includes('email-already-in-use')) {
        setError('Este email ya está registrado. Intenta con otro email o inicia sesión.');
      } else if (error.message.includes('invalid-email')) {
        setError('El formato del email no es válido.');
      } else if (error.message.includes('weak-password')) {
        setError('La contraseña es muy débil. Usa al menos 6 caracteres.');
      } else if (error.message.includes('network')) {
        setError('Error de conexión. Verifica tu internet e intenta de nuevo.');
      } else {
        setError(`Error al crear la cuenta: ${error.message}`);
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
      className="w-full min-h-[500px]"
    >
      <Card className="w-full shadow-none border-0 h-full">
        <CardHeader className="flex flex-col items-center gap-3 pb-6">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:activity" className="text-primary text-2xl" />
            <h1 className="text-xl font-bold text-foreground">Bienestar Digital</h1>
          </div>
          <p className="text-default-500 text-center text-sm">Crea tu cuenta</p>
        </CardHeader>
        
        <CardBody className="space-y-6 px-0 flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Nombre completo"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isRequired
              size="sm"
              startContent={<Icon icon="lucide:user" className="text-default-400 text-sm" />}
            />

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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
              size="sm"
              startContent={<Icon icon="lucide:lock" className="text-default-400 text-sm" />}
            />

            <Input
              type="password"
              label="Confirmar contraseña"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>

            <button
              type="button"
              onClick={testFirebaseConnection}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 mt-2 text-xs"
            >
              Probar conexión Firebase
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-default-500 text-xs">
              ¿Ya tienes una cuenta?{' '}
              <Link
                color="primary"
                href="#"
                onPress={() => onSwitchToLogin()}
                className="font-medium text-xs"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}; 