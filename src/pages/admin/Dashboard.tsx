import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, LogOut, Eye, X, Edit, Star, FolderKanban, Menu as MenuIcon, User, ChevronLeft, Image as ImageIcon, Users } from 'lucide-react';


import { API_URL, type Project } from '../../lib/api';
import FileUploadZone from '../../components/admin/FileUploadZone';
import ProjectPreview from '../../components/admin/ProjectPreview';

interface MediaImage {
    url: string;
    order: number;
}

const PREDEFINED_TAGS = ['New Project', 'Featured', 'Residential', 'Commercial'];

const Dashboard = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [previewProject, setPreviewProject] = useState<any | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userEmail, setUserEmail] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Construction',
        images: [] as MediaImage[],
        video_url: '',
        tags: [] as string[],
        cover_image_index: 0
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

                // Extract user email from session
                if (session.user?.email) {
                    setUserEmail(session.user.email);
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

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description || '',
            category: project.category || 'Construction',
            images: Array.isArray(project.images) ? project.images : [],
            video_url: project.video_url || '',
            tags: Array.isArray(project.tags) ? project.tags : [],
            cover_image_index: project.cover_image_index || 0
        });
        setShowForm(true);
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
            images: [...prev.images, ...newImages].slice(0, 10)
        }));
    };

    const handleVideoUploaded = (urls: string[]) => {
        if (urls.length > 0) {
            setFormData(prev => ({ ...prev, video_url: urls[0] }));
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => {
            const newImages = prev.images.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i }));
            let newCoverIndex = prev.cover_image_index;
            if (newCoverIndex >= newImages.length) {
                newCoverIndex = Math.max(0, newImages.length - 1);
            }
            return {
                ...prev,
                images: newImages,
                cover_image_index: newCoverIndex
            };
        });
    };

    const setCoverImage = (index: number) => {
        setFormData(prev => ({ ...prev, cover_image_index: index }));
    };

    const toggleTag = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.images.length === 0) {
            alert('Please upload at least one image');
            return;
        }

        try {
            const url = editingProject
                ? `${API_URL}/projects/${editingProject.id}`
                : `${API_URL}/projects`;

            const method = editingProject ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const savedProject = await res.json();
                if (editingProject) {
                    setProjects(projects.map(p => p.id === savedProject.id ? savedProject : p));
                } else {
                    setProjects([savedProject, ...projects]);
                }
                resetForm();
            } else {
                alert('Error al guardar el proyecto. Verifica tu sesión.');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingProject(null);
        setFormData({
            title: '',
            description: '',
            category: 'Construction',
            images: [],
            video_url: '',
            tags: [],
            cover_image_index: 0
        });
    };

    const handlePreview = () => {
        setPreviewProject({
            ...formData,
            id: editingProject?.id || 0
        });
    };

    const getUserName = () => {
        if (!userEmail) return 'Admin';
        return userEmail.split('@')[0];
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100">Cargando dashboard...</div>;

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                    {sidebarOpen && (
                        <img src="/logofondo.png" alt="Ocean" className="h-10" />
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors ml-auto"
                    >
                        {sidebarOpen ? <ChevronLeft size={20} /> : <MenuIcon size={20} />}
                    </button>
                </div>

                {/* Sidebar Menu */}
                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-ocean-50 text-ocean-700 font-medium transition-colors"
                    >
                        <FolderKanban size={20} />
                        {sidebarOpen && <span>Projects</span>}
                    </button>
                    <button
                        onClick={() => navigate('/admin/gallery')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                    >
                        <ImageIcon size={20} />
                        {sidebarOpen && <span>Gallery</span>}
                    </button>
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                    >
                        <Users size={20} />
                        {sidebarOpen && <span>Users</span>}
                    </button>
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-200">
                    {sidebarOpen && (
                        <div className="space-y-2">
                            <div className="text-xs text-gray-500 text-center">
                                Ocean CMS v1.0
                            </div>
                            <a
                                href="https://adrielssystems.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-ocean-600 transition-colors group"
                            >
                                <span>by</span>
                                <span className="font-semibold">Adriel's Systems</span>
                                <svg
                                    className="w-3 h-3 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0.5 transition-all"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-gray-900">Projects Management</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* User Info */}
                        <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-ocean-100 flex items-center justify-center">
                                <User size={18} className="text-ocean-700" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{getUserName()}</span>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            <LogOut size={18} />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Actions */}
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                            <p className="text-sm text-gray-500 mt-1">Manage your portfolio projects</p>
                        </div>
                        <button
                            onClick={() => {
                                if (showForm) {
                                    resetForm();
                                } else {
                                    setShowForm(true);
                                }
                            }}
                            className="bg-ocean-600 text-white px-6 py-3 rounded-lg hover:bg-ocean-700 flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
                        >
                            <Plus size={20} />
                            {showForm ? 'Cancel' : 'Add Project'}
                        </button>
                    </div>

                    {/* Add/Edit Form */}
                    {showForm && (
                        <div className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-200">
                            <h3 className="text-lg font-bold mb-6 text-gray-900">
                                {editingProject ? 'Edit Project' : 'New Project'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors"
                                        rows={3}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        {PREDEFINED_TAGS.map(tag => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => toggleTag(tag)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.tags.includes(tag)
                                                    ? 'bg-ocean-600 text-white shadow-sm'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Images Upload */}
                                {formData.images.length < 10 && (
                                    <FileUploadZone
                                        label={`Images (${formData.images.length}/10)`}
                                        accept="image/*"
                                        maxFiles={10 - formData.images.length}
                                        uploadEndpoint={`${API_URL}/upload/image`}
                                        onFilesUploaded={handleImagesUploaded}
                                    />
                                )}

                                {/* Image Grid */}
                                {formData.images.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Images (Click star to set as cover)
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {formData.images.map((img, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={img.url}
                                                        alt={`Upload ${index + 1}`}
                                                        className={`w-full h-32 object-cover rounded-lg border-2 transition-all ${index === formData.cover_image_index
                                                            ? 'border-yellow-500 shadow-lg'
                                                            : 'border-gray-200'
                                                            }`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setCoverImage(index)}
                                                        className={`absolute top-2 left-2 p-1.5 rounded-full transition-all ${index === formData.cover_image_index
                                                            ? 'bg-yellow-500 text-white shadow-md'
                                                            : 'bg-white/90 text-gray-600 opacity-0 group-hover:opacity-100'
                                                            }`}
                                                        title="Set as cover image"
                                                    >
                                                        <Star size={16} fill={index === formData.cover_image_index ? 'currentColor' : 'none'} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                        #{index + 1}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
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
                                                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex justify-between pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={handlePreview}
                                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium flex items-center gap-2 transition-colors"
                                        disabled={formData.images.length === 0}
                                    >
                                        <Eye size={20} />
                                        Preview
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium transition-colors shadow-sm hover:shadow-md"
                                    >
                                        {editingProject ? 'Update Project' : 'Save Project'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="aspect-video overflow-hidden">
                                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <h4 className="text-lg font-bold text-gray-900 mb-1">{project.title}</h4>
                                            <p className="text-sm text-gray-500">{project.category}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(project)}
                                                className="p-2 text-ocean-600 hover:bg-ocean-50 rounded-lg transition-colors"
                                                title="Edit Project"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Project"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    {project.tags && project.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {project.tags.map((tag: string, idx: number) => (
                                                <span key={idx} className="text-xs bg-ocean-50 text-ocean-700 px-2 py-1 rounded-md font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {projects.length === 0 && !loading && (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                <FolderKanban size={48} className="mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-medium">No projects found</p>
                                <p className="text-sm">Click "Add Project" to create your first project</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

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
