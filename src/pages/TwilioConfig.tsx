import { useState, useEffect } from "react";
import { Save, Phone, Key, Shield, RotateCcw } from "lucide-react";
import api from "../api/axios";

const STORAGE_KEY = "twilio_config_draft";

const TwilioConfig = () => {

  const [credentials, setCredentials] = useState({
    accountSid: "",
    authToken: "",
    phoneNumber: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [draftLoaded, setDraftLoaded] = useState(false);

  /* LOAD DRAFT */
  useEffect(() => {

    const savedDraft = localStorage.getItem(STORAGE_KEY);

    if (savedDraft) {
      try {

        const parsed = JSON.parse(savedDraft);
        setCredentials(parsed);

      } catch {
        console.warn("Draft corrupted");
      }
    }

    setDraftLoaded(true);

  }, []);

  /* FETCH USER CONFIG ONLY IF NO DRAFT */
  useEffect(() => {

    if (!draftLoaded) return;

    const savedDraft = localStorage.getItem(STORAGE_KEY);

    if (savedDraft) return; // don't overwrite draft

    const fetchConfig = async () => {

      try {

        const response = await api.get("/users/me");
        const user = response.data.user;

        if (user?.twilio) {

          const config = {
            accountSid: user.twilio.accountSid || "",
            authToken: user.twilio.authToken || "",
            phoneNumber: user.twilio.phoneNumber || "",
          };

          setCredentials(config);

        }

      } catch (error) {

        console.error("Failed to fetch config", error);

      }

    };

    fetchConfig();

  }, [draftLoaded]);

  /* HANDLE CHANGE + SAVE DRAFT */
  const handleChange = (field: string, value: string) => {

    const updated = {
      ...credentials,
      [field]: value,
    };

    setCredentials(updated);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  };

  /* RESET */
  const handleReset = () => {

    const empty = {
      accountSid: "",
      authToken: "",
      phoneNumber: "",
    };

    setCredentials(empty);

    localStorage.removeItem(STORAGE_KEY);

  };

  /* SAVE CONFIG */
  const handleSave = async (e: React.FormEvent) => {

    e.preventDefault();
    setIsLoading(true);

    try {

      await api.post("/users/connect-twilio", credentials);

      localStorage.removeItem(STORAGE_KEY);

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

      <div className="mb-8">

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
          Twilio Configuration
        </h1>

        <p className="text-textMuted text-sm sm:text-base">
          Connect your Twilio account to enable calling features for your AI agents.
        </p>

        <p className="text-xs text-textMuted mt-1">
          Draft auto-saved
        </p>

      </div>

      <div className="glass-panel p-4 sm:p-6 lg:p-8">

        <form onSubmit={handleSave} className="space-y-5">

          {/* SID */}
          <div className="space-y-2">

            <label className="text-sm font-medium text-textMuted flex items-center gap-2">
              <Shield className="w-4 h-4"/>
              Account SID
            </label>

            <input
              type="text"
              value={credentials.accountSid}
              onChange={(e) => handleChange("accountSid", e.target.value)}
              className="input-field w-full"
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              required
            />

          </div>

          {/* TOKEN */}
          <div className="space-y-2">

            <label className="text-sm font-medium text-textMuted flex items-center gap-2">
              <Key className="w-4 h-4"/>
              Auth Token
            </label>

            <input
              type="password"
              value={credentials.authToken}
              onChange={(e) => handleChange("authToken", e.target.value)}
              className="input-field w-full"
              required
            />

          </div>

          {/* PHONE */}
          <div className="space-y-2">

            <label className="text-sm font-medium text-textMuted flex items-center gap-2">
              <Phone className="w-4 h-4"/>
              Phone Number
            </label>

            <input
              type="text"
              value={credentials.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              className="input-field w-full"
              placeholder="+1234567890"
              required
            />

          </div>

          <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">

            {isSaved && (
              <span className="text-accent text-sm font-medium">
                Successfully saved!
              </span>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4"/>
              Reset
            </button>

            <button
              type="submit"
              className="btn-primary flex items-center justify-center gap-2"
              disabled={isLoading}
            >

              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
              ) : (
                <>
                  <Save className="w-5 h-5"/>
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