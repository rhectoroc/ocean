import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Reveal } from './Animations';

gsap.registerPlugin(useGSAP);

const Hero = () => {
    const container = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from(titleRef.current, {
            y: 100,
            opacity: 0,
            duration: 1.5,
            delay: 0.5
        })
            .from(subtitleRef.current, {
                y: 50,
                opacity: 0,
                duration: 1.2
            }, "-=1");

        // Infinite floating animation (after entrance)
        gsap.to(titleRef.current, {
            y: -15, // Float up
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 2 // Wait for entrance
        });

        gsap.to(subtitleRef.current, {
            y: -10, // Float up slightly different
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 2.2 // Wait for entrance
        });

    }, { scope: container });

    return (
        <div ref={container} className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/hero.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {/* Overlay - Lightened from bg-black/50 to bg-black/30 */}
                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col justify-center h-full pt-20">
                <div className="mb-6 overflow-hidden">
                    <h1 ref={titleRef} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-2">
                        An <span className="text-ocean-400">OCEAN</span> of ideas
                    </h1>
                    <h1 ref={subtitleRef} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-ocean-400 tracking-tight">
                        for your home!
                    </h1>
                </div>

                <Reveal width="100%" delay={1.8}>
                    <p className="mt-4 text-xl sm:text-2xl text-gray-100 max-w-2xl mb-10 mx-auto sm:mx-0 drop-shadow-md">
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
