import { useState } from 'react';
import { CheckCircle, X as XIcon, Play } from 'lucide-react';
import { Reveal } from './Animations';
import { motion, AnimatePresence } from 'framer-motion';

const About = () => {
    const highlights = [
        "Over 15 Years of Experience",
        "Licensed & Insured",
        "Premium Quality Materials",
        "100% Satisfaction Guaranteed"
    ];

    const [activeCard, setActiveCard] = useState<number | null>(null);

    const cards = [
        { id: 1, title: "Foundation", rotate: -6, z: 10, offset: { x: "-50%", y: "-50%" } },
        { id: 2, title: "Finishing", rotate: 3, z: 20, offset: { x: "-40%", y: "-40%" } },
        { id: 3, title: "Planning", rotate: -3, z: 15, offset: { x: "-60%", y: "-35%" } }
    ];

    return (
        <section id="about" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal width="100%">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Interactive Polaroid Stack */}
                        <div className="relative h-[600px] w-full flex items-center justify-center">

                            {/* Backdrop when active */}
                            <AnimatePresence>
                                {activeCard !== null && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setActiveCard(null)}
                                        className="fixed inset-0 bg-black/80 z-40 cursor-pointer backdrop-blur-sm"
                                    />
                                )}
                            </AnimatePresence>

                            {/* Cards */}
                            {cards.map((card) => {
                                const isActive = activeCard === card.id;

                                return (
                                    <motion.div
                                        key={card.id}
                                        layout
                                        onClick={() => setActiveCard(isActive ? null : card.id)}
                                        initial={false}
                                        animate={{
                                            rotate: isActive ? 0 : card.rotate,
                                            scale: isActive ? 1.2 : 1,
                                            zIndex: isActive ? 50 : card.z,
                                            x: isActive ? "-50%" : card.offset.x,
                                            y: isActive ? "-50%" : card.offset.y,
                                            left: "50%",
                                            top: "50%",
                                            position: isActive ? "fixed" : "absolute",
                                            width: isActive ? "auto" : "288px", // w-72 = 288px
                                            height: isActive ? "auto" : "auto",
                                        }}
                                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                        className={`bg-white p-4 pb-12 shadow-2xl cursor-pointer overflow-hidden ${isActive ? 'max-w-4xl w-[90vw] md:w-[800px] rounded-lg' : 'hover:scale-105 hover:z-30 transition-shadow'}`}
                                        style={{ transformOrigin: "center center" }}
                                    >
                                        <div className={`bg-gray-800 overflow-hidden border border-gray-100 relative ${isActive ? 'h-[50vh] md:h-[500px]' : 'h-64'}`}>
                                            <video
                                                autoPlay
                                                loop
                                                muted={!isActive}
                                                playsInline
                                                controls={isActive}
                                                className="w-full h-full object-cover transition-opacity"
                                            >
                                                <source src="/hero.mp4" type="video/mp4" />
                                            </video>

                                            {/* Play Icon Hint if not active */}
                                            {!isActive && (
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                                                    <Play className="text-white fill-current" size={48} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4 text-center flex justify-between items-center px-2">
                                            <span className="font-serif italic text-gray-600 text-2xl">{card.title}</span>
                                            {isActive && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setActiveCard(null); }}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <XIcon size={24} />
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* Background Elements */}
                            <div className="absolute -z-10 bg-ocean-100/50 w-96 h-96 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                        </div>

                        {/* Content */}
                        <div>
                            <h2 className="text-ocean-600 font-bold uppercase tracking-wide mb-2">About Us</h2>
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                building strong foundations for your future.
                            </h3>
                            <p className="text-lg text-gray-600 mb-6">
                                At Ocean Construction, we believe in more than just building structures; we build relationships. With over a decade of dedicated service, we have established ourselves as a premier construction company known for reliability, quality, and precision.
                            </p>
                            <p className="text-lg text-gray-600 mb-8">
                                Our team of experts manages every aspect of your project, ensuring seamless execution from blueprint to final touches.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {highlights.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <CheckCircle className="text-ocean-500 flex-shrink-0" size={20} />
                                        <span className="text-gray-700 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default About;
