import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const LegalNotice = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-ocean-600 text-white py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-ocean-100 hover:text-white mb-4 transition-colors">
                        <ArrowLeft size={20} />
                        <span>Back to Home</span>
                    </Link>
                    <h1 className="text-4xl font-bold">Legal Notice</h1>
                    <p className="text-ocean-100 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Company Information</h2>
                        <p className="text-gray-700 leading-relaxed">
                            <strong>Company Name:</strong> Ocean Construction LLC<br />
                            <strong>Address:</strong> 123 Ocean Drive, Miami, FL 33100, United States<br />
                            <strong>Email:</strong> contact@oceanconstruction.us<br />
                            <strong>Phone:</strong> +1 (555) 123-4567
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Website Ownership and Operation</h2>
                        <p className="text-gray-700 leading-relaxed">
                            This website is owned and operated by Ocean Construction LLC. All content, including but not limited to text,
                            images, graphics, logos, and software, is the property of Ocean Construction LLC or its content suppliers and
                            is protected by United States and international copyright laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Terms of Use</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
                            If you do not agree to abide by the above, please do not use this service.
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>You may not use this website for any illegal or unauthorized purpose</li>
                            <li>You must not transmit any worms, viruses, or any code of a destructive nature</li>
                            <li>A breach or violation of any of the Terms will result in immediate termination of your services</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property Rights</h2>
                        <p className="text-gray-700 leading-relaxed">
                            All trademarks, service marks, trade names, logos, and other intellectual property displayed on this website
                            are the property of Ocean Construction LLC or their respective owners. You may not use, copy, reproduce, or
                            distribute any content from this website without express written permission from Ocean Construction LLC.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Ocean Construction LLC shall not be liable for any direct, indirect, incidental, special, or consequential
                            damages resulting from the use or inability to use this website or for the cost of procurement of substitute
                            goods and services or resulting from any goods or services purchased or obtained or messages received or
                            transactions entered into through the website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Disclaimer of Warranties</h2>
                        <p className="text-gray-700 leading-relaxed">
                            This website and all information, content, materials, products, and services included on or otherwise made
                            available to you through this website are provided on an "as is" and "as available" basis, unless otherwise
                            specified in writing. Ocean Construction LLC makes no representations or warranties of any kind, express or
                            implied, as to the operation of this website or the information, content, materials, products, or services
                            included on or otherwise made available to you through this website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Governing Law</h2>
                        <p className="text-gray-700 leading-relaxed">
                            These terms and conditions are governed by and construed in accordance with the laws of the State of Florida
                            and the United States of America. You agree that any legal action or proceeding between Ocean Construction LLC
                            and you for any purpose concerning this agreement or the parties' obligations hereunder shall be brought
                            exclusively in a federal or state court of competent jurisdiction sitting in Miami-Dade County, Florida.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Links</h2>
                        <p className="text-gray-700 leading-relaxed">
                            This website may contain links to third-party websites that are not owned or controlled by Ocean Construction LLC.
                            We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any
                            third-party websites. We strongly advise you to read the terms and conditions and privacy policy of any
                            third-party website that you visit.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modifications</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Ocean Construction LLC reserves the right to modify or replace these terms at any time. It is your responsibility
                            to check these terms periodically for changes. Your continued use of the website following the posting of any
                            changes to these terms constitutes acceptance of those changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
                        <p className="text-gray-700 leading-relaxed">
                            If you have any questions about this Legal Notice, please contact us at:
                        </p>
                        <div className="mt-4 p-4 bg-ocean-50 rounded-lg">
                            <p className="text-gray-700">
                                <strong>Email:</strong> legal@oceanconstruction.us<br />
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

export default LegalNotice;
