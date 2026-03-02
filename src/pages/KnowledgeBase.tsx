import { useState, useCallback } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import api from '../api/axios';

const KnowledgeBase = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile?.type === 'application/pdf') {
            setFile(droppedFile);
            setUploadProgress(0);
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setUploadProgress(0);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post(`/agents/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    setUploadProgress(percent);
                    console.log("Progress:", percent);
                },
            });

            if (response.data.message) {
                setUploadProgress(100);
            } else {
                alert('Upload failed');
            }

        } catch (error: any) {
            console.error('Failed to upload knowledge base', error);
            alert(error.response?.data?.message || 'Upload failed');
            setUploadProgress(0);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        setFile(null);
        setUploadProgress(0);
        setIsUploading(false);
    };

    return (
        <div className="max-w-3xl mx-auto animation-fade-in">
            <div className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight mb-3">Knowledge Base</h1>
                <p className="text-textMuted text-lg">
                    Upload PDF documents for your agent to reference during live calls.
                </p>
            </div>

            <div className="glass-panel p-1 rounded-3xl mb-8">
                <div
                    className={`border-2 border-dashed rounded-[22px] p-12 transition-all flex flex-col items-center justify-center min-h-[400px] text-center
                    ${isDragging
                        ? 'border-primary bg-primary/5 scale-[0.99]'
                        : 'border-white/10 hover:border-white/20 bg-surfaceHighlight/50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {file ? (
                        <div className="flex flex-col items-center animation-fade-in w-full max-w-md">
                            <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                                <FileText className="w-8 h-8" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">
                                {file.name}
                            </h3>

                            <p className="text-textMuted mb-6">
                                {(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                            </p>

                            {/* Progress Bar */}
                            {(isUploading || uploadProgress === 100) && (
                                <div className="w-full mb-6">
                                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-primary h-2 transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>

                                    <div className="mt-3 flex items-center justify-center gap-2 text-sm">
                                        {isUploading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                                <span>Uploading... {uploadProgress}%</span>
                                            </>
                                        ) : (
                                            <span className="text-green-400 font-medium">
                                                Upload Complete – 100%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleRemove}
                                    className="btn-secondary"
                                    disabled={isUploading}
                                >
                                    <X className="w-4 h-4" /> Remove
                                </button>

                                <button
                                    onClick={handleUpload}
                                    className="btn-primary"
                                    disabled={isUploading || uploadProgress === 100}
                                >
                                    {isUploading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : uploadProgress === 100 ? (
                                        <>Uploaded</>
                                    ) : (
                                        <>
                                            <UploadCloud className="w-5 h-5" /> Attach to Agent
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 pointer-events-none">
                            <div className="w-20 h-20 rounded-full bg-surfaceHighlight flex items-center justify-center mx-auto shadow-xl">
                                <UploadCloud className="w-10 h-10 text-textMuted" />
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-2">
                                    Drag and drop your PDF here
                                </h3>
                                <p className="text-textMuted max-w-sm mx-auto">
                                    Your agent will automatically extract text and use it to answer questions.
                                </p>
                            </div>

                            <div className="pt-4 pointer-events-auto">
                                <label className="btn-secondary cursor-pointer inline-flex items-center">
                                    <span>Browse Files</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KnowledgeBase;