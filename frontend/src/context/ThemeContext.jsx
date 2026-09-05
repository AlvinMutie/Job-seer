import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => {},
    setTheme: () => {}
});

export function ThemeProvider({ children }) {
    const [theme] = useState('light');

    useEffect(() => {
        if (typeof document !== 'undefined') {
            const root = document.documentElement;
            root.classList.remove('dark');
            root.classList.add('light');
            root.setAttribute('data-theme', 'light');
            if (document.body) {
                document.body.classList.remove('dark');
                document.body.classList.add('light');
                document.body.setAttribute('data-theme', 'light');
            }
            try {
                localStorage.setItem('job_seer_theme', 'light');
            } catch (e) {}
        }
    }, []);

    const toggleTheme = () => {};
    const setTheme = () => {};

    return (
        <ThemeContext.Provider value={{ theme: 'light', toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
