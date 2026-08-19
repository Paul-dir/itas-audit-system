import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  // Start with light mode by default
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Load saved theme after mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('mor-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    }
    setMounted(true);
  }, []);

  // Apply theme to DOM
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Also apply to body for additional styling
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem('mor-theme', theme);
    
    console.log('[Theme] Applied:', theme);
    console.log('[Theme] HTML classes:', root.className);
    console.log('[Theme] Body classes:', document.body.className);
    console.log('[Theme] Computed background:', window.getComputedStyle(document.body).backgroundColor);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      console.log('[Theme] Toggle:', prev, '→', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
