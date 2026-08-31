import React, { useState } from 'react';
import { Mail, Lock, User, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { authService, getApiErrorMessage } from '../services/api';

function Register() {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirm_password) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);
        try {
            const { access_token } = await authService.register({
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password
            });
            localStorage.setItem('token', access_token);
            window.location.href = '/profile-setup';
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-slate-950">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full -z-10"></div>

            <div className="glass-card w-full max-w-md p-10">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
                        <Sparkles className="text-white" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome to Job Seer</h1>
                    <p className="text-slate-500 mt-2">Your intelligent job search companion</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex gap-3 text-red-400 text-sm">
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text" required className="input-field pl-11" placeholder="John Doe"
                                value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="email" required className="input-field pl-11" placeholder="name@company.com"
                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="password" required className="input-field pl-11" placeholder="••••••••"
                                value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="password" required className="input-field pl-11" placeholder="••••••••"
                                value={formData.confirm_password} onChange={e => setFormData({ ...formData, confirm_password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="btn-primary w-full py-3 h-12 relative overflow-hidden group"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-500 text-sm">
                    Already have an account? <a href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Log in</a>
                </p>
            </div>
        </div>
    );
}

export default Register;
