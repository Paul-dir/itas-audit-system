/**
 * Welcome Screen - Beautiful Intro to Audit Planning System
 * Full-screen immersive experience with animations
 * Shows professional branding and system overview
 */

import React, { useState, useEffect } from 'react';

function WelcomeScreen({ onContinue }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: '📊',
      title: 'Smart Planning',
      description: 'Intelligent audit plan allocation based on risk and capacity'
    },
    {
      icon: '🎯',
      title: 'Precision Targeting',
      description: 'Advanced risk engine identifies high-impact audit opportunities'
    },
    {
      icon: '👥',
      title: 'Team Coordination',
      description: 'Seamless collaboration across regions and tax centers'
    },
    {
      icon: '⚡',
      title: 'Real-time Analytics',
      description: 'Live dashboards track progress and performance metrics'
    }
  ];

  const stats = [
    { number: '121', label: 'Users Loaded', icon: '👤' },
    { number: '9', label: 'Role Types', icon: '👔' },
    { number: '5', label: 'Regions', icon: '🗺️' },
    { number: '15', label: 'Tax Centers', icon: '🏛️' }
  ];

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: 'linear-gradient(135deg, #0a1428 0%, #1c2128 50%, #0f1419 100%)',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0
      }}>
        {/* Gradient Orbs */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(76, 175, 80, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: isAnimating ? 'float 8s ease-in-out infinite' : 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          right: '-30%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(31, 111, 235, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: isAnimating ? 'float 10s ease-in-out infinite reverse' : 'none'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(76, 175, 80, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: isAnimating ? 'float 12s ease-in-out infinite' : 'none'
        }} />

        <style>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(50px, -50px); }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}</style>
      </div>

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px 40px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Top Section - Logo & Title */}
        <div style={{
          textAlign: 'center',
          animation: showContent ? 'fadeInUp 0.8s ease-out' : 'none'
        }}>
          {/* Logo */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(76, 175, 80, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            marginBottom: '32px',
            margin: '0 auto 32px'
          }}>
            <i className="fas fa-chart-line" style={{
              fontSize: '56px',
              color: '#fff',
              animation: showContent ? 'pulse 2s ease-in-out infinite' : 'none'
            }}></i>
          </div>

          {/* Welcome Text */}
          <h1 style={{
            fontSize: '56px',
            fontWeight: '800',
            margin: '0 0 16px 0',
            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-1px'
          }}>
            Welcome to Audit Planning System
          </h1>

          <p style={{
            fontSize: '20px',
            color: '#8b949e',
            margin: '0 0 12px 0',
            fontWeight: '400'
          }}>
            Revolutionizing Tax Audit Management
          </p>

          <p style={{
            fontSize: '14px',
            color: '#666',
            margin: 0,
            maxWidth: '600px',
            lineHeight: '1.6'
          }}>
            Ministry of Revenue - Ethiopia | Advanced Compliance & Risk Management Platform
          </p>
        </div>

        {/* Middle Section - Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          margin: '60px 0',
          animation: showContent ? 'fadeIn 1s ease-out 0.2s both' : 'none'
        }}>
          {features.map((feature, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(28, 33, 40, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(76, 175, 80, 0.2)',
                borderRadius: '16px',
                padding: '28px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                animation: showContent ? `slideInRight 0.6s ease-out ${0.3 + idx * 0.1}s both` : 'none',
                ':hover': {
                  borderColor: 'rgba(76, 175, 80, 0.5)',
                  background: 'rgba(28, 33, 40, 0.95)'
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(76, 175, 80, 0.5)';
                e.currentTarget.style.background = 'rgba(28, 33, 40, 0.95)';
                e.currentTarget.style.transform = 'translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(76, 175, 80, 0.2)';
                e.currentTarget.style.background = 'rgba(28, 33, 40, 0.8)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                fontSize: '40px',
                marginBottom: '12px',
                animation: showContent ? 'pulse 2s ease-in-out infinite' : 'none'
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#f0f6fc',
                margin: '0 0 8px 0'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#8b949e',
                margin: 0,
                lineHeight: '1.5'
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
          animation: showContent ? 'fadeIn 1s ease-out 0.4s both' : 'none'
        }}>
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
                border: '1px solid rgba(76, 175, 80, 0.2)',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center'
              }}
            >
              <div style={{
                fontSize: '32px',
                marginBottom: '8px'
              }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#4caf50',
                marginBottom: '4px'
              }}>
                {stat.number}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#8b949e',
                fontWeight: '500'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button Section */}
        <div style={{
          textAlign: 'center',
          animation: showContent ? 'fadeInUp 0.8s ease-out 0.6s both' : 'none'
        }}>
          <button
            onClick={onContinue}
            style={{
              padding: '18px 48px',
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 12px 32px rgba(76, 175, 80, 0.4)',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 16px 40px rgba(76, 175, 80, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 12px 32px rgba(76, 175, 80, 0.4)';
            }}
          >
            <span>Continue to Login</span>
            <i className="fas fa-arrow-right" style={{ fontSize: '14px' }}></i>
          </button>

          <p style={{
            marginTop: '24px',
            fontSize: '12px',
            color: '#8b949e'
          }}>
            Press any key or click button to continue
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(15, 20, 25, 0.8)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(48, 54, 61, 0.5)',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: '#8b949e'
      }}>
        <div>
          © 2025 Ministry of Revenue - Ethiopia. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="#privacy" style={{ color: '#8b949e', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = '#4caf50'}
            onMouseLeave={(e) => e.target.style.color = '#8b949e'}
          >
            Privacy Policy
          </a>
          <a href="#terms" style={{ color: '#8b949e', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = '#4caf50'}
            onMouseLeave={(e) => e.target.style.color = '#8b949e'}
          >
            Terms of Service
          </a>
          <a href="#support" style={{ color: '#8b949e', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = '#4caf50'}
            onMouseLeave={(e) => e.target.style.color = '#8b949e'}
          >
            Support
          </a>
        </div>
      </div>

      {/* Keyboard Handler */}
      {typeof window !== 'undefined' && (
        <div style={{ display: 'none' }}>
          {(() => {
            if (typeof window !== 'undefined') {
              window.addEventListener('keydown', (e) => {
                if (e.key && showContent) {
                  onContinue();
                }
              });
            }
            return null;
          })()}
        </div>
      )}
    </div>
  );
}

export default WelcomeScreen;
