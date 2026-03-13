import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Database, Bot, ArrowRight } from "lucide-react";
import api from "../api/axios";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [kbList, setKbList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const userRes = await api.get("/users/me");
      const agentsRes = await api.get("/agents");
      const kbRes = await api.get("/agents/kb");
      // console.log("KB RESPONSE:", kbRes.data);

      setUser(userRes.data.user);
      setAgents(agentsRes.data.agents || []);
      setKbList(kbRes.data.kbs || []);
    } catch (error) {
      console.error("Failed loading dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animation-fade-in px-4 py-6 space-y-8">

      {/* Greeting */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold">
          Hello {user?.name || "User"} 👋
        </h1>

        <p className="text-textMuted mt-2">
          Welcome back. Manage your AI voice agents and knowledge bases here.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        {/* Twilio Status */}
        <div className="glass-panel p-6 flex flex-col gap-4">

          <Phone className="w-6 h-6 text-accent" />

          <h3 className="text-lg font-semibold">
            Twilio Connection
          </h3>

          {user?.twilio?.phoneNumber ? (
            <div className="text-sm text-textMuted">
              <p>Connected Number</p>
              <p className="text-white font-semibold mt-1">
                {user.twilio.phoneNumber}
              </p>
            </div>
          ) : (
            <button
              onClick={() => navigate("/twilio")}
              className="btn-primary w-fit flex items-center gap-2"
            >
              Configure
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Knowledge Base Count */}
        <div className="glass-panel p-6 flex flex-col gap-4">

          <Database className="w-6 h-6 text-accent" />

          <h3 className="text-lg font-semibold">
            Knowledge Bases
          </h3>

          <p className="text-3xl font-bold">
            {kbList.length}
          </p>

          <p className="text-xs text-textMuted">
            PDFs used by agents
          </p>

        </div>

        {/* Agent Count */}
        <div className="glass-panel p-6 flex flex-col gap-4">

          <Bot className="w-6 h-6 text-accent" />

          <h3 className="text-lg font-semibold">
            Agents
          </h3>

          <p className="text-3xl font-bold">
            {agents.length}
          </p>

          <p className="text-xs text-textMuted">
            AI voice agents created
          </p>

        </div>

      </div>

      {/* Agent List */}
      <div className="glass-panel p-6">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">
            Your Agents
          </h2>

          <button
            onClick={() => navigate("/agents")}
            className="text-accent text-sm hover:underline"
          >
            Manage Agents
          </button>
        </div>

        {agents.length === 0 ? (
          <p className="text-textMuted text-sm">
            No agents created yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {agents.map((agent) => (
              <div
                key={agent._id}
                className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
              >
                <h3 className="font-semibold">
                  {agent.name}
                </h3>

                <p className="text-xs text-textMuted mt-1">
                  {agent.description || "AI voice assistant"}
                </p>
              </div>
            ))}

          </div>
        )}

      </div>

      {/* Knowledge Base Section */}
      <div className="glass-panel p-6">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">
            Knowledge Base Files
          </h2>

          <button
            onClick={() => navigate("/knowledge")}
            className="text-accent text-sm hover:underline"
          >
            Manage KB
          </button>
        </div>

        {kbList.length === 0 ? (
          <p className="text-textMuted text-sm">
            No PDFs uploaded yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">

            {kbList.slice(0, 6).map((kb) => (
              <div
                key={kb._id}
                className="px-3 py-2 text-sm rounded-md bg-white/5 border border-white/10"
              >
                {kb.fileName || "Document"}
              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default Dashboard;