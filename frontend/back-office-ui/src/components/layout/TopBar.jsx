import { useState, useRef, useEffect } from 'react';
import { Bell, Calendar, RefreshCw, Sun, Moon, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function TopBar({ title, subtitle }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef(null);

  const today = new Date();
  const dateStr = selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Close calendar popover on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeToggle = () => {
    toggleTheme();
  };
  
  // Theme styling helpers
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

  // Calendar matrix calculations
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  return (
    <header className={`h-16 ${bgColor} border-b ${borderColor} flex items-center justify-between px-6 sticky top-0 z-20`}>
      <div>
        <h1 className={`text-lg font-bold ${textColor} leading-tight`}>{title}</h1>
        {subtitle && <p className={`text-xs ${subtextColor}`}>{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {/* Interactive Calendar Dropdown */}
        <div className="relative" ref={calendarRef}>
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className={`flex items-center gap-1.5 text-xs font-medium ${subtextColor} ${dateBg} px-3 py-1.5 rounded-lg border ${dateBorder} hover:border-blue-400 transition-all cursor-pointer shadow-sm`}
          >
            <Calendar size={13} className="text-blue-500" />
            <span>{dateStr}</span>
          </button>

          {showCalendar && (
            <div className={`absolute right-0 mt-2 w-80 p-4 ${bgColor} rounded-2xl border ${borderColor} shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150`}>
              {/* Calendar Header */}
              <div className="flex items-center justify-between border-b pb-3 mb-3 border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-blue-500" />
                  <span className={`text-sm font-bold ${textColor}`}>
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={prevMonth}
                    className={`p-1 rounded-md ${hoverBg} ${subtextColor}`}
                    type="button"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={nextMonth}
                    className={`p-1 rounded-md ${hoverBg} ${subtextColor}`}
                    type="button"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button 
                    onClick={() => setShowCalendar(false)}
                    className={`p-1 rounded-md ${hoverBg} ${subtextColor} ml-1`}
                    type="button"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                  <span key={d} className="text-[11px] font-bold text-slate-400 uppercase">{d}</span>
                ))}
              </div>

              {/* Calendar Grid Days */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const isToday = today.getDate() === dayNum && today.getMonth() === month && today.getFullYear() === year;
                  const isSelected = selectedDate.getDate() === dayNum && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;

                  return (
                    <button
                      key={dayNum}
                      type="button"
                      onClick={() => {
                        setSelectedDate(new Date(year, month, dayNum));
                        setShowCalendar(false);
                      }}
                      className={`h-8 w-8 text-xs font-semibold rounded-lg flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-blue-600 text-white shadow-md font-bold' 
                          : isToday 
                          ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-bold border border-blue-400/40' 
                          : `${hoverBg} ${textColor}`
                      }`}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>

              {/* Quick Select Today Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    setSelectedDate(now);
                    setCurrentMonth(now);
                    setShowCalendar(false);
                  }}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  Today ({today.getDate()} {today.toLocaleDateString('en-US', { month: 'short' })})
                </button>
                <span className="text-[11px] text-slate-400 font-mono">Fiscal Year 2026</span>
              </div>
            </div>
          )}
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
