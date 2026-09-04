import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => {},
    setTheme: () => {}
});

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(() => {
        try {
            const saved = localStorage.getItem('job_seer_theme');
            if (saved === 'dark' || saved === 'light') return saved;
            if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
            return 'light';
        } catch {
            return 'light';
        }
    });

    const applyTheme = (targetTheme) => {
        if (typeof document === 'undefined') return;
        const root = document.documentElement;
        const body = document.body;
        if (targetTheme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
            root.setAttribute('data-theme', 'dark');
            if (body) {
                body.classList.add('dark');
                body.classList.remove('light');
                body.setAttribute('data-theme', 'dark');
            }
        } else {
            root.classList.remove('dark');
            root.classList.add('light');
            root.setAttribute('data-theme', 'light');
            if (body) {
                body.classList.remove('dark');
                body.classList.add('light');
                body.setAttribute('data-theme', 'light');
            }
        }
        try {
            localStorage.setItem('job_seer_theme', targetTheme);
        } catch (e) {
            console.error('Failed to save theme preference', e);
        }
    };

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const toggleTheme = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setThemeState(prev => {
            const next = prev === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            return next;
        });
    };

    const setTheme = (newTheme) => {
        if (newTheme === 'dark' || newTheme === 'light') {
            applyTheme(newTheme);
            setThemeState(newTheme);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
