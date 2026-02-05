import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, LogOut, Eye, GripVertical, X } from 'lucide-react';
import { API_URL, type Project } from '../../lib/api';
import FileUploadZone from '../../components/admin/FileUploadZone';
import ProjectPreview from '../../components/admin/ProjectPreview';

interface MediaImage {
    url: string;
    order: number;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [previewProject, setPreviewProject] = useState<any | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Construction',
        images: [] as MediaImage[],
        video_url: ''
    });

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch(`${API_URL}/auth/session`);
                const session = await res.json();

                if (!session || Object.keys(session).length === 0) {
                    navigate('/admin');
                    return;
                }

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
            const csrfRes = await fetch(`${API_URL}/auth/csrf`);
            const { csrfToken } = await csrfRes.json();

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

    const handleImagesUploaded = (urls: string[]) => {
        const newImages = urls.map((url, index) => ({
            url,
            order: formData.images.length + index
        }));
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages].slice(0, 10) // Max 10 images
        }));
    };

    const handleVideoUploaded = (urls: string[]) => {
        if (urls.length > 0) {
            setFormData(prev => ({ ...prev, video_url: urls[0] }));
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i }))
        }));
    };

    const moveImage = (fromIndex: number, toIndex: number) => {
        const newImages = [...formData.images];
        const [moved] = newImages.splice(fromIndex, 1);
        newImages.splice(toIndex, 0, moved);
        setFormData(prev => ({
            ...prev,
            images: newImages.map((img, i) => ({ ...img, order: i }))
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.images.length === 0) {
            alert('Please upload at least one image');
            return;
        }

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
                setFormData({ title: '', description: '', category: 'Construction', images: [], video_url: '' });
            } else {
                alert('Error al guardar el proyecto. Verifica tu sesión.');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handlePreview = () => {
        setPreviewProject({
            ...formData,
            id: 0
        });
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
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                            {/* Images Upload */}
                            <FileUploadZone
                                label={`Images (${formData.images.length}/10)`}
                                accept="image/*"
                                maxFiles={10 - formData.images.length}
                                uploadEndpoint={`${API_URL}/upload/image`}
                                onFilesUploaded={handleImagesUploaded}
                            />

                            {/* Image Grid */}
                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={img.url}
                                                alt={`Upload ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={16} />
                                            </button>
                                            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                #{index + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Video Upload */}
                            {!formData.video_url && (
                                <FileUploadZone
                                    label="Video (Optional)"
                                    accept="video/*"
                                    maxFiles={1}
                                    uploadEndpoint={`${API_URL}/upload/video`}
                                    onFilesUploaded={handleVideoUploaded}
                                />
                            )}

                            {formData.video_url && (
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Video</label>
                                    <div className="relative group">
                                        <video src={formData.video_url} controls className="w-full max-h-64 rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, video_url: '' }))}
                                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={handlePreview}
                                    className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 min-h-[44px] font-bold flex items-center gap-2"
                                    disabled={formData.images.length === 0}
                                >
                                    <Eye size={20} />
                                    Preview
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 min-h-[44px] font-bold"
                                >
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

            {/* Preview Modal */}
            {previewProject && (
                <ProjectPreview
                    project={previewProject}
                    onClose={() => setPreviewProject(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;
