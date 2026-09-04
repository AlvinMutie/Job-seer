import React from 'react';

export default function LoadingSkeleton({
    variant = 'card', // card | text | line | table-row
    count = 1,
    className = ''
}) {
    const renderSkeleton = () => {
        if (variant === 'card') {
            return (
                <div className={`p-6 bg-white rounded-2xl animate-pulse border border-slate-200 shadow-xs space-y-4 ${className}`}>
                    <div className="h-4 bg-slate-200 rounded-lg w-1/3"></div>
                    <div className="h-6 bg-slate-200 rounded-lg w-2/3"></div>
                    <div className="h-3 bg-slate-100 rounded-lg w-full"></div>
                    <div className="h-3 bg-slate-100 rounded-lg w-4/5"></div>
                </div>
            );
        }

        if (variant === 'table-row') {
            return (
                <div className={`p-4 bg-white rounded-xl border border-slate-200 animate-pulse flex justify-between items-center ${className}`}>
                    <div className="h-4 bg-slate-200 rounded-lg w-1/4"></div>
                    <div className="h-4 bg-slate-200 rounded-lg w-1/6"></div>
                    <div className="h-4 bg-slate-200 rounded-lg w-1/6"></div>
                    <div className="h-4 bg-slate-200 rounded-lg w-1/12"></div>
                </div>
            );
        }

        return (
            <div className={`h-4 bg-slate-200 rounded-lg animate-pulse ${className}`}></div>
        );
    };

    return (
        <div className="space-y-3 w-full">
            {Array.from({ length: count }).map((_, index) => (
                <React.Fragment key={index}>
                    {renderSkeleton()}
                </React.Fragment>
            ))}
        </div>
    );
}
