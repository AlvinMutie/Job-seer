import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import { jobService, authService } from '../services/api';
import MatchBreakdownModal from '../components/MatchBreakdownModal';

function Matches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            try {
                const [jobs, user] = await Promise.all([
                    jobService.getJobs({ limit: 10 }),
                    authService.getMe()
                ]);

                if (user.profile?.resume_text) {
                    const matchPromises = jobs.map(async (job) => {
                        const formData = new FormData();
                        formData.append('resume_text', user.profile.resume_text);
                        formData.append('job_id', job.id);
                        const result = await jobService.matchResume(formData);
                        return { ...job, ...result };
                    });

                    const results = await Promise.all(matchPromises);
                    const sorted = results
                        .filter(r => r.match_percentage > 0)
                        .sort((a, b) => b.match_percentage - a.match_percentage)
                        .slice(0, 4);
                    setMatches(sorted);
                }
            } catch (error) {
                console.error("Failed to fetch matches:", error);
            }
            setLoading(false);
        };
        fetchMatches();
    }, []);

    const handleOpenAnalytics = (match) => {
        setSelectedMatch(match);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
                <Target className="text-indigo-400" size={28} />
                <div>
                    <h2 className="text-2xl font-bold">Top Match Recommendations</h2>
                    <p className="text-sm text-slate-400">Powered by V2 Explainable Multi-Factor Scoring (Skills 40%, Content 30%, Experience 15%, Title 15%).</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-2 py-20 text-center text-slate-500">Calculating your multi-factor AI matches...</div>
                ) : matches.length === 0 ? (
                    <div className="col-span-2 py-20 text-center text-slate-500">No matches found. Try uploading a detailed CV in the Resume Hub!</div>
                ) : (
                    matches.map(match => (
                        <div key={match.id} className="glass-card p-6 flex flex-col justify-between hover:border-indigo-500/30 transition-all">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="text-4xl font-bold text-indigo-400">{match.match_percentage}%</div>
                                        <span className="text-xs text-slate-500">Explainable AI Score</span>
                                    </div>
                                    <div className={`badge ${match.match_percentage > 70 ? 'badge-indigo' : 'badge-slate'}`}>
                                        {match.match_percentage > 70 ? 'High Match' : 'Potential Match'}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1">{match.title}</h3>
                                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{match.company}</p>

                                {match.explanation && (
                                    <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80 mb-4">
                                        <p className="text-xs text-slate-300 leading-relaxed font-mono">{match.explanation}</p>
                                    </div>
                                )}

                                {match.missing_skills?.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bridge the Gap</p>
                                        <div className="flex flex-wrap gap-2">
                                            {match.missing_skills.slice(0, 3).map(skill => (
                                                <span key={skill} className="px-2 py-1 bg-red-500/5 text-red-400 text-xs rounded-lg border border-red-500/10">
                                                    Learn {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => handleOpenAnalytics(match)}
                                className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors py-2.5 border-t border-slate-800/50"
                            >
                                View Full Score Analytics <ChevronRight size={16} />
                            </button>
                        </div>
                    ))
                )}

                <div className="glass-card p-6 border-dashed border-slate-700 bg-transparent flex flex-col items-center justify-center text-center py-12">
                    <TrendingUp size={32} className="text-slate-600 mb-4" />
                    <h4 className="text-slate-400 font-medium">Want higher match scores?</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-[220px]">Update your skills or upload a fresh version of your CV.</p>
                    <button
                        onClick={() => window.location.href = '/profile-setup'}
                        className="mt-4 text-xs font-bold text-white bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        Update Profile
                    </button>
                </div>
            </div>

            <MatchBreakdownModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                match={selectedMatch}
            />
        </div>
    );
}

export default Matches;
