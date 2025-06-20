# Configuración de Firebase

## Pasos para configurar Firebase correctamente:

### 1. Habilitar Authentication
1. Ve a la [Consola de Firebase](https://console.firebase.google.com/)
2. Selecciona tu proyecto "viveoffline"
3. En el menú lateral, ve a "Authentication"
4. Haz clic en "Get started"
5. En la pestaña "Sign-in method", habilita "Email/Password"
6. Guarda los cambios

### 2. Habilitar Firestore Database
1. En el menú lateral, ve a "Firestore Database"
2. Haz clic en "Create database"
3. Selecciona "Start in test mode" (para desarrollo)
4. Elige una ubicación cercana a tus usuarios
5. Haz clic en "Done"

### 3. Configurar Reglas de Firestore
1. En Firestore Database, ve a la pestaña "Rules"
2. Reemplaza las reglas existentes con las del archivo `firestore.rules`
3. Haz clic en "Publish"

### 4. Verificar Configuración
1. Asegúrate de que las credenciales en `src/config/firebase.ts` sean correctas
2. Ejecuta la aplicación y usa el botón "Probar conexión Firebase"
3. Revisa la consola del navegador para ver los logs

## Problemas comunes y soluciones:

### Error: "Firebase: Error (auth/email-already-in-use)"
- **Causa**: El email ya está registrado
- **Solución**: Usa un email diferente o inicia sesión con el email existente

### Error: "Firebase: Error (auth/weak-password)"
- **Causa**: La contraseña es muy débil
- **Solución**: Usa una contraseña de al menos 6 caracteres

### Error: "Firebase: Error (auth/invalid-email)"
- **Causa**: El formato del email no es válido
- **Solución**: Verifica que el email tenga un formato correcto

### Error: "Firebase: Error (auth/network-request-failed)"
- **Causa**: Problemas de conexión a internet
- **Solución**: Verifica tu conexión a internet

### Error: "Firebase: Error (permission-denied)"
- **Causa**: Las reglas de Firestore no permiten la operación
- **Solución**: Verifica que las reglas de Firestore estén configuradas correctamente

### Error: "Firebase: Error (auth/operation-not-allowed)"
- **Causa**: El método de autenticación no está habilitado
- **Solución**: Habilita "Email/Password" en Authentication > Sign-in methods

## Verificación de configuración:

1. **Authentication habilitado**: Ve a Authentication > Sign-in methods y verifica que "Email/Password" esté habilitado
2. **Firestore habilitado**: Ve a Firestore Database y verifica que la base de datos esté creada
3. **Reglas configuradas**: Ve a Firestore Database > Rules y verifica que las reglas permitan escritura
4. **Credenciales correctas**: Verifica que las credenciales en `src/config/firebase.ts` coincidan con tu proyecto

## Logs de depuración:

La aplicación ahora incluye logs detallados en la consola del navegador. Para verlos:
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Intenta registrar un usuario
4. Revisa los mensajes de log para identificar el problema específico 