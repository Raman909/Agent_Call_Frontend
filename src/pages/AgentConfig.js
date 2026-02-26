var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Save, Bot, MessageSquare, TerminalSquare } from 'lucide-react';
const AgentConfig = () => {
    const [config, setConfig] = useState({
        name: 'Customer Support Bot',
        prompt: 'You are a helpful customer support agent for Acme Corp. Keep answers concise.',
        greeting: 'Hello! I am the Acme Corp virtual assistant. How can I help you today?',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const handleSave = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        setIsLoading(true);
        yield new Promise(r => setTimeout(r, 1000));
        setIsSaved(true);
        setIsLoading(false);
        setTimeout(() => setIsSaved(false), 3000);
    });
    return (_jsxs("div", { className: "max-w-4xl mx-auto animation-fade-in", children: [_jsxs("div", { className: "mb-10", children: [_jsx("h1", { className: "text-4xl font-bold tracking-tight mb-3", children: "Agent Configuration" }), _jsx("p", { className: "text-textMuted text-lg", children: "Define your agent's personality, behavior, and opening statement." })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-2 glass-panel p-8", children: _jsxs("form", { onSubmit: handleSave, className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-sm font-medium text-textMuted flex items-center gap-2", children: [_jsx(Bot, { className: "w-4 h-4" }), " Agent Name"] }), _jsx("input", { type: "text", value: config.name, onChange: e => setConfig(Object.assign(Object.assign({}, config), { name: e.target.value })), className: "input-field font-medium text-lg text-white", placeholder: "e.g. Sales Representative", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-sm font-medium text-textMuted flex items-center gap-2", children: [_jsx(MessageSquare, { className: "w-4 h-4" }), " First Message / Greeting"] }), _jsx("input", { type: "text", value: config.greeting, onChange: e => setConfig(Object.assign(Object.assign({}, config), { greeting: e.target.value })), className: "input-field", placeholder: "What the agent says when picking up the phone...", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-sm font-medium text-textMuted flex items-center gap-2", children: [_jsx(TerminalSquare, { className: "w-4 h-4" }), " System Prompt"] }), _jsx("textarea", { value: config.prompt, onChange: e => setConfig(Object.assign(Object.assign({}, config), { prompt: e.target.value })), className: "input-field min-h-[200px] resize-y font-mono text-sm leading-relaxed", placeholder: "Define the behavior, rules, and persona...", required: true })] }), _jsxs("div", { className: "pt-4 flex items-center justify-end gap-4", children: [isSaved && _jsx("span", { className: "text-accent text-sm font-medium", children: "Configuration saved!" }), _jsx("button", { type: "submit", className: "btn-primary", disabled: isLoading, children: isLoading ? (_jsx("div", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" })) : (_jsxs(_Fragment, { children: [_jsx(Save, { className: "w-5 h-5" }), " Save Agent"] })) })] })] }) }), _jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "glass-panel p-6 bg-primary/5 border-primary/20", children: [_jsxs("h3", { className: "text-lg font-semibold mb-2 flex items-center gap-2 text-primary", children: [_jsx(Bot, { className: "w-5 h-5" }), " Live Preview"] }), _jsx("p", { className: "text-sm text-textMuted mb-4", children: "How your agent will feel to the caller." }), _jsx("div", { className: "bg-surfaceHighlight rounded-xl p-4 border border-white/5 space-y-4", children: _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center shrink-0", children: _jsx(Bot, { className: "w-4 h-4 text-primary" }) }), _jsx("div", { className: "bg-surface rounded-2xl rounded-tl-none p-3 border border-white/5 text-sm", children: config.greeting || "..." })] }) })] }) })] })] }));
};
export default AgentConfig;
