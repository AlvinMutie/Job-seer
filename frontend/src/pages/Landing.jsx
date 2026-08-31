import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Sparkles, Target, Clock, ChevronRight, Upload, Search, FileText,
    CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Layers,
    Zap, Cpu, BarChart3, HelpCircle, ChevronDown, Check, X, RefreshCw, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SpotlightCard from '../components/SpotlightCard';

function Landing() {
    // State for Hero Interactive Sandbox Tab
    const [heroTab, setHeroTab] = useState('match');

    // State for Simulator Role Selection
    const [selectedRole, setSelectedRole] = useState('frontend');

    // State for FAQ Accordion
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    // Role Simulator Data
    const simulatorData = {
        frontend: {
            roleTitle: 'Senior Frontend Engineer',
            company: 'TechFlow Systems',
            overallScore: 88,
            skillsScore: 92,
            contentScore: 85,
            experienceScore: 90,
            matchedSkills: ['React', 'TypeScript', 'Tailwind CSS', 'GraphQL', 'Vite', 'State Management'],
            missingSkills: ['Next.js App Router', 'WebGL'],
            tailoredBullet: 'Engineered high-throughput React SPA using TypeScript & Vite, boosting page load speeds by 42% and optimizing state management for 100k+ MAU.',
            rationale: 'Strong technical alignment with React and TypeScript. Content similarity demonstrates extensive frontend performance tuning experience.'
        },
        backend: {
            roleTitle: 'Lead Python Backend Engineer',
            company: 'DataCore Solutions',
            overallScore: 91,
            skillsScore: 95,
            contentScore: 88,
            experienceScore: 92,
            matchedSkills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis', 'SQLAlchemy'],
            missingSkills: ['Kubernetes Operators', 'Kafka'],
            tailoredBullet: 'Architected async FastAPI microservices handling 5,000 requests/sec with Redis caching, PostgreSQL indexing, and zero downtime deployment.',
            rationale: 'Exceptional backend score driven by FastAPI and PostgreSQL ORM expertise with demonstrated rate-limiting and performance optimization.'
        },
        fullstack: {
            roleTitle: 'Full Stack Engineer (Node + React)',
            company: 'CloudScale Inc',
            overallScore: 85,
            skillsScore: 86,
            contentScore: 84,
            experienceScore: 88,
            matchedSkills: ['React', 'Node.js', 'PostgreSQL', 'REST API', 'Git', 'CI/CD'],
            missingSkills: ['AWS Lambda', 'DynamoDB'],
            tailoredBullet: 'Designed end-to-end full stack application leveraging React components, centralized error handling middleware, and automated Pytest/Vite integration.',
            rationale: 'Balanced match across frontend and backend layers. Recommend adding specific serverless deployment highlights to maximize match.'
        }
    };

    const currentSim = simulatorData[selectedRole];

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
        <div className="min-h-screen bg-[#0b0f19] text-white selection:bg-indigo-500/30 font-sans">
            {/* Top Navigation Header */}
            <nav className="fixed top-0 w-full z-50 px-6 md:px-12 py-4 flex justify-between items-center bg-[#0b0f19]/80 backdrop-blur-xl border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Sparkles size={22} className="text-white" />
                    </div>
                    <div>
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent block leading-none">
                            Job Seer
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Intelligent Companion</span>
                    </div>
                </div>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                    <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#simulator" className="hover:text-white transition-colors">Live Match Simulator</a>
                    <a href="#comparison" className="hover:text-white transition-colors">Why Job Seer</a>
                    <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                </div>

                <div className="flex gap-4 items-center">
                    <Link to="/login" className="px-5 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Login
                    </Link>
                    <Link to="/register" className="px-5 py-2.5 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 flex items-center gap-1.5">
                        Get Started Free <ChevronRight size={16} />
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-36 pb-20 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden">
                {/* Glow Background Gradient Orbs */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/15 blur-[160px] rounded-full -z-10 pointer-events-none"></div>
                <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[140px] rounded-full -z-10 pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="max-w-4xl flex flex-col items-center"
                >
                    <span className="badge badge-indigo text-xs py-1.5 px-4 mb-6 inline-flex items-center gap-2 border border-indigo-500/30 bg-indigo-500/10 rounded-full text-indigo-300">
                        <Sparkles size={14} className="text-amber-400 animate-spin-slow" /> Your Intelligent Job Search Companion
                    </span>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.08] text-white">
                        Land 3x More Interviews with <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
                            Explainable AI & Resume Intelligence
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-3xl mb-10 leading-relaxed">
                        Upload your CV once. Job Seer evaluates your ATS readiness, scores exact job description fit across 4 dimensions, generates factual tailored resume versions, drafts multi-tone cover letters, and tracks applications in a Kanban workspace.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                        <Link to="/register" className="btn-primary py-4 px-9 text-base rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 font-semibold">
                            Start Free Account <ArrowRight size={18} />
                        </Link>
                        <a href="#simulator" className="px-8 py-4 text-base font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl transition-all flex items-center justify-center gap-2">
                            Test Match Simulator
                        </a>
                    </div>

                    {/* Social Proof Stats */}
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-left border-t border-slate-800/80 pt-8 w-full max-w-3xl">
                        <div>
                            <div className="text-2xl font-black text-white">92%</div>
                            <div className="text-xs text-slate-400 font-medium">ATS Scan Accuracy</div>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-indigo-400">4-Factor</div>
                            <div className="text-xs text-slate-400 font-medium">Explainable V2 Match</div>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-emerald-400">4 Tones</div>
                            <div className="text-xs text-slate-400 font-medium">Cover Letter Generator</div>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-cyan-400">100%</div>
                            <div className="text-xs text-slate-400 font-medium">Factual Integrity</div>
                        </div>
                    </div>
                </motion.div>

                {/* Self-Explaining Interactive Hero Sandbox */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.2 }}
                    className="mt-16 w-full max-w-5xl glass-card rounded-3xl border border-slate-800 p-6 bg-slate-950/90 shadow-2xl shadow-indigo-950/50 text-left"
                >
                    {/* Sandbox Header Bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                                <span className="text-xs text-slate-400 font-mono ml-2">Job Seer Interactive Live Preview</span>
                            </div>
                        </div>

                        {/* Interactive Sandbox Tabs */}
                        <div className="flex flex-wrap gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
                            <button
                                onClick={() => setHeroTab('match')}
                                className={`px-4 py-2 text-xs font-medium rounded-xl transition-all flex items-center gap-1.5 ${heroTab === 'match' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                <Target size={14} /> V2 Match Engine
                            </button>
                            <button
                                onClick={() => setHeroTab('ats')}
                                className={`px-4 py-2 text-xs font-medium rounded-xl transition-all flex items-center gap-1.5 ${heroTab === 'ats' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                <ShieldCheck size={14} /> ATS Health
                            </button>
                            <button
                                onClick={() => setHeroTab('tailor')}
                                className={`px-4 py-2 text-xs font-medium rounded-xl transition-all flex items-center gap-1.5 ${heroTab === 'tailor' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                <FileText size={14} /> Resume Tailor
                            </button>
                            <button
                                onClick={() => setHeroTab('kanban')}
                                className={`px-4 py-2 text-xs font-medium rounded-xl transition-all flex items-center gap-1.5 ${heroTab === 'kanban' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                <Clock size={14} /> Kanban Tracker
                            </button>
                        </div>
                    </div>

                    {/* Tab Content Display */}
                    <div className="pt-6">
                        {heroTab === 'match' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl gap-4">
                                    <div>
                                        <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Target Job Match</div>
                                        <div className="text-lg font-bold text-white">Senior Full Stack Engineer — Stripe</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className="text-3xl font-black text-emerald-400">88%</div>
                                            <div className="text-[10px] text-slate-400 font-medium">Overall Match Score</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                                        <div className="text-xs text-slate-400">Skills Overlap (40%)</div>
                                        <div className="text-xl font-bold text-indigo-400 mt-1">92%</div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                                            <div className="bg-indigo-500 h-full w-[92%]"></div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                                        <div className="text-xs text-slate-400">Content Vector (30%)</div>
                                        <div className="text-xl font-bold text-purple-400 mt-1">85%</div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                                            <div className="bg-purple-500 h-full w-[85%]"></div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                                        <div className="text-xs text-slate-400">Experience Alignment (15%)</div>
                                        <div className="text-xl font-bold text-cyan-400 mt-1">90%</div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                                            <div className="bg-cyan-500 h-full w-[90%]"></div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                                        <div className="text-xs text-slate-400">Role Title Match (15%)</div>
                                        <div className="text-xl font-bold text-emerald-400 mt-1">85%</div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                                            <div className="bg-emerald-500 h-full w-[85%]"></div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs font-semibold text-slate-400 mb-2">Matched Key Skills:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'REST API', 'Docker'].map(skill => (
                                            <span key={skill} className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 text-xs rounded-lg border border-emerald-500/20 flex items-center gap-1">
                                                <Check size={12} /> {skill}
                                            </span>
                                        ))}
                                        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 text-xs rounded-lg border border-amber-500/20 flex items-center gap-1">
                                            <AlertTriangle size={12} /> Missing: Kubernetes
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {heroTab === 'ats' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="flex items-center justify-between p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-lg">
                                            92%
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">ATS Document Health Score</div>
                                            <div className="text-xs text-slate-400">Parsed cleanly via PyMuPDF. Section completeness verified.</div>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-bold">Passed ATS Gate</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                                        <div className="text-xs font-bold text-slate-300 mb-2">Languages</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">Python</span>
                                            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">JavaScript</span>
                                            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">TypeScript</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                                        <div className="text-xs font-bold text-slate-300 mb-2">Frontend & Web</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">React</span>
                                            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">HTML5/CSS3</span>
                                            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">Tailwind</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                                        <div className="text-xs font-bold text-slate-300 mb-2">Databases & Cloud</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">PostgreSQL</span>
                                            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">Redis</span>
                                            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded">Docker</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {heroTab === 'tailor' && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-indigo-400">Tailored Resume Diff Viewer (v2)</span>
                                        <span className="text-[10px] text-emerald-400 font-mono">Factual Integrity Verified</span>
                                    </div>
                                    <div className="font-mono text-xs space-y-1">
                                        <div className="text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                                            - Developed web applications using React and Node.js for company projects.
                                        </div>
                                        <div className="text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                                            + Engineered high-throughput React SPA & Node REST APIs, optimizing load performance by 35% and increasing test coverage.
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-indigo-950/30 rounded-xl border border-indigo-500/20 flex justify-between items-center">
                                    <div>
                                        <div className="text-xs font-bold text-white">Cover Letter Tone: <span className="text-indigo-400">Professional</span></div>
                                        <div className="text-xs text-slate-400">"Dear Hiring Manager, I am writing to express my strong interest in the Senior Engineer role..."</div>
                                    </div>
                                    <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg flex items-center gap-1">
                                        <Copy size={12} /> Copy
                                    </button>
                                </div>
                            </div>
                        )}

                        {heroTab === 'kanban' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
                                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                                    <div className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-blue-400"></div> Applied (2)
                                    </div>
                                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                                        <div className="font-bold text-white">Senior Frontend Dev</div>
                                        <div className="text-slate-400 text-[10px]">Stripe • Applied 2 days ago</div>
                                    </div>
                                </div>
                                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                                    <div className="text-xs font-bold text-indigo-400 mb-2 flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-indigo-400"></div> Interview (1)
                                    </div>
                                    <div className="p-3 bg-slate-950 rounded-lg border border-indigo-500/30 text-xs">
                                        <div className="font-bold text-white">Full Stack Engineer</div>
                                        <div className="text-indigo-300 text-[10px]">Vercel • Technical Screen Tomorrow</div>
                                    </div>
                                </div>
                                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
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
                </motion.div>
            </section>

            {/* Section 1: How It Works (4-Step Visual Workflow) */}
            <section id="how-it-works" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-slate-800/60">
                <div className="text-center mb-16">
                    <span className="badge badge-indigo text-xs py-1 px-3 mb-3 inline-block">Step-by-Step System</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">How Job Seer Accelerates Your Job Search</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto mt-3 text-sm md:text-base">
                        A structured AI companion workflow designed to transform generic applications into tailored interview invitations.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-6 glass-card rounded-2xl border border-slate-800 relative">
                        <div className="w-10 h-10 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center font-bold mb-4">
                            01
                        </div>
                        <h3 className="text-lg font-bold mb-2">Upload CV & ATS Check</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Upload PDF or DOCX documents. Job Seer parses structure, checks contact details, and scores document ATS health (0-100).
                        </p>
                    </div>

                    <div className="p-6 glass-card rounded-2xl border border-slate-800 relative">
                        <div className="w-10 h-10 bg-purple-600/20 text-purple-400 rounded-xl flex items-center justify-center font-bold mb-4">
                            02
                        </div>
                        <h3 className="text-lg font-bold mb-2">V2 Explainable Match</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Analyze fit across 4 weighted dimensions: Skills Overlap (40%), Content Vector (30%), Experience (15%), and Title (15%).
                        </p>
                    </div>

                    <div className="p-6 glass-card rounded-2xl border border-slate-800 relative">
                        <div className="w-10 h-10 bg-cyan-600/20 text-cyan-400 rounded-xl flex items-center justify-center font-bold mb-4">
                            03
                        </div>
                        <h3 className="text-lg font-bold mb-2">Tailor CV & Cover Letter</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Generate line-by-line tailored CV versions with factual integrity and draft multi-tone cover letters (Professional, Executive, etc.).
                        </p>
                    </div>

                    <div className="p-6 glass-card rounded-2xl border border-slate-800 relative">
                        <div className="w-10 h-10 bg-emerald-600/20 text-emerald-400 rounded-xl flex items-center justify-center font-bold mb-4">
                            04
                        </div>
                        <h3 className="text-lg font-bold mb-2">Track on Kanban Board</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Drag & drop application statuses across 5 stages, record interview dates, set follow-up reminders, and review analytics.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 2: Core Feature Deep-Dive (Dribbble Spotlight Cards) */}
            <section id="features" className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-slate-800/60">
                <div className="text-center mb-16">
                    <span className="badge badge-indigo text-xs py-1 px-3 mb-3 inline-block">Product Capabilities</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Engineered for Candidates Who Want Results</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <SpotlightCard className="p-8">
                        <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                            <Target size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Explainable V2 AI Match</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Transparent score breakdown with human-readable rationale, exact score weights, matched skill chips, and missing skill warnings.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard className="p-8">
                        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                            <Sparkles size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Factual CV Tailoring</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Generate job-specific CV versions with version history (`v1`, `v2`, `v3`) and line-by-line diff comparison without hallucinated metrics.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard className="p-8">
                        <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center mb-6">
                            <FileText size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Multi-Tone Cover Letters</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Format cover letters tailored to target hiring managers in 4 specialized tones: Professional, Executive, Enthusiastic, and Technical.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard className="p-8">
                        <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                            <Clock size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Kanban Pipeline Board</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            HTML5 drag-and-drop tracking pipeline managing 5 status stages with optimistic UI updates, date logging, and application URL safety.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard className="p-8">
                        <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mb-6">
                            <BarChart3 size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Command Center Analytics</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Aggregated real-time metrics showcasing average match %, active pipeline counts, ATS readiness scores, and AI asset counts.
                        </p>
                    </SpotlightCard>

                    <SpotlightCard className="p-8">
                        <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mb-6">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Production Security & Privacy</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Protected by dual HttpOnly cookies, sliding window rate limiters, HTTP security headers, and strict resource-owner data isolation.
                        </p>
                    </SpotlightCard>
                </div>
            </section>

            {/* Section 3: Interactive Skill Match Simulator */}
            <section id="simulator" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-slate-800/60">
                <div className="text-center mb-12">
                    <span className="badge badge-indigo text-xs py-1 px-3 mb-3 inline-block">Try It Live</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Interactive Skill Match Simulator</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto mt-2 text-sm">
                        Select a sample engineering role below to experience Job Seer's explainable matching engine in real time.
                    </p>
                </div>

                <div className="flex justify-center gap-3 mb-8 flex-wrap">
                    <button
                        onClick={() => setSelectedRole('frontend')}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${selectedRole === 'frontend' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
                    >
                        Frontend Engineer
                    </button>
                    <button
                        onClick={() => setSelectedRole('backend')}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${selectedRole === 'backend' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
                    >
                        Python Backend Lead
                    </button>
                    <button
                        onClick={() => setSelectedRole('fullstack')}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${selectedRole === 'fullstack' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
                    >
                        Full Stack Engineer
                    </button>
                </div>

                <div className="glass-card p-8 rounded-3xl border border-slate-800 max-w-4xl mx-auto bg-slate-950/80">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-800 gap-4">
                        <div>
                            <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">{currentSim.company}</span>
                            <h3 className="text-2xl font-bold text-white">{currentSim.roleTitle}</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-4xl font-black text-emerald-400">{currentSim.overallScore}%</div>
                                <div className="text-[11px] text-slate-400">Match Score</div>
                            </div>
                        </div>
                    </div>

                    <div className="py-6 border-b border-slate-800 space-y-4">
                        <div className="text-xs font-bold text-slate-300">Explainable Dimension Breakdown:</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                                <div className="text-[11px] text-slate-400">Skills Overlap</div>
                                <div className="text-lg font-bold text-indigo-400">{currentSim.skillsScore}%</div>
                            </div>
                            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                                <div className="text-[11px] text-slate-400">Content Similarity</div>
                                <div className="text-lg font-bold text-purple-400">{currentSim.contentScore}%</div>
                            </div>
                            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                                <div className="text-[11px] text-slate-400">Experience Fit</div>
                                <div className="text-lg font-bold text-cyan-400">{currentSim.experienceScore}%</div>
                            </div>
                            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                                <div className="text-[11px] text-slate-400">Title Overlap</div>
                                <div className="text-lg font-bold text-emerald-400">90%</div>
                            </div>
                        </div>
                    </div>

                    <div className="py-6 space-y-4">
                        <div>
                            <div className="text-xs font-bold text-slate-300 mb-2">Matched Key Skills:</div>
                            <div className="flex flex-wrap gap-2">
                                {currentSim.matchedSkills.map(skill => (
                                    <span key={skill} className="px-3 py-1 bg-emerald-500/10 text-emerald-300 text-xs rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                                        <Check size={14} /> {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="text-xs font-bold text-amber-400 mb-2">Missing Recommended Skills:</div>
                            <div className="flex flex-wrap gap-2">
                                {currentSim.missingSkills.map(skill => (
                                    <span key={skill} className="px-3 py-1 bg-amber-500/10 text-amber-300 text-xs rounded-lg border border-amber-500/20 flex items-center gap-1.5">
                                        <AlertTriangle size={14} /> {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                            <div className="text-xs font-bold text-indigo-400 mb-1">Generated Tailored Resume Bullet Suggestion:</div>
                            <div className="text-xs text-slate-300 font-mono leading-relaxed">{currentSim.tailoredBullet}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Traditional Search vs. Job Seer Comparison Matrix */}
            <section id="comparison" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-slate-800/60">
                <div className="text-center mb-16">
                    <span className="badge badge-indigo text-xs py-1 px-3 mb-3 inline-block">The Job Seer Advantage</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Traditional Applying vs. Job Seer</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Traditional Card */}
                    <div className="p-8 rounded-3xl bg-slate-950/60 border border-red-500/20 relative">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center font-bold">
                                <X size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Traditional Job Search</h3>
                        </div>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex items-start gap-3">
                                <X size={18} className="text-red-400 shrink-0 mt-0.5" />
                                <span>Blindly submitting the same generic resume to dozens of jobs</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X size={18} className="text-red-400 shrink-0 mt-0.5" />
                                <span>Getting rejected by ATS scanners due to unreadable formatting</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X size={18} className="text-red-400 shrink-0 mt-0.5" />
                                <span>Spending hours manually writing repetitive cover letters</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <X size={18} className="text-red-400 shrink-0 mt-0.5" />
                                <span>Losing track of application dates, links, and follow-ups</span>
                            </li>
                        </ul>
                    </div>

                    {/* Job Seer Card */}
                    <div className="p-8 rounded-3xl bg-indigo-950/30 border border-indigo-500/40 relative shadow-xl shadow-indigo-950/30">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center font-bold">
                                <Check size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-white">With Job Seer Companion</h3>
                        </div>
                        <ul className="space-y-4 text-sm text-slate-200">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                <span>Knowing your exact V2 Explainable Match % before applying</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                <span>90%+ ATS document health check guaranteeing readability</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                <span>Factual resume tailoring and multi-tone cover letters in seconds</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                <span>HTML5 drag-and-drop Kanban pipeline workspace</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Section 5: Interactive FAQ Accordion */}
            <section id="faq" className="py-24 px-6 md:px-12 max-w-4xl mx-auto border-t border-slate-800/60">
                <div className="text-center mb-16">
                    <span className="badge badge-indigo text-xs py-1 px-3 mb-3 inline-block">Got Questions?</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4">
                    {faqItems.map((item, index) => (
                        <div key={index} className="glass-card rounded-2xl border border-slate-800 overflow-hidden transition-all">
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-slate-900/50 transition-colors"
                            >
                                <span className="font-bold text-white text-base md:text-lg">{item.q}</span>
                                <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-indigo-400' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {openFaq === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-slate-800/40 pt-4"
                                    >
                                        {item.a}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 6: High-Converting Glass CTA Banner & Footer */}
            <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="p-12 md:p-16 rounded-3xl glass-card border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 text-center relative overflow-hidden shadow-2xl shadow-indigo-950/60">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full -z-10"></div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                        Ready to Accelerate Your Career?
                    </h2>
                    <p className="text-slate-300 max-w-2xl mx-auto mb-10 text-base md:text-lg leading-relaxed">
                        Join job seekers who use Job Seer to evaluate ATS health, score job matches, tailor resumes, and manage interview pipelines.
                    </p>
                    <Link to="/register" className="btn-primary py-4 px-10 text-lg rounded-2xl shadow-xl shadow-indigo-600/30 inline-flex items-center gap-2 font-bold">
                        Launch Job Seer Free <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 md:px-12 border-t border-slate-800/80 text-slate-500 text-xs text-center md:text-left">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Sparkles size={18} className="text-white" />
                        </div>
                        <span className="text-base font-bold text-white">Job Seer</span>
                    </div>
                    <div>
                        © {new Date().getFullYear()} Job Seer — Your intelligent job search companion. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <a href="#how-it-works" className="hover:text-slate-300 transition-colors">How It Works</a>
                        <a href="#features" className="hover:text-slate-300 transition-colors">Features</a>
                        <a href="#simulator" className="hover:text-slate-300 transition-colors">Match Simulator</a>
                        <a href="#faq" className="hover:text-slate-300 transition-colors">FAQ</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
