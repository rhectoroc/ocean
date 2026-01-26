import { useEffect, useState } from 'react';
import type { Project } from '../lib/api';
import { fetchProjects } from '../lib/api';
import { Reveal } from './Animations';

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
                                <div key={project.id} className="flex flex-col bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 transform hover:-translate-y-1">
                                    <div className="w-full h-64 overflow-hidden relative group">
                                        <img
                                            src={project.image_url}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"></div>
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
