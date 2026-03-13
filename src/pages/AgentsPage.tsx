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
      toast.success("Agent deleted");
      fetchAgents();
    } catch {
      toast.error("Delete failed");
    }
  };

  const attachKB = async (agentId: string, kbId: string) => {
    try {
      await api.post("/agents/attach-kb", { agentId, kbId });
      toast.success("Knowledge base attached");
      fetchAgents();
    } catch {
      toast.error("Attach failed");
    }
  };

  const detachKB = async (agentId: string, kbId: string) => {
    try {
      await api.delete(`/agents/${agentId}/kb/${kbId}`);
      toast.success("Detached");
      fetchAgents();
    } catch {
      toast.error("Detach failed");
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

                <button className="p-2 rounded-lg hover:bg-white/10 transition">
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

              {/* ATTACH DROPDOWN */}
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

      {/* EMPTY STATE */}
      {agents.length === 0 && (

        <div className="text-center py-20">

          <Bot className="w-16 h-16 mx-auto mb-4 text-textMuted" />

          <h3 className="text-lg font-semibold mb-2">
            No agents yet
          </h3>

          <p className="text-textMuted text-sm">
            Create your first AI agent to get started.
          </p>

        </div>

      )}

    </div>
  );
};

export default AgentsPage;