
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Column 1: Logo & Socials */}
                    <div className="col-span-1">
                        <img src="/logo.png" alt="Ocean Construction" className="h-16 mb-4 filter brightness-0 invert" />
                        <p className="text-gray-400 mb-6 text-sm">
                            Building quality structures and lasting relationships using an Ocean of ideas for your home.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"><Facebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"><Instagram size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"><Linkedin size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"><Twitter size={20} /></a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="/" className="text-gray-400 hover:text-ocean-400 transition-colors">Home</a></li>
                            <li><a href="#about" className="text-gray-400 hover:text-ocean-400 transition-colors">About</a></li>
                            <li><a href="#services" className="text-gray-400 hover:text-ocean-400 transition-colors">Services</a></li>
                            <li><a href="#projects" className="text-gray-400 hover:text-ocean-400 transition-colors">Projects</a></li>
                            <li><a href="#contact" className="text-gray-400 hover:text-ocean-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact Info (simplified) */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Contact</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>123 Ocean Drive</li>
                            <li>Miami, FL 33100</li>
                            <li>contact@oceanconstruction.us</li>
                            <li>+1 (555) 123-4567</li>
                        </ul>
                    </div>

                    {/* Column 4: Map */}
                    <div className="col-span-1 rounded-lg overflow-hidden h-48 md:h-auto">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114964.53925916665!2d-80.29949920263954!3d25.782390733064336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b0a20ec8c111%3A0xff96f271ddad4f65!2sMiami%2C%20FL!5e0!3m2!1sen!2sus!4v1706290000000!5m2!1sen!2sus"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full min-h-[200px]"
                        ></iframe>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Ocean Construction. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
