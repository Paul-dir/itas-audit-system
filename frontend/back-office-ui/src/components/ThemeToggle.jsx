import React, { useState, useEffect } from 'react';

/**
 * ThemeToggle Component - Toggle between light and dark modes
 * 
 * Features:
 * - Persists theme preference to localStorage
 * - Respects system preference as fallback
 * - Applies 'dark' class to HTML element for Tailwind
 * - Preserves CSS variables for backward compatibility
 */
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false); // Light mode is default

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const stored = localStorage.getItem('theme');
    let dark = false;
    
    if (stored) {
      dark = stored === 'dark';
    } else {
      // Check system preference
      dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    setIsDark(dark);
    applyTheme(dark);
  }, []);

  const applyTheme = (dark) => {
    const html = document.documentElement;
    
    if (dark) {
      html.classList.remove('light');
      html.classList.add('dark');
      document.body.classList.remove('light');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
      document.body.classList.remove('dark');
      document.body.classList.add('light');
      localStorage.setItem('theme', 'light');
      document.documentElement.style.colorScheme = 'light';
    }
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    applyTheme(newIsDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center bg-card border border-border rounded-md text-text-primary hover:border-primary hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <i className="fas fa-sun text-sm"></i>
      ) : (
        <i className="fas fa-moon text-sm"></i>
      )}
    </button>
  );
}

