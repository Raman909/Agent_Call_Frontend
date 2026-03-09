import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { User, Lock, Loader2, Save } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Profile() {
  const { user, login } = useAuth(); // Assuming login or a similar function updates user state

  // Profile State
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // Password State
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
  });
  const [isPassLoading, setIsPassLoading] = useState(false);

  // =========================
  // HANDLERS
  // =========================
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData.name || !profileData.email) return toast.error("Fields cannot be empty");

    setIsProfileLoading(true);
    try {
      const { data } = await api.put("/users/update-profile", profileData);
      
      // Update the AuthContext so the Header/Sidebar name updates immediately
      if (data.user) {
        const token = localStorage.getItem("token");
        if (token) login(token, data.user); 
      }

      toast.success("Profile updated successfully ✅");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile ❌");
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new.length < 6) return toast.error("New password must be at least 6 characters");

    setIsPassLoading(true);
    try {
      await api.put("/users/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });

      toast.success("Password updated successfully ✅");
      setPasswords({ current: "", new: "" }); // Reset fields
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Password update failed ❌");
    } finally {
      setIsPassLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 mb-20 animation-fade-in p-4">
      <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        </div>

        {/* PROFILE SECTION */}
        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-textMuted mb-2">Personal Information</h2>
          
          <div className="space-y-1">
            <label className="text-xs text-textMuted ml-1">Full Name</label>
            <input
              className="input-field"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-textMuted ml-1">Email Address</label>
            <input
              className="input-field"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={isProfileLoading}
            className="btn-primary w-full py-3 mt-2"
          >
            {isProfileLoading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Update Profile</>}
          </button>
        </form>

        <div className="border-t border-white/5 my-10" />

        {/* PASSWORD SECTION */}
        <form onSubmit={handleChangePassword} className="space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-textMuted" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-textMuted">Security</h2>
          </div>

          <input
            type="password"
            placeholder="Current Password"
            className="input-field"
            value={passwords.current}
            required
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
          />

          <input
            type="password"
            placeholder="New Password"
            className="input-field"
            value={passwords.new}
            required
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
          />

          <button
            type="submit"
            disabled={isPassLoading}
            className="btn-secondary w-full py-3"
          >
            {isPassLoading ? <Loader2 className="animate-spin" /> : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}