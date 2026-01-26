import { useState, useEffect } from 'react';
import { Menu, X, Phone, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Toggle background on scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/#about' },
        { name: 'Services', path: '/#services' },
        { name: 'Projects', path: '/#projects' },
        { name: 'Contact', path: '/#contact' },
    ];

    return (
        <nav
            className={`w-full fixed top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo (2x size) */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <img
                                src="/logofondo.png"
                                alt="Ocean Construction"
                                className={`transition-all duration-300 hover:scale-105 ${isScrolled ? 'h-20' : 'h-24'}`}
                            />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path.startsWith('/#') ? '/' : item.path}
                            >
                                <a
                                    href={item.path}
                                    className={`px-3 py-2 text-sm font-bold transition-colors duration-200 ${isScrolled ? 'text-gray-700 hover:text-ocean-600' : 'text-white hover:text-ocean-300'
                                        }`}
                                >
                                    {item.name}
                                </a>
                            </Link>
                        ))}
                        <a
                            href="tel:+10000000000"
                            className={`px-5 py-2.5 rounded-md font-medium transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 ${isScrolled
                                ? 'bg-ocean-600 text-white hover:bg-ocean-700'
                                : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20'
                                }`}
                        >
                            <Phone size={18} />
                            <span>Call Us</span>
                        </a>

                        {/* Sign In Icon */}
                        <Link
                            to="/admin"
                            className={`transition-colors p-2 rounded-full ${isScrolled
                                ? 'text-gray-400 hover:text-ocean-600 hover:bg-ocean-50'
                                : 'text-white/80 hover:text-white hover:bg-white/10'
                                }`}
                            title="Sign In"
                        >
                            <User size={24} />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`inline-flex items-center justify-center p-3 rounded-md focus:outline-none min-h-[44px] min-w-[44px] ${isScrolled ? 'text-gray-700 hover:text-ocean-600' : 'text-white hover:text-ocean-300'
                                }`}
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
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-full shadow-xl">
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
