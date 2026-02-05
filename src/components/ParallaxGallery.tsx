import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/dist/Draggable';
import { fetchActiveGalleryImages } from '../lib/galleryApi';
import type { GalleryImage } from '../lib/galleryApi';
import './ParallaxGallery.css';

gsap.registerPlugin(Draggable);

const API_URL = import.meta.env.VITE_API_URL || '';

const ParallaxGallery = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const draggerRef = useRef<HTMLDivElement>(null);
    const xPosRef = useRef(0);
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getImages = async () => {
            try {
                const data = await fetchActiveGalleryImages();
                // We need at least 6 images for the effect to look good, so we'll duplicate if needed
                let galleryImages = data;
                if (data.length > 0 && data.length < 6) {
                    while (galleryImages.length < 6) {
                        galleryImages = [...galleryImages, ...data];
                    }
                }
                setImages(galleryImages);
            } catch (error) {
                console.error('Failed to load gallery images:', error);
            } finally {
                setLoading(false);
            }
        };

        getImages();
    }, []);

    useEffect(() => {
        if (loading || images.length === 0) return;

        const container = containerRef.current;
        const ring = ringRef.current;
        const dragger = draggerRef.current;

        if (!container || !ring || !dragger) return;

        // Force 3D rendering context
        container.style.transformStyle = 'preserve-3d';
        ring.style.transformStyle = 'preserve-3d';

        const imgs = Array.from(ring.children) as HTMLElement[];



        // Initial setup
        gsap.set(dragger, { opacity: 0 });
        gsap.set(ring, { rotationY: 180 });

        imgs.forEach((img, i) => {
            gsap.set(img, {
                rotateY: i * -60,
                transformOrigin: '50% 50% 600px',
                z: -600,
                // backgroundPosition is simple center, we rely on the 3D rotation for the effect
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backfaceVisibility: 'hidden',
                force3D: true
            });
        });

        // Entrance animation
        gsap.from(imgs, {
            duration: 1.5,
            y: 200,
            opacity: 0,
            stagger: 0.1,
            ease: 'expo'
        });

        // Draggable setup
        Draggable.create(dragger, {
            onDragStart: (e: any) => {
                if (e.touches) e.clientX = e.touches[0].clientX;
                xPosRef.current = Math.round(e.clientX);
            },

            onDrag: (e: any) => {
                if (e.touches) e.clientX = e.touches[0].clientX;

                gsap.to(ring, {
                    rotationY: '-=' + ((Math.round(e.clientX) - xPosRef.current) % 360)
                });

                xPosRef.current = Math.round(e.clientX);
            },

            onDragEnd: () => {
                gsap.set(dragger, { x: 0, y: 0 });
            }
        });

        return () => {
            Draggable.get(dragger)?.kill();
        };
    }, [loading, images]);

    if (loading) {
        return <div className="py-20 bg-black text-white text-center">Loading gallery...</div>;
    }

    if (images.length === 0) {
        return null; // Or hide section if no images
    }

    return (
        <section id="gallery" className="py-20 bg-black relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Our Work Gallery
                    </h2>
                </div>

                <div className="parallax-container" ref={containerRef}>
                    <div id="parallax-ring" ref={ringRef}>
                        {images.map((img, index) => (
                            <div
                                key={`${img.id}-${index}`}
                                className="parallax-img"
                                style={{
                                    backgroundImage: `url(${API_URL}${img.image_url})`
                                }}
                            ></div>
                        ))}
                    </div>
                    <div className="parallax-vignette"></div>
                    <div id="parallax-dragger" ref={draggerRef}></div>
                </div>
            </div>
        </section>
    );
};

export default ParallaxGallery;
