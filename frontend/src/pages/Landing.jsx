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
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-500/20 relative overflow-x-hidden">
            {/* Ambient Lighting Gradients */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-100/60 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
            <div className="absolute top-[25%] right-0 w-[600px] h-[600px] bg-cyan-100/50 rounded-full blur-[140px] pointer-events-none translate-x-1/4" />
            <div className="absolute top-[65%] left-[5%] w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[130px] pointer-events-none" />

            {/* 1. Header / Navigation */}
            <header className="fixed top-0 w-full z-50 px-6 sm:px-10 lg:px-16 xl:px-20 py-4 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 transition-all">
                <div className="max-w-[1680px] mx-auto flex justify-between items-center">
                    {/* Brand Wordmark */}
                    <Link to="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl p-1">
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            Job Seer
                        </span>
                    </Link>

                    {/* Navigation Anchor Links (Desktop) */}
                    <nav className="hidden md:flex items-center gap-9 text-sm font-medium text-slate-600">
                        <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
                        <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
                        <a href="#why-job-seer" className="hover:text-slate-900 transition-colors">Why Job Seer</a>
                        <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
                    </nav>

                    {/* Header Action Buttons (Desktop) */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login">
                            <Button variant="ghost" size="sm" className="text-slate-700 hover:text-slate-900">Sign In</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="primary" size="sm" icon={ChevronRight}>Get Started</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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
                            className="md:hidden pt-4 pb-6 px-4 border-t border-slate-200 mt-4 space-y-4 bg-white"
                        >
                            <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-700">
                                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-900 p-2">How It Works</a>
                                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-900 p-2">Features</a>
                                <a href="#why-job-seer" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-900 p-2">Why Job Seer</a>
                                <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-900 p-2">FAQ</a>
                            </nav>
                            <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
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
                        {/* Status Chip */}
                        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6">
                            <span className="w-2 h-2 rounded-full bg-indigo-600" />
                            <span>Intelligent Career Search Platform</span>
                        </div>

                        {/* Display Large Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-slate-900">
                            Intelligent career search with <span className="text-indigo-600">explainable fit.</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mb-8 leading-relaxed">
                            Job Seer evaluates ATS resume health, computes explainable 4-factor compatibility scores, generates factual tailored CV versions, and organizes your full application pipeline in one workspace.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
                            <Link to="/register" className="w-full sm:w-auto">
                                <Button variant="primary" size="lg" icon={ArrowRight} className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold">
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
                        <div className="grid grid-cols-3 gap-3.5 sm:gap-4 w-full pt-6 border-t border-slate-200">
                            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                                <div className="text-2xl font-bold text-slate-900 tracking-tight">4-Factor</div>
                                <div className="text-xs text-slate-500 mt-1">Explainable AI Fit</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                                <div className="text-2xl font-bold text-emerald-600 tracking-tight">90%+</div>
                                <div className="text-xs text-slate-500 mt-1">ATS Scan Readiness</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                                <div className="text-2xl font-bold text-indigo-600 tracking-tight">100%</div>
                                <div className="text-xs text-slate-500 mt-1">Factual Integrity</div>
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
                        <Card variant="elevated" className="p-6 sm:p-7 text-left border-slate-200 bg-white shadow-xl relative rounded-3xl">
                            {/* Window Header */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-200 gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                    <span className="text-xs text-slate-500 font-mono ml-2">Job Seer Workspace</span>
                                </div>

                                {/* Mode Switcher */}
                                <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                                    <button
                                        onClick={() => setActiveTab('match')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'match' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                                    >
                                        <Target size={13} /> Match Fit
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('ats')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'ats' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                                    >
                                        <ShieldCheck size={13} /> ATS Scan
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('tailor')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'tailor' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                                    >
                                        <FileText size={13} /> Tailor CV
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('kanban')}
                                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'kanban' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                                    >
                                        <Clock size={13} /> Tracker
                                    </button>
                                </div>
                            </div>

                            {/* Tab Content Panels */}
                            <div className="pt-5 min-h-[300px]">
                                {activeTab === 'match' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="flex justify-between items-center p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl">
                                            <div>
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Target Match</div>
                                                <div className="text-base font-bold text-slate-900">Staff Software Engineer &bull; Stripe</div>
                                                <div className="text-xs text-slate-500 mt-0.5">San Francisco, CA (Hybrid) &bull; $210k - $250k</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-extrabold text-emerald-600">92%</div>
                                                <div className="text-[10px] text-slate-500 font-medium">Explainable Score</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                                                <div className="text-xs text-slate-500">Skills Overlap (40%)</div>
                                                <div className="text-lg font-bold text-indigo-600 mt-1">94%</div>
                                                <div className="text-[10px] text-emerald-600 mt-0.5">8 of 9 required skills matched</div>
                                            </div>
                                            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                                                <div className="text-xs text-slate-500">TF-IDF Vector (30%)</div>
                                                <div className="text-lg font-bold text-purple-600 mt-1">88%</div>
                                                <div className="text-[10px] text-purple-600 mt-0.5">High semantic relevance</div>
                                            </div>
                                            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                                                <div className="text-xs text-slate-500">Experience Fit (15%)</div>
                                                <div className="text-lg font-bold text-cyan-600 mt-1">95%</div>
                                                <div className="text-[10px] text-cyan-600 mt-0.5">Senior level alignment</div>
                                            </div>
                                            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                                                <div className="text-xs text-slate-500">Title Relevance (15%)</div>
                                                <div className="text-lg font-bold text-emerald-600 mt-1">90%</div>
                                                <div className="text-[10px] text-emerald-600 mt-0.5">Exact engineering domain</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'ats' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="flex items-center justify-between p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-11 h-11 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-lg">
                                                    96%
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900">ATS Document Readiness</div>
                                                    <div className="text-xs text-slate-500">Structural integrity, section headers & font safety verified.</div>
                                                </div>
                                            </div>
                                            <span className="badge badge-emerald">Passed Scan</span>
                                        </div>

                                        <div className="space-y-2.5 text-xs">
                                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                                                <span className="text-slate-700 font-medium">Contact Details & Section Hierarchy</span>
                                                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                                                    <Check size={15} /> 100% Complete
                                                </span>
                                            </div>
                                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                                                <span className="text-slate-700 font-medium">Categorized Skills Breakdown</span>
                                                <span className="text-indigo-700 font-semibold">7 / 7 Technical Domains</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'tailor' && (
                                    <div className="space-y-3.5 animate-fade-in font-mono text-xs">
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="font-bold text-indigo-700">Factual Diff Viewer (v2)</span>
                                            <span className="text-emerald-700 font-semibold">Fact-Preserving Mode</span>
                                        </div>
                                        <div className="text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 leading-relaxed">
                                            - Built features for internal web applications using React and Node.
                                        </div>
                                        <div className="text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200 leading-relaxed">
                                            + Engineered scalable React web applications and Node microservices, reducing API response times by 32% across 1M+ daily queries.
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'kanban' && (
                                    <div className="grid grid-cols-3 gap-3 animate-fade-in">
                                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                                            <div className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" /> Applied (2)
                                            </div>
                                            <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs shadow-xs">
                                                <div className="font-bold text-slate-900 truncate">Stripe</div>
                                                <div className="text-[10px] text-slate-500">Staff Engineer</div>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                                            <div className="text-[11px] font-bold text-indigo-700 mb-2 flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-indigo-600" /> Interview (1)
                                            </div>
                                            <div className="p-2.5 bg-white rounded-xl border border-indigo-200 text-xs shadow-xs">
                                                <div className="font-bold text-slate-900 truncate">Vercel</div>
                                                <div className="text-[10px] text-indigo-700">Tech Screen</div>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                                            <div className="text-[11px] font-bold text-emerald-700 mb-2 flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-emerald-600" /> Offer (1)
                                            </div>
                                            <div className="p-2.5 bg-white rounded-xl border border-emerald-200 text-xs shadow-xs">
                                                <div className="font-bold text-slate-900 truncate">Datadog</div>
                                                <div className="text-[10px] text-emerald-700">Offer Review</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* 3. Value Strip */}
            <section className="py-14 px-6 sm:px-10 lg:px-16 xl:px-20 border-y border-slate-200 bg-white">
                <div className="max-w-[1680px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100">
                            <Target size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900">AI Job Matching</h4>
                            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Discover roles aligned with your exact technical skillset.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900">ATS Document Health</h4>
                            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Verify parseability, layout safety, and keyword coverage.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center shrink-0 border border-cyan-100">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900">Application Pipeline</h4>
                            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Organize status stages with drag-and-drop clarity.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0 border border-purple-100">
                            <Layers size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900">Isolated Security</h4>
                            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Strict account isolation and private data boundaries.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Problem & Solution Section */}
            <section id="why-job-seer" className="py-24 px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1680px] mx-auto text-left">
                <div className="mb-14">
                    <Badge variant="amber" size="sm" className="mb-3">THE HIRING REALITY</Badge>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                        Searching for a job shouldn't feel like guessing.
                    </h2>
                    <p className="text-slate-600 max-w-3xl mt-3 text-sm sm:text-base leading-relaxed">
                        Traditional job applications force candidates to navigate opaque ATS scanners, repetitive manual tailoring, and messy tracking spreadsheets.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Without Job Seer */}
                    <Card variant="flat" className="p-8 sm:p-10 border-rose-200 bg-rose-50/30 rounded-3xl">
                        <div className="flex items-center gap-3.5 mb-6">
                            <div className="w-11 h-11 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center font-bold border border-rose-200">
                                <X size={22} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Without Job Seer</h3>
                        </div>
                        <ul className="space-y-4 text-sm text-slate-600">
                            <li className="flex items-start gap-3">
                                <X size={18} className="text-rose-500 shrink-0 mt-0.5" />
                                <span>Submitting generic resumes without knowing if technical skills align</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X size={18} className="text-rose-500 shrink-0 mt-0.5" />
                                <span>Getting quietly filtered out by unreadable ATS formatting structures</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X size={18} className="text-rose-500 shrink-0 mt-0.5" />
                                <span>Spending hours manually tailoring repetitive cover letters</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X size={18} className="text-rose-500 shrink-0 mt-0.5" />
                                <span>Losing track of application dates, recruiter follow-ups, and links</span>
                            </li>
                        </ul>
                    </Card>

                    {/* With Job Seer */}
                    <Card variant="elevated" className="p-8 sm:p-10 border-indigo-200 bg-indigo-50/30 shadow-sm rounded-3xl">
                        <div className="flex items-center gap-3.5 mb-6">
                            <div className="w-11 h-11 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-bold border border-emerald-200">
                                <Check size={22} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">With Job Seer Workspace</h3>
                        </div>
                        <ul className="space-y-4 text-sm text-slate-700">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                <span>Seeing exact V2 Explainable Match percentages across 4 dimensions</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                <span>Evaluating ATS health (0-100) and receiving domain skill recommendations</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                <span>Generating factual tailored resume bullets and multi-tone cover letters</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                <span>Managing application status on an interactive drag-and-drop Kanban board</span>
                            </li>
                        </ul>
                    </Card>
                </div>
            </section>

            {/* 5. How It Works */}
            <section id="how-it-works" className="py-24 px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1680px] mx-auto border-t border-slate-200 text-left">
                <div className="mb-14">
                    <Badge variant="indigo" size="sm" className="mb-3">FIVE-STEP WORKFLOW</Badge>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                        How Job Seer Streamlines Your Search
                    </h2>
                    <p className="text-slate-600 max-w-3xl mt-3 text-sm sm:text-base leading-relaxed">
                        A systematic sequence designed to move candidates from initial profile setup to tracked interviews and accepted job offers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
                    <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs">
                        <div className="text-xs font-mono font-bold text-indigo-600 mb-3">01</div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">Build Profile</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Define technical skills, experience level, and preferred career roles.
                        </p>
                    </div>

                    <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs">
                        <div className="text-xs font-mono font-bold text-purple-600 mb-3">02</div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">Discover Openings</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Explore openings and analyze compatibility using V2 Explainable Scoring.
                        </p>
                    </div>

                    <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs">
                        <div className="text-xs font-mono font-bold text-cyan-600 mb-3">03</div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">Tailor Materials</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Generate tailored CV bullet versions and multi-tone cover letters.
                        </p>
                    </div>

                    <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs">
                        <div className="text-xs font-mono font-bold text-emerald-600 mb-3">04</div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">Apply Confidently</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Submit application materials backed by 90%+ ATS document health checks.
                        </p>
                    </div>

                    <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs">
                        <div className="text-xs font-mono font-bold text-amber-600 mb-3">05</div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">Track Pipeline</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Track progress on the Kanban board with timeline logging and follow-ups.
                        </p>
                    </div>
                </div>
            </section>

            {/* 6. Built-in Features */}
            <section id="features" className="py-24 px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1680px] mx-auto border-t border-slate-200 text-left">
                <div className="mb-14">
                    <Badge variant="indigo" size="sm" className="mb-3">BUILT-IN CAPABILITIES</Badge>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                        Engineered for Modern Job Seekers
                    </h2>
                    <p className="text-slate-600 max-w-3xl mt-3 text-sm sm:text-base leading-relaxed">
                        Comprehensive capabilities designed to give candidates a decisive advantage across every phase of hiring.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-xs">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100">
                            <Target size={22} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-slate-900">Explainable V2 AI Match</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            Transparent breakdown analyzing Skills (40%), Content (30%), Experience (15%), and Title (15%) with matched & missing skill chips.
                        </p>
                    </div>

                    <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-xs">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100">
                            <ShieldCheck size={22} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-slate-900">Resume Intelligence & ATS Health</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            Evaluate document ATS readiness (0-100), verify contact information, and categorize skills across 7 technical domains.
                        </p>
                    </div>

                    <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-xs">
                        <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mb-6 border border-cyan-100">
                            <Sparkles size={22} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-slate-900">Factual CV Tailoring</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            Generate versioned resume tailoring with factual integrity guarantees, preserving truth while maximizing target keyword relevance.
                        </p>
                    </div>

                    <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-xs">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 border border-purple-100">
                            <FileText size={22} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-slate-900">Multi-Tone Cover Letters</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            Generate cover letters tailored to target hiring managers in 4 selectable tones: Professional, Executive, Enthusiastic, and Technical.
                        </p>
                    </div>

                    <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-xs">
                        <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mb-6 border border-amber-100">
                            <Clock size={22} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-slate-900">Kanban Pipeline Board</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            Drag-and-drop tracking pipeline managing 5 status stages with optimistic updates, timeline logging, and direct links.
                        </p>
                    </div>

                    <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-xs">
                        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6 border border-rose-100">
                            <BarChart3 size={22} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-slate-900">Command Center Analytics</h3>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            Real-time career intelligence featuring KPI stat cards, ATS health scores, application stage breakdown, and curated job matches.
                        </p>
                    </div>
                </div>
            </section>

            {/* 7. FAQ Accordion */}
            <section id="faq" className="py-24 px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1680px] mx-auto border-t border-slate-200 text-left">
                <div className="mb-14 max-w-3xl">
                    <Badge variant="indigo" size="sm" className="mb-3">GOT QUESTIONS?</Badge>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
                        Answers to common questions regarding our explainable matching, ATS parsing, and privacy policies.
                    </p>
                </div>

                <div className="space-y-4 max-w-5xl">
                    {faqItems.map((item, index) => (
                        <div key={index} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                                <span className="font-bold text-slate-900 text-base md:text-lg">{item.q}</span>
                                <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 shrink-0 ${openFaq === index ? 'rotate-180 text-indigo-600' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {openFaq === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4"
                                    >
                                        {item.a}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>

            {/* 8. Call to Action Banner */}
            <section className="py-20 px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1680px] mx-auto">
                <div className="p-8 sm:p-12 lg:p-16 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 text-white relative overflow-hidden shadow-xl text-left rounded-3xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-8">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
                                Ready to take control of your career search?
                            </h2>
                            <p className="text-indigo-100 max-w-2xl text-base sm:text-lg leading-relaxed">
                                Join Job Seer today. Evaluate your ATS resume health, discover high-compatibility matches, and track your applications in one unified space.
                            </p>
                        </div>
                        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5 justify-end">
                            <Link to="/register" className="w-full">
                                <Button variant="secondary" size="lg" icon={ArrowRight} className="w-full justify-center py-4 text-base font-semibold text-indigo-700 shadow-md">
                                    Get Started
                                </Button>
                            </Link>
                            <Link to="/login" className="w-full">
                                <Button variant="ghost" size="lg" className="w-full justify-center py-4 text-base font-medium text-white hover:bg-white/10">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. Footer */}
            <footer className="py-12 px-6 sm:px-10 lg:px-16 xl:px-20 border-t border-slate-200 bg-white text-slate-500 text-xs">
                <div className="max-w-[1680px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-left">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/20">
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <span className="text-base font-bold text-slate-900">Job Seer</span>
                    </div>
                    <div>
                        &copy; {new Date().getFullYear()} Job Seer. All rights reserved.
                    </div>
                    <div className="flex gap-8 font-medium">
                        <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
                        <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
                        <a href="#why-job-seer" className="hover:text-slate-900 transition-colors">Why Job Seer</a>
                        <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
