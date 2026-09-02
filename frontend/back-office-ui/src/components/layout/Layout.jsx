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
    <div className={`h-screen w-screen overflow-hidden flex ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-gray-900'}`}>
      <Sidebar activeView={activeView} onNavigate={onNavigate} />
      <div className={`flex-1 ml-64 flex flex-col h-screen overflow-hidden ${mainBg}`}>
        <TopBar title={title} subtitle={subtitle} />
        <main className="flex-1 p-6 overflow-y-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
