import express from 'express';
import cors from 'cors';
import { query } from './db.js';
import { ExpressAuth, getSession } from "@auth/express";
import { authConfig } from "./auth.config.js";
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const app = express();
const port = process.env.PORT || 3001;

// Metadata for directory resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Trust proxy for secure cookies in production (EasyPanel)
app.set("trust proxy", true);

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- AUTH.JS MIDDLEWARE ---
// This handles /api/auth/* routes automatically (signin, signout, session, etc.)
app.use("/api/auth", ExpressAuth(authConfig));

// --- SEED ADMIN (Ensure at least one user exists) ---
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'rhectoroc@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'FvBBy2W$2476';

async function seedAdmin() {
    try {
        const result = await query('SELECT * FROM users WHERE email = $1', [ADMIN_EMAIL]);
        if (result.rows.length === 0) {
            console.log(`Admin user ${ADMIN_EMAIL} not found. Creating...`);
            const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
            await query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [ADMIN_EMAIL, hash]);
            console.log('Admin user created successfully.');
        } else if (process.env.FORCE_ADMIN_RESET === 'true') {
            const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
            await query('UPDATE users SET password_hash = $2 WHERE email = $1', [ADMIN_EMAIL, hash]);
            console.log('Admin password reset forced via ENV.');
        }
    } catch (err) {
        console.error('Seeding error:', err);
    }
}
seedAdmin();

// --- AUTHENTICATION MIDDLEWARE ---
const authenticatedUser = async (req, res, next) => {
    const session = await getSession(req, authConfig);
    if (session?.user) {
        req.user = session.user;
        return next();
    }
    res.status(401).json({ error: "Unauthorized" });
};

// --- PROTECTED ROUTES (CRUD) ---

// Create Project
app.post('/api/projects', authenticatedUser, async (req, res) => {
    const { title, description, image_url, category } = req.body;
    try {
        const result = await query(
            'INSERT INTO projects (title, description, image_url, category) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, image_url, category]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Create project error:', err);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Delete Project
app.delete('/api/projects/:id', authenticatedUser, async (req, res) => {
    const { id } = req.params;
    try {
        await query('DELETE FROM projects WHERE id = $1', [id]);
        res.json({ message: 'Project deleted' });
    } catch (err) {
        console.error('Delete project error:', err);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// --- PUBLIC ROUTES ---

// GET /api/services
app.get('/api/services', async (req, res) => {
    try {
        const result = await query('SELECT * FROM services ORDER BY display_order ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching services:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/projects
app.get('/api/projects', async (req, res) => {
    try {
        const result = await query('SELECT * FROM projects ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Serve Static Frontend (Production)
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
