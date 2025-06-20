# Solución para Error: auth/configuration-not-found

## ¿Qué significa este error?

El error `auth/configuration-not-found` indica que Firebase no puede encontrar la configuración del proyecto o que las credenciales son incorrectas.

## Pasos para solucionarlo:

### 1. Verificar que el proyecto existe
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Verifica que el proyecto "viveoffline" existe
3. Si no existe, créalo con ese nombre

### 2. Obtener las credenciales correctas
1. En Firebase Console, selecciona tu proyecto
2. Ve a Configuración del proyecto (ícono de engranaje)
3. En la pestaña "General", desplázate hacia abajo
4. En "Tus apps", haz clic en "Agregar app" si no hay una app web
5. Selecciona "Web" y dale un nombre
6. Copia la configuración que aparece

### 3. Actualizar la configuración
Reemplaza la configuración en `src/config/firebase.ts` con la nueva:

```javascript
const firebaseConfig = {
  apiKey: "tu-nueva-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "tu-messaging-sender-id",
  appId: "tu-app-id"
};
```

### 4. Habilitar Authentication
1. En Firebase Console, ve a "Authentication"
2. Haz clic en "Get started"
3. En "Sign-in method", habilita "Email/Password"
4. Guarda los cambios

### 5. Verificar la configuración
1. Ejecuta la aplicación
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña Console
4. Haz clic en "Probar conexión Firebase"
5. Revisa los logs para ver si hay errores

## Configuración de ejemplo válida:

Si necesitas crear un proyecto nuevo, aquí tienes una configuración de ejemplo:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC-EXAMPLE-KEY-HERE",
  authDomain: "mi-proyecto-bienestar.firebaseapp.com",
  projectId: "mi-proyecto-bienestar",
  storageBucket: "mi-proyecto-bienestar.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Verificación paso a paso:

1. **Proyecto existe**: ✅
2. **App web creada**: ✅
3. **Credenciales copiadas**: ✅
4. **Authentication habilitado**: ✅
5. **Configuración actualizada**: ✅
6. **Aplicación reiniciada**: ✅

## Si el problema persiste:

1. Verifica que no haya espacios extra en las credenciales
2. Asegúrate de que el `projectId` coincida exactamente
3. Verifica que el `authDomain` sea correcto
4. Reinicia el servidor de desarrollo después de cambiar la configuración

## Logs de depuración:

La aplicación ahora muestra logs detallados. Busca estos mensajes en la consola:

- ✅ Firebase app inicializada exitosamente
- ✅ Firebase Auth inicializado exitosamente
- ✅ Firestore inicializado exitosamente

Si ves ❌ en lugar de ✅, hay un problema con la configuración. 