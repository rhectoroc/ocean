import { useEffect, useState } from 'react';
import type { Service } from '../lib/api';
import { fetchServices } from '../lib/api';
import { Home } from 'lucide-react';

const ServicesSection = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadServices = async () => {
            const data = await fetchServices();
            setServices(data);
            setLoading(false);
        };
        loadServices();
    }, []);

    const renderIcon = () => {
        // Placeholder logic for icons
        return <Home className="w-12 h-12 text-ocean-600 mb-4" />;
    };

    if (loading) {
        return (
            <section id="services" className="py-20 bg-gray-50 min-h-[400px] flex items-center justify-center">
                <p className="text-gray-500">Loading services...</p>
            </section>
        );
    }

    return (
        <section id="services" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Our Services
                    </h2>
                    <p className="mt-4 text-xl text-gray-500">
                        Comprehensive construction and remodeling solutions.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {services.length > 0 ? (
                        services.map((service) => (
                            <div key={service.id} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex justify-center md:justify-start">
                                    {service.icon_url && service.icon_url.startsWith('http') ? (
                                        <img src={service.icon_url} alt="" className="w-12 h-12 mb-4 object-contain" />
                                    ) : (
                                        renderIcon()
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center md:text-left">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 text-center md:text-left">
                                    {service.description}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500">
                            No services found. <span className="text-xs">(Ensure backend is running and DB has data)</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
