import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '', size = 'md' }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    const sizeClasses = size === 'sm' 
        ? 'p-1.5 text-xs' 
        : size === 'lg' 
        ? 'p-3 text-base' 
        : 'p-2 text-sm';

    return (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleTheme(e);
            }}
            className={`inline-flex items-center justify-center rounded-xl transition-all duration-200 border focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95 cursor-pointer select-none ${
                isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700 shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-indigo-600 border-slate-200 shadow-xs'
            } ${sizeClasses} ${className}`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} mode (Currently: ${theme})`}
            aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
            data-testid="theme-toggle-btn"
        >
            {isDark ? (
                <Sun size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} className="transition-transform rotate-0 hover:rotate-45 duration-300 pointer-events-none" />
            ) : (
                <Moon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} className="transition-transform rotate-0 hover:-rotate-12 duration-300 pointer-events-none" />
            )}
        </button>
    );
}
