import { useEffect, useState } from "react";
import { startOutboundCall } from "../api/outbound";
import { fetchAgents } from "../api/agents";
import { Agent } from "../types/agent";

export default function OutboundCall() {

  const [phone, setPhone] = useState("");
  const [agentId, setAgentId] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [room, setRoom] = useState("");

  // Load agents
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAgents();
        setAgents(data);
      } catch (err) {
        console.error(err);
      }
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
      setStatus("Calling...");

      const res = await startOutboundCall({
        phoneNumber: phone,
        agentId
      });

      setRoom(res.roomName);
      setStatus("Call started successfully");

    } catch (err) {
      setStatus("Call failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center pt-10">

      <div className="glass-panel p-8 w-full max-w-xl">

        <h2 className="text-2xl font-bold text-white mb-6">
          Outbound Call
        </h2>

        {/* Agent Select */}
        <div className="mb-4">

          <label className="text-gray-400 text-sm">
            Select Agent
          </label>

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

        {/* Phone Input */}
        <div className="mb-4">

          <label className="text-gray-400 text-sm">
            Phone Number
          </label>

          <input
            type="text"
            placeholder="+14155550123"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field w-full"
          />

        </div>

        {/* Call Button */}
        <button
          onClick={handleCall}
          disabled={loading}
          className="btn-primary w-full"
        >

          {loading ? "Calling..." : "Start Call"}

        </button>

        {/* Status */}
        <div className="mt-6">

          <p className="text-gray-300">
            {status}
          </p>

          {room && (
            <p className="text-xs text-gray-500 mt-2">
              Room: {room}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}