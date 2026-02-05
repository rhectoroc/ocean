export interface User {
    id: number;
    email: string;
    full_name: string;
    role: 'admin' | 'user';
    is_active: boolean;
    last_login: string | null;
    created_at: string;
    updated_at?: string;
}

const API_URL = import.meta.env.VITE_API_URL || '';

export const fetchUsers = async (): Promise<User[]> => {
    const res = await fetch(`${API_URL}/api/users`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
};

export const fetchUser = async (id: number): Promise<User> => {
    const res = await fetch(`${API_URL}/api/users/${id}`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
};

export const createUser = async (data: {
    email: string;
    password: string;
    full_name: string;
    role?: 'admin' | 'user';
}): Promise<User> => {
    const res = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create user');
    }
    return res.json();
};

export const updateUser = async (id: number, data: Partial<{
    email: string;
    full_name: string;
    role: 'admin' | 'user';
    is_active: boolean;
}>): Promise<User> => {
    const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update user');
    }
    return res.json();
};

export const changeUserPassword = async (id: number, password: string): Promise<void> => {
    const res = await fetch(`${API_URL}/api/users/${id}/password`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to change password');
    }
};

export const deleteUser = async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to delete user');
};
