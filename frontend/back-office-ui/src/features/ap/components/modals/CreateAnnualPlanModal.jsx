import React, { useState, useEffect } from 'react';
import { createAuditPlan } from '../../utils/businessLogic';
import { auditConfig } from '../../config/auditConfig';
import { useData } from '../../services/dataService';
import Badge from '../Badge';

/**
 * CreateAnnualPlanModal Component
 * Multi-step wizard modal for creating comprehensive annual audit plans.
 * 
 * Features:
 * - Step 1: Plan basics (name, fiscal year, strategy, dates)
 * - Step 2: Audit type allocation with risk engine data visualization
 * - Step 3: Regional distribution with proportional allocation
 * - Step 4: Final review and validation before submission
 * - Auto-calculates totals, effort hours, and capacity usage
 * - Validates plan against regional auditor capacity
 * - Creates plans as draft or submits directly to director
 * - Shows validation errors before finalization
 * 
 * @component
 * @param {Function} onClose - Callback to close modal
 * @returns {React.ReactElement} Multi-step modal wizard for plan creation
 */
function CreateAnnualPlanModal({ onClose }) {
  // ===== FORM STATE =====
  const [activeStep, setActiveStep] = useState(1);
  const { data, updateData, refreshData } = useData();
  const [year, setYear] = useState('');
  const [planName, setPlanName] = useState('');
  const [strategy, setStrategy] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // ===== AUDIT TYPE ALLOCATION =====
  const [auditTypeAllocation, setAuditTypeAllocation] = useState({});

  // ===== REGIONAL BREAKDOWN =====
  const [regionalAllocation, setRegionalAllocation] = useState({});

  // ===== CALCULATED TOTALS =====
  const [totalCases, setTotalCases] = useState(0);
  const [totalEffort, setTotalEffort] = useState(0);
  
  // ===== PLAN TARGETS =====
  const [targetAudits, setTargetAudits] = useState(20000);

  // ===== STATE FOR SAVE OPERATION =====
  const [pendingSubmit, setPendingSubmit] = useState(null); // 'draft' or 'submit'

  // ===== RISK ENGINE DATA =====
  const [riskData, setRiskData] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  // Initialize
  useEffect(() => {
    initializeDates();
    initializeRiskData();
    initializeAuditTypeAllocation();
    initializeRegionalAllocation();
  }, []);

  const initializeDates = () => {
    const nextYear = new Date().getFullYear() + 1;
    setYear(nextYear.toString());
    setPlanName(`Annual Audit Plan ${nextYear}`);
    setStartDate(`${nextYear}-01-01`);
    setEndDate(`${nextYear}-12-31`);
  };

  const initializeRiskData = () => {
    // Mock risk data (in real system, comes from risk engine)
    const mockRiskDist = {
      'desk_audit': 0.50,
      'field_audit': 0.20,
      'joint_audit': 0.10,
      'transfer_pricing': 0.05,
      'comprehensive': 0.05,
      'issue_audit': 0.10
    };
    
    setRiskData({
      totalTaxpayers: auditConfig.getTotalTaxpayers(),
      riskySuspects: auditConfig.getTotalRiskyTaxpayers(),
      byAuditType: auditConfig.auditTypes.map(type => ({
        id: type.id,
        name: type.name,
        candidates: Math.round(auditConfig.getTotalRiskyTaxpayers() * (mockRiskDist[type.id] || 0.15))
      }))
    });
  };

  const generateDefaultAllocation = (target) => {
    const allocation = {};
    const totalRisky = auditConfig.getTotalRiskyTaxpayers();
    let remaining = target;
    
    // Default risk distribution (mock)
    const mockRiskDist = {
      'desk_audit': 0.50,
      'field_audit': 0.20,
      'joint_audit': 0.10,
      'transfer_pricing': 0.05,
      'comprehensive': 0.05,
      'issue_audit': 0.10
    };
    
    auditConfig.auditTypes.forEach((type, index) => {
      const typeDist = mockRiskDist[type.id] || (1 / auditConfig.auditTypes.length);
      
      if (index === auditConfig.auditTypes.length - 1) {
        allocation[type.id] = remaining; // Assign remainder to last to ensure exact match
      } else {
        const typeCount = Math.round(target * typeDist);
        allocation[type.id] = typeCount;
        remaining -= typeCount;
      }
    });
    
    setAuditTypeAllocation(allocation);
  };

  const initializeAuditTypeAllocation = () => {
    generateDefaultAllocation(20000);
  };

  const initializeRegionalAllocation = () => {
    const allocation = {};
    const totalTaxpayers = auditConfig.getTotalTaxpayers();
    
    auditConfig.regions.forEach(region => {
      allocation[region.name] = {
        taxpayers: region.taxpayers,
        riskySuspects: Math.round(region.taxpayers * (auditConfig.riskDistribution.percentageRisky / 100)),
        allocatedCases: 0,
        capacity: region.availableAuditors
      };
    });
    setRegionalAllocation(allocation);
  };

  // ===== CALCULATIONS =====
  useEffect(() => {
    calculateTotals();
  }, [auditTypeAllocation, regionalAllocation]);

  const calculateTotals = () => {
    // Total cases from audit type allocation
    const cases = Object.values(auditTypeAllocation).reduce((sum, val) => sum + val, 0);
    setTotalCases(cases);

    // Total effort from audit type allocation
    let effort = 0;
    auditConfig.auditTypes.forEach(type => {
      const count = auditTypeAllocation[type.id] || 0;
      effort += count * type.effortPerCase;
    });
    setTotalEffort(effort);
  };

  // ===== HANDLE PENDING SUBMIT (after regionalAllocation is updated) =====
  useEffect(() => {
    if (!pendingSubmit) return;
    if (Object.keys(regionalAllocation).length === 0) return;
    
    const targetRegionCount = auditConfig.regions.length;
    const hasAllRegions = Object.keys(regionalAllocation).length === targetRegionCount;
    
    if (!hasAllRegions) return;
    
    console.log('Regional allocation ready, executing pending submit:', pendingSubmit);
    console.log('Regional allocation structure:', regionalAllocation);
    
    // Define execution functions with current state values
    const doExecuteSaveDraft = () => {
      createAuditPlan({
        fiscalYear: year,
        name: planName,
        strategy,
        startDate,
        endDate,
        auditTypeAllocation,
        regionalAllocation,
        totalCases,
        totalEffort
      });
      refreshData();
      alert('Plan created as DRAFT and ready for review.');
      onClose();
    };
    
    const doExecuteSubmit = () => {
      createAuditPlan({
        fiscalYear: year,
        name: planName,
        strategy,
        startDate,
        endDate,
        auditTypeAllocation,
        regionalAllocation,
        totalCases,
        totalEffort,
        submitImmediate: true
      });
      refreshData();
      alert('Plan submitted to Director for review.');
      onClose();
    };
    
    // Execute the appropriate action
    if (pendingSubmit === 'draft') {
      doExecuteSaveDraft();
    } else if (pendingSubmit === 'submit') {
      doExecuteSubmit();
    }
    
    setPendingSubmit(null);
  }, [pendingSubmit, regionalAllocation, year, planName, strategy, startDate, endDate, auditTypeAllocation, totalCases, totalEffort, onClose]);

  // ===== HANDLERS =====
  const handleAuditTypeChange = (typeId, value) => {
    const newAllocation = { ...auditTypeAllocation };
    newAllocation[typeId] = parseInt(value) || 0;
    setAuditTypeAllocation(newAllocation);
  };

  const validatePlan = () => {
    const errors = [];

    if (!planName.trim()) errors.push('Plan name is required');
    if (!strategy.trim()) errors.push('Audit strategy is required');
    if (totalCases === 0) errors.push('At least one audit type must be allocated cases');
    if (totalCases > auditConfig.getTotalRiskyTaxpayers()) {
      errors.push(`Total cases (${totalCases}) cannot exceed risky taxpayers (${auditConfig.getTotalRiskyTaxpayers()})`);
    }

    const totalCapacity = auditConfig.regions.reduce((sum, r) => sum + r.availableAuditors, 0);
    const requiredAuditors = Math.ceil(totalEffort / auditConfig.calculateAvailableHoursPerAuditor());
    if (requiredAuditors > totalCapacity) {
      errors.push(`Required auditors (${requiredAuditors}) exceeds available capacity (${totalCapacity})`);
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const allocateCasesToRegions = () => {
    // Create proper regional allocation with audit type breakdown
    const allocation = {};
    const totalTaxpayers = auditConfig.getTotalTaxpayers();

    auditConfig.regions.forEach(region => {
      allocation[region.name] = {};
      const regionProportion = region.taxpayers / totalTaxpayers;
      
      // For each audit type, allocate proportionally to region
      Object.entries(auditTypeAllocation).forEach(([auditType, totalCases]) => {
        const defaultRegionCases = Math.round(totalCases * regionProportion);
        const userOverride = regionalAllocation[region.name]?.[auditType];
        allocation[region.name][auditType] = userOverride !== undefined ? userOverride : defaultRegionCases;
      });
    });

    // Check for rounding errors and adjust (only if user hasn't heavily overridden everything)
    Object.entries(auditTypeAllocation).forEach(([auditType, totalCases]) => {
      const totalAllocated = Object.values(allocation).reduce((sum, region) => sum + (region[auditType] || 0), 0);
      const difference = totalCases - totalAllocated;
      
      if (difference !== 0) {
        // Find a region that doesn't have a user override for this type to absorb the difference
        const flexibleRegion = auditConfig.regions.find(r => regionalAllocation[r.name]?.[auditType] === undefined);
        if (flexibleRegion) {
          allocation[flexibleRegion.name][auditType] = (allocation[flexibleRegion.name][auditType] || 0) + difference;
        }
      }
    });

    setRegionalAllocation(allocation);
  };

  const handleSaveDraft = () => {
    if (!validatePlan()) return;
    allocateCasesToRegions();
    setPendingSubmit('draft');
  };

  const handleSubmit = () => {
    if (!validatePlan()) return;
    allocateCasesToRegions();
    setPendingSubmit('submit');
  };

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let y = 2020; y <= currentYear + 5; y++) {
    years.push(y);
  }

  // ===== RENDER =====
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-neutral-900 rounded-xl shadow-2xl flex flex-col ring-1 ring-primary-500/30 hover:ring-primary-500/50 transition-all duration-300">
        {/* MODAL HEADER - ULTRA BRIGHT WITH WHITE ACCENTS */}
        <div className="bg-gradient-to-r from-neutral-800 via-neutral-750 to-primary-900/40 border-b-2 border-white/30 p-8 flex-shrink-0 relative overflow-hidden shadow-xl">
          {/* Decorative glow elements */}
          <div className="absolute inset-0 opacity-0 hover:opacity-30 transition-opacity duration-500 bg-gradient-to-r from-primary-600/0 via-white/10 to-primary-600/0 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-2 h-10 bg-gradient-to-b from-white via-primary-300 to-primary-600 rounded-full shadow-xl shadow-white/40 animate-pulse"></div>
              <div>
                <h1 className="text-4xl font-serif font-bold text-white drop-shadow-lg">Create Annual Audit Plan</h1>
              </div>
              <div className="ml-auto text-5xl animate-bounce drop-shadow-lg">📋</div>
            </div>
            <div className="flex items-center gap-2 ml-6">
              <i className="fas fa-wand-magic-sparkles text-white text-lg drop-shadow"></i>
              <p className="text-white/90 text-sm font-semibold drop-shadow-lg">Multi-step wizard to build your annual audit strategy</p>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto bg-neutral-900/50">
          <div className="p-8 space-y-8">
            {/* ENHANCED STEP INDICATOR WITH WHITE ACCENTS & GLOW & ANIMATIONS */}
            <div className="mb-12">
              <div className="flex items-center justify-between gap-2">
                {[1, 2, 3, 4].map((step, index) => {
                  const stepColors = {
                    1: { bg: 'from-primary-600 to-primary-700', ring: 'ring-white/50', text: 'text-white', icon: 'fas fa-pencil', glow: 'shadow-xl shadow-white/50' },
                    2: { bg: 'from-info-600 to-info-700', ring: 'ring-white/50', text: 'text-white', icon: 'fas fa-list-check', glow: 'shadow-xl shadow-white/50' },
                    3: { bg: 'from-warning-600 to-warning-700', ring: 'ring-white/50', text: 'text-white', icon: 'fas fa-map-location-dot', glow: 'shadow-xl shadow-white/50' },
                    4: { bg: 'from-success-600 to-success-700', ring: 'ring-white/50', text: 'text-white', icon: 'fas fa-star', glow: 'shadow-xl shadow-white/50' }
                  };
                  const colors = stepColors[step];
                  return (
                    <div key={step} className="flex items-center flex-1">
                      <button
                        onClick={() => setActiveStep(step)}
                        className={`relative w-16 h-16 rounded-full flex items-center justify-center font-bold text-base transition-all transform hover:scale-125 hover:-translate-y-2 ${
                          activeStep === step 
                            ? `bg-gradient-to-br ${colors.bg} text-white ring-2 ${colors.ring} ${colors.glow} drop-shadow-lg` 
                            : activeStep > step 
                            ? `bg-gradient-to-br from-success-600 to-success-700 text-white shadow-xl shadow-white/40` 
                            : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600 hover:text-white'
                        }`}
                      >
                        {activeStep > step ? <i className="fas fa-check text-xl"></i> : activeStep === step ? <i className={`${colors.icon} text-xl`}></i> : step}
                        {activeStep === step && (
                          <div className="absolute inset-0 rounded-full animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        )}
                      </button>
                      <div className={`hidden sm:block ml-4 text-xs font-bold transition-all drop-shadow ${activeStep === step ? colors.text : activeStep > step ? 'text-white' : 'text-neutral-400'}`}>
                        {step === 1 && 'Plan Basics'}
                        {step === 2 && 'Audit Types'}
                        {step === 3 && 'Regional'}
                        {step === 4 && 'Review'}
                      </div>
                      {index < 3 && (
                        <div className={`flex-1 h-2 mx-3 rounded-full transition-all shadow-lg ${activeStep > step ? 'bg-gradient-to-r from-success-500 to-success-600 shadow-white/30' : activeStep === step ? 'bg-gradient-to-r from-primary-500 to-primary-600 shadow-white/30' : 'bg-neutral-700'}`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 h-1.5 bg-gradient-to-r from-white/40 via-white/20 to-white/40 rounded-full shadow-lg shadow-white/20 opacity-80"></div>
            </div>

            {/* STEP 1: PLAN BASICS - BRIGHTER WITH WHITE ACCENTS */}
            {activeStep === 1 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="relative p-7 bg-gradient-to-r from-primary-900/30 via-primary-800/20 to-primary-900/30 border-2 border-white/40 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-white/20 transition-all">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 pointer-events-none"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-2 h-8 bg-gradient-to-b from-white via-primary-300 to-primary-600 rounded-full shadow-lg shadow-white/50"></div>
                      <h2 className="text-3xl font-serif font-bold text-white drop-shadow-lg">Plan Basics</h2>
                      <i className="fas fa-pencil-alt text-white text-2xl ml-auto drop-shadow"></i>
                    </div>
                    <p className="text-white/80 font-medium ml-6 drop-shadow">Define the foundation of your annual audit plan</p>
                  </div>
                </div>

                {/* Form Grid with color-coded inputs */}
                <div className="space-y-7">
                  {/* Fiscal Year - PRIMARY COLOR */}
                  <div className="group relative">
                    <label className="block text-base font-bold text-primary-300 mb-3 uppercase tracking-widest flex items-center gap-2 drop-shadow">
                      <i className="fas fa-calendar text-primary-400"></i>
                      Fiscal Year
                    </label>
                    <select 
                      value={year} 
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full bg-gradient-to-r from-primary-900/20 to-primary-800/20 border-2 border-primary-400/50 hover:border-primary-400 rounded-xl px-5 py-4 text-primary-100/90 font-semibold focus:border-primary-300 focus:ring-2 focus:ring-primary-300/30 transition-all group-hover:shadow-xl group-hover:shadow-primary-400/30 placeholder-primary-400/40"
                    >
                      {years.map(y => (
                        <option key={y} value={y} className="bg-neutral-900 text-primary-100">{y}</option>
                      ))}
                    </select>
                  </div>

                  {/* Plan Name - INFO COLOR */}
                  <div className="group relative">
                    <label className="block text-base font-bold text-info-300 mb-3 uppercase tracking-widest flex items-center gap-2 drop-shadow">
                      <i className="fas fa-file-alt text-info-400"></i>
                      Plan Name
                    </label>
                    <input
                      type="text"
                      value={planName}
                      onChange={(e) => setPlanName(e.target.value)}
                      placeholder="e.g., Annual Audit Plan 2026"
                      className="w-full bg-gradient-to-r from-info-900/20 to-info-800/20 border-2 border-info-400/50 hover:border-info-400 rounded-xl px-5 py-4 text-info-100/90 placeholder-info-400/40 font-semibold focus:border-info-300 focus:ring-2 focus:ring-info-300/30 transition-all group-hover:shadow-xl group-hover:shadow-info-400/30"
                    />
                  </div>

                  {/* Audit Strategy - WARNING COLOR */}
                  <div className="group relative">
                    <label className="block text-base font-bold text-warning-300 mb-3 uppercase tracking-widest flex items-center gap-2 drop-shadow">
                      <i className="fas fa-chess text-warning-400"></i>
                      Audit Strategy
                    </label>
                    <select
                      value={strategy}
                      onChange={(e) => setStrategy(e.target.value)}
                      className="w-full bg-gradient-to-r from-warning-900/20 to-warning-800/20 border-2 border-warning-400/50 hover:border-warning-400 rounded-xl px-5 py-4 text-warning-100/90 font-semibold focus:border-warning-300 focus:ring-2 focus:ring-warning-300/30 transition-all group-hover:shadow-xl group-hover:shadow-warning-400/30"
                    >
                      <option value="" className="bg-neutral-900 text-warning-100">-- Select Audit Strategy --</option>
                      {auditConfig.auditStrategies.map(s => (
                        <option key={s.id} value={s.name} className="bg-neutral-900 text-warning-100">
                          {s.name} - {s.focus}
                        </option>
                      ))}
                    </select>
                    {strategy && (
                      <p className="text-warning-200 text-sm mt-3 leading-relaxed flex items-start gap-2 bg-warning-400/10 border-2 border-warning-400/30 rounded-xl p-4 font-medium drop-shadow">
                        <i className="fas fa-lightbulb text-warning-400 mt-0.5 flex-shrink-0"></i>
                        {auditConfig.auditStrategies.find(s => s.name === strategy)?.description}
                      </p>
                    )}
                  </div>

                  {/* Planning Period - SUCCESS COLOR */}
                  <div className="group relative">
                    <label className="block text-base font-bold text-success-300 mb-3 uppercase tracking-widest flex items-center gap-2 drop-shadow">
                      <i className="fas fa-calendar-days text-success-400"></i>
                      Planning Period
                    </label>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm text-success-300 block mb-2 font-bold flex items-center gap-2 drop-shadow">
                          <i className="fas fa-play-circle text-sm text-success-400"></i>Start Date
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-gradient-to-r from-success-900/20 to-success-800/20 border-2 border-success-400/50 hover:border-success-400 rounded-xl px-5 py-4 text-success-100/90 font-semibold focus:border-success-300 focus:ring-2 focus:ring-success-300/30 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-success-300 block mb-2 font-bold flex items-center gap-2 drop-shadow">
                          <i className="fas fa-stop-circle text-sm text-success-400"></i>End Date
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-gradient-to-r from-success-900/20 to-success-800/20 border-2 border-success-400/50 hover:border-success-400 rounded-xl px-5 py-4 text-success-100/90 font-semibold focus:border-success-300 focus:ring-2 focus:ring-success-300/30 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Target Audits - PURPLE COLOR */}
                  <div className="group relative">
                    <label className="block text-base font-bold text-purple-300 mb-3 uppercase tracking-widest flex items-center gap-2 drop-shadow">
                      <i className="fas fa-bullseye text-purple-400"></i>
                      Target Auditable Cases
                    </label>
                    <input
                      type="number"
                      value={targetAudits}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setTargetAudits(val);
                        generateDefaultAllocation(val);
                      }}
                      className="w-full bg-gradient-to-r from-purple-900/20 to-purple-800/20 border-2 border-purple-400/50 hover:border-purple-400 rounded-xl px-5 py-4 text-purple-100/90 font-semibold focus:border-purple-300 focus:ring-2 focus:ring-purple-300/30 transition-all group-hover:shadow-xl group-hover:shadow-purple-400/30"
                    />
                    <p className="text-purple-200 text-sm mt-3 leading-relaxed flex items-start gap-2 bg-purple-400/10 border-2 border-purple-400/30 rounded-xl p-4 font-medium drop-shadow">
                      <i className="fas fa-chart-pie text-purple-400 mt-0.5 flex-shrink-0"></i>
                      The system will automatically distribute these {targetAudits.toLocaleString()} cases across audit types and regions based on the Risk Engine's analysis of {auditConfig.getTotalRiskyTaxpayers().toLocaleString()} risky taxpayers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 justify-between mt-12 pt-8 border-t-2 border-white/20">
                  <button 
                    onClick={onClose}
                    className="px-8 py-3 bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white font-bold rounded-xl transition-all flex items-center gap-2 hover:shadow-lg hover:shadow-white/30 transform hover:scale-105 border border-white/30 drop-shadow"
                  >
                    <i className="fas fa-times text-lg"></i>
                    Cancel
                  </button>
                  <button 
                    onClick={() => setActiveStep(2)}
                    className="px-10 py-3 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white font-bold rounded-xl transition-all flex items-center gap-3 hover:shadow-2xl hover:shadow-white/40 transform hover:scale-110 relative overflow-hidden group drop-shadow-lg border-2 border-white/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                    <span className="relative text-lg">Next: Audit Types</span>
                    <i className="fas fa-arrow-right text-base relative"></i>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: AUDIT TYPES - COLORFUL & ATTRACTIVE WITH WHITE ENHANCEMENTS */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <div className="relative p-7 bg-gradient-to-r from-info-900/30 via-info-800/20 to-info-900/30 border-2 border-white/40 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-white/20 transition-all">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 pointer-events-none"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-2 h-8 bg-gradient-to-b from-white via-info-300 to-info-600 rounded-full shadow-lg shadow-white/50"></div>
                      <h2 className="text-3xl font-serif font-bold text-info-100 drop-shadow-lg">Allocate Cases by Audit Type</h2>
                      <i className="fas fa-list-check text-info-300 text-2xl ml-auto drop-shadow"></i>
                    </div>
                    <p className="text-info-200 font-medium ml-6 drop-shadow">The Risk Engine identified <strong className="text-info-100">{auditConfig.getTotalRiskyTaxpayers().toLocaleString()}</strong> risky taxpayers. The system has automatically distributed your target of <strong className="text-info-100">{targetAudits.toLocaleString()} cases</strong> across audit types based on risk proportions. You may edit these defaults.</p>
                  </div>
                </div>

                {/* Risk Engine Breakdown Summary - COLORFUL CARDS WITH WHITE BORDERS */}
                <div className="bg-gradient-to-r from-info-900/30 via-info-800/20 to-info-900/30 border-2 border-white/40 border-l-4 border-l-white rounded-lg p-6 shadow-lg hover:shadow-white/20 transition-all">
                  <h3 className="text-xs uppercase font-semibold tracking-wider text-info-300 mb-4 flex items-center gap-2 drop-shadow">
                    <i className="fas fa-brain text-info-400 text-lg"></i>Risk Engine Analysis
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {auditConfig.auditTypes.map((type, idx) => {
                      const riskEngineCount = riskData?.byAuditType?.find(a => a.id === type.id)?.candidates || Math.round(auditConfig.getTotalRiskyTaxpayers() * 0.15);
                      // Different colors for each audit type
                      const colors = ['from-primary-600 to-primary-500', 'from-info-600 to-info-500', 'from-success-600 to-success-500', 'from-warning-600 to-warning-500', 'from-danger-600 to-danger-500', 'from-purple-600 to-purple-500'];
                      return (
                        <div key={type.id} className={`bg-gradient-to-br ${colors[idx % colors.length]} border-2 border-white/50 rounded-lg p-4 shadow-lg hover:shadow-xl hover:shadow-white/40 transform hover:scale-105 transition-all cursor-pointer`}>
                          <div className="text-xs text-white uppercase tracking-wider font-semibold mb-2 drop-shadow">{type.name}</div>
                          <div className="text-2xl font-bold text-white drop-shadow">{riskEngineCount.toLocaleString()}</div>
                          <div className="text-xs text-white/90 mt-1 drop-shadow">({((riskEngineCount / auditConfig.getTotalRiskyTaxpayers()) * 100).toFixed(1)}%)</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Audit Type Allocation Table - WHITE ENHANCED */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-white via-info-300 to-info-600 rounded-full shadow-lg shadow-white/40"></div>
                    <h3 className="text-sm font-semibold text-info-300 uppercase tracking-wider flex items-center gap-2 drop-shadow">
                      <i className="fas fa-sliders-h text-info-400"></i>Editable Allocation
                    </h3>
                  </div>
                  <div className="bg-gradient-to-r from-info-900/20 to-info-800/20 border-2 border-white/40 rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:shadow-white/20 transition-all">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gradient-to-r from-info-900/40 to-info-800/40 border-b-2 border-white/40">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-info-200 uppercase tracking-wider drop-shadow">Audit Type</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-info-200 uppercase tracking-wider drop-shadow">Complexity</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-info-200 uppercase tracking-wider drop-shadow">Effort/Case</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-info-200 uppercase tracking-wider drop-shadow">Risk Engine</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-info-200 uppercase tracking-wider drop-shadow">Your Allocation</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-info-200 uppercase tracking-wider drop-shadow">% of Total</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-info-200 uppercase tracking-wider drop-shadow">Total Effort</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/20">
                          {auditConfig.auditTypes.map(type => {
                            const riskEngineCandidate = riskData?.byAuditType?.find(a => a.id === type.id)?.candidates || Math.round(auditConfig.getTotalRiskyTaxpayers() * 0.15);
                            const allocated = auditTypeAllocation[type.id] || riskEngineCandidate;
                            const effort = allocated * type.effortPerCase;
                            const totalRisky = auditConfig.getTotalRiskyTaxpayers();
                            const percentOfTotal = totalRisky > 0 ? ((allocated / totalRisky) * 100).toFixed(1) : 0;
                            
                            return (
                              <tr key={type.id} className="hover:bg-white/10 transition-colors">
                                <td className="px-6 py-3 font-semibold text-info-100 drop-shadow">{type.name}</td>
                                <td className="px-6 py-3 text-center"><span className={`inline-block px-2 py-1 rounded text-xs font-semibold border border-white/40 drop-shadow ${type.complexity === 'high' ? 'bg-danger-600/40 text-white' : type.complexity === 'medium' ? 'bg-warning-600/40 text-white' : 'bg-success-600/40 text-white'}`}>{type.complexity}</span></td>
                                <td className="px-6 py-3 text-center text-info-100 drop-shadow">{type.effortPerCase}h</td>
                                <td className="px-6 py-3 text-center text-info-100 drop-shadow">{riskEngineCandidate.toLocaleString()}</td>
                                <td className="px-6 py-3 text-center">
                                  <input
                                    type="number"
                                    value={allocated}
                                    onChange={(e) => handleAuditTypeChange(type.id, e.target.value)}
                                    className="w-24 bg-neutral-800 border-2 border-white/40 hover:border-white/70 rounded px-2 py-1 text-center text-white font-medium focus:border-white focus:ring-2 focus:ring-white/40 transition-all"
                                  />
                                </td>
                                <td className="px-6 py-3 text-center text-info-200 font-semibold drop-shadow">{percentOfTotal}%</td>
                                <td className="px-6 py-3 text-center text-info-200 font-bold drop-shadow">{effort.toLocaleString()}h</td>
                              </tr>
                            );
                          })}
                          <tr className="bg-gradient-to-r from-info-900/40 to-info-800/40 border-t-2 border-white/40 font-bold">
                            <td colSpan="3" className="px-6 py-3 text-info-100 drop-shadow">TOTAL</td>
                            <td className="px-6 py-3 text-center text-info-100 drop-shadow">{auditConfig.getTotalRiskyTaxpayers().toLocaleString()}</td>
                            <td className="px-6 py-3 text-center text-info-100 drop-shadow">{totalCases.toLocaleString()}</td>
                            <td className="px-6 py-3 text-center text-info-100 drop-shadow">100%</td>
                            <td className="px-6 py-3 text-center text-info-100 drop-shadow">{totalEffort.toLocaleString()}h</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Capacity Indicator - WHITE ENHANCED */}
                <div className="bg-gradient-to-r from-success-900/30 to-success-800/30 border-2 border-white/40 border-l-4 border-l-white rounded-lg p-6 shadow-lg hover:shadow-xl hover:shadow-white/20 transition-all">
                  <h3 className="text-xs uppercase font-semibold tracking-wider text-success-300 mb-2 flex items-center gap-2 drop-shadow">
                    <i className="fas fa-battery-full text-success-400 text-lg"></i>Available Capacity
                  </h3>
                  <div className="text-sm text-success-200 drop-shadow">
                    <strong className="text-success-100">{auditConfig.regions.reduce((sum, r) => sum + r.availableAuditors, 0)} auditors</strong> × <strong className="text-success-100">{auditConfig.calculateAvailableHoursPerAuditor()}h/year</strong> = <strong className="text-success-100 text-lg">{Math.round((auditConfig.regions.reduce((sum, r) => sum + r.availableAuditors, 0) * auditConfig.calculateAvailableHoursPerAuditor())).toLocaleString()}h</strong> capacity
                  </div>
                </div>

                <div className="flex gap-3 justify-between mt-8 pt-6 border-t-2 border-white/20">
                  <button 
                    onClick={() => setActiveStep(1)}
                    className="px-6 py-2 bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white font-semibold rounded-xl transition-all flex items-center gap-2 hover:shadow-lg hover:shadow-white/30 border border-white/30 drop-shadow transform hover:scale-105"
                  >
                    <i className="fas fa-arrow-left text-sm"></i>
                    Back
                  </button>
                  <button 
                    onClick={() => setActiveStep(3)}
                    className="px-8 py-2 bg-gradient-to-br from-info-500 via-info-600 to-info-700 hover:from-info-600 hover:via-info-700 hover:to-info-800 text-white font-semibold rounded-xl transition-all flex items-center gap-2 hover:shadow-2xl hover:shadow-white/40 transform hover:scale-105 relative overflow-hidden group drop-shadow-lg border-2 border-white/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                    <span className="relative">Next: Regional Distribution</span>
                    <i className="fas fa-arrow-right text-sm relative"></i>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: REGIONAL DISTRIBUTION - COLORFUL WITH WHITE ENHANCEMENTS */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <div className="relative p-7 bg-gradient-to-r from-warning-900/30 via-warning-800/20 to-warning-900/30 border-2 border-white/40 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-white/20 transition-all">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 pointer-events-none"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-2 h-8 bg-gradient-to-b from-white via-warning-300 to-warning-600 rounded-full shadow-lg shadow-white/50"></div>
                      <h2 className="text-3xl font-serif font-bold text-warning-100 drop-shadow-lg">Regional Distribution</h2>
                      <i className="fas fa-map-location-dot text-warning-300 text-2xl ml-auto drop-shadow"></i>
                    </div>
                    <p className="text-warning-200 font-medium ml-6 drop-shadow">Distribute <strong className="text-warning-100">{totalCases} total cases</strong> across regions based on taxpayer base. You can adjust individual values as needed.</p>
                  </div>
                </div>

                {/* National Audit Type Summary - COLORFUL CARDS WITH WHITE BORDERS */}
                <div className="bg-gradient-to-r from-warning-900/30 via-warning-800/20 to-warning-900/30 border-2 border-white/40 border-l-4 border-l-white rounded-lg p-6 shadow-lg hover:shadow-xl hover:shadow-white/20 transition-all">
                  <h3 className="text-xs uppercase font-semibold tracking-wider text-warning-300 mb-4 flex items-center gap-2 drop-shadow">
                    <i className="fas fa-chart-bar text-warning-400 text-lg"></i>National Audit Type Allocation
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {auditConfig.auditTypes.map((type, idx) => {
                      const allocationValue = auditTypeAllocation[type.id] || 0;
                      const colors = ['from-primary-600 to-primary-500', 'from-info-600 to-info-500', 'from-success-600 to-success-500', 'from-danger-600 to-danger-500', 'from-warning-600 to-warning-500', 'from-purple-600 to-purple-500'];
                      return (
                        <div key={idx} className={`bg-gradient-to-br ${colors[idx % colors.length]} border-2 border-white/50 rounded-lg p-4 shadow-md transform hover:scale-105 transition-transform hover:shadow-lg hover:shadow-white/40`}>
                          <div className="text-xs text-white uppercase tracking-wider font-semibold mb-2 drop-shadow">{type.name}</div>
                          <div className="text-2xl font-bold text-white drop-shadow">{allocationValue}</div>
                          <div className="text-xs text-white/90 mt-1 drop-shadow">cases</div>
                        </div>
                      );
                    })}
                    <div className="bg-gradient-to-br from-success-600 to-success-500 border-2 border-white/50 rounded-lg p-4 shadow-md transform hover:scale-105 transition-transform hover:shadow-lg hover:shadow-white/40">
                      <div className="text-xs text-white uppercase tracking-wider font-semibold mb-2 drop-shadow">Total</div>
                      <div className="text-2xl font-bold text-white drop-shadow">{totalCases}</div>
                      <div className="text-xs text-white/90 mt-1 drop-shadow">cases</div>
                    </div>
                  </div>
                </div>

                {/* Regional Distribution Table - WHITE ENHANCED */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-white via-warning-300 to-warning-600 rounded-full shadow-lg shadow-white/40"></div>
                    <h3 className="text-sm font-semibold text-warning-300 uppercase tracking-wider flex items-center gap-2 drop-shadow">
                      <i className="fas fa-sitemap text-warning-400"></i>Regional Allocation by Audit Type
                    </h3>
                  </div>
                  <div className="bg-gradient-to-r from-warning-900/20 to-warning-800/20 border-2 border-white/40 rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:shadow-white/20 transition-all">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gradient-to-r from-warning-900/40 to-warning-800/40 border-b-2 border-white/40">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-warning-200 uppercase tracking-wider drop-shadow">Region</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-warning-200 uppercase tracking-wider drop-shadow">% Taxpayers</th>
                            {auditConfig.auditTypes.map((type, i) => (
                              <th key={i} className="px-6 py-4 text-center text-xs font-semibold text-warning-200 uppercase tracking-wider drop-shadow">{type.name.substring(0, 12)}</th>
                            ))}
                            <th className="px-6 py-4 text-center text-xs font-semibold text-warning-200 uppercase tracking-wider drop-shadow">TOTAL</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/20">
                          {auditConfig.regions.map(region => {
                            const regionPercent = ((region.taxpayers / auditConfig.getTotalTaxpayers()) * 100).toFixed(1);
                            
                            let regionTotalCases = 0;
                            auditConfig.auditTypes.forEach(type => {
                              const cellValue = regionalAllocation[region.name]?.[type.id] 
                                ? parseInt(regionalAllocation[region.name][type.id])
                                : Math.round((auditTypeAllocation[type.id] || 0) * (region.taxpayers / auditConfig.getTotalTaxpayers()));
                              regionTotalCases += cellValue;
                            });

                            return (
                              <tr key={region.name} className="hover:bg-white/10 transition-colors">
                                <td className="px-6 py-3 font-semibold text-warning-100 drop-shadow"><i className="fas fa-location-dot text-warning-400 mr-2"></i>{region.name}</td>
                                <td className="px-6 py-3 text-center text-warning-100 drop-shadow">{regionPercent}%</td>
                                {auditConfig.auditTypes.map((type, idx) => {
                                  const defaultAllocation = Math.round((auditTypeAllocation[type.id] || 0) * (region.taxpayers / auditConfig.getTotalTaxpayers()));
                                  const currentValue = regionalAllocation[region.name]?.[type.id] || defaultAllocation;
                                  const isOverridden = regionalAllocation[region.name]?.[type.id] !== undefined;
                                  
                                  return (
                                    <td key={idx} className={`px-6 py-3 text-center ${isOverridden ? 'bg-white/10' : ''}`}>
                                      <input
                                        type="number"
                                        value={currentValue}
                                        onChange={(e) => {
                                          const newRegionalAllocation = { ...regionalAllocation };
                                          if (!newRegionalAllocation[region.name]) {
                                            newRegionalAllocation[region.name] = {};
                                          }
                                          newRegionalAllocation[region.name][type.id] = parseInt(e.target.value) || 0;
                                          setRegionalAllocation(newRegionalAllocation);
                                        }}
                                        className="w-16 bg-neutral-800 border-2 border-white/40 hover:border-white/70 rounded px-2 py-1 text-center text-white font-medium focus:border-white focus:ring-2 focus:ring-white/40 transition-all"
                                      />
                                    </td>
                                  );
                                })}
                                <td className="px-6 py-3 text-center font-bold text-warning-100 drop-shadow bg-white/10">{regionTotalCases}</td>
                              </tr>
                            );
                          })}
                          {/* TOTALS ROW */}
                          <tr className="bg-gradient-to-r from-warning-900/40 to-warning-800/40 border-t-2 border-white/40 font-bold">
                            <td className="px-6 py-3 text-warning-100 drop-shadow">TOTAL</td>
                            <td className="px-6 py-3 text-center text-warning-100 drop-shadow">100%</td>
                            {auditConfig.auditTypes.map((type, idx) => {
                              let totalByType = 0;
                              auditConfig.regions.forEach(region => {
                                const cellValue = regionalAllocation[region.name]?.[type.id] 
                                  ? parseInt(regionalAllocation[region.name][type.id])
                                  : Math.round((auditTypeAllocation[type.id] || 0) * (region.taxpayers / auditConfig.getTotalTaxpayers()));
                                totalByType += cellValue;
                              });
                              return (
                                <td key={idx} className="px-6 py-3 text-center text-warning-100 drop-shadow">{totalByType}</td>
                              );
                            })}
                            <td className="px-6 py-3 text-center text-warning-100 drop-shadow">{totalCases}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Info Box - WHITE ENHANCED */}
                <div className="bg-gradient-to-r from-warning-900/30 via-warning-800/20 to-warning-900/30 border-2 border-white/40 border-l-4 border-l-white rounded-lg p-6 shadow-lg hover:shadow-xl hover:shadow-white/20 transition-all">
                  <h3 className="text-xs uppercase font-semibold tracking-wider text-warning-300 mb-2 flex items-center gap-2 drop-shadow">
                    <i className="fas fa-pencil text-warning-400"></i>Editable Fields
                  </h3>
                  <p className="text-sm text-warning-200 drop-shadow">
                    You can adjust any regional allocation. Cells with highlight indicate custom overrides. Column and row totals auto-calculate.
                  </p>
                </div>

                <div className="flex gap-3 justify-between mt-8 pt-6 border-t-2 border-white/20">
                  <button 
                    onClick={() => setActiveStep(2)}
                    className="px-6 py-2 bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white font-semibold rounded-xl transition-all flex items-center gap-2 hover:shadow-lg hover:shadow-white/30 border border-white/30 drop-shadow transform hover:scale-105"
                  >
                    <i className="fas fa-arrow-left text-sm"></i>
                    Back
                  </button>
                  <button 
                    onClick={() => setActiveStep(4)}
                    className="px-8 py-2 bg-gradient-to-br from-warning-500 via-warning-600 to-warning-700 hover:from-warning-600 hover:via-warning-700 hover:to-warning-800 text-white font-semibold rounded-xl transition-all flex items-center gap-2 hover:shadow-2xl hover:shadow-white/40 transform hover:scale-105 relative overflow-hidden group drop-shadow-lg border-2 border-white/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                    <span className="relative">Next: Final Review</span>
                    <i className="fas fa-arrow-right text-sm relative"></i>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & SUBMIT - COLORFUL & CELEBRATORY WITH WHITE ENHANCEMENTS */}
            {activeStep === 4 && (
              <div className="space-y-6">
                <div className="relative p-7 bg-gradient-to-r from-success-900/30 via-success-800/20 to-success-900/30 border-2 border-white/40 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-white/20 transition-all">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 pointer-events-none"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-2 h-8 bg-gradient-to-b from-white via-success-300 to-success-600 rounded-full shadow-lg shadow-white/50 animate-pulse"></div>
                      <h2 className="text-3xl font-serif font-bold text-success-100 drop-shadow-lg">Final Review & Submit</h2>
                      <i className="fas fa-star text-success-300 text-2xl ml-auto drop-shadow animate-pulse"></i>
                    </div>
                    <p className="text-success-200 font-medium ml-6 drop-shadow">Verify your plan details before submitting to director</p>
                  </div>
                </div>

                {/* VALIDATION ERRORS - RED ERROR BOX WITH WHITE ACCENTS */}
                {validationErrors.length > 0 && (
                  <div className="bg-gradient-to-r from-danger-900/30 via-danger-800/20 to-danger-900/30 border-2 border-white/40 border-l-4 border-l-white rounded-lg p-6 shadow-lg hover:shadow-xl hover:shadow-white/20 transition-all">
                    <h3 className="text-xs uppercase font-semibold tracking-wider text-danger-300 mb-3 flex items-center gap-2 drop-shadow">
                      <i className="fas fa-circle-exclamation text-danger-400 text-lg"></i>Validation Issues
                    </h3>
                    <ul className="space-y-2">
                      {validationErrors.map((error, idx) => (
                        <li key={idx} className="text-sm text-danger-200 flex items-start gap-2 drop-shadow">
                          <i className="fas fa-triangle-exclamation text-danger-400 mt-1 flex-shrink-0"></i>
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* PLAN SUMMARY - KPI STYLE WITH COLORS & WHITE BORDERS */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-gradient-to-br from-primary-900/50 to-primary-800/50 border-2 border-white/40 border-l-4 border-l-white rounded-lg p-6 shadow-lg hover:shadow-xl hover:shadow-white/40 transition-all transform hover:scale-105">
                    <h3 className="text-xs uppercase font-semibold tracking-wider text-primary-300 mb-2 flex items-center gap-2 drop-shadow">
                      <i className="fas fa-document text-primary-400"></i>Plan Name
                    </h3>
                    <div className="text-xl font-bold text-primary-100 drop-shadow">{planName}</div>
                  </div>
                  <div className="bg-gradient-to-br from-info-900/50 to-info-800/50 border-2 border-white/40 border-l-4 border-l-white rounded-lg p-6 shadow-lg hover:shadow-xl hover:shadow-white/40 transition-all transform hover:scale-105">
                    <h3 className="text-xs uppercase font-semibold tracking-wider text-info-300 mb-2 flex items-center gap-2 drop-shadow">
                      <i className="fas fa-calendar text-info-400"></i>Fiscal Year
                    </h3>
                    <div className="text-xl font-bold text-info-100 drop-shadow">{year}</div>
                  </div>
                  <div className="bg-gradient-to-br from-warning-900/50 to-warning-800/50 border-2 border-white/40 border-l-4 border-l-white rounded-lg p-6 shadow-lg hover:shadow-xl hover:shadow-white/40 transition-all transform hover:scale-105">
                    <h3 className="text-xs uppercase font-semibold tracking-wider text-warning-300 mb-2 flex items-center gap-2 drop-shadow">
                      <i className="fas fa-inbox text-warning-400"></i>Total Cases
                    </h3>
                    <div className="text-xl font-bold text-warning-100 drop-shadow">{(totalCases || 0).toLocaleString()}</div>
                  </div>
                  <div className="bg-gradient-to-br from-success-900/50 to-success-800/50 border-2 border-white/40 border-l-4 border-l-white rounded-lg p-6 shadow-lg hover:shadow-xl hover:shadow-white/40 transition-all transform hover:scale-105">
                    <h3 className="text-xs uppercase font-semibold tracking-wider text-success-300 mb-2 flex items-center gap-2 drop-shadow">
                      <i className="fas fa-fire text-success-400"></i>Total Effort
                    </h3>
                    <div className="text-xl font-bold text-success-100 drop-shadow">{(totalEffort || 0).toLocaleString()}h</div>
                  </div>
                </div>

                {/* PLAN DETAILS - COLORFUL CARDS WITH WHITE BORDERS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-primary-900/30 to-primary-800/30 border-2 border-white/40 rounded-lg p-6 hover:shadow-lg hover:shadow-white/20 transition-all">
                    <p className="text-xs uppercase font-semibold tracking-wider text-primary-300 mb-3 flex items-center gap-2 drop-shadow">
                      <i className="fas fa-chess text-primary-400"></i>Audit Strategy
                    </p>
                    <p className="text-primary-100 font-semibold text-lg drop-shadow">{strategy || 'Not selected'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-info-900/30 to-info-800/30 border-2 border-white/40 rounded-lg p-6 hover:shadow-lg hover:shadow-white/20 transition-all">
                    <p className="text-xs uppercase font-semibold tracking-wider text-info-300 mb-3 flex items-center gap-2 drop-shadow">
                      <i className="fas fa-calendar-days text-info-400"></i>Planning Period
                    </p>
                    <p className="text-info-100 font-semibold text-lg drop-shadow">{startDate} → {endDate}</p>
                  </div>
                  <div className="bg-gradient-to-br from-warning-900/30 to-warning-800/30 border-2 border-white/40 rounded-lg p-6 hover:shadow-lg hover:shadow-white/20 transition-all">
                    <p className="text-xs uppercase font-semibold tracking-wider text-warning-300 mb-3 flex items-center gap-2 drop-shadow">
                      <i className="fas fa-tasks text-warning-400"></i>Audit Types Allocated
                    </p>
                    <p className="text-warning-100 font-semibold text-lg drop-shadow">{Object.values(auditTypeAllocation).filter(v => v > 0).length} types</p>
                  </div>
                  <div className="bg-gradient-to-br from-success-900/30 to-success-800/30 border-2 border-white/40 rounded-lg p-6 hover:shadow-lg hover:shadow-white/20 transition-all">
                    <p className="text-xs uppercase font-semibold tracking-wider text-success-300 mb-3 flex items-center gap-2 drop-shadow">
                      <i className="fas fa-map-pin text-success-400"></i>Regions Covered
                    </p>
                    <p className="text-success-100 font-semibold text-lg drop-shadow">{auditConfig.regions.length} regions</p>
                  </div>
                </div>

                {/* ACTION BUTTONS - COLORFUL & PROMINENT WITH WHITE */}
                <div className="flex gap-3 justify-between mt-8 pt-6 border-t-2 border-white/20">
                  <button 
                    onClick={() => setActiveStep(3)}
                    className="px-6 py-2 bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white font-semibold rounded-xl transition-all flex items-center gap-2 hover:shadow-lg hover:shadow-white/30 border border-white/30 drop-shadow transform hover:scale-105"
                  >
                    <i className="fas fa-arrow-left text-sm"></i>
                    Back
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveDraft}
                      disabled={validationErrors.length > 0}
                      className="px-8 py-2 bg-gradient-to-br from-warning-500 via-warning-600 to-warning-700 hover:from-warning-600 hover:via-warning-700 hover:to-warning-800 disabled:from-neutral-600 disabled:via-neutral-600 disabled:to-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center gap-2 hover:shadow-2xl hover:shadow-white/40 transform hover:scale-105 relative overflow-hidden group drop-shadow-lg border-2 border-white/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                      <i className="fas fa-save text-sm relative"></i>
                      <span className="relative">Save as Draft</span>
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={validationErrors.length > 0}
                      className="px-8 py-2 bg-gradient-to-br from-success-500 via-success-600 to-success-700 hover:from-success-600 hover:via-success-700 hover:to-success-800 disabled:from-neutral-600 disabled:via-neutral-600 disabled:to-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center gap-2 hover:shadow-2xl hover:shadow-white/40 transform hover:scale-105 relative overflow-hidden group drop-shadow-lg border-2 border-white/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                      <i className="fas fa-paper-plane text-sm relative"></i>
                      <span className="relative">Submit to Director</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="border-t border-neutral-700 bg-neutral-800 px-8 py-4 flex-shrink-0">
          <p className="text-xs text-neutral-500">All fields are required before submitting. You can save as draft and edit later.</p>
        </div>
      </div>
    </div>
  );
}

export default CreateAnnualPlanModal;
