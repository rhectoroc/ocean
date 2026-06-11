import express from 'express';
import { query } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';

const router = express.Router();

// Almacenamiento en memoria para sesiones del bot (Limpia después de 1 hora de inactividad)
const chatSessions = new Map();
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hora

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

/**
 * @route POST /api/bot/chat
 * @desc Public endpoint for website chat
 * @access Public
 */
router.post('/chat', async (req, res) => {
    try {
        const { message, chatInput, sessionId } = req.body;
        const userMessage = chatInput || message;

        if (!userMessage) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const sid = sessionId || uuidv4();

        // 1. Get or create session history
        if (!chatSessions.has(sid)) {
            // Check if there is any custom bot config in DB (using first one for public site)
            const dbConfig = await query('SELECT * FROM bot_config LIMIT 1');
            let systemPrompt = '';

            if (dbConfig.rows.length > 0) {
                const config = dbConfig.rows[0];
                systemPrompt = `
# ROL Y LENGUAJE
Eres el "Agente virtual de OceanConstruction". Debes conversar con los clientes como un experto cálido y empático.
IMPORTANTE: Debes responder en el mismo idioma en el que el cliente te hable (Español o Inglés).

# TU PERSONALIDAD Y REGLAS
${config.system_role || 'Usa emojis con moderación. Sé breve y directo. Siempre termina con una pregunta sencilla.'}
${config.tone_personality || ''}

# CONTEXTO DEL NEGOCIO
${config.business_context || 'Tenemos más de 30 años de experiencia.'}

# RESTRICCIONES
${config.constraints || 'Un paso a la vez. No sueltes bloques de texto. Busca agendar una Cita de Factibilidad.'}

# EJEMPLOS Y FAQ
${config.faq_examples || ''}
                `.trim();
            } else {
                // Fallback prompt based on user's n8n configuration
                systemPrompt = `
# ROL Y LENGUAJE
Eres el "Agente virtual de OceanConstruction". Tu trabajo es conversar con los clientes como si fueras un amigo experto: con calidez, brevedad y empatía. Tu meta final es conseguir una "Cita de Factibilidad", pero sin presionar, sino guiando.
IMPORTANTE: Debes responder en el mismo idioma en el que el cliente te hable (Inglés o Español).

# TU PERSONALIDAD
- Cálido y Humano: Saluda con gusto, usa emojis con moderación (🌊, 🏠, 🔨) y habla de tú a tú. Nada de "Estimado cliente".
- Breve y Directo: Tus respuestas deben ser cortas (máximo 2 o 3 oraciones por turno). No sueltes bloques de texto.
- Fluido: Siempre termina tus respuestas con una pregunta sencilla para que el cliente sepa qué decir después.

# DATOS CLAVE
- Filosofía: No solo renovamos, hacemos "reestructuración inteligente".
- Experiencia: Tenemos más de 30 años (fundados por un maestro ebanista, así que amamos los detalles).
- Servicios: Desde remodelaciones completas, cocinas y baños, hasta techos (roofs) y exteriores.
- Precios: Usamos "Precios Justos" (transparencia total, sin sorpresas), pero necesitamos ver el proyecto para cotizar.

# REGLAS DE CONVERSACIÓN
1. Escucha primero.
2. Un paso a la vez. No expliques todos los servicios de golpe.
3. El Gancho: Cuando el cliente muestre interés, propón la visita.
                `.trim();
            }

            chatSessions.set(sid, {
                messages: [
                    { role: 'system', content: systemPrompt }
                ],
                lastActivity: Date.now()
            });
        }

        const session = chatSessions.get(sid);
        session.lastActivity = Date.now();
        session.messages.push({ role: 'user', content: userMessage });

        // Keep only last 10 messages to avoid token bloat (plus the system prompt)
        if (session.messages.length > 11) {
            session.messages = [session.messages[0], ...session.messages.slice(-10)];
        }

        // 2. Call AI API
        const openai = new OpenAI({
            baseURL: process.env.AI_BASE_URL || 'https://api.deepseek.com/v1',
            apiKey: process.env.AI_API_KEY || process.env.DEEPSEEK_API_KEY
        });

        // Use standard gpt-4o-mini as fallback model name if using OpenAI directly, or deepseek-chat
        const aiModel = process.env.AI_MODEL || 'deepseek-chat';

        const completion = await openai.chat.completions.create({
            model: aiModel,
            messages: session.messages,
            temperature: 0.7,
            max_tokens: 250
        });

        const botReply = completion.choices[0].message.content;

        // Save bot reply
        session.messages.push({ role: 'assistant', content: botReply });

        res.json({ response: botReply, sessionId: sid });

    } catch (err) {
        console.error('Error in bot chat route:', err);
        // Handle specific OpenAI/Deepseek auth errors
        if (err.status === 401) {
            return res.status(500).json({ error: 'Falta configurar la clave API del Chatbot en el servidor.' });
        }
        res.status(500).json({ error: 'Hubo un error procesando tu mensaje.' });
    }
});

// Clean up old sessions periodically (every 15 minutes)
setInterval(() => {
    const now = Date.now();
    for (const [sid, session] of chatSessions.entries()) {
        if (now - session.lastActivity > SESSION_TIMEOUT) {
            chatSessions.delete(sid);
        }
    }
}, 15 * 60 * 1000);

export default router;
