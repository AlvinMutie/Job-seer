import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, ChevronRight, Sparkles, AlertCircle, Scissors } from 'lucide-react';
import { jobService, authService } from '../services/api';
import MatchBreakdownModal from '../components/MatchBreakdownModal';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

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
            <PageHeader
                badgeText="V2 EXPLAINABLE MATCH ENGINE"
                title="Top Match Recommendations"
                subtitle="Calculated fit across Skills Overlap (40%), Content Similarity (30%), Experience Level (15%), and Role Title (15%)."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-2">
                        <LoadingSkeleton variant="card" count={2} />
                    </div>
                ) : matches.length === 0 ? (
                    <div className="col-span-2">
                        <EmptyState
                            icon={Target}
                            title="No match recommendations available"
                            description="Upload or update your CV in the Resume Hub to start receiving explainable AI compatibility recommendations."
                            action={<Button variant="primary" onClick={() => window.location.href = '/resume-hub'}>Upload Resume in Hub</Button>}
                        />
                    </div>
                ) : (
                    matches.map(match => (
                        <Card key={match.id} variant="flat" className="p-6 flex flex-col justify-between hover:border-slate-300 transition-all">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="text-4xl font-extrabold text-indigo-600">{match.match_percentage}%</div>
                                        <span className="text-xs text-slate-500 font-mono">Explainable AI Score</span>
                                    </div>
                                    <Badge variant={match.match_percentage > 70 ? 'emerald' : 'slate'}>
                                        {match.match_percentage > 70 ? 'High Match' : 'Potential Match'}
                                    </Badge>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 mb-1">{match.title}</h3>
                                <p className="text-slate-500 text-sm mb-4 leading-relaxed">{match.company}</p>

                                {match.explanation && (
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4">
                                        <p className="text-xs text-slate-700 leading-relaxed font-mono">{match.explanation}</p>
                                    </div>
                                )}

                                {match.missing_skills?.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bridge the Gap</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {match.missing_skills.slice(0, 3).map(skill => (
                                                <Badge key={skill} variant="rose" size="sm">
                                                    Learn {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                                <a href={`/resume-hub?jobId=${match.id}`} className="flex-1">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        icon={Scissors}
                                        className="w-full"
                                    >
                                        Tailor Resume
                                    </Button>
                                </a>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenAnalytics(match)}
                                >
                                    Analytics <ChevronRight size={14} />
                                </Button>
                            </div>
                        </Card>
                    ))
                )}

                <Card variant="flat" className="p-6 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-center py-12">
                    <TrendingUp size={32} className="text-slate-400 mb-4" />
                    <h4 className="text-slate-900 font-semibold">Want higher match scores?</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-[240px]">Update your skills or upload a fresh version of your resume.</p>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="mt-4"
                        onClick={() => window.location.href = '/settings'}
                    >
                        Update Profile Preferences
                    </Button>
                </Card>
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
