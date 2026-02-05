import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectPreviewProps {
    project: {
        title: string;
        description: string;
        category: string;
        images: Array<{ url: string; order: number }>;
        video_url?: string;
    };
    onClose: () => void;
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({ project, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === project.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? project.images.length - 1 : prev - 1
        );
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
                        <p className="text-sm text-gray-500">{project.category}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close preview"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Image Carousel */}
                    {project.images && project.images.length > 0 && (
                        <div className="relative">
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={project.images[currentImageIndex].url}
                                    alt={`${project.title} - Image ${currentImageIndex + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {project.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight size={24} />
                                    </button>

                                    {/* Image indicators */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        {project.images.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                                                        ? 'bg-white w-8'
                                                        : 'bg-white/50 hover:bg-white/75'
                                                    }`}
                                                aria-label={`Go to image ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Video */}
                    {project.video_url && (
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <video
                                src={project.video_url}
                                controls
                                className="w-full h-full"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
                    </div>

                    {/* Preview Note */}
                    <div className="bg-ocean-50 border border-ocean-200 rounded-lg p-4">
                        <p className="text-sm text-ocean-800">
                            <strong>Preview:</strong> This is how your project will appear on the public website.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectPreview;
