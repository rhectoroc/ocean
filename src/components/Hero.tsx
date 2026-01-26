import { ArrowRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Reveal } from './Animations';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Hero = () => {
    const container = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    // Video Playlist Optimization
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const videos = ["/hero.mp4", "/hero2.mp4", "/hero3.mp4"];
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    useEffect(() => {
        // Ensure the current video plays
        const currentVideo = videoRefs.current[currentVideoIndex];

        if (currentVideo) {
            currentVideo.currentTime = 0;
            currentVideo.play().catch(e => console.log("Auto-play prevented:", e));
        }

        // Pause others to save resources, but keep them ready
        videoRefs.current.forEach((vid, idx) => {
            if (idx !== currentVideoIndex && vid) {
                if (!vid.paused) vid.pause();
            }
        });
    }, [currentVideoIndex]);

    const handleVideoEnded = () => {
        const nextIndex = (currentVideoIndex + 1) % videos.length;
        setCurrentVideoIndex(nextIndex);
    };

    useGSAP(() => {
        // Initial Elegant Entrance - Fade and reveal
        const tl = gsap.timeline({
            defaults: { ease: 'power4.out' },
            onComplete: () => {
                // Initialize ScrollTrigger after entrance to avoid conflicts
                gsap.to(titleRef.current, {
                    y: 150,
                    force3D: true,
                    scrollTrigger: {
                        trigger: container.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1
                    }
                });

                gsap.to(subtitleRef.current, {
                    y: 100,
                    force3D: true,
                    scrollTrigger: {
                        trigger: container.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1
                    }
                });
            }
        });

        tl.from(titleRef.current, {
            y: 60,
            opacity: 0,
            duration: 1.5,
            delay: 0.3
        })
            .from(subtitleRef.current, {
                y: 40,
                opacity: 0,
                duration: 1.5
            }, "-=1.2");

    }, { scope: container });

    return (
        <div ref={container} className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-gray-900">
            {/* Background Video Layer */}
            <div className="absolute inset-0 z-0">
                {videos.map((src, index) => (
                    <video
                        key={src}
                        ref={(el) => { if (el) videoRefs.current[index] = el; }}
                        muted
                        playsInline
                        preload="auto"
                        onEnded={() => {
                            if (index === currentVideoIndex) handleVideoEnded();
                        }}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentVideoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        <source src={src} type="video/mp4" />
                    </video>
                ))}

                {/* Overlay - Lightened from bg-black/50 to bg-black/30 */}
                <div className="absolute inset-0 bg-black/30 z-20"></div>
            </div>

            {/* Content */}
            <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col justify-center h-full pt-20">
                <div className="mb-6 relative z-10"> {/* Removed overflow-hidden and added relative */}
                    <h1 ref={titleRef} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight mb-2 leading-[1.1]">
                        An <span className="text-ocean-400">OCEAN</span> of ideas
                    </h1>
                    <h1 ref={subtitleRef} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-ocean-400 tracking-tight leading-[1.1]">
                        for your home!
                    </h1>
                </div>

                <Reveal width="100%" delay={1.2}>
                    <p className="mt-4 text-xl sm:text-2xl text-gray-100 max-w-2xl mb-10 mx-auto sm:mx-0 drop-shadow-lg font-medium">
                        Professional construction and remodeling services tailored to your needs. Quality, integrity, and excellence in every detail.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                        <a
                            href="#projects"
                            className="inline-flex items-center justify-center px-8 py-4 border-2 border-transparent text-lg font-bold rounded-md text-white bg-ocean-600 hover:bg-ocean-700 md:py-4 md:text-xl md:px-10 transition-all min-h-[44px] hover:scale-105 hover:shadow-xl hover:ring-4 hover:ring-ocean-500/30"
                        >
                            View Projects
                        </a>
                        <a
                            href="#contact"
                            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-bold rounded-md text-white hover:bg-white hover:text-ocean-900 md:py-4 md:text-xl md:px-10 transition-all min-h-[44px] gap-2 hover:scale-105 hover:shadow-xl"
                        >
                            Contact Us <ArrowRight size={20} />
                        </a>
                    </div>
                </Reveal>
            </div>
        </div>
    );
};

export default Hero;
