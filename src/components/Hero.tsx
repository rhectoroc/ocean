import { ArrowRight } from 'lucide-react';
import { AnimatedTitle, Reveal } from './Animations';

const Hero = () => {
    return (
        <div className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
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
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col justify-center h-full">
                <div className="mb-6">
                    <AnimatedTitle
                        text="An OCEAN of ideas"
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight justify-center sm:justify-start"
                    />
                    <AnimatedTitle
                        text="for your home!"
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-ocean-400 tracking-tight justify-center sm:justify-start mt-2"
                    />
                </div>

                <Reveal width="100%" delay={0.5}>
                    <p className="mt-4 text-xl sm:text-2xl text-gray-200 max-w-2xl mb-10 mx-auto sm:mx-0">
                        Professional construction and remodeling services tailored to your needs. Quality, integrity, and excellence in every detail.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                        <a
                            href="#projects"
                            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-md text-white bg-ocean-600 hover:bg-ocean-700 md:py-4 md:text-xl md:px-10 transition-all min-h-[44px] hover:scale-105 hover:shadow-xl"
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
