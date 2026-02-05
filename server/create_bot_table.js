
import { query } from './db.js';

const createTableQuery = `
CREATE TABLE IF NOT EXISTS bot_config (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    bot_name VARCHAR(255),
    system_role TEXT,
    tone_personality TEXT,
    business_context TEXT,
    constraints TEXT,
    faq_examples TEXT,
    public_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_bot UNIQUE (user_id)
);
`;

async function runMigration() {
    try {
        console.log('Running migration to create bot_config table...');
        await query(createTableQuery);
        console.log('Table bot_config created successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error creating table:', err);
        process.exit(1);
    }
}

runMigration();
