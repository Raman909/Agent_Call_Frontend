import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Phone, Key, Shield, LogOut, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [credentials, setCredentials] = useState({
    accountSid: '',
    authToken: '',
    phoneNumber: '',
  });

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Memoized fetch function with AbortController
  const fetchConfig = useCallback(async (signal: AbortSignal) => {
    try {
      const { data } = await api.get('/users/me', { signal });
      const twilio = data?.user?.twilio;
      
      if (twilio) {
        setCredentials({
          accountSid: twilio.accountSid || '',
          authToken: twilio.authToken || '',
          phoneNumber: twilio.phoneNumber || '',
        });
      }
    } catch (error: any) {
      if (error.name !== 'CanceledError') {
        toast.error("Failed to load configuration");
      }
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchConfig(controller.signal);
    return () => controller.abort();
  }, [fetchConfig]);

  // 2. Optimized change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await api.post('/users/connect-twilio', credentials);
      toast.success("Credentials saved successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save credentials");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success("Logged out successfully");
  };

  if (isInitialLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animation-fade-in">
      <header className="mb-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Twilio Configuration</h1>
          <p className="text-textMuted text-lg">
            Connect your Twilio account to enable telephony features for your AI agents.
          </p>
        </div>
        <button onClick={handleLogout} className="btn-danger-outline whitespace-nowrap">
          <LogOut className="w-4 h-4 mr-1" /> Logout
        </button>
      </header>

      <div className="glass-panel p-8 relative overflow-hidden">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="label-style"><Shield className="w-4 h-4" /> Account SID</label>
            <input
              name="accountSid"
              type="text"
              value={credentials.accountSid}
              onChange={handleChange}
              className="input-field"
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="label-style"><Key className="w-4 h-4" /> Auth Token</label>
            <input
              name="authToken"
              type="password"
              value={credentials.authToken}
              onChange={handleChange}
              className="input-field"
              placeholder="••••••••••••••••••••••••••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="label-style"><Phone className="w-4 h-4" /> Phone Number</label>
            <input
              name="phoneNumber"
              type="text"
              value={credentials.phoneNumber}
              onChange={handleChange}
              className="input-field"
              placeholder="+1234567890"
              required
            />
          </div>

          <div className="pt-4 flex items-center justify-end">
            <button
              type="submit"
              className="btn-primary w-full sm:w-auto"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <><Save className="w-5 h-5" /> Save Credentials</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;