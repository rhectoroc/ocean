import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Mail, MessageCircle } from 'lucide-react';
import type { Project } from '../lib/api';

interface ProjectDetailModalProps {
    project: Project;
    onClose: () => void;
    onOpenChatbot: () => void;
}

const ProjectDetailModal = ({ project, onClose, onOpenChatbot }: ProjectDetailModalProps) => {
    const images = Array.isArray(project.images) && project.images.length > 0
        ? project.images
        : [{ url: project.image_url, order: 0 }];

    const coverIndex = project.cover_image_index || 0;
    const sortedImages = [...images].sort((a, b) => a.order - b.order);
    const orderedImages = coverIndex > 0 && coverIndex < sortedImages.length
        ? [sortedImages[coverIndex], ...sortedImages.filter((_, i) => i !== coverIndex)]
        : sortedImages;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Prevent body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % orderedImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + orderedImages.length) % orderedImages.length);
    };

    const scrollToContact = () => {
        onClose();
        setTimeout(() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    };

    const handleChatbot = () => {
        onClose();
        setTimeout(() => {
            onOpenChatbot();
        }, 300);
    };

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
                >
                    <X size={24} className="text-gray-700" />
                </button>

                <div className="flex flex-col md:flex-row max-h-[90vh]">
                    {/* Image Carousel */}
                    <div className="md:w-3/5 relative bg-gray-900">
                        <div className="aspect-[4/3] relative">
                            {orderedImages.map((img, index) => (
                                <img
                                    key={index}
                                    src={img.url}
                                    alt={`${project.title} - Image ${index + 1}`}
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                        }`}
                                />
                            ))}

                            {/* Navigation Arrows */}
                            {orderedImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
                                    >
                                        <ChevronLeft size={24} className="text-gray-700" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
                                    >
                                        <ChevronRight size={24} className="text-gray-700" />
                                    </button>
                                </>
                            )}

                            {/* Image Counter */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                                {currentImageIndex + 1} / {orderedImages.length}
                            </div>
                        </div>

                        {/* Thumbnail Navigation */}
                        {orderedImages.length > 1 && (
                            <div className="flex gap-2 p-4 overflow-x-auto bg-gray-800">
                                {orderedImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                                                ? 'border-ocean-500 scale-105'
                                                : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img
                                            src={img.url}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Project Details */}
                    <div className="md:w-2/5 p-6 md:p-8 overflow-y-auto">
                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.tags.map((tag, idx) => {
                                    const badge = getTagBadge(tag);
                                    return (
                                        <span
                                            key={idx}
                                            className={`${badge.color} text-white text-xs font-bold px-3 py-1 rounded-full`}
                                        >
                                            {badge.text}
                                        </span>
                                    );
                                })}
                            </div>
                        )}

                        {/* Category */}
                        <p className="text-ocean-600 text-sm font-bold uppercase tracking-wider mb-2">
                            {project.category || 'Construction'}
                        </p>

                        {/* Title */}
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            {project.title}
                        </h2>

                        {/* Description */}
                        {project.description && (
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {project.description}
                            </p>
                        )}

                        {/* Video */}
                        {project.video_url && (
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Project Video</h3>
                                <video
                                    src={project.video_url}
                                    controls
                                    className="w-full rounded-lg shadow-md"
                                />
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3 mt-8">
                            <button
                                onClick={scrollToContact}
                                className="w-full bg-ocean-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-ocean-700 transition-all hover:shadow-xl flex items-center justify-center gap-3 group"
                            >
                                <Mail size={24} className="group-hover:scale-110 transition-transform" />
                                <span>Contact Us</span>
                            </button>

                            <button
                                onClick={handleChatbot}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all hover:shadow-xl flex items-center justify-center gap-3 group"
                            >
                                <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
                                <span>More Information</span>
                            </button>
                        </div>

                        {/* Project Info */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Project ID: #{project.id}
                            </p>
                            {project.created_at && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Created: {new Date(project.created_at).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
                .animate-scale-in {
                    animation: scale-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default ProjectDetailModal;
