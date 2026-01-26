import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de conexión a PostgreSQL
// Se espera una variable de entorno DATABASE_URL o credenciales individuales
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    // En desarrollo local con Docker a veces no necesitamos SSL, pero en prod sí
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const query = (text, params) => pool.query(text, params);
