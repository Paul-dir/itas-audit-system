import React, { useState } from 'react';
import { auditConfig } from '../../config/auditConfig';
import Card from '../Card';
import Badge from '../Badge';

function ConfigurationManagementView() {
  const [activeTab, setActiveTab] = useState('audit-types');
  const [editingItem, setEditingItem] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // ========== TAB 1: AUDIT TYPES ==========
  const renderAuditTypes = () => (
    <div className="space-y-8">
      {/* Header with white accents and glow */}
      <div className="relative p-7 bg-gradient-to-r from-primary-900/40 via-primary-800/30 to-primary-900/40 border-2 border-white/40 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-white/30 transition-all">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-2 h-10 bg-gradient-to-b from-white via-primary-300 to-primary-600 rounded-full shadow-xl shadow-white/40 animate-pulse"></div>
            <h2 className="text-3xl font-serif font-bold text-white drop-shadow-lg">Audit Types Configuration</h2>
            <i className="fas fa-tasks text-white text-2xl ml-auto drop-shadow animate-bounce"></i>
          </div>
          <p className="text-white/80 font-medium ml-6 drop-shadow">Configure the audit types available in your organization. Edit effort per case, skills required, and complexity levels.</p>
        </div>
      </div>

      {/* Audit Types Cards Grid - COLORFUL & VIBRANT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auditConfig.auditTypes.map((type, idx) => {
          // Rotating rainbow gradient colors
          const gradientColors = [
            'from-primary-600 to-primary-500',
            'from-info-600 to-info-500',
            'from-success-600 to-success-500',
            'from-warning-600 to-warning-500',
            'from-danger-600 to-danger-500',
            'from-purple-600 to-purple-500'
          ];
          const borderColors = [
            'border-primary-400',
            'border-info-400',
            'border-success-400',
            'border-warning-400',
            'border-danger-400',
            'border-purple-400'
          ];
          const accentColors = [
            'from-primary-600 to-primary-700',
            'from-info-600 to-info-700',
            'from-success-600 to-success-700',
            'from-warning-600 to-warning-700',
            'from-danger-600 to-danger-700',
            'from-purple-600 to-purple-700'
          ];
          const gradColor = gradientColors[idx % gradientColors.length];
          const borderColor = borderColors[idx % borderColors.length];
          const accentColor = accentColors[idx % accentColors.length];

          return (
            <div 
              key={idx} 
              className={`relative bg-gradient-to-br ${gradColor} border-2 border-l-4 ${borderColor} rounded-2xl p-7 shadow-xl hover:shadow-2xl hover:shadow-white/50 transform hover:scale-105 transition-all duration-300 group overflow-hidden`}
            >
              {/* Glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              
              <div className="relative z-10">
                {/* Header with icon */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-1">{type.name}</h3>
                    <p className="text-white/90 text-sm drop-shadow">{type.description}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/40 shadow-lg">
                    <i className="fas fa-clipboard-check text-white text-xl drop-shadow"></i>
                  </div>
                </div>

                {/* Effort Section */}
                <div className="mb-6 bg-white/10 border border-white/30 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-xs uppercase font-semibold text-white/80 tracking-wider mb-2 drop-shadow flex items-center gap-2">
                    <i className="fas fa-hourglass-end text-white/90"></i>Effort Per Case
                  </div>
                  <div className="text-4xl font-bold text-white drop-shadow-lg">{type.effortPerCase}h</div>
                </div>

                {/* Complexity Badge */}
                <div className="mb-6">
                  <div className="text-xs uppercase font-semibold text-white/80 tracking-wider mb-2 drop-shadow flex items-center gap-2">
                    <i className="fas fa-chart-line text-white/90"></i>Complexity
                  </div>
                  <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold text-white drop-shadow-lg border-2 border-white/60 backdrop-blur-sm ${
                    type.complexity === 'Very High' ? 'bg-gradient-to-r from-danger-500/40 to-danger-600/40 shadow-lg shadow-danger-500/50' 
                    : type.complexity === 'High' ? 'bg-gradient-to-r from-warning-500/40 to-warning-600/40 shadow-lg shadow-warning-500/50'
                    : 'bg-gradient-to-r from-success-500/40 to-success-600/40 shadow-lg shadow-success-500/50'
                  }`}>
                    {type.complexity}
                  </span>
                </div>

                {/* Skills Required */}
                <div className="mb-6">
                  <div className="text-xs uppercase font-semibold text-white/80 tracking-wider mb-3 drop-shadow flex items-center gap-2">
                    <i className="fas fa-star text-white/90"></i>Required Skills
                  </div>
                  <div className="space-y-2">
                    {type.skillsRequired.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 text-white/90 drop-shadow">
                        <div className="w-2 h-2 rounded-full bg-white/80"></div>
                        <span className="text-sm font-medium">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit Button */}
                <button 
                  className="w-full px-4 py-3 bg-gradient-to-r from-white/20 via-white/15 to-white/20 hover:from-white/30 hover:via-white/25 hover:to-white/30 text-white font-bold rounded-lg transition-all border border-white/40 hover:border-white/60 hover:shadow-lg hover:shadow-white/40 flex items-center justify-center gap-2 drop-shadow transform hover:scale-105"
                  onClick={() => { setEditingItem({...type, type: 'auditType'}); setShowDetails(true); }}
                >
                  <i className="fas fa-edit text-lg"></i>Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ========== TAB 2: SKILLS ==========
  const renderSkills = () => (
    <div className="space-y-8">
      {/* Header with white accents */}
      <div className="relative p-7 bg-gradient-to-r from-info-900/40 via-info-800/30 to-info-900/40 border-2 border-white/40 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-white/30 transition-all">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-2 h-10 bg-gradient-to-b from-white via-info-300 to-info-600 rounded-full shadow-xl shadow-white/40 animate-pulse"></div>
            <h2 className="text-3xl font-serif font-bold text-white drop-shadow-lg">Skills Configuration</h2>
            <i className="fas fa-user-cog text-white text-2xl ml-auto drop-shadow animate-spin" style={{animationDuration: '3s'}}></i>
          </div>
          <p className="text-white/80 font-medium ml-6 drop-shadow">Define skill types, expertise levels, and skill-to-audit-type mapping.</p>
        </div>
      </div>

      {/* Skills Grid - RAINBOW GRADIENTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auditConfig.skills.map((skill, idx) => {
          // Rainbow gradient colors for skills
          const rainbowGradients = [
            'from-primary-600 to-primary-500',
            'from-info-600 to-cyan-500',
            'from-success-600 to-emerald-500',
            'from-warning-600 to-amber-500',
            'from-danger-600 to-red-500',
            'from-purple-600 to-violet-500'
          ];
          const borderColors = ['border-primary-400', 'border-info-400', 'border-success-400', 'border-warning-400', 'border-danger-400', 'border-purple-400'];
          const badgeGradients = ['from-primary-700 to-primary-600', 'from-info-700 to-info-600', 'from-success-700 to-success-600', 'from-warning-700 to-warning-600', 'from-danger-700 to-danger-600', 'from-purple-700 to-purple-600'];
          
          const gradColor = rainbowGradients[idx % rainbowGradients.length];
          const borderColor = borderColors[idx % borderColors.length];
          const badgeGradient = badgeGradients[idx % badgeGradients.length];

          return (
            <div 
              key={idx}
              className={`relative bg-gradient-to-br ${gradColor} border-2 border-l-4 ${borderColor} rounded-2xl p-7 shadow-xl hover:shadow-2xl hover:shadow-white/50 transform hover:scale-110 transition-all duration-300 group overflow-hidden`}
            >
              {/* Glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-1">{skill.name}</h3>
                    <p className="text-white/90 text-sm drop-shadow">Expertise level and specialization</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/40 shadow-lg animate-pulse">
                    <i className="fas fa-graduation-cap text-white text-xl drop-shadow"></i>
                  </div>
                </div>

                {/* Level Badge with Pulse */}
                <div className="mb-6">
                  <div className="text-xs uppercase font-semibold text-white/80 tracking-wider mb-3 drop-shadow">Level</div>
                  <span className={`inline-block px-5 py-2 rounded-lg text-lg font-bold text-white drop-shadow-lg border-2 border-white/60 bg-gradient-to-r ${badgeGradient} backdrop-blur-sm shadow-lg shadow-current/50 animate-pulse`}>
                    Level {skill.level}
                  </span>
                </div>

                {/* Category Tag */}
                <div className="mb-6">
                  <div className="text-xs uppercase font-semibold text-white/80 tracking-wider mb-3 drop-shadow">Category</div>
                  <span className="inline-block px-4 py-2 rounded-lg text-sm font-bold text-white bg-white/15 border-2 border-white/40 backdrop-blur-sm drop-shadow-lg">
                    <i className="fas fa-tag text-white/90 mr-2"></i>{skill.category}
                  </span>
                </div>

                {/* Edit Button */}
                <button 
                  className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition-all border border-white/40 hover:border-white/60 hover:shadow-lg hover:shadow-white/40 flex items-center justify-center gap-2 drop-shadow transform hover:scale-105"
                  onClick={() => { setEditingItem({...skill, type: 'skill'}); setShowDetails(true); }}
                >
                  <i className="fas fa-edit text-lg"></i>Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ========== TAB 3: RISK LEVELS ==========
  const renderRiskLevels = () => (
    <div className="space-y-8">
      {/* Header with white accents */}
      <div className="relative p-7 bg-gradient-to-r from-warning-900/40 via-warning-800/30 to-warning-900/40 border-2 border-white/40 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-white/30 transition-all">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-2 h-10 bg-gradient-to-b from-white via-warning-300 to-warning-600 rounded-full shadow-xl shadow-white/40 animate-pulse"></div>
            <h2 className="text-3xl font-serif font-bold text-white drop-shadow-lg">Risk Levels Configuration</h2>
            <i className="fas fa-traffic-light text-white text-2xl ml-auto drop-shadow animate-bounce"></i>
          </div>
          <p className="text-white/80 font-medium ml-6 drop-shadow">Define risk score ranges, colors, and risk level labels.</p>
        </div>
      </div>

      {/* Risk Level Cards - COLORFUL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(auditConfig.riskLevels).map(([key, level], idx) => {
          // Different colors for each risk level
          const riskColors = [
            { gradient: 'from-success-600 to-success-500', border: 'border-success-400', icon: 'fa-shield-alt', emoji: '✅' },
            { gradient: 'from-info-600 to-info-500', border: 'border-info-400', icon: 'fa-eye', emoji: '👀' },
            { gradient: 'from-warning-600 to-warning-500', border: 'border-warning-400', icon: 'fa-exclamation-triangle', emoji: '⚠️' },
            { gradient: 'from-danger-600 to-danger-500', border: 'border-danger-400', icon: 'fa-flame', emoji: '🔥' }
          ];
          const colors = riskColors[idx];

          return (
            <div 
              key={key}
              className={`relative bg-gradient-to-br ${colors.gradient} border-2 border-l-4 ${colors.border} rounded-2xl p-7 shadow-xl hover:shadow-2xl hover:shadow-white/50 transform hover:scale-110 transition-all duration-300 group overflow-hidden`}
            >
              {/* Pulsing glow background */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl animate-pulse"></div>
              
              <div className="relative z-10">
                {/* Header with Icon */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white drop-shadow-lg">{level.label}</h3>
                  <div className="text-4xl drop-shadow animate-bounce">{colors.emoji}</div>
                </div>

                {/* Score Range - Large & Bold */}
                <div className="bg-white/15 border border-white/40 rounded-lg p-5 backdrop-blur-sm mb-6">
                  <div className="text-xs uppercase font-semibold text-white/80 tracking-wider mb-3 drop-shadow">Score Range</div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-white drop-shadow-lg">{level.min}</span>
                    <span className="text-white/90 font-semibold drop-shadow">–</span>
                    <span className="text-4xl font-bold text-white drop-shadow-lg">{level.max}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/90 text-sm mb-6 drop-shadow">{level.label} Risk Assessment</p>

                {/* Edit Button */}
                <button 
                  className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition-all border border-white/40 hover:border-white/60 hover:shadow-lg hover:shadow-white/40 flex items-center justify-center gap-2 drop-shadow transform hover:scale-105"
                  onClick={() => { setEditingItem({...level, key, type: 'riskLevel'}); setShowDetails(true); }}
                >
                  <i className="fas fa-edit text-lg"></i>Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ========== TAB 4: EFFORT CALCULATION ==========
  const renderEffortCalculation = () => (
    <div className="space-y-8">
      {/* Header with white accents */}
      <div className="relative p-7 bg-gradient-to-r from-info-900/40 via-info-800/30 to-info-900/40 border-2 border-white/40 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-white/30 transition-all">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-2 h-10 bg-gradient-to-b from-white via-info-300 to-info-600 rounded-full shadow-xl shadow-white/40 animate-pulse"></div>
            <h2 className="text-3xl font-serif font-bold text-white drop-shadow-lg">Effort Calculation Parameters</h2>
            <i className="fas fa-calculator text-white text-2xl ml-auto drop-shadow animate-bounce"></i>
          </div>
          <p className="text-white/80 font-medium ml-6 drop-shadow">Configure effort calculation parameters that affect workload planning.</p>
        </div>
      </div>

      {/* KPI Cards Grid - SIX COLORFUL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Annual Working Hours - PRIMARY */}
        <div className="relative bg-gradient-to-br from-primary-900/30 via-primary-800/20 to-primary-900/30 border-2 border-l-4 border-white/40 border-l-primary-400 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-white/40 transform hover:scale-105 transition-all group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs uppercase font-semibold text-primary-300 tracking-widest drop-shadow">📅 Annual Working Hours</div>
              <i className="fas fa-calendar-alt text-primary-400 text-2xl drop-shadow"></i>
            </div>
            <div className="text-5xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent drop-shadow-lg mb-3">
              {auditConfig.effortCalculation.hoursPerAuditorPerYear}h
            </div>
            <p className="text-primary-200/90 text-sm drop-shadow">Total working hours per auditor annually</p>
            <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-lg transition-all border border-white/40 hover:border-white/60 hover:shadow-lg hover:shadow-white/40 flex items-center justify-center gap-2 drop-shadow transform hover:scale-105">
              <i className="fas fa-edit text-lg"></i>Edit
            </button>
          </div>
        </div>

        {/* 2. Holidays & Leave Days - WARNING */}
        <div className="relative bg-gradient-to-br from-warning-900/30 via-warning-800/20 to-warning-900/30 border-2 border-l-4 border-white/40 border-l-warning-400 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-white/40 transform hover:scale-105 transition-all group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs uppercase font-semibold text-warning-300 tracking-widest drop-shadow">🏖️ Holidays & Leave Days</div>
              <i className="fas fa-umbrella-beach text-warning-400 text-2xl drop-shadow"></i>
            </div>
            <div className="text-5xl font-bold bg-gradient-to-r from-warning-400 to-warning-300 bg-clip-text text-transparent drop-shadow-lg mb-3">
              {auditConfig.effortCalculation.holidaysAndLeave}d
            </div>
            <p className="text-warning-200/90 text-sm drop-shadow">Days off per year including holidays</p>
            <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-warning-600 to-warning-700 hover:from-warning-700 hover:to-warning-800 text-white font-bold rounded-lg transition-all border border-white/40 hover:border-white/60 hover:shadow-lg hover:shadow-white/40 flex items-center justify-center gap-2 drop-shadow transform hover:scale-105">
              <i className="fas fa-edit text-lg"></i>Edit
            </button>
          </div>
        </div>

        {/* 3. Annual Training Days - SUCCESS */}
        <div className="relative bg-gradient-to-br from-success-900/30 via-success-800/20 to-success-900/30 border-2 border-l-4 border-white/40 border-l-success-400 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-white/40 transform hover:scale-105 transition-all group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs uppercase font-semibold text-success-300 tracking-widest drop-shadow">🎓 Annual Training Days</div>
              <i className="fas fa-graduation-cap text-success-400 text-2xl drop-shadow"></i>
            </div>
            <div className="text-5xl font-bold bg-gradient-to-r from-success-400 to-success-300 bg-clip-text text-transparent drop-shadow-lg mb-3">
              {auditConfig.effortCalculation.trainingDays}d
            </div>
            <p className="text-success-200/90 text-sm drop-shadow">Days allocated for professional training</p>
            <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800 text-white font-bold rounded-lg transition-all border border-white/40 hover:border-white/60 hover:shadow-lg hover:shadow-white/40 flex items-center justify-center gap-2 drop-shadow transform hover:scale-105">
              <i className="fas fa-edit text-lg"></i>Edit
            </button>
          </div>
        </div>

        {/* 4. Admin Overhead - INFO */}
        <div className="relative bg-gradient-to-br from-info-900/30 via-info-800/20 to-info-900/30 border-2 border-l-4 border-white/40 border-l-info-400 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-white/40 transform hover:scale-105 transition-all group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs uppercase font-semibold text-info-300 tracking-widest drop-shadow">📋 Admin Overhead</div>
              <i className="fas fa-briefcase text-info-400 text-2xl drop-shadow"></i>
            </div>
            <div className="text-5xl font-bold bg-gradient-to-r from-info-400 to-info-300 bg-clip-text text-transparent drop-shadow-lg mb-3">
              {(auditConfig.effortCalculation.administrationOverhead * 100).toFixed(0)}%
            </div>
            <p className="text-info-200/90 text-sm drop-shadow">Percentage for administrative tasks</p>
            <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-info-600 to-info-700 hover:from-info-700 hover:to-info-800 text-white font-bold rounded-lg transition-all border border-white/40 hover:border-white/60 hover:shadow-lg hover:shadow-white/40 flex items-center justify-center gap-2 drop-shadow transform hover:scale-105">
              <i className="fas fa-edit text-lg"></i>Edit
            </button>
          </div>
        </div>

        {/* 5. Contingency Buffer - AMBER/PURPLE */}
        <div className="relative bg-gradient-to-br from-amber-900/30 via-amber-800/20 to-amber-900/30 border-2 border-l-4 border-white/40 border-l-amber-400 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-white/40 transform hover:scale-105 transition-all group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs uppercase font-semibold text-amber-300 tracking-widest drop-shadow">🛡️ Contingency Buffer</div>
              <i className="fas fa-shield-alt text-amber-400 text-2xl drop-shadow"></i>
            </div>
            <div className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent drop-shadow-lg mb-3">
              {(auditConfig.effortCalculation.bufferPercentage * 100).toFixed(0)}%
            </div>
            <p className="text-amber-200/90 text-sm drop-shadow">Buffer for unexpected issues</p>
            <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-lg transition-all border border-white/40 hover:border-white/60 hover:shadow-lg hover:shadow-white/40 flex items-center justify-center gap-2 drop-shadow transform hover:scale-105">
              <i className="fas fa-edit text-lg"></i>Edit
            </button>
          </div>
        </div>

        {/* 6. Available Hours/Auditor - PURPLE (Calculated) */}
        <div className="relative bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-purple-900/30 border-2 border-l-4 border-white/40 border-l-purple-400 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-white/40 transform hover:scale-105 transition-all group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs uppercase font-semibold text-purple-300 tracking-widest drop-shadow">⚙️ Available Hours/Auditor</div>
              <i className="fas fa-cog text-purple-400 text-2xl drop-shadow animate-spin" style={{animationDuration: '3s'}}></i>
            </div>
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent drop-shadow-lg mb-3">
              {auditConfig.calculateAvailableHoursPerAuditor()}h
            </div>
            <p className="text-purple-200/90 text-sm drop-shadow">Calculated from above parameters</p>
            <div className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-purple-600/40 to-purple-700/40 text-white font-bold rounded-lg border border-white/40 flex items-center justify-center gap-2 drop-shadow">
              <i className="fas fa-calculator text-lg"></i>Auto-calculated
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ========== TAB 5: ALLOCATION RULES ==========
  const renderAllocationRules = () => (
    <div className="space-y-8">
      {/* Header with white accents */}
      <div className="relative p-7 bg-gradient-to-r from-success-900/40 via-success-800/30 to-success-900/40 border-2 border-white/40 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-white/30 transition-all">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-2 h-10 bg-gradient-to-b from-white via-success-300 to-success-600 rounded-full shadow-xl shadow-white/40 animate-pulse"></div>
            <h2 className="text-3xl font-serif font-bold text-white drop-shadow-lg">Allocation Rules</h2>
            <i className="fas fa-chart-pie text-white text-2xl ml-auto drop-shadow animate-bounce"></i>
          </div>
          <p className="text-white/80 font-medium ml-6 drop-shadow">Configure how audit cases are distributed to regions and tax centers.</p>
        </div>
      </div>

      {/* Allocation Rules Container - Gradient Background */}
      <div className="relative bg-gradient-to-br from-neutral-900/30 via-neutral-800/20 to-neutral-900/30 border-2 border-white/40 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-white/30 transition-all group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
        
        <div className="relative z-10 space-y-8">
          {/* Rule 1: By Taxpayer Base - PRIMARY */}
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-400 to-primary-300 shadow-lg shadow-primary-400/50"></div>
                <span className="font-bold text-primary-300 uppercase tracking-wider drop-shadow text-sm flex items-center gap-2">
                  <i className="fas fa-money-bill-wave text-primary-400"></i>By Taxpayer Base
                </span>
              </div>
              <span className="text-3xl font-bold text-primary-400 drop-shadow-lg">
                {(auditConfig.allocationRules.byTaxpayerBase * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-5 bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 rounded-full overflow-hidden border-2 border-primary-400/50 shadow-lg hover:shadow-xl hover:shadow-primary-400/40 transition-shadow">
              <div 
                style={{width: (auditConfig.allocationRules.byTaxpayerBase * 100) + '%'}}
                className="h-full bg-gradient-to-r from-primary-600 to-primary-500 transition-all duration-500 shadow-lg shadow-primary-500/50 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-pulse"></div>
              </div>
            </div>
            <p className="text-primary-200/70 text-xs drop-shadow">Allocation based on regional taxpayer population</p>
          </div>

          {/* Rule 2: By Risk Profile - INFO */}
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-info-400 to-info-300 shadow-lg shadow-info-400/50"></div>
                <span className="font-bold text-info-300 uppercase tracking-wider drop-shadow text-sm flex items-center gap-2">
                  <i className="fas fa-triangle-exclamation text-info-400"></i>By Risk Profile
                </span>
              </div>
              <span className="text-3xl font-bold text-info-400 drop-shadow-lg">
                {(auditConfig.allocationRules.byRiskProfile * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-5 bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 rounded-full overflow-hidden border-2 border-info-400/50 shadow-lg hover:shadow-xl hover:shadow-info-400/40 transition-shadow">
              <div 
                style={{width: (auditConfig.allocationRules.byRiskProfile * 100) + '%'}}
                className="h-full bg-gradient-to-r from-info-600 to-info-500 transition-all duration-500 shadow-lg shadow-info-500/50 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-pulse"></div>
              </div>
            </div>
            <p className="text-info-200/70 text-xs drop-shadow">Allocation based on risk assessment metrics</p>
          </div>

          {/* Rule 3: By Capacity - SUCCESS */}
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-success-400 to-success-300 shadow-lg shadow-success-400/50"></div>
                <span className="font-bold text-success-300 uppercase tracking-wider drop-shadow text-sm flex items-center gap-2">
                  <i className="fas fa-users text-success-400"></i>By Capacity
                </span>
              </div>
              <span className="text-3xl font-bold text-success-400 drop-shadow-lg">
                {(auditConfig.allocationRules.byCapacity * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-5 bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 rounded-full overflow-hidden border-2 border-success-400/50 shadow-lg hover:shadow-xl hover:shadow-success-400/40 transition-shadow">
              <div 
                style={{width: (auditConfig.allocationRules.byCapacity * 100) + '%'}}
                className="h-full bg-gradient-to-r from-success-600 to-success-500 transition-all duration-500 shadow-lg shadow-success-500/50 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-pulse"></div>
              </div>
            </div>
            <p className="text-success-200/70 text-xs drop-shadow">Allocation based on available auditor capacity</p>
          </div>
        </div>
      </div>

      {/* Edit Button */}
      <button className="w-full px-8 py-4 bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800 text-white font-bold text-lg rounded-xl transition-all border-2 border-white/40 hover:border-white/60 hover:shadow-2xl hover:shadow-white/40 flex items-center justify-center gap-3 drop-shadow transform hover:scale-105">
        <i className="fas fa-edit text-xl"></i>Edit Allocation Weights
      </button>
    </div>
  );

  // ========== TAB 6: VALIDATION RULES ==========
  const renderValidationRules = () => (
    <div className="space-y-8">
      {/* Header with white accents */}
      <div className="relative p-7 bg-gradient-to-r from-primary-900/40 via-primary-800/30 to-primary-900/40 border-2 border-white/40 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-white/30 transition-all">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-2 h-10 bg-gradient-to-b from-white via-primary-300 to-primary-600 rounded-full shadow-xl shadow-white/40 animate-pulse"></div>
            <h2 className="text-3xl font-serif font-bold text-white drop-shadow-lg">Validation & Constraints</h2>
            <i className="fas fa-check-circle text-white text-2xl ml-auto drop-shadow animate-bounce"></i>
          </div>
          <p className="text-white/80 font-medium ml-6 drop-shadow">Configure validation rules that ensure plan quality and feasibility.</p>
        </div>
      </div>

      {/* Validation Rules Table with Row Coloring */}
      <div className="relative bg-gradient-to-br from-neutral-900/20 via-neutral-800/10 to-neutral-900/20 border-2 border-white/40 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-white/30 transition-all group">
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-primary-900/50 to-primary-800/50 border-b-2 border-white/40">
                <th className="px-8 py-5 text-left text-xs font-bold text-primary-200 uppercase tracking-widest drop-shadow">Constraint</th>
                <th className="px-8 py-5 text-center text-xs font-bold text-primary-200 uppercase tracking-widest drop-shadow">Current Value</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-primary-200 uppercase tracking-widest drop-shadow">Description</th>
                <th className="px-8 py-5 text-center text-xs font-bold text-primary-200 uppercase tracking-widest drop-shadow">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {/* Row 1 - Min Cases/Region - SUCCESS */}
              <tr className="bg-gradient-to-r from-success-900/15 to-success-800/10 hover:from-success-900/25 hover:to-success-800/20 transition-all group/row">
                <td className="px-8 py-5 font-bold text-success-300 drop-shadow flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success-400 shadow-lg shadow-success-400/50"></div>Min Cases/Region
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-success-600 to-success-700 text-white font-bold rounded-lg border border-white/40 drop-shadow-lg shadow-lg shadow-success-500/50">
                    {auditConfig.validation.minCasesPerRegion}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm text-success-200/90 drop-shadow">Minimum audit cases required per region</td>
                <td className="px-8 py-5 text-center">
                  <button className="px-4 py-2 bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800 text-white text-xs font-bold rounded-lg transition-all border border-white/40 hover:border-white/60 hover:shadow-lg hover:shadow-white/40 drop-shadow transform hover:scale-105">
                    <i className="fas fa-edit mr-1"></i>Edit
                  </button>
                </td>
              </tr>

              {/* Row 2 - Max Effort Variance - WARNING */}
              <tr className="bg-gradient-to-r from-warning-900/15 to-warning-800/10 hover:from-warning-900/25 hover:to-warning-800/20 transition-all group/row">
                <td className="px-8 py-5 font-bold text-warning-300 drop-shadow flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-warning-400 shadow-lg shadow-warning-400/50"></div>Max Effort Variance
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-warning-600 to-warning-700 text-white font-bold rounded-lg border border-white/40 drop-shadow-lg shadow-lg shadow-warning-500/50">
                    ±{(auditConfig.validation.maxEffortVariance * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="px-8 py-5 text-sm text-warning-200/90 drop-shadow">Allowed variance from planned effort</td>
                <td className="px-8 py-5 text-center">
                  <button className="px-4 py-2 bg-gradient-to-r from-warning-600 to-warning-700 hover:from-warning-700 hover:to-warning-800 text-white text-xs font-bold rounded-lg transition-all border border-white/40 hover:border-white/60 hover:shadow-lg hover:shadow-white/40 drop-shadow transform hover:scale-105">
                    <i className="fas fa-edit mr-1"></i>Edit
                  </button>
                </td>
              </tr>

              {/* Row 3 - Skill Coverage - INFO */}
              <tr className="bg-gradient-to-r from-info-900/15 to-info-800/10 hover:from-info-900/25 hover:to-info-800/20 transition-all group/row">
                <td className="px-8 py-5 font-bold text-info-300 drop-shadow flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-info-400 shadow-lg shadow-info-400/50"></div>Skill Coverage
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-info-600 to-info-700 text-white font-bold rounded-lg border border-white/40 drop-shadow-lg shadow-lg shadow-info-500/50">
                    {(auditConfig.validation.requiredSkillCoverage * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="px-8 py-5 text-sm text-info-200/90 drop-shadow">Required % of needed skills available</td>
                <td className="px-8 py-5 text-center">
                  <button className="px-4 py-2 bg-gradient-to-r from-info-600 to-info-700 hover:from-info-700 hover:to-info-800 text-white text-xs font-bold rounded-lg transition-all border border-white/40 hover:border-white/60 hover:shadow-lg hover:shadow-white/40 drop-shadow transform hover:scale-105">
                    <i className="fas fa-edit mr-1"></i>Edit
                  </button>
                </td>
              </tr>

              {/* Row 4 - Max Cases/Auditor - DANGER */}
              <tr className="bg-gradient-to-r from-danger-900/15 to-danger-800/10 hover:from-danger-900/25 hover:to-danger-800/20 transition-all group/row">
                <td className="px-8 py-5 font-bold text-danger-300 drop-shadow flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-danger-400 shadow-lg shadow-danger-400/50"></div>Max Cases/Auditor
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-danger-600 to-danger-700 text-white font-bold rounded-lg border border-white/40 drop-shadow-lg shadow-lg shadow-danger-500/50">
                    {auditConfig.validation.maxCasesPerAuditor}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm text-danger-200/90 drop-shadow">Max audit cases per auditor per year</td>
                <td className="px-8 py-5 text-center">
                  <button className="px-4 py-2 bg-gradient-to-r from-danger-600 to-danger-700 hover:from-danger-700 hover:to-danger-800 text-white text-xs font-bold rounded-lg transition-all border border-white/40 hover:border-white/60 hover:shadow-lg hover:shadow-white/40 drop-shadow transform hover:scale-105">
                    <i className="fas fa-edit mr-1"></i>Edit
                  </button>
                </td>
              </tr>

              {/* Row 5 - Min Auditors/Region - PURPLE */}
              <tr className="bg-gradient-to-r from-purple-900/15 to-purple-800/10 hover:from-purple-900/25 hover:to-purple-800/20 transition-all group/row">
                <td className="px-8 py-5 font-bold text-purple-300 drop-shadow flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50"></div>Min Auditors/Region
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg border border-white/40 drop-shadow-lg shadow-lg shadow-purple-500/50">
                    {auditConfig.validation.minAuditorsPerRegion}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm text-purple-200/90 drop-shadow">Minimum auditors required per region</td>
                <td className="px-8 py-5 text-center">
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-xs font-bold rounded-lg transition-all border border-white/40 hover:border-white/60 hover:shadow-lg hover:shadow-white/40 drop-shadow transform hover:scale-105">
                    <i className="fas fa-edit mr-1"></i>Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ========== TAB 7: REGIONS & CAPACITY ==========
  const renderRegionsCapacity = () => (
    <div className="space-y-8">
      {/* Header with white accents */}
      <div className="relative p-7 bg-gradient-to-r from-info-900/40 via-info-800/30 to-info-900/40 border-2 border-white/40 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-white/30 transition-all">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-2 h-10 bg-gradient-to-b from-white via-info-300 to-info-600 rounded-full shadow-xl shadow-white/40 animate-pulse"></div>
            <h2 className="text-3xl font-serif font-bold text-white drop-shadow-lg">Regions & Auditor Capacity</h2>
            <i className="fas fa-map-marked-alt text-white text-2xl ml-auto drop-shadow animate-bounce"></i>
          </div>
          <p className="text-white/80 font-medium ml-6 drop-shadow">View and manage regional taxpayer base and available audit resources.</p>
        </div>
      </div>

      {/* Regional Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auditConfig.regions.map((region, idx) => {
          // Rainbow colors for regions
          const regionColors = [
            { gradient: 'from-primary-600 to-primary-500', border: 'border-primary-400', taxpayerGradient: 'from-primary-700 to-primary-600' },
            { gradient: 'from-info-600 to-info-500', border: 'border-info-400', taxpayerGradient: 'from-info-700 to-info-600' },
            { gradient: 'from-success-600 to-success-500', border: 'border-success-400', taxpayerGradient: 'from-success-700 to-success-600' },
            { gradient: 'from-warning-600 to-warning-500', border: 'border-warning-400', taxpayerGradient: 'from-warning-700 to-warning-600' },
            { gradient: 'from-danger-600 to-danger-500', border: 'border-danger-400', taxpayerGradient: 'from-danger-700 to-danger-600' },
            { gradient: 'from-purple-600 to-purple-500', border: 'border-purple-400', taxpayerGradient: 'from-purple-700 to-purple-600' }
          ];
          const colors = regionColors[idx % regionColors.length];

          return (
            <div 
              key={idx}
              className={`relative bg-gradient-to-br ${colors.gradient} border-2 border-l-4 ${colors.border} rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-white/50 transform hover:scale-105 transition-all duration-300 group overflow-hidden`}
            >
              {/* Glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              
              <div className="relative z-10">
                {/* Region Name */}
                <h3 className="text-2xl font-bold text-white drop-shadow-lg mb-6 flex items-center gap-2">
                  <i className="fas fa-map-location-dot text-white/90"></i>{region.name}
                </h3>

                {/* Taxpayers Section */}
                <div className="bg-white/15 border border-white/40 rounded-lg p-5 mb-6 backdrop-blur-sm">
                  <div className="text-xs uppercase font-semibold text-white/80 tracking-wider mb-3 drop-shadow flex items-center gap-2">
                    <i className="fas fa-people-group text-white/90"></i>Taxpayer Base
                  </div>
                  <div className="text-3xl font-bold text-white drop-shadow-lg">
                    {region.taxpayers.toLocaleString()}
                  </div>
                  <p className="text-white/70 text-xs mt-2 drop-shadow">Registered taxpayers in region</p>
                </div>

                {/* Auditors Section */}
                <div className="bg-white/15 border border-white/40 rounded-lg p-5 mb-6 backdrop-blur-sm">
                  <div className="text-xs uppercase font-semibold text-white/80 tracking-wider mb-3 drop-shadow flex items-center gap-2">
                    <i className="fas fa-users text-white/90"></i>Auditors Available
                  </div>
                  <div className="text-4xl font-bold text-white drop-shadow-lg">
                    {region.availableAuditors}
                  </div>
                  <p className="text-white/70 text-xs mt-2 drop-shadow">Assigned to this region</p>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <div className="text-xs uppercase font-semibold text-white/80 tracking-wider mb-3 drop-shadow flex items-center gap-2">
                    <i className="fas fa-star text-white/90"></i>Key Skills
                  </div>
                  <div className="space-y-2">
                    {Object.entries(region.availableSkills).map(([skill, count], i) => (
                      <div key={i} className="flex items-center justify-between bg-white/10 border border-white/30 rounded p-2 px-3">
                        <span className="text-sm text-white/90 drop-shadow">{skill}</span>
                        <span className="px-3 py-1 bg-gradient-to-r from-white/30 to-white/20 rounded-lg text-white font-bold text-xs drop-shadow border border-white/40">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit Button */}
                <button className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition-all border border-white/40 hover:border-white/60 hover:shadow-lg hover:shadow-white/40 flex items-center justify-center gap-2 drop-shadow transform hover:scale-105">
                  <i className="fas fa-edit text-lg"></i>Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ========== RISK DISTRIBUTION ==========
  const renderRiskDistribution = () => (
    <div className="space-y-8">
      {/* Header with white accents */}
      <div className="relative p-7 bg-gradient-to-r from-warning-900/40 via-warning-800/30 to-warning-900/40 border-2 border-white/40 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-white/30 transition-all">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-2 h-10 bg-gradient-to-b from-white via-warning-300 to-warning-600 rounded-full shadow-xl shadow-white/40 animate-pulse"></div>
            <h2 className="text-3xl font-serif font-bold text-white drop-shadow-lg">Risk Distribution Formula</h2>
            <i className="fas fa-chart-line text-white text-2xl ml-auto drop-shadow animate-bounce"></i>
          </div>
          <p className="text-white/80 font-medium ml-6 drop-shadow">Configure how risky taxpayers are distributed across risk levels and audit types.</p>
        </div>
      </div>

      {/* Main Percentage Card - MASSIVE DISPLAY */}
      <div className="relative bg-gradient-to-br from-warning-900/40 via-warning-800/30 to-warning-900/40 border-2 border-white/40 rounded-2xl p-12 shadow-2xl hover:shadow-3xl hover:shadow-white/40 transition-all group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl animate-pulse"></div>
        
        <div className="relative z-10 text-center">
          <div className="text-xs uppercase font-bold text-warning-300 tracking-widest mb-6 drop-shadow flex items-center justify-center gap-2">
            <i className="fas fa-fire text-warning-400 text-2xl"></i>Percentage of Taxpayers Considered Risky
          </div>
          <div className="text-7xl font-bold bg-gradient-to-br from-warning-300 to-warning-200 bg-clip-text text-transparent drop-shadow-2xl mb-6 animate-pulse">
            {auditConfig.riskDistribution.percentageRisky}%
          </div>
          <p className="text-warning-200 text-lg font-semibold drop-shadow mb-4">
            Of all <strong>{auditConfig.getTotalTaxpayers().toLocaleString()}</strong> registered taxpayers, approximately <strong className="text-warning-100">{auditConfig.getTotalRiskyTaxpayers().toLocaleString()}</strong> are classified as risky
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-warning-600 to-warning-700 hover:from-warning-700 hover:to-warning-800 text-white font-bold rounded-xl transition-all border-2 border-white/40 hover:border-white/60 hover:shadow-lg hover:shadow-white/40 flex items-center justify-center gap-2 drop-shadow transform hover:scale-105 mx-auto">
            <i className="fas fa-edit text-lg"></i>Edit Percentage
          </button>
        </div>
      </div>

      {/* Risk Level Distribution Grid - COLORFUL CARDS */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-white via-warning-300 to-warning-600 rounded-full shadow-lg shadow-white/40"></div>
          <h3 className="text-2xl font-bold text-white drop-shadow-lg uppercase tracking-wider">Risk Level Distribution</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(auditConfig.riskDistribution.split).map(([level, percentage], idx) => {
            // Different colors for each risk level
            const riskCardColors = [
              { gradient: 'from-success-600 to-success-500', border: 'border-success-400', emoji: '✅' },
              { gradient: 'from-info-600 to-info-500', border: 'border-info-400', emoji: '👀' },
              { gradient: 'from-warning-600 to-warning-500', border: 'border-warning-400', emoji: '⚠️' },
              { gradient: 'from-danger-600 to-danger-500', border: 'border-danger-400', emoji: '🔥' }
            ];
            const colors = riskCardColors[idx];

            return (
              <div 
                key={level}
                className={`relative bg-gradient-to-br ${colors.gradient} border-2 border-l-4 ${colors.border} rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-white/50 transform hover:scale-110 transition-all duration-300 group overflow-hidden text-center`}
              >
                {/* Glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                
                <div className="relative z-10">
                  <div className="text-4xl mb-4 drop-shadow animate-bounce">{colors.emoji}</div>
                  <div className="text-xs uppercase font-bold text-white tracking-widest mb-4 drop-shadow">
                    {level}
                  </div>
                  <div className="text-5xl font-bold text-white drop-shadow-lg mb-3">
                    {(percentage * 100).toFixed(1)}%
                  </div>
                  <div className="bg-white/15 border border-white/40 rounded-lg p-3 backdrop-blur-sm">
                    <div className="text-xs text-white/80 drop-shadow">Taxpayer Count</div>
                    <div className="text-2xl font-bold text-white drop-shadow-lg">
                      {Math.round(auditConfig.getTotalRiskyTaxpayers() * percentage).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-8 bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-800 min-h-screen">
      {/* PAGE HEADER - ULTRA VIBRANT WITH WHITE ACCENTS & GLOW */}
      <div className="relative p-10 bg-gradient-to-r from-primary-900/40 via-primary-800/30 to-primary-900/40 border-2 border-white/40 rounded-3xl shadow-2xl hover:shadow-3xl hover:shadow-white/30 transition-all group overflow-hidden">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-3">
            <div className="w-2 h-12 bg-gradient-to-b from-white via-primary-300 to-primary-600 rounded-full shadow-2xl shadow-white/50 animate-pulse"></div>
            <h1 className="text-5xl font-serif font-bold text-white drop-shadow-lg">System Configuration</h1>
            <div className="ml-auto text-5xl drop-shadow animate-bounce">⚙️</div>
          </div>
          <div className="flex items-center gap-3 ml-7">
            <i className="fas fa-info-circle text-white/90 text-lg drop-shadow"></i>
            <p className="text-white/90 text-lg font-semibold drop-shadow">Manage all configurable parameters for the audit planning system</p>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION - COLORFUL & VIBRANT */}
      <div className="relative bg-gradient-to-r from-neutral-800/50 via-neutral-750/40 to-neutral-800/50 border-2 border-white/40 rounded-t-2xl overflow-x-auto shadow-xl hover:shadow-2xl hover:shadow-white/20 transition-all group">
        <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
        
        <div className="flex gap-2 px-8 py-5 relative z-10">
          {[
            { id: 'audit-types', label: 'Audit Types', icon: 'fas fa-tasks', color: 'from-primary-600 to-primary-500' },
            { id: 'skills', label: 'Skills', icon: 'fas fa-user-cog', color: 'from-info-600 to-info-500' },
            { id: 'risk-levels', label: 'Risk Levels', icon: 'fas fa-traffic-light', color: 'from-warning-600 to-warning-500' },
            { id: 'effort', label: 'Effort Calculation', icon: 'fas fa-calculator', color: 'from-success-600 to-success-500' },
            { id: 'allocation', label: 'Allocation Rules', icon: 'fas fa-chart-pie', color: 'from-danger-600 to-danger-500' },
            { id: 'validation', label: 'Validation', icon: 'fas fa-check-circle', color: 'from-purple-600 to-purple-500' },
            { id: 'regions', label: 'Regions', icon: 'fas fa-map-marked-alt', color: 'from-amber-600 to-amber-500' },
            { id: 'risk-dist', label: 'Risk Distribution', icon: 'fas fa-chart-line', color: 'from-cyan-600 to-cyan-500' }
          ].map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative px-5 py-3 font-bold text-sm whitespace-nowrap rounded-xl transition-all transform hover:scale-110 border-2 drop-shadow hover:drop-shadow-xl ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white border-white/60 shadow-lg shadow-current/50 animate-pulse`
                  : 'bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <i className={`${tab.icon} text-base`}></i>
                <span className="hidden sm:inline">{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/40 to-white/0"></div>
      </div>

      {/* CONTENT AREA */}
      <div className="relative bg-gradient-to-br from-neutral-800/50 via-neutral-750/30 to-neutral-800/50 border-2 border-t-0 border-white/40 rounded-b-2xl p-10 shadow-xl hover:shadow-2xl hover:shadow-white/20 transition-all group overflow-hidden">
        <div className="absolute inset-0 rounded-b-2xl bg-gradient-to-r from-white/0 via-white/3 to-white/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"></div>
        
        <div className="relative z-10">
          {activeTab === 'audit-types' && renderAuditTypes()}
          {activeTab === 'skills' && renderSkills()}
          {activeTab === 'risk-levels' && renderRiskLevels()}
          {activeTab === 'effort' && renderEffortCalculation()}
          {activeTab === 'allocation' && renderAllocationRules()}
          {activeTab === 'validation' && renderValidationRules()}
          {activeTab === 'regions' && renderRegionsCapacity()}
          {activeTab === 'risk-dist' && renderRiskDistribution()}
        </div>
      </div>
    </div>
  );
}

export default ConfigurationManagementView;
