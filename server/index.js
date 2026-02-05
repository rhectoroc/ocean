import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { query } from './db.js';
import { ExpressAuth, getSession } from "@auth/express";
import { authConfig } from "./auth.config.js";
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { uploadImage, uploadVideo } from './middleware/upload.js';
import { processImage, deleteImage, deleteVideo } from './utils/imageProcessor.js';
import galleryRoutes from './routes/gallery.js';
import usersRoutes from './routes/users.js';
import botRoutes from './routes/bot.js';

const app = express();
const port = process.env.PORT || 3001;

// Metadata for directory resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Trust proxy for secure cookies in production (EasyPanel)
app.set("trust proxy", true);

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "blob:"],
            "frame-src": ["'self'", "https://www.google.com", "https://www.youtube.com"],
        },
    },
}));

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

// Upload Image
app.post('/api/upload/image', authenticatedUser, uploadImage.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Process image (resize, convert to JPG, generate thumbnail)
        const { processedPath, thumbnailPath } = await processImage(req.file.path);

        res.json({
            url: processedPath,
            thumbnail: thumbnailPath,
            originalName: req.file.originalname
        });
    } catch (err) {
        console.error('Image upload error:', err);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Upload Video
app.post('/api/upload/video', authenticatedUser, uploadVideo.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const videoUrl = `/upload/${req.file.filename}`;
        res.json({
            url: videoUrl,
            originalName: req.file.originalname
        });
    } catch (err) {
        console.error('Video upload error:', err);
        res.status(500).json({ error: 'Failed to upload video' });
    }
});

// Create Project
app.post('/api/projects', authenticatedUser, async (req, res) => {
    const { title, description, images, video_url, category, tags, cover_image_index } = req.body;
    try {
        // For backward compatibility, set image_url to cover image or first image
        const coverIndex = cover_image_index || 0;
        const image_url = images && images.length > 0 ? images[coverIndex]?.url || images[0].url : null;

        const result = await query(
            'INSERT INTO projects (title, description, image_url, images, video_url, category, tags, cover_image_index) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [title, description, image_url, JSON.stringify(images || []), video_url, category, tags || [], cover_image_index || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Create project error:', err);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Update Project
app.put('/api/projects/:id', authenticatedUser, async (req, res) => {
    const { id } = req.params;
    const { title, description, images, video_url, category, tags, cover_image_index } = req.body;
    try {
        const coverIndex = cover_image_index || 0;
        const image_url = images && images.length > 0 ? images[coverIndex]?.url || images[0].url : null;

        const result = await query(
            'UPDATE projects SET title = $1, description = $2, image_url = $3, images = $4, video_url = $5, category = $6, tags = $7, cover_image_index = $8 WHERE id = $9 RETURNING *',
            [title, description, image_url, JSON.stringify(images || []), video_url, category, tags || [], cover_image_index || 0, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update project error:', err);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

// Delete Project
app.delete('/api/projects/:id', authenticatedUser, async (req, res) => {
    const { id } = req.params;
    try {
        // Get project to delete associated files
        const project = await query('SELECT images, video_url FROM projects WHERE id = $1', [id]);
        if (project.rows.length > 0) {
            const { images, video_url } = project.rows[0];

            // Delete images
            if (images && Array.isArray(images)) {
                images.forEach(img => deleteImage(img.url));
            }

            // Delete video
            if (video_url) {
                deleteVideo(video_url);
            }
        }

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

// --- API ROUTES ---
// Gallery routes (protected)
app.use('/api/gallery', authenticatedUser, galleryRoutes);

// Users routes (protected)
app.use('/api/users', authenticatedUser, usersRoutes);

// Bot routes (Mixed: Config is protected, Context is public)
app.use('/api/bot', async (req, res, next) => {
    if (req.path.startsWith('/context/')) {
        return next();
    }
    return authenticatedUser(req, res, next);
}, botRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Serve uploaded files
app.use('/upload', express.static(path.join(process.cwd(), 'upload')));
// Fallback for production volume or legacy paths
app.use('/upload', express.static('/upload'));

// Serve Static Frontend (Production)
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
