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
    // Dimension presets for the borderless, transparent logo image
    const sizeMap = {
        xs: { img: 'w-8 h-8', text: 'text-base font-extrabold', sub: 'text-[9px]' },
        sm: { img: 'w-12 h-12', text: 'text-lg font-black', sub: 'text-[10px]' },
        md: { img: 'w-16 h-16', text: 'text-2xl font-black', sub: 'text-xs' },
        lg: { img: 'w-24 h-24', text: 'text-3xl sm:text-4xl font-black', sub: 'text-sm' },
        xl: { img: 'w-32 h-32', text: 'text-4xl sm:text-5xl font-black', sub: 'text-base' }
    };

    const cfg = sizeMap[size] || sizeMap.md;

    return (
        <div className={`inline-flex items-center gap-3.5 select-none group ${className}`}>
            {/* Borderless Seamless Logo Emblem */}
            <div className="relative flex items-center justify-center shrink-0">
                <img 
                    src={variant === 'white' ? logoWhite : logoDark} 
                    alt="Job Seer Logo" 
                    className={`${cfg.img} object-contain transition-transform duration-200 group-hover:scale-105 pointer-events-none`}
                />
            </div>

            {/* Wordmark & Subtitle */}
            {showText && (
                <div className="flex flex-col justify-center text-left">
                    <span className={`tracking-tight leading-none transition-colors ${
                        variant === 'white' 
                            ? 'text-white' 
                            : 'text-slate-900'
                    } ${cfg.text}`}>
                        Job Seer
                    </span>
                    {subtext && (
                        <span className={`font-mono tracking-tight leading-tight mt-1.5 ${
                            variant === 'white' 
                                ? 'text-indigo-200' 
                                : 'text-slate-500'
                        } ${cfg.sub}`}>
                            {subtext}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
