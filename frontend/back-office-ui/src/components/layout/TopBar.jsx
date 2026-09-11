import { useState, useRef, useEffect, useMemo } from 'react';
import { Bell, Calendar, RefreshCw, Sun, Moon, ChevronLeft, ChevronRight, X, Clock, Users, Shield, Check, Search, ChevronDown, LogOut, Building2, Layers3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import TaskInboxModal from '../workflow/TaskInboxModal.jsx';
import NotificationPopover from '../notifications/NotificationPopover.jsx';

const QUICK_SWITCH_USERS = [
  // Federal LTO-1 Joint Audit Roster
  { username: 'fed.ja.chair', name: 'Dr. Solomon Desta', role: 'Joint Committee Chair', auditType: 'JOINT_AUDIT', location: 'Federal LTO-1', category: 'Joint Audit' },
  { username: 'fed.ja.member', name: 'Eleni Tesfaye', role: 'Joint Committee Member', auditType: 'JOINT_AUDIT', location: 'Federal LTO-1', category: 'Joint Audit' },
  { username: 'fed.ja.tl', name: 'Addis Zewde', role: 'Joint Audit Team Leader', auditType: 'JOINT_AUDIT', location: 'Federal LTO-1', category: 'Joint Audit' },
  { username: 'fed.ja.auditor1', name: 'Fikremariam Tilahun', role: 'Joint Auditor (Customs)', auditType: 'JOINT_AUDIT', location: 'Federal LTO-1', category: 'Joint Audit' },
  { username: 'fed.ja.auditor2', name: 'Saron Assefa', role: 'Joint Auditor (Cross-Border)', auditType: 'JOINT_AUDIT', location: 'Federal LTO-1', category: 'Joint Audit' },
  { username: 'fed.ja.auditor3', name: 'Bikila Worku', role: 'Joint Auditor (VAT/Sales)', auditType: 'JOINT_AUDIT', location: 'Federal LTO-1', category: 'Joint Audit' },
  { username: 'fed.ja.auditor4', name: 'Michael Zewde', role: 'Joint Auditor (CIT/Deductions)', auditType: 'JOINT_AUDIT', location: 'Federal LTO-1', category: 'Joint Audit' },
  { username: 'fed.ja.auditor5', name: 'Saron Negash', role: 'Joint Auditor (Forensics)', auditType: 'JOINT_AUDIT', location: 'Federal LTO-1', category: 'Joint Audit' },

  // Federal LTO-2 Joint Audit Roster
  { username: 'fed2.ja.chair', name: 'Dr. Worku Alemayehu', role: 'Joint Committee Chair', auditType: 'JOINT_AUDIT', location: 'Federal LTO-2', category: 'Joint Audit' },
  { username: 'fed2.ja.member', name: 'Tigist Hailu', role: 'Joint Committee Member', auditType: 'JOINT_AUDIT', location: 'Federal LTO-2', category: 'Joint Audit' },
  { username: 'fed2.ja.tl', name: 'Berhanu Bekele', role: 'Joint Audit Team Leader', auditType: 'JOINT_AUDIT', location: 'Federal LTO-2', category: 'Joint Audit' },
  { username: 'fed2.ja.auditor1', name: 'Dawit Mengistu', role: 'Joint Auditor (Customs)', auditType: 'JOINT_AUDIT', location: 'Federal LTO-2', category: 'Joint Audit' },
  { username: 'fed2.ja.auditor2', name: 'Eden Tadesse', role: 'Joint Auditor (Cross-Border)', auditType: 'JOINT_AUDIT', location: 'Federal LTO-2', category: 'Joint Audit' },
  { username: 'fed2.ja.auditor3', name: 'Henok Girma', role: 'Joint Auditor (VAT/Sales)', auditType: 'JOINT_AUDIT', location: 'Federal LTO-2', category: 'Joint Audit' },
  { username: 'fed2.ja.auditor4', name: 'Meron Kebede', role: 'Joint Auditor (CIT/Deductions)', auditType: 'JOINT_AUDIT', location: 'Federal LTO-2', category: 'Joint Audit' },
  { username: 'fed2.ja.auditor5', name: 'Natnael Assefa', role: 'Joint Auditor (Forensics)', auditType: 'JOINT_AUDIT', location: 'Federal LTO-2', category: 'Joint Audit' },

  // Transfer Pricing Roster
  { username: 'u-com-fed-chair-tp', name: 'TP Process Owner', role: 'TP Committee Chair', auditType: 'TRANSFER_PRICING', location: 'Federal Level', category: 'Transfer Pricing' },
  { username: 'u-tl-addis_ababa-tc1-tp-1', name: 'Robel Girma', role: 'TP Team Leader', auditType: 'TRANSFER_PRICING', location: 'Addis Ababa TC-1', category: 'Transfer Pricing' },
  { username: 'u-aud-addis_ababa-tc1-tp-1-1', name: 'Michael Abera', role: 'TP Auditor', auditType: 'TRANSFER_PRICING', location: 'Addis Ababa TC-1', category: 'Transfer Pricing' },

  // Addis Ababa Joint Audit
  { username: 'aa1.chair', name: 'Dr. Abebe Kebede', role: 'Joint Committee Chair', auditType: 'JOINT_AUDIT', location: 'Addis Ababa TC-1', category: 'Joint Audit' },
  { username: 'aa1.tl', name: 'Dawit Tadesse', role: 'Joint Audit Team Leader', auditType: 'JOINT_AUDIT', location: 'Addis Ababa TC-1', category: 'Joint Audit' },
  { username: 'aa1.auditor1', name: 'Sara Mohammed', role: 'Joint Auditor (Customs)', auditType: 'JOINT_AUDIT', location: 'Addis Ababa TC-1', category: 'Joint Audit' },

  // Regional Joint Audit Chairs
  { username: 'or1.chair', name: 'Dr. Chaltu Negash', role: 'Joint Committee Chair', auditType: 'JOINT_AUDIT', location: 'Oromia TC-1', category: 'Joint Audit' },
  { username: 'ba1.chair', name: 'Dr. Tadesse Kebede', role: 'Joint Committee Chair', auditType: 'JOINT_AUDIT', location: 'Amhara TC-1', category: 'Joint Audit' },
  { username: 'dd1.chair', name: 'Dr. Yonas Mengistu', role: 'Joint Committee Chair', auditType: 'JOINT_AUDIT', location: 'Dire Dawa TC-1', category: 'Joint Audit' },
  { username: 'sn1.chair', name: 'Dr. Tekle Lemma', role: 'Joint Committee Chair', auditType: 'JOINT_AUDIT', location: 'SNNPR TC-1', category: 'Joint Audit' },
  { username: 'so1.chair', name: 'Dr. Ibrahim Hassan', role: 'Joint Committee Chair', auditType: 'JOINT_AUDIT', location: 'Somali TC-1', category: 'Joint Audit' },

  // Standard Audits & Management
  { username: 'u-tcm-federal-lto1', name: 'Tsega Mulugeta', role: 'Tax Center Manager', auditType: 'MANAGEMENT', location: 'Federal LTO-1', category: 'Leadership' },
  { username: 'u-tcm-federal-lto2', name: 'Tirhas Gebre', role: 'Tax Center Manager', auditType: 'MANAGEMENT', location: 'Federal LTO-2', category: 'Leadership' },
  { username: 'u-pt-01', name: 'Eden Haile', role: 'National Planning Lead', auditType: 'PLANNING', location: 'Federal Level', category: 'Leadership' },
  { username: 'u-ad-01', name: 'Getnet Bekele', role: 'National Audit Director', auditType: 'DIRECTORATE', location: 'Federal Level', category: 'Leadership' },
  { username: 'u-sm-01', name: 'Almaz Berhane', role: 'Senior Management Exec', auditType: 'EXECUTIVE', location: 'Federal Level', category: 'Leadership' },
];

export default function TopBar({ title, subtitle, onNavigate }) {
  const { user, login, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTaskInbox, setShowTaskInbox] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [switcherTab, setSwitcherTab] = useState('ALL');
  const [switcherSearch, setSwitcherSearch] = useState('');
  const [switching, setSwitching] = useState(false);
  const calendarRef = useRef(null);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const actorId = user.username || user.id || '';
      if (!actorId) return;
      const [countRes, listRes] = await Promise.all([
        fetch('/api/v1/notifications/unread-count', {
          headers: { 'X-Actor-Id': actorId }
        }),
        fetch('/api/v1/notifications', {
          headers: { 'X-Actor-Id': actorId }
        })
      ]);
      if (countRes.ok) {
        const json = await countRes.json();
        setUnreadCount(json?.data?.unreadCount || 0);
      }
      if (listRes.ok) {
        const json = await listRes.json();
        setNotifications(json?.data || []);
      }
    } catch (e) {
      console.warn('Could not fetch notifications', e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    const handleUpdate = () => fetchNotifications();
    window.addEventListener('notification-updated', handleUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('notification-updated', handleUpdate);
    };
  }, [user?.id, user?.username]);

  const handleMarkAsRead = async (id) => {
    try {
      const actorId = user?.username || user?.id || '';
      await fetch(`/api/v1/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'X-Actor-Id': actorId }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const actorId = user?.username || user?.id || '';
      await fetch('/api/v1/notifications/mark-all-read', {
        method: 'PATCH',
        headers: { 'X-Actor-Id': actorId }
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const today = new Date();
  const dateStr = selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Close calendar and notification popovers on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
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

  const filteredQuickUsers = useMemo(() => {
    return QUICK_SWITCH_USERS.filter(u => {
      if (switcherTab !== 'ALL' && u.category !== switcherTab) return false;
      if (switcherSearch.trim()) {
        const q = switcherSearch.toLowerCase().trim();
        const mName = u.name.toLowerCase().includes(q);
        const mRole = u.role.toLowerCase().includes(q);
        const mUser = u.username.toLowerCase().includes(q);
        const mLoc = (u.location || '').toLowerCase().includes(q);
        if (!mName && !mRole && !mUser && !mLoc) return false;
      }
      return true;
    });
  }, [switcherTab, switcherSearch]);

  const handleSwitchUser = async (targetUsername) => {
    if (switching) return;
    setSwitching(true);
    try {
      await login(targetUsername, 'password123');
      setShowUserMenu(false);
    } catch (e) {
      console.error('Failed to switch user:', e);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <>
      <header className={`h-16 ${bgColor} border-b ${borderColor} flex items-center justify-between px-6 sticky top-0 z-20 transition-colors`}>
        {/* Left: Page Title */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className={`text-xl font-bold ${textColor} tracking-tight leading-none`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`text-xs ${subtextColor} mt-1 font-medium`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Fiscal Date Dropdown Trigger */}
          <div className="relative" ref={calendarRef}>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg ${dateBg} border ${dateBorder} ${textColor} hover:border-blue-400 transition cursor-pointer`}
              title="Click to toggle fiscal calendar"
              type="button"
            >
              <Calendar size={14} className="text-blue-600" />
              <span>{dateStr}</span>
            </button>

            {/* Mini Calendar Popover */}
            {showCalendar && (
              <div className={`absolute right-0 mt-2 w-72 ${bgColor} rounded-xl shadow-2xl border ${borderColor} p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150`}>
                {/* Month Navigator */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                    className={`p-1 rounded-md ${hoverBg} ${subtextColor}`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className={`text-xs font-bold ${textColor}`}>
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                    className={`p-1 rounded-md ${hoverBg} ${subtextColor}`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Day Labels */}
                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                    <span key={d} className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      {d}
                    </span>
                  ))}
                </div>

                {/* Day Numbers */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, i) => {
                    const year = currentMonth.getFullYear();
                    const month = currentMonth.getMonth();
                    const firstDayIndex = new Date(year, month, 1).getDay();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const dayNum = i - firstDayIndex + 1;

                    if (dayNum < 1 || dayNum > daysInMonth) {
                      return <span key={i} className="h-8 w-8" />;
                    }

                    const isToday =
                      today.getDate() === dayNum &&
                      today.getMonth() === month &&
                      today.getFullYear() === year;

                    const isSelected =
                      selectedDate.getDate() === dayNum &&
                      selectedDate.getMonth() === month &&
                      selectedDate.getFullYear() === year;

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
          {/* Notifications Bell & Popover */}
          <div className="relative" ref={notificationRef}>
            <button 
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 ${subtextColor} ${hoverBg} rounded-lg transition-colors cursor-pointer ${
                showNotifications ? 'bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : ''
              }`}
              title="Notifications & Tasks"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-sm animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            <NotificationPopover 
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onOpenTasksModal={() => setShowTaskInbox(true)}
              onNavigate={onNavigate}
            />
          </div>

          {/* User Profile & Switcher */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/60 transition cursor-pointer border border-transparent hover:border-slate-300 dark:hover:border-slate-600 group"
              title="Click to view profile or switch role"
            >
              <div className={`w-8 h-8 ${avatarBg} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-xs ring-2 ring-transparent group-hover:ring-blue-400/40 transition`}>
                {user?.name?.split(' ').map(n => n[0]).slice(0,2).join('')}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[130px] leading-tight">
                  {user?.name}
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold truncate max-w-[130px] leading-tight">
                  {user?.auditType ? user.auditType.replace(/_/g, ' ') : user?.role}
                </span>
              </div>
              <ChevronDown size={14} className="text-slate-400 group-hover:text-blue-500 transition" />
            </button>

            {/* User Menu Popover */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Active User Header */}
                <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-sm font-black ring-2 ring-white/30">
                        {user?.name?.split(' ').map(n => n[0]).slice(0,2).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-tight">{user?.name}</p>
                        <p className="text-xs text-blue-100 mt-0.5 font-mono">{user?.username || user?.id}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/25 uppercase tracking-wide">
                      Active
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/20 flex flex-wrap gap-1.5 text-[11px]">
                    <span className="bg-black/20 px-2 py-0.5 rounded-md font-semibold">
                      👔 {user?.role}
                    </span>
                    {user?.auditType && (
                      <span className="bg-emerald-500/30 px-2 py-0.5 rounded-md font-semibold text-emerald-100">
                        🏷️ {user.auditType.replace(/_/g, ' ')}
                      </span>
                    )}
                    {user?.taxCenter && (
                      <span className="bg-blue-800/40 px-2 py-0.5 rounded-md font-medium text-blue-100">
                        🏢 {user.taxCenter}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Persona Switcher Section */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Users size={13} className="text-blue-500" />
                      <span>Switch System Persona</span>
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">Instant Dynamic Role Switch</span>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex gap-1 mb-2 overflow-x-auto pb-1">
                    {['ALL', 'Joint Audit', 'Transfer Pricing', 'Leadership'].map(tabKey => (
                      <button
                        key={tabKey}
                        type="button"
                        onClick={() => setSwitcherTab(tabKey)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                          switcherTab === tabKey
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {tabKey}
                      </button>
                    ))}
                  </div>

                  {/* Search input */}
                  <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search name, role, username..."
                      value={switcherSearch}
                      onChange={e => setSwitcherSearch(e.target.value)}
                      className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Persona List */}
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60 p-1">
                  {filteredQuickUsers.map(persona => {
                    const isCurrent = user?.username === persona.username;
                    return (
                      <button
                        key={persona.username}
                        type="button"
                        disabled={isCurrent || switching}
                        onClick={() => handleSwitchUser(persona.username)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition group cursor-pointer ${
                          isCurrent
                            ? 'bg-blue-50/70 dark:bg-blue-950/30 cursor-default'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${
                            isCurrent
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 group-hover:text-blue-600'
                          }`}>
                            {persona.name.split(' ').map(n => n[0]).slice(0,2).join('')}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate flex items-center gap-1.5">
                              <span>{persona.name}</span>
                              {isCurrent && <Check size={12} className="text-blue-600 dark:text-blue-400 stroke-[3]" />}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              <span className="font-semibold text-blue-600 dark:text-blue-400">{persona.role}</span>
                              {persona.location && ` • ${persona.location}`}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0 ml-2">
                          {persona.username}
                        </span>
                      </button>
                    );
                  })}
                  {filteredQuickUsers.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No matching personas found.
                    </div>
                  )}
                </div>

                {/* Footer / Sign Out */}
                <div className="p-2.5 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-mono">ITAS Multi-Role Engine</span>
                  <button
                    type="button"
                    onClick={() => { setShowUserMenu(false); logout(); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Task Inbox Modal */}
      <TaskInboxModal isOpen={showTaskInbox} onClose={() => setShowTaskInbox(false)} />
    </>
  );
}
