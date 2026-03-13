import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  Settings,
  LogOut,
  Phone,
  Menu,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Agent Config", path: "/agent", icon: Bot },
    { name: "Agents", path: "/agents", icon: Bot },
    
    { name: "Knowledge Base", path: "/knowledge", icon: BookOpen },

    // NEW PAGE
    { name: "Twilio Settings", path: "/twilio-config", icon: Phone },

    { name: "Outbound Call", path: "/outbound-call", icon: Phone },
    { name: "Account Settings", path: "/profile", icon: Settings }
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-surfaceHighlight p-2 rounded-lg"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed md:hidden top-0 left-0 h-screen w-64 glass-panel border-r border-white/5 flex flex-col items-center py-6 transition-transform duration-300 z-50 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 w-full px-4">
          <Bot className="w-6 h-6 text-white" />
          <h1 className="text-lg font-bold text-white">Agent Vox</h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 w-full px-4">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-textMuted hover:text-white hover:bg-white/5"
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className="
        hidden md:flex
        group
        fixed
        left-0
        top-0
        h-screen
        w-20
        hover:w-64
        transition-all
        duration-300
        glass-panel
        border-r
        border-white/5
        flex-col
        items-center
        py-6
        z-40
      "
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 w-full px-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
            <Bot className="w-6 h-6 text-white" />
          </div>

          <h1 className="text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Agent Vox
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 w-full px-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isActive
                    ? "text-white"
                    : "text-textMuted hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-primary/20 rounded-xl border border-primary/30"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <Icon className="w-5 h-5 relative z-10 shrink-0" />

                <span className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap relative z-10">
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="mt-auto w-full px-2 pt-6 border-t border-white/5 space-y-3">
          {user && (
            <Link
              to="/profile"
              className="flex items-center gap-3 p-3 rounded-xl bg-surfaceHighlight/40 hover:bg-surfaceHighlight/70 transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div className="flex flex-col overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium text-white truncate">
                  {user.name}
                </span>
                <span className="text-xs text-textMuted truncate">
                  {user.email}
                </span>
              </div>
            </Link>
          )}

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/10"
          >
            <LogOut className="w-5 h-5 shrink-0" />

            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;