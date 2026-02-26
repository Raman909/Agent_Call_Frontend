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
import { useState, useCallback } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
const KnowledgeBase = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);
    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if ((droppedFile === null || droppedFile === void 0 ? void 0 : droppedFile.type) === 'application/pdf') {
            setFile(droppedFile);
        }
    }, []);
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };
    const handleUpload = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!file)
            return;
        setIsUploading(true);
        // Simulate upload process
        yield new Promise(r => setTimeout(r, 1500));
        setIsUploading(false);
        alert('Knowledge base uploaded successfully!');
    });
    return (_jsxs("div", { className: "max-w-3xl mx-auto animation-fade-in", children: [_jsxs("div", { className: "mb-10", children: [_jsx("h1", { className: "text-4xl font-bold tracking-tight mb-3", children: "Knowledge Base" }), _jsx("p", { className: "text-textMuted text-lg", children: "Upload PDF documents for your agent to reference during live calls." })] }), _jsx("div", { className: "glass-panel p-1 rounded-3xl mb-8", children: _jsx("div", { className: `border-2 border-dashed rounded-[22px] p-12 transition-all flex flex-col items-center justify-center min-h-[400px] text-center
            ${isDragging ? 'border-primary bg-primary/5 scale-[0.99]' : 'border-white/10 hover:border-white/20 bg-surfaceHighlight/50'}
          `, onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, children: file ? (_jsxs("div", { className: "flex flex-col items-center animation-fade-in", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6", children: _jsx(FileText, { className: "w-8 h-8" }) }), _jsx("h3", { className: "text-xl font-bold text-white mb-2", children: file.name }), _jsxs("p", { className: "text-textMuted mb-8", children: [(file.size / 1024 / 1024).toFixed(2), " MB \u2022 PDF Document"] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { onClick: () => setFile(null), className: "btn-secondary", disabled: isUploading, children: [_jsx(X, { className: "w-4 h-4" }), " Remove"] }), _jsx("button", { onClick: handleUpload, className: "btn-primary", disabled: isUploading, children: isUploading ? (_jsx("div", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" })) : (_jsxs(_Fragment, { children: [_jsx(UploadCloud, { className: "w-5 h-5" }), " Attach to Agent"] })) })] })] })) : (_jsxs("div", { className: "space-y-6 pointer-events-none", children: [_jsx("div", { className: "w-20 h-20 rounded-full bg-surfaceHighlight flex items-center justify-center mx-auto shadow-xl", children: _jsx(UploadCloud, { className: "w-10 h-10 text-textMuted" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-2", children: "Drag and drop your PDF here" }), _jsx("p", { className: "text-textMuted max-w-sm mx-auto", children: "Your agent will automatically extract text and use it to answer questions on calls." })] }), _jsx("div", { className: "pt-4 pointer-events-auto", children: _jsxs("label", { className: "btn-secondary cursor-pointer inline-flex items-center", children: [_jsx("span", { children: "Browse Files" }), _jsx("input", { type: "file", className: "hidden", accept: "application/pdf", onChange: handleFileChange })] }) })] })) }) })] }));
};
export default KnowledgeBase;
