import { useEffect, useState } from "react";
import { startOutboundCall } from "../api/outbound";
import { fetchAgents } from "../api/agents";

export default function OutboundCall() {
  const [phone, setPhone] = useState("");
  const [agentId, setAgentId] = useState("");
  const [agents, setAgents] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await fetchAgents();
      setAgents(data);
    };
    load();
  }, []);

  const handleCall = async () => {
    if (!phone || !agentId) {
      setStatus("Please enter phone and select agent");
      return;
    }

    try {
      setLoading(true);
      await startOutboundCall({ phoneNumber: phone, agentId });
      setStatus("Call started");
    } catch {
      setStatus("Call failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center px-4 pt-10">
      <div className="glass-panel w-full max-w-lg p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">Outbound Call</h2>

        <div className="mb-4">
          <label className="text-sm text-gray-400">Select Agent</label>

          <select
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            className="input-field w-full"
          >
            <option value="">Select agent</option>

            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-400">Phone Number</label>

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+14155550123"
            className="input-field w-full"
          />
        </div>

        <button
          onClick={handleCall}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "Calling..." : "Start Call"}
        </button>

        {status && (
          <p className="text-gray-300 text-sm mt-4">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}