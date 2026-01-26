
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Reveal } from './Animations';

const Contact = () => {
    return (
        <section id="contact" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal width="100%">
                    <div className="text-center mb-16">
                        <h2 className="text-ocean-600 font-bold uppercase tracking-wide mb-2">Contact Us</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Get In Touch</h3>
                        <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
                            Ready to start your project? Contact us today for a free estimate.
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h4 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h4>

                        <div className="space-y-8">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-ocean-100 rounded-lg flex items-center justify-center text-ocean-600">
                                        <Phone size={24} />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h5 className="text-lg font-bold text-gray-900">Phone</h5>
                                    <p className="text-gray-600 mt-1">+1 (555) 123-4567</p>
                                    <p className="text-sm text-gray-500">Mon-Fri 8am-6pm</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-ocean-100 rounded-lg flex items-center justify-center text-ocean-600">
                                        <Mail size={24} />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h5 className="text-lg font-bold text-gray-900">Email</h5>
                                    <p className="text-gray-600 mt-1">info@oceanconstruction.us</p>
                                    <p className="text-sm text-gray-500">Online support 24/7</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-ocean-100 rounded-lg flex items-center justify-center text-ocean-600">
                                        <MapPin size={24} />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h5 className="text-lg font-bold text-gray-900">Office</h5>
                                    <p className="text-gray-600 mt-1">123 Construction Blvd,<br />Builder City, FL 33000</p>
                                </div>
                            </div>

                            <div className="mt-8 border-t pt-8">
                                <div className="flex items-center text-gray-600">
                                    <Clock size={20} className="mr-2 text-ocean-500" />
                                    <span>Serving the entire Tri-County area</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h4 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h4>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent outline-none transition-all"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent outline-none transition-all"
                                        placeholder="(555) 000-0000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent outline-none transition-all"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Tell us about your project..."
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-ocean-600 text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-ocean-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
