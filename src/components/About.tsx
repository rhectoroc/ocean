import React from 'react';
import { CheckCircle } from 'lucide-react';

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Image Grid */}
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <img
                                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"
                                alt="Construction Site"
                                className="rounded-lg shadow-lg w-full h-64 object-cover mt-8"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
                                alt="Worker"
                                className="rounded-lg shadow-lg w-full h-64 object-cover"
                            />
                        </div>
                        {/* Decoration Element */}
                        <div className="absolute -z-10 bg-ocean-100 w-full h-full top-4 left-4 rounded-lg"></div>
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
            </div>
        </section>
    );
};

export default About;
