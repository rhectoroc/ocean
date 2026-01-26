import { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/#about' },
        { name: 'Services', path: '/#services' },
        { name: 'Projects', path: '/#projects' },
        { name: 'Contact', path: '/#contact' },
    ];

    return (
        <nav className="w-full bg-white shadow-md fixed top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/logo.png" alt="Ocean Construction" className="h-12 w-auto" />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.path}
                                className="text-gray-700 hover:text-ocean-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                            >
                                {item.name}
                            </a>
                        ))}
                        <a
                            href="tel:+10000000000"
                            className="bg-ocean-600 text-white px-5 py-2.5 rounded-md font-medium hover:bg-ocean-700 transition-colors flex items-center gap-2"
                        >
                            <Phone size={18} />
                            <span>Call Us</span>
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-3 rounded-md text-gray-700 hover:text-ocean-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ocean-500 min-h-[44px] min-w-[44px]"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.path}
                                className="block px-3 py-4 rounded-md text-base font-medium text-gray-700 hover:text-ocean-600 hover:bg-gray-50 min-h-[44px] flex items-center"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </a>
                        ))}
                        <a
                            href="tel:+10000000000"
                            className="block w-full text-center px-4 py-4 mt-4 bg-ocean-600 text-white font-bold rounded-md min-h-[44px]"
                        >
                            CALL US NOW
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
