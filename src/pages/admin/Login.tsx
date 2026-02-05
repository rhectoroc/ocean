import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Waves, Loader2 } from 'lucide-react';
import { API_URL } from '../../lib/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const csrfRes = await fetch(`${API_URL}/auth/csrf`);
            const { csrfToken } = await csrfRes.json();

            const res = await fetch(`${API_URL}/auth/callback/credentials`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    email,
                    password,
                    csrfToken,
                    callbackUrl: '/admin/dashboard',
                    json: 'true',
                    redirect: 'false'
                }),
            });

            if (!res.ok) {
                throw new Error('Invalid credentials or connection error');
            }

            navigate('/admin/dashboard');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4">
            {/* Animated Ocean Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-ocean-600 via-ocean-500 to-cyan-600">
                {/* Animated Waves */}
                <div className="absolute inset-0 opacity-30">
                    <svg className="absolute bottom-0 w-full h-64 animate-wave" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,50 C300,100 600,0 900,50 C1050,75 1150,50 1200,50 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.1)" />
                    </svg>
                    <svg className="absolute bottom-0 w-full h-64 animate-wave-slow" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,70 C300,20 600,100 900,70 C1050,55 1150,80 1200,70 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.05)" />
                    </svg>
                </div>

                {/* Floating Bubbles */}
                <div className="absolute inset-0">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white/10 animate-float"
                            style={{
                                width: `${Math.random() * 60 + 20}px`,
                                height: `${Math.random() * 60 + 20}px`,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${Math.random() * 10 + 10}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md">
                {/* Glassmorphism Card */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-10 border border-white/20 animate-fade-in-up">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <img
                                src="/logofondo.png"
                                alt="Ocean"
                                className="h-16 sm:h-20 animate-fade-in"
                            />
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-ocean-500 to-transparent rounded-full animate-pulse" />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-600 flex items-center justify-center gap-2">
                            <Waves size={18} className="text-ocean-500" />
                            <span>Sign in to your account</span>
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6 text-sm animate-shake">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-ocean-500 focus:ring-4 focus:ring-ocean-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                placeholder="admin@ocean.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-ocean-500 focus:ring-4 focus:ring-ocean-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-gradient-to-r from-ocean-600 to-ocean-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-ocean-700 hover:to-ocean-600'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <Waves size={24} />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Ocean CMS • Secure Admin Access
                        </p>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-ocean-300/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
            </div>

            {/* Custom Animations */}
            <style>{`
                @keyframes wave {
                    0%, 100% { transform: translateX(0) translateY(0); }
                    50% { transform: translateX(-25%) translateY(-10px); }
                }
                @keyframes wave-slow {
                    0%, 100% { transform: translateX(0) translateY(0); }
                    50% { transform: translateX(25%) translateY(-15px); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(-30px) translateX(10px); }
                }
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-wave {
                    animation: wave 15s ease-in-out infinite;
                }
                .animate-wave-slow {
                    animation: wave-slow 20s ease-in-out infinite;
                }
                .animate-float {
                    animation: float linear infinite;
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out;
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default Login;
