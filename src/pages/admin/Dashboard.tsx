import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, LogOut, Image as ImageIcon } from 'lucide-react';
import { API_URL, type Project } from '../../lib/api'; // Reuse types and central API config

const Dashboard = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        category: 'Construction'
    });

    useEffect(() => {
        const checkSession = async () => {
            try {
                // Verificamos la sesión con Auth.js
                const res = await fetch(`${API_URL}/auth/session`);
                const session = await res.json();

                if (!session || Object.keys(session).length === 0) {
                    navigate('/admin');
                    return;
                }

                // Si hay sesión, cargamos los proyectos
                fetchProjects();
            } catch (err) {
                console.error('Session check failed', err);
                navigate('/admin');
            }
        };

        checkSession();
    }, [navigate]);

    const fetchProjects = async () => {
        try {
            const res = await fetch(`${API_URL}/projects`);
            const data = await res.json();
            setProjects(data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch projects', err);
        }
    };

    const handleLogout = async () => {
        try {
            // 1. Obtener CSRF para cerrar sesión
            const csrfRes = await fetch(`${API_URL}/auth/csrf`);
            const { csrfToken } = await csrfRes.json();

            // 2. Ejecutar SignOut de Auth.js
            await fetch(`${API_URL}/auth/signout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ csrfToken })
            });

            navigate('/admin');
        } catch (err) {
            console.error('Logout failed', err);
            navigate('/admin');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            // Ya no enviamos Authorization Header, Auth.js usa Cookies seguras
            const res = await fetch(`${API_URL}/projects/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setProjects(projects.filter(p => p.id !== id));
            } else {
                alert('No tienes permisos para realizar esta acción');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`${API_URL}/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const newProject = await res.json();
                setProjects([newProject, ...projects]);
                setShowForm(false);
                setFormData({ title: '', description: '', image_url: '', category: 'Construction' });
            } else {
                alert('Error al guardar el proyecto. Verifica tu sesión.');
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">CMS Dashboard</h1>
                    <button onClick={handleLogout} className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
                        <LogOut size={20} className="mr-2" />
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Actions */}
                <div className="mb-8 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Projects Management</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-ocean-600 text-white px-4 py-2 rounded-md hover:bg-ocean-700 flex items-center gap-2 min-h-[44px]"
                    >
                        <Plus size={20} />
                        {showForm ? 'Cancel' : 'Add Project'}
                    </button>
                </div>

                {/* Add Form */}
                {showForm && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
                        <h3 className="text-lg font-bold mb-4">New Project</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Project Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 min-h-[44px]"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 min-h-[44px]"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="Construction">Construction</option>
                                        <option value="Remodeling">Remodeling</option>
                                        <option value="Roofs">Roofs</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                                        rows={3}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://..."
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2 min-h-[44px]"
                                        value={formData.image_url}
                                        onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                    />
                                </div>
                                {/* Image Preview */}
                                <div className="mt-2 w-full h-48 bg-gray-100 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                                    {formData.image_url ? (
                                        <img
                                            src={formData.image_url}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                            }}
                                            onLoad={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'block';
                                                (e.target as HTMLImageElement).nextElementSibling?.classList.add('hidden');
                                            }}
                                        />
                                    ) : null}
                                    <div className={`flex flex-col items-center text-gray-400 ${formData.image_url ? 'hidden' : ''}`}>
                                        <ImageIcon size={32} />
                                        <span className="text-sm">Image Preview</span>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 flex justify-end">
                                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 min-h-[44px] font-bold">
                                    Save Project
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Projects List */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {projects.map((project) => (
                            <li key={project.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <img src={project.image_url} alt="" className="h-16 w-16 object-cover rounded" />
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">{project.title}</h4>
                                        <p className="text-sm text-gray-500">{project.category}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="text-red-600 hover:text-red-900 p-2"
                                    title="Delete Project"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </li>
                        ))}
                        {projects.length === 0 && !loading && (
                            <li className="p-8 text-center text-gray-500">No projects found. Add one above!</li>
                        )}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
