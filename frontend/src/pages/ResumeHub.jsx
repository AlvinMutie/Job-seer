import React, { useState, useEffect } from 'react';
import { Upload, FileText, Check, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { authService, getApiErrorMessage } from '../services/api';

function ResumeHub() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchUser = async () => {
        try {
            const data = await authService.getMe();
            setUser(data);
        } catch (error) {
            console.error("Failed to fetch user:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setMessage({ type: '', text: '' });
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setMessage({ type: '', text: '' });
        try {
            const formData = new FormData();
            formData.append('file', file);
            await authService.uploadResume(formData);
            setMessage({ type: 'success', text: 'Resume uploaded and parsed successfully!' });
            setFile(null);
            fetchUser(); // Refresh user data to get updated resume text
        } catch (error) {
            console.error("Upload failed:", error);
            setMessage({ type: 'error', text: getApiErrorMessage(error) });
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-[400px] text-slate-500">Loading Resume Hub...</div>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white">Resume Hub</h1>
                <p className="text-slate-400">Manage your CV and view how our AI parses your technical profile.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="space-y-6">
                    <div className="glass-card p-8">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Upload className="text-indigo-400" size={20} /> Upload New CV
                        </h3>

                        <form onSubmit={handleUpload} className="space-y-6">
                            <div
                                onClick={() => document.getElementById('cv-upload-hub').click()}
                                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer group ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/20'}`}
                            >
                                <input
                                    id="cv-upload-hub" type="file" className="hidden"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.txt"
                                />
                                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                    {file ? <Check className="text-emerald-500" size={32} /> : <FileText className="text-indigo-500" size={32} />}
                                </div>
                                <p className="text-lg font-medium text-white">{file ? file.name : 'Select PDF or TXT file'}</p>
                                <p className="text-sm text-slate-500 mt-2 text-center max-w-[200px]">Click to browse or drag and drop your latest resume</p>
                            </div>

                            {message.text && (
                                <div className={`p-4 rounded-xl flex items-center gap-3 animate-fade-in ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                                    {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                                    <span className="text-sm font-medium">{message.text}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!file || uploading}
                                className={`btn-primary w-full py-4 text-lg font-bold ${(!file || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {uploading ? <><Loader2 className="animate-spin mr-2" size={20} /> Parsing Resume...</> : 'Update Resume'}
                            </button>
                        </form>
                    </div>

                    <div className="glass-card p-6 border-indigo-500/20 bg-indigo-500/5">
                        <h4 className="font-semibold mb-3 flex items-center gap-2 text-indigo-400">
                            <Sparkles size={18} /> Pro Tip
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Our AI uses **TF-IDF mapping** to extract your skill set. Ensure your resume has a clear "Skills" or "Technologies" section for maximum matching accuracy.
                        </p>
                    </div>
                </div>

                {/* Parsing Preview Section */}
                <div className="glass-card flex flex-col overflow-hidden h-[600px]">
                    <div className="p-6 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30">
                        <h3 className="font-semibold flex items-center gap-2">
                            <FileText className="text-indigo-400" size={18} /> Intelligence Preview
                        </h3>
                        {user?.profile?.has_resume && (
                            <span className="badge badge-indigo">Live Version</span>
                        )}
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto font-mono text-sm leading-relaxed text-slate-400 bg-slate-900/50">
                        {user?.profile?.resume_text ? (
                            <div className="whitespace-pre-wrap">{user.profile.resume_text}</div>
                        ) : user?.profile?.has_resume ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-red-400 bg-red-500/5 rounded-xl p-6">
                                <AlertCircle size={48} />
                                <p className="font-bold uppercase tracking-widest">Parsing Failed</p>
                                <p className="text-sm opacity-80 max-w-[250px]">
                                    We found your file but couldn't extract any text. Try converting it to a standard PDF or a plain .txt file.
                                </p>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                                <FileText size={48} />
                                <p>No resume text detected.<br />Upload a file to see how the AI parses your profile.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResumeHub;
