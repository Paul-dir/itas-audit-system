import { Bell, Calendar, RefreshCw, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function TopBar({ title, subtitle }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const handleThemeToggle = () => {
    console.log('[TopBar] Button clicked! Current theme:', theme);
    toggleTheme();
  };
  
  // Determine colors based on theme - match the screenshot aesthetic
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-slate-800' : 'bg-white';
  const borderColor = isDark ? 'border-slate-700' : 'border-gray-200';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subtextColor = isDark ? 'text-slate-400' : 'text-gray-500';
  const dateBg = isDark ? 'bg-slate-700' : 'bg-gray-50';
  const dateBorder = isDark ? 'border-slate-600' : 'border-gray-200';
  const iconColor = isDark ? 'text-slate-300' : 'text-gray-700';
  const buttonBg = isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200';
  const hoverBg = isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100';
  const avatarBg = isDark ? 'bg-blue-500' : 'bg-blue-600';

  return (
    <header className={`h-16 ${bgColor} border-b ${borderColor} flex items-center justify-between px-6 sticky top-0 z-20`}>
      <div>
        <h1 className={`text-lg font-bold ${textColor} leading-tight`}>{title}</h1>
        {subtitle && <p className={`text-xs ${subtextColor}`}>{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-1.5 text-xs ${subtextColor} ${dateBg} px-3 py-1.5 rounded-lg border ${dateBorder}`}>
          <Calendar size={12} />
          {dateStr}
        </div>
        {/* Theme Toggle Button */}
        <button
          onClick={handleThemeToggle}
          className={`p-2.5 ${iconColor} ${buttonBg} rounded-lg transition-all border-2 border-transparent hover:border-blue-400`}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          type="button"
        >
          {theme === 'light' ? <Moon size={18} className="text-blue-600" /> : <Sun size={18} className="text-yellow-400" />}
        </button>
        <button
          onClick={() => window.location.reload()}
          className={`p-2 ${subtextColor} ${hoverBg} rounded-lg transition-colors`}
          title="Refresh"
          type="button"
        >
          <RefreshCw size={15} />
        </button>
        <button 
          className={`relative p-2 ${subtextColor} ${hoverBg} rounded-lg transition-colors`}
          type="button"
        >
          <Bell size={15} />
        </button>
        <div className={`w-8 h-8 ${avatarBg} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
          {user?.name?.split(' ').map(n => n[0]).slice(0,2).join('')}
        </div>
      </div>
    </header>
  );
}
