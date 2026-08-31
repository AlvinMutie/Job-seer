import React from 'react';
import { CheckCircle, AlertTriangle, Sparkles, BarChart2, Briefcase, Award, FileText } from 'lucide-react';
import Modal from './ui/Modal';
import Badge from './ui/Badge';
import Button from './ui/Button';

function MatchBreakdownModal({ isOpen, onClose, match }) {
    if (!isOpen || !match) return null;

    const bd = match.breakdown || { skills: match.match_percentage, content: match.match_percentage, experience: 75, role_title: 75 };
    const explanation = match.explanation || "Calculated using skills, content similarity, and experience alignment.";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={match.title}
            subtitle={match.company}
            maxWidth="max-w-xl"
        >
            <div className="space-y-6">
                <Badge variant="indigo">V2 Explainable Match Analytics</Badge>

                {/* Overall Score Banner */}
                <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall AI Match</span>
                        <div className="text-3xl font-extrabold text-white mt-1">{match.match_percentage}%</div>
                    </div>
                    <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                        <Sparkles size={28} />
                    </div>
                </div>

                {/* Rationale */}
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-sm text-slate-300 leading-relaxed">
                    <p className="font-semibold text-indigo-400 mb-1 flex items-center gap-1.5">
                        <BarChart2 size={16} /> Score Rationale
                    </p>
                    <span>{explanation}</span>
                </div>

                {/* Multi-Factor Score Breakdown Progress Bars */}
                <div className="space-y-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
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
                                <Badge key={s} variant="emerald" size="sm">{s}</Badge>
                            )) : <span className="text-xs text-slate-500 italic">None detected</span>}
                        </div>
                    </div>

                    <div className="p-4 bg-rose-500/5 border border-rose-500/15 rounded-xl space-y-2">
                        <p className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle size={14} /> Missing Skills ({match.missing_skills?.length || 0})
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {match.missing_skills?.length > 0 ? match.missing_skills.map(s => (
                                <Badge key={s} variant="rose" size="sm">{s}</Badge>
                            )) : <span className="text-xs text-slate-500 italic">None missing!</span>}
                        </div>
                    </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end">
                    <Button variant="primary" size="sm" onClick={onClose}>
                        Close Analytics
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

function ScoreBar({ label, weight, score, icon }) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">{icon} {label} <span className="text-slate-500">({weight})</span></span>
                <span className="font-bold text-white font-mono">{score}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${score > 75 ? 'bg-emerald-500' : score > 45 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${score}%` }}
                ></div>
            </div>
        </div>
    );
}

export default MatchBreakdownModal;
