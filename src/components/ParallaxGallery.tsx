import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/dist/Draggable';
import './ParallaxGallery.css';

gsap.registerPlugin(Draggable);

const ParallaxGallery = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const draggerRef = useRef<HTMLDivElement>(null);
    const xPosRef = useRef(0);

    // Imágenes de proyectos de construcción
    const images = [
        '/construction.png',
        '/renovation.png',
        '/quality.png',
        '/construction.png',
        '/renovation.png',
        '/quality.png',
        '/construction.png',
        '/renovation.png',
        '/quality.png',
        '/construction.png'
    ];

    useEffect(() => {
        const container = containerRef.current;
        const ring = ringRef.current;
        const dragger = draggerRef.current;

        if (!container || !ring || !dragger) return;

        // Force 3D rendering context
        container.style.transformStyle = 'preserve-3d';
        ring.style.transformStyle = 'preserve-3d';

        const imgs = Array.from(ring.children) as HTMLElement[];

        const getBgPos = (i: number) => {
            const rotation = gsap.getProperty(ring, 'rotationY') as number;
            return (-gsap.utils.wrap(0, 360, rotation - 180 - i * 36) / 360 * 400) + 'px 0px';
        };

        // Initial setup
        gsap.set(dragger, { opacity: 0 });
        gsap.set(ring, { rotationY: 180 });

        imgs.forEach((img, i) => {
            gsap.set(img, {
                rotateY: i * -36,
                transformOrigin: '50% 50% 500px',
                z: -500,
                backgroundImage: `url(${images[i]})`,
                backgroundPosition: getBgPos(i),
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
                    rotationY: '-=' + ((Math.round(e.clientX) - xPosRef.current) % 360),
                    onUpdate: () => {
                        imgs.forEach((img, i) => {
                            gsap.set(img, {
                                backgroundPosition: getBgPos(i)
                            });
                        });
                    }
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
    }, []);

    return (
        <section id="gallery" className="py-20 bg-black relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Our Work Gallery
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Drag to explore our portfolio in 3D
                    </p>
                </div>

                <div className="parallax-container" ref={containerRef}>
                    <div id="parallax-ring" ref={ringRef}>
                        {images.map((_, index) => (
                            <div key={index} className="parallax-img"></div>
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
