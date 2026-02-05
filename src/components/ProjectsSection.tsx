import { useEffect, useState } from 'react';
import type { Project } from '../lib/api';
import { fetchProjects } from '../lib/api';
import { Reveal } from './Animations';
import ProjectDetailModal from './ProjectDetailModal';

const ProjectCard = ({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) => {
    const images = Array.isArray(project.images) && project.images.length > 0
        ? project.images
        : [{ url: project.image_url, order: 0 }];

    const coverIndex = project.cover_image_index || 0;
    const sortedImages = [...images].sort((a, b) => a.order - b.order);
    const orderedImages = coverIndex > 0 && coverIndex < sortedImages.length
        ? [sortedImages[coverIndex], ...sortedImages.filter((_, i) => i !== coverIndex)]
        : sortedImages;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (orderedImages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % orderedImages.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [orderedImages.length]);

    const getTagBadge = (tag: string) => {
        const tagLower = tag.toLowerCase();
        if (tagLower.includes('new')) {
            return { text: 'NEW', color: 'bg-green-500' };
        }
        if (tagLower.includes('featured')) {
            return { text: 'FEATURED', color: 'bg-yellow-500' };
        }
        return { text: tag.toUpperCase(), color: 'bg-ocean-500' };
    };

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group cursor-pointer"
            style={{
                animationDelay: `${index * 0.1}s`
            }}
        >
            <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-card-in">
                {/* Image Container with 3D Effect */}
                <div className="w-full h-64 overflow-hidden relative perspective-1000">
                    <div className={`w-full h-full transition-transform duration-700 ${isHovered ? 'scale-110 rotate-1' : 'scale-100'}`}>
                        {orderedImages.map((img, imgIndex) => (
                            <img
                                key={imgIndex}
                                src={img.url}
                                alt={`${project.title} - Image ${imgIndex + 1}`}
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${imgIndex === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                    }`}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop&fm=webp';
                                }}
                            />
                        ))}
                    </div>

                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-70' : 'opacity-40'}`} />

                    {/* Tags Badges */}
                    {project.tags && project.tags.length > 0 && (
                        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                            {project.tags.slice(0, 2).map((tag, idx) => {
                                const badge = getTagBadge(tag);
                                return (
                                    <span
                                        key={idx}
                                        className={`${badge.color} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-badge-in`}
                                        style={{ animationDelay: `${(index * 0.1) + (idx * 0.1)}s` }}
                                    >
                                        {badge.text}
                                    </span>
                                );
                            })}
                        </div>
                    )}

                    {/* Carousel Indicators */}
                    {orderedImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                            {orderedImages.map((_, imgIndex) => (
                                <div
                                    key={imgIndex}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${imgIndex === currentImageIndex
                                            ? 'bg-white w-8'
                                            : 'bg-white/50 w-1.5'
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className={`absolute inset-0 bg-ocean-600/0 group-hover:bg-ocean-600/20 transition-all duration-500 flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full font-bold text-ocean-700 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                            View Details
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow relative overflow-hidden">
                    {/* Animated Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-ocean-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <span className="text-ocean-600 text-xs font-bold uppercase tracking-wider mb-2 block relative z-10">
                        {project.category || 'Construction'}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 relative z-10 group-hover:text-ocean-700 transition-colors duration-300">
                        {project.title}
                    </h3>
                    {project.description && (
                        <p className="text-gray-600 text-sm line-clamp-3 relative z-10">
                            {project.description}
                        </p>
                    )}

                    {/* Read More Indicator */}
                    <div className="mt-4 flex items-center gap-2 text-ocean-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Read More</span>
                        <svg className="w-4 h-4 animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProjectsSection = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        const loadProjects = async () => {
            const data = await fetchProjects();
            setProjects(data);
            setLoading(false);
        };
        loadProjects();
    }, []);

    const handleOpenChatbot = () => {
        // Trigger chatbot open event
        const chatbotButton = document.querySelector('[data-chatbot-button]') as HTMLButtonElement;
        if (chatbotButton) {
            chatbotButton.click();
        }
    };

    if (loading) {
        return (
            <section id="projects" className="py-20 bg-gradient-to-b from-white to-gray-50 min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-ocean-200 border-t-ocean-600 rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium">Loading projects...</p>
                </div>
            </section>
        );
    }

    return (
        <>
            <section id="projects" className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-ocean-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Reveal width="100%">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                                Featured Projects
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-ocean-600 to-cyan-600 mx-auto mb-6 rounded-full" />
                            <p className="text-xl text-gray-600">
                                Explore our portfolio of completed works and discover the quality we deliver.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {projects.length > 0 ? (
                                projects.map((project, index) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        index={index}
                                        onClick={() => setSelectedProject(project)}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 text-gray-500">
                                    <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <p className="text-lg font-medium">No projects found.</p>
                                </div>
                            )}
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Project Detail Modal */}
            {selectedProject && (
                <ProjectDetailModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                    onOpenChatbot={handleOpenChatbot}
                />
            )}

            <style>{`
                @keyframes card-in {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes badge-in {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes bounce-x {
                    0%, 100% {
                        transform: translateX(0);
                    }
                    50% {
                        transform: translateX(4px);
                    }
                }
                .animate-card-in {
                    animation: card-in 0.6s ease-out forwards;
                    opacity: 0;
                }
                .animate-badge-in {
                    animation: badge-in 0.5s ease-out forwards;
                    opacity: 0;
                }
                .animate-bounce-x {
                    animation: bounce-x 1s ease-in-out infinite;
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
        </>
    );
};

export default ProjectsSection;
