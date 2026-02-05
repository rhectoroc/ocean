-- Migration: Add Gallery table and update Users table
-- Description: Creates gallery table and adds missing columns to existing users table

-- Gallery table for Our Work Gallery section (10 images)
CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    title VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for gallery
CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery(is_active);

-- Add missing columns to users table if they don't exist
DO $$ 
BEGIN
    -- Add full_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='full_name') THEN
        ALTER TABLE users ADD COLUMN full_name VARCHAR(255);
        -- Update existing users with a default full name based on email
        UPDATE users SET full_name = split_part(email, '@', 1) WHERE full_name IS NULL;
        ALTER TABLE users ALTER COLUMN full_name SET NOT NULL;
    END IF;

    -- Add role column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='role') THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user'));
        -- Set existing users as admin
        UPDATE users SET role = 'admin' WHERE role IS NULL;
    END IF;

    -- Add is_active column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='is_active') THEN
        ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;

    -- Add last_login column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='last_login') THEN
        ALTER TABLE users ADD COLUMN last_login TIMESTAMP;
    END IF;

    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='updated_at') THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Create indexes for users if they don't exist
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Comments
COMMENT ON TABLE gallery IS 'Stores images for Our Work Gallery section (max 10 images)';
COMMENT ON COLUMN users.role IS 'User role: admin or user';
COMMENT ON COLUMN users.is_active IS 'Whether the user account is active';
