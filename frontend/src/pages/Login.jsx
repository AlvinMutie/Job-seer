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
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#030712] text-slate-950 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-indigo-500/30 transition-colors duration-200 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-200/50 dark:bg-indigo-950/40 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-200/40 dark:bg-cyan-950/30 rounded-full blur-[140px] pointer-events-none translate-x-1/4 translate-y-1/4" />

            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10">
                {/* Left Showcase Banner */}
                <div className="lg:col-span-5 bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                    <div>
                        <Link to="/" className="inline-flex items-center mb-8 group">
                            <Logo size="lg" variant="white" />
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
                        Unified B2B SaaS architecture &bull; v2.2
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
                        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl flex gap-3 text-rose-800 dark:text-rose-300 text-sm font-semibold">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 ml-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="input-field pl-11"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="input-field pl-11 pr-10"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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

                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                            Don't have an account yet?{' '}
                            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
