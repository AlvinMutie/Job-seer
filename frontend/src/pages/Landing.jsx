import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Sparkles, Target, Clock, ChevronRight, FileText,
    CheckCircle2, ShieldCheck, ArrowRight, Layers,
    Zap, BarChart3, ChevronDown, Check, X, Menu,
    TrendingUp, Compass, Award, ExternalLink, SlidersHorizontal,
    Database, Cpu, Lock, Scissors, Mail, Globe, Search, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import SpotlightCard from '../components/SpotlightCard';
import Logo from '../components/Logo';

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
        <div className="min-h-screen bg-[#f8fafc] text-slate-950 font-sans selection:bg-indigo-500/30 relative overflow-x-hidden">
            {/* Ambient Lighting Gradients & Canvas Grid */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.18),transparent)] pointer-events-none" />
            <div className="absolute top-[25%] right-0 w-[550px] h-[550px] bg-cyan-200/35 rounded-full blur-[140px] pointer-events-none translate-x-1/4" />
            <div className="absolute top-[60%] left-0 w-[550px] h-[550px] bg-purple-200/30 rounded-full blur-[140px] pointer-events-none -translate-x-1/4" />

            {/* 1. Floating Pill Header / Navigation */}
            <div className="fixed top-4 w-full z-50 px-4 sm:px-6 pointer-events-none">
                <header className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 bg-white/85 backdrop-blur-xl border border-slate-200/90 rounded-full shadow-lg shadow-slate-200/40 flex items-center justify-between pointer-events-auto transition-all">
                    {/* Brand Wordmark */}
                    <Link to="/" className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-full p-1">
                        <Logo size="sm" />
                    </Link>

                    {/* Navigation Anchor Links (Desktop) */}
                    <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-slate-700">
                        <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
                        <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#architecture" className="hover:text-indigo-600 transition-colors">Architecture</a>
                        <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
                    </nav>

                    {/* Header Action Buttons (Desktop) */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link to="/login">
                            <Button variant="ghost" size="sm" className="text-slate-800 hover:text-indigo-600 font-bold rounded-full px-4">
                                Sign In
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="primary" size="sm" icon={ChevronRight} className="font-bold rounded-full px-4 shadow-sm shadow-indigo-600/20">
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-1.5 text-slate-700 hover:text-slate-950 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </header>

                {/* Mobile Navigation Drawer */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            className="max-w-md mx-auto mt-2 p-5 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-3xl shadow-2xl space-y-4 pointer-events-auto md:hidden"
                        >
                            <nav className="flex flex-col space-y-2 text-sm font-bold text-slate-800">
                                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all">How It Works</a>
                                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all">Features</a>
                                <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all">Architecture</a>
                                <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all">FAQ</a>
                            </nav>
                            <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="secondary" className="w-full font-bold rounded-xl">Sign In</Button>
                                </Link>
                                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="primary" className="w-full font-bold rounded-xl">Get Started</Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 2. Hero Section */}
            <section className="relative pt-32 sm:pt-36 lg:pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
                {/* Announcement Capsule */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/90 border border-indigo-200/80 text-indigo-700 text-xs font-bold mb-8 shadow-xs hover:bg-indigo-100/80 transition-all"
                >
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                    <span>Explainable 4-Factor Fit Engine &bull; Zero Hallucination Guarantee</span>
                    <ChevronRight size={14} className="text-indigo-500" />
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.08] text-slate-950 max-w-4xl mx-auto"
                >
                    Intelligent career search with{' '}
                    <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        explainable fit.
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Job Seer audits ATS resume health, computes explainable compatibility breakdowns, generates factually grounded tailored CVs, and organizes your live application pipeline.
                </motion.p>

                {/* Primary CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14"
                >
                    <Link to="/register" className="w-full sm:w-auto">
                        <Button variant="primary" size="lg" icon={ArrowRight} className="w-full sm:w-auto px-8 py-4 text-base font-extrabold shadow-xl shadow-indigo-600/25 rounded-2xl">
                            Launch Free Workspace
                        </Button>
                    </Link>
                    <a href="#features" className="w-full sm:w-auto">
                        <Button variant="secondary" size="lg" icon={ChevronRight} className="w-full sm:w-auto px-7 py-4 text-base font-bold rounded-2xl bg-white hover:bg-slate-50 border border-slate-200">
                            Explore Features
                        </Button>
                    </a>
                </motion.div>

                {/* Technical Trust Strip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-16 text-left"
                >
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                        <div className="text-xl sm:text-2xl font-black text-indigo-600 tracking-tight">500+</div>
                        <div className="text-xs font-bold text-slate-700 mt-0.5">Curated Taxonomies</div>
                        <div className="text-[11px] text-slate-500 font-medium">Across 7 tech domains</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                        <div className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">10-Layer</div>
                        <div className="text-xs font-bold text-slate-700 mt-0.5">ATS Diagnostic Check</div>
                        <div className="text-[11px] text-slate-500 font-medium">Security & format audit</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                        <div className="text-xl sm:text-2xl font-black text-purple-600 tracking-tight">100%</div>
                        <div className="text-xs font-bold text-slate-700 mt-0.5">Factual Integrity</div>
                        <div className="text-[11px] text-slate-500 font-medium">0 fabricated metrics</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                        <div className="text-xl sm:text-2xl font-black text-cyan-600 tracking-tight">4-Factor</div>
                        <div className="text-xs font-bold text-slate-700 mt-0.5">Transparent Math</div>
                        <div className="text-[11px] text-slate-500 font-medium">Zero black-box guesses</div>
                    </div>
                </motion.div>

                {/* 3. Interactive macOS Product Window Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                    className="max-w-5xl mx-auto rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-indigo-500/10 overflow-hidden text-left"
                >
                    {/* macOS Browser Chrome */}
                    <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-rose-400" />
                            <span className="w-3 h-3 rounded-full bg-amber-400" />
                            <span className="w-3 h-3 rounded-full bg-emerald-400" />
                            <div className="ml-3 hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-mono text-slate-600">
                                <Lock size={12} className="text-emerald-600" />
                                <span>https://jobseer.app/workspace/overview</span>
                            </div>
                        </div>

                        {/* Interactive Tab Switcher */}
                        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl">
                            <button
                                onClick={() => setActiveTab('match')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    activeTab === 'match'
                                        ? 'bg-white text-indigo-700 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                4-Factor Fit
                            </button>
                            <button
                                onClick={() => setActiveTab('ats')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    activeTab === 'ats'
                                        ? 'bg-white text-indigo-700 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                ATS Audit
                            </button>
                            <button
                                onClick={() => setActiveTab('tailor')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    activeTab === 'tailor'
                                        ? 'bg-white text-indigo-700 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Grounded CV Diff
                            </button>
                            <button
                                onClick={() => setActiveTab('sync')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    activeTab === 'sync'
                                        ? 'bg-white text-indigo-700 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Live Job Sync
                            </button>
                        </div>
                    </div>

                    {/* Window Canvas Body */}
                    <div className="p-6 sm:p-8 bg-slate-50/50">
                        {activeTab === 'match' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-5 border-b border-slate-200/80">
                                    <div>
                                        <div className="flex items-center gap-2.5">
                                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">Strong Match (91%)</span>
                                            <span className="text-xs text-slate-500 font-mono">Role ID: #JS-8842</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mt-1">Senior Full-Stack Engineer</h3>
                                        <p className="text-xs text-slate-500 font-medium">Stripe &bull; San Francisco, CA (Hybrid)</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-black text-indigo-600">91<span className="text-sm font-bold text-slate-400">/100</span></div>
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Explainable Compatibility</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    <div className="p-3.5 bg-white rounded-xl border border-slate-200/80">
                                        <div className="text-xs font-bold text-slate-600 mb-1">Skills Overlap (40%)</div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1.5">
                                            <div className="bg-indigo-600 h-full rounded-full" style={{ width: '92%' }} />
                                        </div>
                                        <span className="text-xs font-black text-slate-900">92%</span>
                                    </div>
                                    <div className="p-3.5 bg-white rounded-xl border border-slate-200/80">
                                        <div className="text-xs font-bold text-slate-600 mb-1">TF-IDF Vector (30%)</div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1.5">
                                            <div className="bg-purple-600 h-full rounded-full" style={{ width: '88%' }} />
                                        </div>
                                        <span className="text-xs font-black text-slate-900">88%</span>
                                    </div>
                                    <div className="p-3.5 bg-white rounded-xl border border-slate-200/80">
                                        <div className="text-xs font-bold text-slate-600 mb-1">Experience Level (15%)</div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1.5">
                                            <div className="bg-emerald-600 h-full rounded-full" style={{ width: '95%' }} />
                                        </div>
                                        <span className="text-xs font-black text-slate-900">95%</span>
                                    </div>
                                    <div className="p-3.5 bg-white rounded-xl border border-slate-200/80">
                                        <div className="text-xs font-bold text-slate-600 mb-1">Title Alignment (15%)</div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1.5">
                                            <div className="bg-cyan-600 h-full rounded-full" style={{ width: '90%' }} />
                                        </div>
                                        <span className="text-xs font-black text-slate-900">90%</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-xs font-bold text-slate-700 block mb-2">Verified Skill Matches & Missing Requirement Flags:</span>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                                            <Check size={12} /> React
                                        </span>
                                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                                            <Check size={12} /> TypeScript
                                        </span>
                                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                                            <Check size={12} /> Python / FastAPI
                                        </span>
                                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                                            <Check size={12} /> PostgreSQL
                                        </span>
                                        <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" /> Missing: Kubernetes
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ats' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center pb-5 border-b border-slate-200/80">
                                    <div>
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">ATS Clean & Bullseye Pass</span>
                                        <h3 className="text-xl font-bold text-slate-900 mt-1">10-Layer Format & Security Audit</h3>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-black text-emerald-600">96<span className="text-sm font-bold text-slate-400">/100</span></div>
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Health Index</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
                                        <span className="font-semibold text-slate-800">Spatial Bounding Box Reading Order</span>
                                        <span className="text-emerald-700 font-bold flex items-center gap-1"><Check size={14} /> Passed</span>
                                    </div>
                                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
                                        <span className="font-semibold text-slate-800">Section Completeness (Summary, Experience, Skills)</span>
                                        <span className="text-emerald-700 font-bold flex items-center gap-1"><Check size={14} /> Passed</span>
                                    </div>
                                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
                                        <span className="font-semibold text-slate-800">Font & Formatting Boundary Safety</span>
                                        <span className="text-emerald-700 font-bold flex items-center gap-1"><Check size={14} /> Passed</span>
                                    </div>
                                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
                                        <span className="font-semibold text-slate-800">Contact Details & Link Verification</span>
                                        <span className="text-emerald-700 font-bold flex items-center gap-1"><Check size={14} /> Passed</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'tailor' && (
                            <div className="space-y-5">
                                <div className="pb-4 border-b border-slate-200/80">
                                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold">100% Factually Grounded</span>
                                    <h3 className="text-xl font-bold text-slate-900 mt-1">Grounded Experience Restructuring</h3>
                                    <p className="text-xs text-slate-500 font-medium">Restructures your real experience to match target role keywords with 0 hallucinated metrics.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                                    <div className="p-4 bg-white rounded-xl border border-slate-200">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Original Resume Bullet</span>
                                        <p className="text-slate-600 leading-relaxed">
                                            Built API microservices in Python and worked on React components for the customer dashboard.
                                        </p>
                                    </div>
                                    <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200/90">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block mb-2">Tailored Grounded Bullet</span>
                                        <p className="text-indigo-950 font-medium leading-relaxed">
                                            Architected high-throughput RESTful microservices using <strong className="text-indigo-700">FastAPI</strong> and <strong className="text-indigo-700">PostgreSQL</strong>, and delivered reactive dashboard state with <strong className="text-indigo-700">React and TypeScript</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'sync' && (
                            <div className="space-y-5">
                                <div className="pb-4 border-b border-slate-200/80 flex justify-between items-center">
                                    <div>
                                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[11px] font-bold">Live Adzuna API Sync</span>
                                        <h3 className="text-xl font-bold text-slate-900 mt-1">Real-Time External Opportunities</h3>
                                    </div>
                                    <span className="text-xs text-slate-500 font-mono">100% Verified Live Postings</span>
                                </div>

                                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">US &bull; Full-time</span>
                                            <span className="text-xs font-bold text-emerald-700">$140,000 - $175,000 / yr</span>
                                        </div>
                                        <h4 className="text-base font-bold text-slate-900">Staff Platform Engineer</h4>
                                        <p className="text-xs text-slate-500">CloudScale Systems &bull; Remote</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs">89% Match</span>
                                        <button className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs">
                                            Apply on Site <ExternalLink size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </section>

            {/* 4. Asymmetric Bento Grid Feature Section */}
            <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-200/60">
                        Engineered for Precision
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-4 tracking-tight">
                        Everything you need to master your job search.
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Transparent algorithms, strict factual integrity, and direct employer integration.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Card 1: 4-Factor Semantic Fit (Col Span 8) */}
                    <div className="lg:col-span-8 p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-indigo-300 transition-all">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                <Target size={20} />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950">4-Factor Explainable Match Engine</h3>
                            <p className="text-slate-600 text-sm leading-relaxed max-w-xl">
                                Replaces deceptive single-number scores with a fully transparent formula: 40% Skills Overlap, 30% TF-IDF Vector Content, 15% Experience Depth, and 15% Title Alignment.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100 mt-6 text-xs">
                            <div className="p-3 bg-slate-50 rounded-xl">
                                <span className="font-bold text-indigo-600 block">40%</span>
                                <span className="text-slate-600">Skills Overlap</span>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl">
                                <span className="font-bold text-purple-600 block">30%</span>
                                <span className="text-slate-600">TF-IDF Vector</span>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl">
                                <span className="font-bold text-emerald-600 block">15%</span>
                                <span className="text-slate-600">Experience Alignment</span>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl">
                                <span className="font-bold text-cyan-600 block">15%</span>
                                <span className="text-slate-600">Role Title Match</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: 10-Layer ATS Diagnostic (Col Span 4) */}
                    <div className="lg:col-span-4 p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between group hover:border-indigo-300 transition-all">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                <ShieldCheck size={20} />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-950">10-Layer ATS Health Diagnostic</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Evaluates document readability, contact completeness, formatting boundaries, and extraction fidelity.
                            </p>
                        </div>

                        <div className="space-y-2 pt-6 border-t border-slate-100 mt-6 text-xs font-semibold">
                            <div className="flex items-center gap-2 text-slate-700">
                                <Check size={14} className="text-emerald-600" /> Multi-domain tech taxonomy
                            </div>
                            <div className="flex items-center gap-2 text-slate-700">
                                <Check size={14} className="text-emerald-600" /> Section structure audit
                            </div>
                            <div className="flex items-center gap-2 text-slate-700">
                                <Check size={14} className="text-emerald-600" /> OWASP upload security
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Spatial Coordinate Parsing (Col Span 4) */}
                    <div className="lg:col-span-4 p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between group hover:border-indigo-300 transition-all">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                                <Layers size={20} />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-950">Spatial Coordinate PDF Parser</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Dual-column Canva and creative layout bounding box detection completely prevents text interleaving.
                            </p>
                        </div>

                        <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200/80 text-[11px] font-mono text-purple-900 mt-6">
                            PyMuPDF Bounding Box Geometry &bull; Col-density matrix
                        </div>
                    </div>

                    {/* Card 4: Live Adzuna Job Sync (Col Span 8) */}
                    <div className="lg:col-span-8 p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-indigo-300 transition-all">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100">
                                <RefreshCw size={20} />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-950">Live Job Sync & Direct Application Handoff</h3>
                            <p className="text-slate-600 text-sm leading-relaxed max-w-xl">
                                Ingest real-time verified postings directly via the Adzuna API, extract normalized salary bands, tailor your CV, and apply on employer sites with a single click.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-100 mt-6 text-xs font-semibold">
                            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800">Global Country Selectors (US, UK, CA, DE, AU, IN)</span>
                            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800">Automatic Salary Normalization</span>
                            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800">Integrated Kanban Tracker</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Connected Timeline ("How It Works") */}
            <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto bg-slate-100/60 rounded-3xl border border-slate-200/80 my-12">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-200/60">
                        Workflow
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-4 tracking-tight">
                        How Job Seer Accelerates Your Pipeline
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs relative">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mb-4">
                            1
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mb-1.5">Upload & Spatial Parse</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Upload your resume in PDF or DOCX. PyMuPDF scans coordinate blocks to structure your raw experience.
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs relative">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mb-4">
                            2
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mb-1.5">Explainable Scoring</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Our 4-factor formula calculates mathematical overlap against live jobs with complete rationale.
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs relative">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mb-4">
                            3
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mb-1.5">Grounded Tailoring</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Restructure bullet points with target role keywords while strictly defending factual truth.
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs relative">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mb-4">
                            4
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mb-1.5">Direct Apply & Track</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Follow direct external posting links to submit your application and monitor stages in Kanban.
                        </p>
                    </div>
                </div>
            </section>

            {/* 6. Technical Architecture Overview */}
            <section id="architecture" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-2xl space-y-4 relative z-10">
                        <div className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-indigo-200 text-xs font-bold uppercase tracking-wider border border-white/20">
                            Enterprise Ready Architecture
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Built with security, privacy, and mathematical rigor.
                        </h2>
                        <p className="text-indigo-100 text-sm sm:text-base leading-relaxed font-medium">
                            Isolated SQLite/SQLAlchemy tenant boundaries, deterministic scikit-learn TF-IDF vectorization, rate-limited FastAPI endpoints, and OWASP-compliant document sanitization.
                        </p>
                        <div className="pt-4 flex flex-wrap gap-3">
                            <Link to="/register">
                                <Button variant="primary" size="lg" className="bg-white text-indigo-950 hover:bg-indigo-50 font-bold px-6 py-3 rounded-xl shadow-lg">
                                    Get Started Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. FAQ Section */}
            <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <span className="px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-200/60">
                        Frequently Asked Questions
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-4 tracking-tight">
                        Got Questions? We Have Answers.
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqItems.map((item, index) => (
                        <div key={index} className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs">
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full px-6 py-5 text-left font-bold text-slate-900 flex justify-between items-center gap-4 hover:text-indigo-600 transition-colors"
                            >
                                <span className="text-sm sm:text-base">{item.q}</span>
                                <ChevronDown
                                    size={18}
                                    className={`shrink-0 transition-transform duration-200 ${openFaq === index ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`}
                                />
                            </button>
                            <AnimatePresence initial={false}>
                                {openFaq === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden border-t border-slate-100 bg-slate-50/50"
                                    >
                                        <div className="px-6 py-5 text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
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
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="p-8 sm:p-12 lg:p-14 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 text-white relative overflow-hidden shadow-2xl rounded-3xl">
                    <div className="max-w-2xl space-y-4 relative z-10">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                            Ready to take control of your career pipeline?
                        </h2>
                        <p className="text-indigo-100 text-sm sm:text-base font-medium leading-relaxed">
                            Join Job Seer today. Evaluate ATS resume health, compute transparent compatibility breakdowns, and track your interviews in one place.
                        </p>
                        <div className="pt-4 flex flex-wrap gap-3">
                            <Link to="/register">
                                <Button variant="primary" size="lg" className="bg-white text-indigo-950 hover:bg-indigo-50 font-bold px-8 py-3.5 rounded-xl shadow-lg">
                                    Create Free Profile
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="ghost" size="lg" className="text-white hover:bg-white/10 font-bold px-6 py-3.5 rounded-xl">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. Modern Footer */}
            <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-3">
                        <Logo size="sm" />
                        <span>&copy; {new Date().getFullYear()} Job Seer. All rights reserved.</span>
                    </div>

                    <div className="flex items-center gap-6 font-semibold text-slate-600">
                        <Link to="/login" className="hover:text-indigo-600 transition-colors">Sign In</Link>
                        <Link to="/register" className="hover:text-indigo-600 transition-colors">Create Account</Link>
                        <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#architecture" className="hover:text-indigo-600 transition-colors">Architecture</a>
                        <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
