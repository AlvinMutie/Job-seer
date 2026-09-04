import React, { useState } from 'react';
import { Mail, Lock, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { authService, getApiErrorMessage } from '../services/api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const params = new URLSearchParams();
            params.append('username', email);
            params.append('password', password);

            const { access_token } = await authService.login(params);
            localStorage.setItem('token', access_token);

            const user = await authService.getMe();
            if (!user.is_profile_complete) {
                window.location.href = '/profile-setup';
            } else {
                window.location.href = '/dashboard';
            }
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-[#f8fafc] text-slate-900">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100/50 blur-[100px] rounded-full -z-10"></div>

            <div className="glass-card w-full max-w-md p-10 bg-white border border-slate-200 shadow-xl rounded-2xl">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
                        <Sparkles className="text-white" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
                    <p className="text-slate-500 mt-2">Sign in to your Job Seer account</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex gap-3 text-red-400 text-sm">
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email" required className="input-field pl-11" placeholder="name@company.com"
                                value={email} onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-medium text-slate-700">Password</label>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password" required className="input-field pl-11" placeholder="••••••••"
                                value={password} onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="btn-primary w-full py-3 h-12"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-500 text-sm">
                    New here? <a href="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">Create an account</a>
                </p>
            </div>
        </div>
    );
}

export default Login;
