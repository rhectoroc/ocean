-- Migration: Add multiple images and video support to projects table
-- Execute this in DbGate

-- Step 1: Add new columns
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Step 2: Migrate existing image_url data to images array
UPDATE projects 
SET images = jsonb_build_array(
    jsonb_build_object('url', image_url, 'order', 0)
)
WHERE image_url IS NOT NULL AND image_url != '';

-- Step 3: Add comment for documentation
COMMENT ON COLUMN projects.images IS 'Array of image objects with url and order fields (max 10)';
COMMENT ON COLUMN projects.video_url IS 'Optional video URL for project showcase';

-- Step 4: Verify migration
SELECT id, title, image_url, images, video_url FROM projects;
