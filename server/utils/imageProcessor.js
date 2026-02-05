import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = process.platform === 'win32' ? path.join(process.cwd(), 'upload') : '/upload';
const THUMBNAILS_DIR = path.join(UPLOAD_DIR, 'thumbnails');

// Ensure thumbnails directory exists
if (!fs.existsSync(THUMBNAILS_DIR)) {
    fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
}

/**
 * Process uploaded image: resize, convert to JPG, and compress
 * @param {string} inputPath - Path to the uploaded image
 * @returns {Promise<{processedPath: string, thumbnailPath: string}>}
 */
export async function processImage(inputPath) {
    try {
        const ext = path.extname(inputPath).toLowerCase();
        const filename = path.basename(inputPath, ext);
        const processedFilename = `${filename}.jpg`;
        const processedPath = path.join(UPLOAD_DIR, processedFilename);
        const thumbnailPath = path.join(THUMBNAILS_DIR, processedFilename);

        // If input is already .jpg and has the same name, use a temp file
        const needsTemp = ext === '.jpg' && inputPath === processedPath;
        const tempPath = needsTemp ? path.join(UPLOAD_DIR, `temp_${filename}.jpg`) : null;

        // Process main image: resize to max 1920x1080, convert to JPG, compress
        await sharp(inputPath)
            .resize(1920, 1080, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: 85 })
            .toFile(needsTemp ? tempPath : processedPath);

        // If we used a temp file, replace the original
        if (needsTemp) {
            fs.unlinkSync(inputPath);
            fs.renameSync(tempPath, processedPath);
        } else if (ext !== '.jpg') {
            // Delete original if it's not a JPG
            fs.unlinkSync(inputPath);
        }

        // Generate thumbnail: 400x300
        await sharp(processedPath)
            .resize(400, 300, {
                fit: 'cover',
                position: 'center'
            })
            .jpeg({ quality: 80 })
            .toFile(thumbnailPath);

        return {
            processedPath: `/upload/${processedFilename}`,
            thumbnailPath: `/upload/thumbnails/${processedFilename}`
        };
    } catch (error) {
        console.error('Image processing error:', error);
        throw new Error('Failed to process image');
    }
}

/**
 * Delete image and its thumbnail
 * @param {string} imageUrl - URL of the image to delete (e.g., /upload/image.jpg)
 */
export function deleteImage(imageUrl) {
    try {
        if (!imageUrl || !imageUrl.startsWith('/upload/')) return;

        const filename = path.basename(imageUrl);
        const imagePath = path.join(UPLOAD_DIR, filename);
        const thumbnailPath = path.join(THUMBNAILS_DIR, filename);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        if (fs.existsSync(thumbnailPath)) {
            fs.unlinkSync(thumbnailPath);
        }
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}

/**
 * Delete video file
 * @param {string} videoUrl - URL of the video to delete
 */
export function deleteVideo(videoUrl) {
    try {
        if (!videoUrl || !videoUrl.startsWith('/upload/')) return;

        const filename = path.basename(videoUrl);
        const videoPath = path.join(UPLOAD_DIR, filename);

        if (fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath);
        }
    } catch (error) {
        console.error('Error deleting video:', error);
    }
}
