export interface GalleryImage {
    id: number;
    image_url: string;
    thumbnail_url: string | null;
    display_order: number;
    title: string | null;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

const API_URL = import.meta.env.VITE_API_URL || '';

export const fetchGalleryImages = async (): Promise<GalleryImage[]> => {
    const res = await fetch(`${API_URL}/api/gallery`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch gallery images');
    return res.json();
};

export const fetchActiveGalleryImages = async (): Promise<GalleryImage[]> => {
    const res = await fetch(`${API_URL}/api/gallery/active`);
    if (!res.ok) throw new Error('Failed to fetch active gallery images');
    return res.json();
};

export const createGalleryImage = async (formData: FormData): Promise<GalleryImage> => {
    const res = await fetch(`${API_URL}/api/gallery`, {
        method: 'POST',
        credentials: 'include',
        body: formData
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create gallery image');
    }
    return res.json();
};

export const updateGalleryImage = async (id: number, formData: FormData): Promise<GalleryImage> => {
    const res = await fetch(`${API_URL}/api/gallery/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
    });
    if (!res.ok) throw new Error('Failed to update gallery image');
    return res.json();
};

export const reorderGalleryImages = async (items: { id: number; display_order: number }[]): Promise<GalleryImage[]> => {
    const res = await fetch(`${API_URL}/api/gallery/reorder/batch`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items })
    });
    if (!res.ok) throw new Error('Failed to reorder gallery images');
    return res.json();
};

export const deleteGalleryImage = async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/api/gallery/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to delete gallery image');
};
