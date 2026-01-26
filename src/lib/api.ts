export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Service {
    id: number;
    title: string;
    description: string;
    icon_url?: string;
    display_order: number;
}

export interface Project {
    id: number;
    title: string;
    description: string;
    image_url: string;
    category?: string;
    created_at: string;
}

export async function fetchServices(): Promise<Service[]> {
    try {
        const response = await fetch(`${API_URL}/services`);
        if (!response.ok) throw new Error('Failed to fetch services');
        return await response.json();
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
}

export async function fetchProjects(): Promise<Project[]> {
    try {
        const response = await fetch(`${API_URL}/projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        return await response.json();
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}
