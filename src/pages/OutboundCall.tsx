import { useEffect, useState } from "react";
import { Phone, RotateCcw } from "lucide-react";
import { startOutboundCall } from "../api/outbound";
import { fetchAgents } from "../api/agents";

const STORAGE_KEY = "outboundCallDraft";

export default function OutboundCall() {

  const [phone, setPhone] = useState("");
  const [agentId, setAgentId] = useState("");
  const [agents, setAgents] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  /* LOAD AGENTS */
  useEffect(() => {
    const load = async () => {
      const data = await fetchAgents();
      setAgents(data || []);
    };
    load();
  }, []);

  /* LOAD DRAFT */
  useEffect(() => {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {

        const draft = JSON.parse(saved);

        setPhone(draft.phone || "");
        setAgentId(draft.agentId || "");

      } catch {
        console.warn("Draft corrupted");
      }
    }

  }, []);

  /* SAVE DRAFT */
  const saveDraft = (newPhone: string, newAgent: string) => {

    const draft = {
      phone: newPhone,
      agentId: newAgent
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));

  };

  /* PHONE CHANGE */
  const handlePhoneChange = (value: string) => {
    setPhone(value);
    saveDraft(value, agentId);
  };

  /* AGENT CHANGE */
  const handleAgentChange = (value: string) => {
    setAgentId(value);
    saveDraft(phone, value);
  };

  /* RESET */
  const handleReset = () => {

    setPhone("");
    setAgentId("");
    setStatus("");

    localStorage.removeItem(STORAGE_KEY);

  };

  /* START CALL */
  const handleCall = async () => {

    if (!phone || !agentId) {
      setStatus("Please enter phone and select agent");
      return;
    }

    try {

      setLoading(true);

      await startOutboundCall({
        phoneNumber: phone,
        agentId
      });

      setStatus("Call started");

      localStorage.removeItem(STORAGE_KEY);

    } catch {

      setStatus("Call failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex justify-center px-4 pt-10">

      <div className="glass-panel w-full max-w-lg p-4 sm:p-6 lg:p-8">

        <h2 className="text-xl sm:text-2xl font-bold mb-6">
          Outbound Call
        </h2>

        <p className="text-xs text-textMuted mb-4">
          Draft auto-saved
        </p>

        {/* AGENT */}
        <div className="mb-4">

          <label className="text-sm text-gray-400">
            Select Agent
          </label>

          <select
            value={agentId}
            onChange={(e) => handleAgentChange(e.target.value)}
            className="input-field w-full"
          >

            <option value="">
              Select agent
            </option>

            {agents.map((agent) => (

              <option
                key={agent._id}
                value={agent._id}
              >
                {agent.name}
              </option>

            ))}

          </select>

        </div>

        {/* PHONE */}
        <div className="mb-6">

          <label className="text-sm text-gray-400">
            Phone Number
          </label>

          <input
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="+14155550123"
            className="input-field w-full"
          />

        </div>

        {/* BUTTONS */}
        <div className="flex flex-col gap-3">

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4"/>
            Reset
          </button>

          <button
            onClick={handleCall}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >

            <Phone className="w-4 h-4"/>

            {loading ? "Calling..." : "Start Call"}

          </button>

        </div>

        {status && (

          <p className="text-gray-300 text-sm mt-4">
            {status}
          </p>

        )}

      </div>

    </div>

  );

}