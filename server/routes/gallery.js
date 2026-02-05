import express from 'express';
import { query } from '../db.js';
import { uploadImage } from '../middleware/upload.js';
import { processImage } from '../utils/imageProcessor.js';

const router = express.Router();
const MAX_GALLERY_IMAGES = 10;

// Get all gallery images (ordered)
router.get('/', async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM gallery ORDER BY display_order ASC, created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching gallery images:', error);
        res.status(500).json({ error: 'Failed to fetch gallery images' });
    }
});

// Get active gallery images only (for public site)
router.get('/active', async (req, res) => {
    try {
        const result = await query(
            'SELECT id, image_url, thumbnail_url, title, description, display_order FROM gallery WHERE is_active = true ORDER BY display_order ASC LIMIT $1',
            [MAX_GALLERY_IMAGES]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching active gallery images:', error);
        res.status(500).json({ error: 'Failed to fetch active gallery images' });
    }
});

// Create new gallery image
router.post('/', uploadImage.single('file'), async (req, res) => {
    try {
        const { title, description, display_order = 0 } = req.body;

        // Check if we've reached the limit
        const countResult = await query('SELECT COUNT(*) FROM gallery');
        const currentCount = parseInt(countResult.rows[0].count);

        if (currentCount >= MAX_GALLERY_IMAGES) {
            return res.status(400).json({
                error: `Maximum of ${MAX_GALLERY_IMAGES} gallery images allowed. Please delete an existing image first.`
            });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }

        const { processedPath, thumbnailPath } = await processImage(req.file.path);

        const image_url = processedPath;
        const thumbnail_url = thumbnailPath;

        const result = await query(
            'INSERT INTO gallery (image_url, thumbnail_url, title, description, display_order) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [image_url, thumbnail_url, title, description, display_order]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating gallery image:', error);
        res.status(500).json({ error: 'Failed to create gallery image' });
    }
});

// Update gallery image
router.put('/:id', uploadImage.single('file'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, display_order, is_active } = req.body;

        // Build update query dynamically
        const updates = [];
        const values = [];
        let paramCount = 1;

        // If new image is uploaded, process it
        if (req.file) {
            const { processedPath, thumbnailPath } = await processImage(req.file.path);

            const image_url = processedPath;
            const thumbnail_url = thumbnailPath;

            updates.push(`image_url = $${paramCount++}`);
            values.push(image_url);
            updates.push(`thumbnail_url = $${paramCount++}`);
            values.push(thumbnail_url);
        }

        if (title !== undefined) {
            updates.push(`title = $${paramCount++}`);
            values.push(title);
        }

        if (description !== undefined) {
            updates.push(`description = $${paramCount++}`);
            values.push(description);
        }

        if (display_order !== undefined) {
            updates.push(`display_order = $${paramCount++}`);
            values.push(parseInt(display_order));
        }

        if (is_active !== undefined) {
            updates.push(`is_active = $${paramCount++}`);
            values.push(is_active === 'true' || is_active === true);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const queryText = `UPDATE gallery SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        const result = await query(queryText, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Gallery image not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating gallery image:', error);
        res.status(500).json({ error: 'Failed to update gallery image' });
    }
});

// Batch update display order
router.put('/reorder/batch', async (req, res) => {
    try {
        const { items } = req.body; // Array of { id, display_order }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Items array is required' });
        }

        // Update each item individually (simpler without pool.connect)
        for (const item of items) {
            await query(
                'UPDATE gallery SET display_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                [item.display_order, item.id]
            );
        }

        const result = await query('SELECT * FROM gallery ORDER BY display_order ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error reordering gallery images:', error);
        res.status(500).json({ error: 'Failed to reorder gallery images' });
    }
});

// Delete gallery image
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query('DELETE FROM gallery WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Gallery image not found' });
        }

        res.json({ message: 'Gallery image deleted successfully' });
    } catch (error) {
        console.error('Error deleting gallery image:', error);
        res.status(500).json({ error: 'Failed to delete gallery image' });
    }
});

export default router;
