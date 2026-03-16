import { useEffect, useState } from "react";
import { UploadCloud, FileText, Trash2 } from "lucide-react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

interface KB {
  _id: string;
  fileName: string;
}

export default function KnowledgeBase() {

  const [files, setFiles] = useState<KB[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [agentId, setAgentId] = useState("");

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchFiles = async () => {
    try {
      const res = await api.get("/agents/kb");
      setFiles(res.data.kbs || []);
    } catch {
      toast.error("Failed to load files");
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await api.get("/agents");
      setAgents(res.data.agents || []);
    } catch {
      console.error("Failed to load agents");
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchAgents();
  }, []);

  const handleUpload = async (file: File) => {
    try {

      setUploading(true);
      setProgress(0);

      const form = new FormData();
      form.append("file", file);
      form.append("agentId", agentId);

      await api.post("/agents/upload", form, {

        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress: (event) => {

          const percent = Math.round(
            (event.loaded * 100) / (event.total || 1)
          );

          setProgress(percent);

        },
      });

      // toast.success("File uploaded");
      fetchFiles();

    } catch {
      // toast.error("Upload failed");
    }

    setUploading(false);
    setProgress(0);

  };

  const deleteKB = async (id: string) => {

    if (!confirm("Delete this knowledge base?")) return;

    try {

      await api.delete(`/agents/kb/${id}`);
      // toast.success("Knowledge base deleted");
      fetchFiles();

    } catch {

      // toast.error("Delete failed");

    }

  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    handleUpload(e.target.files[0]);
  };

  return (

    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
          Knowledge Base
        </h1>

        <p className="text-textMuted text-sm sm:text-base">
          Upload PDFs and attach them to your AI agent.
        </p>

      </div>

      {/* UPLOAD BOX */}

      <div className="glass-panel p-4 sm:p-6 mb-6">

        <div className="border-2 border-dashed border-white/10 rounded-xl p-6 sm:p-10 flex flex-col items-center text-center">

          <UploadCloud className="w-10 h-10 mb-3 opacity-70" />

          <p className="font-medium mb-1">
            Drag & drop PDF here
          </p>

          <p className="text-sm text-textMuted mb-4">
            or click below
          </p>

          <label
            className={`btn-primary cursor-pointer ${
              uploading && "opacity-50 cursor-not-allowed"
            }`}
          >

            {uploading ? `Uploading ${progress}%` : "Browse File"}

            <input
              type="file"
              accept=".pdf"
              onChange={handleFile}
              hidden
              disabled={uploading}
            />

          </label>

          {/* PROGRESS BAR */}

          {uploading && (

            <div className="w-full mt-4">

              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">

                <div
                  className="bg-primary h-2 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />

              </div>

              <p className="text-xs text-textMuted mt-2">
                Uploading file... {progress}%
              </p>

            </div>

          )}

        </div>

      </div>

      {/* AGENT SELECT */}

      <div className="mb-6">

        <select
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          className="input-field w-full"
        >

          <option value="">
            Select Agent
          </option>

          {agents.map((agent) => (

            <option key={agent._id} value={agent._id}>
              {agent.name}
            </option>

          ))}

        </select>

      </div>

      {/* FILE LIST */}

      <div className="space-y-3">

        {files.map((file) => (

          <div
            key={file._id}
            className="glass-panel p-3 sm:p-4 flex items-center justify-between gap-3"
          >

            {/* LEFT SIDE */}

            <div className="flex items-center gap-3 min-w-0">

              <FileText className="w-5 h-5 text-primary shrink-0" />

              <p className="text-sm sm:text-base truncate">
                {file.fileName}
              </p>

            </div>

            {/* DELETE BUTTON */}

            <button
              onClick={() => deleteKB(file._id)}
              className="p-2 rounded-lg hover:bg-red-500/20 transition shrink-0"
            >

              <Trash2 className="w-4 h-4 text-red-400" />

            </button>

          </div>

        ))}

        {files.length === 0 && (

          <p className="text-textMuted text-sm">
            No PDFs uploaded yet.
          </p>

        )}

      </div>

    </div>

  );
}