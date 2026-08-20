// =====================================================
// AUDIT SYSTEM CONFIGURATION (COMPLETE & CONFIGURABLE)
// =====================================================
// All values here are configurable per organization requirements
// Edit these values to match your audit environment

export const auditConfig = {
  // =====================================================
  // 1. AUDIT TYPES CONFIGURATION
  // =====================================================
  auditTypes: [
    { 
      id: 'desk_audit',
      name: 'Desk Audit', 
      effortPerCase: 40,
      skillsRequired: ['Basic Analysis', 'Document Review'],
      description: 'Remote audit using documents and internal data',
      complexity: 'Low'
    },
    { 
      id: 'field_audit',
      name: 'Field Audit', 
      effortPerCase: 120,
      skillsRequired: ['Fieldwork', 'Investigation', 'Taxpayer Engagement'],
      description: 'On-site audit with taxpayer site visit',
      complexity: 'Medium'
    },
    { 
      id: 'joint_audit',
      name: 'Joint Audit', 
      effortPerCase: 160,
      skillsRequired: ['Fieldwork', 'Investigation', 'Multi-team Coordination', 'Senior Auditor'],
      description: 'Multi-directorate coordinated audit',
      complexity: 'High'
    },
    { 
      id: 'transfer_pricing',
      name: 'Transfer Pricing', 
      effortPerCase: 80,
      skillsRequired: ['Transfer Pricing Specialist', 'International Tax'],
      description: 'Cross-border transaction audit',
      complexity: 'High'
    },
    { 
      id: 'comprehensive',
      name: 'Comprehensive', 
      effortPerCase: 200,
      skillsRequired: ['Senior Auditor', 'Advanced Analysis', 'CAAT'],
      description: 'Full-scope financial and compliance audit',
      complexity: 'Very High'
    },
    { 
      id: 'issue_audit',
      name: 'Issue Audit', 
      effortPerCase: 50,
      skillsRequired: ['Specialized Auditor', 'Issue Expert'],
      description: 'Focused audit on specific compliance area',
      complexity: 'Medium'
    }
  ],

  // =====================================================
  // 2. SKILL TYPES CONFIGURATION
  // =====================================================
  skills: [
    { id: 'basic_analysis', name: 'Basic Analysis', level: 1, category: 'Foundation' },
    { id: 'document_review', name: 'Document Review', level: 1, category: 'Foundation' },
    { id: 'fieldwork', name: 'Fieldwork', level: 2, category: 'Execution' },
    { id: 'investigation', name: 'Investigation', level: 2, category: 'Execution' },
    { id: 'taxpayer_engagement', name: 'Taxpayer Engagement', level: 2, category: 'Execution' },
    { id: 'senior_auditor', name: 'Senior Auditor', level: 3, category: 'Leadership' },
    { id: 'advanced_analysis', name: 'Advanced Analysis', level: 3, category: 'Specialized' },
    { id: 'caat', name: 'CAAT', level: 3, category: 'Technology' },
    { id: 'tp_specialist', name: 'Transfer Pricing Specialist', level: 3, category: 'Specialized' },
    { id: 'international_tax', name: 'International Tax', level: 3, category: 'Specialized' },
    { id: 'multi_team_coord', name: 'Multi-team Coordination', level: 2, category: 'Management' },
    { id: 'issue_expert', name: 'Issue Expert', level: 3, category: 'Specialized' }
  ],

  // =====================================================
  // 3. RISK LEVELS CONFIGURATION
  // =====================================================
  riskLevels: {
    critical: { min: 85, max: 100, color: '#d32f2f', bgColor: '#ffebee', label: 'Critical' },
    high: { min: 70, max: 84, color: '#ff9800', bgColor: '#fff3e0', label: 'High' },
    medium: { min: 45, max: 69, color: '#fdd835', bgColor: '#fffde7', label: 'Medium' },
    low: { min: 0, max: 44, color: '#4caf50', bgColor: '#e8f5e9', label: 'Low' }
  },

  // =====================================================
  // 4. RISK DISTRIBUTION FORMULA (CONFIGURABLE)
  // =====================================================
  riskDistribution: {
    percentageRisky: 8.269231,  // % of all taxpayers considered "risky" (yields ~430,000)
    split: {
      critical: 0.05,      // 5% of risky are critical
      high: 0.186,         // 18.6% are high
      medium: 0.348,       // 34.8% are medium
      low: 0.416           // 41.6% are low
    },
    byAuditType: {
      desk_audit: 0.35,
      field_audit: 0.25,
      joint_audit: 0.15,
      transfer_pricing: 0.08,
      comprehensive: 0.12,
      issue_audit: 0.05
    }
  },

  // =====================================================
  // 5. EFFORT CALCULATION PARAMETERS (CONFIGURABLE)
  // =====================================================
  effortCalculation: {
    hoursPerAuditorPerYear: 2000,  // Standard auditor working hours/year
    holidaysAndLeave: 30,          // Days off (holidays + leave)
    trainingDays: 5,               // Annual training days
    administrationOverhead: 0.1,   // 10% overhead for meetings, admin
    bufferPercentage: 0.15         // 15% buffer for contingencies
  },

  // =====================================================
  // 6. ALLOCATION RULES (CONFIGURABLE)
  // =====================================================
  allocationRules: {
    byTaxpayerBase: 0.5,    // 50% of allocation by region taxpayer count
    byRiskProfile: 0.35,    // 35% based on regional risk profile
    byCapacity: 0.15        // 15% based on available auditor capacity
  },

  // =====================================================
  // 7. VALIDATION & CONSTRAINTS (CONFIGURABLE)
  // =====================================================
  validation: {
    minCasesPerRegion: 10,         // Minimum cases per region
    maxEffortVariance: 0.2,        // ±20% variance from plan allowed
    requiredSkillCoverage: 0.95,   // 95% of required skills must be available
    maxCasesPerAuditor: 15,        // Max cases per auditor per year
    minAuditorsPerRegion: 3        // Min auditors needed per region
  },

  // =====================================================
  // 8. REGIONS & TAX CENTERS
  // =====================================================
  regions: [
    { 
      id: 'addis_ababa',
      name: 'Addis Ababa', 
      taxpayers: 2500000,
      taxCenters: ['Addis Ababa-tc1', 'Addis Ababa-tc2', 'Addis Ababa-tc3'],
      availableAuditors: 600,
      availableSkills: {
        'Basic Analysis': 300,
        'Fieldwork': 160,
        'Senior Auditor': 100,
        'Advanced Analysis': 60,
        'CAAT': 40,
        'Transfer Pricing Specialist': 20
      }
    },
    { 
      id: 'oromia',
      name: 'Oromia', 
      taxpayers: 1300000,
      taxCenters: ['Oromia-tc1', 'Oromia-tc2', 'Oromia-tc3'],
      availableAuditors: 400,
      availableSkills: {
        'Basic Analysis': 240,
        'Fieldwork': 120,
        'Senior Auditor': 80,
        'Advanced Analysis': 40
      }
    },
    { 
      id: 'amhara',
      name: 'Amhara', 
      taxpayers: 750000,
      taxCenters: ['Amhara-tc1', 'Amhara-tc2', 'Amhara-tc3'],
      availableAuditors: 250,
      availableSkills: {
        'Basic Analysis': 200,
        'Fieldwork': 80,
        'Senior Auditor': 40
      }
    },
    { 
      id: 'sidama',
      name: 'Sidama', 
      taxpayers: 350000,
      taxCenters: ['Sidama-tc1', 'Sidama-tc2', 'Sidama-tc3'],
      availableAuditors: 100,
      availableSkills: {
        'Basic Analysis': 140,
        'Fieldwork': 60
      }
    },
    { 
      id: 'dire_dawa',
      name: 'Dire Dawa', 
      taxpayers: 100000,
      taxCenters: ['Dire Dawa-tc1', 'Dire Dawa-tc2', 'Dire Dawa-tc3'],
      availableAuditors: 50,
      availableSkills: {
        'Basic Analysis': 100,
        'Fieldwork': 40
      }
    },
    { 
      id: 'somali',
      name: 'Somali', 
      taxpayers: 200000,
      taxCenters: ['Somali-tc1', 'Somali-tc2', 'Somali-tc3'],
      availableAuditors: 100,
      availableSkills: {
        'Basic Analysis': 80,
        'Fieldwork': 40
      }
    }
  ],

  // =====================================================
  // 9. TAX CENTERS (reference list)
  // =====================================================
  taxCenters: [
    'Addis Ababa-tc1', 'Addis Ababa-tc2', 'Addis Ababa-tc3',
    'Oromia-tc1', 'Oromia-tc2', 'Oromia-tc3',
    'Amhara-tc1', 'Amhara-tc2', 'Amhara-tc3',
    'Sidama-tc1', 'Sidama-tc2', 'Sidama-tc3',
    'Dire Dawa-tc1', 'Dire Dawa-tc2', 'Dire Dawa-tc3',
    'Somali-tc1', 'Somali-tc2', 'Somali-tc3'
  ],

  // =====================================================
  // 9A. TAX TYPES CONFIGURATION
  // =====================================================
  taxTypes: [
    { id: 'vat', name: 'Value Added Tax (VAT)', riskWeight: 1.2, compliance: 82 },
    { id: 'cit', name: 'Corporate Income Tax (CIT)', riskWeight: 1.0, compliance: 78 },
    { id: 'pit', name: 'Personal Income Tax (PIT)', riskWeight: 0.8, compliance: 85 },
    { id: 'payroll', name: 'Payroll Tax', riskWeight: 0.9, compliance: 80 },
    { id: 'excise', name: 'Excise Tax', riskWeight: 1.1, compliance: 75 },
    { id: 'customs', name: 'Customs Duty', riskWeight: 1.3, compliance: 72 },
    { id: 'other', name: 'Other Taxes', riskWeight: 0.7, compliance: 88 }
  ],

  // =====================================================
  // 9B. INDUSTRY CLASSIFICATIONS
  // =====================================================
  industries: [
    { id: 'construction', name: 'Construction', riskScore: 75, compliance: 68 },
    { id: 'manufacturing', name: 'Manufacturing', riskScore: 68, compliance: 72 },
    { id: 'wholesale', name: 'Wholesale Trade', riskScore: 72, compliance: 70 },
    { id: 'retail', name: 'Retail Trade', riskScore: 60, compliance: 80 },
    { id: 'services', name: 'Services', riskScore: 55, compliance: 82 },
    { id: 'import_export', name: 'Import/Export', riskScore: 82, compliance: 65 },
    { id: 'transportation', name: 'Transportation', riskScore: 65, compliance: 75 },
    { id: 'hotel_restaurant', name: 'Hotel & Restaurant', riskScore: 70, compliance: 70 },
    { id: 'finance', name: 'Financial Services', riskScore: 58, compliance: 85 },
    { id: 'real_estate', name: 'Real Estate', riskScore: 62, compliance: 78 }
  ],

  // =====================================================
  // 9C. TAXPAYER CATEGORIES
  // =====================================================
  taxpayerCategories: [
    { id: 'large', name: 'Large Taxpayer', annualTurnover: '> 50 Million', auditFrequency: 2, description: 'High compliance risk & revenue significance' },
    { id: 'medium', name: 'Medium Taxpayer', annualTurnover: '10-50 Million', auditFrequency: 1.5, description: 'Medium risk with growing operations' },
    { id: 'small', name: 'Small Taxpayer', annualTurnover: '1-10 Million', auditFrequency: 1, description: 'Lower compliance risk but volume' },
    { id: 'micro', name: 'Micro Taxpayer', annualTurnover: '< 1 Million', auditFrequency: 0.5, description: 'Minimal audit resource allocation' }
  ],

  // =====================================================
  // 9D. AUDIT QUALITY STANDARDS (CONFIGURABLE)
  // =====================================================
  auditStandards: {
    documentationRequired: true,
    workPaperStandards: 'ISO 20000',
    complianceFramework: 'INTOSAI-ISSAI',
    reportingFormat: 'Standardized Audit Report',
    qualityReviewLevel: 3,  // 1=Basic, 2=Standard, 3=Comprehensive
    requirementCoverage: 0.98,  // 98% of audit standards must be met
    reviewTimeline: 15  // Days to complete quality review
  },

  // =====================================================
  // 9E. ORGANIZATIONAL CAPACITY CONFIGURATION
  // =====================================================
  organizationalCapacity: {
    auditorsPerRegion: 'configurable',
    supervisorsPerRegion: 'configurable',
    seniorManagementLayers: 3,  // Planning → Director → Senior Management
    regionalDirectories: 6,
    taxCentersPerRegion: 3,
    planningCycle: 'Annual',
    approvalCycle: 30  // Days for approval cycle
  },

  // =====================================================
  // 9F. COMPLIANCE & RISK THRESHOLDS (CONFIGURABLE)
  // =====================================================
  complianceThresholds: {
    criticalRiskThreshold: 85,
    highRiskThreshold: 70,
    mediumRiskThreshold: 45,
    filingComplianceTarget: 95,
    paymentComplianceTarget: 90,
    registrationComplianceTarget: 97,
    varianceThreshold: 20  // % variance allowed
  },

  // =====================================================
  // 9G. RISK INDICATORS LIBRARY
  // =====================================================
  riskIndicators: [
    { id: 'late_filing', name: 'Late Filing', weight: 2, description: 'Repeated late tax return filing', sources: ['Admin Data'] },
    { id: 'late_payment', name: 'Late Payment', weight: 2, description: 'Pattern of late tax payments', sources: ['Payment Records'] },
    { id: 'vat_mismatch', name: 'VAT Mismatch', weight: 3, description: 'Input VAT exceeds Output VAT consistently', sources: ['VAT Returns'] },
    { id: 'import_sales_variance', name: 'Import vs Sales Variance', weight: 2.5, description: 'Imports significantly exceed sales', sources: ['Customs, Returns'] },
    { id: 'continuous_loss', name: 'Continuous Losses', weight: 2, description: 'Business reports losses for multiple years', sources: ['Financial Statements'] },
    { id: 'income_variance', name: 'Income Variance', weight: 2, description: 'Significant income fluctuations', sources: ['Returns Analysis'] },
    { id: 'undisclosed_assets', name: 'Undisclosed Assets', weight: 3, description: 'Assets not declared or inconsistent', sources: ['Third Party Info'] },
    { id: 'industry_anomaly', name: 'Industry Anomaly', weight: 2, description: 'Performance differs significantly from industry', sources: ['Benchmarking'] },
    { id: 'cash_intensive', name: 'Cash Intensive Business', weight: 1.5, description: 'Business operates primarily on cash', sources: ['Industry Classification'] },
    { id: 'new_business', name: 'New Business Establishment', weight: 1, description: 'Business in first 2 years', sources: ['Registration Date'] }
  ],

  // =====================================================
  // 9H. FEEDBACK & APPROVAL WORKFLOW (CONFIGURABLE)
  // =====================================================
  workflowApproval: {
    requiresDirectorApproval: true,
    requiresRegionalFeedback: true,
    requiresSeniorManagementApproval: true,
    maxRoundOfAmendments: 2,
    feedbackDeadlineDays: 5,
    reviewDeadlineDays: 3,
    allowRejection: true
  },

  // =====================================================
  // 9I. REPORTING & METRICS CONFIGURATION
  // =====================================================
  reportingMetrics: {
    trackAuditDuration: true,
    trackComplianceFinding: true,
    trackRevenueImpact: true,
    trackSkillUtilization: true,
    trackAuditCost: true,
    performanceIndicators: ['Coverage %', 'Revenue Impact', 'Compliance Improvement', 'Case Resolution']
  },

  // =====================================================
  // 9J. AUDIT STRATEGIES & TACTICS (CONFIGURABLE)
  // =====================================================
  auditStrategies: [
    {
      id: 'risk_based_targeting',
      name: 'Risk-Based Targeting',
      description: 'Focus audit resources on high-risk taxpayers identified through risk assessment model',
      focus: 'Maximize compliance impact with limited resources'
    },
    {
      id: 'sector_focus',
      name: 'Sector-Based Focus',
      description: 'Concentrate audits on high-risk industry sectors with compliance issues',
      focus: 'Improve sector-wide compliance and industry practices'
    },
    {
      id: 'trade_investigation',
      name: 'Trade & Import/Export Investigation',
      description: 'Target import/export and trade-related transactions and anomalies',
      focus: 'Prevent revenue loss from cross-border transactions'
    },
    {
      id: 'taxpayer_segment',
      name: 'Taxpayer Segmentation',
      description: 'Segment taxpayers by size and complexity, apply proportionate audit intensity',
      focus: 'Tailored audit approach based on taxpayer profile'
    },
    {
      id: 'compliance_focused',
      name: 'Compliance-Focused',
      description: 'Balance audit between large cases and smaller compliance improvement activities',
      focus: 'Broad compliance improvement across all taxpayer groups'
    },
    {
      id: 'integrated_approach',
      name: 'Integrated Approach',
      description: 'Combine risk analysis, sector focus, and taxpayer segments for comprehensive coverage',
      focus: 'Holistic compliance strategy with maximum impact'
    }
  ],

  auditTactics: [
    {
      id: 'desk_based_review',
      name: 'Desk-Based Review',
      description: 'Remote analysis of returns and documents without field visits',
      complexity: 'Low',
      costEffective: true
    },
    {
      id: 'field_visit',
      name: 'Field Visit & Observation',
      description: 'On-site audit with taxpayer engagement and site inspection',
      complexity: 'Medium',
      costEffective: false
    },
    {
      id: 'third_party_data',
      name: 'Third-Party Data Analysis',
      description: 'Cross-reference with bank data, customs, payroll records',
      complexity: 'Medium',
      costEffective: true
    },
    {
      id: 'specialized_audit',
      name: 'Specialized Audit (Transfer Pricing, VAT)',
      description: 'Deep analysis of specific tax type or transaction',
      complexity: 'High',
      costEffective: false
    },
    {
      id: 'coordinated_audit',
      name: 'Coordinated Multi-Region Audit',
      description: 'Joint audit across regions for related parties/transactions',
      complexity: 'Very High',
      costEffective: false
    },
    {
      id: 'surprise_audit',
      name: 'Surprise/Unannounced Audit',
      description: 'Unannounced on-site audit for high-risk cases',
      complexity: 'High',
      costEffective: false
    },
    {
      id: 'caat_analysis',
      name: 'CAAT (Computer-Assisted Audit Techniques)',
      description: 'Data analytics and system-based audit procedures',
      complexity: 'High',
      costEffective: true
    },
    {
      id: 'compliance_check',
      name: 'Simple Compliance Check',
      description: 'Basic verification of filing, payment, and registration compliance',
      complexity: 'Low',
      costEffective: true
    }
  ],

  // =====================================================
  // 9K. FEATURE FLAGS & TOGGLES
  // =====================================================
  featureFlags: {
    riskEngineEnabled: true,
    advancedRiskModeling: false,
    automatedAllocation: true,
    cascadeToCase: true,
    feedbackWorkflow: true,
    bulkDirectorFeedback: true,
    regionalDataIsolation: true
  },

  // =====================================================
  // 10. HELPER FUNCTIONS
  // =====================================================
  getAuditTypeById: function(id) {
    return this.auditTypes.find(t => t.id === id);
  },

  getAuditTypeByName: function(name) {
    return this.auditTypes.find(t => t.name === name);
  },

  getRegionByName: function(name) {
    return this.regions.find(r => r.name === name);
  },

  getSkillLevel: function(skillName) {
    const skill = this.skills.find(s => s.name === skillName);
    return skill ? skill.level : 0;
  },

  getRiskLevelForScore: function(score) {
    if (score >= this.riskLevels.critical.min) return 'critical';
    if (score >= this.riskLevels.high.min) return 'high';
    if (score >= this.riskLevels.medium.min) return 'medium';
    return 'low';
  },

  calculateAvailableHoursPerAuditor: function() {
    const daysPerYear = 365;
    const workingDays = daysPerYear - this.effortCalculation.holidaysAndLeave - this.effortCalculation.trainingDays;
    const hoursPerDay = this.effortCalculation.hoursPerAuditorPerYear / 260;
    const availableHours = workingDays * hoursPerDay;
    return Math.round(availableHours * (1 - this.effortCalculation.administrationOverhead));
  },

  getTotalTaxpayers: function() {
    return this.regions.reduce((sum, r) => sum + r.taxpayers, 0);
  },

  getTotalRiskyTaxpayers: function() {
    return Math.round(this.getTotalTaxpayers() * (this.riskDistribution.percentageRisky / 100));
  },

  getTaxTypeByName: function(name) {
    return this.taxTypes.find(t => t.name === name);
  },

  getIndustryByName: function(name) {
    return this.industries.find(i => i.name === name);
  },

  getTaxpayerCategoryById: function(id) {
    return this.taxpayerCategories.find(c => c.id === id);
  },

  getRiskIndicatorById: function(id) {
    return this.riskIndicators.find(ri => ri.id === id);
  }
};
