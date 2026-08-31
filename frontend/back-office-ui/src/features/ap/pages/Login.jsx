import { useState } from 'react';
import { Eye, EyeOff, ChevronDown, ChevronUp, Users, Shield, BarChart3, Workflow, UserCheck, Lock, ArrowRight, HelpCircle, Activity, FileText, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext.jsx';
import UserDirectory from '../components/UserDirectory.jsx';
import { SEED_USERS } from '../data/seed.js';

const DEMO_ACCOUNTS = [
  { label: 'Planning Team',               email: 'planning.auditor1@mor.gov.et',        role: 'Audit Planning Team'   },
  { label: 'Audit Director',              email: 'tesfaye.bekele@mor.gov.et',           role: 'Audit Director'        },
  { label: 'Senior Management',           email: 'rahel.hailu@mor.gov.et',              role: 'Senior Management'     },
  { label: 'Regional Director (Addis)',   email: 'getnet.alemu@mor.gov.et',             role: 'Regional Director'     },
  { label: 'Regional Director (Oromia)',  email: 'gemechu.negash@mor.gov.et',           role: 'Regional Director'     },
  { label: 'Tax Center Manager (AA-TC1)', email: 'mekdes.solomon@mor.gov.et',           role: 'Tax Center Manager'    },
  { label: 'Tax Center Manager (AA-TC2)', email: 'dereje.worku@mor.gov.et',             role: 'Tax Center Manager'    },
  { label: 'Team Leader',                 email: 'henok.belay@mor.gov.et',              role: 'Team Leader'           },
  { label: 'Auditor',                     email: 'kidist.mehari@mor.gov.et',            role: 'Auditor'               },
  { label: 'Committee Chair (AA)',        email: 'aa.committee1@mor.gov.et',             role: 'Committee'             },
  { label: 'Committee Member (AA-2)',     email: 'aa-ara.joint_committee.2@mor.gov.et',  role: 'Committee'             },
  { label: 'Committee Member (AA-3)',     email: 'aa-ara.joint_committee.3@mor.gov.et',  role: 'Committee'             },
  { label: 'Committee Member (AA-4)',     email: 'aa-ara.joint_committee.4@mor.gov.et',  role: 'Committee'             },
  { label: 'Committee Member (AA-5)',     email: 'aa-ara.joint_committee.5@mor.gov.et',  role: 'Committee'             },
];

const FEATURES = [
  { icon: Shield,       label: 'Secure\nand Compliant' },
  { icon: BarChart3,    label: 'Data-Driven\nDecisions' },
  { icon: Workflow,     label: 'Streamlined\nWorkflows' },
  { icon: UserCheck,    label: 'Role-Based\nAccess' },
];

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [showDemo, setShowDemo]   = useState(false);
  const [showDirectory, setShowDirectory] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim())    { setError('Email is required');    return; }
    if (!password.trim()) { setError('Password is required'); return; }
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setShowDirectory(false);
  };

  return (
    <div className="min-h-screen flex">
      {showDirectory && (
        <UserDirectory
          onSelectUser={fillDemo}
          onClose={() => setShowDirectory(false)}
        />
      )}

      {/* ═══ LEFT PANEL — Dark Brand Section ═══ */}
      <div
        className="hidden md:flex md:w-[55%] relative overflow-hidden"
        style={{ background: '#0a0f1a' }}
      >
        {/* Real building background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/login-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Dark overlay with blue tint */}
        <div className="absolute inset-0 bg-[#0a0f1a]/70" />
        {/* Bottom gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 lg:p-16 text-white w-full">
          {/* Logo & Title */}
          <div>
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/10 border border-white/15 flex items-center justify-center backdrop-blur-sm">
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
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300/60 mb-0.5">Ministry of Revenues</p>
                <h1 className="text-xl font-bold tracking-tight text-white">ITAS Back-office</h1>
                <p className="text-[11px] text-gray-400/80 font-medium">Integrated Tax Administration System</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-7 max-w-lg">
            <div>
              <h2 className="text-[2.75rem] lg:text-[3.25rem] font-extrabold leading-[1.08] tracking-tight">
                <span className="text-white">Tax administration,</span>
                <br />
                <span className="text-white">operated with </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">clarity</span><span className="text-white">.</span>
              </h2>
              <div className="flex items-center gap-2 mt-5">
                <div className="w-10 h-[3px] bg-blue-500 rounded-full" />
                <div className="w-2 h-[3px] bg-blue-400/50 rounded-full" />
              </div>
            </div>
            <p className="text-gray-300/80 text-[15px] leading-[1.7] max-w-md">
              Access the back-office suite for audit planning,
              workflow management, and tax administration
              in one secure and intelligent platform.
            </p>

            {/* Feature Icons */}
            <div className="grid grid-cols-4 gap-3 pt-2">
              {FEATURES.map((f, i) => (
                <div key={i} className="group flex flex-col items-center text-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-600/5 border border-blue-500/10 group-hover:from-blue-500/20 group-hover:to-blue-600/10 transition-all duration-300">
                    <f.icon size={18} className="text-blue-400 group-hover:text-blue-300 transition-colors" strokeWidth={1.5} />
                  </div>
                  <p className="text-[10px] text-gray-400/80 leading-tight whitespace-pre-line font-medium group-hover:text-gray-300/80 transition-colors">{f.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 text-gray-500/60 text-[11px] pt-2">
            <Shield size={12} className="text-gray-500/40" />
            <span>Authorized personnel only. All activities are monitored.</span>
          </div>
        </div>
      </div>

      {/* ═══ RIGHT PANEL — Login Form ═══ */}
      <div className="w-full md:w-[45%] bg-gradient-to-br from-gray-50 via-white to-slate-50 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="md:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center">
              <img src="/mor-logo.jpeg" alt="MOR" className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }} />
              <span className="text-white font-bold text-sm hidden">MOR</span>
            </div>
            <span className="text-gray-900 text-lg font-bold">ITAS Back-office</span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-gray-100/80 p-8 ring-1 ring-gray-900/[0.03]">
            {/* Lock icon */}
            <div className="flex justify-center mb-6">
              <div className="p-3.5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl border border-blue-200/50 shadow-sm shadow-blue-100/30">
                <Lock size={22} className="text-blue-600" strokeWidth={2} />
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-7">
              <h2 className="text-[1.7rem] font-bold text-gray-900 tracking-tight">Welcome back</h2>
              <p className="text-[13px] text-gray-500 mt-1.5">Sign in to continue to the ITAS Back-office.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4.5" noValidate>
              {/* Username */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-2">
                  Username <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/70 border border-slate-200/80 text-gray-900 placeholder-gray-400 text-[13px]
                               rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]
                               transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <button type="button" className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-3 bg-slate-50/70 border border-slate-200/80 text-gray-900 placeholder-gray-400 text-[13px]
                               rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]
                               transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                    tabIndex={-1}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                />
                <label htmlFor="remember" className="text-[13px] text-gray-500 cursor-pointer select-none">Remember me</label>
              </div>

              {/* Error */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200/80 rounded-xl px-4 py-3 flex items-center gap-2">
                  <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600
                           hover:from-blue-700 hover:via-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-semibold
                           rounded-xl transition-all duration-200 shadow-[0_4px_14px_-3px_rgba(37,99,235,0.5)] hover:shadow-[0_6px_20px_-3px_rgba(37,99,235,0.6)] active:scale-[0.98]"
              >
                {loading ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : null}
                {loading ? 'Signing in…' : 'Sign in'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            {/* OR divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">OR</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            </div>

            {/* Demo section */}
            <div className="space-y-3">
              {/* Demo info */}
              <div className="p-3.5 bg-gradient-to-r from-blue-50/80 via-blue-50/60 to-indigo-50/40 border border-blue-100/50 rounded-xl shadow-inner shadow-blue-50">
                <p className="text-[11px] text-blue-700 font-bold flex items-center gap-1.5 uppercase tracking-wide">
                  <Shield size={11} /> Demo Mode Active
                </p>
                <p className="text-[12px] text-gray-500 mt-1.5 leading-relaxed">
                  Use <strong className="text-gray-700">any MOR email</strong> with password:{' '}
                  <code className="bg-white/80 px-1.5 py-0.5 rounded-md font-mono text-blue-600 font-semibold border border-blue-100/50 shadow-sm">password123</code>
                </p>
              </div>

              {/* Browse users */}
              <button
                onClick={() => setShowDirectory(true)}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3
                           bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300
                           text-gray-600 text-[13px] font-semibold rounded-xl transition-all duration-200 hover:shadow-sm"
              >
                <Users size={15} />
                Browse All Demo Users ({SEED_USERS.length})
              </button>

              {/* Quick access toggle */}
              <button
                onClick={() => setShowDemo(v => !v)}
                className="flex items-center justify-between w-full text-[11px] font-bold text-gray-400 hover:text-gray-600 transition-colors py-1 uppercase tracking-[0.08em]"
              >
                <span>Quick access</span>
                {showDemo ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              {/* Demo accounts list */}
              {showDemo && (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                  {DEMO_ACCOUNTS.map(u => (
                    <button
                      key={u.email}
                      onClick={() => fillDemo(u.email)}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl bg-gray-50/80 border border-gray-100
                                 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-gray-800">{u.label}</p>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-200 text-gray-500">
                          {u.role}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">{u.email}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick access links */}
          <div className="flex items-center justify-center gap-5 mt-7">
            {[
              { icon: HelpCircle, label: 'Help Center' },
              { icon: Activity, label: 'System Status' },
              { icon: FileText, label: 'Privacy Policy' },
              { icon: Mail, label: 'Contact Support' },
            ].map((link, i) => (
              <a key={i} href="#" className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-blue-600 transition-colors duration-200 group">
                <link.icon size={11} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                <span className="font-medium">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
