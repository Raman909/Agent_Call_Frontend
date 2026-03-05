import { useState, useEffect } from 'react';
import { Save, Bot, MessageSquare, TerminalSquare } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const AgentConfig = () => {
    const [config, setConfig] = useState({
        name: 'Customer Support Bot',
        prompt: 'You are a helpful customer support agent for Acme Corp. Keep answers concise.',
        greeting: 'Hello! I am the Acme Corp virtual assistant. How can I help you today?',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [agents, setAgents] = useState([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            const response = await api.get('/agents');
            setAgents(response.data.agents);
        } catch (error) {
            console.error('Failed to fetch agents', error);
            toast.error("Failed to load agents");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editingId) {

                const res = await api.put(`/agents/${editingId}`, {
                    name: config.name,
                    systemPrompt: config.prompt,
                    greeting: config.greeting
                });

                toast.success(res.data?.message || "Agent updated successfully");

            } else {

                const res = await api.post('/agents', {
                    name: config.name,
                    systemPrompt: config.prompt,
                    greeting: config.greeting
                });

                toast.success(res.data?.message || "Agent created successfully");
            }

            setEditingId(null);

            setConfig({
                name: '',
                prompt: '',
                greeting: ''
            });

            fetchAgents();

            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);

        } catch (error: any) {

            console.error('Failed to save agent config', error);

            const message =
                error.response?.data?.message || "Failed to save agent";

            toast.error(message);

        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (agent: any) => {
        setEditingId(agent._id);

        setConfig({
            name: agent.name,
            prompt: agent.systemPrompt,
            greeting: agent.greeting
        });
    };

    const handleDelete = async (id: string) => {
        try {

            const res = await api.delete(`/agents/${id}`);

            toast.success(res.data?.message || "Agent deleted successfully");

            fetchAgents();

        } catch (error: any) {

            console.error("Failed to delete agent", error);

            const message =
                error.response?.data?.message || "Failed to delete agent";

            toast.error(message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animation-fade-in">
            <div className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight mb-3">Agent Configuration</h1>
                <p className="text-textMuted text-lg">
                    Define your agent's personality, behavior, and opening statement.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-panel p-8">

                    <form onSubmit={handleSave} className="space-y-6">

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-textMuted flex items-center gap-2">
                                <Bot className="w-4 h-4" /> Agent Name
                            </label>

                            <input
                                type="text"
                                value={config.name}
                                onChange={e => setConfig({ ...config, name: e.target.value })}
                                className="input-field font-medium text-lg text-white"
                                placeholder="e.g. Sales Representative"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-textMuted flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" /> First Message / Greeting
                            </label>

                            <input
                                type="text"
                                value={config.greeting}
                                onChange={e => setConfig({ ...config, greeting: e.target.value })}
                                className="input-field"
                                placeholder="What the agent says when picking up the phone..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-textMuted flex items-center gap-2">
                                <TerminalSquare className="w-4 h-4" /> System Prompt
                            </label>

                            <textarea
                                value={config.prompt}
                                onChange={e => setConfig({ ...config, prompt: e.target.value })}
                                className="input-field min-h-[200px] resize-y font-mono text-sm leading-relaxed"
                                placeholder="Define the behavior, rules, and persona..."
                                required
                            />
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-4">
                            {isSaved && (
                                <span className="text-accent text-sm font-medium">
                                    Configuration saved!
                                </span>
                            )}

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" /> Save Agent
                                    </>
                                )}
                            </button>
                        </div>

                    </form>

                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6 bg-primary/5 border-primary/20">

                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-primary">
                            <Bot className="w-5 h-5" /> Live Preview
                        </h3>

                        <p className="text-sm text-textMuted mb-4">
                            How your agent will feel to the caller.
                        </p>

                        <div className="bg-surfaceHighlight rounded-xl p-4 border border-white/5 space-y-4">

                            <div className="flex gap-3">

                                <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center shrink-0">
                                    <Bot className="w-4 h-4 text-primary" />
                                </div>

                                <div className="bg-surface rounded-2xl rounded-tl-none p-3 border border-white/5 text-sm">
                                    {config.greeting || "..."}
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4">Your Agents</h2>

                <div className="space-y-4">

                    {agents.map((agent: any) => (

                        <div key={agent._id} className="glass-panel p-4 flex justify-between items-center">

                            <div>
                                <h3 className="font-semibold text-lg">{agent.name}</h3>

                                <p className="text-sm text-textMuted">
                                    {agent.greeting}
                                </p>
                            </div>

                            <div className="flex gap-3">

                                <button
                                    onClick={() => handleEdit(agent)}
                                    className="btn-secondary"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(agent._id)}
                                    className="btn-danger"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>
            </div>
        </div>
    );
};

export default AgentConfig;