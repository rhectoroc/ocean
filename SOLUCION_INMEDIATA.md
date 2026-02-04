# SOLUCIÓN INMEDIATA: Resetear Password del Admin

## ✅ Diagnóstico Confirmado

El usuario admin **existe** en la base de datos:
- Email: `rhectoroc@gmail.com`
- ID: 1
- Creado: 2026-01-26

**Problema:** El password hash almacenado NO coincide con la contraseña `FvBBy2W$2476`.

## 🛠️ Solución en 3 Pasos

### Paso 1: Configurar Variables de Entorno en Easypanel

1. **Abre Easypanel** y ve a tu aplicación Ocean
2. **Ve a la sección "Environment Variables"**
3. **Agrega o actualiza estas variables:**

```env
DATABASE_URL=postgres://postgres:n46.@U36WJNx@ocean_ocean-postgres:5432/ocean?sslmode=disable
PORT=3001
NODE_ENV=production
ADMIN_EMAIL=rhectoroc@gmail.com
ADMIN_PASSWORD=FvBBy2W$2476
FORCE_ADMIN_RESET=true
AUTH_SECRET=at-least-32-character-secret-key-12345
```

> **IMPORTANTE:** La variable clave es `FORCE_ADMIN_RESET=true`. Esto le dice al servidor que regenere el password hash del admin al iniciar.

### Paso 2: Reiniciar el Contenedor

1. En Easypanel, **reinicia el contenedor** de la aplicación
2. **Espera** a que el contenedor se inicie completamente (30-60 segundos)

### Paso 3: Verificar los Logs

1. **Abre los logs** del contenedor en Easypanel
2. **Busca este mensaje:**
   ```
   Admin password reset forced via ENV.
   ```
3. Si ves ese mensaje, el password se reseteó correctamente

## ✅ Probar el Login

Después de reiniciar el contenedor:

1. Ve a tu URL de producción: `/admin`
2. Ingresa las credenciales:
   - **Email:** `rhectoroc@gmail.com`
   - **Password:** `FvBBy2W$2476`
3. Haz clic en "Sign In"

**El login debería funcionar ahora.**

## 🔒 Seguridad (Opcional pero Recomendado)

Después de verificar que el login funciona:

1. **Genera un AUTH_SECRET seguro:**
   ```bash
   openssl rand -base64 32
   ```
2. **Reemplaza** `at-least-32-character-secret-key-12345` con el valor generado
3. **Opcional:** Cambia `FORCE_ADMIN_RESET=false` (o elimina la variable) para evitar resets accidentales

## 📋 Checklist

- [ ] Variables de entorno configuradas en Easypanel
- [ ] `FORCE_ADMIN_RESET=true` agregada
- [ ] Contenedor reiniciado
- [ ] Logs verificados (mensaje "Admin password reset")
- [ ] Login probado y funcional
- [ ] (Opcional) AUTH_SECRET actualizado con valor seguro
