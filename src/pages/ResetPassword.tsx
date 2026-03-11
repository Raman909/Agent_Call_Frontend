import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { Bot } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await api.post(`/users/reset-password/${token}`, {
        password,
      });

      toast.success(res.data.message || "Password reset successful");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">

      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />

      <div className="glass-panel p-8 w-full max-w-md z-10 animation-fade-in">

        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 mb-3 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
            <Bot className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
          <p className="text-textMuted text-sm">
            Enter your new password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="password"
            placeholder="Enter new password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn-primary w-full">
            Reset Password
          </button>

        </form>
      </div>
    </div>
  );
}