import React from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import About from '../../components/About';
import Contact from '../../components/Contact';
import Footer from '../../components/Footer';

const Home = () => {
    return (
        <div className="w-full min-h-screen flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                <Hero />

                <About />

                {/* Dynamic Section Placeholders */}
                <section id="services" className="py-20 bg-gray-50 min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
                        <p className="text-gray-500">Loading services from database...</p>
                    </div>
                </section>

                <section id="projects" className="py-20 bg-white min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Projects</h2>
                        <p className="text-gray-500">Loading projects from database...</p>
                    </div>
                </section>

                <Contact />
            </main>

            <Footer />
        </div>
    );
};

export default Home;
