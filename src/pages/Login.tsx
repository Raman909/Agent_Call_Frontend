import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/users/login', { email, password });

            const data = response.data;

            if (data.token) {
                login(data.token, data.user);
                navigate('/');
            } else {
                setError(data.message || 'Failed to login');
            }
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Network error. Is the backend running?');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="glass-panel p-8 w-full max-w-md z-10 animation-fade-in relative">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                        <Bot className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        Agent Vox
                    </h1>
                    <p className="text-textMuted mt-2">Sign in to your account</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-textMuted">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-textMuted">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full" disabled={isLoading}>
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <><LogIn className="w-5 h-5" /> Sign In</>
                        )}
                    </button>
                </form>

                <p className="text-center text-textMuted text-sm mt-8">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary hover:text-primaryHover font-medium transition-colors">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
};
