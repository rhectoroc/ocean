-- ========================================
-- CREAR USUARIO ADMIN MANUALMENTE
-- Solo ejecuta esto si seedAdmin() no funcionó
-- ========================================

-- IMPORTANTE: Este script crea el usuario con la contraseña: FvBBy2W$2476
-- El hash fue generado con bcrypt (10 rounds)

-- Eliminar usuario admin existente (si existe)
DELETE FROM users WHERE email = 'rhectoroc@gmail.com';

-- Crear nuevo usuario admin
-- Password: FvBBy2W$2476
-- Hash generado con: bcrypt.hash('FvBBy2W$2476', 10)
INSERT INTO users (email, password_hash) 
VALUES (
    'rhectoroc@gmail.com',
    '$2a$10$YourHashWillBeGeneratedByServer'
);

-- NOTA: Este hash es un placeholder. 
-- Es mejor dejar que el servidor lo genere automáticamente con FORCE_ADMIN_RESET=true
-- Este script es solo para referencia.

-- Verificar que se creó
SELECT id, email, created_at FROM users WHERE email = 'rhectoroc@gmail.com';
