import { CheckCircle } from 'lucide-react';
import { Reveal } from './Animations';
import './CardGallery.css';

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
                        {/* Card Transition Gallery */}
                        <div className="flex items-center justify-center">
                            <div className="card-container bg-white shadow-lg">
                                <div
                                    className="card bg-blue-500 rounded-2xl h-[300px] w-full top-0 left-0"
                                    style={{
                                        backgroundImage: "url('/construction.png')",
                                        backgroundColor: '#1e40af'
                                    }}
                                >
                                    <div className="card-content">
                                        <div className="card-title">Expert Construction</div>
                                        <div className="card-description">
                                            From foundation to finishing touches, we deliver exceptional quality in every project. Our experienced team ensures precision and excellence at every stage.
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="card bg-teal-600 rounded-2xl h-[200px] w-[200px] top-[305px] left-0 bottom-0"
                                    style={{
                                        backgroundImage: "url('/renovation.png')",
                                        backgroundColor: '#0d9488'
                                    }}
                                >
                                    <div className="card-content">
                                        <div className="card-title">Modern Renovations</div>
                                        <div className="card-description">
                                            Transform your space with our innovative renovation services. We blend contemporary design with timeless craftsmanship.
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="card-d3 bg-teal-600 rounded-2xl border-4 hover:border-0 border-white h-[280px] w-[305px] right-0 bottom-0"
                                    style={{
                                        backgroundImage: "url('/quality.png')",
                                        backgroundColor: '#0d9488'
                                    }}
                                >
                                    <div className="card-content">
                                        <div className="card-title">Quality Assurance</div>
                                        <div className="card-description">
                                            Every project undergoes rigorous quality checks. We use premium materials and follow industry best practices to ensure lasting results.
                                        </div>
                                    </div>
                                </div>
                            </div>
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
