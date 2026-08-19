/**
 * Modern Enterprise Login Form
 * Professional audit system authentication
 * - Supports both MOR Identity API (direct credentials) and local mock mode
 * - MOR API mode: Email + Password login
 * - Local mode: Select from pre-loaded user list
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllUsers } from '../data/orgStructure';

// Feature flag: Use MOR Identity API or local mock data
const USE_MOR_IDENTITY_API = import.meta.env.VITE_USE_MOR_IDENTITY === 'true';

function LoginForm() {
  const { login, loading, error: authError } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [error, setError] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // For MOR API mode: email and password fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Local users (only used in non-API mode)
  const allUsers = USE_MOR_IDENTITY_API ? [] : getAllUsers();

  // Filter users based on search and role (local mode only)
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = !searchTerm || 
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !filterRole || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // Auto-select first user if list changes (local mode only)
  useEffect(() => {
    if (!USE_MOR_IDENTITY_API && filteredUsers.length > 0 && !selectedUser) {
      setSelectedUser(filteredUsers[0].id);
    } else if (filteredUsers.length === 0) {
      setSelectedUser(null);
    }
  }, [filteredUsers, selectedUser]);

  const handleSelectUser = (userId) => {
    setSelectedUser(userId);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (USE_MOR_IDENTITY_API) {
      // MOR Identity API mode: Use email and password
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
      } catch (err) {
        setError(err.message || 'Login failed');
      }
    } else {
      // Local mock mode: Use selected user
      if (!selectedUser) {
        setError('Please select a user');
        return;
      }

      try {
        const user = allUsers.find(u => u.id === selectedUser);
        if (!user) {
          setError('User not found');
          return;
        }

        // Pass user email with no password for mock mode
        await login(user.email, null);
      } catch (err) {
        setError(err.message || 'Login failed');
      }
    }
  };

  const currentUser = USE_MOR_IDENTITY_API ? null : allUsers.find(u => u.id === selectedUser);

  const getRoleLabel = (role) => {
    const labels = {
      'audit_team': '🏢 Audit Planning Team',
      'audit_director': '👔 Audit Director',
      'regional_director': '🗺️ Regional Director',
      'tax_center_manager': '🏛️ Tax Center Manager',
      'team_leader': '👥 Team Leader',
      'auditor': '🔍 Auditor',
      'senior_management': '🎖️ Senior Management'
    };
    return labels[role] || role;
  };

  // Get unique roles from filtered users (local mode only)
  const roles = [...new Set(filteredUsers.map(u => u.role))].sort();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a1428 0%, #1c2128 50%, #0f1419 100%)',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}
    >
      {/* Background Decoration */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(76, 175, 80, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* Main Card */}
      <div
        style={{
          background: 'rgba(28, 33, 40, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '48px',
          borderRadius: '16px',
          border: '1px solid rgba(48, 54, 61, 0.5)',
          width: '100%',
          maxWidth: '720px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(76, 175, 80, 0.2)'
            }}>
              <i className="fas fa-chart-line" style={{ fontSize: '28px', color: '#fff' }}></i>
            </div>
          </div>

          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '32px',
            fontWeight: '700',
            color: '#f0f6fc',
            letterSpacing: '-0.5px'
          }}>
            Audit Planning System
          </h1>

          <p style={{
            margin: '0 0 16px 0',
            fontSize: '14px',
            color: '#8b949e',
            fontWeight: '500'
          }}>
            Ministry of Revenue - Ethiopia
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: USE_MOR_IDENTITY_API 
              ? 'rgba(76, 175, 80, 0.1)'
              : 'rgba(76, 175, 80, 0.1)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#4caf50',
            fontWeight: '600'
          }}>
            <i className="fas fa-check-circle" style={{ fontSize: '12px' }}></i>
            {USE_MOR_IDENTITY_API ? '🔐 MOR Identity API' : `📋 ${allUsers.length} Users Loaded`}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {USE_MOR_IDENTITY_API ? (
            // ============ MOR Identity API Mode ============
            <>
              {/* Email Input */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#f0f6fc',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <i className="fas fa-envelope"></i> Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter your MOR email address"
                  style={{
                    width: '100%',
                    padding: '12px',
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

              {/* Password Input */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#f0f6fc',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <i className="fas fa-lock"></i> Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '12px',
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
                <div style={{
                  marginTop: '8px',
                  fontSize: '11px',
                  color: '#4caf50',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <i className="fas fa-server"></i>
                  <span>Authenticating with MOR Identity API</span>
                </div>
              </div>
            </>
          ) : (
            // ============ Local Mock Mode ============
            <>
              {/* Search Section */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#f0f6fc',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <i className="fas fa-search"></i> Find Your Account
                </label>

                <div style={{
                  position: 'relative',
                  marginBottom: '12px'
                }}>
                  <i className="fas fa-search" style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#8b949e',
                    fontSize: '13px',
                    pointerEvents: 'none'
                  }} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setError(null);
                    }}
                    placeholder="Search by name or email..."
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

                {/* Role Filter */}
                <select
                  value={filterRole}
                  onChange={(e) => {
                    setFilterRole(e.target.value);
                    setError(null);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #30363d',
                    borderRadius: '8px',
                    background: '#0f1419',
                    color: '#f0f6fc',
                    fontSize: '13px',
                    cursor: 'pointer',
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
                >
                  <option value="">All Roles ({filteredUsers.length})</option>
                  {roles.map(role => {
                    const count = filteredUsers.filter(u => u.role === role).length;
                    return (
                      <option key={role} value={role}>
                        {getRoleLabel(role)} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* User Selection */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#f0f6fc',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <i className="fas fa-user-circle"></i> Select User
                </label>

                <div style={{
                  maxHeight: '320px',
                  overflowY: 'auto',
                  border: '1px solid #30363d',
                  borderRadius: '8px',
                  background: '#0f1419',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
                }}>
                  {filteredUsers.length === 0 ? (
                    <div style={{
                      padding: '32px 20px',
                      textAlign: 'center',
                      color: '#8b949e',
                      fontSize: '13px'
                    }}>
                      <i className="fas fa-search" style={{ fontSize: '32px', marginBottom: '12px', display: 'block', opacity: 0.5 }}></i>
                      No users found
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleSelectUser(user.id)}
                        style={{
                          padding: '14px 16px',
                          cursor: 'pointer',
                          background: selectedUser === user.id
                            ? 'linear-gradient(90deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.05) 100%)'
                            : '#0f1419',
                          borderBottom: '1px solid #30363d',
                          borderLeft: selectedUser === user.id ? '3px solid #4caf50' : '3px solid transparent',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedUser !== user.id) {
                            e.currentTarget.style.background = 'rgba(76, 175, 80, 0.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedUser !== user.id) {
                            e.currentTarget.style.background = '#0f1419';
                          }
                        }}
                      >
                        {/* Avatar */}
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: selectedUser === user.id
                            ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                            : 'linear-gradient(135deg, #1f6feb 0%, #1a5fd1 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: '700',
                          flexShrink: 0,
                          boxShadow: selectedUser === user.id
                            ? '0 4px 12px rgba(76, 175, 80, 0.3)'
                            : '0 2px 8px rgba(0, 0, 0, 0.2)'
                        }}>
                          {(user.full_name || 'U').charAt(0).toUpperCase()}
                        </div>

                        {/* User Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#f0f6fc',
                            marginBottom: '4px'
                          }}>
                            {user.full_name}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#8b949e',
                            marginBottom: '4px'
                          }}>
                            {getRoleLabel(user.role)}
                          </div>
                          {user.org_context.assignedRegion && (
                            <div style={{
                              fontSize: '11px',
                              color: '#4caf50',
                              fontWeight: '500'
                            }}>
                              <i className="fas fa-map-marker-alt" style={{ marginRight: '4px' }}></i>
                              {user.org_context.assignedRegion}
                              {user.org_context.assignedTaxCenter && ` • ${user.org_context.assignedTaxCenter}`}
                            </div>
                          )}
                        </div>

                        {/* Selection Indicator */}
                        {selectedUser === user.id && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '24px',
                            height: '24px',
                            background: '#4caf50',
                            borderRadius: '50%',
                            flexShrink: 0
                          }}>
                            <i className="fas fa-check" style={{ color: '#fff', fontSize: '12px' }}></i>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Selected User Preview */}
              {currentUser && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#4caf50',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    <i className="fas fa-check-circle" style={{ marginRight: '6px' }}></i>
                    Ready to Sign In
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#f0f6fc',
                    marginBottom: '6px'
                  }}>
                    {currentUser.full_name}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#8b949e',
                    marginBottom: '8px'
                  }}>
                    {getRoleLabel(currentUser.role)}
                  </div>
                  {currentUser.org_context.assignedRegion && (
                    <div style={{
                      fontSize: '12px',
                      color: '#4caf50',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{currentUser.org_context.assignedRegion}</span>
                      {currentUser.org_context.assignedTaxCenter && (
                        <>
                          <span>•</span>
                          <span>{currentUser.org_context.assignedTaxCenter}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

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
              alignItems: 'center',
              gap: '10px'
            }}>
              <i className="fas fa-exclamation-circle" style={{ fontSize: '14px', flexShrink: 0 }}></i>
              <span>{authError || error}</span>
            </div>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading || (USE_MOR_IDENTITY_API ? !email : !selectedUser)}
            style={{
              width: '100%',
              padding: '14px',
              background: loading || (USE_MOR_IDENTITY_API ? !email : !selectedUser)
                ? '#555'
                : 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading || (USE_MOR_IDENTITY_API ? !email : !selectedUser) ? 'not-allowed' : 'pointer',
              opacity: loading || (USE_MOR_IDENTITY_API ? !email : !selectedUser) ? 0.6 : 1,
              transition: 'all 0.3s',
              boxShadow: loading || (USE_MOR_IDENTITY_API ? !email : !selectedUser)
                ? 'none'
                : '0 8px 24px rgba(76, 175, 80, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              if (!loading && (USE_MOR_IDENTITY_API ? email : selectedUser)) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 32px rgba(76, 175, 80, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && (USE_MOR_IDENTITY_API ? email : selectedUser)) {
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
                Sign In Securely
              </>
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div style={{
          marginTop: '28px',
          padding: '16px',
          background: 'rgba(28, 33, 40, 0.5)',
          border: '1px solid rgba(48, 54, 61, 0.5)',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#8b949e'
        }}>
          <div style={{
            fontWeight: '600',
            color: '#f0f6fc',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <i className="fas fa-info-circle"></i>
            {USE_MOR_IDENTITY_API ? 'MOR Identity API' : 'Auto-Loaded Organization Context'}
          </div>
          <p style={{ margin: 0, lineHeight: '1.5', fontSize: '11px' }}>
            {USE_MOR_IDENTITY_API 
              ? 'Authenticating with the MOR Identity API. Enter your official MOR credentials to sign in.'
              : 'Your region, tax center, and organizational context are automatically loaded from your user profile. Simply select your account and sign in.'}
          </p>
        </div>

        {/* Mode Indicator */}
        {!USE_MOR_IDENTITY_API && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(76, 175, 80, 0.05)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
            borderRadius: '6px',
            textAlign: 'center',
            fontSize: '11px',
            color: '#4caf50',
            fontWeight: '600'
          }}>
            <i className="fas fa-database"></i> Local Demo Mode - Using mock data
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginForm;
