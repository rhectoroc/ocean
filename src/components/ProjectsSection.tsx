import { useEffect, useState } from 'react';
import type { Project } from '../lib/api';
import { fetchProjects } from '../lib/api';
import { Reveal } from './Animations';

const ProjectCard = ({ project }: { project: Project }) => {
    const images = Array.isArray(project.images) && project.images.length > 0
        ? project.images
        : [{ url: project.image_url, order: 0 }];

    const coverIndex = project.cover_image_index || 0;
    const sortedImages = [...images].sort((a, b) => a.order - b.order);

    // Start with cover image
    const orderedImages = coverIndex > 0 && coverIndex < sortedImages.length
        ? [sortedImages[coverIndex], ...sortedImages.filter((_, i) => i !== coverIndex)]
        : sortedImages;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (orderedImages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % orderedImages.length);
        }, 4000); // Change image every 4 seconds

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
        <div className="flex flex-col bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 transform hover:-translate-y-1">
            <div className="w-full h-64 overflow-hidden relative group">
                {/* Image Carousel */}
                {orderedImages.map((img, index) => (
                    <img
                        key={index}
                        src={img.url}
                        alt={`${project.title} - Image ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop&fm=webp';
                        }}
                    />
                ))}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"></div>

                {/* Tags Badges */}
                {project.tags && project.tags.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {project.tags.slice(0, 2).map((tag, idx) => {
                            const badge = getTagBadge(tag);
                            return (
                                <span
                                    key={idx}
                                    className={`${badge.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}
                                >
                                    {badge.text}
                                </span>
                            );
                        })}
                    </div>
                )}

                {/* Carousel Indicators */}
                {orderedImages.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {orderedImages.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1.5 rounded-full transition-all ${index === currentImageIndex
                                        ? 'bg-white w-6'
                                        : 'bg-white/50 w-1.5'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="p-6 flex-grow">
                <span className="text-ocean-600 text-xs font-bold uppercase tracking-wider mb-2 block">
                    {project.category || 'Construction'}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {project.title}
                </h3>
                {project.description && (
                    <p className="text-gray-600 text-sm line-clamp-3">
                        {project.description}
                    </p>
                )}
            </div>
        </div>
    );
};

const ProjectsSection = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProjects = async () => {
            const data = await fetchProjects();
            setProjects(data);
            setLoading(false);
        };
        loadProjects();
    }, []);

    if (loading) {
        return (
            <section id="projects" className="py-20 bg-white min-h-[400px] flex items-center justify-center">
                <p className="text-gray-500">Loading projects...</p>
            </section>
        );
    }

    return (
        <section id="projects" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal width="100%">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Featured Projects
                        </h2>
                        <p className="mt-4 text-xl text-gray-500">
                            Explore our portfolio of completed works.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500">
                                No projects found.
                            </div>
                        )}
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default ProjectsSection;
