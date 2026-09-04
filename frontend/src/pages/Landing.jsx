import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Sparkles, Target, Clock, ChevronRight, FileText,
    CheckCircle2, ShieldCheck, ArrowRight, Layers,
    Zap, BarChart3, ChevronDown, Check, X, Menu,
    TrendingUp, Compass, Award, ExternalLink, SlidersHorizontal,
    Database, Cpu, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import SpotlightCard from '../components/SpotlightCard';

function Landing() {
    // State for Mobile Navigation Drawer
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // State for Hero Product Preview Tab
    const [activeTab, setActiveTab] = useState('match');

    // State for FAQ Accordion
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqItems = [
        {
            q: "How does Job Seer's ATS Health Check evaluate my resume?",
            a: "Job Seer parses PDF, DOCX, and TXT resumes through a 10-layer security boundary. It checks structural readability, section completeness, contact details, formatting safety, and categorizes technical skills across 7 domains (languages, frontend, backend, databases, cloud, data/AI, tools)."
        },
        {
            q: "Does the Resume Tailoring feature hallucinate experience?",
            a: "No. Job Seer enforces strict factual integrity. The tailoring engine only restructures and emphasizes your real technical skills and metrics to match target job descriptions without inventing false jobs, degrees, or experience."
        },
        {
            q: "How does the V2 Explainable Match Score work?",
            a: "Unlike black-box ATS algorithms, Job Seer provides an explainable 4-factor score: Skills Overlap (40%), TF-IDF Content Vector Similarity (30%), Experience Level Alignment (15%), and Role Title Matching (15%) with complete rationale and missing skill chips."
        },
        {
            q: "Is my resume and job search data private?",
            a: "Yes. All user data is isolated per account using strict database resource-owner boundaries. Your resume content is never sold or used for public AI training."
        },
        {
            q: "Can I export my tailored resumes and cover letters?",
            a: "Tailored resume versions and multi-tone cover letters (Professional, Executive, Enthusiastic, Technical) can be copied to your clipboard or exported with line-by-line diff tracking."
        }
    ];

    return (
        <div className="min-h-screen bg-[#080d1a] text-slate-100 font-sans selection:bg-indigo-500/30 relative overflow-x-hidden">
            {/* Ambient Lighting Gradients */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
            <div className="absolute top-[25%] right-0 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none translate-x-1/4" />
            <div className="absolute top-[65%] left-[5%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

            {/* 1. Header / Navigation — Material 3 Top App Bar */}
            <header className="fixed top-0 w-full z-50 px-6 sm:px-10 lg:px-16 xl:px-20 py-4 bg-[#080d1a]/90 backdrop-blur-xl border-b border-slate-800/80 transition-all">
                <div className="max-w-[1680px] mx-auto flex justify-between items-center">
                    {/* Brand Wordmark */}
                    <Link to="/" className="flex items-center gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl p-1">
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-md shadow-indigo-600/25 group-hover:scale-105 transition-transform">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">
                            Job Seer
                        </span>
                    </Link>

                    {/* Navigation Anchor Links (Desktop) */}
                    <nav className="hidden md:flex items-center gap-9 text-sm font-medium text-slate-400">
                        <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#why-job-seer" className="hover:text-white transition-colors">Why Job Seer</a>
                        <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                    </nav>

                    {/* Header Action Buttons (Desktop) */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login">
                            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">Sign In</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="primary" size="sm" icon={ChevronRight} className="shadow-indigo-600/20">Get Started</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation Drawer */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden pt-4 pb-6 px-4 border-t border-slate-800/80 mt-4 space-y-4"
                        >
                            <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-300">
                                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="hover:text-white p-2">How It Works</a>
                                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-white p-2">Features</a>
                                <a href="#why-job-seer" onClick={() => setMobileMenuOpen(false)} className="hover:text-white p-2">Why Job Seer</a>
                                <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-white p-2">FAQ</a>
                            </nav>
                            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="secondary" className="w-full">Sign In</Button>
                                </Link>
                                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="primary" className="w-full">Get Started</Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* 2. Hero Section — Left-to-Right Material 3 Hero */}
            <section className="relative pt-32 sm:pt-36 lg:pt-40 pb-20 px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1680px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-16 items-center text-left">
                    {/* Left Column (Hero Typography & Core Actions) */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-6 xl:col-span-6 flex flex-col items-start"
                    >
                        {/* M3 Filter/Assist Pill Chip */}
                        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-indigo-400" />
                            <span>Intelligent Career Search Platform</span>
                        </div>

                        {/* M3 Display Large Typography */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-white">
                            Intelligent career search with <span className="text-indigo-400">explainable fit.</span>
                        </h1>

                        {/* M3 Body Large */}
                        <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mb-8 leading-relaxed">
                            Job Seer evaluates ATS resume health, computes explainable 4-factor compatibility scores, generates factual tailored CV versions, and organizes your full application pipeline in one workspace.
                        </p>

                        {/* Primary & Secondary Action Group */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
                            <Link to="/register" className="w-full sm:w-auto">
                                <Button variant="primary" size="lg" icon={ArrowRight} className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold shadow-lg shadow-indigo-600/25">
                                    Get Started
                                </Button>
                            </Link>
                            <a href="#how-it-works" className="w-full sm:w-auto">
                                <Button variant="secondary" size="lg" icon={ChevronRight} className="w-full sm:w-auto px-7 py-3.5 text-base font-medium">
                                    How It Works
                                </Button>
                            </a>
                        </div>

                        {/* Technical Integrity Metrics */}
                        <div className="grid grid-cols-3 gap-3.5 sm:gap-4 w-full pt-6 border-t border-slate-800">
                            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                                <div className="text-2xl font-bold text-white tracking-tight">4-Factor</div>
                                <div className="text-xs text-slate-400 mt-1">Explainable AI Fit</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                                <div className="text-2xl font-bold text-emerald-400 tracking-tight">90%+</div>
                                <div className="text-xs text-slate-400 mt-1">ATS Scan Readiness</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                                <div className="text-2xl font-bold text-indigo-400 tracking-tight">100%</div>
                                <div className="text-xs text-slate-400 mt-1">Factual Integrity</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column (Live Product Workspace Mockup) */}
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-6 xl:col-span-6 w-full"
                    >
                        <Card variant="elevated" className="p-6 sm:p-7 text-left border-slate-800 bg-slate-950/90 backdrop-blur-2xl shadow-xl relative rounded-3xl">
                            {/* Window Header */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-800 gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                                    <span className="text-xs text-slate-400 font-mono ml-2">Job Seer Workspace</span>
                                </div>

                                {/* Preview Mode Switcher */}
                                <div className="flex flex-wrap gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                                    <button
                                        onClick={() => setActiveTab('match')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'match' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                                    >
                                        <Target size={13} /> Match Fit
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('ats')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'ats' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                                    >
                                        <ShieldCheck size={13} /> ATS Scan
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('tailor')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'tailor' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                                    >
                                        <FileText size={13} /> Tailor CV
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('kanban')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'kanban' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                                    >
                                        <Clock size={13} /> Tracker
                                    </button>
                                </div>
                            </div>

                            {/* Tab Content Panels */}
                            <div className="pt-5 min-h-[300px]">
                                {activeTab === 'match' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="flex justify-between items-center p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl">
                                            <div>
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Target Match</div>
                                                <div className="text-base font-bold text-white">Staff Software Engineer &bull; Stripe</div>
                                                <div className="text-xs text-slate-400 mt-0.5">San Francisco, CA (Hybrid) &bull; $210k - $250k</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-extrabold text-emerald-400">92%</div>
                                                <div className="text-[10px] text-slate-400 font-medium">Explainable Score</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800">
                                                <div className="text-xs text-slate-400">Skills Overlap (40%)</div>
                                                <div className="text-lg font-bold text-indigo-400 mt-1">94%</div>
                                                <div className="text-[10px] text-emerald-400 mt-0.5">8 of 9 required skills matched</div>
                                            </div>
                                            <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800">
                                                <div className="text-xs text-slate-400">TF-IDF Vector (30%)</div>
                                                <div className="text-lg font-bold text-purple-400 mt-1">88%</div>
                                                <div className="text-[10px] text-purple-300 mt-0.5">High semantic relevance</div>
                                            </div>
                                            <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800">
                                                <div className="text-xs text-slate-400">Experience Fit (15%)</div>
                                                <div className="text-lg font-bold text-cyan-400 mt-1">95%</div>
                                                <div className="text-[10px] text-cyan-300 mt-0.5">Senior level alignment</div>
                                            </div>
                                            <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800">
                                                <div className="text-xs text-slate-400">Title Relevance (15%)</div>
                                                <div className="text-lg font-bold text-emerald-400 mt-1">90%</div>
                                                <div className="text-[10px] text-emerald-300 mt-0.5">Exact engineering domain</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'ats' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="flex items-center justify-between p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl">
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-11 h-11 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-lg">
                                                    96%
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white">ATS Document Readiness</div>
                                                    <div className="text-xs text-slate-400">Structural integrity, section headers & font safety verified.</div>
                                                </div>
                                            </div>
                                            <Badge variant="emerald" size="sm">Passed Scan</Badge>
                                        </div>

                                        <div className="space-y-2.5 text-xs">
                                            <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center justify-between">
                                                <span className="text-slate-300 font-medium">Contact Details & Section Hierarchy</span>
                                                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                                                    <Check size={15} /> 100% Complete
                                                </span>
                                            </div>
                                            <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center justify-between">
                                                <span className="text-slate-300 font-medium">Categorized Skills Breakdown</span>
                                                <span className="text-indigo-300 font-semibold">7 / 7 Technical Domains</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'tailor' && (
                                    <div className="space-y-3.5 animate-fade-in font-mono text-xs">
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="font-bold text-indigo-400">Factual Diff Viewer (v2)</span>
                                            <span className="text-emerald-400 font-semibold">Fact-Preserving Mode Active</span>
                                        </div>
                                        <div className="text-rose-300 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 leading-relaxed">
                                            - Built features for internal web applications using React and Node.
                                        </div>
                                        <div className="text-emerald-300 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 leading-relaxed">
                                            + Engineered scalable React web applications and Node microservices, reducing API response times by 32% across 1M+ daily queries.
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'kanban' && (
                                    <div className="grid grid-cols-3 gap-3 animate-fade-in">
                                        <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
                                            <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-blue-400" /> Applied (2)
                                            </div>
                                            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                                                <div className="font-bold text-white truncate">Stripe</div>
                                                <div className="text-[10px] text-slate-400">Staff Engineer</div>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
                                            <div className="text-[11px] font-bold text-indigo-400 mb-2 flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-indigo-400" /> Interview (1)
                                            </div>
                                            <div className="p-2.5 bg-slate-950 rounded-xl border border-indigo-500/30 text-xs">
                                                <div className="font-bold text-white truncate">Vercel</div>
                                                <div className="text-[10px] text-indigo-300">Tech Screen</div>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
                                            <div className="text-[11px] font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400" /> Offer (1)
                                            </div>
                                            <div className="p-2.5 bg-slate-950 rounded-xl border border-emerald-500/30 text-xs">
                                                <div className="font-bold text-white truncate">Datadog</div>
                                                <div className="text-[10px] text-emerald-300">Offer Review</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* 3. Value Strip (Material 3 Surface Containers) */}
            <section className="py-14 px-6 sm:px-10 lg:px-16 xl:px-20 border-y border-slate-800/80 bg-slate-950/40">
                <div className="max-w-[1680px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 bg-indigo-600/10 text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-500/20">
                            <Target size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">AI Job Matching</h4>
                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Discover roles aligned with your exact technical skillset.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 bg-emerald-600/10 text-emerald-400 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/20">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">ATS Document Health</h4>
                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Verify parseability, layout safety, and keyword coverage.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 bg-cyan-600/10 text-cyan-400 rounded-2xl flex items-center justify-center shrink-0 border border-cyan-500/20">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">Application Pipeline</h4>
                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Organize status stages with drag-and-drop clarity.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 bg-purple-600/10 text-purple-400 rounded-2xl flex items-center justify-center shrink-0 border border-purple-500/20">
                            <Layers size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">Isolated Security</h4>
                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Strict account isolation and private data boundaries.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Problem & Solution Section */}
            <section id="why-job-seer" className="py-24 px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1680px] mx-auto text-left">
                <div className="mb-14">
                    <Badge variant="amber" size="sm" className="mb-3">THE HIRING REALITY</Badge>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                        Searching for a job shouldn't feel like guessing.
                    </h2>
                    <p className="text-slate-400 max-w-3xl mt-3 text-sm sm:text-base leading-relaxed">
                        Traditional job applications force candidates to navigate opaque ATS scanners, repetitive manual tailoring, and messy tracking spreadsheets.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Without Job Seer */}
                    <Card variant="flat" className="p-8 sm:p-10 border-rose-500/20 bg-slate-950/60 rounded-3xl">
                        <div className="flex items-center gap-3.5 mb-6">
                            <div className="w-11 h-11 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center font-bold border border-rose-500/20">
                                <X size={22} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Without Job Seer</h3>
                        </div>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex items-start gap-3">
                                <X size={18} className="text-rose-400 shrink-0 mt-0.5" />
                                <span>Submitting generic resumes without knowing if technical skills align</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X size={18} className="text-rose-400 shrink-0 mt-0.5" />
                                <span>Getting quietly filtered out by unreadable ATS formatting structures</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X size={18} className="text-rose-400 shrink-0 mt-0.5" />
                                <span>Spending hours manually tailoring repetitive cover letters</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X size={18} className="text-rose-400 shrink-0 mt-0.5" />
                                <span>Losing track of application dates, recruiter follow-ups, and links</span>
                            </li>
                        </ul>
                    </Card>

                    {/* With Job Seer */}
                    <Card variant="elevated" className="p-8 sm:p-10 border-indigo-500/30 bg-indigo-950/20 shadow-lg rounded-3xl">
                        <div className="flex items-center gap-3.5 mb-6">
                            <div className="w-11 h-11 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center font-bold border border-emerald-500/30">
                                <Check size={22} />
                            </div>
                            <h3 className="text-xl font-bold text-white">With Job Seer Workspace</h3>
                        </div>
                        <ul className="space-y-4 text-sm text-slate-200">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                <span>Seeing exact V2 Explainable Match percentages across 4 dimensions</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                <span>Evaluating ATS health (0-100) and receiving domain skill recommendations</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                <span>Generating factual tailored resume bullets and multi-tone cover letters</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                <span>Managing application status on an interactive drag-and-drop Kanban board</span>
                            </li>
                        </ul>
                    </Card>
                </div>
            </section>

            {/* 5. How It Works (5-Step Progression) */}
            <section id="how-it-works" className="py-24 px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1680px] mx-auto border-t border-slate-800/60 text-left">
                <div className="mb-14">
                    <Badge variant="indigo" size="sm" className="mb-3">FIVE-STEP WORKFLOW</Badge>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                        How Job Seer Streamlines Your Search
                    </h2>
                    <p className="text-slate-400 max-w-3xl mt-3 text-sm sm:text-base leading-relaxed">
                        A systematic sequence designed to move candidates from initial profile setup to tracked interviews and accepted job offers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
                    <Card variant="glass" className="p-6 relative rounded-3xl">
                        <div className="text-xs font-mono font-bold text-indigo-400 mb-3">01</div>
                        <h3 className="text-base font-bold text-white mb-2">Build Profile</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Define technical skills, experience level, and preferred career roles.
                        </p>
                    </Card>

                    <Card variant="glass" className="p-6 relative rounded-3xl">
                        <div className="text-xs font-mono font-bold text-purple-400 mb-3">02</div>
                        <h3 className="text-base font-bold text-white mb-2">Discover Openings</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Explore openings and analyze compatibility using V2 Explainable Scoring.
                        </p>
                    </Card>

                    <Card variant="glass" className="p-6 relative rounded-3xl">
                        <div className="text-xs font-mono font-bold text-cyan-400 mb-3">03</div>
                        <h3 className="text-base font-bold text-white mb-2">Tailor Materials</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Generate tailored CV bullet versions and multi-tone cover letters.
                        </p>
                    </Card>

                    <Card variant="glass" className="p-6 relative rounded-3xl">
                        <div className="text-xs font-mono font-bold text-emerald-400 mb-3">04</div>
                        <h3 className="text-base font-bold text-white mb-2">Apply Confidently</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Submit application materials backed by 90%+ ATS document health checks.
                        </p>
                    </Card>

                    <Card variant="glass" className="p-6 relative rounded-3xl">
                        <div className="text-xs font-mono font-bold text-amber-400 mb-3">05</div>
                        <h3 className="text-base font-bold text-white mb-2">Track Pipeline</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Track progress on the Kanban board with timeline logging and follow-ups.
                        </p>
                    </Card>
                </div>
            </section>

            {/* 6. Built-in Features (Bento Spotlight Grid) */}
            <section id="features" className="py-24 px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1680px] mx-auto border-t border-slate-800/60 text-left">
                <div className="mb-14">
                    <Badge variant="indigo" size="sm" className="mb-3">BUILT-IN CAPABILITIES</Badge>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                        Engineered for Modern Job Seekers
                    </h2>
                    <p className="text-slate-400 max-w-3xl mt-3 text-sm sm:text-base leading-relaxed">
                        Comprehensive capabilities designed to give candidates a decisive advantage across every phase of hiring.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <SpotlightCard className="p-8 rounded-3xl">
                        <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20">
                            <Target size={22} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-white">Explainable V2 AI Match</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Transparent breakdown analyzing Skills (40%), Content (30%), Experience (15%), and Title (15%) with matched & missing skill chips.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard className="p-8 rounded-3xl">
                        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
                            <ShieldCheck size={22} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-white">Resume Intelligence & ATS Health</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Evaluate document ATS readiness (0-100), verify contact information, and categorize skills across 7 technical domains.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard className="p-8 rounded-3xl">
                        <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20">
                            <Sparkles size={22} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-white">Factual CV Tailoring</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Generate versioned resume tailoring with factual integrity guarantees, preserving truth while maximizing target keyword relevance.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard className="p-8 rounded-3xl">
                        <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
                            <FileText size={22} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-white">Multi-Tone Cover Letters</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Generate cover letters tailored to target hiring managers in 4 selectable tones: Professional, Executive, Enthusiastic, and Technical.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard className="p-8 rounded-3xl">
                        <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20">
                            <Clock size={22} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-white">Kanban Pipeline Board</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Drag-and-drop tracking pipeline managing 5 status stages with optimistic updates, timeline logging, and direct links.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard className="p-8 rounded-3xl">
                        <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mb-6 border border-rose-500/20">
                            <BarChart3 size={22} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-white">Command Center Analytics</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Real-time career intelligence featuring KPI stat cards, ATS health scores, application stage breakdown, and curated job matches.
                        </p>
                    </SpotlightCard>
                </div>
            </section>

            {/* 7. FAQ Accordion */}
            <section id="faq" className="py-24 px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1680px] mx-auto border-t border-slate-800/60 text-left">
                <div className="mb-14 max-w-3xl">
                    <Badge variant="indigo" size="sm" className="mb-3">GOT QUESTIONS?</Badge>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
                        Answers to common questions regarding our explainable matching, ATS parsing, and privacy policies.
                    </p>
                </div>

                <div className="space-y-4 max-w-5xl">
                    {faqItems.map((item, index) => (
                        <Card key={index} variant="glass" className="overflow-hidden rounded-3xl">
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-slate-900/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                                <span className="font-bold text-white text-base md:text-lg">{item.q}</span>
                                <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 shrink-0 ${openFaq === index ? 'rotate-180 text-indigo-400' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {openFaq === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-slate-800/40 pt-4"
                                    >
                                        {item.a}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    ))}
                </div>
            </section>

            {/* 8. Call to Action Banner */}
            <section className="py-20 px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1680px] mx-auto">
                <Card variant="elevated" className="p-8 sm:p-12 lg:p-16 border-indigo-500/30 bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 relative overflow-hidden shadow-xl text-left rounded-3xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-8">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
                                Ready to take control of your career search?
                            </h2>
                            <p className="text-slate-300 max-w-2xl text-base sm:text-lg leading-relaxed">
                                Join Job Seer today. Evaluate your ATS resume health, discover high-compatibility matches, and track your applications in one unified space.
                            </p>
                        </div>
                        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5 justify-end">
                            <Link to="/register" className="w-full">
                                <Button variant="primary" size="lg" icon={ArrowRight} className="w-full justify-center py-4 text-base font-semibold shadow-lg shadow-indigo-600/25">
                                    Get Started
                                </Button>
                            </Link>
                            <Link to="/login" className="w-full">
                                <Button variant="secondary" size="lg" className="w-full justify-center py-4 text-base font-medium">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </section>

            {/* 9. Footer */}
            <footer className="py-12 px-6 sm:px-10 lg:px-16 xl:px-20 border-t border-slate-800/80 text-slate-500 text-xs">
                <div className="max-w-[1680px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-left">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <span className="text-base font-bold text-white">Job Seer</span>
                    </div>
                    <div>
                        &copy; {new Date().getFullYear()} Job Seer. All rights reserved.
                    </div>
                    <div className="flex gap-8 font-medium">
                        <a href="#how-it-works" className="hover:text-slate-300 transition-colors">How It Works</a>
                        <a href="#features" className="hover:text-slate-300 transition-colors">Features</a>
                        <a href="#why-job-seer" className="hover:text-slate-300 transition-colors">Why Job Seer</a>
                        <a href="#faq" className="hover:text-slate-300 transition-colors">FAQ</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
