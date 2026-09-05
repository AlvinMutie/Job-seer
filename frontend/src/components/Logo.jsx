import React from 'react';
import logoDark from '../assets/Logo.png';
import logoWhite from '../assets/Logo_white.png';

export default function Logo({ 
    size = 'md', 
    showText = true, 
    className = '', 
    subtext = null,
    variant = 'default' 
}) {
    // Dimension presets for the logo image
    const sizeMap = {
        xs: 'w-7 h-7',
        sm: 'w-10 h-10',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24'
    };

    const imgClass = sizeMap[size] || sizeMap.md;

    return (
        <div className={`inline-flex items-center gap-3.5 select-none group ${className}`}>
            <div className="relative flex items-center justify-center shrink-0">
                {variant === 'white' ? (
                    // Explicit white variant (for dark hero/auth banners)
                    <img 
                        src={logoWhite} 
                        alt="Job Seer Logo" 
                        className={`${imgClass} object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]`}
                    />
                ) : (
                    // Adaptive light/dark mode rendering
                    <>
                        {/* Light mode: dark logo */}
                        <img 
                            src={logoDark} 
                            alt="Job Seer Logo" 
                            className={`${imgClass} object-contain transition-transform duration-200 group-hover:scale-105 dark:hidden drop-shadow-sm`}
                        />
                        {/* Dark mode: high-contrast pure white logo with ambient glow */}
                        <img 
                            src={logoWhite} 
                            alt="Job Seer Logo" 
                            className={`${imgClass} object-contain transition-transform duration-200 group-hover:scale-105 hidden dark:block drop-shadow-[0_0_12px_rgba(255,255,255,0.45)]`}
                        />
                    </>
                )}
            </div>
            {showText && (
                <div className="flex flex-col justify-center text-left">
                    <span className={`font-extrabold tracking-tight leading-tight transition-colors ${
                        variant === 'white' 
                            ? 'text-white' 
                            : 'text-slate-900 dark:text-white'
                    } ${
                        size === 'xs' ? 'text-xs font-bold' :
                        size === 'sm' ? 'text-base font-bold' :
                        size === 'md' ? 'text-lg font-black' :
                        size === 'lg' ? 'text-2xl font-black' : 'text-3xl font-black'
                    }`}>
                        Job Seer
                    </span>
                    {subtext && (
                        <span className={`text-[11px] font-mono leading-tight tracking-tight ${
                            variant === 'white' 
                                ? 'text-indigo-200' 
                                : 'text-slate-500 dark:text-slate-400'
                        }`}>
                            {subtext}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
