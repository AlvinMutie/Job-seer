import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Sparkles, Target, Clock, ChevronRight, FileText,
    CheckCircle2, ShieldCheck, ArrowRight, Layers,
    Zap, BarChart3, ChevronDown, Check, X, Menu,
    TrendingUp, Compass, Award, ExternalLink, SlidersHorizontal,
    Database, Cpu, Lock, Scissors, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import SpotlightCard from '../components/SpotlightCard';
import ThemeToggle from '../components/ThemeToggle';

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
            a: "Job Seer parses PDF, DOCX, and TXT resumes through a 10-layer security boundary. It evaluates structural readability, section completeness, contact details, formatting safety, and categorizes technical skills across 7 domains (languages, frontend, backend, databases, cloud, data science, tools)."
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
            a: "Yes. All user data is isolated per account using strict database resource-owner boundaries. Your resume content is never sold or used for external model training."
        },
        {
            q: "Can I export my tailored resumes and cover letters?",
            a: "Tailored resume versions and multi-tone cover letters (Professional, Executive, Enthusiastic, Technical) can be copied to your clipboard or exported with line-by-line diff tracking."
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#030712] text-slate-950 dark:text-slate-100 font-sans selection:bg-indigo-500/30 relative overflow-x-hidden transition-colors duration-200">
            {/* Ambient Lighting Gradients */}
            <div className="absolute top-0 left-0 w-[550px] h-[550px] bg-indigo-200/50 dark:bg-indigo-950/40 rounded-full blur-[130px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
            <div className="absolute top-[25%] right-0 w-[650px] h-[650px] bg-cyan-200/40 dark:bg-cyan-950/30 rounded-full blur-[150px] pointer-events-none translate-x-1/4" />
            <div className="absolute top-[65%] left-[5%] w-[550px] h-[550px] bg-purple-200/40 dark:bg-purple-950/30 rounded-full blur-[140px] pointer-events-none" />

            {/* 1. Header / Navigation */}
            <header className="fixed top-0 w-full z-50 px-6 sm:px-10 lg:px-16 xl:px-20 py-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-all">
                <div className="max-w-[1680px] mx-auto flex justify-between items-center">
                    {/* Brand Wordmark */}
                    <Link to="/" className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl p-1">
                        <Logo size="lg" />
                    </Link>

                    {/* Navigation Anchor Links (Desktop) */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-700 dark:text-slate-300">
                        <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How It Works</a>
                        <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
                        <a href="#why-job-seer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Why Job Seer</a>
                        <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQ</a>
                    </nav>

                    {/* Header Action Buttons (Desktop) */}
                    <div className="hidden md:flex items-center gap-3">
                        <ThemeToggle />
                        <Link to="/login">
                            <Button variant="ghost" size="sm" className="text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white font-bold">Sign In</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="primary" size="sm" icon={ChevronRight} className="font-bold">Get Started</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle & Theme Toggle */}
                    <div className="flex items-center gap-2 md:hidden">
                        <ThemeToggle size="sm" />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden pt-4 pb-6 px-4 border-t border-slate-200 dark:border-slate-800 mt-4 space-y-4 bg-white dark:bg-slate-900"
                        >
                            <nav className="flex flex-col space-y-3 text-sm font-bold text-slate-800 dark:text-slate-200">
                                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="hover:text-indigo-600 p-2">How It Works</a>
                                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-indigo-600 p-2">Features</a>
                                <a href="#why-job-seer" onClick={() => setMobileMenuOpen(false)} className="hover:text-indigo-600 p-2">Why Job Seer</a>
                                <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-indigo-600 p-2">FAQ</a>
                            </nav>
                            <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="secondary" className="w-full font-bold">Sign In</Button>
                                </Link>
                                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="primary" className="w-full font-bold">Get Started</Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* 2. Hero Section */}
            <section className="relative pt-32 sm:pt-36 lg:pt-40 pb-20 px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1680px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-16 items-center text-left">
                    {/* Left Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-6 xl:col-span-6 flex flex-col items-start"
                    >
                        {/* Display Large Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-6 leading-[1.1] text-slate-950 dark:text-white">
                            Intelligent career search with{' '}
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                explainable fit.
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg lg:text-xl text-slate-700 dark:text-slate-300 font-semibold max-w-2xl mb-8 leading-relaxed">
                            Job Seer evaluates ATS resume health, computes explainable 4-factor compatibility scores, generates factual tailored CV versions, and organizes your full application pipeline in one workspace.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
                            <Link to="/register" className="w-full sm:w-auto">
                                <Button variant="primary" size="lg" icon={ArrowRight} className="w-full sm:w-auto px-8 py-4 text-base font-extrabold shadow-lg shadow-indigo-600/30">
                                    Get Started
                                </Button>
                            </Link>
                            <a href="#features" className="w-full sm:w-auto">
                                <Button variant="secondary" size="lg" icon={ChevronRight} className="w-full sm:w-auto px-7 py-4 text-base font-bold">
                                    Explore Features
                                </Button>
                            </a>
                        </div>

                        {/* Technical Integrity Metrics */}
                        <div className="grid grid-cols-3 gap-3.5 sm:gap-4 w-full pt-6 border-t border-slate-200 dark:border-slate-800">
                            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-slate-800 shadow-sm">
                                <div className="text-2xl sm:text-3xl font-black text-indigo-600 tracking-tight">4-Factor</div>
                                <div className="text-xs font-bold text-slate-700 dark:text-slate-400 mt-1">Explainable Match Fit</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-800 shadow-sm">
                                <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">90%+</div>
                                <div className="text-xs font-bold text-slate-700 dark:text-slate-400 mt-1">ATS Scan Readiness</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-slate-800 shadow-sm">
                                <div className="text-2xl sm:text-3xl font-black text-purple-600 tracking-tight">100%</div>
                                <div className="text-xs font-bold text-slate-700 dark:text-slate-400 mt-1">Factual Integrity</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column (Product Mockup) */}
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-6 xl:col-span-6 w-full"
                    >
                        <Card variant="elevated" className="p-6 sm:p-7 text-left border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl relative rounded-3xl">
                            {/* Window Header */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800 gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                    <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-bold ml-2">Job Seer Workspace</span>
                                </div>

                                {/* Mode Switcher */}
                                <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <button
                                        onClick={() => setActiveTab('match')}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'match' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'}`}
                                    >
                                        <Target size={13} /> Match Fit
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('ats')}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'ats' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'}`}
                                    >
                                        <ShieldCheck size={13} /> ATS Scan
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('tailor')}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'tailor' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'}`}
                                    >
                                        <Scissors size={13} /> Tailor CV
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('kanban')}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'kanban' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'}`}
                                    >
                                        <Clock size={13} /> Tracker
                                    </button>
                                </div>
                            </div>

                            {/* Tab Content Panels */}
                            <div className="pt-5 min-h-[320px]">
                                {activeTab === 'match' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="flex justify-between items-center p-4 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-2xl">
                                            <div>
                                                <div className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">Target Match</div>
                                                <div className="text-base font-extrabold text-slate-950 dark:text-white">Staff Software Engineer &bull; Stripe</div>
                                                <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">San Francisco, CA (Hybrid) &bull; $210k - $250k</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">92%</div>
                                                <div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">Explainable Fit</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-indigo-200 dark:border-slate-700">
                                                <div className="text-xs font-bold text-slate-700 dark:text-slate-400">Skills Overlap (40%)</div>
                                                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">94%</div>
                                                <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">8 of 9 required skills</div>
                                            </div>
                                            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-purple-200 dark:border-slate-700">
                                                <div className="text-xs font-bold text-slate-700 dark:text-slate-400">TF-IDF Vector (30%)</div>
                                                <div className="text-xl font-black text-purple-600 dark:text-purple-400 mt-1">88%</div>
                                                <div className="text-[10px] font-semibold text-purple-700 dark:text-purple-400 mt-0.5">High semantic relevance</div>
                                            </div>
                                            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-cyan-200 dark:border-slate-700">
                                                <div className="text-xs font-bold text-slate-700 dark:text-slate-400">Experience Fit (15%)</div>
                                                <div className="text-xl font-black text-cyan-600 dark:text-cyan-400 mt-1">95%</div>
                                                <div className="text-[10px] font-semibold text-cyan-700 dark:text-cyan-400 mt-0.5">Senior level alignment</div>
                                            </div>
                                            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-emerald-200 dark:border-slate-700">
                                                <div className="text-xs font-bold text-slate-700 dark:text-slate-400">Title Relevance (15%)</div>
                                                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">90%</div>
                                                <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">Exact engineering role</div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-1">
                                            <Link to="/matches">
                                                <Button variant="outline" size="sm" icon={ExternalLink} className="text-xs font-bold">
                                                    Open Explainable Engine
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'ats' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-md">
                                                    96%
                                                </div>
                                                <div>
                                                    <div className="text-sm font-extrabold text-slate-950 dark:text-white">ATS Document Readiness</div>
                                                    <div className="text-xs font-medium text-slate-600 dark:text-slate-400">Section headers, structure & font safety verified.</div>
                                                </div>
                                            </div>
                                            <span className="badge badge-emerald font-bold">Passed 10-Layer Scan</span>
                                        </div>

                                        <div className="space-y-2.5 text-xs">
                                            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                                <span className="text-slate-800 dark:text-slate-200 font-bold">Contact Details & Section Hierarchy</span>
                                                <span className="text-emerald-700 dark:text-emerald-400 font-extrabold flex items-center gap-1.5">
                                                    <Check size={16} /> 100% Complete
                                                </span>
                                            </div>
                                            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                                <span className="text-slate-800 dark:text-slate-200 font-bold">Categorized Skills Breakdown</span>
                                                <span className="text-indigo-700 dark:text-indigo-400 font-extrabold">7 / 7 Technical Domains</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-1">
                                            <Link to="/resume-hub">
                                                <Button variant="outline" size="sm" icon={ExternalLink} className="text-xs font-bold">
                                                    Scan Your Resume in Hub
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'tailor' && (
                                    <div className="space-y-3.5 animate-fade-in font-mono text-xs">
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="font-extrabold text-indigo-700 dark:text-indigo-400">Factual Diff Viewer (v2)</span>
                                            <span className="text-emerald-700 dark:text-emerald-400 font-bold">100% Truth Preservation</span>
                                        </div>
                                        <div className="text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-800 leading-relaxed font-medium">
                                            - Built features for internal web applications using React and Node.
                                        </div>
                                        <div className="text-emerald-900 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 leading-relaxed font-bold">
                                            + Engineered scalable React web applications and Node microservices, reducing API response times by 32% across 1M+ daily queries.
                                        </div>
                                        <div className="flex justify-end pt-1 font-sans">
                                            <Link to="/resume-hub">
                                                <Button variant="outline" size="sm" icon={ExternalLink} className="text-xs font-bold">
                                                    Launch Tailoring Studio
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'kanban' && (
                                    <div className="space-y-3 animate-fade-in">
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                                                <div className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500" /> Applied (2)
                                                </div>
                                                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs shadow-xs">
                                                    <div className="font-bold text-slate-950 dark:text-white truncate">Stripe</div>
                                                    <div className="text-[10px] text-slate-500 font-medium">Staff Engineer</div>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-indigo-200 dark:border-slate-700">
                                                <div className="text-[11px] font-extrabold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-1.5">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-600" /> Interview (1)
                                                </div>
                                                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-indigo-800 text-xs shadow-xs">
                                                    <div className="font-bold text-slate-950 dark:text-white truncate">Vercel</div>
                                                    <div className="text-[10px] text-indigo-700 dark:text-indigo-400 font-bold">Tech Screen &bull; Fri</div>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-emerald-200 dark:border-slate-700">
                                                <div className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-600" /> Offer (1)
                                                </div>
                                                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs shadow-xs">
                                                    <div className="font-bold text-slate-950 dark:text-white truncate">Datadog</div>
                                                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">Review Stage</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-1">
                                            <Link to="/tracker">
                                                <Button variant="outline" size="sm" icon={ExternalLink} className="text-xs font-bold">
                                                    Open Pipeline Tracker
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* 3. Value Strip */}
            <section className="py-14 px-6 sm:px-10 lg:px-16 xl:px-20 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                <div className="max-w-[1680px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800 shadow-sm">
                            <Target size={22} />
                        </div>
                        <div>
                            <h4 className="text-base font-extrabold text-slate-950 dark:text-white">Deterministic Job Matching</h4>
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">Discover roles aligned with your exact technical skillset and career level.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800 shadow-sm">
                            <ShieldCheck size={22} />
                        </div>
                        <div>
                            <h4 className="text-base font-extrabold text-slate-950 dark:text-white">ATS Document Health</h4>
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">Verify parseability, layout safety, and categorized skill coverage.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 rounded-2xl flex items-center justify-center shrink-0 border border-cyan-200 dark:border-cyan-800 shadow-sm">
                            <Clock size={22} />
                        </div>
                        <div>
                            <h4 className="text-base font-extrabold text-slate-950 dark:text-white">Application Pipeline</h4>
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">Organize interview dates, status stages, and links with Kanban clarity.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 rounded-2xl flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800 shadow-sm">
                            <Layers size={22} />
                        </div>
                        <div>
                            <h4 className="text-base font-extrabold text-slate-950 dark:text-white">Isolated Security</h4>
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">Strict account isolation and private data boundaries guaranteed.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Problem & Solution Section */}
            <section id="why-job-seer" className="py-24 px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1680px] mx-auto text-left">
                <div className="mb-14">
                    <Badge variant="amber" size="sm" className="mb-3">THE HIRING REALITY</Badge>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight">
                        Searching for a job shouldn't feel like guessing.
                    </h2>
                    <p className="text-slate-700 dark:text-slate-300 max-w-3xl mt-3 text-base font-semibold leading-relaxed">
                        Traditional job applications force candidates to navigate opaque ATS scanners, repetitive manual tailoring, and messy tracking spreadsheets.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Without Job Seer */}
                    <Card variant="flat" className="p-8 sm:p-10 border-rose-300 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 rounded-3xl shadow-sm">
                        <div className="flex items-center gap-3.5 mb-6">
                            <div className="w-11 h-11 bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 rounded-2xl flex items-center justify-center font-bold border border-rose-300 dark:border-rose-800">
                                <X size={22} />
                            </div>
                            <h3 className="text-xl font-black text-slate-950 dark:text-white">Without Job Seer</h3>
                        </div>
                        <ul className="space-y-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            <li className="flex items-start gap-3">
                                <X size={18} className="text-rose-600 shrink-0 mt-0.5" />
                                <span>Submitting generic resumes without knowing if technical skills align</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X size={18} className="text-rose-600 shrink-0 mt-0.5" />
                                <span>Getting quietly filtered out by unreadable ATS formatting structures</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X size={18} className="text-rose-600 shrink-0 mt-0.5" />
                                <span>Spending hours manually tailoring repetitive cover letters</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X size={18} className="text-rose-600 shrink-0 mt-0.5" />
                                <span>Losing track of application dates, recruiter follow-ups, and job links</span>
                            </li>
                        </ul>
                    </Card>

                    {/* With Job Seer */}
                    <Card variant="elevated" className="p-8 sm:p-10 border-indigo-300 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-md rounded-3xl">
                        <div className="flex items-center gap-3.5 mb-6">
                            <div className="w-11 h-11 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-2xl flex items-center justify-center font-bold border border-emerald-300 dark:border-emerald-800">
                                <Check size={22} />
                            </div>
                            <h3 className="text-xl font-black text-slate-950 dark:text-white">With Job Seer Workspace</h3>
                        </div>
                        <ul className="space-y-4 text-sm font-bold text-slate-800 dark:text-slate-200">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <span>Seeing exact V2 Explainable Match percentages across 4 dimensions</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <span>Evaluating ATS health (0-100) and receiving domain skill recommendations</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <span>Generating factual tailored resume bullets and multi-tone cover letters</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <span>Managing application status on an interactive drag-and-drop Kanban board</span>
                            </li>
                        </ul>
                    </Card>
                </div>
            </section>

            {/* 5. How It Works */}
            <section id="how-it-works" className="py-24 px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1680px] mx-auto border-t border-slate-200 dark:border-slate-800 text-left">
                <div className="mb-14">
                    <Badge variant="indigo" size="sm" className="mb-3">FIVE-STEP WORKFLOW</Badge>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight">
                        How Job Seer Streamlines Your Search
                    </h2>
                    <p className="text-slate-700 dark:text-slate-300 max-w-3xl mt-3 text-base font-semibold leading-relaxed">
                        A systematic sequence designed to move candidates from initial profile setup to tracked interviews and accepted job offers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
                    <div className="p-6 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-slate-800 rounded-3xl shadow-sm hover:border-indigo-400 transition-all">
                        <div className="text-xs font-mono font-black text-indigo-600 dark:text-indigo-400 mb-3">01</div>
                        <h3 className="text-base font-black text-slate-950 dark:text-white mb-2">Build Profile</h3>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                            Define technical skills, experience level, and preferred career roles.
                        </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-900 border border-purple-200 dark:border-slate-800 rounded-3xl shadow-sm hover:border-purple-400 transition-all">
                        <div className="text-xs font-mono font-black text-purple-600 dark:text-purple-400 mb-3">02</div>
                        <h3 className="text-base font-black text-slate-950 dark:text-white mb-2">Discover Openings</h3>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                            Explore openings and analyze compatibility using V2 Explainable Scoring.
                        </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-800 rounded-3xl shadow-sm hover:border-cyan-400 transition-all">
                        <div className="text-xs font-mono font-black text-cyan-600 dark:text-cyan-400 mb-3">03</div>
                        <h3 className="text-base font-black text-slate-950 dark:text-white mb-2">Tailor Materials</h3>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                            Generate tailored CV bullet versions and multi-tone cover letters.
                        </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-800 rounded-3xl shadow-sm hover:border-emerald-400 transition-all">
                        <div className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 mb-3">04</div>
                        <h3 className="text-base font-black text-slate-950 dark:text-white mb-2">Apply Confidently</h3>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                            Submit application materials backed by 90%+ ATS document health checks.
                        </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-800 rounded-3xl shadow-sm hover:border-amber-400 transition-all">
                        <div className="text-xs font-mono font-black text-amber-600 dark:text-amber-400 mb-3">05</div>
                        <h3 className="text-base font-black text-slate-950 dark:text-white mb-2">Track Pipeline</h3>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                            Track progress on the Kanban board with timeline logging and follow-ups.
                        </p>
                    </div>
                </div>
            </section>

            {/* 6. Built-in Features (Real & Working) */}
            <section id="features" className="py-24 px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1680px] mx-auto border-t border-slate-200 dark:border-slate-800 text-left">
                <div className="mb-14">
                    <Badge variant="indigo" size="sm" className="mb-3">BUILT-IN CAPABILITIES &bull; READY TO USE</Badge>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight">
                        Engineered for Modern Job Seekers
                    </h2>
                    <p className="text-slate-700 dark:text-slate-300 max-w-3xl mt-3 text-base font-semibold leading-relaxed">
                        Every feature highlighted below is fully functional and live in the Job Seer workspace. Click any card to experience it directly.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Feature 1: Matches */}
                    <div className="p-8 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-slate-800 rounded-3xl shadow-sm hover:border-indigo-400 hover:shadow-lg transition-all flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6 border border-indigo-200 dark:border-indigo-800 shadow-sm">
                                <Target size={22} />
                            </div>
                            <h3 className="text-lg font-black mb-2 text-slate-950 dark:text-white">Explainable 4-Factor Match</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium mb-6">
                                Transparent breakdown analyzing Skills (40%), Content (30%), Experience (15%), and Title (15%) with matched & missing skill chips.
                            </p>
                        </div>
                        <Link to="/matches" className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline">
                            <span>Open Match Engine</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Feature 2: ATS Health */}
                    <div className="p-8 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-800 rounded-3xl shadow-sm hover:border-emerald-400 hover:shadow-lg transition-all flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 border border-emerald-200 dark:border-emerald-800 shadow-sm">
                                <ShieldCheck size={22} />
                            </div>
                            <h3 className="text-lg font-black mb-2 text-slate-950 dark:text-white">Resume Intelligence & ATS Health</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium mb-6">
                                Evaluate document ATS readiness (0-100), verify contact information, and categorize skills across 7 technical domains.
                            </p>
                        </div>
                        <Link to="/resume-hub" className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline">
                            <span>Scan Resume in Hub</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Feature 3: Factual Tailoring */}
                    <div className="p-8 bg-white dark:bg-slate-900 border border-cyan-200 dark:border-slate-800 rounded-3xl shadow-sm hover:border-cyan-400 hover:shadow-lg transition-all flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 rounded-2xl flex items-center justify-center mb-6 border border-cyan-200 dark:border-cyan-800 shadow-sm">
                                <Scissors size={22} />
                            </div>
                            <h3 className="text-lg font-black mb-2 text-slate-950 dark:text-white">Factual CV Tailoring</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium mb-6">
                                Generate versioned resume tailoring with factual integrity guarantees, preserving truth while maximizing target keyword relevance.
                            </p>
                        </div>
                        <Link to="/resume-hub" className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold text-cyan-600 dark:text-cyan-400 hover:underline">
                            <span>Tailor for Open Roles</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Feature 4: Cover Letters */}
                    <div className="p-8 bg-white dark:bg-slate-900 border border-purple-200 dark:border-slate-800 rounded-3xl shadow-sm hover:border-purple-400 hover:shadow-lg transition-all flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6 border border-purple-200 dark:border-purple-800 shadow-sm">
                                <Mail size={22} />
                            </div>
                            <h3 className="text-lg font-black mb-2 text-slate-950 dark:text-white">Multi-Tone Cover Letters</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium mb-6">
                                Generate cover letters tailored to target hiring managers in 4 selectable tones: Professional, Executive, Enthusiastic, and Technical.
                            </p>
                        </div>
                        <Link to="/resume-hub" className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold text-purple-600 dark:text-purple-400 hover:underline">
                            <span>Format Cover Letter</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Feature 5: Kanban Board */}
                    <div className="p-8 bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-800 rounded-3xl shadow-sm hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6 border border-amber-200 dark:border-amber-800 shadow-sm">
                                <Clock size={22} />
                            </div>
                            <h3 className="text-lg font-black mb-2 text-slate-950 dark:text-white">Kanban Pipeline Board</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium mb-6">
                                Drag-and-drop tracking pipeline managing 5 status stages with optimistic updates, timeline logging, and direct links.
                            </p>
                        </div>
                        <Link to="/tracker" className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold text-amber-700 dark:text-amber-400 hover:underline">
                            <span>Manage Applications</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Feature 6: Command Center */}
                    <div className="p-8 bg-white dark:bg-slate-900 border border-rose-200 dark:border-slate-800 rounded-3xl shadow-sm hover:border-rose-400 hover:shadow-lg transition-all flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 rounded-2xl flex items-center justify-center mb-6 border border-rose-200 dark:border-rose-800 shadow-sm">
                                <BarChart3 size={22} />
                            </div>
                            <h3 className="text-lg font-black mb-2 text-slate-950 dark:text-white">Command Center & Jobs Hub</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium mb-6">
                                Real-time career intelligence featuring KPI stat cards, ATS health scores, application stage breakdown, and curated job matches.
                            </p>
                        </div>
                        <Link to="/dashboard" className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold text-rose-700 dark:text-rose-400 hover:underline">
                            <span>Open Dashboard</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 7. FAQ Accordion (Glitch-Free Smooth Animation) */}
            <section id="faq" className="py-24 px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1680px] mx-auto border-t border-slate-200 dark:border-slate-800 text-left">
                <div className="mb-14 max-w-3xl">
                    <Badge variant="indigo" size="sm" className="mb-3">GOT QUESTIONS?</Badge>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-700 dark:text-slate-300 mt-3 text-base font-semibold leading-relaxed">
                        Answers to common questions regarding our explainable matching, ATS parsing, and privacy policies.
                    </p>
                </div>

                <div className="space-y-4 max-w-5xl">
                    {faqItems.map((item, index) => (
                        <div key={`faq-${index}`} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
                            <button
                                type="button"
                                onClick={() => toggleFaq(index)}
                                className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                                <span className="font-extrabold text-slate-950 dark:text-white text-base md:text-lg">{item.q}</span>
                                <ChevronDown size={22} className={`text-slate-500 dark:text-slate-400 transition-transform duration-300 shrink-0 ${openFaq === index ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''}`} />
                            </button>
                            <AnimatePresence initial={false}>
                                {openFaq === index && (
                                    <motion.div
                                        key={`content-${index}`}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                        className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
                                    >
                                        <div className="px-6 py-5 text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed font-medium bg-slate-50/50 dark:bg-slate-800/30">
                                            {item.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>

            {/* 8. Call to Action Banner */}
            <section className="py-20 px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1680px] mx-auto">
                <div className="p-8 sm:p-12 lg:p-16 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 text-white relative overflow-hidden shadow-2xl text-left rounded-3xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-8">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
                                Ready to take control of your career search?
                            </h2>
                            <p className="text-indigo-100 max-w-2xl text-base sm:text-lg font-medium leading-relaxed">
                                Join Job Seer today. Evaluate your ATS resume health, discover high-compatibility matches, and track your applications in one unified space.
                            </p>
                        </div>
                        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5 justify-end">
                            <Link to="/register" className="w-full">
                                <Button variant="secondary" size="lg" icon={ArrowRight} className="w-full justify-center py-4 text-base font-extrabold text-indigo-700 shadow-md">
                                    Get Started Free
                                </Button>
                            </Link>
                            <Link to="/login" className="w-full">
                                <Button variant="ghost" size="lg" className="w-full justify-center py-4 text-base font-bold text-white hover:bg-white/10">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. Footer */}
            <footer className="py-12 px-6 sm:px-10 lg:px-16 xl:px-20 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold max-w-[1680px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                <Logo size="sm" subtext="Intelligent Career Companion • v2.2" />
                <div>
                    Built with strict privacy, factual integrity, and explainable match fit.
                </div>
            </footer>
        </div>
    );
}

export default Landing;
