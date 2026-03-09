import { useState, useCallback, useEffect } from 'react';
import { UploadCloud, FileText, X, Trash2, Link as LinkIcon, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const KnowledgeBase = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const [kbs, setKbs] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // =========================
  // FETCH DATA
  // =========================
  const loadData = useCallback(async () => {
    try {
      const [kbRes, agentsRes] = await Promise.all([
        api.get("/agents/kb"),
        api.get("/agents")
      ]);
      setKbs(kbRes.data.kbs || []);
      setAgents(agentsRes.data.agents || []);
    } catch (err) {
      console.error("Failed to load Knowledge Base data", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // =========================
  // FILE HANDLING
  // =========================
  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }
    setFile(selectedFile);
    setUploadProgress(0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) validateAndSetFile(e.target.files[0]);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) validateAndSetFile(e.dataTransfer.files[0]);
  }, []);

  // =========================
  // API ACTIONS
  // =========================
  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/agents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (pe) => {
          setUploadProgress(Math.round((pe.loaded * 100) / (pe.total || 1)));
        },
      });
      toast.success("File uploaded successfully");
      loadData(); // Refresh list
    } catch {
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const attachKB = async (kbId: string) => {
    if (!selectedAgent) return toast.error("Please select an agent first");

    try {
      await api.post("/agents/attach-kb", { agentId: selectedAgent, kbId });
      toast.success("Attached to agent");
    } catch (err) {}
  };

  const deleteKB = async (kbId: string) => {
    if (!window.confirm("Delete this file permanently?")) return;
    try {
      await api.delete(`/agents/kb/${kbId}`);
      setKbs(prev => prev.filter(kb => kb._id !== kbId));
      toast.success("File deleted");
    } catch (err) {}
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto animation-fade-in p-4 sm:p-0">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-3 tracking-tight">Knowledge Base</h1>
        <p className="text-textMuted text-lg">Manage PDFs for your AI agents.</p>
      </header>

      {/* UPLOAD SECTION */}
      <div className={`glass-panel p-6 rounded-3xl mb-8 border-2 border-dashed transition-all duration-300
        ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-white/5"}`}
        onDragOver={handleDrag} onDragEnter={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center">
          {file ? (
            <div className="w-full space-y-4">
              <FileText className="mx-auto text-primary" size={48} />
              <div>
                <p className="font-semibold text-lg">{file.name}</p>
                <p className="text-sm text-textMuted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>

              {uploadProgress > 0 && (
                <div className="w-full max-w-xs mx-auto space-y-2">
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">
                    {uploadProgress < 100 ? `Uploading ${uploadProgress}%` : "Processing..."}
                  </p>
                </div>
              )}

              <div className="flex justify-center gap-3 pt-2">
                <button onClick={() => setFile(null)} className="btn-secondary px-6" disabled={isUploading}>
                  <X size={18} className="mr-2" /> Cancel
                </button>
                <button onClick={handleUpload} className="btn-primary px-8" disabled={isUploading || uploadProgress === 100}>
                  {isUploading ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                  {uploadProgress === 100 ? "Complete" : "Start Upload"}
                </button>
              </div>
            </div>
          ) : (
            <label className="cursor-pointer py-10 w-full group">
              <UploadCloud className="mx-auto mb-4 text-textMuted group-hover:text-primary transition-colors" size={56} />
              <p className="text-xl font-medium mb-1">Drop your PDF here</p>
              <p className="text-sm text-textMuted mb-6">Max file size: 10MB</p>
              <span className="btn-primary">Browse Files</span>
              <input type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
            </label>
          )}
        </div>
      </div>

      {/* KB LIST SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Your Documents</h2>
          <select 
            value={selectedAgent} 
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="bg-surfaceHighlight border border-white/10 rounded-lg p-2 text-sm focus:ring-2 ring-primary outline-none"
          >
            <option value="">Select Agent to Attach...</option>
            {agents.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
        </div>

        {kbs.length === 0 ? (
          <div className="text-center py-10 glass-panel opacity-60">No documents uploaded yet.</div>
        ) : (
          kbs.map((kb) => (
            <div key={kb._id} className="flex justify-between items-center p-4 bg-surfaceHighlight/50 hover:bg-surfaceHighlight rounded-2xl border border-white/5 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                  <FileText className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">{kb.fileName}</p>
                  <p className="text-xs text-textMuted">PDF Document</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => attachKB(kb._id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
                    ${selectedAgent ? "text-primary hover:bg-primary/10" : "text-white/20 cursor-not-allowed"}`}
                >
                  <LinkIcon size={16} /> Attach
                </button>
                <button 
                  onClick={() => deleteKB(kb._id)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;