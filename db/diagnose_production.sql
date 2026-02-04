-- ========================================
-- DIAGNÓSTICO: Verificar usuarios existentes
-- Ejecuta SOLO esta consulta en DbGate
-- ========================================

SELECT id, email, created_at 
FROM users
ORDER BY created_at DESC;
