import { useState, useEffect, useMemo } from 'react';
import { Eye, EyeOff, ChevronDown, ChevronUp, Users, Shield, Lock, ArrowRight, HelpCircle, Activity, FileText, Mail, AlertCircle, Sparkles, Search } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext.jsx';
import useUserValidation from '../../../hooks/useUserValidation.js';
import UserDirectory from '../components/UserDirectory.jsx';

export default function Login() {
  const { login } = useAuth();
  const { getRecommendedTestUsers, isUsernameValid } = useUserValidation();
  
  // Pre-fill with Planning Team Lead demo user
  const [email, setEmail]         = useState('u-pt-01');
  const [password, setPassword]   = useState('password123');
  const [showPwd, setShowPwd]     = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [showDemo, setShowDemo]   = useState(true);
  const [showDirectory, setShowDirectory] = useState(false);
  const [demoAccounts, setDemoAccounts] = useState([]);
  const [quickCategory, setQuickCategory] = useState('ALL');
  const [quickAuditType, setQuickAuditType] = useState('ALL');
  const [quickSearch, setQuickSearch] = useState('');

  useEffect(() => {
    try {
      const recommended = getRecommendedTestUsers();
      const seen = new Set();
      const demoList = [];
      for (const user of recommended) {
        if (user && user.username && !seen.has(user.username.toLowerCase())) {
          seen.add(user.username.toLowerCase());
          demoList.push({
            label: user.username,
            username: user.username,
            fullName: user.fullName || user.username,
            email: user.username,
            userEmail: user.email,
            role: user.role ? user.role.replace(/_/g, ' ') : (user.auditType ? user.auditType.replace(/_/g, ' ') : 'USER'),
            category: user.category || 'Other',
            auditType: user.auditType || '',
            assignedLocation: user.assignedLocation || 'FEDERAL',
            description: user.description
          });
        }
      }
      setDemoAccounts(demoList);
    } catch (err) {
      console.error('Failed to load demo accounts', err);
    }
  }, [getRecommendedTestUsers]);

  const categories = useMemo(() => [
    { id: 'ALL', label: 'All Users' },
    { id: 'Joint Audit — Addis Ababa TC1', label: 'AA TC1 (Joint)' },
    { id: 'Joint Audit — Federal LTO1', label: 'Federal LTO1 (Joint)' },
    { id: 'Joint Audit — Federal LTO2', label: 'Federal LTO2 (Joint)' },
    { id: 'Committees (Joint & TP)', label: 'Committees' },
    { id: 'Planning Team', label: 'Planning Team' },
    { id: 'Audit Directorate', label: 'Audit Directorate' },
    { id: 'Senior Management', label: 'Senior Mgmt' },
    { id: 'Federal Regional Directorate', label: 'Fed Reg Dir' },
    { id: 'Federal Tax Centers', label: 'Federal LTOs' },
    { id: 'Team Leaders', label: 'Team Leaders' },
    { id: 'Auditors', label: 'Auditors' },
  ], []);

  const auditTypePills = useMemo(() => [
    { id: 'ALL', label: 'All Types' },
    { id: 'TRANSFER_PRICING', label: 'Transfer Pricing' },
    { id: 'JOINT_AUDIT', label: 'Joint Audit' },
    { id: 'DESK_AUDIT', label: 'Desk Audit' },
    { id: 'COMPREHENSIVE_AUDIT', label: 'Comprehensive' },
    { id: 'ISSUE_AUDIT', label: 'Issue Audit' },
  ], []);

  const filteredDemoAccounts = useMemo(() => {
    return demoAccounts.filter(u => {
      // Category filter
      if (quickCategory !== 'ALL') {
        if (u.category !== quickCategory) return false;
      }

      // Audit Type filter
      if (quickAuditType !== 'ALL') {
        const at = (u.auditType || '').toUpperCase();
        if (!at.includes(quickAuditType)) return false;
      }

      // Search
      if (quickSearch.trim()) {
        const q = quickSearch.toLowerCase().trim();
        const mUser = (u.username || '').toLowerCase().includes(q);
        const mName = (u.fullName || '').toLowerCase().includes(q);
        const mRole = (u.role || '').toLowerCase().includes(q);
        const mAudit = (u.auditType || '').toLowerCase().includes(q);
        const mLoc = (u.assignedLocation || '').toLowerCase().includes(q);
        const mDesc = (u.description || '').toLowerCase().includes(q);
        if (!mUser && !mName && !mRole && !mAudit && !mLoc && !mDesc) return false;
      }

      return true;
    });
  }, [demoAccounts, quickCategory, quickAuditType, quickSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputValue = email.trim();
    
    if (!inputValue) { 
      setError('Username or email is required');    
      return; 
    }
    
    setError('');
    setLoading(true);

    try {
      await login(inputValue, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check the username or email.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = async (demoUser) => {
    const identifier = typeof demoUser === 'object' && demoUser !== null
      ? (demoUser.username || demoUser.email || demoUser.id)
      : demoUser;
    setEmail(identifier);
    setPassword('password123');
    setShowDirectory(false);
    // Auto-login on selection from directory
    setError('');
    setLoading(true);
    try {
      await login(demoUser, 'password123');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-login when clicking any test user preset
  const handleQuickLogin = async (demoUsername) => {
    const inputValue = String(demoUsername).trim();
    setError('');
    setLoading(true);
    setEmail(inputValue);
    
    try {
      await login(inputValue, 'password123');
    } catch (err) {
      setError(err.message || 'Login failed. Please check the username.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex">
      {showDirectory && (
        <UserDirectory
          onSelectUser={fillDemo}
          onClose={() => setShowDirectory(false)}
        />
      )}

      {/* ═══ LEFT PANEL — Royal Blue Brand Section ═══ */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-[#1e40af] text-white p-8 lg:p-12 flex-col justify-between h-full">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
              <img
                src="/mor-logo.jpeg"
                alt="Ministry of Revenues"
                className="w-full h-full object-cover"
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-white/15 items-center justify-center text-white font-bold text-sm hidden">MOR</div>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white">ITAS Back-office</h1>
          </div>
        </div>

        <div className="relative z-10 space-y-4 max-w-xl my-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200/80">MINISTRY OF REVENUE - ITAS</p>
          <h2 className="text-[2.25rem] lg:text-[2.75rem] font-extrabold leading-[1.1] tracking-tight text-white">
            Tax administration, operated with clarity.
          </h2>
          <p className="text-blue-100/80 text-[14px] leading-relaxed max-w-lg">
            Sign in to access the back-office suite — registration, workflow tasks, and tax-type administration in one secure console.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-blue-200/70 text-xs">
          <Lock size={13} />
          <span>Authorized personnel only • Ethiopian Ministry of Revenues</span>
        </div>
      </div>

      {/* ═══ RIGHT PANEL — Dark Theme Login Form ═══ */}
      <div className="w-full md:w-1/2 h-full bg-[#050505] flex items-center justify-center p-6 lg:p-8 text-white overflow-y-auto">
        <div className="w-full max-w-[420px] space-y-4 my-auto">
          <div className="space-y-1">
            <h2 className="text-[2.2rem] font-bold tracking-tight text-white">Welcome back</h2>
            <p className="text-sm text-gray-400">Sign in to continue to the ITAS Back-office.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em] mb-2">
                Username or Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  autoComplete="off"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. u-pt-01, u-ad-01, or planning.auditor1@mor.gov.et"
                  className="w-full pl-10 pr-4 py-3 bg-[#111827] border border-gray-800 text-white placeholder-gray-500 text-[13px]
                             rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
                             transition-all duration-200 font-mono"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1.5">
                Use your system username (e.g. <code className="text-blue-400">u-pt-01</code>) or official MOR email.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em]">
                  Password <span className="text-gray-500 text-[10px] font-normal">(Optional in Demo Mode)</span>
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="off"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="password123 or leave empty"
                  className="w-full pl-10 pr-11 py-3 bg-[#111827] border border-gray-800 text-white placeholder-gray-600 text-[13px]
                             rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
                             transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-950/40 border border-red-800/60 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-[14px] font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/30"
            >
              {loading ? 'Signing in…' : 'Sign in to ITAS'}
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Quick Access & Directory Section */}
          <div className="space-y-2.5 pt-3 border-t border-gray-900">
            {/* Directory Button */}
            <button
              type="button"
              onClick={() => setShowDirectory(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5
                         bg-[#0e1626] hover:bg-[#132038] border border-blue-900/40
                         text-blue-300 hover:text-white text-[12px] font-medium rounded-xl transition-all duration-200"
            >
              <Users size={14} />
              Browse Full User Directory (684+ System Accounts)
            </button>

            {/* Quick login accordion */}
            <button
              type="button"
              onClick={() => setShowDemo(v => !v)}
              className="w-full flex items-center justify-between px-4 py-2.5
                         bg-[#111827] hover:bg-[#1f2937] border border-gray-800
                         text-gray-300 text-[12px] font-medium rounded-xl transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={14} className="text-amber-400" />
                Quick Federal Login Presets ({filteredDemoAccounts.length} / {demoAccounts.length} Users)
              </span>
              {showDemo ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {showDemo && (
              <div className="space-y-2 p-2.5 rounded-xl bg-[#0b1120]/90 border border-gray-800/80 shadow-inner">
                {/* Search inside quick presets */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search federal user, role, or audit type..."
                    value={quickSearch}
                    onChange={e => setQuickSearch(e.target.value)}
                    className="w-full pl-8 pr-7 py-1.5 bg-[#111827] border border-gray-800 text-xs text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  {quickSearch && (
                    <button
                      type="button"
                      onClick={() => setQuickSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Category Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin text-[10px]">
                  {categories.map(cat => {
                    const count = cat.id === 'ALL'
                      ? demoAccounts.length
                      : demoAccounts.filter(a => a.category === cat.id).length;
                    const isActive = quickCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setQuickCategory(cat.id);
                          if (cat.id !== 'Team Leaders' && cat.id !== 'Auditors' && cat.id !== 'ALL') {
                            setQuickAuditType('ALL');
                          }
                        }}
                        className={`px-2 py-1 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-[#111827] text-gray-400 hover:text-gray-200 hover:bg-[#1f2937]'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span className={`text-[9px] px-1 py-0.2 rounded-full ${isActive ? 'bg-blue-700 text-blue-100' : 'bg-gray-800 text-gray-400'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Audit Type Sub-filters (visible when Team Leaders, Auditors, Committees, or All is active) */}
                {(quickCategory === 'Team Leaders' || quickCategory === 'Auditors' || quickCategory === 'Committees (Joint & TP)' || quickCategory === 'ALL') && (
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin text-[9px] pt-0.5 border-t border-gray-900">
                    <span className="text-gray-500 font-bold uppercase tracking-wider pl-1 pr-0.5 text-[8px]">Audit Type:</span>
                    {auditTypePills.map(at => {
                      const isActive = quickAuditType === at.id;
                      return (
                        <button
                          key={at.id}
                          type="button"
                          onClick={() => setQuickAuditType(at.id)}
                          className={`px-1.5 py-0.5 rounded font-medium whitespace-nowrap transition-colors ${
                            isActive
                              ? 'bg-purple-600 text-white font-bold shadow-sm'
                              : 'bg-[#1a233a]/60 text-purple-300 hover:bg-[#1f2937] hover:text-white'
                          }`}
                        >
                          {at.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Scrollable Presets List */}
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                  {filteredDemoAccounts.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-500">
                      No federal users match the selected filters.
                    </div>
                  ) : (
                    filteredDemoAccounts.map(u => (
                      <button
                        key={u.username}
                        type="button"
                        onClick={() => handleQuickLogin(u.username)}
                        disabled={loading}
                        className="w-full text-left px-3 py-2 rounded-lg bg-[#0f172a]/80 border border-gray-800/80
                                   hover:bg-[#1e293b] hover:border-blue-500/50 hover:shadow-sm transition-all duration-150
                                   disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[12px] font-semibold text-gray-200 font-mono group-hover:text-blue-400 transition-colors">
                                {u.username}
                              </span>
                              <span className="text-[11px] font-medium text-white truncate">
                                • {u.fullName}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-900/40 text-blue-300 font-semibold border border-blue-800/40 uppercase">
                                {u.role}
                              </span>
                              {u.auditType && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-900/40 text-purple-300 font-semibold border border-purple-800/40 uppercase">
                                  {u.auditType.replace(/_/g, ' ')}
                                </span>
                              )}
                              {u.assignedLocation && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                                  {u.assignedLocation}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-400 truncate mt-0.5">{u.description}</p>
                          </div>
                          <span className="text-[9px] font-bold px-2 py-1 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30 flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            LOGIN
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-5 mt-6 pt-2">
            {[
              { icon: HelpCircle, label: 'Help Center' },
              { icon: Activity, label: 'System Status' },
              { icon: FileText, label: 'Privacy Policy' },
              { icon: Mail, label: 'Contact Support' },
            ].map((link, i) => (
              <a key={i} href="#" className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-blue-400 transition-colors duration-150">
                <link.icon size={11} />
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
