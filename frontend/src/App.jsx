import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Briefcase, FileText, LayoutDashboard, Clock, Trophy, LogOut, Settings as SettingsIcon, Sparkles } from 'lucide-react';

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

import Lenis from 'lenis'

function App() {
    useEffect(() => {
        const lenis = new Lenis()

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
    }, [])

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />

                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <DashboardLayout><Dashboard /></DashboardLayout>
                    </ProtectedRoute>
                } />

                <Route path="/jobs" element={
                    <ProtectedRoute>
                        <DashboardLayout><JobsHub /></DashboardLayout>
                    </ProtectedRoute>
                } />

                <Route path="/tracker" element={
                    <ProtectedRoute>
                        <DashboardLayout><Tracker /></DashboardLayout>
                    </ProtectedRoute>
                } />

                <Route path="/matches" element={
                    <ProtectedRoute>
                        <DashboardLayout><Matches /></DashboardLayout>
                    </ProtectedRoute>
                } />

                <Route path="/resume-hub" element={
                    <ProtectedRoute>
                        <DashboardLayout><ResumeHub /></DashboardLayout>
                    </ProtectedRoute>
                } />

                <Route path="/settings" element={
                    <ProtectedRoute>
                        <DashboardLayout><Settings /></DashboardLayout>
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
                // Redirect to profile setup if not complete (unless already there)
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

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Authenticating...</div>;
    if (!isAllowed) return <Navigate to="/login" replace />;

    return children;
}

function DashboardLayout({ children }) {
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

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <Briefcase size={20} />, label: 'Jobs Hub', path: '/jobs' },
        { icon: <Trophy size={20} />, label: 'Matches', path: '/matches' },
        { icon: <Clock size={20} />, label: 'Tracker', path: '/tracker' },
        { icon: <FileText size={20} />, label: 'Resume Hub', path: '/resume-hub' },
        { icon: <SettingsIcon size={20} />, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="min-h-screen flex text-slate-200">
            {/* Sidebar */}
            <aside className="w-64 glass-card m-4 mr-0 rounded-3xl flex flex-col p-6 space-y-8 h-[calc(100vh-2rem)] sticky top-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent block leading-tight">
                            Job Seer
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium block">Intelligent Companion</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${window.location.pathname === item.path
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 translate-x-1'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

export default App;
