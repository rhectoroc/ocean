
import { ArrowRight } from 'lucide-react';

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
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6">
                    An <span className="text-ocean-400">OCEAN</span> of ideas <br className="hidden sm:block" />
                    for your home!
                </h1>

                <p className="mt-4 text-xl sm:text-2xl text-gray-200 max-w-2xl mb-10 mx-auto sm:mx-0">
                    Professional construction and remodeling services tailored to your needs. Quality, integrity, and excellence in every detail.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                    <a
                        href="#projects"
                        className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-md text-white bg-ocean-600 hover:bg-ocean-700 md:py-4 md:text-xl md:px-10 transition-all min-h-[44px]"
                    >
                        View Projects
                    </a>
                    <a
                        href="#contact"
                        className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-bold rounded-md text-white hover:bg-white hover:text-ocean-900 md:py-4 md:text-xl md:px-10 transition-all min-h-[44px] gap-2"
                    >
                        Contact Us <ArrowRight size={20} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Hero;
