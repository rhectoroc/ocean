
import { CheckCircle } from 'lucide-react';
import { Reveal } from './Animations';

const About = () => {
    const highlights = [
        "Over 15 Years of Experience",
        "Licensed & Insured",
        "Premium Quality Materials",
        "100% Satisfaction Guaranteed"
    ];

    return (
        <section id="about" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal width="100%">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Image Grid */}
                        {/* Polaroid Video Stack */}
                        <div className="relative h-[500px] w-full flex items-center justify-center">
                            {/* Polaroid 1 */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-6 w-72 bg-white p-4 pb-12 shadow-2xl transition-all duration-500 hover:rotate-0 hover:scale-105 z-10">
                                <div className="w-full h-64 bg-gray-800 overflow-hidden border border-gray-100">
                                    <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity">
                                        <source src="/hero.mp4" type="video/mp4" />
                                    </video>
                                </div>
                                <div className="mt-4 text-center">
                                    <span className="font-serif italic text-gray-600 text-lg">Foundation</span>
                                </div>
                            </div>

                            {/* Polaroid 2 */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-[40%] -translate-y-[40%] rotate-3 w-72 bg-white p-4 pb-12 shadow-2xl transition-all duration-500 hover:rotate-0 hover:scale-105 z-20 hover:z-30">
                                <div className="w-full h-64 bg-gray-800 overflow-hidden border border-gray-100">
                                    <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity">
                                        <source src="/hero.mp4" type="video/mp4" />
                                    </video>
                                </div>
                                <div className="mt-4 text-center">
                                    <span className="font-serif italic text-gray-600 text-lg">Finishing</span>
                                </div>
                            </div>

                            {/* Background Elements */}
                            <div className="absolute -z-10 bg-ocean-100 w-96 h-96 rounded-full blur-3xl opacity-60 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
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
