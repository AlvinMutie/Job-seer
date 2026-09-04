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
            return 'light';
        } catch {
            return 'light';
        }
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
        } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
        }
        try {
            localStorage.setItem('job_seer_theme', theme);
        } catch (e) {
            console.error('Failed to save theme preference', e);
        }
    }, [theme]);

    const toggleTheme = () => {
        setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const setTheme = (newTheme) => {
        if (newTheme === 'dark' || newTheme === 'light') {
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
