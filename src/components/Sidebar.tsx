import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Bot, BookOpen, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const links = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Agent Config', path: '/agent', icon: Bot },
        { name: 'Knowledge Base', path: '/knowledge', icon: BookOpen },
    ];

    return (
        <aside className="w-64 h-screen glass-panel rounded-none border-y-0 border-l-0 border-r border-white/5 flex flex-col items-center py-8">
            <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                    <Bot className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    Agent Vox
                </h1>
            </div>

            <nav className="flex flex-col gap-2 w-full px-4">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'text-white' : 'text-textMuted hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-nav"
                                    className="absolute inset-0 bg-primary/20 rounded-xl border border-primary/30"
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                            <Icon className="w-5 h-5 relative z-10" />
                            <span className="font-medium relative z-10">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto w-full px-4 pt-8 border-t border-white/5 space-y-4">
                {user && (
                    <div className="px-4 py-2 text-sm text-textMuted bg-surfaceHighlight/50 rounded-xl">
                        <span className="block text-white font-medium truncate">{user.name}</span>
                        <span className="text-xs truncate">{user.email}</span>
                    </div>
                )}
                <button
                    onClick={() => {
                        logout();
                        navigate('/login');
                    }}
                    className="relative flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                    <LogOut className="w-5 h-5 relative z-10" />
                    <span className="font-medium relative z-10">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
