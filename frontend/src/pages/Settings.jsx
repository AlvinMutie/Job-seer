import React, { useState, useEffect } from 'react';
import { User, MapPin, DollarSign, Target, Check, Loader2, Settings as SettingsIcon, Save, Briefcase, AlertCircle } from 'lucide-react';
import { authService, getApiErrorMessage } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

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
            setMessage({ type: 'success', text: 'Career preferences saved successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: getApiErrorMessage(err) });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="max-w-4xl mx-auto space-y-6"><LoadingSkeleton variant="card" count={2} /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <PageHeader
                badgeText="CAREER PREFERENCES"
                title="Account Settings & Profile"
                subtitle="Update your technical skills, experience level, and preferred role to optimize AI job matching calculations."
            />

            <Card variant="glass" className="overflow-hidden">
                <div className="p-6 border-b border-slate-800 bg-slate-900/60 flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2 text-white">
                        <User className="text-indigo-400" size={18} /> Candidate Career Profile
                    </h3>
                    <span className="text-xs text-slate-400">Logged in as <span className="text-indigo-400 font-bold">{currentUser?.full_name}</span></span>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Preferred Job Title"
                            icon={Target}
                            placeholder="e.g. Senior Frontend Engineer"
                            required
                            value={formData.preferred_role}
                            onChange={e => setFormData({ ...formData, preferred_role: e.target.value })}
                        />

                        <Select
                            label="Experience Level"
                            icon={Briefcase}
                            value={formData.experience_level}
                            onChange={e => setFormData({ ...formData, experience_level: e.target.value })}
                            options={[
                                { value: 'Junior', label: 'Junior' },
                                { value: 'Mid-Level', label: 'Mid-Level' },
                                { value: 'Senior', label: 'Senior' },
                                { value: 'Lead / Architect', label: 'Lead / Architect' }
                            ]}
                        />

                        <Input
                            label="Location Preference"
                            icon={MapPin}
                            placeholder="e.g. Remote, Nairobi, NYC"
                            required
                            value={formData.location_preference}
                            onChange={e => setFormData({ ...formData, location_preference: e.target.value })}
                        />

                        <Input
                            label="Salary Expectation (Annual)"
                            icon={DollarSign}
                            placeholder="e.g. $100,000 - $140,000"
                            required
                            value={formData.salary_expectation}
                            onChange={e => setFormData({ ...formData, salary_expectation: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-300 ml-0.5">
                            Technical Skills (Comma Separated)
                        </label>
                        <textarea
                            className="w-full bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 rounded-xl p-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all min-h-[120px] resize-none"
                            placeholder="React, Node.js, Python, PostgreSQL, AWS..."
                            value={formData.skills}
                            onChange={e => setFormData({ ...formData, skills: e.target.value })}
                        ></textarea>
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-fade-in ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'}`}>
                            {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                            <span className="text-sm font-medium">{message.text}</span>
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            icon={Save}
                            isLoading={saving}
                        >
                            Save Career Profile
                        </Button>
                    </div>
                </form>
            </Card>

            <Card variant="flat" className="p-6 bg-amber-500/5 border-amber-500/10">
                <p className="text-xs text-amber-400/90 leading-relaxed italic">
                    Note: Updating your technical skills and preferred role here directly impacts your V2 AI Match Score calculations in the Command Center and Jobs Hub.
                </p>
            </Card>
        </div>
    );
}

export default Settings;
