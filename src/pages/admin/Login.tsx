import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
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
            // 1. Obtener el token CSRF (Requisito de seguridad de Auth.js)
            const csrfRes = await fetch(`${API_URL}/auth/csrf`);
            const { csrfToken } = await csrfRes.json();

            // 2. Enviar credenciales al callback de Auth.js
            // Usamos application/x-www-form-urlencoded que es lo que espera el provider
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
                throw new Error('Credenciales inválidas o error de conexión');
            }

            // Si llegamos aquí, la sesión se ha guardado en una Cookie segura (HTTP-Only)
            // No necesitamos guardar nada en localStorage
            navigate('/admin/dashboard');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-center mb-6">
                    <div className="bg-ocean-100 p-3 rounded-full">
                        <Lock className="w-8 h-8 text-ocean-600" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Admin Login</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500 min-h-[44px]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ocean-500 min-h-[44px]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-ocean-600 text-white py-3 rounded-md font-semibold hover:bg-ocean-700 transition-colors min-h-[44px] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Iniciando sesión...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
