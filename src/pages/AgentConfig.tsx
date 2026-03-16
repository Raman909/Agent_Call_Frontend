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

const STORAGE_KEY = "agent_config_draft";

const AgentConfig = () => {
  const [config, setConfig] = useState<Config>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  /* LOAD DRAFT WHEN PAGE OPENS */
  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);

    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setConfig(parsed);
      } catch {
        console.warn("Draft corrupted");
      }
    }
  }, []);

  /* FETCH AGENTS */
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

  /* HANDLE INPUT CHANGE + SAVE DRAFT */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const updated = { ...config, [name]: value };

    setConfig(updated);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  /* RESET FORM */
  const handleReset = () => {
    setEditingId(null);
    setConfig(INITIAL_STATE);
    localStorage.removeItem(STORAGE_KEY);
  };

  /* SAVE AGENT */
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
        // toast.success("Agent updated");
      } else {
        await api.post("/agents", payload);
        // toast.success("Agent created");
      }

      localStorage.removeItem(STORAGE_KEY);
      handleReset();
      fetchAgents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Save failed");
    } finally {
      setIsLoading(false);
    }
  };

  /* DELETE AGENT */
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
    <div className="max-w-5xl mx-auto px-4 py-6">

      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {editingId ? "Edit Agent" : "Agent Configuration"}
        </h1>

        <p className="text-textMuted">
          Define your agent's personality and behavior.
        </p>

        <p className="text-xs text-textMuted mt-1">
          Draft auto-saved
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* FORM */}
        <div className="lg:col-span-2 glass-panel p-6">

          <form onSubmit={handleSave} className="space-y-5">

            {/* NAME */}
            <div>
              <label className="label-style flex gap-2">
                <Bot size={16}/> Agent Name
              </label>

              <input
                name="name"
                value={config.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Sales Representative"
                required
              />
            </div>

            {/* GREETING */}
            <div>
              <label className="label-style flex gap-2">
                <MessageSquare size={16}/> Greeting
              </label>

              <input
                name="greeting"
                value={config.greeting}
                onChange={handleChange}
                className="input-field"
                placeholder="Hello! How can I help?"
              />
            </div>

            {/* PROMPT */}
            <div>
              <label className="label-style flex gap-2">
                <TerminalSquare size={16}/> System Prompt
              </label>

              <textarea
                name="prompt"
                value={config.prompt}
                onChange={handleChange}
                className="input-field min-h-[160px]"
                placeholder="Describe rules and persona..."
              />
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3">

              {/* RESET BUTTON ALWAYS */}
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition flex items-center gap-1"
              >
                Reset
              </button>

              {/* CANCEL ONLY IN EDIT MODE */}
              {editingId && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-secondary flex gap-1"
                >
                  <X size={16}/> Cancel
                </button>
              )}

              {/* SAVE BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex gap-2"
              >
                <Save size={16}/>
                {editingId ? "Update" : "Save"} Agent
              </button>

            </div>

          </form>

        </div>

        {/* LIVE PREVIEW */}
        <div className="glass-panel p-6 bg-primary/5">

          <h3 className="font-semibold mb-4 flex gap-2">
            <Bot size={18}/> Live Preview
          </h3>

          <div className="bg-surfaceHighlight p-4 rounded-xl text-sm">

            {config.greeting
              ? config.greeting
              : "Type greeting to preview..."}

          </div>

        </div>

      </div>

      {/* AGENTS LIST */}
      <section className="mt-10">

        <h2 className="text-xl font-bold mb-4">
          Your Agents ({agents.length})
        </h2>

        <div className="space-y-3">

          {agents.map((agent) => (

            <div
              key={agent._id}
              className="glass-panel p-4 flex justify-between items-center"
            >

              <div>
                <h3 className="font-semibold">
                  {agent.name}
                </h3>

                <p className="text-sm text-textMuted">
                  {agent.greeting}
                </p>
              </div>

              <div className="flex gap-2">

                <button
                  onClick={() => {
                    setEditingId(agent._id);

                    const editConfig = {
                      name: agent.name,
                      prompt: agent.systemPrompt,
                      greeting: agent.greeting,
                    };

                    setConfig(editConfig);

                    localStorage.setItem(
                      STORAGE_KEY,
                      JSON.stringify(editConfig)
                    );
                  }}
                  className="p-2 hover:bg-white/10 rounded"
                >
                  <Edit2 size={16}/>
                </button>

                <button
                  onClick={() => handleDelete(agent._id)}
                  className="p-2 hover:bg-red-500/20 rounded"
                >
                  <Trash2 size={16}/>
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
};

export default AgentConfig;