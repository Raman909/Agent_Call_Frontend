import { useState, useEffect, useCallback } from "react";
import {
  Save,
  Bot,
  MessageSquare,
  TerminalSquare,
  Trash2,
  Edit2,
  X,
} from "lucide-react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

interface Config {
  name: string;
  prompt: string;
  greeting: string;
}

const INITIAL_STATE: Config = {
  name: "",
  prompt: "",
  greeting: "",
};

const AgentConfig = () => {
  const [config, setConfig] = useState<Config>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    try {
      const { data } = await api.get("/agents");
      setAgents(data?.agents ?? []);
    } catch {
      toast.error("Failed to load agents");
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
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
      greeting: config.greeting,
    };

    try {
      if (editingId) {
        await api.put(`/agents/${editingId}`, payload);
        toast.success("Agent updated");
      } else {
        await api.post("/agents", payload);
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
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 animation-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          {editingId ? "Edit Agent" : "Agent Configuration"}
        </h1>
        <p className="text-textMuted">
          Define your agent's personality and behavior.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORM */}
        <div className="lg:col-span-2 glass-panel p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="label-style">
                <Bot className="w-4 h-4" /> Agent Name
              </label>
              <input
                name="name"
                value={config.name}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. Sales Representative"
                required
              />
            </div>

            <div>
              <label className="label-style">
                <MessageSquare className="w-4 h-4" /> Greeting
              </label>
              <input
                name="greeting"
                value={config.greeting}
                onChange={handleChange}
                className="input-field"
                placeholder="Hello! How can I help?"
              />
            </div>

            <div>
              <label className="label-style">
                <TerminalSquare className="w-4 h-4" /> System Prompt
              </label>
              <textarea
                name="prompt"
                value={config.prompt}
                onChange={handleChange}
                className="input-field min-h-[160px]"
                placeholder="Describe rules and persona..."
              />
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-secondary"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editingId ? "Update" : "Save"} Agent
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* PREVIEW */}
        <aside className="glass-panel p-4 sm:p-6 bg-primary/5">
          <h3 className="text-lg font-semibold mb-4 flex gap-2">
            <Bot className="w-5 h-5" /> Live Preview
          </h3>

          <div className="bg-surfaceHighlight p-4 rounded-xl">
            {config.greeting || (
              <span className="italic text-sm opacity-60">
                Type greeting to preview...
              </span>
            )}
            <p className="text-sm">{config.greeting}</p>
          </div>
        </aside>
      </div>

      {/* AGENT LIST */}
      <section className="mt-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          Your Agents ({agents.length})
        </h2>

        <div className="space-y-3">
          {agents.map((agent) => (
            <div
              key={agent._id}
              className="glass-panel p-4 flex flex-col sm:flex-row justify-between gap-3"
            >
              <div>
                <h3 className="font-semibold">{agent.name}</h3>
                <p className="text-sm text-textMuted">{agent.greeting}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(agent._id);
                    setConfig({
                      name: agent.name,
                      prompt: agent.systemPrompt,
                      greeting: agent.greeting,
                    });
                  }}
                  className="p-2 hover:bg-white/10 rounded"
                >
                  <Edit2 size={16} />
                </button>

                <button
                  onClick={() => handleDelete(agent._id)}
                  className="p-2 hover:bg-red-500/20 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const Spinner = () => (
  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
);

export default AgentConfig;