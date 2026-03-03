import { useState, useCallback, useEffect } from 'react';
import { UploadCloud, FileText, X, Trash2 } from 'lucide-react';
import api from '../api/axios';

const KnowledgeBase = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const [kbs, setKbs] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("");

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        await Promise.all([fetchKB(), fetchAgents()]);
      } catch {
        setTimeout(loadData, 500);
      }
    };

    loadData();
  }, []);

  const fetchKB = async () => {
    try {
      const res = await api.get("/agents/kb");
      setKbs(res.data.kbs || []);
    } catch (err: any) {
      console.error(err.response?.data || err.message);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await api.get("/agents");
      setAgents(res.data.agents || []);
    } catch (err: any) {
      console.error(err.response?.data || err.message);
    }
  };

  // =========================
  // FILE HANDLING
  // =========================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Only PDF files allowed");
      return;
    }

    setFile(selectedFile);
    setUploadProgress(0);
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
      alert("Only PDF files allowed");
      return;
    }

    setFile(droppedFile);
    setUploadProgress(0);
  }, []);

  // =========================
  // UPLOAD WITH PROGRESS
  // =========================
  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/agents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percent);
        },
      });

      if (res.data.message) {
        setUploadProgress(100);
        fetchKB();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Upload failed");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  // =========================
  // ATTACH KB
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
  // DELETE KB
  // =========================
  const deleteKB = async (kbId: string) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await api.delete(`/agents/kb/${kbId}`);
      // Refresh the list after deletion
      setKbs(prev => prev.filter(kb => kb._id !== kbId));
      alert("Deleted successfully");
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed");
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

      {/* UPLOAD */}
      <div className="glass-panel p-1 rounded-3xl mb-8">
        <div
          className={`border-2 border-dashed rounded-2xl p-10 text-center
          ${isDragging ? "border-primary bg-primary/10" : "border-white/10"}`}
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

              {/* Progress */}
              {(isUploading || uploadProgress === 100) && (
                <div className="w-full mb-4">
                  <div className="w-full bg-white/10 h-2 rounded-full">
                    <div
                      className="bg-primary h-2"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm mt-2">
                    {isUploading
                      ? `Uploading... ${uploadProgress}%`
                      : "Upload Complete ✅"}
                  </p>
                </div>
              )}

              <div className="flex justify-center gap-3">
                <button onClick={handleRemove} className="btn-secondary">
                  <X className="w-4 h-4" /> Remove
                </button>

                <button
                  onClick={handleUpload}
                  className="btn-primary"
                  disabled={isUploading || uploadProgress === 100}
                >
                  {isUploading
                    ? "Uploading..."
                    : uploadProgress === 100
                      ? "Uploaded"
                      : "Upload"}
                </button>
              </div>
            </>
          ) : (
            <>
              <UploadCloud className="mx-auto mb-4 text-textMuted" size={40} />
              <p className="mb-2">Drag & drop PDF here</p>
              <p className="text-sm text-textMuted mb-4">or click below</p>

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
      <select
        value={selectedAgent}
        onChange={(e) => setSelectedAgent(e.target.value)}
        className="w-full p-3 mb-6 rounded-xl bg-surfaceHighlight"
      >
        <option value="">Select Agent</option>
        {agents.map((a) => (
          <option key={a._id} value={a._id}>
            {a.name}
          </option>
        ))}
      </select>

      {/* KB LIST */}
      {/* KB LIST */}
      <div className="grid gap-4">
        {kbs.map((kb) => (
          <div key={kb._id} className="flex justify-between items-center p-4 bg-surfaceHighlight rounded-xl border border-white/5">
            <div className="flex items-center gap-3">
              <FileText className="text-textMuted w-4 h-4" />
              <span className="font-medium">{kb.fileName}</span>
            </div>

            <div className="flex gap-4 items-center">
              <button
                onClick={() => attachKB(kb._id)}
                className="text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
              >
                Attach
              </button>

              <button
                onClick={() => deleteKB(kb._id)}
                className="text-sm font-semibold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeBase;