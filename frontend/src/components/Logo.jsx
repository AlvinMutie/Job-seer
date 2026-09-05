import React from 'react';
import logoDark from '../assets/Logo.png';
import logoVibrant from '../assets/Logo_vibrant.png';
import logoWhite from '../assets/Logo_white.png';

export default function Logo({ 
    size = 'md', 
    showText = true, 
    className = '', 
    subtext = null,
    variant = 'default',
    framed = true
}) {
    // Dimension presets for the logo image
    const sizeMap = {
        xs: { img: 'w-7 h-7', frame: 'p-1 rounded-xl', text: 'text-sm font-bold', sub: 'text-[9px]' },
        sm: { img: 'w-10 h-10', frame: 'p-1.5 rounded-xl', text: 'text-base font-extrabold', sub: 'text-[10px]' },
        md: { img: 'w-14 h-14', frame: 'p-2 rounded-2xl', text: 'text-xl font-black', sub: 'text-xs' },
        lg: { img: 'w-20 h-20', frame: 'p-2.5 rounded-2xl', text: 'text-2xl sm:text-3xl font-black', sub: 'text-xs' },
        xl: { img: 'w-28 h-28', frame: 'p-3 rounded-3xl', text: 'text-4xl font-black', sub: 'text-sm' }
    };

    const cfg = sizeMap[size] || sizeMap.md;

    return (
        <div className={`inline-flex items-center gap-4 select-none group ${className}`}>
            {/* Logo Emblem Container */}
            <div className={`relative flex items-center justify-center shrink-0 transition-all duration-300 ${
                framed 
                    ? variant === 'white'
                        ? 'bg-white/15 backdrop-blur-md border border-white/25 shadow-lg shadow-black/10'
                        : 'bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-indigo-500/30 shadow-md shadow-indigo-500/10 dark:shadow-[0_0_20px_rgba(99,102,241,0.25)] group-hover:scale-105 group-hover:border-indigo-500/50'
                    : ''
            } ${cfg.frame}`}>
                {variant === 'white' ? (
                    // Explicit white variant (for auth showcase banners)
                    <img 
                        src={logoWhite} 
                        alt="Job Seer Logo" 
                        className={`${cfg.img} object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]`}
                    />
                ) : (
                    // Adaptive Light / Dark mode rendering
                    <>
                        {/* Light mode: crisp dark logo */}
                        <img 
                            src={logoDark} 
                            alt="Job Seer Logo" 
                            className={`${cfg.img} object-contain dark:hidden drop-shadow-xs transition-transform duration-200 group-hover:scale-105`}
                        />
                        {/* Dark mode: vibrant indigo/cyan illuminated logo */}
                        <img 
                            src={logoVibrant} 
                            alt="Job Seer Logo" 
                            className={`${cfg.img} object-contain hidden dark:block drop-shadow-[0_0_14px_rgba(99,102,241,0.75)] transition-transform duration-200 group-hover:scale-105`}
                        />
                    </>
                )}
            </div>

            {/* Wordmark & Subtitle */}
            {showText && (
                <div className="flex flex-col justify-center text-left">
                    <span className={`tracking-tight leading-none transition-colors ${
                        variant === 'white' 
                            ? 'text-white' 
                            : 'text-slate-900 dark:text-white'
                    } ${cfg.text}`}>
                        Job Seer
                    </span>
                    {subtext && (
                        <span className={`font-mono tracking-tight leading-tight mt-1 ${
                            variant === 'white' 
                                ? 'text-indigo-200' 
                                : 'text-slate-500 dark:text-indigo-300'
                        } ${cfg.sub}`}>
                            {subtext}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
