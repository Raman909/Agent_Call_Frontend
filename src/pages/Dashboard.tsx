import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Phone, Key, Shield, LogOut } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [credentials, setCredentials] = useState({
    accountSid: '',
    authToken: '',
    phoneNumber: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await api.get('/users/me');
        const user = response.data.user;
        if (user && user.twilio) {
          setCredentials({
            accountSid: user.twilio.accountSid || '',
            authToken: user.twilio.authToken || '',
            phoneNumber: user.twilio.phoneNumber || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch config', error);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("HANDLE SAVE TRIGGERED");
    setIsLoading(true);
    try {
      await api.post('/users/connect-twilio', credentials);
      console.log("credential is saved")
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save config', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animation-fade-in">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Twilio Configuration</h1>
          <p className="text-textMuted text-lg">
            Connect your Twilio account to enable telephony features for your AI agents.
          </p>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="btn-secondary text-red-400 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/30 whitespace-nowrap"
        >
          <LogOut className="w-4 h-4 mr-1" /> Logout
        </button>
      </div>

      <div className="glass-panel p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-textMuted flex items-center gap-2">
              <Shield className="w-4 h-4" /> Account SID
            </label>
            <input
              type="text"
              value={credentials.accountSid}
              onChange={e => setCredentials({ ...credentials, accountSid: e.target.value })}
              className="input-field"
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-textMuted flex items-center gap-2">
              <Key className="w-4 h-4" /> Auth Token
            </label>
            <input
              type="password"
              value={credentials.authToken}
              onChange={e => setCredentials({ ...credentials, authToken: e.target.value })}
              className="input-field"
              placeholder="••••••••••••••••••••••••••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-textMuted flex items-center gap-2">
              <Phone className="w-4 h-4" /> Phone Number
            </label>
            <input
              type="text"
              value={credentials.phoneNumber}
              onChange={e => setCredentials({ ...credentials, phoneNumber: e.target.value })}
              className="input-field"
              placeholder="+1234567890"
              required
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-4">
            {isSaved && <span className="text-accent text-sm font-medium">Successfully saved!</span>}
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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