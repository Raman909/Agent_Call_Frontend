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
import { Save, Phone, Key, Shield } from 'lucide-react';
const Dashboard = () => {
    const [credentials, setCredentials] = useState({
        accountSid: '',
        authToken: '',
        phoneNumber: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    // In a real app, you would fetch these from the backend on load
    // useEffect(() => { fetchCredentials() }, []);
    const handleSave = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        yield new Promise(r => setTimeout(r, 1000));
        setIsSaved(true);
        setIsLoading(false);
        setTimeout(() => setIsSaved(false), 3000);
    });
    return (_jsxs("div", { className: "max-w-3xl mx-auto animation-fade-in", children: [_jsxs("div", { className: "mb-10", children: [_jsx("h1", { className: "text-4xl font-bold tracking-tight mb-3", children: "Twilio Configuration" }), _jsx("p", { className: "text-textMuted text-lg", children: "Connect your Twilio account to enable telephony features for your AI agents." })] }), _jsx("div", { className: "glass-panel p-8", children: _jsxs("form", { onSubmit: handleSave, className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-sm font-medium text-textMuted flex items-center gap-2", children: [_jsx(Shield, { className: "w-4 h-4" }), " Account SID"] }), _jsx("input", { type: "text", value: credentials.accountSid, onChange: e => setCredentials(Object.assign(Object.assign({}, credentials), { accountSid: e.target.value })), className: "input-field", placeholder: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-sm font-medium text-textMuted flex items-center gap-2", children: [_jsx(Key, { className: "w-4 h-4" }), " Auth Token"] }), _jsx("input", { type: "password", value: credentials.authToken, onChange: e => setCredentials(Object.assign(Object.assign({}, credentials), { authToken: e.target.value })), className: "input-field", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-sm font-medium text-textMuted flex items-center gap-2", children: [_jsx(Phone, { className: "w-4 h-4" }), " Phone Number"] }), _jsx("input", { type: "text", value: credentials.phoneNumber, onChange: e => setCredentials(Object.assign(Object.assign({}, credentials), { phoneNumber: e.target.value })), className: "input-field", placeholder: "+1234567890", required: true })] }), _jsxs("div", { className: "pt-4 flex items-center justify-end gap-4", children: [isSaved && _jsx("span", { className: "text-accent text-sm font-medium", children: "Successfully saved!" }), _jsx("button", { type: "submit", className: "btn-primary", disabled: isLoading, children: isLoading ? (_jsx("div", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" })) : (_jsxs(_Fragment, { children: [_jsx(Save, { className: "w-5 h-5" }), " Save Credentials"] })) })] })] }) })] }));
};
export default Dashboard;
