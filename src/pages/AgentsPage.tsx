import { useState, useEffect } from "react";
import { Bot, BookOpen, Edit, Trash2, Minus } from "lucide-react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

interface KnowledgeBase {
  _id: string;
  fileName: string;
}

interface Agent {
  _id: string;
  name: string;
  systemPrompt: string;
  greeting: string;
  knowledgeBase: KnowledgeBase[];
  createdAt: string;
}

const AgentsPage = () => {

  const [agents, setAgents] = useState<Agent[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrompt, setEditPrompt] = useState("");
  const [editGreeting, setEditGreeting] = useState("");

  useEffect(() => {
    fetchAgents();
    fetchKB();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await api.get("/agents");
      setAgents(res.data.agents || []);
    } catch {
      toast.error("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  const fetchKB = async () => {
    try {
      const res = await api.get("/agents/kb");
      setKnowledgeBases(res.data.kbs || []);
    } catch {
      console.error("KB load failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this agent?")) return;

    try {
      await api.delete(`/agents/${id}`);
      // toast.success("Agent deleted");
      fetchAgents();
    } catch {
      // toast.error("Delete failed");
    }
  };

  const attachKB = async (agentId: string, kbId: string) => {
    try {
      await api.post("/agents/attach-kb", { agentId, kbId });
      // toast.success("Knowledge base attached");
      fetchAgents();
    } catch {
      // toast.error("Attach failed");
    }
  };

  const detachKB = async (agentId: string, kbId: string) => {
    try {
      await api.delete(`/agents/${agentId}/kb/${kbId}`);
      // toast.success("Detached");
      fetchAgents();
    } catch {
      // toast.error("Detach failed");
    }
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setEditName(agent.name);
    setEditPrompt(agent.systemPrompt);
    setEditGreeting(agent.greeting);
  };

  const updateAgent = async () => {
    if (!editingAgent) return;

    try {
      await api.put(`/agents/${editingAgent._id}`, {
        name: editName,
        systemPrompt: editPrompt,
        greeting: editGreeting
      });

      // toast.success("Agent updated");

      setEditingAgent(null);

      fetchAgents();
    } catch {
      // toast.error("Update failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          AI Agents
        </h1>

        <p className="text-textMuted text-sm sm:text-base">
          Manage your AI agents and their knowledge bases
        </p>
      </div>

      {/* GRID */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">

        {agents.map((agent) => (

          <div
            key={agent._id}
            className="glass-panel flex flex-col justify-between p-5 rounded-xl border border-white/10 hover:border-primary/40 transition-all duration-200 h-full"
          >

            {/* HEADER */}
            <div className="flex justify-between items-start mb-4">

              <div className="flex items-center gap-3 min-w-0">

                <div className="bg-primary/20 p-2 rounded-lg shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-lg truncate">
                    {agent.name}
                  </h3>

                  <p className="text-xs text-textMuted">
                    Created {new Date(agent.createdAt).toLocaleDateString()}
                  </p>
                </div>

              </div>

              <div className="flex gap-1 shrink-0">

                <button
                  onClick={() => handleEdit(agent)}
                  className="p-2 rounded-lg hover:bg-white/10 transition"
                >
                  <Edit className="w-4 h-4 text-textMuted" />
                </button>

                <button
                  onClick={() => handleDelete(agent._id)}
                  className="p-2 rounded-lg hover:bg-red-500/20 transition"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>

              </div>

            </div>

            {/* SYSTEM PROMPT */}
            <div className="mb-4">

              <h4 className="text-xs font-semibold uppercase tracking-wide text-textMuted mb-1">
                System Prompt
              </h4>

              <p className="text-sm text-white/80 break-words line-clamp-3">
                {agent.systemPrompt}
              </p>

            </div>

            {/* GREETING */}
            <div className="mb-4">

              <h4 className="text-xs font-semibold uppercase tracking-wide text-textMuted mb-1">
                Greeting
              </h4>

              <p className="text-sm italic text-white/80 break-words line-clamp-2">
                "{agent.greeting}"
              </p>

            </div>

            {/* KNOWLEDGE BASE */}
            <div className="mt-auto">

              <h4 className="text-xs font-semibold uppercase tracking-wide text-textMuted mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Knowledge Bases ({agent.knowledgeBase.length})
              </h4>

              {agent.knowledgeBase.length > 0 ? (

                <div className="space-y-2 mb-3">

                  {agent.knowledgeBase.map((kb) => (

                    <div
                      key={kb._id}
                      className="flex items-center justify-between bg-surfaceHighlight rounded-md px-3 py-2 text-sm"
                    >

                      <span className="truncate max-w-[85%]">
                        {kb.fileName}
                      </span>

                      <button
                        onClick={() => detachKB(agent._id, kb._id)}
                        className="text-red-400 hover:text-red-300 transition shrink-0"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                    </div>

                  ))}

                </div>

              ) : (

                <p className="text-xs text-textMuted mb-3">
                  No knowledge bases attached
                </p>

              )}

              <select
                className="input-field text-sm w-full"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) {
                    attachKB(agent._id, e.target.value);
                    e.target.value = "";
                  }
                }}
              >

                <option value="" disabled>
                  Attach Knowledge Base
                </option>

                {knowledgeBases
                  .filter(
                    (kb) =>
                      !agent.knowledgeBase.some((a) => a._id === kb._id)
                  )
                  .map((kb) => (

                    <option key={kb._id} value={kb._id}>
                      {kb.fileName}
                    </option>

                  ))}

              </select>

            </div>

          </div>

        ))}

      </div>

      {/* EDIT MODAL */}
      {editingAgent && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-surface p-6 rounded-xl w-full max-w-lg">

            <h2 className="text-xl font-semibold mb-4">
              Edit Agent
            </h2>

            <input
              className="input-field w-full mb-3"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Agent Name"
            />

            <textarea
              className="input-field w-full mb-3"
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              placeholder="System Prompt"
            />

            <textarea
              className="input-field w-full mb-4"
              value={editGreeting}
              onChange={(e) => setEditGreeting(e.target.value)}
              placeholder="Greeting"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setEditingAgent(null)}
                className="px-4 py-2 rounded bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={updateAgent}
                className="px-4 py-2 rounded bg-primary"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AgentsPage;