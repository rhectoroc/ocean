
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import About from '../../components/About';
import Contact from '../../components/Contact';
import Footer from '../../components/Footer';
import ServicesSection from '../../components/ServicesSection';
import ProjectsSection from '../../components/ProjectsSection';

const Home = () => {
    return (
        <div className="w-full min-h-screen flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow">
                <Hero />

                <About />

                <ServicesSection />

                <ProjectsSection />

                <Contact />
            </main>

            <Footer />
        </div>
    );
};

export default Home;
