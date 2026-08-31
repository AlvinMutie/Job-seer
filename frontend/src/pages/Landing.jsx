import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Target, Sparkles, Clock, ChevronRight, Upload, Search, FileText, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import SpotlightCard from '../components/SpotlightCard';

function Landing() {
    return (
        <div className="min-h-screen bg-[#0f1118] text-white selection:bg-indigo-500/30 font-sans">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 px-8 py-4 flex justify-between items-center bg-[#0f1118]/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Sparkles size={22} className="text-white" />
                    </div>
                    <div>
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">Job Seer</span>
                        <span className="block text-[10px] text-slate-400 font-medium -mt-1">Intelligent Companion</span>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <Link to="/login" className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors">Login</Link>
                    <Link to="/register" className="px-6 py-2.5 text-sm font-bold bg-white text-slate-950 rounded-full hover:bg-slate-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 px-8 flex flex-col items-center text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/10 blur-[140px] rounded-full -z-10 animate-pulse-slow"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="badge badge-indigo text-xs py-1 px-4 mb-6 inline-flex items-center gap-1.5">
                        <Sparkles size={14} className="text-amber-400" /> Your Intelligent Job Search Companion
                    </span>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 max-w-5xl leading-[1.05]">
                        Stop Applying Blindly. <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            See the Match with Job Seer.
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed mx-auto">
                        The AI-powered career acceleration companion that analyzes your resume, evaluates ATS health, matches you with the perfect roles, formats multi-tone cover letters, and tracks your success.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <Link to="/register" className="btn-primary py-4 px-10 text-lg rounded-full shadow-xl shadow-indigo-500/20">
                            Launch Job Seer <ChevronRight size={20} />
                        </Link>
                    </div>
                </motion.div>

                {/* Dashboard Visualization */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mt-24 p-2 rounded-3xl bg-gradient-to-b from-white/10 to-transparent max-w-5xl w-full border border-white/5 relative shadow-2xl shadow-indigo-900/40"
                >
                    <div className="absolute inset-0 bg-slate-950/80 rounded-3xl -z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2670"
                        alt="Job Seer Command Center Preview"
                        className="rounded-2xl opacity-90 object-cover h-[500px] w-full"
                    />
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-8 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-16">Designed for Modern Job Seekers</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <SpotlightCard className="p-8">
                        <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                            <Target size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Explainable V2 AI Match Score</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Multi-factor scoring analyzing skills fit, content vector similarity, experience level alignment, and role title overlap.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard className="p-8">
                        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                            <Sparkles size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">ATS Health & Tailoring</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Evaluate document ATS readiness (0-100), receive domain skill categorization, and generate factual line-by-line tailored CV versions.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard className="p-8">
                        <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center mb-6">
                            <Clock size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Kanban Pipeline Board</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            HTML5 drag-and-drop application pipeline workspace tracking interview dates, follow-up reminders, and application links.
                        </p>
                    </SpotlightCard>
                </div>
            </section>
        </div>
    );
}

export default Landing;
