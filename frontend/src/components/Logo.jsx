import React from 'react';
import logoImg from '../assets/Logo.png';

export default function Logo({ 
    size = 'md', 
    showText = true, 
    className = '', 
    subtext = null,
    variant = 'default' 
}) {
    // Dimension presets for the logo image
    const sizeMap = {
        xs: 'w-6 h-6',
        sm: 'w-8 h-8',
        md: 'w-9 h-9',
        lg: 'w-11 h-11',
        xl: 'w-14 h-14'
    };

    const imgClass = sizeMap[size] || sizeMap.md;

    return (
        <div className={`inline-flex items-center gap-3 select-none ${className}`}>
            <div className="relative flex items-center justify-center shrink-0">
                <img 
                    src={logoImg} 
                    alt="Job Seer Logo" 
                    className={`${imgClass} object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-sm`}
                />
            </div>
            {showText && (
                <div className="flex flex-col justify-center text-left">
                    <span className={`font-extrabold tracking-tight leading-tight ${
                        variant === 'white' 
                            ? 'text-white' 
                            : 'text-slate-900 dark:text-white'
                    } ${
                        size === 'xs' ? 'text-xs' :
                        size === 'sm' ? 'text-sm' :
                        size === 'md' ? 'text-base' :
                        size === 'lg' ? 'text-xl' : 'text-2xl'
                    }`}>
                        Job Seer
                    </span>
                    {subtext && (
                        <span className={`text-[10px] font-mono leading-tight ${
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
