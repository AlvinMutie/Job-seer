import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, CheckCircle2, ShieldCheck, Target, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { authService, getApiErrorMessage } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import Button from '../components/ui/Button';
import Logo from '../components/Logo';

function Register() {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        if (formData.password !== formData.confirm_password) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await authService.register({
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password
            });

            // Automatically log in after successful registration
            const params = new URLSearchParams();
            params.append('username', formData.email);
            params.append('password', formData.password);
            const { access_token } = await authService.login(params);
            
            if (access_token) {
                localStorage.setItem('token', access_token);
                window.location.href = '/profile-setup';
            } else {
                window.location.href = '/login';
            }
        } catch (err) {
            console.error("Registration failed:", err);
            setError(getApiErrorMessage(err, "Registration failed. This email may already be in use."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#030712] text-slate-950 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-indigo-500/30 transition-colors duration-200 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-200/50 dark:bg-indigo-950/40 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-200/40 dark:bg-cyan-950/30 rounded-full blur-[140px] pointer-events-none translate-x-1/4 translate-y-1/4" />

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10">
                {/* Left Showcase Banner (Desktop) */}
                <div className="lg:col-span-5 bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                    <div>
                        <Link to="/" className="inline-flex items-center mb-8 group">
                            <Logo size="lg" variant="white" />
                        </Link>

                        <div className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-indigo-100 text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                            Candidate Workspace
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-4 leading-snug">
                            Start your intelligent career journey today.
                        </h2>
                        <p className="text-indigo-100 text-sm leading-relaxed mb-8 font-medium">
                            Say goodbye to black-box ATS rejections and chaotic spreadsheets. Job Seer gives you transparent fit calculations and factual tailoring.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-7 h-7 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
                                    <Target size={16} />
                                </div>
                                <span className="font-semibold text-indigo-50">4-Factor Explainable Match Engine</span>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-7 h-7 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-400/30">
                                    <ShieldCheck size={16} />
                                </div>
                                <span className="font-semibold text-indigo-50">10-Layer ATS Health Scan & Scoring</span>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-7 h-7 rounded-xl bg-purple-400/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-400/30">
                                    <CheckCircle2 size={16} />
                                </div>
                                <span className="font-semibold text-indigo-50">100% Factual Integrity Tailored Resumes</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/15 text-xs text-indigo-200 mt-8">
                        Secure &bull; Private &bull; Strict account isolation
                    </div>
                </div>

                {/* Right Form Container */}
                <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                                Create Account
                            </h1>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                                Enter your details to setup your candidate profile
                            </p>
                        </div>
                        <ThemeToggle />
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl flex gap-3 text-rose-800 dark:text-rose-300 text-sm font-semibold">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 ml-1">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="input-field pl-11"
                                    placeholder="Jane Candidate"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>
                        </div>

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
                                    placeholder="jane@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
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

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300 ml-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="input-field pl-11"
                                        placeholder="••••••••"
                                        value={formData.confirm_password}
                                        onChange={e => setFormData({ ...formData, confirm_password: e.target.value })}
                                    />
                                </div>
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
                                Create Free Account
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
