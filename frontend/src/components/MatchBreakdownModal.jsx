import React from 'react';
import { X, CheckCircle, AlertTriangle, Sparkles, BarChart2, Briefcase, Award, FileText } from 'lucide-react';

function MatchBreakdownModal({ isOpen, onClose, match }) {
    if (!isOpen || !match) return null;

    const bd = match.breakdown || { skills: match.match_percentage, content: match.match_percentage, experience: 75, role_title: 75 };
    const explanation = match.explanation || "Calculated using skills, content similarity, and experience alignment.";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="glass-card w-full max-w-xl p-6 overflow-hidden flex flex-col max-h-[90vh] space-y-6">
                <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                    <div>
                        <span className="badge badge-indigo text-xs mb-2">V2 Explainable Match Analytics</span>
                        <h2 className="text-xl font-bold text-white">{match.title}</h2>
                        <p className="text-slate-400 text-sm">{match.company}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6 overflow-y-auto pr-1">
                    {/* Overall Score Banner */}
                    <div className="glass-card p-5 bg-indigo-500/5 border-indigo-500/20 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall AI Match</span>
                            <div className="text-3xl font-bold text-white mt-1">{match.match_percentage}%</div>
                        </div>
                        <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                            <Sparkles size={28} />
                        </div>
                    </div>

                    {/* Human Readable Explanation */}
                    <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-sm text-slate-300 leading-relaxed">
                        <p className="font-semibold text-indigo-400 mb-1 flex items-center gap-1.5">
                            <BarChart2 size={16} /> Score Rationale
                        </p>
                        <span>{explanation}</span>
                    </div>

                    {/* Multi-Factor Score Breakdown Progress Bars */}
                    <div className="space-y-4 glass-card p-5">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Factor Breakdown & Weights</h3>

                        <ScoreBar label="Technical Skills Overlap" weight="40%" score={bd.skills} icon={<Award size={16} className="text-amber-400" />} />
                        <ScoreBar label="Content Similarity (TF-IDF)" weight="30%" score={bd.content} icon={<FileText size={16} className="text-cyan-400" />} />
                        <ScoreBar label="Experience Level Alignment" weight="15%" score={bd.experience} icon={<Briefcase size={16} className="text-emerald-400" />} />
                        <ScoreBar label="Role Title Match" weight="15%" score={bd.role_title} icon={<Sparkles size={16} className="text-indigo-400" />} />
                    </div>

                    {/* Matched vs Missing Skills */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl space-y-2">
                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                                <CheckCircle size={14} /> Matched Skills ({match.matched_skills?.length || 0})
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {match.matched_skills?.length > 0 ? match.matched_skills.map(s => (
                                    <span key={s} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 text-xs rounded border border-emerald-500/20">{s}</span>
                                )) : <span className="text-xs text-slate-500 italic">None detected</span>}
                            </div>
                        </div>

                        <div className="p-4 bg-red-500/5 border border-red-500/15 rounded-xl space-y-2">
                            <p className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                                <AlertTriangle size={14} /> Missing Skills ({match.missing_skills?.length || 0})
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {match.missing_skills?.length > 0 ? match.missing_skills.map(s => (
                                    <span key={s} className="px-2 py-0.5 bg-red-500/10 text-red-300 text-xs rounded border border-red-500/20">{s}</span>
                                )) : <span className="text-xs text-slate-500 italic">None missing!</span>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end">
                    <button onClick={onClose} className="btn-primary py-2 px-6 text-sm">Close Analytics</button>
                </div>
            </div>
        </div>
    );
}

function ScoreBar({ label, weight, score, icon }) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">{icon} {label} <span className="text-slate-500">({weight})</span></span>
                <span className="font-bold text-white">{score}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${score > 75 ? 'bg-emerald-500' : score > 45 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${score}%` }}
                ></div>
            </div>
        </div>
    );
}

export default MatchBreakdownModal;
