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
import AtsPortal from './pages/AtsPortal';
import Settings from './pages/Settings';
import JobsHub from './pages/JobsHub';
import { authService } from './services/api';
import Logo from './components/Logo';

import Lenis from 'lenis';

function App() {
    useEffect(() => {
        try {
            const lenis = new Lenis();

            let reqId;
            function raf(time) {
                lenis.raf(time);
                reqId = requestAnimationFrame(raf);
            }

            reqId = requestAnimationFrame(raf);

            return () => {
                if (reqId) cancelAnimationFrame(reqId);
                try { lenis.destroy(); } catch (e) {}
            };
        } catch (e) {
            console.warn("Smooth scroll initialization skipped:", e);
        }
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
                        <DashboardLayout pageTitle="Semantic Matches"><Matches /></DashboardLayout>
                    </ProtectedRoute>
                } />

                <Route path="/resume" element={
                    <ProtectedRoute>
                        <DashboardLayout pageTitle="Resume Hub"><ResumeHub /></DashboardLayout>
                    </ProtectedRoute>
                } />

                <Route path="/ats-portal" element={
                    <ProtectedRoute>
                        <DashboardLayout pageTitle="ATS Standard Studio"><AtsPortal /></DashboardLayout>
                    </ProtectedRoute>
                } />

                <Route path="/settings" element={
                    <ProtectedRoute>
                        <DashboardLayout pageTitle="Settings & Preferences"><Settings /></DashboardLayout>
                    </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

// Global Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await authService.getCurrentUser();
                setIsAuthenticated(!!user);
            } catch (err) {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Sidebar Layout Wrapper for Authenticated Pages
const DashboardLayout = ({ children, pageTitle }) => {
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        authService.getCurrentUser().then(setUser).catch(() => { });
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
            window.location.href = '/login';
        } catch (err) {
            console.error('Logout error:', err);
            window.location.href = '/login';
        }
    };

    const navSections = [
        {
            group: 'Explore & Match',
            items: [
                { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/dashboard' },
                { icon: <Briefcase size={18} />, label: 'Live Jobs Hub', path: '/jobs' },
                { icon: <Trophy size={18} />, label: 'Matches', path: '/matches' },
            ]
        },
        {
            group: 'Resume & Materials',
            items: [
                { icon: <FileText size={18} />, label: 'Resume Hub', path: '/resume' },
                { icon: <Sparkles size={18} />, label: 'ATS Standard Studio', path: '/ats-portal' },
            ]
        },
        {
            group: 'Manage & Plan',
            items: [
                { icon: <Clock size={18} />, label: 'Application Tracker', path: '/tracker' },
                { icon: <SettingsIcon size={18} />, label: 'Settings', path: '/settings' },
            ]
        }
    ];

    const getInitials = (name) => {
        if (!name) return 'JS';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col md:flex-row font-sans selection:bg-indigo-500/20">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 m-4 mr-0 rounded-2xl flex-col p-5 space-y-6 h-[calc(100vh-2rem)] sticky top-4 border border-slate-200/90 bg-white shadow-xs">
                <div className="flex items-center px-1">
                    <Link to="/dashboard" className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl p-1">
                        <Logo size="md" subtext="Workspace v2.2" />
                    </Link>
                </div>

                <nav className="flex-1 space-y-5 overflow-y-auto pr-1">
                    {navSections.map((sec) => (
                        <div key={sec.group} className="space-y-1">
                            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 block">{sec.group}</span>
                            {sec.items.map((item) => {
                                const isActive = window.location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${isActive
                                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                <div className="pt-4 border-t border-slate-200 space-y-3">
                    {/* User Identity Chip */}
                    <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
                            {getInitials(user?.full_name)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{user?.full_name || 'Candidate'}</p>
                            <p className="text-[10px] text-slate-500 truncate">{user?.email || 'Logged in'}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Top Header */}
            <header className="md:hidden flex justify-between items-center px-5 py-2.5 border-b border-slate-200 bg-white/95 backdrop-blur-xl sticky top-0 z-40">
                <Link to="/dashboard" className="flex items-center">
                    <Logo size="sm" />
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                        className="p-2 text-slate-600 hover:text-slate-900 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        aria-label="Toggle mobile menu"
                    >
                        {mobileDrawerOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </header>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {mobileDrawerOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden bg-white border-b border-slate-200 p-6 space-y-4 fixed top-[65px] left-0 w-full z-40 shadow-xl"
                    >
                        <nav className="space-y-4">
                            {navSections.map(sec => (
                                <div key={sec.group} className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2">{sec.group}</span>
                                    {sec.items.map(item => (
                                        <Link
                                            key={item.label}
                                            to={item.path}
                                            onClick={() => setMobileDrawerOpen(false)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${window.location.pathname === item.path
                                                ? 'bg-indigo-50 text-indigo-700 font-bold'
                                                : 'text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </nav>

                        <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-xs text-slate-600">{user?.full_name}</span>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                            >
                                <LogOut size={14} /> Sign Out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Workspace Body */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto w-full min-w-0 max-w-[1720px] mx-auto">
                {children}
            </main>
        </div>
    );
}

export default App;
