import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Briefcase, FileText, LayoutDashboard, Clock, Trophy, LogOut, Settings as SettingsIcon, Sparkles, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Dashboard from './pages/Dashboard';
import Tracker from './pages/Tracker';
import Matches from './pages/Matches';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import ResumeHub from './pages/ResumeHub';
import Settings from './pages/Settings';
import JobsHub from './pages/JobsHub';
import { authService } from './services/api';

import Lenis from 'lenis';

function App() {
    useEffect(() => {
        const lenis = new Lenis();

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />

                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <DashboardLayout pageTitle="Command Center"><Dashboard /></DashboardLayout>
                    </ProtectedRoute>
                } />

                <Route path="/jobs" element={
                    <ProtectedRoute>
                        <DashboardLayout pageTitle="Jobs Hub"><JobsHub /></DashboardLayout>
                    </ProtectedRoute>
                } />

                <Route path="/tracker" element={
                    <ProtectedRoute>
                        <DashboardLayout pageTitle="Application Tracker"><Tracker /></DashboardLayout>
                    </ProtectedRoute>
                } />

                <Route path="/matches" element={
                    <ProtectedRoute>
                        <DashboardLayout pageTitle="Matches"><Matches /></DashboardLayout>
                    </ProtectedRoute>
                } />

                <Route path="/resume-hub" element={
                    <ProtectedRoute>
                        <DashboardLayout pageTitle="Resume Hub"><ResumeHub /></DashboardLayout>
                    </ProtectedRoute>
                } />

                <Route path="/settings" element={
                    <ProtectedRoute>
                        <DashboardLayout pageTitle="Settings"><Settings /></DashboardLayout>
                    </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

// Higher-order component for protected routes
function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                setIsAllowed(false);
                setLoading(false);
                return;
            }
            try {
                const user = await authService.getMe();
                if (!user.is_profile_complete && window.location.pathname !== '/profile-setup') {
                    window.location.href = '/profile-setup';
                    return;
                }
                setIsAllowed(true);
            } catch (err) {
                localStorage.removeItem('token');
                setIsAllowed(false);
            }
            setLoading(false);
        };
        checkAuth();
    }, [token]);

    if (loading) return <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-slate-400 font-sans">Authenticating...</div>;
    if (!isAllowed) return <Navigate to="/login" replace />;

    return children;
}

function DashboardLayout({ children, pageTitle = 'Workspace' }) {
    const [user, setUser] = useState(null);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    useEffect(() => {
        authService.getMe().then(setUser).catch(() => null);
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (e) {
            console.error("Logout request error:", e);
        } finally {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
    };

    const navSections = [
        {
            group: 'Overview',
            items: [
                { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/dashboard' }
            ]
        },
        {
            group: 'Discover',
            items: [
                { icon: <Briefcase size={18} />, label: 'Jobs Hub', path: '/jobs' },
                { icon: <Trophy size={18} />, label: 'Matches', path: '/matches' }
            ]
        },
        {
            group: 'Manage',
            items: [
                { icon: <Clock size={18} />, label: 'Tracker', path: '/tracker' },
                { icon: <FileText size={18} />, label: 'Resume Hub', path: '/resume-hub' }
            ]
        },
        {
            group: 'Account',
            items: [
                { icon: <SettingsIcon size={18} />, label: 'Settings', path: '/settings' }
            ]
        }
    ];

    const getInitials = (name) => {
        if (!name) return 'JS';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-indigo-500/30">
            {/* Desktop Sidebar (Fixed / Sticky) */}
            <aside className="hidden md:flex w-64 glass-card m-4 mr-0 rounded-3xl flex-col p-6 space-y-6 h-[calc(100vh-2rem)] sticky top-4 border-slate-800 bg-slate-950/80">
                <Link to="/dashboard" className="flex items-center gap-3 px-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl p-1">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <span className="text-lg font-extrabold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent block leading-tight">
                            Job Seer
                        </span>
                        <span className="text-[10px] text-slate-500 block font-mono">Workspace v2</span>
                    </div>
                </Link>

                <nav className="flex-1 space-y-6 overflow-y-auto pr-1">
                    {navSections.map((sec) => (
                        <div key={sec.group} className="space-y-1.5">
                            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 block">{sec.group}</span>
                            {sec.items.map((item) => {
                                const isActive = window.location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 relative ${isActive
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                                            }`}
                                    >
                                        {isActive && (
                                            <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full"></span>
                                        )}
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                    {/* User Identity Chip */}
                    <div className="flex items-center gap-3 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                            {getInitials(user?.full_name)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{user?.full_name || 'Candidate'}</p>
                            <p className="text-[10px] text-slate-500 truncate">{user?.email || 'Logged in'}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Top Header */}
            <header className="md:hidden flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-40">
                <Link to="/dashboard" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                        <Sparkles size={16} className="text-white" />
                    </div>
                    <span className="text-base font-bold text-white">Job Seer</span>
                </Link>

                <button
                    onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                    className="p-2 text-slate-400 hover:text-white rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    aria-label="Toggle mobile menu"
                >
                    {mobileDrawerOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </header>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {mobileDrawerOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden bg-slate-950/95 border-b border-slate-800 p-6 space-y-4 fixed top-[65px] left-0 w-full z-40 shadow-2xl"
                    >
                        <nav className="space-y-4">
                            {navSections.map(sec => (
                                <div key={sec.group} className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block px-2">{sec.group}</span>
                                    {sec.items.map(item => (
                                        <Link
                                            key={item.label}
                                            to={item.path}
                                            onClick={() => setMobileDrawerOpen(false)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${window.location.pathname === item.path
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-slate-400 hover:bg-slate-900'
                                                }`}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </nav>

                        <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                            <span className="text-xs text-slate-400">{user?.full_name}</span>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 bg-rose-500/10 text-rose-400 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                            >
                                <LogOut size={14} /> Sign Out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Workspace Body */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl">
                {children}
            </main>
        </div>
    );
}

export default App;
