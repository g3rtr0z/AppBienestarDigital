import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Input, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from '../context/auth-context';
import { ref, get, set } from 'firebase/database';
import { realtimeDb } from '../config/firebase';

interface UserProfile {
  name: string;
  email: string;
  createdAt: string;
}

export const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    if (currentUser) {
      loadUserProfile();
    }
  }, [currentUser]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userRef = ref(realtimeDb, `users/${currentUser?.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setProfile({
          name: userData.name || 'No especificado',
          email: userData.email || currentUser?.email || 'No especificado',
          createdAt: userData.createdAt || 'No especificado'
        });
        setEditedName(userData.name || '');
      } else {
        // Si no existe en Realtime Database, crear con datos básicos
        const basicProfile = {
          name: currentUser?.displayName || 'Usuario',
          email: currentUser?.email || 'No especificado',
          createdAt: new Date().toISOString()
        };
        setProfile(basicProfile);
        setEditedName(basicProfile.name);
        
        // Guardar en Realtime Database
        await set(userRef, basicProfile);
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      setProfile({
        name: currentUser?.displayName || 'Usuario',
        email: currentUser?.email || 'No especificado',
        createdAt: 'No disponible'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    
    try {
      const userRef = ref(realtimeDb, `users/${currentUser.uid}`);
      await set(userRef, {
        ...profile,
        name: editedName,
        email: currentUser.email
      });
      
      setProfile(prev => prev ? { ...prev, name: editedName } : null);
      setEditing(false);
    } catch (error) {
      console.error('Error al guardar perfil:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <Icon icon="lucide:loader-2" className="animate-spin text-2xl mx-auto mb-2" />
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-none border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-center mb-3">
            <Icon icon="lucide:user" className="text-primary text-2xl mr-2" />
            <h1 className="text-xl font-bold">Mi Perfil</h1>
            
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              {editing ? (
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  size="md"
                  variant="bordered"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{profile?.name}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{profile?.email}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Registro
              </label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('es-ES') : 'No disponible'}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {editing ? (
                <>
                  <Button
                    color="primary"
                    className="flex-1"
                    onPress={handleSaveProfile}
                  >
                    Guardar
                  </Button>
                  <Button
                    variant="flat"
                    className="flex-1"
                    onPress={() => {
                      setEditing(false);
                      setEditedName(profile?.name || '');
                    }}
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button
                  variant="flat"
                  color="primary"
                  className="w-full"
                  onPress={() => setEditing(true)}
                  startContent={<Icon icon="lucide:edit" />}
                >
                  Editar Perfil
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}; 