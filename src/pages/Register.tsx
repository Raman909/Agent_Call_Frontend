import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

export const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        try {
            // 1. Register the user
            const regRes = await api.post('/users/register', formData);

            if (regRes.data?.user) {
                // 2. Perform Auto-Login since register doesn't return a token
                try {
                    const loginRes = await api.post('/users/login', { 
                        email: formData.email, 
                        password: formData.password 
                    });

                    if (loginRes.data?.token) {
                        login(loginRes.data.token, loginRes.data.user);
                        toast.success('Account created! Welcome aboard.');
                        navigate('/');
                    } else {
                        // Fallback if login fails but registration worked
                        toast.success('Account created! Please sign in.');
                        navigate('/login');
                    }
                } catch (loginErr) {
                    // Registration worked, but auto-login failed
                    toast.error('Account created, but auto-login failed. Please sign in manually.');
                    navigate('/login');
                }
            }
        } catch (err: any) {
            // Interceptor handles most, but we stop loading here
            const msg = err.response?.data?.message || 'Registration failed';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Ambient Background Blur */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="glass-panel p-8 w-full max-w-md z-10 animation-fade-in relative">
                <header className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                        <Bot className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        Agent Vox
                    </h1>
                    <p className="text-textMuted mt-2">Create a new account</p>
                </header>

                <form onSubmit={handleRegister} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-textMuted ml-1">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-textMuted ml-1">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-textMuted ml-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                        <p className="text-[10px] text-textMuted px-1">Must be at least 6 characters.</p>
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary w-full mt-2 py-3 flex items-center justify-center gap-2" 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <UserPlus className="w-5 h-5" />
                                <span>Create Account</span>
                            </>
                        )}
                    </button>
                </form>

                <footer className="text-center text-textMuted text-sm mt-8">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:text-primaryHover font-medium transition-colors">
                        Sign in
                    </Link>
                </footer>
            </div>
        </div>
    );
};