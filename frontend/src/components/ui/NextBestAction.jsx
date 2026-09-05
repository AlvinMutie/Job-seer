import React from 'react';
import { Sparkles, ArrowRight, Upload, Compass, Briefcase, Trophy, LayoutGrid, AlertCircle, CheckCircle2 } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import Badge from './Badge';

function NextBestAction({ user, analytics }) {
    const hasProfile = user?.profile?.preferred_role && user?.profile?.skills;
    const hasResume = Boolean(user?.profile?.resume_text);
    const totalApps = analytics?.total_applications || 0;
    const interviews = analytics?.status_counts?.interview || 0;

    let title = "";
    let description = "";
    let buttonText = "";
    let buttonIcon = ArrowRight;
    let buttonLink = "";
    let badgeText = "RECOMMENDED ACTION";
    let badgeVariant = "indigo";

    if (!hasProfile) {
        title = "Configure your target career preferences";
        description = "Set your preferred job title, location preferences, and core technical skills to optimize match calculations.";
        buttonText = "Complete Profile";
        buttonIcon = Compass;
        buttonLink = "/settings";
        badgeText = "STEP 1 OF 3";
        badgeVariant = "amber";
    } else if (!hasResume) {
        title = "Upload your base CV for ATS scan";
        description = "Job Seer needs your resume text to calculate V2 explainable match scores and run 10-layer ATS health readiness checks.";
        buttonText = "Upload Base CV";
        buttonIcon = Upload;
        buttonLink = "/resume-hub";
        badgeText = "STEP 2 OF 3";
        badgeVariant = "cyan";
    } else if (totalApps === 0) {
        title = "Discover tech roles & evaluate your match fit";
        description = "Explore open tech roles filtered by remote status and experience level, then calculate your resume fit.";
        buttonText = "Discover Jobs";
        buttonIcon = Briefcase;
        buttonLink = "/jobs";
        badgeText = "STEP 3 OF 3";
        badgeVariant = "indigo";
    } else if (interviews > 0) {
        title = "Prepare for scheduled interview screens";
        description = `You have ${interviews} interview screen(s) scheduled. Review application notes, tailor role-specific assets, and track dates.`;
        buttonText = "Open Kanban Tracker";
        buttonIcon = LayoutGrid;
        buttonLink = "/tracker";
        badgeText = "INTERVIEW STAGE";
        badgeVariant = "emerald";
    } else {
        title = "Tailor your application assets for high matches";
        description = "Review your top job recommendations, generate tailored CV versions, and format targeted cover letters.";
        buttonText = "Review Top Matches";
        buttonIcon = Trophy;
        buttonLink = "/matches";
        badgeText = "HIGH ALIGNMENT";
        badgeVariant = "indigo";
    }

    return (
        <Card variant="glass" className="p-6 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                    <Badge variant={badgeVariant} size="sm">{badgeText}</Badge>
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                        <Sparkles size={12} className="text-indigo-400" /> Proactive Guidance
                    </span>
                </div>
                <h3 className="text-lg font-extrabold text-white">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
            </div>

            <a href={buttonLink} className="w-full md:w-auto">
                <Button
                    variant="primary"
                    size="md"
                    icon={buttonIcon}
                    className="w-full md:w-auto whitespace-nowrap"
                >
                    {buttonText}
                </Button>
            </a>
        </Card>
    );
}

export default NextBestAction;
