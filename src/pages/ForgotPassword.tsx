import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await api.post("/users/forgot-password", { email });
      // toast.success(res.data.message || "Reset link sent");
    } catch (error: any) {
      // toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">

      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />

      <div className="glass-panel p-8 w-full max-w-md z-10 animation-fade-in">

              {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-sm text-textMuted hover:text-white mb-4"
        >
          ← Back to Login
        </button>

        
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 mb-3 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
            <Bot className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-white">Forgot Password</h2>
          <p className="text-textMuted text-sm">
            Enter your email to receive a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Enter your email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="btn-primary w-full">
            Send Reset Link
          </button>

        </form>
      </div>
    </div>
  );
}