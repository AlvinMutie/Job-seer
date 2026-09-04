import React from 'react';
import { AlertTriangle, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, FileText } from 'lucide-react';
import Button from './ui/Button';

export default function AtsRecommendationBanner({ healthReport, onOpenStudio }) {
    if (!healthReport) return null;

    const isCompliant = healthReport.is_ats_compliant ?? (healthReport.health_score >= 75);
    const riskLevel = healthReport.ats_risk_level || (isCompliant ? 'Low' : 'High');

    // If completely compliant with low risk, render a reassurance badge / banner
    if (isCompliant && riskLevel === 'Low') {
        return (
            <div className="mb-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                                ATS Compatibility: Clean & Parsable
                            </h4>
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                Low Risk
                            </span>
                        </div>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300/80 mt-0.5">
                            Your resume text passes standard applicant tracking parser heuristics. Want to polish typography to the executive standard?
                        </p>
                    </div>
                </div>
                <Button
                    size="sm"
                    variant="outline"
                    className="border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 shrink-0 font-medium"
                    onClick={onOpenStudio}
                >
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Open ATS Portal
                </Button>
            </div>
        );
    }

    // If not compliant or moderate/high risk, render actionable alert banner
    return (
        <div className="mb-6 p-5 rounded-2xl border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent dark:border-amber-500/30 dark:from-amber-950/40 dark:via-amber-900/20 dark:to-transparent backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                        <AlertTriangle className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                                ATS Warning: {riskLevel} Risk
                            </span>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Uploaded Resume Formatting Risks Automatic ATS Rejection
                            </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed max-w-3xl">
                            Applicant Tracking Systems (Taleo, Workday, Greenhouse) struggle with multi-column layouts, heavy graphic boxes, or non-standard fonts.
                            We strongly recommend standardizing your CV into the recruiter-approved single-column standard (Times New Roman, 11pt, 1.5 line spacing).
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Standard Section Headers
                            </span>
                            <span className="inline-flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Times New Roman 11pt, 1.5 Spaced
                            </span>
                            <span className="inline-flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Canva In-System Import
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center sm:self-start lg:self-center shrink-0">
                    <Button
                        onClick={onOpenStudio}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-lg shadow-amber-600/20 px-4 py-2.5"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Convert in ATS Portal
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
