import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Badge from '../Badge';
import RegionSelectorCards from '../RegionSelectorCards';
import { useData } from '../../services/dataService';
import { auditConfig } from '../../config/auditConfig';
import { useRegional } from '../../context/RegionalContext';
import { getDisplayRegionName } from '../../utils/regionNormalizer';

function RiskEngineView({ userRole: propUserRole, selectedRegion: propSelectedRegion }) {
  const contextData = useRegional();
  const contextUserRole = contextData?.userRole;
  const contextSelectedRegion = contextData?.selectedRegion;
  const setSelectedRegionContext = contextData?.setSelectedRegion;
  const assignedRegion = contextData?.assignedRegion;
  
  // Use prop if provided, otherwise use context
  const userRole = propUserRole || contextUserRole;
  const selectedRegion = propSelectedRegion || contextSelectedRegion;
  const setSelectedRegion = (region) => {
    if (setSelectedRegionContext) setSelectedRegionContext(region);
  };
  
  const [level, setLevel] = useState(1);
  const { data, updateData } = useData(); // 1=National, 2=Regional, 3=TaxCenter, 4=Taxpayer
  const [localSelectedRegion, setLocalSelectedRegion] = useState(selectedRegion || null);
  const [selectedTaxCenter, setSelectedTaxCenter] = useState(null);
  const [selectedTaxpayer, setSelectedTaxpayer] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [showRegionSelector, setShowRegionSelector] = useState(true);

  useEffect(() => {
    loadRiskData();
    
    // For regional directors and tax center managers, they need to select region first
    if (userRole === 'regional') {
      setLevel(2);  // Will show regional level (but after region selection)
      // Only show selector if no region selected yet
      setShowRegionSelector(!localSelectedRegion);
    } else if (userRole === 'tax_center') {
      setLevel(3);  // Will show tax center level
      // Only show selector if no region selected yet
      setShowRegionSelector(!localSelectedRegion);
    } else {
      // All other roles (audit_team, director, senior_management) see national view
      setLevel(1);  // National level
      setShowRegionSelector(false); // No selector needed for national view
    }
  }, [userRole]);

  const loadRiskData = () => {
    // Using data from hook
    // Check if riskEngine exists and has data (must have 'national' key)
    setRiskData((data.riskEngine && data.riskEngine.national) ? data.riskEngine : generateDefaultRiskData());
  };

  // Handler for region selection that advances to regional view
  const handleRegionSelect = (region) => {
    setLocalSelectedRegion(region);
    setSelectedRegion(region);
    setShowRegionSelector(false);
  };

  // If regional director or tax center manager, they must select region first
  if ((userRole === 'regional' || userRole === 'tax_center') && showRegionSelector) {
    return (
      <RegionSelectorCards
        onRegionSelect={handleRegionSelect}
        currentRegion={localSelectedRegion}
        userRole={userRole}
        assignedRegion={assignedRegion}
      />
    );
  }

  const generateDefaultRiskData = () => {
    // National level data
    const national = {
      totalRegistered: 5200000,
      activeTaxpayers: 4850000,
      assessedTaxpayers: 4820000,
      riskySuspects: 430000,
      riskDistribution: {
        low: 180000,
        medium: 150000,
        high: 80000,
        critical: 20000,
      },
      revenueAtRisk: 12400000000,
      byAuditType: [
        { type: 'Desk Audit', candidates: 55000 },
        { type: 'Field Audit', candidates: 35000 },
        { type: 'Joint Audit', candidates: 18000 },
        { type: 'Transfer Pricing', candidates: 7500 },
        { type: 'Comprehensive', candidates: 650 },
        { type: 'Single Issue', candidates: 300 }
      ],
      byIndustry: [
        { industry: 'Construction', highRisk: 18000 },
        { industry: 'Manufacturing', highRisk: 15000 },
        { industry: 'Wholesale', highRisk: 12000 },
        { industry: 'Import/Export', highRisk: 9500 },
        { industry: 'Services', highRisk: 8000 },
        { industry: 'Retail', highRisk: 17500 }
      ],
      byTaxType: [
        { type: 'VAT', risky: 80000 },
        { type: 'Corporate Income Tax', risky: 55000 },
        { type: 'Payroll Tax', risky: 25000 },
        { type: 'Excise Tax', risky: 8000 },
        { type: 'Other', risky: 282000 }
      ],
      riskIndicators: [
        { indicator: 'Late Filing', taxpayers: 120000 },
        { indicator: 'Late Payment', taxpayers: 90000 },
        { indicator: 'VAT Mismatch', taxpayers: 45000 },
        { indicator: 'Continuous Losses', taxpayers: 30000 },
        { indicator: 'Import vs Sales Mismatch', taxpayers: 18000 },
        { indicator: 'Large Variance', taxpayers: 127000 }
      ],
      complianceSummary: {
        filingCompliance: 92.5,
        paymentCompliance: 87.3,
        registrationCompliance: 95.8
      }
    };

    // Regional data
    const regionalBreakdown = auditConfig.regions.map(region => ({
      name: region.name,
      totalTaxpayers: region.taxpayers * 12,
      riskySuspects: Math.round(region.taxpayers * 12 * 0.078),
      highRisk: Math.round(region.taxpayers * 12 * 0.018),
      critical: Math.round(region.taxpayers * 12 * 0.003),
      revenueAtRisk: Math.round(region.taxpayers * 12 * 300000),
      auditTypeCandidates: [
        { type: 'Desk Audit', candidates: Math.round(region.taxpayers * 12 * 0.078 * 0.35) },
        { type: 'Field Audit', candidates: Math.round(region.taxpayers * 12 * 0.078 * 0.25) },
        { type: 'Joint Audit', candidates: Math.round(region.taxpayers * 12 * 0.078 * 0.15) },
        { type: 'Transfer Pricing', candidates: Math.round(region.taxpayers * 12 * 0.078 * 0.08) },
        { type: 'Comprehensive', candidates: Math.round(region.taxpayers * 12 * 0.078 * 0.12) },
        { type: 'Single Issue', candidates: Math.round(region.taxpayers * 12 * 0.078 * 0.05) }
      ],
      taxTypeBreakdown: [
        { type: 'VAT', risky: Math.round(region.taxpayers * 12 * 0.078 * 0.35) },
        { type: 'Corporate Income Tax', risky: Math.round(region.taxpayers * 12 * 0.078 * 0.30) },
        { type: 'Payroll Tax', risky: Math.round(region.taxpayers * 12 * 0.078 * 0.18) },
        { type: 'Excise Tax', risky: Math.round(region.taxpayers * 12 * 0.078 * 0.10) },
        { type: 'Other', risky: Math.round(region.taxpayers * 12 * 0.078 * 0.07) }
      ],
      taxCenters: generateTaxCenters(region)
    }));

    return {
      national,
      regional: regionalBreakdown
    };
  };

  const generateTaxCenters = (region) => {
    return [
      {
        id: `${region.name}-TC1`,
        name: `${region.name} Tax Center 1`,
        totalTaxpayers: Math.round(region.taxpayers * 12 * 0.4),
        highRisk: Math.round(region.taxpayers * 12 * 0.018 * 0.4),
        critical: Math.round(region.taxpayers * 12 * 0.003 * 0.4),
        revenueAtRisk: Math.round(region.taxpayers * 12 * 300000 * 0.4),
        auditTypeCandidates: generateAuditTypeCandidates(region, 0.4),
        taxTypeBreakdown: generateTaxTypeBreakdown(region, 0.4),
        taxpayers: generateTaxpayerDetails(region, 0.4)
      },
      {
        id: `${region.name}-TC2`,
        name: `${region.name} Tax Center 2`,
        totalTaxpayers: Math.round(region.taxpayers * 12 * 0.3),
        highRisk: Math.round(region.taxpayers * 12 * 0.018 * 0.3),
        critical: Math.round(region.taxpayers * 12 * 0.003 * 0.3),
        revenueAtRisk: Math.round(region.taxpayers * 12 * 300000 * 0.3),
        auditTypeCandidates: generateAuditTypeCandidates(region, 0.3),
        taxTypeBreakdown: generateTaxTypeBreakdown(region, 0.3),
        taxpayers: generateTaxpayerDetails(region, 0.3)
      },
      {
        id: `${region.name}-TC3`,
        name: `${region.name} Tax Center 3`,
        totalTaxpayers: Math.round(region.taxpayers * 12 * 0.3),
        highRisk: Math.round(region.taxpayers * 12 * 0.018 * 0.3),
        critical: Math.round(region.taxpayers * 12 * 0.003 * 0.3),
        revenueAtRisk: Math.round(region.taxpayers * 12 * 300000 * 0.3),
        auditTypeCandidates: generateAuditTypeCandidates(region, 0.3),
        taxTypeBreakdown: generateTaxTypeBreakdown(region, 0.3),
        taxpayers: generateTaxpayerDetails(region, 0.3)
      }
    ];
  };

  const generateAuditTypeCandidates = (region, proportion) => {
    const total = Math.round(region.taxpayers * 12 * 0.078 * proportion);
    return [
      { type: 'Desk Audit', candidates: Math.round(total * 0.35) },
      { type: 'Field Audit', candidates: Math.round(total * 0.25) },
      { type: 'Joint Audit', candidates: Math.round(total * 0.15) },
      { type: 'Transfer Pricing', candidates: Math.round(total * 0.08) },
      { type: 'Comprehensive', candidates: Math.round(total * 0.12) },
      { type: 'Single Issue', candidates: Math.round(total * 0.05) }
    ];
  };

  const generateTaxTypeBreakdown = (region, proportion) => {
    const total = Math.round(region.taxpayers * 12 * 0.078 * proportion);
    return [
      { type: 'VAT', risky: Math.round(total * 0.35) },
      { type: 'Corporate Income Tax', risky: Math.round(total * 0.30) },
      { type: 'Payroll Tax', risky: Math.round(total * 0.18) },
      { type: 'Excise Tax', risky: Math.round(total * 0.10) },
      { type: 'Other', risky: Math.round(total * 0.07) }
    ];
  };

  const generateTaxpayerDetails = (region, proportion) => {
    const count = Math.min(20, Math.round(region.taxpayers * 12 * 0.018 * proportion)); // Show top 20
    const taxpayers = [];
    
    for (let i = 0; i < count; i++) {
      const tin = `ET${String(100001 + i).padStart(6, '0')}`;
      const riskScore = Math.round(50 + Math.random() * 50); // 50-100
      const riskLevel = riskScore >= 85 ? 'Critical' : riskScore >= 70 ? 'High' : 'Medium';
      
      taxpayers.push({
        tin,
        businessName: `Business Name ${i + 1}`,
        businessType: ['Construction', 'Manufacturing', 'Wholesale', 'Retail', 'Services'][Math.floor(Math.random() * 5)],
        riskScore,
        riskLevel,
        revenueAtRisk: Math.round(500000 + Math.random() * 4500000),
        recommendedAuditType: ['Desk Audit', 'Field Audit', 'Comprehensive'][Math.floor(Math.random() * 3)],
        riskIndicators: [
          {
            indicator: 'Late Filing',
            evidence: `Filed ${2 + Math.floor(Math.random() * 8)} times late in past year`,
            severity: 'Medium'
          },
          {
            indicator: 'VAT Mismatch',
            evidence: `VAT variance of ${Math.round(100 + Math.random() * 900)}K ETB detected`,
            severity: riskLevel === 'Critical' ? 'High' : 'Medium'
          },
          {
            indicator: 'Late Payments',
            evidence: `${1 + Math.floor(Math.random() * 4)} late payments totaling ${Math.round(200000 + Math.random() * 1800000)} ETB`,
            severity: 'Medium'
          },
          {
            indicator: 'Import vs Sales',
            evidence: `Import purchases ${Math.round(20 + Math.random() * 80)}% higher than sales recorded`,
            severity: riskLevel === 'Critical' ? 'High' : 'Low'
          }
        ],
        lastAudit: Math.random() > 0.7 ? '2023' : '2022',
        complianceHistory: 'Generally compliant with some late filings'
      });
    }
    
    return taxpayers;
  };

  // Level 1: National View (MOR)
  const renderNationalView = () => {
    if (!riskData) return null;
    const { national } = riskData;

    return (
      <div className="space-y-6 p-8 bg-neutral-900 min-h-screen">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-primary-600 rounded-sm"></div>
            <h1 className="text-3xl font-serif font-bold text-neutral-50">Risk Engine - National Level</h1>
          </div>
          <p className="text-neutral-400 text-sm">Ministry of Revenue (MOR) — Taxpayer risk analysis and audit candidate allocation</p>
        </div>

        {/* KPI Cards - 4 Column Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-neutral-800 border border-neutral-700 border-l-4 border-l-primary-600 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2 break-words line-clamp-2">Total Registered</h3>
            <div className="text-2xl font-bold leading-tight mb-2 text-neutral-50 break-words line-clamp-2">{(national.totalRegistered || 0).toLocaleString()}</div>
            <div className="text-lg text-neutral-400 opacity-75"><i className="fas fa-users"></i></div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 border-l-4 border-l-info-600 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2 break-words line-clamp-2">Active Taxpayers</h3>
            <div className="text-2xl font-bold leading-tight mb-2 text-neutral-50 break-words line-clamp-2">{(national.activeTaxpayers || 0).toLocaleString()}</div>
            <div className="text-lg text-neutral-400 opacity-75"><i className="fas fa-user-check"></i></div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 border-l-4 border-l-warning-600 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2 break-words line-clamp-2">Risky Suspects</h3>
            <div className="text-2xl font-bold leading-tight mb-2 text-neutral-50 break-words line-clamp-2">{(national.riskySuspects || 0).toLocaleString()}</div>
            <div className="text-lg text-neutral-400 opacity-75"><i className="fas fa-exclamation-circle"></i></div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 border-l-4 border-l-danger-600 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2 break-words line-clamp-2">Revenue at Risk</h3>
            <div className="text-2xl font-bold leading-tight mb-2 text-neutral-50 break-words line-clamp-2">{((national.revenueAtRisk || 0) / 1000000000).toFixed(1)}B ETB</div>
            <div className="text-lg text-neutral-400 opacity-75"><i className="fas fa-dollar-sign"></i></div>
          </div>
        </div>

        {/* Section Header - Risk Distribution */}
        <div className="pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-primary-600 rounded-sm"></div>
            <h2 className="text-2xl font-serif font-bold text-neutral-50">Risk Distribution</h2>
          </div>
        </div>

        {/* Risk Distribution Table */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-800 border-b border-neutral-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">Risk Level</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-300 uppercase tracking-wider">Taxpayers</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-300 uppercase tracking-wider">% of Total</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-300 uppercase tracking-wider">% of Risky</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                <tr className="hover:bg-neutral-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-success-400"><i className="fas fa-check-circle mr-2"></i>Low Risk</td>
                  <td className="px-6 py-4 text-sm text-right text-neutral-300">{(national.riskDistribution?.low || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-right text-neutral-400">{((national.riskDistribution?.low || 0) / national.totalRegistered * 100).toFixed(2)}%</td>
                  <td className="px-6 py-4 text-sm text-right text-neutral-400">-</td>
                </tr>
                <tr className="hover:bg-neutral-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-warning-400"><i className="fas fa-exclamation mr-2"></i>Medium Risk</td>
                  <td className="px-6 py-4 text-sm text-right text-neutral-300">{(national.riskDistribution?.medium || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-right text-neutral-400">{((national.riskDistribution?.medium || 0) / national.totalRegistered * 100).toFixed(2)}%</td>
                  <td className="px-6 py-4 text-sm text-right text-neutral-400">{((national.riskDistribution?.medium || 0) / (national.riskySuspects || 1) * 100).toFixed(1)}%</td>
                </tr>
                <tr className="hover:bg-neutral-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-amber-400"><i className="fas fa-exclamation-triangle mr-2"></i>High Risk</td>
                  <td className="px-6 py-4 text-sm text-right text-neutral-300">{(national.riskDistribution?.high || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-right text-neutral-400">{((national.riskDistribution?.high || 0) / national.totalRegistered * 100).toFixed(2)}%</td>
                  <td className="px-6 py-4 text-sm text-right text-neutral-400">{((national.riskDistribution?.high || 0) / (national.riskySuspects || 1) * 100).toFixed(1)}%</td>
                </tr>
                <tr className="hover:bg-neutral-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-danger-400"><i className="fas fa-skull-crossbones mr-2"></i>Critical Risk</td>
                  <td className="px-6 py-4 text-sm text-right text-neutral-300">{(national.riskDistribution?.critical || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-right text-neutral-400">{((national.riskDistribution?.critical || 0) / national.totalRegistered * 100).toFixed(2)}%</td>
                  <td className="px-6 py-4 text-sm text-right text-neutral-400">{((national.riskDistribution?.critical || 0) / (national.riskySuspects || 1) * 100).toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section Header - Audit Type Candidates */}
        <div className="pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-info-600 rounded-sm"></div>
            <h2 className="text-2xl font-serif font-bold text-neutral-50">Audit Type Candidates</h2>
          </div>
        </div>

        {/* Audit Type Table */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-800 border-b border-neutral-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">Audit Type</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-300 uppercase tracking-wider">Candidates</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-300 uppercase tracking-wider">% of Risky</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {(national.byAuditType || []).map((item, i) => (
                  <tr key={i} className="hover:bg-neutral-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-neutral-50">{item.type}</td>
                    <td className="px-6 py-4 text-sm text-right text-neutral-300">{(item.candidates || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-right text-neutral-400">{((item.candidates || 0) / (national.riskySuspects || 1) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
                <tr className="bg-primary-900/20 border-t-2 border-primary-600 font-semibold">
                  <td className="px-6 py-4 text-sm text-primary-300">TOTAL CANDIDATES</td>
                  <td className="px-6 py-4 text-sm text-right text-primary-300">{((national.byAuditType || []).reduce((sum, item) => sum + (item.candidates || 0), 0)).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-right text-primary-300">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section Header - Risk by Tax Type */}
        <div className="pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-warning-600 rounded-sm"></div>
            <h2 className="text-2xl font-serif font-bold text-neutral-50">Risk by Tax Type</h2>
          </div>
        </div>

        {/* Tax Type Table */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-800 border-b border-neutral-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">Tax Type</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-300 uppercase tracking-wider">Risky Taxpayers</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-300 uppercase tracking-wider">% of Total Risky</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {(national.byTaxType || []).map((item, i) => (
                  <tr key={i} className="hover:bg-neutral-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-neutral-50">{item.type}</td>
                    <td className="px-6 py-4 text-sm text-right text-neutral-300">{(item.risky || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-right text-neutral-400">{((item.risky || 0) / (national.riskySuspects || 1) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
                <tr className="bg-primary-900/20 border-t-2 border-primary-600 font-semibold">
                  <td className="px-6 py-4 text-sm text-primary-300">TOTAL RISKY</td>
                  <td className="px-6 py-4 text-sm text-right text-primary-300">{((national.byTaxType || []).reduce((sum, item) => sum + (item.risky || 0), 0)).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-right text-primary-300">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section Header - Risk by Industry */}
        <div className="pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-success-600 rounded-sm"></div>
            <h2 className="text-2xl font-serif font-bold text-neutral-50">Risk by Industry</h2>
          </div>
        </div>

        {/* Industry Table */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-800 border-b border-neutral-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">Industry</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-300 uppercase tracking-wider">High-Risk Taxpayers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {(national.byIndustry || []).map((item, i) => (
                  <tr key={i} className="hover:bg-neutral-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-neutral-50">{item.industry}</td>
                    <td className="px-6 py-4 text-sm text-right text-neutral-300">{(item.highRisk || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3 pt-4">
          {userRole !== 'regional' && userRole !== 'tax_center' && (
            <button 
              onClick={() => { setLevel(2); }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <i className="fas fa-map"></i>
              View by Region
            </button>
          )}
        </div>
      </div>
    );
  };

  // Level 2: Regional View - Shows ONLY selected region data (NO national data visible)
  const renderRegionalView = () => {
    if (!riskData || !localSelectedRegion) return null;
    const region = riskData.regional.find(r => r.name === localSelectedRegion);
    if (!region) return null;
    
    const isAssignedRegion = userRole === 'regional' && localSelectedRegion === assignedRegion;

    return (
      <div className="space-y-6 p-8 bg-neutral-900 min-h-screen">
        {/* Navigation */}
        <div className="flex justify-start mb-4">
          {userRole === 'regional' || userRole === 'tax_center' ? (
            <button 
              onClick={() => setShowRegionSelector(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-50 font-semibold rounded-lg transition-all duration-200"
            >
              <i className="fas fa-exchange-alt"></i>
              Select Different Region
            </button>
          ) : (
            <button 
              onClick={() => { setLevel(1); setLocalSelectedRegion(null); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-50 font-semibold rounded-lg transition-all duration-200"
            >
              <i className="fas fa-arrow-left"></i>
              Back to National View
            </button>
          )}
        </div>

        {/* Page Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-primary-600 rounded-sm"></div>
            <h1 className="text-3xl font-serif font-bold text-neutral-50">{getDisplayRegionName(localSelectedRegion)} Region - Risk Analysis</h1>
          </div>
          <p className="text-neutral-400 text-sm">
            {isAssignedRegion ? '✓ Your assigned region ' : ''}Regional taxpayer risk assessment and audit candidate distribution
          </p>
        </div>

        {/* Regional Scope Alert */}
        <div className="bg-warning-900/30 border border-warning-700 rounded-lg p-4">
          <p className="text-warning-300 text-sm">
            <i className="fas fa-info-circle mr-2"></i>
            <strong>Regional Data Only:</strong> All metrics below show data for {localSelectedRegion} region only. National aggregates are not included.
          </p>
        </div>

        {/* KPI Cards - 5 Column Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="bg-neutral-800 border border-neutral-700 border-l-4 border-l-info-600 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2">Total Taxpayers</h3>
            <div className="text-4xl font-bold leading-none mb-2 text-neutral-50">{(region.totalTaxpayers || 0).toLocaleString()}</div>
            <div className="text-2xl text-neutral-400 opacity-75"><i className="fas fa-users"></i></div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 border-l-4 border-l-warning-600 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2">Risky Suspects</h3>
            <div className="text-4xl font-bold leading-none mb-2 text-neutral-50">{(region.riskySuspects || 0).toLocaleString()}</div>
            <div className="text-2xl text-neutral-400 opacity-75"><i className="fas fa-exclamation-circle"></i></div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 border-l-4 border-l-amber-600 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2">High Risk</h3>
            <div className="text-4xl font-bold leading-none mb-2 text-neutral-50">{(region.highRisk || 0).toLocaleString()}</div>
            <div className="text-2xl text-neutral-400 opacity-75"><i className="fas fa-exclamation-triangle"></i></div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 border-l-4 border-l-danger-600 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2">Critical Risk</h3>
            <div className="text-4xl font-bold leading-none mb-2 text-neutral-50">{(region.critical || 0).toLocaleString()}</div>
            <div className="text-2xl text-neutral-400 opacity-75"><i className="fas fa-skull-crossbones"></i></div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 border-l-4 border-l-primary-600 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2">Revenue at Risk</h3>
            <div className="text-4xl font-bold leading-none mb-2 text-neutral-50">{((region.revenueAtRisk || 0) / 1000000).toFixed(0)}M ETB</div>
            <div className="text-2xl text-neutral-400 opacity-75"><i className="fas fa-dollar-sign"></i></div>
          </div>
        </div>

        {/* Section Header - Audit Types */}
        <div className="pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-info-600 rounded-sm"></div>
            <h2 className="text-2xl font-serif font-bold text-neutral-50">Audit Type Candidates in {getDisplayRegionName(localSelectedRegion)}</h2>
          </div>
        </div>

        {/* Audit Type Table */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-800 border-b border-neutral-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">Audit Type</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-300 uppercase tracking-wider">Candidates</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-300 uppercase tracking-wider">% of Risky</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {(region.auditTypeCandidates || []).map((item, i) => (
                  <tr key={i} className="hover:bg-neutral-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-neutral-50">{item.type}</td>
                    <td className="px-6 py-4 text-sm text-right text-neutral-300">{(item.candidates || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-right text-neutral-400">{((item.candidates || 0) / (region.riskySuspects || 1) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
                <tr className="bg-primary-900/20 border-t-2 border-primary-600 font-semibold">
                  <td className="px-6 py-4 text-sm text-primary-300">TOTAL IN {localSelectedRegion.toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm text-right text-primary-300">{((region.auditTypeCandidates || []).reduce((sum, item) => sum + (item.candidates || 0), 0)).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-right text-primary-300">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section Header - Tax Types */}
        <div className="pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-warning-600 rounded-sm"></div>
            <h2 className="text-2xl font-serif font-bold text-neutral-50">Risk by Tax Type in {getDisplayRegionName(localSelectedRegion)}</h2>
          </div>
        </div>

        {/* Tax Type Table */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-800 border-b border-neutral-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">Tax Type</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-300 uppercase tracking-wider">Risky Taxpayers</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-300 uppercase tracking-wider">% of Risky</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {(region.taxTypeBreakdown || []).map((item, i) => (
                  <tr key={i} className="hover:bg-neutral-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-neutral-50">{item.type}</td>
                    <td className="px-6 py-4 text-sm text-right text-neutral-300">{(item.risky || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-right text-neutral-400">{((item.risky || 0) / (region.riskySuspects || 1) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
                <tr className="bg-primary-900/20 border-t-2 border-primary-600 font-semibold">
                  <td className="px-6 py-4 text-sm text-primary-300">TOTAL RISKY IN {localSelectedRegion.toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm text-right text-primary-300">{((region.taxTypeBreakdown || []).reduce((sum, item) => sum + (item.risky || 0), 0)).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-right text-primary-300">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section Header - Tax Centers */}
        <div className="pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-success-600 rounded-sm"></div>
            <h2 className="text-2xl font-serif font-bold text-neutral-50">Tax Centers in {getDisplayRegionName(localSelectedRegion)}</h2>
          </div>
        </div>

        {/* Tax Centers Table */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-800 border-b border-neutral-700">
                  <th className="px-6 py-4 text-left font-semibold text-neutral-300 uppercase tracking-wider">Tax Center</th>
                  <th className="px-6 py-4 text-right font-semibold text-neutral-300 uppercase tracking-wider">Taxpayers</th>
                  <th className="px-6 py-4 text-right font-semibold text-neutral-300 uppercase tracking-wider">High Risk</th>
                  <th className="px-6 py-4 text-right font-semibold text-neutral-300 uppercase tracking-wider">Critical</th>
                  <th className="px-6 py-4 text-right font-semibold text-neutral-300 uppercase tracking-wider">Revenue at Risk</th>
                  <th className="px-6 py-4 text-center font-semibold text-neutral-300 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {(region.taxCenters || []).map((tc, i) => (
                  <tr key={i} className="hover:bg-neutral-700/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-neutral-50">{tc.name}</td>
                    <td className="px-6 py-4 text-right text-neutral-300">{(tc.totalTaxpayers || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-neutral-300">{(tc.highRisk || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-neutral-300">{(tc.critical || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-neutral-300">{((tc.revenueAtRisk || 0) / 1000000).toFixed(0)}M ETB</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => { setLevel(3); setSelectedTaxCenter(tc); }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-success-600 hover:bg-success-700 text-white text-xs font-semibold rounded transition-all duration-200"
                      >
                        <i className="fas fa-eye"></i>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Level 3: Tax Center View
  const renderTaxCenterView = () => {
    if (!riskData || !localSelectedRegion) return null;
    const region = riskData.regional.find(r => r.name === localSelectedRegion);
    if (!region) return null;

    return (
      <div className="space-y-6 p-8 bg-neutral-900 min-h-screen">
        {/* Navigation */}
        <div className="flex justify-start mb-4">
          <button 
            onClick={() => { setLevel(2); setLocalSelectedRegion(null); setSelectedTaxCenter(null); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-50 font-semibold rounded-lg transition-all duration-200"
          >
            <i className="fas fa-arrow-left"></i>
            Back to {localSelectedRegion} Region
          </button>
        </div>

        {/* Page Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-primary-600 rounded-sm"></div>
            <h1 className="text-3xl font-serif font-bold text-neutral-50">{getDisplayRegionName(localSelectedRegion)} Tax Centers</h1>
          </div>
          <p className="text-neutral-400 text-sm">Tax center-level risk analysis and high-risk taxpayer details</p>
        </div>

        {/* Tax Centers Table */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-800 border-b border-neutral-700">
                  <th className="px-6 py-4 text-left font-semibold text-neutral-300 uppercase tracking-wider">Tax Center</th>
                  <th className="px-6 py-4 text-right font-semibold text-neutral-300 uppercase tracking-wider">Taxpayers</th>
                  <th className="px-6 py-4 text-right font-semibold text-neutral-300 uppercase tracking-wider">High Risk</th>
                  <th className="px-6 py-4 text-right font-semibold text-neutral-300 uppercase tracking-wider">Critical</th>
                  <th className="px-6 py-4 text-right font-semibold text-neutral-300 uppercase tracking-wider">Revenue at Risk</th>
                  <th className="px-6 py-4 text-center font-semibold text-neutral-300 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {(region.taxCenters || []).map((tc, i) => (
                  <tr key={i} className="hover:bg-neutral-700/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-neutral-50">{tc.name}</td>
                    <td className="px-6 py-4 text-right text-neutral-300">{(tc.totalTaxpayers || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-neutral-300">{(tc.highRisk || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-neutral-300">{(tc.critical || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-neutral-300">{((tc.revenueAtRisk || 0) / 1000000).toFixed(0)}M ETB</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => { setLevel(3.5); setSelectedTaxCenter(tc); }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded transition-all duration-200"
                      >
                        <i className="fas fa-eye"></i>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Level 3.5: Tax Center Details View
  const renderTaxCenterDetailsView = () => {
    if (!selectedTaxCenter) return null;

    return (
      <div className="space-y-6 p-8 bg-neutral-900 min-h-screen">
        {/* Navigation */}
        <div className="flex justify-start mb-4">
          <button 
            onClick={() => { setLevel(3); setSelectedTaxCenter(null); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-50 font-semibold rounded-lg transition-all duration-200"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Tax Centers
          </button>
        </div>

        {/* Page Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-primary-600 rounded-sm"></div>
            <h1 className="text-3xl font-serif font-bold text-neutral-50">{selectedTaxCenter.name}</h1>
          </div>
          <p className="text-neutral-400 text-sm">Detailed risk analysis and high-risk taxpayer identification</p>
        </div>

        {/* KPI Cards - 4 Column Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-neutral-800 border border-neutral-700 border-l-4 border-l-info-600 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2">Total Taxpayers</h3>
            <div className="text-4xl font-bold leading-none mb-2 text-neutral-50">{(selectedTaxCenter.totalTaxpayers || 0).toLocaleString()}</div>
            <div className="text-2xl text-neutral-400 opacity-75"><i className="fas fa-users"></i></div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 border-l-4 border-l-amber-600 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2">High Risk</h3>
            <div className="text-4xl font-bold leading-none mb-2 text-neutral-50">{(selectedTaxCenter.highRisk || 0).toLocaleString()}</div>
            <div className="text-2xl text-neutral-400 opacity-75"><i className="fas fa-exclamation-triangle"></i></div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 border-l-4 border-l-danger-600 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2">Critical Risk</h3>
            <div className="text-4xl font-bold leading-none mb-2 text-neutral-50">{(selectedTaxCenter.critical || 0).toLocaleString()}</div>
            <div className="text-2xl text-neutral-400 opacity-75"><i className="fas fa-skull-crossbones"></i></div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 border-l-4 border-l-primary-600 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2">Revenue at Risk</h3>
            <div className="text-4xl font-bold leading-none mb-2 text-neutral-50">{((selectedTaxCenter.revenueAtRisk || 0) / 1000000).toFixed(1)}M ETB</div>
            <div className="text-2xl text-neutral-400 opacity-75"><i className="fas fa-dollar-sign"></i></div>
          </div>
        </div>

        {/* Section Header - Audit Types */}
        <div className="pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-info-600 rounded-sm"></div>
            <h2 className="text-2xl font-serif font-bold text-neutral-50">Audit Type Candidates</h2>
          </div>
        </div>

        {/* Audit Type Table */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-800 border-b border-neutral-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">Audit Type</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-300 uppercase tracking-wider">Candidates</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-300 uppercase tracking-wider">% of Tax Center</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {(selectedTaxCenter.auditTypeCandidates || []).map((item, i) => (
                  <tr key={i} className="hover:bg-neutral-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-neutral-50">{item.type}</td>
                    <td className="px-6 py-4 text-sm text-right text-neutral-300">{(item.candidates || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-right text-neutral-400">{((item.candidates || 0) / (selectedTaxCenter.highRisk || 1) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section Header - Tax Types */}
        <div className="pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-warning-600 rounded-sm"></div>
            <h2 className="text-2xl font-serif font-bold text-neutral-50">Risk by Tax Type</h2>
          </div>
        </div>

        {/* Tax Type Table */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-800 border-b border-neutral-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">Tax Type</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-300 uppercase tracking-wider">Risky Taxpayers</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-300 uppercase tracking-wider">% of Tax Center</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {(selectedTaxCenter.taxTypeBreakdown || []).map((item, i) => (
                  <tr key={i} className="hover:bg-neutral-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-neutral-50">{item.type}</td>
                    <td className="px-6 py-4 text-sm text-right text-neutral-300">{(item.risky || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-right text-neutral-400">{((item.risky || 0) / (selectedTaxCenter.highRisk || 1) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3 pt-4">
          <button 
            onClick={() => { setLevel(4); }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-success-600 hover:bg-success-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <i className="fas fa-users"></i>
            View High-Risk Taxpayers
          </button>
        </div>
      </div>
    );
  };

  // Level 4: Individual Taxpayer Details (Auditor Level)
  const renderTaxpayerDetailsView = () => {
    if (!selectedTaxCenter || !selectedTaxCenter.taxpayers) return null;

    return (
      <div className="space-y-6 p-8 bg-neutral-900 min-h-screen">
        {/* Navigation */}
        <div className="flex justify-start mb-4">
          <button 
            onClick={() => { setLevel(3); setSelectedTaxCenter(null); setSelectedTaxpayer(null); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-50 font-semibold rounded-lg transition-all duration-200"
          >
            <i className="fas fa-arrow-left"></i>
            Back to Tax Centers
          </button>
        </div>

        {/* Page Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-danger-600 rounded-sm"></div>
            <h1 className="text-3xl font-serif font-bold text-neutral-50">High-Risk Taxpayers</h1>
          </div>
          <p className="text-neutral-400 text-sm">{selectedTaxCenter.name} — Audit selection and risk indicators</p>
        </div>

        {/* High-Risk Taxpayers Table */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-800 border-b border-neutral-700">
                  <th className="px-6 py-4 text-left font-semibold text-neutral-300 uppercase tracking-wider">TIN</th>
                  <th className="px-6 py-4 text-left font-semibold text-neutral-300 uppercase tracking-wider">Business Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-neutral-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-center font-semibold text-neutral-300 uppercase tracking-wider">Risk Score</th>
                  <th className="px-6 py-4 text-center font-semibold text-neutral-300 uppercase tracking-wider">Risk Level</th>
                  <th className="px-6 py-4 text-right font-semibold text-neutral-300 uppercase tracking-wider">Revenue at Risk</th>
                  <th className="px-6 py-4 text-center font-semibold text-neutral-300 uppercase tracking-wider">Recommended Audit</th>
                  <th className="px-6 py-4 text-center font-semibold text-neutral-300 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {(selectedTaxCenter.taxpayers || []).map((tp, i) => (
                  <tr key={i} className="hover:bg-neutral-700/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-neutral-50">{tp.tin}</td>
                    <td className="px-6 py-4 text-neutral-300">{tp.businessName}</td>
                    <td className="px-6 py-4 text-neutral-400">{tp.businessType}</td>
                    <td className="px-6 py-4 text-center font-bold text-neutral-50">{tp.riskScore}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${tp.riskLevel === 'Critical' ? 'bg-danger-900/50 text-danger-300' : tp.riskLevel === 'High' ? 'bg-amber-900/50 text-amber-300' : 'bg-warning-900/50 text-warning-300'}`}>
                        {tp.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-neutral-300">{((tp.revenueAtRisk || 0) / 1000000).toFixed(2)}M ETB</td>
                    <td className="px-6 py-4 text-center text-neutral-400">{tp.recommendedAuditType}</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => setSelectedTaxpayer(tp)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded transition-all duration-200"
                      >
                        <i className="fas fa-search"></i>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Taxpayer Detail Modal */}
        {selectedTaxpayer && (
          <div className="border-t-4 border-primary-600 bg-neutral-800 rounded-lg p-6 mt-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-700">
              <div>
                <h2 className="text-2xl font-serif font-bold text-neutral-50">{selectedTaxpayer.tin} — {selectedTaxpayer.businessName}</h2>
                <p className="text-neutral-400 text-sm mt-1">{selectedTaxpayer.businessType}</p>
              </div>
              <button 
                onClick={() => setSelectedTaxpayer(null)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-50 font-semibold rounded-lg transition-all duration-200"
              >
                <i className="fas fa-times"></i>
                Close
              </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
              <div className="bg-neutral-700 rounded-lg p-4">
                <div className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2">Risk Score</div>
                <div className="text-3xl font-bold text-neutral-50">{selectedTaxpayer.riskScore}</div>
              </div>
              <div className="bg-neutral-700 rounded-lg p-4">
                <div className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2">Risk Level</div>
                <div className="text-2xl font-bold">
                  <span className={`inline-block px-3 py-1 rounded text-sm ${selectedTaxpayer.riskLevel === 'Critical' ? 'bg-danger-900/50 text-danger-300' : selectedTaxpayer.riskLevel === 'High' ? 'bg-amber-900/50 text-amber-300' : 'bg-warning-900/50 text-warning-300'}`}>
                    {selectedTaxpayer.riskLevel}
                  </span>
                </div>
              </div>
              <div className="bg-neutral-700 rounded-lg p-4">
                <div className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2">Revenue at Risk</div>
                <div className="text-3xl font-bold text-neutral-50">{((selectedTaxpayer.revenueAtRisk || 0) / 1000000).toFixed(1)}M</div>
              </div>
              <div className="bg-neutral-700 rounded-lg p-4">
                <div className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2">Recommended Audit</div>
                <div className="text-lg font-bold text-neutral-50">{selectedTaxpayer.recommendedAuditType}</div>
              </div>
            </div>

            {/* Risk Indicators Section */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-danger-600 rounded-sm"></div>
                <h3 className="text-xl font-serif font-bold text-neutral-50">Risk Indicators & Evidence</h3>
              </div>
              <div className="space-y-4">
                {(selectedTaxpayer.riskIndicators || []).map((ind, i) => (
                  <div key={i} className="border-l-4 border-l-danger-600 bg-danger-900/20 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-neutral-50">{ind.indicator}</h4>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${ind.severity === 'High' ? 'bg-danger-900/50 text-danger-300' : 'bg-warning-900/50 text-warning-300'}`}>
                        {ind.severity}
                      </span>
                    </div>
                    <p className="text-neutral-300 text-sm"><i className="fas fa-info-circle mr-2"></i>{ind.evidence}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance History Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-info-600 rounded-sm"></div>
                <h3 className="text-xl font-serif font-bold text-neutral-50">Compliance History</h3>
              </div>
              <div className="bg-info-900/20 border border-info-700 rounded-lg p-4">
                <p className="text-neutral-300"><strong>Last Audit:</strong> {selectedTaxpayer.lastAudit}</p>
                <p className="text-neutral-300 mt-2"><strong>Status:</strong> {selectedTaxpayer.complianceHistory}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Detailed Audit Type Allocation View (National Level)
  const renderNationalAuditTypeAllocation = () => {
    if (!riskData) return null;
    const { national } = riskData;
    
    // Get current allocations (use overrides if set, otherwise use risk engine data)
    const auditTypes = auditConfig.auditTypes;
    const currentAllocations = nationalAuditAllocations || {};
    
    const handleAllocationChange = (typeId, value) => {
      const newAllocations = { ...currentAllocations };
      newAllocations[typeId] = parseInt(value) || 0;
      setNationalAuditAllocations(newAllocations);
    };

    const handleReset = () => {
      setNationalAuditAllocations({});
    };

    const handleSaveOverrides = () => {
      // Save to localStorage
      // Using data from hook
      data.auditTypeAllocations = nationalAuditAllocations;
      updateData(data);
      alert('Audit type allocations saved successfully!');
    };

    return (
      <div>
        <div className="action-bar">
          <button className="btn btn-outline" onClick={() => setDetailView(null)}>
            <i className="fas fa-arrow-left"></i> Back to Risk Engine
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-warning" onClick={handleReset}>
              <i className="fas fa-redo"></i> Reset to Risk Engine
            </button>
            <button className="btn btn-success" onClick={handleSaveOverrides}>
              <i className="fas fa-save"></i> Save Allocations
            </button>
          </div>
        </div>

        <div className="detail-header">
          <h2><i className="fas fa-tasks"></i> Detailed Audit Type Allocation - National Level</h2>
          <Badge status="Risk Engine Analysis" className="director-approved" />
        </div>

        {/* Summary Card */}
        <div style={{ background: '#e3f2fd', color: '#0c4a6e', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #1976d2', color: '#0c4a6e' }}>
          <h3 style={{ margin: '0 0 12px 0' }}>Total Risky Suspects: <strong style={{ color: '#1976d2' }}>{national.riskySuspects.toLocaleString()}</strong></h3>
          <p style={{ color: '#0c4a6e', margin: 0, fontSize: '13px', color: '#555' }}>
            Based on risk analysis, these {national.riskySuspects.toLocaleString()} taxpayers should be allocated across audit types.
            You can adjust the allocations below if needed. Values must sum to the total risky suspects.
          </p>
        </div>

        {/* Allocation Table */}
        <div className="section-title"><i className="fas fa-chart-bar"></i> Audit Type Breakdown</div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Audit Type</th>
                <th>Risk Engine Candidates</th>
                <th>% of Risky</th>
                <th>Allocated Cases</th>
                <th>Your Override</th>
                <th>% of Total</th>
              </tr>
            </thead>
            <tbody>
              {auditTypes.map((type) => {
                const riskEngineCandidate = national.byAuditType.find(a => a.type === type.name)?.candidates || 0;
                const riskPercent = ((riskEngineCandidate / national.riskySuspects) * 100).toFixed(1);
                const overriddenValue = currentAllocations[type.id] !== undefined ? currentAllocations[type.id] : riskEngineCandidate;
                const overridePercent = national.riskySuspects > 0 ? ((overriddenValue / national.riskySuspects) * 100).toFixed(1) : 0;
                
                return (
                  <tr key={type.id} style={{ background: currentAllocations[type.id] !== undefined ? '#0f14193e0' : '#0f1419' }}>
                    <td><strong>{type.name}</strong></td>
                    <td style={{ textAlign: 'center' }}>{riskEngineCandidate.toLocaleString()}</td>
                    <td style={{ textAlign: 'center' }}>{riskPercent}%</td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{overriddenValue.toLocaleString()}</td>
                    <td>
                      <input
                        type="number"
                        value={overriddenValue}
                        onChange={(e) => handleAllocationChange(type.id, e.target.value)}
                        style={{
                          width: '100px',
                          padding: '8px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          textAlign: 'center'
                        }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>{overridePercent}%</td>
                  </tr>
                );
              })}
              <tr style={{ background: '#0f1419', fontWeight: 'bold' }}>
                <td colSpan="2">TOTAL</td>
                <td style={{ textAlign: 'center' }}>-</td>
                <td style={{ textAlign: 'center' }}>{national.riskySuspects.toLocaleString()}</td>
                <td style={{ textAlign: 'center', color: '#4a8fd9' }}>
                  {Object.values(currentAllocations).reduce((sum, v) => sum + (parseInt(v) || 0), 0) > 0
                    ? Object.values(currentAllocations).reduce((sum, v) => sum + (parseInt(v) || 0), 0).toLocaleString()
                    : national.byAuditType.reduce((sum, a) => sum + a.candidates, 0).toLocaleString()}
                </td>
                <td style={{ textAlign: 'center' }}>100%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Validation Message */}
        {Object.keys(currentAllocations).length > 0 && (
          <div style={{ 
            background: '#0f1419', color: '#f0f6fc', 
            padding: '12px', 
            borderRadius: '6px', 
            marginTop: '16px', 
            border: '1px solid #ffb74d'
          }}>
            <i className="fas fa-info-circle"></i> You have overridden {Object.keys(currentAllocations).length} audit type allocation(s).
            Click "Save Allocations" to persist your changes.
          </div>
        )}
      </div>
    );
  };

  // Detailed Audit Type Allocation View (Regional Level)
  const renderRegionalAuditTypeAllocation = () => {
    if (!riskData || !localSelectedRegion) return null;
    const region = riskData.regional.find(r => r.name === localSelectedRegion);
    if (!region) return null;

    const auditTypes = auditConfig.auditTypes;
    const regionKey = localSelectedRegion;
    const currentAllocations = regionalAuditAllocations[regionKey] || {};

    const handleAllocationChange = (typeId, value) => {
      const newRegionalAllocations = { ...regionalAuditAllocations };
      if (!newRegionalAllocations[regionKey]) {
        newRegionalAllocations[regionKey] = {};
      }
      newRegionalAllocations[regionKey][typeId] = parseInt(value) || 0;
      setRegionalAuditAllocations(newRegionalAllocations);
    };

    const handleReset = () => {
      const newRegionalAllocations = { ...regionalAuditAllocations };
      delete newRegionalAllocations[regionKey];
      setRegionalAuditAllocations(newRegionalAllocations);
    };

    const handleSaveOverrides = () => {
      // Using data from hook
      if (!data.regionalAuditAllocations) {
        data.regionalAuditAllocations = {};
      }
      data.regionalAuditAllocations[regionKey] = currentAllocations;
      updateData(data);
      alert(`Audit type allocations for ${regionKey} saved successfully!`);
    };

    return (
      <div>
        <div className="action-bar">
          <button className="btn btn-outline" onClick={() => setDetailView(null)}>
            <i className="fas fa-arrow-left"></i> Back to Region
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-warning" onClick={handleReset}>
              <i className="fas fa-redo"></i> Reset to Risk Engine
            </button>
            <button className="btn btn-success" onClick={handleSaveOverrides}>
              <i className="fas fa-save"></i> Save Allocations
            </button>
          </div>
        </div>

        <div className="detail-header">
          <h2><i className="fas fa-map-pin"></i> Detailed Audit Type Allocation - {getDisplayRegionName(localSelectedRegion)} Region</h2>
          <Badge status={`Risk Engine Analysis`} className="director-approved" />
        </div>

        {/* Summary Card */}
        <div style={{ background: '#e3f2fd', color: '#0c4a6e', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #1976d2', color: '#0c4a6e' }}>
          <h3 style={{ margin: '0 0 12px 0' }}>
            {localSelectedRegion} - Total Risky Suspects: <strong style={{ color: '#1976d2' }}>{region.riskySuspects.toLocaleString()}</strong>
          </h3>
          <p style={{ color: '#0c4a6e', margin: '8px 0 0 0', fontSize: '13px', color: '#555' }}>
            Total Taxpayers in {localSelectedRegion}: <strong>{region.totalTaxpayers.toLocaleString()}</strong>
          </p>
          <p style={{ color: '#0c4a6e', margin: '6px 0 0 0', fontSize: '13px', color: '#555' }}>
            Based on risk analysis, these {region.riskySuspects.toLocaleString()} at-risk taxpayers should be allocated across audit types.
            You can adjust the allocations below for {localSelectedRegion} region specifically.
          </p>
        </div>

        {/* Allocation Table */}
        <div className="section-title"><i className="fas fa-chart-bar"></i> Audit Type Breakdown for {localSelectedRegion}</div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Audit Type</th>
                <th>Risk Engine Candidates</th>
                <th>% of Risky</th>
                <th>Allocated Cases</th>
                <th>Your Override</th>
                <th>% of Total</th>
              </tr>
            </thead>
            <tbody>
              {auditTypes.map((type) => {
                const riskEngineCandidate = region.auditTypeCandidates.find(a => a.type === type.name)?.candidates || 0;
                const riskPercent = ((riskEngineCandidate / region.riskySuspects) * 100).toFixed(1);
                const overriddenValue = currentAllocations[type.id] !== undefined ? currentAllocations[type.id] : riskEngineCandidate;
                const overridePercent = region.riskySuspects > 0 ? ((overriddenValue / region.riskySuspects) * 100).toFixed(1) : 0;

                return (
                  <tr key={type.id} style={{ background: currentAllocations[type.id] !== undefined ? '#0f14193e0' : '#0f1419' }}>
                    <td><strong>{type.name}</strong></td>
                    <td style={{ textAlign: 'center' }}>{riskEngineCandidate.toLocaleString()}</td>
                    <td style={{ textAlign: 'center' }}>{riskPercent}%</td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{overriddenValue.toLocaleString()}</td>
                    <td>
                      <input
                        type="number"
                        value={overriddenValue}
                        onChange={(e) => handleAllocationChange(type.id, e.target.value)}
                        style={{
                          width: '100px',
                          padding: '8px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          textAlign: 'center'
                        }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>{overridePercent}%</td>
                  </tr>
                );
              })}
              <tr style={{ background: '#0f1419', fontWeight: 'bold' }}>
                <td colSpan="2">TOTAL FOR {localSelectedRegion.toUpperCase()}</td>
                <td style={{ textAlign: 'center' }}>-</td>
                <td style={{ textAlign: 'center' }}>{region.riskySuspects.toLocaleString()}</td>
                <td style={{ textAlign: 'center', color: '#4a8fd9' }}>
                  {Object.values(currentAllocations).reduce((sum, v) => sum + (parseInt(v) || 0), 0) > 0
                    ? Object.values(currentAllocations).reduce((sum, v) => sum + (parseInt(v) || 0), 0).toLocaleString()
                    : region.auditTypeCandidates.reduce((sum, a) => sum + a.candidates, 0).toLocaleString()}
                </td>
                <td style={{ textAlign: 'center' }}>100%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Validation Message */}
        {Object.keys(currentAllocations).length > 0 && (
          <div style={{
            background: '#0f1419', color: '#f0f6fc',
            padding: '12px',
            borderRadius: '6px',
            marginTop: '16px',
            border: '1px solid #ffb74d'
          }}>
            <i className="fas fa-info-circle"></i> You have overridden {Object.keys(currentAllocations).length} audit type allocation(s) for {localSelectedRegion}.
            Click "Save Allocations" to persist your changes.
          </div>
        )}
      </div>
    );
  };

  // Level 2: Regional List View - SPECIAL FOR REGIONAL DIRECTORS
  // Old renderRegionalListView removed - now using RegionSelector component instead

  // Determine what to render based on level and region selection
  if (level === 1) {
    return renderNationalView();
  } else if (level === 2) {
    // Regional directors: ALWAYS show region selector until they select one
    // Once they select, show the regional view
    if (localSelectedRegion) {
      // Show selected region data
      return renderRegionalView();
    } else {
      // Show region selector (both regional directors and planning team)
      return (
        <RegionSelectorCards
          onRegionSelect={handleRegionSelect}
          currentRegion={localSelectedRegion}
          userRole={userRole}
          assignedRegion={assignedRegion}
        />
      );
    }
  } else if (level === 3) {
    if (!selectedTaxCenter) {
      return renderTaxCenterView();
    } else {
      return renderTaxCenterDetailsView();
    }
  } else if (level === 3.5) {
    return renderTaxCenterDetailsView();
  } else if (level === 4) {
    return renderTaxpayerDetailsView();
  }

  return renderNationalView();

}

export default RiskEngineView;
