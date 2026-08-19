import { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function Layout({ children, activeView, onNavigate, title, subtitle }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Match the dark blue/slate background from the screenshots
  const mainBg = isDark ? 'bg-slate-800' : 'bg-gray-50';
  
  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
      <Sidebar activeView={activeView} onNavigate={onNavigate} />
      <div className={`flex-1 ml-64 flex flex-col min-h-screen ${mainBg}`}>
        <TopBar title={title} subtitle={subtitle} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
