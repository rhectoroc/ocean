import { query } from './db.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'rhectoroc@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'FvBBy2W$2476';

async function diagnose() {
    console.log('=== DIAGNÓSTICO DE AUTENTICACIÓN ===\n');
    console.log(`Fecha: ${new Date().toISOString()}`);
    console.log(`Entorno: ${process.env.NODE_ENV || 'development'}\n`);

    try {
        // 1. Verificar conexión a la base de datos
        console.log('1️⃣ Verificando conexión a PostgreSQL...');
        const connectionTest = await query('SELECT NOW(), version()');
        console.log('✅ Conexión exitosa');
        console.log(`   Timestamp: ${connectionTest.rows[0].now}`);
        console.log(`   PostgreSQL: ${connectionTest.rows[0].version.split(',')[0]}`);
        console.log('');

        // 2. Verificar si la tabla users existe
        console.log('2️⃣ Verificando tabla users...');
        const tableCheck = await query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public'
                AND table_name = 'users'
            );
        `);

        if (!tableCheck.rows[0].exists) {
            console.log('❌ ERROR CRÍTICO: La tabla "users" NO existe.');
            console.log('');
            console.log('📋 SOLUCIÓN:');
            console.log('   1. Abre DbGate y conéctate a PostgreSQL');
            console.log('   2. Ejecuta el archivo: db/fix_production.sql');
            console.log('   3. Reinicia el contenedor en Easypanel');
            console.log('');
            return;
        }
        console.log('✅ La tabla "users" existe.');
        console.log('');

        // 3. Verificar usuarios en la tabla
        console.log('3️⃣ Verificando usuarios existentes...');
        const usersResult = await query('SELECT id, email, created_at FROM users ORDER BY created_at DESC');

        if (usersResult.rows.length === 0) {
            console.log('❌ ERROR: No hay usuarios en la base de datos.');
            console.log('');
            console.log('📋 SOLUCIÓN:');
            console.log('   1. Agrega la variable FORCE_ADMIN_RESET=true en Easypanel');
            console.log('   2. Reinicia el contenedor');
            console.log('   3. El servidor creará automáticamente el usuario admin');
            console.log('');
        } else {
            console.log(`✅ Encontrados ${usersResult.rows.length} usuario(s):`);
            usersResult.rows.forEach(user => {
                console.log(`   - ID: ${user.id}, Email: ${user.email}, Creado: ${user.created_at}`);
            });
        }
        console.log('');

        // 4. Verificar el usuario admin específico
        console.log(`4️⃣ Verificando usuario admin (${ADMIN_EMAIL})...`);
        const adminResult = await query('SELECT * FROM users WHERE email = $1', [ADMIN_EMAIL]);

        if (adminResult.rows.length === 0) {
            console.log('❌ ERROR: El usuario admin NO existe.');
            console.log('');
            console.log('📋 SOLUCIÓN:');
            console.log('   1. Agrega FORCE_ADMIN_RESET=true en las variables de entorno');
            console.log('   2. Reinicia el contenedor');
            console.log('');
        } else {
            const admin = adminResult.rows[0];
            console.log('✅ Usuario admin encontrado.');
            console.log(`   - ID: ${admin.id}`);
            console.log(`   - Email: ${admin.email}`);
            console.log(`   - Hash: ${admin.password_hash.substring(0, 30)}...`);
            console.log(`   - Creado: ${admin.created_at}`);
            console.log('');

            // 5. Probar validación de contraseña
            console.log('5️⃣ Probando validación de contraseña...');
            const isValid = await bcrypt.compare(ADMIN_PASSWORD, admin.password_hash);

            if (isValid) {
                console.log('✅ La contraseña es VÁLIDA.');
                console.log('   El login debería funcionar correctamente.');
            } else {
                console.log('❌ ERROR CRÍTICO: La contraseña NO coincide con el hash.');
                console.log('   Esto es lo que causa el error CredentialsSignin.');
                console.log('');
                console.log('📋 SOLUCIÓN:');
                console.log('   1. Agrega FORCE_ADMIN_RESET=true en Easypanel');
                console.log('   2. Verifica que ADMIN_PASSWORD=FvBBy2W$2476');
                console.log('   3. Reinicia el contenedor');
                console.log('');
            }
        }
        console.log('');

        // 6. Verificar variables de entorno
        console.log('6️⃣ Variables de entorno...');
        console.log(`   - DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Configurada' : '❌ NO configurada'}`);
        console.log(`   - AUTH_SECRET: ${process.env.AUTH_SECRET ? '✅ Configurada' : '⚠️  Usando default (inseguro)'}`);
        console.log(`   - ADMIN_EMAIL: ${ADMIN_EMAIL}`);
        console.log(`   - ADMIN_PASSWORD: ${ADMIN_PASSWORD ? '****** (configurada)' : '❌ NO configurada'}`);
        console.log(`   - NODE_ENV: ${process.env.NODE_ENV || 'no configurada'}`);
        console.log(`   - FORCE_ADMIN_RESET: ${process.env.FORCE_ADMIN_RESET || 'false'}`);
        console.log('');

        console.log('=== FIN DEL DIAGNÓSTICO ===');

    } catch (error) {
        console.error('❌ ERROR FATAL:', error.message);
        console.error('');
        console.error('Detalles técnicos:');
        console.error(error.stack);
    }

    process.exit(0);
}

diagnose();
