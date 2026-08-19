import { useState } from 'react';
import { Eye, EyeOff, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import UserDirectory from '../components/UserDirectory.jsx';
import { SEED_USERS } from '../data/seed.js';

const DEMO_ACCOUNTS = [
  { label: 'Planning Team',               email: 'planning.auditor1@mor.gov.et',  role: 'Audit Planning Team'   },
  { label: 'Audit Director',              email: 'tesfaye.bekele@mor.gov.et',     role: 'Audit Director'        },
  { label: 'Senior Management',           email: 'rahel.hailu@mor.gov.et',        role: 'Senior Management'     },
  { label: 'Regional Director (Addis)',   email: 'getnet.alemu@mor.gov.et',       role: 'Regional Director'     },
  { label: 'Regional Director (Oromia)',  email: 'gemechu.negash@mor.gov.et',     role: 'Regional Director'     },
  { label: 'Tax Center Manager (AA-TC1)', email: 'mekdes.solomon@mor.gov.et',     role: 'Tax Center Manager'    },
  { label: 'Tax Center Manager (AA-TC2)', email: 'dereje.worku@mor.gov.et',       role: 'Tax Center Manager'    },
  { label: 'Team Leader',                 email: 'henok.belay@mor.gov.et',        role: 'Team Leader'           },
  { label: 'Auditor',                     email: 'kidist.mehari@mor.gov.et',      role: 'Auditor'               },
];

export default function Login() {
  console.log("Login component mounted");
  const { login } = useAuth();
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [showDemo, setShowDemo]   = useState(false);
  const [showDirectory, setShowDirectory] = useState(false);

  const handleSubmit = async (e) => {
    console.log("Sign in button clicked");
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

  const fillDemo = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
    setShowDemo(false);
    setShowDirectory(false);
    setLoading(true);
    try {
      await login(demoEmail, 'password123');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* User Directory Modal */}
      {showDirectory && (
        <UserDirectory 
          onSelectUser={fillDemo} 
          onClose={() => setShowDirectory(false)} 
        />
      )}

      {/* Left Panel - Blue branded section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '40px 40px' 
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <img
                src="/mor-logo.jpeg"
                alt="MOR"
                className="w-full h-full object-cover"
                onError={e => { 
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div 
                className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 items-center justify-center text-white font-bold text-lg hidden"
              >
                MOR
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold">ITAS Back-office</h1>
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-blue-300 font-semibold mb-2">
                MINISTRY OF REVENUE - ITAS
              </p>
              <h2 className="text-4xl font-bold leading-tight mb-4">
                Tax administration, operated with clarity.
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Sign in to access the back-office suite — registration, workflow tasks,
                and tax-type administration in one secure console.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 text-blue-300 text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Authorized personnel only.</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Dark login form */}
      <div className="w-full lg:w-1/2 bg-black flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo - shown only on small screens */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-blue-600 flex items-center justify-center">
              <img
                src="/mor-logo.jpeg"
                alt="MOR"
                className="w-full h-full object-cover"
                onError={e => { 
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <span className="text-white font-bold text-sm hidden">MOR</span>
            </div>
            <span className="text-white text-lg font-bold">ITAS Back-office</span>
          </div>

          {/* Form content */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
              <p className="text-gray-400 text-sm">
                Sign in to continue to the ITAS Back-office.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Username/Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 text-sm
                               rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 text-sm
                               rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-4 py-3 whitespace-pre-line">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-blue-600
                           hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold
                           rounded-lg transition-all shadow-lg shadow-blue-900/50"
              >
                {loading ? (
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : null}
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            {/* Demo section */}
            <div className="pt-6 border-t border-gray-800">
              {/* Demo info */}
              <div className="mb-4 p-3 bg-blue-950/30 border border-blue-900/50 rounded-lg">
                <p className="text-xs text-blue-300 font-medium mb-1">🎭 Demo Mode Active</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Use <strong className="text-white">any MOR email</strong> with password:{' '}
                  <code className="bg-gray-800 px-1.5 py-0.5 rounded font-mono text-blue-400 font-semibold">password123</code>
                </p>
              </div>

              {/* Browse users button */}
              <button
                onClick={() => setShowDirectory(true)}
                className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-2.5 
                           bg-gray-800 hover:bg-gray-700 border border-gray-700
                           text-gray-300 text-sm font-medium rounded-lg transition-all"
              >
                <Users size={16} />
                Browse All Demo Users ({SEED_USERS.length})
              </button>

              {/* Quick access toggle */}
              <button
                onClick={() => setShowDemo(v => !v)}
                className="flex items-center justify-between w-full text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                <span className="font-medium">Quick access demo accounts</span>
                {showDemo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {/* Demo accounts list */}
              {showDemo && (
                <div className="mt-3 space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {DEMO_ACCOUNTS.map(u => (
                    <button
                      key={u.email}
                      onClick={() => fillDemo(u.email)}
                      className="w-full text-left px-3 py-2.5 rounded-lg bg-gray-900/50 border border-gray-800
                                 hover:bg-gray-800 hover:border-gray-700 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-white">{u.label}</p>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                          {u.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{u.email}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
