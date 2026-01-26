import { useRef } from 'react';
import {
    FileText,
    PencilRuler,
    Calculator,
    Home,
    Hammer,
    RefreshCw,
    Wrench,
    Droplets,
    ShieldCheck,
    ArrowRight
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ServicesSection = () => {
    const container = useRef(null);

    useGSAP(() => {
        // Animate Process Steps
        gsap.from(".process-step", {
            scrollTrigger: {
                trigger: "#process-flow",
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)"
        });

        // Animate Service Cards
        // Animate Service Cards  
        gsap.fromTo(".service-card",
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: "#service-grid",
                    start: "top 80%", // Trigger earlier
                }
            }
        );

    }, { scope: container });

    const processSteps = [
        { icon: FileText, title: "Plan / Spec", description: "Detailed Analysis" },
        { icon: PencilRuler, title: "Design", description: "Custom Drafting" }, // Renamed 'Services' to Design for clarity based on icon
        { icon: Calculator, title: "Cost Estimation", description: "Transparent Pricing" },
        { icon: Home, title: "Project Building", description: "Expert Execution" },
    ];

    const services = [
        { icon: Hammer, title: "Constructions", description: "New builds from the ground up." },
        { icon: RefreshCw, title: "Renovations", description: "Modernizing your existing spaces." },
        { icon: Wrench, title: "Repairs", description: "Quick and reliable fixes." },
        { icon: Droplets, title: "Waterproofing", description: "Protecting your home from water damage." },
        { icon: Wrench, title: "Plumbing", description: "Expert piping and fixture installation." }, // Reusing Wrench or finding specific
        { icon: ShieldCheck, title: "Maintenance", description: "Long-term care for your property." },
    ];

    return (
        <div ref={container} id="services" className="font-sans">
            {/* Top Section: Process Flow */}
            <section id="process-flow" className="py-20 bg-ocean-900 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                    <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Our Services</h2>
                        <p className="text-ocean-300 text-xl font-light tracking-wide uppercase">30 Years Experience</p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-4 relative">
                        {processSteps.map((step, index) => (
                            <div key={index} className="process-step flex flex-col items-center relative group w-full md:w-1/5">
                                <div className="w-24 h-24 bg-white text-ocean-900 rounded-xl flex items-center justify-center mb-6 shadow-lg transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-ocean-500/50 group-hover:scale-110">
                                    <step.icon size={40} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                {/* Arrow Connector (Hidden on last item and mobile) */}
                                {index < processSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-12 -right-[50%] w-full h-full pointer-events-none text-ocean-600">
                                        <ArrowRight className="mx-auto w-8 h-8 opacity-50" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative Bottom Shape */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[50px] fill-gray-50">
                        <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z"></path>
                    </svg>
                </div>
            </section>

            {/* Bottom Section: Service Grid with Parallax Look */}
            <section id="service-grid" className="py-24 bg-gray-50 relative">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0 bg-gray-900">
                    <img
                        src="https://images.unsplash.com/photo-1581094794329-cd1361ddeeeb?q=80&w=2070&auto=format&fit=crop"
                        alt="Background"
                        className="w-full h-full object-cover fixed-background opacity-60"
                    />
                    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-[2px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
                            What can we do for your property?
                        </h2>
                        <div className="w-24 h-1 bg-ocean-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="service-card group relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-ocean-500/10 rounded-bl-[100px] -mr-8 -mt-8 transition-all group-hover:bg-ocean-500/20"></div>

                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-6 p-4 bg-transparent border-2 border-ocean-400/30 rounded-full text-ocean-400 group-hover:text-white group-hover:bg-ocean-500 group-hover:border-ocean-500 transition-all duration-300 transform group-hover:rotate-6">
                                        <service.icon size={36} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-ocean-300 transition-colors">{service.title}</h3>
                                    <p className="text-gray-300 group-hover:text-white transition-colors">{service.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServicesSection;
