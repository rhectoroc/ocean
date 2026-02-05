import express from 'express';
import { query } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * @route GET /api/bot/config
 * @desc Get bot config for the current logged-in user
 * @access Protected
 */
router.get('/config', async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await query('SELECT * FROM bot_config WHERE user_id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.json({}); // Return empty object if no config exists yet
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching bot config:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

/**
 * @route PUT /api/bot/config
 * @desc Create or Update bot config
 * @access Protected
 */
router.put('/config', async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            bot_name,
            system_role,
            tone_personality,
            business_context,
            constraints,
            faq_examples
        } = req.body;

        // Check if config exists
        const existing = await query('SELECT * FROM bot_config WHERE user_id = $1', [userId]);

        if (existing.rows.length > 0) {
            // Update
            const updateQuery = `
                UPDATE bot_config 
                SET bot_name = $1, system_role = $2, tone_personality = $3, 
                    business_context = $4, constraints = $5, faq_examples = $6, 
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = $7
                RETURNING *
            `;
            const result = await query(updateQuery, [
                bot_name, system_role, tone_personality, business_context, constraints, faq_examples, userId
            ]);
            return res.json(result.rows[0]);
        } else {
            // Create
            const public_token = uuidv4();
            const insertQuery = `
                INSERT INTO bot_config 
                (user_id, bot_name, system_role, tone_personality, business_context, constraints, faq_examples, public_token)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
            `;
            const result = await query(insertQuery, [
                userId, bot_name, system_role, tone_personality, business_context, constraints, faq_examples, public_token
            ]);
            return res.json(result.rows[0]);
        }
    } catch (err) {
        console.error('Error saving bot config:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

/**
 * @route GET /api/bot/context/:token
 * @desc Public endpoint for n8n/external connection
 * @access Public (Token validated)
 */
router.get('/context/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const result = await query('SELECT * FROM bot_config WHERE public_token = $1', [token]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Invalid Token' });
        }

        const config = result.rows[0];

        // Format for AI consumption
        const contextResponse = {
            botName: config.bot_name,
            systemRole: config.system_role,
            personality: config.tone_personality,
            context: config.business_context,
            criticalConstraints: config.constraints,
            knowledgeBase: config.faq_examples
        };

        res.json(contextResponse);
    } catch (err) {
        console.error('Error fetching bot context:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

export default router;
