-- Migration: Add tags and cover image selection to projects
-- Execute this in DbGate after the previous migration

-- Step 1: Add new columns
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cover_image_index INTEGER DEFAULT 0;

-- Step 2: Add comments for documentation
COMMENT ON COLUMN projects.tags IS 'Array of tags like "New Project", "Featured", etc.';
COMMENT ON COLUMN projects.cover_image_index IS 'Index of the cover image in the images array (0-based)';

-- Step 3: Create index for tags (for faster filtering)
CREATE INDEX IF NOT EXISTS idx_projects_tags ON projects USING GIN(tags);

-- Step 4: Verify migration
SELECT id, title, tags, cover_image_index FROM projects;
