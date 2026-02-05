
import { useState, useEffect } from 'react';
import { Save, Bot, Copy, Check } from 'lucide-react';

interface BotConfig {
    bot_name: string;
    system_role: string;
    tone_personality: string;
    business_context: string;
    constraints: string;
    faq_examples: string;
    public_token?: string;
}

const BotSettings = () => {
    const [config, setConfig] = useState<BotConfig>({
        bot_name: '',
        system_role: '',
        tone_personality: '',
        business_context: '',
        constraints: '',
        faq_examples: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [copied, setCopied] = useState(false);

    // Fetch config on mount
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch('/api/bot/config');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.bot_name) { // Check if data exists
                        setConfig(data);
                    }
                }
            } catch (err) {
                console.error('Error fetching bot config:', err);
                setError('Failed to load configuration');
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/bot/config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            if (!res.ok) throw new Error('Failed to save');

            const data = await res.json();
            setConfig(data); // Update state, especially for public_token if created
            setSuccess('Bot Brain updated successfully!');
        } catch (err) {
            setError('Error saving configuration');
        } finally {
            setSaving(false);
        }
    };

    const copyToClipboard = () => {
        if (config.public_token) {
            navigator.clipboard.writeText(config.public_token);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Bot Brain...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-ocean-100 text-ocean-600 rounded-lg">
                    <Bot size={32} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bot Brain Configuration</h1>
                    <p className="text-gray-500">Train your AI assistant with context and personality.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                {/* Identity Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bot Name</label>
                        <input
                            type="text"
                            name="bot_name"
                            value={config.bot_name}
                            onChange={handleChange}
                            placeholder="e.g., Ocean Assistant"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:outline-none"
                            required
                        />
                    </div>
                </div>

                {/* System Role */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">System Role</label>
                    <textarea
                        name="system_role"
                        value={config.system_role}
                        onChange={handleChange}
                        rows={2}
                        placeholder="e.g., You are an expert construction consultant for Ocean Construction."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">High-level definition of who the AI is.</p>
                </div>

                {/* Personality */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tone & Personality</label>
                    <textarea
                        name="tone_personality"
                        value={config.tone_personality}
                        onChange={handleChange}
                        rows={2}
                        placeholder="e.g., Professional, friendly, concise, and helpful."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:outline-none"
                    />
                </div>

                {/* Business Context */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Context</label>
                    <textarea
                        name="business_context"
                        value={config.business_context}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Add services, prices, hours, location, and key company info here..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:outline-none font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">This is the 'knowledge' the bot uses to answer questions.</p>
                </div>

                {/* Constraints */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Constraints & Rules</label>
                    <textarea
                        name="constraints"
                        value={config.constraints}
                        onChange={handleChange}
                        rows={3}
                        placeholder="e.g., Do NOT give exact quotes, refer to the contact form. Do NOT mention competitors."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:outline-none"
                    />
                </div>

                {/* FAQs */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">FAQ Examples</label>
                    <textarea
                        name="faq_examples"
                        value={config.faq_examples}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Q: Do you offer free estimates? A: Yes, we provide free initial consultations."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:outline-none font-mono text-sm"
                    />
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-ocean-600 text-white px-6 py-2.5 rounded-lg hover:bg-ocean-700 transition-colors disabled:opacity-50"
                    >
                        <Save size={20} />
                        {saving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </form>

            {/* Integration Token */}
            {config.public_token && (
                <div className="mt-8 bg-gray-50 rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Integration</h3>
                    <p className="text-sm text-gray-600 mb-4">Use this ID to connect n8n or other external tools to this bot's brain.</p>

                    <div className="flex items-center gap-2">
                        <div className="bg-white border border-gray-300 px-4 py-2 rounded-lg font-mono text-sm text-gray-600 flex-1 overflow-hidden overflow-ellipsis">
                            {config.public_token}
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                            title="Copy to clipboard"
                        >
                            {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BotSettings;
