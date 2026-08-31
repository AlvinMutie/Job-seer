import React, { useState, useEffect } from 'react';
import { User, MapPin, DollarSign, Target, Check, Loader2, Settings as SettingsIcon, Save, Briefcase, AlertCircle } from 'lucide-react';
import { authService, getApiErrorMessage } from '../services/api';

function Settings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        preferred_role: '',
        skills: '',
        experience_level: 'Junior',
        location_preference: 'Remote',
        salary_expectation: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const user = await authService.getMe();
                setCurrentUser(user);
                if (user.profile) {
                    setFormData({
                        preferred_role: user.profile.preferred_role || '',
                        skills: user.profile.skills || '',
                        experience_level: user.profile.experience_level || 'Junior',
                        location_preference: user.profile.location_preference || 'Remote',
                        salary_expectation: user.profile.salary_expectation || ''
                    });
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                setMessage({ type: 'error', text: getApiErrorMessage(error) });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await authService.updateProfile(formData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: getApiErrorMessage(err) });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-[400px] text-slate-500">Loading settings...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <SettingsIcon className="text-indigo-400" size={28} /> Account Settings
                </h1>
                <p className="text-slate-400">Update your career preferences and profile details to improve AI job matching.</p>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-slate-700/50 bg-slate-800/30 flex justify-between items-center">
                    <h3 className="font-semibold flex items-center gap-2">
                        <User className="text-indigo-400" size={18} /> Career Profile
                    </h3>
                    <span className="text-sm text-slate-500">Logged in as <span className="text-indigo-400 font-medium">{currentUser?.full_name}</span></span>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Preferred Job Title</label>
                            <div className="relative">
                                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text" required className="input-field pl-12 h-12" placeholder="e.g. Senior Frontend Engineer"
                                    value={formData.preferred_role} onChange={e => setFormData({ ...formData, preferred_role: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Experience Level</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <select
                                    className="input-field pl-12 h-12 appearance-none bg-slate-800/50"
                                    value={formData.experience_level} onChange={e => setFormData({ ...formData, experience_level: e.target.value })}
                                >
                                    <option>Junior</option>
                                    <option>Mid-Level</option>
                                    <option>Senior</option>
                                    <option>Lead / Architect</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Location Preference</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text" required className="input-field pl-12 h-12" placeholder="e.g. Remote, Nairobi, NYC"
                                    value={formData.location_preference} onChange={e => setFormData({ ...formData, location_preference: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Salary Expectation (Annual)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text" required className="input-field pl-12 h-12" placeholder="e.g. $100,000 - $140,000"
                                    value={formData.salary_expectation} onChange={e => setFormData({ ...formData, salary_expectation: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Technical Skills (Comma Separated)</label>
                        <textarea
                            className="input-field min-h-[120px] p-4 resize-none" placeholder="React, Node.js, Python, PostgreSQL, AWS..."
                            value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })}
                        ></textarea>
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 animate-fade-in ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                            {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                            <span className="text-sm font-medium">{message.text}</span>
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit" disabled={saving}
                            className={`btn-primary px-8 py-3 text-lg font-bold flex items-center gap-2 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {saving ? 'Saving Changes...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="glass-card p-6 bg-amber-500/5 border-amber-500/10 rounded-2xl">
                <p className="text-sm text-amber-500/80 leading-relaxed italic">
                    Note: Updating your skills here will affect how your profile is matched against jobs in the Dashboard. For best results, ensure these match the skills listed in your uploaded Resume.
                </p>
            </div>
        </div>
    );
}

export default Settings;
