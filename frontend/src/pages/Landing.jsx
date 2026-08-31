import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Sparkles, Target, Clock, ChevronRight, FileText,
    CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Layers,
    Zap, Cpu, BarChart3, HelpCircle, ChevronDown, Check, X, Copy, Menu
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
            a: "No! Job Seer enforces strict factual integrity. The tailoring engine ONLY restructures and emphasizes your real technical skills and metrics to match target job descriptions without inventing false jobs, degrees, or experience."
        },
        {
            q: "How does the V2 Explainable Match Score work?",
            a: "Unlike black-box ATS algorithms, Job Seer provides an explainable 4-factor score: Skills Overlap (40%), TF-IDF Content Vector Similarity (30%), Experience Level Alignment (15%), and Role Title Matching (15%) with complete rationale and missing skill chips."
        },
        {
            q: "Is my resume and job search data private?",
            a: "Yes! All user data is isolated per account using strict database resource-owner boundaries. Your resume content is never sold or used for public AI training."
        },
        {
            q: "Can I export my tailored resumes and cover letters?",
            a: "Absolutely. Tailored resume versions and multi-tone cover letters (Professional, Executive, Enthusiastic, Technical) can be copied to your clipboard or exported with line-by-line diff tracking."
        }
    ];

    return (
        <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-indigo-500/30">
            {/* 1. Header / Navigation */}
            <header className="fixed top-0 w-full z-50 px-6 md:px-12 py-4 bg-[#0b0f19]/85 backdrop-blur-xl border-b border-slate-800/80 transition-all">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    {/* Brand Wordmark */}
                    <Link to="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl p-1">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                            <Sparkles size={22} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                            Job Seer
                        </span>
                    </Link>

                    {/* Navigation Anchor Links (Desktop) */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#why-job-seer" className="hover:text-white transition-colors">Why Job Seer</a>
                        <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                    </nav>

                    {/* Header Action Buttons (Desktop) */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login">
                            <Button variant="ghost" size="sm">Sign In</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="primary" size="sm" icon={ChevronRight}>Get Started</Button>
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

            {/* 2. Hero Section */}
            <section className="relative pt-36 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl flex flex-col items-center"
                >
                    <Badge variant="indigo" size="md" icon={Sparkles} className="mb-6">
                        INTELLIGENT JOB SEARCH PLATFORM
                    </Badge>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-white">
                        Stop searching blindly. <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
                            Start finding opportunities that fit.
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-3xl mb-10 leading-relaxed">
                        Job Seer evaluates your ATS resume health, scores your exact fit across 4 explainable dimensions, generates tailored resume versions, formats multi-tone cover letters, and organizes your entire application pipeline in one workspace.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                        <Link to="/register" className="w-full sm:w-auto">
                            <Button variant="primary" size="lg" icon={ArrowRight} className="w-full">
                                Get Started
                            </Button>
                        </Link>
                        <a href="#how-it-works" className="w-full sm:w-auto">
                            <Button variant="secondary" size="lg" className="w-full">
                                See How It Works
                            </Button>
                        </a>
                    </div>
                </motion.div>

                {/* 3. Hero Product Visual (Lightweight CSS/React Mockup) */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="mt-16 w-full max-w-5xl"
                >
                    <Card variant="elevated" className="p-6 text-left border-slate-800 bg-slate-950/90 shadow-2xl shadow-indigo-950/40">
                        {/* Interactive Preview Tabs */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                                <span className="text-xs text-slate-400 font-mono ml-2">Job Seer Intelligence Workspace Preview</span>
                            </div>

                            <div className="flex flex-wrap gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
                                <button
                                    onClick={() => setActiveTab('match')}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'match' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                                >
                                    <Target size={14} /> V2 Match Score
                                </button>
                                <button
                                    onClick={() => setActiveTab('ats')}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'ats' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                                >
                                    <ShieldCheck size={14} /> ATS Health
                                </button>
                                <button
                                    onClick={() => setActiveTab('tailor')}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'tailor' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                                >
                                    <FileText size={14} /> Resume Tailor
                                </button>
                                <button
                                    onClick={() => setActiveTab('kanban')}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'kanban' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                                >
                                    <Clock size={14} /> Application Tracker
                                </button>
                            </div>
                        </div>

                        {/* Interactive Tab Panels */}
                        <div className="pt-6">
                            {activeTab === 'match' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-xl gap-4">
                                        <div>
                                            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Matched Opportunity</span>
                                            <div className="text-lg font-bold text-white">Senior Full Stack Engineer — Stripe</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-extrabold text-emerald-400">88%</div>
                                            <div className="text-[10px] text-slate-400 font-medium">Explainable V2 Score</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
                                            <div className="text-xs text-slate-400">Skills Overlap (40%)</div>
                                            <div className="text-lg font-bold text-indigo-400 mt-1">92%</div>
                                        </div>
                                        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
                                            <div className="text-xs text-slate-400">Content Vector (30%)</div>
                                            <div className="text-lg font-bold text-purple-400 mt-1">85%</div>
                                        </div>
                                        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
                                            <div className="text-xs text-slate-400">Experience Fit (15%)</div>
                                            <div className="text-lg font-bold text-cyan-400 mt-1">90%</div>
                                        </div>
                                        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
                                            <div className="text-xs text-slate-400">Role Title Overlap (15%)</div>
                                            <div className="text-lg font-bold text-emerald-400 mt-1">85%</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'ats' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="flex items-center justify-between p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-lg">
                                                92%
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">ATS Document Readiness</div>
                                                <div className="text-xs text-slate-400">Structure parsed cleanly. Section completeness verified.</div>
                                            </div>
                                        </div>
                                        <Badge variant="emerald">Passed Scan</Badge>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                                            <div className="text-xs font-bold text-slate-300 mb-2">Technical Skills</div>
                                            <div className="flex flex-wrap gap-1.5">
                                                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">Python</span>
                                                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">React</span>
                                                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">TypeScript</span>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                                            <div className="text-xs font-bold text-slate-300 mb-2">Databases</div>
                                            <div className="flex flex-wrap gap-1.5">
                                                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">PostgreSQL</span>
                                                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">Redis</span>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                                            <div className="text-xs font-bold text-slate-300 mb-2">Cloud & DevOps</div>
                                            <div className="flex flex-wrap gap-1.5">
                                                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">Docker</span>
                                                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">AWS</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'tailor' && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 font-mono text-xs">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-indigo-400">Factual Resume Diff Viewer (v2)</span>
                                            <span className="text-[10px] text-emerald-400">Factual Integrity Verified</span>
                                        </div>
                                        <div className="text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20 mb-2">
                                            - Developed web applications using React and Node.js for company projects.
                                        </div>
                                        <div className="text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                                            + Engineered high-throughput React SPA & Node REST APIs, optimizing load performance by 35% and increasing test coverage.
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'kanban' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
                                    <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                                        <div className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-blue-400"></div> Applied (2)
                                        </div>
                                        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                                            <div className="font-bold text-white">Senior Frontend Dev</div>
                                            <div className="text-slate-400 text-[10px]">Stripe • Applied 2 days ago</div>
                                        </div>
                                    </div>
                                    <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                                        <div className="text-xs font-bold text-indigo-400 mb-2 flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-indigo-400"></div> Interview (1)
                                        </div>
                                        <div className="p-3 bg-slate-950 rounded-lg border border-indigo-500/30 text-xs">
                                            <div className="font-bold text-white">Full Stack Engineer</div>
                                            <div className="text-indigo-300 text-[10px]">Vercel • Technical Screen Tomorrow</div>
                                        </div>
                                    </div>
                                    <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
                                        <div className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div> Offer (1)
                                        </div>
                                        <div className="p-3 bg-slate-950 rounded-lg border border-emerald-500/30 text-xs">
                                            <div className="font-bold text-white">Lead Backend Architect</div>
                                            <div className="text-emerald-300 text-[10px]">Datadog • Offer Review</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </motion.div>
            </section>

            {/* 4. Trust / Value Strip */}
            <section className="py-12 px-6 md:px-12 border-y border-slate-800/80 bg-slate-950/50">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                    <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 bg-indigo-600/10 text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                            <Target size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">AI-Powered Job Matching</h4>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Find opportunities aligned with your technical profile.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 bg-emerald-600/10 text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">Resume Intelligence</h4>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Understand and improve your ATS compatibility.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 bg-cyan-600/10 text-cyan-400 rounded-xl flex items-center justify-center shrink-0">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">Application Workflow</h4>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Keep every application organized in a 5-stage pipeline.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 bg-purple-600/10 text-purple-400 rounded-xl flex items-center justify-center shrink-0">
                            <Layers size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">Personalized Workspace</h4>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">Command Center analytics & privacy-isolated data.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Problem Section ("Searching for a job shouldn't feel like guessing") */}
            <section id="why-job-seer" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <Badge variant="amber" size="sm" className="mb-3">THE JOB SEARCH PROBLEM</Badge>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white">Searching for a job shouldn't feel like guessing.</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto mt-3 text-sm md:text-base">
                        Traditional job applications force candidates to deal with black-box ATS scanners and repetitive manual task loops.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <Card variant="flat" className="p-8 border-rose-500/20 bg-slate-950/60">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center font-bold">
                                <X size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Without Job Seer</h3>
                        </div>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex items-start gap-3">
                                <X size={18} className="text-rose-400 shrink-0 mt-0.5" />
                                <span>Submitting generic resumes without knowing if skills overlap</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X size={18} className="text-rose-400 shrink-0 mt-0.5" />
                                <span>Getting quietly filtered out by unreadable ATS formatting</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X size={18} className="text-rose-400 shrink-0 mt-0.5" />
                                <span>Spending hours manually writing repetitive cover letters</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X size={18} className="text-rose-400 shrink-0 mt-0.5" />
                                <span>Losing track of application dates, interview screens, and links</span>
                            </li>
                        </ul>
                    </Card>

                    <Card variant="elevated" className="p-8 border-indigo-500/30 bg-indigo-950/20 shadow-xl shadow-indigo-950/30">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center font-bold">
                                <Check size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-white">With Job Seer Workspace</h3>
                        </div>
                        <ul className="space-y-4 text-sm text-slate-200">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                <span>Seeing exact V2 Explainable Match % across 4 dimensions before applying</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                <span>Evaluating ATS health (0-100) and receiving domain skill recommendations</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                <span>Generating factual tailored CV versions and multi-tone cover letters in seconds</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                <span>Managing applications on an HTML5 drag-and-drop Kanban board</span>
                            </li>
                        </ul>
                    </Card>
                </div>
            </section>

            {/* 6. How Job Seer Works (5-Step Visual Workflow) */}
            <section id="how-it-works" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-slate-800/60">
                <div className="text-center mb-16">
                    <Badge variant="indigo" size="sm" className="mb-3">FIVE-STEP WORKFLOW</Badge>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">How Job Seer Streamlines Your Search</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto mt-3 text-sm md:text-base">
                        A systematic flow designed to move candidates from initial CV upload to tracked interview invitations.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Card variant="glass" className="p-6 relative">
                        <div className="text-xs font-mono font-bold text-indigo-400 mb-3">01</div>
                        <h3 className="text-base font-bold text-white mb-2">Build Profile</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Define technical skills, experience level, and preferred career roles.
                        </p>
                    </Card>

                    <Card variant="glass" className="p-6 relative">
                        <div className="text-xs font-mono font-bold text-purple-400 mb-3">02</div>
                        <h3 className="text-base font-bold text-white mb-2">Discover Opportunities</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Explore jobs and analyze compatibility using V2 Explainable Scoring.
                        </p>
                    </Card>

                    <Card variant="glass" className="p-6 relative">
                        <div className="text-xs font-mono font-bold text-cyan-400 mb-3">03</div>
                        <h3 className="text-base font-bold text-white mb-2">Tailor Application</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Generate tailored CV bullet versions and multi-tone cover letters.
                        </p>
                    </Card>

                    <Card variant="glass" className="p-6 relative">
                        <div className="text-xs font-mono font-bold text-emerald-400 mb-3">04</div>
                        <h3 className="text-base font-bold text-white mb-2">Apply Confidently</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Submit tailored materials backed by 90%+ ATS document health checks.
                        </p>
                    </Card>

                    <Card variant="glass" className="p-6 relative">
                        <div className="text-xs font-mono font-bold text-amber-400 mb-3">05</div>
                        <h3 className="text-base font-bold text-white mb-2">Track Progress</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Drag & drop applications on the Kanban board and set follow-ups.
                        </p>
                    </Card>
                </div>
            </section>

            {/* 7. Core Features Section */}
            <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-slate-800/60">
                <div className="text-center mb-16">
                    <Badge variant="indigo" size="sm" className="mb-3">BUILT-IN CAPABILITIES</Badge>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Engineered for Modern Job Seekers</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <SpotlightCard className="p-8">
                        <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                            <Target size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Explainable V2 AI Match</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Transparent score breakdown analyzing Skills (40%), Content (30%), Experience (15%), and Title (15%) with matched & missing skill chips.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard className="p-8">
                        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Resume Intelligence & ATS Health</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Evaluate document ATS readiness (0-100), verify contact information presence, and categorize skills across 7 technical domains.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard className="p-8">
                        <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center mb-6">
                            <Sparkles size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Factual CV Tailoring</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Generate versioned resume tailoring (`v1`, `v2`, `v3`) with factual integrity guarantees and side-by-side diff comparison.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard className="p-8">
                        <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                            <FileText size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Multi-Tone Cover Letters</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Format cover letters tailored to target hiring managers in 4 tones: Professional, Executive, Enthusiastic, and Technical.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard className="p-8">
                        <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mb-6">
                            <Clock size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Kanban Pipeline Board</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            HTML5 drag-and-drop tracking pipeline managing 5 status stages with optimistic UI updates, date logging, and application URL safety.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard className="p-8">
                        <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mb-6">
                            <BarChart3 size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Command Center Dashboard</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Real-time intelligence dashboard featuring KPI stat cards, ATS health scores, application stage breakdown, and job recommendations.
                        </p>
                    </SpotlightCard>
                </div>
            </section>

            {/* 8. Interactive FAQ Accordion */}
            <section id="faq" className="py-24 px-6 md:px-12 max-w-4xl mx-auto border-t border-slate-800/60">
                <div className="text-center mb-16">
                    <Badge variant="indigo" size="sm" className="mb-3">GOT QUESTIONS?</Badge>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4">
                    {faqItems.map((item, index) => (
                        <Card key={index} variant="glass" className="overflow-hidden">
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

            {/* 9. High-Converting CTA Banner Section */}
            <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
                <Card variant="elevated" className="p-12 md:p-16 border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 text-center relative overflow-hidden shadow-2xl shadow-indigo-950/60">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                        Your next opportunity deserves a smarter search.
                    </h2>
                    <p className="text-slate-300 max-w-2xl mx-auto mb-10 text-base md:text-lg leading-relaxed">
                        Build your profile, discover better-fit opportunities, and manage your applications with Job Seer.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register">
                            <Button variant="primary" size="lg" icon={ArrowRight}>
                                Get Started
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="secondary" size="lg">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </Card>
            </section>

            {/* 10. Footer */}
            <footer className="py-12 px-6 md:px-12 border-t border-slate-800/80 text-slate-500 text-xs">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Sparkles size={18} className="text-white" />
                        </div>
                        <span className="text-base font-bold text-white">Job Seer</span>
                    </div>
                    <div>
                        © {new Date().getFullYear()} Job Seer. All rights reserved.
                    </div>
                    <div className="flex gap-6">
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
