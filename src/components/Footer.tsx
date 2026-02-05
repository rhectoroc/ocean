
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Column 1: Logo & Socials */}
                    <div className="col-span-1">
                        <img src="/logofondo.png" alt="Ocean Construction" className="h-20 mb-4" />
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
                            <li><Link to="/legal-notice" className="text-gray-400 hover:text-ocean-400 transition-colors">Legal Notice</Link></li>
                            <li><Link to="/privacy-policy" className="text-gray-400 hover:text-ocean-400 transition-colors">Privacy Policy</Link></li>
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

                {/* Bottom Bar with Adriel's Systems Signature */}
                <div className="border-t border-ocean-800/30 mt-12 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-ocean-200">
                            © {new Date().getFullYear()} Ocean. All rights reserved.
                        </p>
                        <a
                            href="https://adrielssystems.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 text-sm text-ocean-200 hover:text-white transition-colors"
                        >
                            <span>Created by</span>
                            <span className="font-bold bg-gradient-to-r from-ocean-300 to-cyan-300 bg-clip-text text-transparent group-hover:from-white group-hover:to-ocean-100 transition-all">
                                Adriel's Systems
                            </span>
                            <svg
                                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
