import { useState } from 'react';
import { Eye, EyeOff, ChevronDown, ChevronUp, Users, Shield, Lock, ArrowRight, HelpCircle, Activity, FileText, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext.jsx';
import UserDirectory from '../components/UserDirectory.jsx';
import { SEED_USERS } from '../data/seed.js';

const DEMO_ACCOUNTS = [
  { label: 'Planning Team',               email: 'planning.auditor1@mor.gov.et',        role: 'Audit Planning Team'   },
  { label: 'Audit Director',              email: 'tesfaye.bekele@mor.gov.et',           role: 'Audit Director'        },
  { label: 'Senior Management',           email: 'rahel.hailu@mor.gov.et',              role: 'Senior Management'     },
  { label: 'Regional Director (Addis)',   email: 'getnet.alemu@mor.gov.et',             role: 'Regional Director'     },
  { label: 'Regional Director (Oromia)',  email: 'gemechu.negash@mor.gov.et',           role: 'Regional Director'     },
  { label: 'Audit Requester (Tax Clearance)', email: 'clearance.officer@mor.gov.et', role: 'Audit Requester' },
  { label: 'Audit Requester (Business Closure)', email: 'closure.directorate@mor.gov.et', role: 'Audit Requester' },
  { label: 'Audit Requester (Fraud & Intel)', email: 'fraud.intel@mor.gov.et', role: 'Audit Requester' },
  { label: 'Audit Requester (Ministry of Trade)', email: 'external.motri@gov.et', role: 'Audit Requester' },
  { label: 'Tax Center Manager (AA-TC1)', email: 'mekdes.solomon@mor.gov.et',           role: 'Tax Center Manager'    },
  { label: 'Tax Center Manager (AA-TC2)', email: 'dereje.worku@mor.gov.et',             role: 'Tax Center Manager'    },
  { label: 'Team Leader',                 email: 'henok.belay@mor.gov.et',              role: 'Team Leader'           },
  { label: 'Auditor',                     email: 'kidist.mehari@mor.gov.et',            role: 'Auditor'               },
  { label: 'Committee Chair (Joint)',     email: 'aa.committee1@mor.gov.et',             role: 'Committee'             },
  { label: 'Committee Chair (TP)',        email: 'tp.committee1@mor.gov.et',             role: 'Committee'             },
  { label: 'Committee Member (AA-2)',     email: 'aa-ara.joint_committee.2@mor.gov.et',  role: 'Committee'             },
  { label: 'Committee Member (AA-3)',     email: 'aa-ara.joint_committee.3@mor.gov.et',  role: 'Committee'             },
  { label: 'Committee Member (AA-4)',     email: 'aa-ara.joint_committee.4@mor.gov.et',  role: 'Committee'             },
  { label: 'Committee Member (AA-5)',     email: 'aa-ara.joint_committee.5@mor.gov.et',  role: 'Committee'             },
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
    <div className="h-screen w-screen overflow-hidden flex">
      {showDirectory && (
        <UserDirectory
          onSelectUser={fillDemo}
          onClose={() => setShowDirectory(false)}
        />
      )}

      {/* ═══ LEFT PANEL — Royal Blue Brand Section ═══ */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-[#1e40af] text-white p-8 lg:p-12 flex-col justify-between h-full">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Header Logo & Title */}
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

        {/* Center Content */}
        <div className="relative z-10 space-y-4 max-w-xl my-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200/80">MINISTRY OF REVENUE - ITAS</p>
          <h2 className="text-[2.25rem] lg:text-[2.75rem] font-extrabold leading-[1.1] tracking-tight text-white">
            Tax administration, operated with clarity.
          </h2>
          <p className="text-blue-100/80 text-[14px] leading-relaxed max-w-lg">
            Sign in to access the back-office suite — registration, workflow tasks, and tax-type administration in one secure console.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-2 text-blue-200/70 text-xs">
          <Lock size={13} />
          <span>Authorized personnel only.</span>
        </div>
      </div>

      {/* ═══ RIGHT PANEL — Dark Theme Login Form ═══ */}
      <div className="w-full md:w-1/2 h-full bg-[#050505] flex items-center justify-center p-6 lg:p-8 text-white overflow-y-auto">
        <div className="w-full max-w-[380px] space-y-4 my-auto">
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-[2.2rem] font-bold tracking-tight text-white">Welcome back</h2>
            <p className="text-sm text-gray-400">Sign in to continue to the ITAS Back-office.</p>
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
                  className="w-full pl-10 pr-4 py-3 bg-[#111827] border border-gray-800 text-white placeholder-gray-500 text-[13px]
                             rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
                             transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em]">
                  Password
                </label>
                <button type="button" className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-3 bg-[#111827] border border-gray-800 text-white placeholder-gray-500 text-[13px]
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

            {/* Error */}
            {error && (
              <div className="text-sm text-red-400 bg-red-950/40 border border-red-800/60 rounded-xl px-4 py-3 flex items-center gap-2">
                <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-[14px] font-semibold rounded-xl transition-all duration-200"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Demo section */}
          <div className="space-y-3 pt-4 border-t border-gray-900">
            {/* Demo info */}
            <div className="p-3.5 bg-[#0f172a]/60 border border-slate-800 rounded-xl">
              <p className="text-[11px] text-blue-400 font-bold flex items-center gap-1.5 uppercase tracking-wide">
                <Shield size={11} /> Demo Mode Active
              </p>
              <p className="text-[12px] text-gray-400 mt-1">
                Use <strong className="text-gray-200">any MOR email</strong> with password:{' '}
                <code className="bg-slate-800 px-1.5 py-0.5 rounded-md font-mono text-blue-300 font-semibold">password123</code>
              </p>
            </div>

            {/* Browse users */}
            <button
              onClick={() => setShowDirectory(true)}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3
                         bg-[#111827] hover:bg-[#1f2937] border border-gray-800
                         text-gray-300 text-[13px] font-semibold rounded-xl transition-all duration-200"
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
