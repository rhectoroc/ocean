import express from 'express';
import cors from 'cors';
import { query } from './db.js';

const app = express();
const port = process.env.PORT || 3001; // Usamos 3001 para evitar conflictos con Vite (3000/5173)

app.use(cors({
    origin: '*', // Allow all origins for development. In production, restrictive to your domain.
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- AUTHENTICATION ---
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_dev_key_123';

// --- SEED ADMIN (Ensure at least one user exists) ---
async function seedAdmin() {
    try {
        const result = await query('SELECT count(*) FROM users');
        if (parseInt(result.rows[0].count) === 0) {
            console.log('No users found. Creating default admin...');
            const defaultPass = 'FvBBy2W$2476';
            const hash = await bcrypt.hash(defaultPass, 10);
            await query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', ['rhectoroc@gmail.com', hash]);
            console.log('Default admin created: rhectoroc@gmail.com');
        }
    } catch (err) {
        console.error('Seeding error:', err);
    }
}
seedAdmin();

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, user: { id: user.id, email: user.email } });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- PROTECTED ROUTES (CRUD) ---

// Create Project
app.post('/api/projects', authenticateToken, async (req, res) => {
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
app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
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
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve contents of the dist folder (up one level from server)
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
