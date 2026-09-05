import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Target, Clock, ChevronRight, FileText,
    CheckCircle2, ShieldCheck, ArrowRight, Layers,
    Zap, BarChart3, ChevronDown, Check, X, Menu,
    TrendingUp, Compass, Award, ExternalLink, SlidersHorizontal,
    Database, Cpu, Lock, Scissors, Mail, Globe, Search, RefreshCw,
    Terminal, Code, Hash, Activity, Sparkles, ArrowUpRight,
    Command, CornerDownLeft, Eye, Filter, ArrowUpDown, Server,
    CheckSquare, AlertCircle, FileCheck, Split, Binary, Braces,
    Kanban, Workflow, Columns, Table as TableIcon, GitBranch,
    Plus, MoreHorizontal, User, Briefcase, ChevronRight as ChevronRightIcon,
    Sliders, CheckCircle, HelpCircle, ArrowRightLeft, Sparkle,
    Building2, MapPin, DollarSign, Bookmark, Share2, Star, CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Button from '../components/ui/Button';
import Logo from '../components/Logo';

// Animated Micro-Interaction Icon Wrapper Component
const AnimatedIcon = ({ icon: Icon, className = "w-5 h-5", variant = "bounce" }) => {
    const variants = {
        bounce: { whileHover: { scale: 1.18, rotate: [0, -6, 6, 0], transition: { duration: 0.35, ease: "easeOut" } } },
        pulse: { whileHover: { scale: 1.2, transition: { duration: 0.2, yoyo: Infinity } } },
        spin: { whileHover: { rotate: 360, transition: { duration: 0.6, ease: "easeInOut" } } },
        float: { whileHover: { y: -4, transition: { duration: 0.25, ease: "easeOut" } } }
    };

    return (
        <motion.div {...variants[variant]} className="inline-flex items-center justify-center cursor-pointer">
            <Icon className={className} />
        </motion.div>
    );
};

// Scroll Reveal Wrapper Component
const ScrollReveal = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={className}
    >
        {children}
    </motion.div>
);

function Landing() {
    // Mobile navigation state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Interactive Workspace View: 'jobs' | 'pipeline' | 'diagnostic' | 'tailoring'
    const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('jobs');

    // Table view filter state
    const [jobFilter, setJobFilter] = useState('all'); // 'all' | 'high_match' | 'remote' | 'top_salary'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedJobId, setSelectedJobId] = useState('job-01');

    // FAQ Accordion State
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    // Smooth Scroll Navigation Handler
    const handleNavClick = (e, targetId, tabToActivate = null) => {
        e.preventDefault();
        if (tabToActivate) {
            setActiveWorkspaceTab(tabToActivate);
        }
        setMobileMenuOpen(false);

        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = targetEl.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Curated Opportunities Data
    const curatedJobs = [
        {
            id: 'job-01',
            role: 'Senior Full-Stack Engineer',
            company: 'Vercel',
            location: 'San Francisco, CA (Remote)',
            salary: '$165,000 - $195,000',
            matchScore: 96,
            atsScore: 98,
            status: 'Ready to Apply',
            skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'TailwindCSS'],
            missingSkills: ['Rust (Wasm)'],
            stage: 'Screening',
            type: 'Full-time &bull; Remote',
            posted: '2 hours ago',
            externalUrl: 'https://adzuna.com'
        },
        {
            id: 'job-02',
            role: 'Staff Backend Architect',
            company: 'Stripe',
            location: 'New York, NY (Hybrid)',
            salary: '$190,000 - $230,000',
            matchScore: 92,
            atsScore: 95,
            status: 'High Match',
            skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis'],
            missingSkills: ['Distributed Transactions'],
            stage: 'Applied',
            type: 'Full-time &bull; Hybrid',
            posted: '5 hours ago',
            externalUrl: 'https://adzuna.com'
        },
        {
            id: 'job-03',
            role: 'Lead ML / NLP Engineer',
            company: 'Cohere',
            location: 'London, UK (Remote)',
            salary: '£130,000 - £155,000',
            matchScore: 89,
            atsScore: 91,
            status: 'Tailoring Ready',
            skills: ['PyTorch', 'FastAPI', 'TF-IDF', 'Scikit-Learn', 'Transformers'],
            missingSkills: ['vLLM', 'Triton'],
            stage: 'Interviewing',
            type: 'Full-time &bull; Remote',
            posted: '1 day ago',
            externalUrl: 'https://adzuna.com'
        },
        {
            id: 'job-04',
            role: 'Principal Security Engineer',
            company: 'Datadog',
            location: 'Boston, MA (Remote)',
            salary: '$180,000 - $215,000',
            matchScore: 85,
            atsScore: 94,
            status: 'Skill Gap Warning',
            skills: ['Python', 'Linux', 'OAuth2/JWT', 'CI/CD', 'Docker'],
            missingSkills: ['eBPF', 'Kernel Auditing'],
            stage: 'Screening',
            type: 'Full-time &bull; Remote',
            posted: '2 days ago',
            externalUrl: 'https://adzuna.com'
        },
        {
            id: 'job-05',
            role: 'Senior Data Platform Engineer',
            company: 'Snowflake',
            location: 'Seattle, WA (On-site)',
            salary: '$175,000 - $210,000',
            matchScore: 88,
            atsScore: 96,
            status: 'High Match',
            skills: ['SQL', 'Python', 'PostgreSQL', 'Data Pipelines', 'PyMuPDF'],
            missingSkills: ['Apache Spark', 'Kafka'],
            stage: 'Offer Extended',
            type: 'Full-time &bull; On-site',
            posted: '3 days ago',
            externalUrl: 'https://adzuna.com'
        }
    ];

    // Filtered Job Records
    const filteredJobs = useMemo(() => {
        return curatedJobs.filter(job => {
            const matchesSearch = searchQuery === '' ||
                job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

            if (!matchesSearch) return false;
            if (jobFilter === 'high_match') return job.matchScore >= 90;
            if (jobFilter === 'remote') return job.location.includes('Remote');
            if (jobFilter === 'top_salary') return job.salary.includes('190') || job.salary.includes('230') || job.salary.includes('215');
            return true;
        });
    }, [jobFilter, searchQuery]);

    // Active Selected Job
    const selectedJob = curatedJobs.find(j => j.id === selectedJobId) || curatedJobs[0];

    // 10 ATS Diagnostic Checks
    const diagnosticAuditItems = [
        {
            title: "Multi-Column Layout Safety",
            category: "Document Structure",
            desc: "Parses complex two-column Canva and Figma templates without text scramble or sidebar bleed.",
            score: "100%",
            passed: true
        },
        {
            title: "Contact & Portfolio Extraction",
            category: "Identity Verification",
            desc: "Detects and verifies clean email, phone, location, LinkedIn, and GitHub links.",
            score: "100%",
            passed: true
        },
        {
            title: "Action Verb Impact Density",
            category: "Linguistic Quality",
            desc: "Validates high-impact power verbs at the beginning of each experience bullet.",
            score: "94%",
            passed: true
        },
        {
            title: "Metric Quantification Rate",
            category: "Achievement Proof",
            desc: "Identifies measurable business results (%, $, throughput, and latency improvements).",
            score: "88%",
            passed: true
        },
        {
            title: "Skill Taxonomy & Synonym Normalization",
            category: "Keyword Optimization",
            desc: "Maps technical synonyms (e.g., React.js to React, K8s to Kubernetes) across 500+ skills.",
            score: "96%",
            passed: true
        },
        {
            title: "Recruiter Section Hierarchy",
            category: "ATS Standard Schema",
            desc: "Validates canonical section headings for seamless recruiter ATS ingestion.",
            score: "100%",
            passed: true
        }
    ];

    const faqList = [
        {
            q: "How does Smart Job Hunter calculate job match compatibility?",
            a: "Instead of generic keyword counting, our matching engine evaluates transparent criteria: Direct Skill Overlap, Semantic Content Alignment, Experience Level Fit, and Role Seniority. Every match includes a detailed breakdown of your strengths and specific missing skills."
        },
        {
            q: "Can I upload Canva, Figma, or modern two-column resumes?",
            a: "Yes. Smart Job Hunter uses coordinate-aware spatial parsing that reads columns in natural human reading order. Unlike traditional ATS parsers that scramble multi-column layouts into unreadable text, your design is parsed accurately."
        },
        {
            q: "Does the resume tailoring feature invent false experience?",
            a: "Never. We enforce 100% factual grounding guardrails. The platform restructures, clarifies, and highlights your real technical skills and accomplishments to match target role requirements without fabricating companies, dates, or metrics."
        },
        {
            q: "Where do the job openings come from?",
            a: "We connect directly to live global job feeds (US, UK, CA, DE, AU, IN), continuously refreshing verified listings with normalized salary bands and direct application links."
        },
        {
            q: "Is my personal data and resume kept private?",
            a: "Yes. Your resume and application tracking data are strictly private and isolated to your account. Your documents are never sold or used for external model training."
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white antialiased relative overflow-x-hidden">
            {/* Ambient Dot Matrix Procedural Background Pattern (Stripe/Linear Style) */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60 z-0" />

            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#EAEAE6] transition-all">
                <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative z-10">
                    {/* Brand */}
                    <div className="flex items-center gap-10">
                        <Link to="/" className="flex items-center group focus:outline-none">
                            <Logo size="sm" />
                        </Link>
                        {/* Nav Links - Exact matching navigation routes */}
                        <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium text-neutral-600">
                            <a
                                href="#workspace"
                                onClick={(e) => handleNavClick(e, 'workspace', 'jobs')}
                                className="hover:text-neutral-950 transition-colors"
                            >
                                Workspace
                            </a>
                            <a
                                href="#features"
                                onClick={(e) => handleNavClick(e, 'features')}
                                className="hover:text-neutral-950 transition-colors"
                            >
                                Features
                            </a>

                            <a
                                href="#faq"
                                onClick={(e) => handleNavClick(e, 'faq')}
                                className="hover:text-neutral-950 transition-colors"
                            >
                                FAQ
                            </a>
                        </nav>
                    </div>

                    {/* Action Controls */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login">
                            <button className="px-3.5 py-1.5 text-[13px] font-medium text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200/50 rounded-md transition-all">
                                Sign In
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="px-4 py-1.5 text-[13px] font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-all shadow-sm flex items-center gap-1.5 group">
                                <span>Get Started Free</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Trigger */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200/50 rounded-md border border-[#EAEAE6]"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-b border-[#EAEAE6] bg-[#FAF9F6] px-4 py-4 space-y-3 text-sm font-medium relative z-20">
                        <a
                            href="#workspace"
                            onClick={(e) => handleNavClick(e, 'workspace', 'jobs')}
                            className="block py-1 text-neutral-700"
                        >
                            Workspace
                        </a>
                        <a
                            href="#features"
                            onClick={(e) => handleNavClick(e, 'features')}
                            className="block py-1 text-neutral-700"
                        >
                            Features
                        </a>

                        <a
                            href="#faq"
                            onClick={(e) => handleNavClick(e, 'faq')}
                            className="block py-1 text-neutral-700"
                        >
                            FAQ
                        </a>
                        <div className="pt-2 flex flex-col gap-2">
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2 text-neutral-800 border border-[#EAEAE6] bg-white rounded-md">Sign In</Link>
                            <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2 text-white bg-neutral-900 rounded-md">Get Started Free</Link>
                        </div>
                    </div>
                )}
            </header>

            <main className="relative z-10">
                {/* 1. HERO SECTION */}
                <section className="pt-16 pb-12 md:pt-20 md:pb-16 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <ScrollReveal>
                        {/* Editorial Headline */}
                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-bold tracking-[-0.035em] text-neutral-950 leading-[1.02] max-w-5xl mx-auto mb-6">
                            The intelligent workspace for <br />
                            <span className="text-neutral-400 font-normal">your entire</span> career search.
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-8">
                            Audit your resume against strict recruiter ATS standards, discover mathematically scored job opportunities, and tailor applications in seconds with zero fabrication.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
                            <Link to="/register">
                                <Button size="lg" className="bg-neutral-900 text-white hover:bg-neutral-800 text-sm px-6 py-3 rounded-md shadow-sm flex items-center gap-2 font-medium group">
                                    <span>Start Building Free</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </Button>
                            </Link>
                            <a
                                href="#workspace"
                                onClick={(e) => handleNavClick(e, 'workspace', 'jobs')}
                            >
                                <Button variant="outline" size="lg" className="border-[#EAEAE6] bg-white text-neutral-800 hover:bg-neutral-50 text-sm px-6 py-3 rounded-md shadow-sm">
                                    <span>Explore Live Workspace</span>
                                </Button>
                            </a>
                        </div>
                    </ScrollReveal>

                    {/* 2. ATTIO-STYLE INTERACTIVE WORKSPACE PREVIEW */}
                    <ScrollReveal delay={0.15}>
                        <div id="workspace" className="bg-white border border-[#EAEAE6] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04),0_20px_40px_rgba(0,0,0,0.03)] overflow-hidden text-left">
                            {/* Workspace View Header Tabs */}
                            <div className="p-3 sm:p-4 border-b border-[#EAEAE6] bg-[#FAF9F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                {/* View Switchers */}
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                                    <button
                                        onClick={() => setActiveWorkspaceTab('jobs')}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                                            activeWorkspaceTab === 'jobs'
                                                ? 'bg-white text-neutral-950 shadow-sm border border-[#EAEAE6] font-semibold'
                                                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
                                        }`}
                                    >
                                        <AnimatedIcon icon={TableIcon} className="w-3.5 h-3.5 text-neutral-500" variant="float" />
                                        <span>Opportunities</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveWorkspaceTab('pipeline')}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                                            activeWorkspaceTab === 'pipeline'
                                                ? 'bg-white text-neutral-950 shadow-sm border border-[#EAEAE6] font-semibold'
                                                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
                                        }`}
                                    >
                                        <AnimatedIcon icon={Kanban} className="w-3.5 h-3.5 text-neutral-500" variant="bounce" />
                                        <span>Application Pipeline</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveWorkspaceTab('diagnostic')}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                                            activeWorkspaceTab === 'diagnostic'
                                                ? 'bg-white text-neutral-950 shadow-sm border border-[#EAEAE6] font-semibold'
                                                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
                                        }`}
                                    >
                                        <AnimatedIcon icon={CheckSquare} className="w-3.5 h-3.5 text-emerald-600" variant="pulse" />
                                        <span>ATS Diagnostic Check</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveWorkspaceTab('tailoring')}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                                            activeWorkspaceTab === 'tailoring'
                                                ? 'bg-white text-neutral-950 shadow-sm border border-[#EAEAE6] font-semibold'
                                                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
                                        }`}
                                    >
                                        <AnimatedIcon icon={FileCheck} className="w-3.5 h-3.5 text-indigo-500" variant="float" />
                                        <span>Grounded Tailoring</span>
                                    </button>
                                </div>

                                {/* Search & Filter */}
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search roles or skills..."
                                            className="pl-8 pr-3 py-1 bg-white border border-[#EAEAE6] rounded-md text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 w-full sm:w-48"
                                        />
                                    </div>
                                    <div className="hidden sm:flex items-center gap-1 text-xs text-neutral-600 bg-white border border-[#EAEAE6] px-2.5 py-1 rounded-md">
                                        <Filter className="w-3.5 h-3.5 text-neutral-400" />
                                        <select
                                            value={jobFilter}
                                            onChange={(e) => setJobFilter(e.target.value)}
                                            className="bg-transparent text-neutral-900 font-medium focus:outline-none cursor-pointer"
                                        >
                                            <option value="all">All Roles</option>
                                            <option value="high_match">Match &ge; 90%</option>
                                            <option value="remote">Remote Only</option>
                                            <option value="top_salary">Top Salary Bands</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* TAB 1: OPPORTUNITIES TABLE */}
                            {activeWorkspaceTab === 'jobs' && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-[13px]">
                                        <thead>
                                            <tr className="bg-[#FAF9F5] border-b border-[#EAEAE6] text-neutral-500 text-xs font-medium">
                                                <th className="py-2.5 px-4">Opportunity &amp; Company</th>
                                                <th className="py-2.5 px-4">Match Compatibility</th>
                                                <th className="py-2.5 px-4">ATS Readability</th>
                                                <th className="py-2.5 px-4">Matched Skills</th>
                                                <th className="py-2.5 px-4">Skill Gap</th>
                                                <th className="py-2.5 px-4">Compensation</th>
                                                <th className="py-2.5 px-4 text-right">Apply</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#EAEAE6] bg-white">
                                            {filteredJobs.map((job) => {
                                                const isSelected = selectedJobId === job.id;
                                                return (
                                                    <tr
                                                        key={job.id}
                                                        onClick={() => setSelectedJobId(job.id)}
                                                        className={`cursor-pointer transition-colors ${
                                                            isSelected ? 'bg-indigo-50/40' : 'hover:bg-neutral-50/70'
                                                        }`}
                                                    >
                                                        <td className="py-3.5 px-4">
                                                            <div className="font-semibold text-neutral-950 flex items-center gap-1.5">
                                                                <span>{job.role}</span>
                                                                {job.location.includes('Remote') && (
                                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 font-medium">
                                                                        Remote
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-neutral-500 text-xs flex items-center gap-1 mt-0.5">
                                                                <span className="font-medium text-neutral-700">{job.company}</span>
                                                                <span>&bull;</span>
                                                                <span>{job.location}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                                <span>{job.matchScore}% Match</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-neutral-900 rounded-full"
                                                                        style={{ width: `${job.atsScore}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-xs font-mono text-neutral-700">{job.atsScore}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                                {job.skills.slice(0, 3).map((s, idx) => (
                                                                    <span key={idx} className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-200/70 rounded text-[11px] text-neutral-700 font-mono">
                                                                        {s}
                                                                    </span>
                                                                ))}
                                                                {job.skills.length > 3 && (
                                                                    <span className="text-[11px] text-neutral-400 font-mono">+{job.skills.length - 3}</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-3.5 px-4">
                                                            <div className="flex flex-wrap gap-1">
                                                                {job.missingSkills.map((gap, idx) => (
                                                                    <span key={idx} className="px-1.5 py-0.5 bg-amber-50 border border-amber-200/80 rounded text-[11px] text-amber-800 font-mono">
                                                                        {gap}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="py-3.5 px-4 font-mono text-xs text-neutral-700 whitespace-nowrap">
                                                            {job.salary}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-right">
                                                            <a
                                                                href={job.externalUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-900 text-white rounded text-xs font-medium hover:bg-neutral-800 transition-colors"
                                                            >
                                                                <span>Apply</span>
                                                                <ArrowUpRight className="w-3 h-3" />
                                                            </a>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>

                                    {/* Active Job Footer Drawer */}
                                    <div className="p-4 bg-[#FAF9F5] border-t border-[#EAEAE6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center gap-3">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                            <span>
                                                Selected: <strong>{selectedJob.role}</strong> at <strong>{selectedJob.company}</strong>
                                            </span>
                                            <span className="text-neutral-300">|</span>
                                            <span className="text-neutral-500">{selectedJob.type}</span>
                                        </div>
                                        <Link to="/register">
                                            <button className="px-3.5 py-1.5 bg-neutral-900 text-white rounded font-medium hover:bg-neutral-800 transition-colors">
                                                Tailor Resume for this Role &rarr;
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: APPLICATION PIPELINE (KANBAN) */}
                            {activeWorkspaceTab === 'pipeline' && (
                                <div className="p-4 sm:p-6 bg-[#FAF9F5] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Column 1: Sourced */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 pb-2 border-b border-[#EAEAE6]">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-neutral-400" />
                                                <span>Sourced (2)</span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white border border-[#EAEAE6] rounded-lg shadow-sm space-y-2">
                                            <div className="text-xs font-semibold text-neutral-950">Senior Full-Stack Engineer</div>
                                            <div className="text-[11px] text-neutral-500">Vercel &bull; Remote</div>
                                            <div className="flex items-center justify-between pt-1">
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">96% Match</span>
                                                <span className="text-[10px] font-mono text-neutral-400">$165k-$195k</span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white border border-[#EAEAE6] rounded-lg shadow-sm space-y-2">
                                            <div className="text-xs font-semibold text-neutral-950">Principal Security Engineer</div>
                                            <div className="text-[11px] text-neutral-500">Datadog &bull; Boston</div>
                                            <div className="flex items-center justify-between pt-1">
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">85% Match</span>
                                                <span className="text-[10px] font-mono text-neutral-400">$180k-$215k</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 2: Applied */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 pb-2 border-b border-[#EAEAE6]">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                                <span>Applied (1)</span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white border border-[#EAEAE6] rounded-lg shadow-sm space-y-2">
                                            <div className="text-xs font-semibold text-neutral-950">Staff Backend Architect</div>
                                            <div className="text-[11px] text-neutral-500">Stripe &bull; NYC</div>
                                            <div className="flex items-center justify-between pt-1">
                                                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">95/100 ATS</span>
                                                <span className="text-[10px] text-neutral-500">Tailored v2</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 3: Interviewing */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 pb-2 border-b border-[#EAEAE6]">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                                <span>Interviewing (1)</span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white border border-[#EAEAE6] rounded-lg shadow-sm space-y-2">
                                            <div className="text-xs font-semibold text-neutral-950">Lead ML / NLP Engineer</div>
                                            <div className="text-[11px] text-neutral-500">Cohere &bull; London</div>
                                            <div className="flex items-center justify-between pt-1">
                                                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">Round 3 Scheduled</span>
                                                <span className="text-[10px] font-mono text-neutral-400">14 Sep</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 4: Offered */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 pb-2 border-b border-[#EAEAE6]">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-purple-500" />
                                                <span>Offered (1)</span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white border border-[#EAEAE6] rounded-lg shadow-sm space-y-2">
                                            <div className="text-xs font-semibold text-neutral-950">Senior Data Engineer</div>
                                            <div className="text-[11px] text-neutral-500">Snowflake &bull; Seattle</div>
                                            <div className="flex items-center justify-between pt-1">
                                                <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold">$195,000 / yr</span>
                                                <span className="text-[10px] text-emerald-600 font-semibold">Active Offer</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: ATS DIAGNOSTIC CHECK */}
                            {activeWorkspaceTab === 'diagnostic' && (
                                <div className="p-6 bg-white space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {diagnosticAuditItems.map((item, idx) => (
                                            <div key={idx} className="p-4 rounded-lg border border-[#EAEAE6] bg-[#FAF9F6] flex items-start justify-between gap-3">
                                                <div>
                                                    <div className="text-[11px] font-mono text-neutral-400 uppercase">{item.category}</div>
                                                    <div className="font-bold text-neutral-950 text-sm mt-0.5">{item.title}</div>
                                                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{item.desc}</p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                                                        <Check className="w-3 h-3" />
                                                        <span>{item.score}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: GROUNDED TAILORING DIFF */}
                            {activeWorkspaceTab === 'tailoring' && (
                                <div className="p-6 bg-white space-y-4 text-xs font-mono">
                                    <div className="p-3 bg-neutral-100 border border-neutral-200 rounded-md text-neutral-700 flex items-center justify-between">
                                        <span>Target Role: <strong>Senior Full-Stack Engineer at Vercel</strong></span>
                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">100% Factual Integrity Guardrail</span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-md">
                                            <div className="text-[10px] uppercase text-rose-500 font-bold mb-1">// Before Tailoring (Generic)</div>
                                            &bull; Worked on backend services and improved database queries for the web application team.
                                        </div>
                                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-md">
                                            <div className="text-[10px] uppercase text-emerald-600 font-bold mb-1">// After Tailoring (Quantified &amp; Targeted)</div>
                                            &bull; Architected asynchronous FastAPI endpoints with PostgreSQL indexing, reducing p99 response times by 42% across 10M records.
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollReveal>
                </section>

                {/* 3. VALUE PROPOSITION PILLARS WITH SCROLL REVEAL ANIMATIONS */}
                <section id="features" className="py-20 border-y border-[#EAEAE6] bg-white">
                    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal>
                            <div className="max-w-3xl mb-16">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 leading-tight">
                                    Built for candidates who value <br />
                                    precision, speed, and real results.
                                </h2>
                            </div>
                        </ScrollReveal>

                        {/* 3-Column Bento with Micro-Animated Icons */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Pillar 1 */}
                            <ScrollReveal delay={0.1}>
                                <motion.div
                                    whileHover={{ y: -4 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className="p-8 bg-[#FAF9F5] border border-[#EAEAE6] rounded-xl flex flex-col justify-between h-full hover:shadow-md transition-shadow"
                                >
                                    <div>
                                        <div className="w-12 h-12 rounded-xl bg-white border border-[#EAEAE6] flex items-center justify-center text-neutral-900 mb-6 shadow-sm">
                                            <AnimatedIcon icon={Split} className="w-6 h-6 text-neutral-900" variant="bounce" />
                                        </div>
                                        <h3 className="text-xl font-bold text-neutral-950 mb-3">Multi-Column Visual Ingestion</h3>
                                        <p className="text-sm text-neutral-600 leading-relaxed">
                                            Upload creative Canva, Figma, and modern PDF resume templates. Our spatial reading engine preserves column hierarchy without layout scrambling.
                                        </p>
                                    </div>
                                    <div className="mt-8 pt-4 border-t border-[#EAEAE6] text-xs font-semibold text-neutral-900 flex items-center gap-1">
                                        <span>Zero formatting corruption</span>
                                        <AnimatedIcon icon={CheckCheck} className="w-4 h-4 text-emerald-600" variant="bounce" />
                                    </div>
                                </motion.div>
                            </ScrollReveal>

                            {/* Pillar 2 */}
                            <ScrollReveal delay={0.2}>
                                <motion.div
                                    whileHover={{ y: -4 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className="p-8 bg-[#FAF9F5] border border-[#EAEAE6] rounded-xl flex flex-col justify-between h-full hover:shadow-md transition-shadow"
                                >
                                    <div>
                                        <div className="w-12 h-12 rounded-xl bg-white border border-[#EAEAE6] flex items-center justify-center text-neutral-900 mb-6 shadow-sm">
                                            <AnimatedIcon icon={SlidersHorizontal} className="w-6 h-6 text-neutral-900" variant="float" />
                                        </div>
                                        <h3 className="text-xl font-bold text-neutral-950 mb-3">Explainable Match Intelligence</h3>
                                        <p className="text-sm text-neutral-600 leading-relaxed">
                                            Understand exactly why you match a role. View transparent breakdowns across direct skills, seniority fit, and specific missing keyword gaps.
                                        </p>
                                    </div>
                                    <div className="mt-8 pt-4 border-t border-[#EAEAE6] text-xs font-semibold text-neutral-900 flex items-center gap-1">
                                        <span>Transparent mathematical rationale</span>
                                        <AnimatedIcon icon={CheckCheck} className="w-4 h-4 text-emerald-600" variant="bounce" />
                                    </div>
                                </motion.div>
                            </ScrollReveal>

                            {/* Pillar 3 */}
                            <ScrollReveal delay={0.3}>
                                <motion.div
                                    whileHover={{ y: -4 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className="p-8 bg-[#FAF9F5] border border-[#EAEAE6] rounded-xl flex flex-col justify-between h-full hover:shadow-md transition-shadow"
                                >
                                    <div>
                                        <div className="w-12 h-12 rounded-xl bg-white border border-[#EAEAE6] flex items-center justify-center text-neutral-900 mb-6 shadow-sm">
                                            <AnimatedIcon icon={Kanban} className="w-6 h-6 text-neutral-900" variant="pulse" />
                                        </div>
                                        <h3 className="text-xl font-bold text-neutral-950 mb-3">Unified Application Pipeline</h3>
                                        <p className="text-sm text-neutral-600 leading-relaxed">
                                            Track every opportunity from initial sourcing to final interview offers. Keep salary notes, interview dates, and custom tailored versions organized.
                                        </p>
                                    </div>
                                    <div className="mt-8 pt-4 border-t border-[#EAEAE6] text-xs font-semibold text-neutral-900 flex items-center gap-1">
                                        <span>End-to-end career CRM</span>
                                        <AnimatedIcon icon={CheckCheck} className="w-4 h-4 text-emerald-600" variant="bounce" />
                                    </div>
                                </motion.div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* 4. TRUST & ACCURACY METRICS WITH SCROLL REVEAL */}
                <section className="py-16 bg-[#FAF9F5] border-b border-[#EAEAE6]">
                    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                                <div>
                                    <div className="text-4xl sm:text-5xl font-black text-neutral-950 tracking-tight mb-1">99.4%</div>
                                    <div className="text-xs sm:text-sm text-neutral-500 font-medium">Layout Parsing Accuracy</div>
                                </div>
                                <div>
                                    <div className="text-4xl sm:text-5xl font-black text-neutral-950 tracking-tight mb-1">10-Point</div>
                                    <div className="text-xs sm:text-sm text-neutral-500 font-medium">ATS Compliance Check</div>
                                </div>
                                <div>
                                    <div className="text-4xl sm:text-5xl font-black text-neutral-950 tracking-tight mb-1">100%</div>
                                    <div className="text-xs sm:text-sm text-neutral-500 font-medium">Factual Claim Integrity</div>
                                </div>
                                <div>
                                    <div className="text-4xl sm:text-5xl font-black text-neutral-950 tracking-tight mb-1">6 Global</div>
                                    <div className="text-xs sm:text-sm text-neutral-500 font-medium">Live Job Board Feeds</div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>

                {/* 5. TECHNICAL FAQ WITH SMOOTH SCROLL ANCHOR */}
                <section id="faq" className="py-20 bg-white border-b border-[#EAEAE6]">
                    <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8">
                        <ScrollReveal>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 mb-3">
                                    Frequently Asked Questions
                                </h2>
                                <p className="text-neutral-500 text-sm">Everything you need to know about the platform.</p>
                            </div>

                            <div className="space-y-3">
                                {faqList.map((item, idx) => (
                                    <div key={idx} className="border border-[#EAEAE6] rounded-lg bg-[#FAF9F5] overflow-hidden">
                                        <button
                                            onClick={() => toggleFaq(idx)}
                                            className="w-full px-6 py-4 text-left flex items-center justify-between font-bold text-neutral-950 hover:bg-neutral-100/50 transition-colors text-sm"
                                        >
                                            <span>{item.q}</span>
                                            <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                                        </button>

                                        {openFaq === idx && (
                                            <div className="px-6 py-4 bg-white border-t border-[#EAEAE6] text-neutral-600 text-sm leading-relaxed">
                                                {item.a}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>
                </section>

                {/* 6. CONVERSION BANNER */}
                <section className="py-20 bg-neutral-950 text-white text-center">
                    <ScrollReveal>
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                                Start landing top roles with precision data.
                            </h2>
                            <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto mb-8">
                                Upload your resume now to run the 10-point diagnostic and discover mathematically scored opportunities in real-time.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Link to="/register">
                                    <Button size="lg" className="bg-white text-neutral-950 hover:bg-neutral-100 text-sm px-8 py-3.5 shadow-lg flex items-center gap-2 font-semibold">
                                        <span>Create Free Account</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button variant="outline" size="lg" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 text-sm px-6 py-3.5">
                                        <span>Sign In</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </ScrollReveal>
                </section>
            </main>

            {/* 7. STUDIO FOOTER */}
            <footer className="bg-[#FAF9F5] border-t border-[#EAEAE6] py-16 text-xs text-neutral-600 relative z-10">
                <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        {/* Col 1 */}
                        <div className="col-span-2 space-y-4">
                            <Logo size="sm" />
                            <p className="text-neutral-500 max-w-sm leading-relaxed">
                                The intelligent career workspace for candidates who value precision, accuracy, and real results.
                            </p>
                        </div>

                        {/* Col 2 */}
                        <div className="space-y-3">
                            <div className="font-semibold text-neutral-950 uppercase text-[11px] tracking-wider">Product</div>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#workspace"
                                        onClick={(e) => handleNavClick(e, 'workspace', 'jobs')}
                                        className="hover:text-neutral-950 transition-colors"
                                    >
                                        Workspace
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#features"
                                        onClick={(e) => handleNavClick(e, 'features')}
                                        className="hover:text-neutral-950 transition-colors"
                                    >
                                        Features
                                    </a>
                                </li>

                            </ul>
                        </div>

                        {/* Col 3 */}
                        <div className="space-y-3">
                            <div className="font-semibold text-neutral-950 uppercase text-[11px] tracking-wider">Account</div>
                            <ul className="space-y-2">
                                <li><Link to="/login" className="hover:text-neutral-950 transition-colors">Sign In</Link></li>
                                <li><Link to="/register" className="hover:text-neutral-950 transition-colors">Create Account</Link></li>
                                <li>
                                    <a
                                        href="#faq"
                                        onClick={(e) => handleNavClick(e, 'faq')}
                                        className="hover:text-neutral-950 transition-colors"
                                    >
                                        Privacy &amp; Security
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-[#EAEAE6] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
                        <div>&copy; 2026 Smart Job Hunter Inc. All rights reserved.</div>
                        <div className="flex items-center gap-6">
                            <span>Privacy Policy</span>
                            <span>Terms of Service</span>
                            <span>Security</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
