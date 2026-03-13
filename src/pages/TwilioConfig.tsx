import { useState, useEffect } from "react";
import { Save, Phone, Key, Shield } from "lucide-react";
import api from "../api/axios";

const TwilioConfig = () => {
  const [credentials, setCredentials] = useState({
    accountSid: "",
    authToken: "",
    phoneNumber: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await api.get("/users/me");
        const user = response.data.user;

        if (user && user.twilio) {
          setCredentials({
            accountSid: user.twilio.accountSid || "",
            authToken: user.twilio.authToken || "",
            phoneNumber: user.twilio.phoneNumber || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch config", error);
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/users/connect-twilio", credentials);
      setIsSaved(true);

      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save config", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animation-fade-in px-4 py-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
          Twilio Configuration
        </h1>

        <p className="text-textMuted text-sm sm:text-base">
          Connect your Twilio account to enable calling features for your AI agents.
        </p>
      </div>

      {/* Panel */}
      <div className="glass-panel p-4 sm:p-6 lg:p-8">

        <form onSubmit={handleSave} className="space-y-5">

          {/* Account SID */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-textMuted flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Account SID
            </label>

            <input
              type="text"
              value={credentials.accountSid}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  accountSid: e.target.value,
                })
              }
              className="input-field w-full"
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              required
            />
          </div>

          {/* Auth Token */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-textMuted flex items-center gap-2">
              <Key className="w-4 h-4" />
              Auth Token
            </label>

            <input
              type="password"
              value={credentials.authToken}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  authToken: e.target.value,
                })
              }
              className="input-field w-full"
              placeholder="••••••••••••••••••••••••••••••••"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-textMuted flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>

            <input
              type="text"
              value={credentials.phoneNumber}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  phoneNumber: e.target.value,
                })
              }
              className="input-field w-full"
              placeholder="+1234567890"
              required
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">

            {isSaved && (
              <span className="text-accent text-sm font-medium">
                Successfully saved!
              </span>
            )}

            <button
              type="submit"
              className="btn-primary flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Credentials
                </>
              )}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default TwilioConfig;