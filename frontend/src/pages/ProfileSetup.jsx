import React, { useState } from 'react';
import { User, MapPin, DollarSign, Target, Upload, Check, Loader2, AlertCircle } from 'lucide-react';
import { authService, getApiErrorMessage } from '../services/api';

function ProfileSetup() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        preferred_role: '',
        skills: '',
        experience_level: 'Junior',
        location_preference: 'Remote',
        salary_expectation: ''
    });
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authService.updateProfile(formData);
            if (file) {
                const fileData = new FormData();
                fileData.append('file', file);
                await authService.uploadResume(fileData);
            }
            window.location.href = '/dashboard';
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-slate-950">
            <div className="glass-card w-full max-w-2xl p-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-2xl font-bold">Profile Setup</h1>
                        <p className="text-slate-500 mt-1">Let's personalize your hunt</p>
                    </div>
                    <div className="flex gap-2">
                        {[1, 2].map(i => (
                            <div key={i} className={`h-2 w-12 rounded-full transition-all ${step >= i ? 'bg-indigo-600' : 'bg-slate-800'}`}></div>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex gap-3 text-red-400 text-sm">
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Preferred Role</label>
                                    <div className="relative">
                                        <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text" required className="input-field pl-11" placeholder="e.g. Frontend Engineer"
                                            value={formData.preferred_role} onChange={e => setFormData({ ...formData, preferred_role: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Experience Level</label>
                                    <select
                                        className="input-field appearance-none"
                                        value={formData.experience_level} onChange={e => setFormData({ ...formData, experience_level: e.target.value })}
                                    >
                                        <option>Junior</option>
                                        <option>Mid-Level</option>
                                        <option>Senior</option>
                                        <option>Lead / Architect</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Skills (Comma separated)</label>
                                <textarea
                                    className="input-field h-32 resize-none" placeholder="React, Python, AWS, SQL..."
                                    value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })}
                                ></textarea>
                            </div>

                            <button
                                type="button" onClick={() => setStep(2)}
                                className="btn-primary w-full py-3"
                            >
                                Next Step
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Location Preference</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text" required className="input-field pl-11" placeholder="e.g. Remote, NYC"
                                            value={formData.location_preference} onChange={e => setFormData({ ...formData, location_preference: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Salary Expectation (Annually)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text" required className="input-field pl-11" placeholder="e.g. $120,000"
                                            value={formData.salary_expectation} onChange={e => setFormData({ ...formData, salary_expectation: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Latest Resume (PDF or Text)</label>
                                <div
                                    onClick={() => document.getElementById('cv-upload').click()}
                                    className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer group ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 hover:border-indigo-500/50'}`}
                                >
                                    <input
                                        id="cv-upload" type="file" className="hidden"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,.txt"
                                    />
                                    <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        {file ? <Check className="text-emerald-500" size={24} /> : <Upload className="text-indigo-500" size={24} />}
                                    </div>
                                    <p className="text-sm font-medium">{file ? file.name : 'Click to upload or drag & drop'}</p>
                                    <p className="text-xs text-slate-500 mt-1">PDF, DOCX or TXT up to 10MB</p>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button" onClick={() => setStep(1)}
                                    className="flex-1 py-3 border border-slate-800 rounded-xl hover:bg-slate-900 transition-all font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit" disabled={loading}
                                    className="flex-[2] btn-primary py-3"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Complete Setup'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default ProfileSetup;
