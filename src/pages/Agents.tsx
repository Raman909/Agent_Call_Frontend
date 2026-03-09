import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

interface KB {
  _id: string;
  fileName: string;
}

interface Agent {
  _id: string;
  name: string;
  knowledgeBase: KB[];
}

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);

  const fetchAgents = async () => {
    const res = await api.get("/agents");
    setAgents(res.data.agents);
  };

  const removeKB = async (agentId: string, kbId: string) => {
    try {
      await api.post("/agents/remove-kb", { agentId, kbId });

      toast.success("KB removed");

      fetchAgents();
    } catch {
      toast.error("Failed to remove KB");
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Agents</h1>

      <div className="space-y-6">
        {agents.map((agent) => (
          <div
            key={agent._id}
            className="glass-panel p-5"
          >
            <h2 className="text-lg font-semibold">{agent.name}</h2>

            <div className="mt-3 space-y-2">
              {agent.knowledgeBase.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No KB attached
                </p>
              ) : (
                agent.knowledgeBase.map((kb) => (
                  <div
                    key={kb._id}
                    className="flex justify-between items-center bg-black/30 p-2 rounded"
                  >
                    <span>{kb.fileName}</span>

                    <button
                      onClick={() =>
                        removeKB(agent._id, kb._id)
                      }
                      className="bg-red-500 px-3 py-1 rounded text-white"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}