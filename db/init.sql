-- TABLA USUARIOS (Admin)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA SERVICIOS (Dynamic Content)
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT, -- URL de la imagen/icono
    display_order INTEGER DEFAULT 0
);

-- TABLA PROYECTOS (Dynamic Content)
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category VARCHAR(50), -- Ej: 'Remodeling', 'Roofs'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
