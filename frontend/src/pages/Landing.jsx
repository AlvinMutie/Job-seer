import React, { useState, useEffect, useMemo } from 'react';
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
    Sliders, CheckCircle, HelpCircle, ArrowRightLeft, Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Button from '../components/ui/Button';
import Logo from '../components/Logo';

function Landing() {
    // Mobile navigation state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Attio Hero Workspace View State
    const [activeHeroView, setActiveHeroView] = useState('table'); // 'table' | 'kanban' | 'automation' | 'objects'

    // Table view filter state
    const [tableFilter, setTableFilter] = useState('all'); // 'all' | 'high_match' | 'remote' | 'tailor_ready'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedJobIndex, setSelectedJobIndex] = useState(0);

    // Interactive Formula Sliders State
    const [weights, setWeights] = useState({
        skills: 40,
        vector: 30,
        experience: 15,
        title: 15
    });

    const sampleScores = { skills: 94, vector: 88, experience: 95, title: 90 };
    const totalWeight = weights.skills + weights.vector + weights.experience + weights.title;
    const computedScore = Math.round(
        (weights.skills * sampleScores.skills +
         weights.vector * sampleScores.vector +
         weights.experience * sampleScores.experience +
         weights.title * sampleScores.title) / (totalWeight || 1)
    );

    // Spatial coordinate inspector state
    const [inspectedBox, setInspectedBox] = useState(null);

    // 10-Layer ATS Diagnostic Active Item
    const [activeDiagnosticLayer, setActiveDiagnosticLayer] = useState(0);

    // FAQ Accordion State
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    // Realistic CRM dataset for Attio-style Table & Kanban
    const datasetJobs = [
        {
            id: 'job-01',
            role: 'Senior Full-Stack Engineer',
            company: 'Vercel',
            companyDomain: 'vercel.com',
            location: 'San Francisco, CA',
            remote: true,
            salary: '$165,000 - $195,000',
            matchScore: 96,
            atsHealth: 98,
            stage: 'Screening',
            directSkills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'TailwindCSS'],
            skillGaps: ['Rust (Wasm)'],
            status: 'Ready to Apply',
            vectorSimilarity: '0.942 Cosine',
            updatedAt: '12m ago',
            externalUrl: 'https://adzuna.com'
        },
        {
            id: 'job-02',
            role: 'Staff Python Backend Architect',
            company: 'Stripe',
            companyDomain: 'stripe.com',
            location: 'New York, NY',
            remote: false,
            salary: '$190,000 - $230,000',
            matchScore: 92,
            atsHealth: 95,
            stage: 'Applied',
            directSkills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis'],
            skillGaps: ['gRPC', 'Distributed Locks'],
            status: 'High Match',
            vectorSimilarity: '0.918 Cosine',
            updatedAt: '1h ago',
            externalUrl: 'https://adzuna.com'
        },
        {
            id: 'job-03',
            role: 'Lead ML / NLP Platform Engineer',
            company: 'Cohere',
            companyDomain: 'cohere.com',
            location: 'London, UK',
            remote: true,
            salary: '£130,000 - £155,000',
            matchScore: 89,
            atsHealth: 91,
            stage: 'Interviewing',
            directSkills: ['PyTorch', 'FastAPI', 'TF-IDF', 'Scikit-Learn', 'HuggingFace'],
            skillGaps: ['vLLM', 'Triton'],
            status: 'Needs Tailoring',
            vectorSimilarity: '0.887 Cosine',
            updatedAt: '3h ago',
            externalUrl: 'https://adzuna.com'
        },
        {
            id: 'job-04',
            role: 'Principal Security Engineer',
            company: 'Datadog',
            companyDomain: 'datadoghq.com',
            location: 'Boston, MA',
            remote: true,
            salary: '$180,000 - $215,000',
            matchScore: 84,
            atsHealth: 94,
            stage: 'Screening',
            directSkills: ['Python', 'Linux', 'OAuth2/JWT', 'CI/CD', 'Docker'],
            skillGaps: ['eBPF', 'Kernel Tracing'],
            status: 'Skill Gap Warning',
            vectorSimilarity: '0.841 Cosine',
            updatedAt: '5h ago',
            externalUrl: 'https://adzuna.com'
        },
        {
            id: 'job-05',
            role: 'Senior Distributed Data Engineer',
            company: 'Snowflake',
            companyDomain: 'snowflake.com',
            location: 'Seattle, WA',
            remote: false,
            salary: '$175,000 - $210,000',
            matchScore: 88,
            atsHealth: 96,
            stage: 'Offered',
            directSkills: ['SQL', 'Python', 'PostgreSQL', 'Data Pipelines', 'PyMuPDF'],
            skillGaps: ['Apache Spark', 'Kafka Streams'],
            status: 'High Match',
            vectorSimilarity: '0.879 Cosine',
            updatedAt: '1d ago',
            externalUrl: 'https://adzuna.com'
        }
    ];

    // Filtered records
    const filteredJobs = useMemo(() => {
        return datasetJobs.filter(job => {
            const matchesSearch = searchQuery === '' ||
                job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.directSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

            if (!matchesSearch) return false;
            if (tableFilter === 'high_match') return job.matchScore >= 90;
            if (tableFilter === 'remote') return job.remote;
            if (tableFilter === 'tailor_ready') return job.status === 'Ready to Apply' || job.status === 'High Match';
            return true;
        });
    }, [tableFilter, searchQuery]);

    // 10-Layer ATS Diagnostic Inspection Items
    const diagnosticLayers = [
        {
            id: '01',
            name: 'Spatial Bounding Geometry',
            category: 'Layout & Parsing',
            status: 'PASSED',
            score: '100 / 100',
            metric: 'PyMuPDF [x0, y0, x1, y1]',
            description: 'Extracts dual-column Canva/Figma text blocks without horizontal text interweaving.'
        },
        {
            id: '02',
            name: 'Contact & Social Vector Extraction',
            category: 'Candidate Identification',
            status: 'PASSED',
            score: '100 / 100',
            metric: 'RFC-5322 & E.164 Clean',
            description: 'Validates presence of normalized email, phone, location, and verified GitHub/LinkedIn links.'
        },
        {
            id: '03',
            name: 'Action Verb Impact Density',
            category: 'Linguistic Structure',
            status: 'PASSED',
            score: '94 / 100',
            metric: '28 Deterministic Power Verbs',
            description: 'Verifies leading power verbs (Architected, Engineered, Optimized) in bullet points.'
        },
        {
            id: '04',
            name: 'Metric Quantification Ratio',
            category: 'Accomplishment Validation',
            status: 'PASSED',
            score: '88 / 100',
            metric: '72% Metric Ratio',
            description: 'Detects presence of measurable business outcomes (%, $, latency, throughput scale).'
        },
        {
            id: '05',
            name: 'Font Encoding & Glyph Integrity',
            category: 'Binary Safety',
            status: 'PASSED',
            score: '100 / 100',
            metric: 'Zero CID-Font Corruption',
            description: 'Validates UTF-8 encoding with zero broken ligatures or corrupted character codes.'
        },
        {
            id: '06',
            name: 'Section Taxonomy Normalization',
            category: 'ATS Schema',
            status: 'PASSED',
            score: '100 / 100',
            metric: '5 / 5 Standard Headers Found',
            description: 'Maps non-standard headings to canonical ATS standard section schemas.'
        },
        {
            id: '07',
            name: '500+ Skill Alias Normalization',
            category: 'Taxonomy Engine',
            status: 'PASSED',
            score: '96 / 100',
            metric: '18 Canonical Skills Mapped',
            description: 'Normalizes synonyms and versions (e.g. React.js -> React, K8s -> Kubernetes).'
        },
        {
            id: '08',
            name: 'Boundary & Storage Security',
            category: 'Security Vault',
            status: 'PASSED',
            score: '100 / 100',
            metric: '10MB Cap / UUID Sanitized',
            description: 'Enforces magic-byte MIME validation, strict 10MB limits, and per-user storage isolation.'
        },
        {
            id: '09',
            name: 'TF-IDF Keyword Proximity',
            category: 'Vector Similarity',
            status: 'PASSED',
            score: '91 / 100',
            metric: 'Cosine Vector 0.912',
            description: 'Calculates unigram and bigram term frequency-inverse document frequency vectors.'
        },
        {
            id: '10',
            name: 'Claim Grounding Integrity',
            category: 'Factual Guardrail',
            status: 'VERIFIED',
            score: '100% Grounded',
            metric: 'Zero Hallucination Verified',
            description: 'Enforces diff guardrails to prevent fabrication of non-existent employers or titles.'
        }
    ];

    const faqItems = [
        {
            q: "How does the explainable 4-factor match engine calculate compatibility?",
            a: "Unlike opaque black-box scoring, Smart Job Hunter evaluates four transparent mathematical vectors: Skills Overlap (40%), TF-IDF Vector Content Similarity (30%), Experience Level Alignment (15%), and Role Title Matching (15%) with complete arithmetic breakdown."
        },
        {
            q: "How does the spatial coordinate parser resolve dual-column Canva resumes?",
            a: "Smart Job Hunter uses PyMuPDF bounding box coordinates [x0, y0, x1, y1] to analyze physical coordinate density across page width thresholds. It extracts the left column top-to-bottom first, then the right column, completely preventing text interleaving."
        },
        {
            q: "Does the factual tailoring engine invent false experience or metrics?",
            a: "No. Smart Job Hunter enforces 100% factual grounding. The tailoring engine only restructures and emphasizes your verified technical skills and real projects without fabricating fake companies or degrees."
        },
        {
            q: "How are external job openings ingested and synchronized?",
            a: "The backend connects directly to the live Adzuna API, querying global job boards. Job descriptions are parsed with our 500+ skill taxonomy, salaries are normalized, and direct employer apply links are provided."
        },
        {
            q: "What security and privacy isolation boundaries are enforced?",
            a: "All candidate resumes and application tracking pipelines are strictly isolated per account using database resource-owner boundaries. Your resume content is never sold or used for external model training."
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAF9F5] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white relative antialiased">
            {/* 1. ATTIO MINIMALIST TOPBAR */}
            <header className="sticky top-0 z-50 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E5E5E0] transition-all">
                <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Brand Emblem */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center group focus:outline-none">
                            <Logo size="sm" />
                        </Link>
                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-neutral-600">
                            <a href="#workspace" className="hover:text-neutral-950 transition-colors">Workspace</a>
                            <a href="#features" className="hover:text-neutral-950 transition-colors">Data Engine</a>
                            <a href="#automations" className="hover:text-neutral-950 transition-colors">Automations</a>
                            <a href="#diagnostic" className="hover:text-neutral-950 transition-colors">10-Layer Audit</a>
                            <a href="#faq" className="hover:text-neutral-950 transition-colors">FAQ</a>
                        </nav>
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-[#E5E5E0] text-[11px] font-mono text-neutral-600 shadow-sm mr-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>V2.4 STABLE</span>
                        </div>
                        <Link to="/login">
                            <button className="px-3.5 py-1.5 text-[13px] font-medium text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/70 rounded-md transition-all">
                                Sign In
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="px-4 py-1.5 text-[13px] font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-all shadow-sm flex items-center gap-1.5 group">
                                <span>Start Building</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Trigger */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200/50 rounded-md border border-[#E5E5E0]"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-b border-[#E5E5E0] bg-[#FAF9F5] px-4 py-4 space-y-3 text-sm font-medium">
                        <a href="#workspace" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-neutral-700">Workspace</a>
                        <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-neutral-700">Data Engine</a>
                        <a href="#automations" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-neutral-700">Automations</a>
                        <a href="#diagnostic" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-neutral-700">10-Layer Audit</a>
                        <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-neutral-700">FAQ</a>
                        <div className="pt-2 flex flex-col gap-2">
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2 text-neutral-800 border border-[#E5E5E0] bg-white rounded-md">Sign In</Link>
                            <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2 text-white bg-neutral-900 rounded-md">Start Building Free</Link>
                        </div>
                    </div>
                )}
            </header>

            <main>
                {/* 2. ATTIO HERO SECTION */}
                <section className="pt-16 pb-12 md:pt-24 md:pb-16 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center">


                    {/* Attio Massive Editorial Headline */}
                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-bold tracking-[-0.035em] text-neutral-950 leading-[1.02] max-w-5xl mx-auto mb-6">
                        The career platform built for <br />
                        <span className="text-neutral-400 font-normal">the age of</span> precision intelligence.
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-8">
                        Extract multi-column Canva resumes with PyMuPDF spatial geometry, verify 10 discrete ATS diagnostic vectors, and synchronize live Adzuna applications.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
                        <Link to="/register">
                            <Button size="lg" className="bg-neutral-900 text-white hover:bg-neutral-800 text-sm px-6 py-3 rounded-md shadow-sm flex items-center gap-2 font-medium">
                                <span>Start Building Free</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <a href="#workspace">
                            <Button variant="outline" size="lg" className="border-[#E5E5E0] bg-white text-neutral-800 hover:bg-neutral-50 text-sm px-6 py-3 rounded-md shadow-sm">
                                <span>Explore Interactive Canvas</span>
                            </Button>
                        </a>
                    </div>

                    {/* 3. ATTIO INTERACTIVE CANVAS WORKSPACE (TABLE, KANBAN, AUTOMATIONS, OBJECTS) */}
                    <div id="workspace" className="bg-white border border-[#E5E5E0] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04),0_20px_40px_rgba(0,0,0,0.03)] overflow-hidden text-left">
                        {/* Attio Window Chrome / Toolbar */}
                        <div className="p-3 sm:p-4 border-b border-[#E5E5E0] bg-[#FAF9F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            {/* View Switchers */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                                <button
                                    onClick={() => setActiveHeroView('table')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                                        activeHeroView === 'table'
                                            ? 'bg-white text-neutral-950 shadow-sm border border-[#E5E5E0] font-semibold'
                                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
                                    }`}
                                >
                                    <TableIcon className="w-3.5 h-3.5 text-neutral-500" />
                                    <span>Table View</span>
                                </button>
                                <button
                                    onClick={() => setActiveHeroView('kanban')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                                        activeHeroView === 'kanban'
                                            ? 'bg-white text-neutral-950 shadow-sm border border-[#E5E5E0] font-semibold'
                                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
                                    }`}
                                >
                                    <Kanban className="w-3.5 h-3.5 text-neutral-500" />
                                    <span>Pipeline Kanban</span>
                                </button>
                                <button
                                    onClick={() => setActiveHeroView('automation')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                                        activeHeroView === 'automation'
                                            ? 'bg-white text-neutral-950 shadow-sm border border-[#E5E5E0] font-semibold'
                                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
                                    }`}
                                >
                                    <Workflow className="w-3.5 h-3.5 text-indigo-500" />
                                    <span>Automations</span>
                                </button>
                                <button
                                    onClick={() => setActiveHeroView('objects')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                                        activeHeroView === 'objects'
                                            ? 'bg-white text-neutral-950 shadow-sm border border-[#E5E5E0] font-semibold'
                                            : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
                                    }`}
                                >
                                    <Database className="w-3.5 h-3.5 text-neutral-500" />
                                    <span>Object Models</span>
                                </button>
                            </div>

                            {/* Attio Filters & Search */}
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search records or skills..."
                                        className="pl-8 pr-3 py-1 bg-white border border-[#E5E5E0] rounded-md text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 w-full sm:w-48"
                                    />
                                </div>
                                <div className="hidden sm:flex items-center gap-1 text-xs text-neutral-600 bg-white border border-[#E5E5E0] px-2.5 py-1 rounded-md">
                                    <Filter className="w-3.5 h-3.5 text-neutral-400" />
                                    <span>Filter:</span>
                                    <select
                                        value={tableFilter}
                                        onChange={(e) => setTableFilter(e.target.value)}
                                        className="bg-transparent text-neutral-900 font-medium focus:outline-none cursor-pointer"
                                    >
                                        <option value="all">All Records</option>
                                        <option value="high_match">Match &ge;90%</option>
                                        <option value="remote">Remote Only</option>
                                        <option value="tailor_ready">Tailoring Ready</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* VIEW 1: ATTIO-GRADE TABLE VIEW */}
                        {activeHeroView === 'table' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-[13px]">
                                    <thead>
                                        <tr className="bg-[#FAF9F5] border-b border-[#E5E5E0] text-neutral-500 text-xs font-medium">
                                            <th className="py-2.5 px-4">Opportunity &amp; Company</th>
                                            <th className="py-2.5 px-4">Match Vector</th>
                                            <th className="py-2.5 px-4">ATS Health</th>
                                            <th className="py-2.5 px-4">Direct Skills (Taxonomy)</th>
                                            <th className="py-2.5 px-4">Skill Gap</th>
                                            <th className="py-2.5 px-4">Pipeline Stage</th>
                                            <th className="py-2.5 px-4">Compensation</th>
                                            <th className="py-2.5 px-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E5E5E0] bg-white">
                                        {filteredJobs.map((job, idx) => (
                                            <tr
                                                key={job.id}
                                                onClick={() => setSelectedJobIndex(idx)}
                                                className={`cursor-pointer transition-colors ${
                                                    selectedJobIndex === idx ? 'bg-indigo-50/40' : 'hover:bg-neutral-50/70'
                                                }`}
                                            >
                                                <td className="py-3.5 px-4">
                                                    <div className="font-semibold text-neutral-950 flex items-center gap-1.5">
                                                        <span>{job.role}</span>
                                                        {job.remote && (
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
                                                                style={{ width: `${job.atsHealth}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-mono text-neutral-700">{job.atsHealth}%</span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div className="flex flex-wrap gap-1 max-w-xs">
                                                        {job.directSkills.slice(0, 3).map((sk, sIdx) => (
                                                            <span key={sIdx} className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-200/70 rounded text-[11px] text-neutral-700 font-mono">
                                                                {sk}
                                                            </span>
                                                        ))}
                                                        {job.directSkills.length > 3 && (
                                                            <span className="text-[11px] text-neutral-400 font-mono">+{job.directSkills.length - 3}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {job.skillGaps.map((gap, gIdx) => (
                                                            <span key={gIdx} className="px-1.5 py-0.5 bg-amber-50 border border-amber-200/80 rounded text-[11px] text-amber-800 font-mono">
                                                                {gap}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        job.stage === 'Offered' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                                        job.stage === 'Interviewing' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                        job.stage === 'Screening' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                        'bg-neutral-100 text-neutral-700 border border-neutral-200'
                                                    }`}>
                                                        <span>{job.stage}</span>
                                                    </span>
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
                                        ))}
                                    </tbody>
                                </table>

                                {/* Active Record Inspector Bar */}
                                {datasetJobs[selectedJobIndex] && (
                                    <div className="p-4 bg-[#FAF9F5] border-t border-[#E5E5E0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center gap-3">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                            <span>
                                                Selected Record: <strong>{datasetJobs[selectedJobIndex].role}</strong> at <strong>{datasetJobs[selectedJobIndex].company}</strong>
                                            </span>
                                            <span className="text-neutral-300">|</span>
                                            <span className="font-mono text-neutral-600">Cosine Similarity: {datasetJobs[selectedJobIndex].vectorSimilarity}</span>
                                        </div>
                                        <Link to="/register">
                                            <button className="px-3 py-1 bg-neutral-900 text-white rounded font-medium hover:bg-neutral-800 transition-colors">
                                                Tailor Resume for Role &rarr;
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* VIEW 2: PIPELINE KANBAN BOARD */}
                        {activeHeroView === 'kanban' && (
                            <div className="p-4 sm:p-6 bg-[#FAF9F5] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Column 1: Sourced / Ingested */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 pb-2 border-b border-[#E5E5E0]">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-neutral-400" />
                                            <span>Sourced / Ingested (2)</span>
                                        </div>
                                        <Plus className="w-3.5 h-3.5 text-neutral-400 cursor-pointer" />
                                    </div>

                                    <div className="p-3 bg-white border border-[#E5E5E0] rounded-lg shadow-sm space-y-2">
                                        <div className="text-xs font-semibold text-neutral-950">Senior Full-Stack Engineer</div>
                                        <div className="text-[11px] text-neutral-500">Vercel &bull; Remote</div>
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">96% Match</span>
                                            <span className="text-[10px] font-mono text-neutral-400">Adzuna Sync</span>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-white border border-[#E5E5E0] rounded-lg shadow-sm space-y-2">
                                        <div className="text-xs font-semibold text-neutral-950">Principal Security Engineer</div>
                                        <div className="text-[11px] text-neutral-500">Datadog &bull; Boston</div>
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">84% Match</span>
                                            <span className="text-[10px] font-mono text-neutral-400">Adzuna Sync</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 2: ATS Diagnostic Passed */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 pb-2 border-b border-[#E5E5E0]">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                                            <span>ATS Audit Ready (1)</span>
                                        </div>
                                        <Plus className="w-3.5 h-3.5 text-neutral-400 cursor-pointer" />
                                    </div>

                                    <div className="p-3 bg-white border border-[#E5E5E0] rounded-lg shadow-sm space-y-2">
                                        <div className="text-xs font-semibold text-neutral-950">Staff Python Architect</div>
                                        <div className="text-[11px] text-neutral-500">Stripe &bull; NYC</div>
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">95/100 ATS</span>
                                            <span className="text-[10px] text-neutral-500">Tailored v2</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 3: Interviewing */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 pb-2 border-b border-[#E5E5E0]">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                                            <span>Interviewing (1)</span>
                                        </div>
                                        <Plus className="w-3.5 h-3.5 text-neutral-400 cursor-pointer" />
                                    </div>

                                    <div className="p-3 bg-white border border-[#E5E5E0] rounded-lg shadow-sm space-y-2">
                                        <div className="text-xs font-semibold text-neutral-950">Lead ML / NLP Engineer</div>
                                        <div className="text-[11px] text-neutral-500">Cohere &bull; London</div>
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">Round 3 Scheduled</span>
                                            <span className="text-[10px] font-mono text-neutral-400">12 Sep</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 4: Offer Extended */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 pb-2 border-b border-[#E5E5E0]">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-purple-500" />
                                            <span>Offer Extended (1)</span>
                                        </div>
                                        <Plus className="w-3.5 h-3.5 text-neutral-400 cursor-pointer" />
                                    </div>

                                    <div className="p-3 bg-white border border-[#E5E5E0] rounded-lg shadow-sm space-y-2">
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

                        {/* VIEW 3: ATTIO AUTOMATION WORKFLOW BUILDER */}
                        {activeHeroView === 'automation' && (
                            <div className="p-6 sm:p-8 bg-[#FAF9F5]">
                                <div className="max-w-2xl mx-auto space-y-4">
                                    {/* Trigger Node */}
                                    <div className="p-4 bg-white border border-[#E5E5E0] rounded-lg shadow-sm flex items-start gap-4">
                                        <div className="p-2 bg-indigo-50 rounded-md text-indigo-600">
                                            <Globe className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-mono text-indigo-600 font-semibold uppercase">Trigger 01</div>
                                            <div className="text-sm font-bold text-neutral-950">New Job Ingested via Adzuna API Stream</div>
                                            <p className="text-xs text-neutral-500 mt-1">Queries global feeds every 60 minutes for Senior / Staff engineering titles.</p>
                                        </div>
                                    </div>

                                    {/* Connector Line */}
                                    <div className="flex justify-center">
                                        <div className="w-0.5 h-6 bg-[#E5E5E0]" />
                                    </div>

                                    {/* Condition Node */}
                                    <div className="p-4 bg-white border border-[#E5E5E0] rounded-lg shadow-sm flex items-start gap-4">
                                        <div className="p-2 bg-amber-50 rounded-md text-amber-600">
                                            <Sliders className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-mono text-amber-600 font-semibold uppercase">Condition 02</div>
                                            <div className="text-sm font-bold text-neutral-950">If Deterministic Match Score &ge; 85% &amp; ATS Health &ge; 90%</div>
                                            <p className="text-xs text-neutral-500 mt-1">Evaluates 4-factor scoring weights (Skills Overlap + TF-IDF Cosine Vector).</p>
                                        </div>
                                    </div>

                                    {/* Connector Line */}
                                    <div className="flex justify-center">
                                        <div className="w-0.5 h-6 bg-[#E5E5E0]" />
                                    </div>

                                    {/* Action Node */}
                                    <div className="p-4 bg-white border border-[#E5E5E0] rounded-lg shadow-sm flex items-start gap-4">
                                        <div className="p-2 bg-emerald-50 rounded-md text-emerald-600">
                                            <FileCheck className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-mono text-emerald-600 font-semibold uppercase">Action 03</div>
                                            <div className="text-sm font-bold text-neutral-950">Generate Grounded CV Tailoring &amp; Dispatch Alert</div>
                                            <p className="text-xs text-neutral-500 mt-1">Formats experience bullet diff matrix with 100% factual integrity guardrails.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* VIEW 4: ATTIO OBJECT MODEL INSPECTOR */}
                        {activeHeroView === 'objects' && (
                            <div className="p-6 sm:p-8 bg-[#FAF9F5] font-mono text-xs">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-4 bg-white border border-[#E5E5E0] rounded-lg space-y-2">
                                        <div className="text-neutral-400 text-[10px]">OBJECT 01 // ENTITY</div>
                                        <div className="font-bold text-neutral-950 text-sm font-sans">Candidate Profile</div>
                                        <div className="text-neutral-600 text-[11px] space-y-1 pt-2 border-t border-[#E5E5E0]">
                                            <div>&bull; id: UUID (PK)</div>
                                            <div>&bull; verified_skills: String[]</div>
                                            <div>&bull; target_roles: String[]</div>
                                            <div>&bull; ats_diagnostics: Ref(Audit)</div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-white border border-[#E5E5E0] rounded-lg space-y-2">
                                        <div className="text-neutral-400 text-[10px]">OBJECT 02 // PARSER</div>
                                        <div className="font-bold text-neutral-950 text-sm font-sans">Spatial Bounding Box</div>
                                        <div className="text-neutral-600 text-[11px] space-y-1 pt-2 border-t border-[#E5E5E0]">
                                            <div>&bull; engine: PyMuPDF-1.24</div>
                                            <div>&bull; bbox: [x0, y0, x1, y1]</div>
                                            <div>&bull; column_split: 0.35W</div>
                                            <div>&bull; text_block: String</div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-white border border-[#E5E5E0] rounded-lg space-y-2">
                                        <div className="text-neutral-400 text-[10px]">OBJECT 03 // VECTOR</div>
                                        <div className="font-bold text-neutral-950 text-sm font-sans">4-Factor Match Record</div>
                                        <div className="text-neutral-600 text-[11px] space-y-1 pt-2 border-t border-[#E5E5E0]">
                                            <div>&bull; w1_skills_overlap: Float</div>
                                            <div>&bull; w2_tf_idf_vector: Float</div>
                                            <div>&bull; w3_experience_fit: Float</div>
                                            <div>&bull; composite_score: Integer</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* 4. ATTIO FEATURE SHOWCASE BENTO GRID */}
                <section id="features" className="py-20 border-y border-[#E5E5E0] bg-white">
                    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="max-w-3xl mb-16">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-xs font-medium text-neutral-700 mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                                <span>Platform Architecture</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 leading-tight">
                                Powerful by design. <br />
                                Flexible for every candidate workflow.
                            </h2>
                        </div>

                        {/* Bento Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Card 1: 4-Factor Formula Engine */}
                            <div className="p-8 bg-[#FAF9F5] border border-[#E5E5E0] rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E5E0] flex items-center justify-center text-neutral-900 mb-6 shadow-sm">
                                        <SlidersHorizontal className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-neutral-950 mb-2">4-Factor Match Engine</h3>
                                    <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                                        Evaluate candidate compatibility with transparent mathematical weights: 40% Skills, 30% TF-IDF Cosine, 15% Experience, and 15% Title fit.
                                    </p>
                                </div>
                                <div className="p-4 bg-white border border-[#E5E5E0] rounded-lg font-mono text-xs text-neutral-700 space-y-1.5">
                                    <div className="text-neutral-400 text-[10px]">LIVE EVALUATION RATIONALE</div>
                                    <div className="text-emerald-700 font-semibold">S_total = &sum; w_i &times; S_i = 96%</div>
                                    <div className="text-neutral-500 text-[11px]">18 Normalized Skills Matched</div>
                                </div>
                            </div>

                            {/* Card 2: PyMuPDF Spatial Geometry Parser */}
                            <div className="p-8 bg-[#FAF9F5] border border-[#E5E5E0] rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E5E0] flex items-center justify-center text-neutral-900 mb-6 shadow-sm">
                                        <Split className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-neutral-950 mb-2">Spatial Coordinate Geometry</h3>
                                    <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                                        Process complex dual-column Canva and Figma PDF templates with coordinate bounding boxes [x0, y0, x1, y1] with zero column-bleed.
                                    </p>
                                </div>
                                <div className="p-4 bg-white border border-[#E5E5E0] rounded-lg font-mono text-xs text-neutral-700 space-y-1.5">
                                    <div className="text-neutral-400 text-[10px]">COORDINATE EXTRACTION</div>
                                    <div className="text-indigo-700 font-semibold">[36.0, 72.0, 195.0, 180.0]</div>
                                    <div className="text-neutral-500 text-[11px]">Zero CID Font Corruptions Detected</div>
                                </div>
                            </div>

                            {/* Card 3: 10-Layer ATS Diagnostic */}
                            <div className="p-8 bg-[#FAF9F5] border border-[#E5E5E0] rounded-xl flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E5E0] flex items-center justify-center text-neutral-900 mb-6 shadow-sm">
                                        <CheckSquare className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-neutral-950 mb-2">10-Layer ATS Diagnostic</h3>
                                    <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                                        Audit resumes across 10 deterministic compliance layers including contact vectors, action verbs, metric ratios, and file security.
                                    </p>
                                </div>
                                <div className="p-4 bg-white border border-[#E5E5E0] rounded-lg font-mono text-xs text-neutral-700 space-y-1.5">
                                    <div className="text-neutral-400 text-[10px]">AUDIT INTEGRITY</div>
                                    <div className="text-emerald-700 font-semibold">10 / 10 Compliance Checks Passed</div>
                                    <div className="text-neutral-500 text-[11px]">72% Metric Quantification Ratio</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. 10-LAYER ATS COMPLIANCE MATRIX SECTION */}
                <section id="diagnostic" className="py-20 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-[#E5E5E0] gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E5E0] text-xs font-medium text-neutral-700 shadow-sm mb-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span>Deterministic Validation</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
                                10-Layer ATS Diagnostic Matrix
                            </h2>
                        </div>
                        <div className="text-xs font-mono text-neutral-500">
                            CLICK ANY ROW TO VIEW SPECIFIC TECHNICAL MECHANISM
                        </div>
                    </div>

                    <div className="bg-white border border-[#E5E5E0] rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-[#FAF9F5] border-b border-[#E5E5E0] text-neutral-600 font-medium">
                                        <th className="py-3 px-4">#</th>
                                        <th className="py-3 px-4">Audit Vector Layer</th>
                                        <th className="py-3 px-4">Category</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">Measured Metric</th>
                                        <th className="py-3 px-4">Technical Mechanism</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E5E5E0]">
                                    {diagnosticLayers.map((layer, idx) => (
                                        <tr
                                            key={layer.id}
                                            onClick={() => setActiveDiagnosticLayer(idx)}
                                            className={`cursor-pointer transition-colors ${
                                                activeDiagnosticLayer === idx ? 'bg-indigo-50/50 font-medium' : 'hover:bg-neutral-50/70 bg-white'
                                            }`}
                                        >
                                            <td className="py-3.5 px-4 font-mono text-neutral-400">[{layer.id}]</td>
                                            <td className="py-3.5 px-4 font-bold text-neutral-950 text-[13px]">{layer.name}</td>
                                            <td className="py-3.5 px-4 text-neutral-600">{layer.category}</td>
                                            <td className="py-3.5 px-4">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-bold">
                                                    <Check className="w-3 h-3" />
                                                    <span>{layer.status}</span>
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-neutral-800 font-semibold">{layer.metric}</td>
                                            <td className="py-3.5 px-4 text-neutral-600 leading-relaxed">{layer.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Active Diagnostic Bar */}
                        <div className="p-4 bg-[#FAF9F5] border-t border-[#E5E5E0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div>
                                <span className="font-bold text-neutral-950">Active Layer [{diagnosticLayers[activeDiagnosticLayer].id}]: {diagnosticLayers[activeDiagnosticLayer].name}</span> &mdash;{' '}
                                <span className="text-neutral-600">{diagnosticLayers[activeDiagnosticLayer].description}</span>
                            </div>
                            <Link to="/register">
                                <button className="px-3.5 py-1.5 bg-neutral-900 text-white rounded font-medium hover:bg-neutral-800 transition-colors whitespace-nowrap">
                                    Audit Your Resume &rarr;
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 6. TECHNICAL FAQ ACCORDION */}
                <section id="faq" className="py-20 border-t border-[#E5E5E0] bg-white">
                    <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-xs font-medium text-neutral-700 mb-3">
                                <HelpCircle className="w-3.5 h-3.5" />
                                <span>Frequently Asked Questions</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
                                Everything you need to know
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {faqItems.map((item, idx) => (
                                <div key={idx} className="border border-[#E5E5E0] rounded-lg bg-[#FAF9F5] overflow-hidden">
                                    <button
                                        onClick={() => toggleFaq(idx)}
                                        className="w-full px-6 py-4 text-left flex items-center justify-between font-bold text-neutral-950 hover:bg-neutral-100/50 transition-colors text-sm"
                                    >
                                        <span>{item.q}</span>
                                        <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                                    </button>

                                    {openFaq === idx && (
                                        <div className="px-6 py-4 bg-white border-t border-[#E5E5E0] text-neutral-600 text-sm leading-relaxed">
                                            {item.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 7. ATTIO CONVERSION BANNER */}
                <section className="py-20 bg-neutral-950 text-white text-center">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-emerald-400 text-xs font-mono mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>INSTANT ONBOARDING // ZERO SETUP</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                            Start landing top roles with precision data.
                        </h2>
                        <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto mb-8">
                            Upload your resume now to run the 10-layer diagnostic and match live Adzuna opportunities in real-time.
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
                </section>
            </main>

            {/* 8. ATTIO MULTI-COLUMN STUDIO FOOTER */}
            <footer className="bg-[#FAF9F5] border-t border-[#E5E5E0] py-16 text-xs text-neutral-600">
                <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                        {/* Col 1: Brand & Status */}
                        <div className="col-span-2 space-y-4">
                            <Logo size="sm" />
                            <p className="text-neutral-500 max-w-sm leading-relaxed">
                                The career intelligence and ATS diagnostic platform powered by spatial bounding box parsing and deterministic matching.
                            </p>

                        </div>

                        {/* Col 2: Product */}
                        <div className="space-y-3">
                            <div className="font-semibold text-neutral-950 uppercase text-[11px] tracking-wider">Product</div>
                            <ul className="space-y-2">
                                <li><a href="#workspace" className="hover:text-neutral-950 transition-colors">Workspace</a></li>
                                <li><a href="#features" className="hover:text-neutral-950 transition-colors">Data Engine</a></li>
                                <li><a href="#automations" className="hover:text-neutral-950 transition-colors">Automations</a></li>
                                <li><a href="#diagnostic" className="hover:text-neutral-950 transition-colors">10-Layer ATS Audit</a></li>
                            </ul>
                        </div>

                        {/* Col 3: Architecture */}
                        <div className="space-y-3">
                            <div className="font-semibold text-neutral-950 uppercase text-[11px] tracking-wider">Engineering</div>
                            <ul className="space-y-2">
                                <li><span className="text-neutral-500">PyMuPDF Spatial Fitz</span></li>
                                <li><span className="text-neutral-500">FastAPI Async Runtime</span></li>
                                <li><span className="text-neutral-500">SQLAlchemy 2.0 ORM</span></li>
                                <li><span className="text-neutral-500">Adzuna Global Pipeline</span></li>
                            </ul>
                        </div>

                        {/* Col 4: Account */}
                        <div className="space-y-3">
                            <div className="font-semibold text-neutral-950 uppercase text-[11px] tracking-wider">Account</div>
                            <ul className="space-y-2">
                                <li><Link to="/login" className="hover:text-neutral-950 transition-colors">Sign In</Link></li>
                                <li><Link to="/register" className="hover:text-neutral-950 transition-colors">Create Account</Link></li>
                                <li><a href="#faq" className="hover:text-neutral-950 transition-colors">Security &amp; Privacy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-[#E5E5E0] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
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
