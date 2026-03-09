import { useState, useEffect, useCallback, useMemo } from 'react';
import { Save, Bot, MessageSquare, TerminalSquare, Trash2, Edit2, X } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

// Define a type for your config to avoid "any"
interface Config {
    name: string;
    prompt: string;
    greeting: string;
}

const INITIAL_STATE: Config = {
    name: '',
    prompt: '',
    greeting: '',
};

const AgentConfig = () => {
    const [config, setConfig] = useState<Config>(INITIAL_STATE);
    const [isLoading, setIsLoading] = useState(false);
    const [agents, setAgents] = useState([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    // 1. Memoize fetch to prevent unnecessary re-renders
    const fetchAgents = useCallback(async () => {
        try {
            const { data } = await api.get('/agents');
            setAgents(data?.agents ?? []);
        } catch (error) {
            toast.error("Failed to load agents");
        }
    }, []);

    useEffect(() => {
        fetchAgents();
    }, [fetchAgents]);

    // 2. Combined change handler to reduce boilerplate
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        setEditingId(null);
        setConfig(INITIAL_STATE);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            name: config.name,
            systemPrompt: config.prompt,
            greeting: config.greeting
        };

        try {
            if (editingId) {
                await api.put(`/agents/${editingId}`, payload);
                toast.success("Agent updated");
            } else {
                await api.post('/agents', payload);
                toast.success("Agent created");
            }
            
            handleReset();
            fetchAgents();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Save failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this agent?")) return;
        try {
            await api.delete(`/agents/${id}`);
            toast.success("Agent deleted");
            fetchAgents();
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="max-w-4xl mx-auto animation-fade-in p-4">
            <header className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight mb-3">
                    {editingId ? 'Edit Agent' : 'Agent Configuration'}
                </h1>
                <p className="text-textMuted text-lg">Define your agent's personality and behavior.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-panel p-8">
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="label-style"><Bot className="w-4 h-4" /> Agent Name</label>
                            <input
                                name="name"
                                value={config.name}
                                onChange={handleChange}
                                className="input-field font-medium text-lg"
                                placeholder="e.g. Sales Representative"
                                required
                            />
                        </div>

                        {/* Greeting Input */}
                        <div className="space-y-2">
                            <label className="label-style"><MessageSquare className="w-4 h-4" /> Greeting</label>
                            <input
                                name="greeting"
                                value={config.greeting}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Hello! How can I help?"
                                required
                            />
                        </div>

                        {/* Prompt Textarea */}
                        <div className="space-y-2">
                            <label className="label-style"><TerminalSquare className="w-4 h-4" /> System Prompt</label>
                            <textarea
                                name="prompt"
                                value={config.prompt}
                                onChange={handleChange}
                                className="input-field min-h-[200px] font-mono text-sm"
                                placeholder="Describe rules and persona..."
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            {editingId && (
                                <button type="button" onClick={handleReset} className="btn-secondary">
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                            )}
                            <button type="submit" className="btn-primary" disabled={isLoading}>
                                {isLoading ? <Spinner /> : <><Save className="w-5 h-5" /> {editingId ? 'Update' : 'Save'} Agent</>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Live Preview - Simple & Reactive */}
                <aside className="glass-panel p-6 bg-primary/5 h-fit sticky top-4">
                    <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                        <Bot className="w-5 h-5" /> Live Preview
                    </h3>
                    <div className="bg-surfaceHighlight rounded-xl p-4 border border-white/5">
                        <div className="flex gap-3">
                            <div className="avatar-small"><Bot className="w-4 h-4 text-primary" /></div>
                            <div className="chat-bubble text-sm">
                                {config.greeting || <span className="italic opacity-50">Type a greeting to preview...</span>}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* List Section */}
            <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Your Agents ({agents.length})</h2>
                <div className="grid gap-4">
                    {agents.map((agent: any) => (
                        <div key={agent._id} className="glass-panel p-4 flex justify-between items-center group">
                            <div>
                                <h3 className="font-semibold text-lg">{agent.name}</h3>
                                <p className="text-sm text-textMuted line-clamp-1">{agent.greeting}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => {
                                    setEditingId(agent._id);
                                    setConfig({ name: agent.name, prompt: agent.systemPrompt, greeting: agent.greeting });
                                }} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <Edit2 className="w-5 h-5 text-textMuted" />
                                </button>
                                <button onClick={() => handleDelete(agent._id)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                                    <Trash2 className="w-5 h-5 text-red-400" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

const Spinner = () => <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />;

export default AgentConfig;