/**
 * MOR Identity API Login Page
 * Modern, professional authentication interface
 * - Clean, minimalist design
 * - Full MOR Identity API integration
 * - Real user authentication with email + password
 * - Responsive and accessible
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const USE_MOR_IDENTITY_API = import.meta.env.VITE_USE_MOR_IDENTITY === 'true';

function MORLoginPage() {
  const { login, loading, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load remembered email if exists
  useEffect(() => {
    const savedEmail = localStorage.getItem('mor_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    try {
      await login(email, password);
      
      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem('mor_remembered_email', email);
      } else {
        localStorage.removeItem('mor_remembered_email');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a1428 0%, #1c2128 50%, #0f1419 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}
    >
      {/* Background Animation */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(76, 175, 80, 0.15) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* Left Side - Info Panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '60px 40px',
        color: '#f0f6fc',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo & Branding */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)'
            }}>
              <i className="fas fa-chart-line" style={{ fontSize: '24px', color: '#fff' }}></i>
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>
                Audit Planning
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#8b949e' }}>
                Ministry of Revenue
              </p>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '24px',
            color: '#f0f6fc'
          }}>
            Why Choose Our System
          </h3>

          {[
            { icon: 'fas fa-shield-alt', title: 'Secure Authentication', desc: 'Enterprise-grade security with MOR Identity API' },
            { icon: 'fas fa-tachometer-alt', title: 'Fast & Efficient', desc: 'Streamlined audit planning and case management' },
            { icon: 'fas fa-network-wired', title: 'Integrated', desc: 'Seamless integration with your organization' },
            { icon: 'fas fa-chart-bar', title: 'Analytics', desc: 'Real-time audit metrics and reporting' }
          ].map((feature, idx) => (
            <div key={idx} style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                minWidth: '40px',
                background: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4caf50'
              }}>
                <i className={feature.icon}></i>
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#f0f6fc', marginBottom: '4px' }}>
                  {feature.title}
                </div>
                <div style={{ fontSize: '12px', color: '#8b949e' }}>
                  {feature.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '40px',
          borderTop: '1px solid rgba(76, 175, 80, 0.2)',
          fontSize: '12px',
          color: '#8b949e'
        }}>
          <p style={{ margin: 0, marginBottom: '8px' }}>
            <i className="fas fa-lock" style={{ marginRight: '8px' }}></i>
            All data is encrypted and secure
          </p>
          <p style={{ margin: '0 0 0 0' }}>
            <i className="fas fa-globe" style={{ marginRight: '8px' }}></i>
            Connected via MOR Identity API
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px'
        }}>
          {/* Card */}
          <div style={{
            background: 'rgba(28, 33, 40, 0.95)',
            backdropFilter: 'blur(10px)',
            padding: '48px 40px',
            borderRadius: '16px',
            border: '1px solid rgba(48, 54, 61, 0.5)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          }}>
            {/* Header */}
            <div style={{ marginBottom: '36px', textAlign: 'center' }}>
              <h1 style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: '700',
                color: '#f0f6fc',
                marginBottom: '12px'
              }}>
                Sign In
              </h1>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#8b949e'
              }}>
                {USE_MOR_IDENTITY_API
                  ? 'Enter your MOR credentials to continue'
                  : 'Select your account to continue'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin}>
              {/* Email Field */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#f0f6fc',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Email Address
                </label>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <i className="fas fa-envelope" style={{
                    position: 'absolute',
                    left: '12px',
                    color: '#8b949e',
                    fontSize: '14px'
                  }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="you@mor.gov.et"
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      border: '1px solid #30363d',
                      borderRadius: '8px',
                      background: '#0f1419',
                      color: '#f0f6fc',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#4caf50';
                      e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#30363d';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <label style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#f0f6fc',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4caf50',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#45a049'}
                    onMouseLeave={(e) => e.target.style.color = '#4caf50'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <i className="fas fa-lock" style={{
                    position: 'absolute',
                    left: '12px',
                    color: '#8b949e',
                    fontSize: '14px'
                  }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Your password"
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      border: '1px solid #30363d',
                      borderRadius: '8px',
                      background: '#0f1419',
                      color: '#f0f6fc',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#4caf50';
                      e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#30363d';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '28px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer',
                    accentColor: '#4caf50'
                  }}
                />
                <label htmlFor="rememberMe" style={{
                  fontSize: '13px',
                  color: '#8b949e',
                  cursor: 'pointer'
                }}>
                  Remember my email
                </label>
              </div>

              {/* Error Message */}
              {(authError || error) && (
                <div style={{
                  background: 'rgba(218, 54, 51, 0.1)',
                  border: '1px solid rgba(218, 54, 51, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '24px',
                  fontSize: '13px',
                  color: '#ff7b7b',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                  <i className="fas fa-exclamation-circle" style={{
                    fontSize: '14px',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}></i>
                  <span>{authError || error}</span>
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: loading || !email || !password
                    ? '#444'
                    : 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
                  opacity: loading || !email || !password ? 0.6 : 1,
                  transition: 'all 0.3s',
                  boxShadow: loading || !email || !password
                    ? 'none'
                    : '0 8px 24px rgba(76, 175, 80, 0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  if (!loading && email && password) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 32px rgba(76, 175, 80, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && email && password) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 24px rgba(76, 175, 80, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                    Signing In...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt" style={{ marginRight: '8px' }}></i>
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '28px 0',
              color: '#8b949e'
            }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(48, 54, 61, 0.5)' }} />
              <span style={{ fontSize: '12px' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(48, 54, 61, 0.5)' }} />
            </div>

            {/* Footer Links */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '13px'
            }}>
              <a href="#" style={{
                color: '#4caf50',
                textDecoration: 'none',
                textAlign: 'center',
                fontWeight: '600',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#45a049'}
              onMouseLeave={(e) => e.target.style.color = '#4caf50'}
              >
                Forgot your password?
              </a>
              <div style={{
                textAlign: 'center',
                color: '#8b949e'
              }}>
                Need help?{' '}
                <a href="#" style={{
                  color: '#4caf50',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#45a049'}
                onMouseLeave={(e) => e.target.style.color = '#4caf50'}
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div style={{
            marginTop: '24px',
            padding: '12px 16px',
            background: 'rgba(28, 33, 40, 0.5)',
            border: '1px solid rgba(48, 54, 61, 0.5)',
            borderRadius: '8px',
            fontSize: '11px',
            color: '#8b949e',
            textAlign: 'center'
          }}>
            <i className="fas fa-shield-alt" style={{ marginRight: '6px' }}></i>
            Your login is protected by MOR Identity API
          </div>
        </div>
      </div>
    </div>
  );
}

export default MORLoginPage;
