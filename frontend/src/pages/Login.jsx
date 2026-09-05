import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { authService, getApiErrorMessage } from '../services/api';
import Button from '../components/ui/Button';
import Logo from '../components/Logo';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
            if (access_token) {
                localStorage.setItem('token', access_token);
                // Also fetch user to check profile completion status
                const user = await authService.getMe();
                if (!user.is_profile_complete) {
                    window.location.href = '/profile-setup';
                } else {
                    window.location.href = '/dashboard';
                }
            } else {
                throw new Error("No access token returned.");
            }
        } catch (err) {
            console.error("Login attempt failed:", err);
            setError(getApiErrorMessage(err, "Invalid email or password. Please verify your credentials."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-200/50 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-200/40 rounded-full blur-[140px] pointer-events-none translate-x-1/4 translate-y-1/4" />

            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden z-10">
                {/* Left Showcase Banner */}
                <div className="lg:col-span-5 bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                    <div>
                        <Link to="/" className="inline-flex items-center mb-8 group">
                            <Logo size="md" variant="white" />
                        </Link>

                        <div className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-indigo-100 text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                            Welcome Back
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-4 leading-snug">
                            Your career pipeline is waiting.
                        </h2>
                        <p className="text-indigo-100 text-sm leading-relaxed mb-6 font-medium">
                            Log back in to review live match scores, tailor your resume for open roles, and track interview stages.
                        </p>
                    </div>

                    <div className="pt-6 border-t border-white/15 text-xs text-indigo-200">
                        Unified career acceleration workspace &bull; v2.2
                    </div>
                </div>

                {/* Right Form Container */}
                <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                            Candidate Sign In
                        </h1>
                        <p className="text-sm font-medium text-slate-600 mt-1">
                            Access your personalized workspace
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3 text-rose-800 text-sm font-semibold">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 ml-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="alex.chen@example.com"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-2xs"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-2xs"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full py-3.5 text-base font-bold shadow-lg shadow-indigo-600/30"
                                isLoading={loading}
                                icon={ArrowRight}
                            >
                                Sign In to Workspace
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                        <p className="text-sm text-slate-600 font-medium">
                            Don't have an account yet?{' '}
                            <Link to="/register" className="text-indigo-600 hover:underline font-bold">
                                Create free profile
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
