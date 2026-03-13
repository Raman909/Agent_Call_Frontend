import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { User } from "lucide-react";
import PasswordInput from "../components/PasswordInput";

export default function Profile() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdate = async () => {
    try {
      setLoading(true);

      await api.put("/users/update-profile", {
        name,
        email,
      });

      alert("Profile updated successfully ✅");
    } catch (err) {
      alert("Failed to update profile ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      await api.put("/users/change-password", {
        currentPassword,
        newPassword,
      });

      alert("Password updated successfully ✅");

      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      alert("Password update failed ❌");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20">

      <div className="glass-panel p-8 rounded-2xl border border-white/10">

        {/* Title */}
        <div className="flex items-center gap-3 mb-8">
          <User className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Account Settings</h1>
        </div>

        {/* PROFILE SECTION */}
        <div className="space-y-4">

          {/* Name */}
          <div>
            <label className="text-sm text-textMuted block mb-2">
              Name
            </label>
            <input
              className="w-full p-3 rounded-lg bg-surfaceHighlight border border-white/10"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-textMuted block mb-2">
              Email
            </label>
            <input
              className="w-full p-3 rounded-lg bg-surfaceHighlight border border-white/10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Update Profile Button */}
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>

        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-10"></div>

        {/* PASSWORD SECTION */}
        <div className="space-y-4">

          <h2 className="text-lg font-semibold">
            Change Password
          </h2>

            <PasswordInput
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-surfaceHighlight border border-white/10"
              placeholder="Current Password"
            />

            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-surfaceHighlight border border-white/10"
              placeholder="New Password"
            />

          <button
            onClick={handleChangePassword}
            className="w-full bg-primary py-3 rounded-xl text-white font-semibold hover:opacity-90 transition"
          >
            Update Password
          </button>

        </div>

      </div>
    </div>
  );
}