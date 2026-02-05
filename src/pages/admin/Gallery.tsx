import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import type { GalleryImage } from '../../lib/galleryApi';
import { fetchGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage, reorderGalleryImages } from '../../lib/galleryApi';

const API_URL = import.meta.env.VITE_API_URL || '';
const MAX_IMAGES = 10;

const Gallery = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        try {
            const data = await fetchGalleryImages();
            setImages(data);
        } catch (error) {
            console.error('Error loading gallery:', error);
            alert('Failed to load gallery images');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (images.length >= MAX_IMAGES) {
            alert(`Maximum of ${MAX_IMAGES} images allowed`);
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('display_order', images.length.toString());

            await createGalleryImage(formData);
            await loadImages();
            e.target.value = '';
        } catch (error: any) {
            console.error('Error uploading image:', error);
            alert(error.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleToggleActive = async (image: GalleryImage) => {
        try {
            const formData = new FormData();
            formData.append('is_active', (!image.is_active).toString());
            await updateGalleryImage(image.id, formData);
            await loadImages();
        } catch (error) {
            console.error('Error toggling active status:', error);
            alert('Failed to update image status');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            await deleteGalleryImage(id);
            await loadImages();
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Failed to delete image');
        }
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...images];
        const draggedItem = newImages[draggedIndex];
        newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedItem);

        setImages(newImages);
        setDraggedIndex(index);
    };

    const handleDragEnd = async () => {
        if (draggedIndex === null) return;

        try {
            const items = images.map((img, idx) => ({
                id: img.id,
                display_order: idx
            }));
            await reorderGalleryImages(items);
            await loadImages();
        } catch (error) {
            console.error('Error reordering images:', error);
            alert('Failed to reorder images');
            await loadImages();
        } finally {
            setDraggedIndex(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-ocean-200 border-t-ocean-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Gallery Management</h1>
                <p className="text-gray-600">Manage images for the "Our Work Gallery" section (max {MAX_IMAGES} images)</p>
            </div>

            {/* Upload Section */}
            <div className="mb-8">
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${images.length >= MAX_IMAGES
                    ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                    : 'border-ocean-300 bg-ocean-50 hover:bg-ocean-100'
                    }`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                            <div className="w-8 h-8 border-4 border-ocean-200 border-t-ocean-600 rounded-full animate-spin" />
                        ) : (
                            <>
                                <Upload className="w-10 h-10 mb-2 text-ocean-600" />
                                <p className="mb-2 text-sm text-gray-700">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG or WEBP (max 5MB) - {images.length}/{MAX_IMAGES} images
                                </p>
                            </>
                        )}
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading || images.length >= MAX_IMAGES}
                    />
                </label>
            </div>

            {/* Images Grid */}
            {images.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 text-lg">No images yet</p>
                    <p className="text-gray-400 text-sm mt-2">Upload your first image to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-move transition-all ${draggedIndex === index ? 'opacity-50 scale-95' : 'hover:shadow-lg'
                                }`}
                        >
                            {/* Image */}
                            <div className="relative aspect-video bg-gray-100">
                                <img
                                    src={`${API_URL}${image.image_url}`}
                                    alt={image.title || 'Gallery image'}
                                    className="w-full h-full object-cover"
                                />
                                {/* Order Badge */}
                                <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                    <GripVertical size={16} />
                                    #{index + 1}
                                </div>
                                {/* Status Badge */}
                                <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold ${image.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                                    }`}>
                                    {image.is_active ? 'ACTIVE' : 'INACTIVE'}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-4">
                                <div className="flex items-center justify-between gap-2">
                                    <button
                                        onClick={() => handleToggleActive(image)}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${image.is_active
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`}
                                    >
                                        {image.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                                        <span>{image.is_active ? 'Hide' : 'Show'}</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(image.id)}
                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Gallery;
