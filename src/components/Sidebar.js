import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bot, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
const Sidebar = () => {
    const location = useLocation();
    const links = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Agent Config', path: '/agent', icon: Bot },
        { name: 'Knowledge Base', path: '/knowledge', icon: BookOpen },
    ];
    return (_jsxs("aside", { className: "w-64 h-screen glass-panel rounded-none border-y-0 border-l-0 border-r border-white/5 flex flex-col items-center py-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-12", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30", children: _jsx(Bot, { className: "w-6 h-6 text-white" }) }), _jsx("h1", { className: "text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60", children: "Agent Vox" })] }), _jsx("nav", { className: "flex flex-col gap-2 w-full px-4", children: links.map((link) => {
                    const isActive = location.pathname === link.path;
                    const Icon = link.icon;
                    return (_jsxs(Link, { to: link.path, className: `relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'text-white' : 'text-textMuted hover:text-white hover:bg-white/5'}`, children: [isActive && (_jsx(motion.div, { layoutId: "active-nav", className: "absolute inset-0 bg-primary/20 rounded-xl border border-primary/30", initial: false, transition: { type: 'spring', stiffness: 300, damping: 30 } })), _jsx(Icon, { className: "w-5 h-5 relative z-10" }), _jsx("span", { className: "font-medium relative z-10", children: link.name })] }, link.name));
                }) })] }));
};
export default Sidebar;
