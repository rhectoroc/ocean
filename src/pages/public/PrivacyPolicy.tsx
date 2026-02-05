import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-ocean-600 text-white py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-ocean-100 hover:text-white mb-4 transition-colors">
                        <ArrowLeft size={20} />
                        <span>Back to Home</span>
                    </Link>
                    <h1 className="text-4xl font-bold">Privacy Policy</h1>
                    <p className="text-ocean-100 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Ocean Construction LLC ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                            explains how we collect, use, disclose, and safeguard your information when you visit our website
                            oceanconstruction.us, including any other media form, media channel, mobile website, or mobile application
                            related or connected thereto (collectively, the "Site").
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy,
                            please do not access the site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.1 Personal Information</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We may collect personal information that you voluntarily provide to us when you:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>Contact us through our contact form or email</li>
                            <li>Request a quote or consultation</li>
                            <li>Subscribe to our newsletter</li>
                            <li>Interact with our chatbot assistant</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            This information may include: name, email address, phone number, mailing address, and project details.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.2 Automatically Collected Information</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            When you visit our Site, we may automatically collect certain information about your device, including:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>IP address and browser type</li>
                            <li>Operating system and device information</li>
                            <li>Pages visited and time spent on pages</li>
                            <li>Referring website addresses</li>
                            <li>Clickstream data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We use the information we collect in the following ways:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>To respond to your inquiries and provide customer service</li>
                            <li>To send you quotes, proposals, and project information</li>
                            <li>To improve our website and services</li>
                            <li>To send you marketing communications (with your consent)</li>
                            <li>To analyze website usage and trends</li>
                            <li>To prevent fraudulent transactions and protect against criminal activity</li>
                            <li>To comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies and Tracking Technologies</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help
                            customize the Site and improve your experience. When you access the Site, your personal information is
                            not collected through the use of tracking technology.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that
                            such action could affect the availability and functionality of the Site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Disclosure of Your Information</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We may share information we have collected about you in certain situations:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>By Law or to Protect Rights:</strong> If we believe disclosure is necessary to comply with legal obligations or protect our rights</li>
                            <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition of all or a portion of our business</li>
                            <li><strong>Third-Party Service Providers:</strong> We may share your information with contractors and service providers who perform services for us</li>
                            <li><strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with your consent</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Third-Party Websites</h2>
                        <p className="text-gray-700 leading-relaxed">
                            The Site may contain links to third-party websites and applications. We are not responsible for the privacy
                            practices of these third parties. We encourage you to read the privacy policies of every website you visit.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Security</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We use administrative, technical, and physical security measures to help protect your personal information.
                            While we have taken reasonable steps to secure the personal information you provide to us, please be aware
                            that no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed
                            against any interception or other type of misuse.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We will retain your personal information only for as long as is necessary for the purposes set out in this
                            Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal
                            obligations, resolve disputes, and enforce our policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Your Privacy Rights</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Depending on your location, you may have the following rights regarding your personal information:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li><strong>Access:</strong> Request access to your personal information</li>
                            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                            <li><strong>Opt-Out:</strong> Opt-out of marketing communications at any time</li>
                            <li><strong>Data Portability:</strong> Request a copy of your data in a structured format</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            To exercise these rights, please contact us using the information provided below.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. California Privacy Rights</h2>
                        <p className="text-gray-700 leading-relaxed">
                            California Civil Code Section 1798.83 permits California residents to request certain information regarding
                            our disclosure of personal information to third parties for their direct marketing purposes. To make such a
                            request, please contact us using the information below.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Children's Privacy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Our Site is not intended for children under 13 years of age. We do not knowingly collect personal information
                            from children under 13. If you become aware that a child has provided us with personal information, please
                            contact us immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
                            Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy
                            Policy periodically for any changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you have questions or comments about this Privacy Policy, please contact us at:
                        </p>
                        <div className="p-4 bg-ocean-50 rounded-lg">
                            <p className="text-gray-700">
                                <strong>Ocean Construction LLC</strong><br />
                                <strong>Email:</strong> privacy@oceanconstruction.us<br />
                                <strong>Phone:</strong> +1 (555) 123-4567<br />
                                <strong>Address:</strong> 123 Ocean Drive, Miami, FL 33100, United States
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
