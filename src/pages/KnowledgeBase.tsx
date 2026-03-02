import { useState, useCallback, useEffect } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import api from '../api/axios';

const KnowledgeBase = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [kbs, setKbs] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("");

// =========================
// ✅ FETCH DATA (FIXED)
// =========================
useEffect(() => {
  const loadData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("⛔ No token found, skipping API calls");
      return;
    }

    try {
      await Promise.all([fetchKB(), fetchAgents()]);
    } catch (err) {
      console.log("⚠️ Initial fetch failed, retrying...");
      setTimeout(loadData, 500); // retry once
    }
  };

  loadData();
}, []);

// =========================
// ✅ FETCH KB
// =========================
const fetchKB = async () => {
  try {
    const res = await api.get("/agents/kb");

    console.log("✅ KB RESPONSE:", res.data);

    setKbs(res.data.kbs || []);
  } catch (err: any) {
    console.error(
      "❌ KB ERROR:",
      err.response?.data || err.message
    );
  }
};

// =========================
// ✅ FETCH AGENTS
// =========================
const fetchAgents = async () => {
  try {
    const res = await api.get("/agents");

    console.log("✅ AGENTS RESPONSE:", res.data);

    setAgents(res.data.agents || []);
  } catch (err: any) {
    console.error(
      "❌ AGENTS ERROR:",
      err.response?.data || err.message
    );
  }
};

// =========================
// ✅ FILE HANDLING (IMPROVED)
// =========================
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const selectedFile = e.target.files[0];

    if (selectedFile.type !== "application/pdf") {
      alert("Only PDF files are allowed ❌");
      return;
    }

    setFile(selectedFile);
  }
};

const handleDragOver = useCallback((e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(true);
}, []);

const handleDragLeave = useCallback((e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(false);
}, []);

const handleDrop = useCallback((e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(false);

  const droppedFile = e.dataTransfer.files[0];

  if (!droppedFile) return;

  if (droppedFile.type !== "application/pdf") {
    alert("Only PDF files are allowed ❌");
    return;
  }

  setFile(droppedFile);
}, []);

  // =========================
  // ✅ UPLOAD
  // =========================
  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/agents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message || "Uploaded successfully");

      setFile(null);
      fetchKB(); // refresh list
    } catch (err: any) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // =========================
  // ✅ ATTACH KB
  // =========================
  const attachKB = async (kbId: string) => {
    if (!selectedAgent) {
      alert("Select an agent first");
      return;
    }

    try {
      await api.post("/agents/attach-kb", {
        agentId: selectedAgent,
        kbId,
      });

      alert("Attached successfully ✅");
    } catch (err: any) {
      alert(err.response?.data?.message || "Attach failed");
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="max-w-4xl mx-auto animation-fade-in">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3">Knowledge Base</h1>
        <p className="text-textMuted">
          Upload PDFs and attach them to your AI agent.
        </p>
      </div>

      {/* UPLOAD BOX */}
      <div className="glass-panel p-1 rounded-3xl mb-8">
        <div
          className={`border-2 border-dashed rounded-2xl p-10 text-center
          ${isDragging ? "border-primary bg-primary/10" : "border-white/10"}
        `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <>
              <FileText className="mx-auto mb-3 text-primary" size={40} />
              <p className="font-semibold">{file.name}</p>
              <p className="text-sm text-textMuted mb-4">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setFile(null)}
                  className="btn-secondary"
                >
                  Remove
                </button>

                <button
                  onClick={handleUpload}
                  className="btn-primary"
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </>
          ) : (
            <>
              <UploadCloud className="mx-auto mb-4 text-textMuted" size={40} />
              <p className="mb-2">Drag & drop PDF here</p>
              <p className="text-sm text-textMuted mb-4">
                or click below
              </p>

              <label className="btn-primary cursor-pointer">
                Browse File
                <input
                  type="file"
                  className="hidden"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </label>
            </>
          )}
        </div>
      </div>

      {/* AGENT SELECT */}
      <div className="mb-8">
        <label className="block mb-2 text-sm text-textMuted">
          Select Agent
        </label>

        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="w-full p-3 rounded-xl bg-surfaceHighlight border border-white/10 text-white"
        >
          <option value="">Select an agent</option>
          {agents.map((agent) => (
            <option key={agent._id} value={agent._id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>

      {/* KB LIST */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Your Knowledge Bases
        </h2>

        {kbs.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
            <p className="text-textMuted">No KB uploaded yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {kbs.map((kb) => (
              <div
                key={kb._id}
                className="p-4 rounded-xl bg-surfaceHighlight border border-white/10 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-primary" size={18} />
                  <div>
                    <p className="font-medium">{kb.fileName}</p>
                    <p className="text-xs text-textMuted">
                      {new Date(kb.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => attachKB(kb._id)}
                  className="text-green-400 text-sm hover:underline"
                >
                  Attach
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;