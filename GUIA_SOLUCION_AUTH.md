# Guía Paso a Paso: Solucionar Error de Autenticación

## 🎯 Objetivo
Solucionar el error `CredentialsSignin` que ocurre en producción (Easypanel).

## 📋 Pasos a Seguir

### Paso 1: Verificar la Base de Datos con DbGate

1. **Abre DbGate** y conéctate a tu PostgreSQL de producción
2. **Ejecuta el script de diagnóstico**: `db/diagnose_production.sql`
3. **Revisa los resultados**:
   - ¿La tabla `users` existe?
   - ¿Hay usuarios en la tabla?
   - ¿Cuántos usuarios hay?

### Paso 2: Crear Tablas (Si No Existen)

Si la tabla `users` **NO existe**:

1. En DbGate, ejecuta: `db/fix_production.sql`
2. Verifica que las tablas se crearon correctamente
3. Continúa al Paso 3

### Paso 3: Configurar Variables de Entorno en Easypanel

1. **Ve a tu aplicación en Easypanel**
2. **Abre la sección de Variables de Entorno**
3. **Agrega o verifica estas variables**:

```env
DATABASE_URL=postgres://postgres:n46.@U36WJNx@ocean_ocean-postgres:5432/ocean?sslmode=disable
PORT=3001
AUTH_SECRET=at-least-32-character-secret-key-12345
ADMIN_EMAIL=rhectoroc@gmail.com
ADMIN_PASSWORD=FvBBy2W$2476
NODE_ENV=production
FORCE_ADMIN_RESET=true
```

> **IMPORTANTE**: Genera un `AUTH_SECRET` seguro con:
> ```bash
> openssl rand -base64 32
> ```

### Paso 4: Reiniciar el Contenedor

1. En Easypanel, **reinicia el contenedor** de la aplicación
2. **Espera** a que el contenedor se inicie completamente
3. **Revisa los logs** del contenedor

### Paso 5: Verificar los Logs

Busca en los logs del contenedor:

- ✅ `"Admin user created successfully"` - El usuario se creó
- ✅ `"Admin password reset forced via ENV"` - El password se reseteó
- ✅ `"Server running on port 3001"` - El servidor está corriendo
- ❌ Cualquier error de conexión a PostgreSQL

### Paso 6: Probar el Login

1. **Abre la URL de producción** en tu navegador
2. **Ve a la página de login**: `/admin`
3. **Ingresa las credenciales**:
   - Email: `rhectoroc@gmail.com`
   - Password: `FvBBy2W$2476`
4. **Intenta iniciar sesión**

### Paso 7: Diagnóstico Avanzado (Si el problema persiste)

Si el login **aún no funciona**:

1. **Abre una terminal** en el contenedor de Easypanel
2. **Ejecuta el script de diagnóstico**:
   ```bash
   cd /app/server
   node diagnose.js
   ```
3. **Revisa el output** para identificar el problema específico
4. **Comparte los resultados** para análisis adicional

## 🔍 Problemas Comunes

### Error: "La tabla users no existe"
**Solución**: Ejecuta `db/fix_production.sql` en DbGate

### Error: "El usuario admin no existe"
**Solución**: Agrega `FORCE_ADMIN_RESET=true` y reinicia el contenedor

### Error: "La contraseña no coincide"
**Solución**: Verifica que `ADMIN_PASSWORD=FvBBy2W$2476` y agrega `FORCE_ADMIN_RESET=true`

### Error: "Cannot connect to database"
**Solución**: Verifica que `DATABASE_URL` apunte a `ocean_ocean-postgres:5432`

## ✅ Verificación Final

Después de completar todos los pasos:

- [ ] La tabla `users` existe en PostgreSQL
- [ ] El usuario admin existe en la tabla
- [ ] Las variables de entorno están configuradas
- [ ] El contenedor se reinició correctamente
- [ ] Los logs muestran "Admin user created" o "Admin password reset"
- [ ] El login funciona correctamente

## 📞 Siguiente Paso

Una vez que completes el **Paso 1** (verificar con DbGate), comparte los resultados para continuar con los siguientes pasos.
