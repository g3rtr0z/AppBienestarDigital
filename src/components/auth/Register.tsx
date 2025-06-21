import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Input, Button, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Función para validar dominios de correo permitidos
  const validateEmailDomain = (email: string): boolean => {
    const allowedDomains = ['@alumnos.santotomas.cl', '@santotomas.cl'];
    return allowedDomains.some(domain => email.toLowerCase().endsWith(domain));
  };

  // Función para validar email en tiempo real
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    
    if (emailValue && !validateEmailDomain(emailValue)) {
      setEmailError('Solo se permiten correos con dominios @alumnos.santotomas.cl o @santotomas.cl');
    } else {
      setEmailError('');
    }
  };

  // Función para probar la conexión con Firebase
  const testFirebaseConnection = async () => {
    try {
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

    if (name.trim().length < 2) {
      setError('El nombre completo debe tener al menos 2 caracteres');
      return;
    }

    // Validar dominio de correo
    if (!validateEmailDomain(email)) {
      setError('Solo se permiten correos con dominios @alumnos.santotomas.cl o @santotomas.cl');
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
      await register(email, password, name.trim());
      if (onAuthSuccess) {
        setTimeout(() => {
          onAuthSuccess();
        }, 100);
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
    <div className="w-full flex justify-center">
      <div className="w-full max-w-sm">
        <Card className="shadow-none border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-center mb-2">
              <Icon icon="lucide:user-plus" className="text-primary text-xl mr-2" />
              <h1 className="text-lg font-bold">Crear Cuenta</h1>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                label="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                startContent={<Icon icon="lucide:user" className="text-gray-400" />}
                size="md"
                variant="bordered"
                isRequired
                classNames={{
                  input: "w-full",
                  inputWrapper: "w-full input-fixed"
                }}
              />
              <Input
                type="email"
                label="Email"
                value={email}
                onChange={handleEmailChange}
                startContent={<Icon icon="lucide:mail" className="text-gray-400" />}
                size="md"
                variant="bordered"
                isRequired
                isInvalid={!!emailError}
                errorMessage={emailError}
                placeholder="usuario@alumnos.santotomas.cl"
                classNames={{
                  input: "w-full",
                  inputWrapper: "w-full input-fixed"
                }}
              />
              <p className="text-xs text-gray-500 -mt-2">
                Solo se permiten correos institucionales de Santo Tomás (@alumnos.santotomas.cl o @santotomas.cl)
              </p>
              <Input
                type="password"
                label="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                startContent={<Icon icon="lucide:lock" className="text-gray-400" />}
                size="md"
                variant="bordered"
                isRequired
                classNames={{
                  input: "w-full",
                  inputWrapper: "w-full input-fixed"
                }}
              />
              <Input
                type="password"
                label="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                startContent={<Icon icon="lucide:lock" className="text-gray-400" />}
                size="md"
                variant="bordered"
                isRequired
                classNames={{
                  input: "w-full",
                  inputWrapper: "w-full input-fixed"
                }}
              />
              
              {error && (
                <div className="text-red-500 text-xs bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                size="md"
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </Button>

            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link 
                  href="#" 
                  onPress={onSwitchToLogin}
                  className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}; 