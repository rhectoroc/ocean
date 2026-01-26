
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-bold mb-4">OCEAN <span className="text-ocean-400">CONSTRUCTION</span></h3>
                        <p className="text-gray-400 max-w-sm mb-6">
                            Building quality structures and lasting relationships. Professional construction services you can trust.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={24} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={24} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={24} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={24} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="/" className="text-gray-400 hover:text-ocean-400">Home</a></li>
                            <li><a href="#about" className="text-gray-400 hover:text-ocean-400">About</a></li>
                            <li><a href="#services" className="text-gray-400 hover:text-ocean-400">Services</a></li>
                            <li><a href="#projects" className="text-gray-400 hover:text-ocean-400">Projects</a></li>
                            <li><a href="#contact" className="text-gray-400 hover:text-ocean-400">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-ocean-400">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-ocean-400">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Ocean Construction. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
