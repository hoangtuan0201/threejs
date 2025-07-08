import { createContext, useContext, useState, useEffect } from 'react';
import { getTheme } from './theme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;

    const saved = localStorage.getItem('airsmart-theme');
    return saved !== null
      ? JSON.parse(saved)
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Save theme preference when manually set
  useEffect(() => {
    const saved = localStorage.getItem('airsmart-theme');
    if (saved !== null) {
      localStorage.setItem('airsmart-theme', JSON.stringify(isDark));
    }
  }, [isDark]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (localStorage.getItem('airsmart-theme') === null) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => setIsDark(prev => !prev);

  const value = {
    theme: getTheme(isDark),
    isDark,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
