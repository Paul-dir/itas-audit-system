import React, { useState, useEffect } from 'react';
import { auditConfig } from '../../config/auditConfig';
import DashboardHeader from './DashboardHeader';
import ModuleGrid from './ModuleGrid';
import AuditTypesModule from './modules/AuditTypesModule';
import TaxTypesModule from './modules/TaxTypesModule';
import IndustriesModule from './modules/IndustriesModule';
import TaxpayerCategoriesModule from './modules/TaxpayerCategoriesModule';
import SkillsModule from './modules/SkillsModule';
import RegionsTaxCentersModule from './modules/RegionsTaxCentersModule';
import RiskIndicatorsModule from './modules/RiskIndicatorsModule';
import AuditStandardsModule from './modules/AuditStandardsModule';
import WorkflowApprovalModule from './modules/WorkflowApprovalModule';
import FeatureFlagsModule from './modules/FeatureFlagsModule';
import NationalKPIModule from './modules/NationalKPIModule';

function ConfigurationDashboard() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [configurations, setConfigurations] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Load configurations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('auditConfigurations');
    if (saved) {
      try {
        setConfigurations(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading configurations:', e);
        initializeConfigurations();
      }
    } else {
      initializeConfigurations();
    }
  }, []);

  // Initialize with default config
  const initializeConfigurations = () => {
    const defaultConfig = {
      auditTypes: [...auditConfig.auditTypes],
      taxTypes: [...auditConfig.taxTypes],
      industries: [...auditConfig.industries],
      taxpayerCategories: [...auditConfig.taxpayerCategories],
      skills: [...auditConfig.skills],
      regions: [...auditConfig.regions],
      taxCenters: [...auditConfig.taxCenters],
      riskIndicators: [...auditConfig.riskIndicators],
      auditStandards: { ...auditConfig.auditStandards },
      workflowApproval: { ...auditConfig.workflowApproval },
      featureFlags: { ...auditConfig.featureFlags },
      nationalKPIs: [],
      systemAuditTrail: []
    };
    setConfigurations(defaultConfig);
  };

  // Save to localStorage whenever configurations change
  useEffect(() => {
    if (Object.keys(configurations).length > 0) {
      localStorage.setItem('auditConfigurations', JSON.stringify(configurations));
    }
  }, [configurations]);

  // Handle module update
  const handleModuleUpdate = (moduleKey, data) => {
    setConfigurations(prev => ({
      ...prev,
      [moduleKey]: data
    }));
  };

  // Module definitions for grid
  const modules = [
    {
      id: 'audit_types',
      name: 'Audit Types',
      icon: 'BarChart3',
      count: configurations.auditTypes?.length || 0,
      totalRequired: 6
    },
    {
      id: 'tax_types',
      name: 'Tax Types',
      icon: 'Briefcase',
      count: configurations.taxTypes?.length || 0,
      totalRequired: 7
    },
    {
      id: 'industries',
      name: 'Industries',
      icon: 'Building2',
      count: configurations.industries?.length || 0,
      totalRequired: 10
    },
    {
      id: 'taxpayer_categories',
      name: 'Taxpayer Categories',
      icon: 'Users',
      count: configurations.taxpayerCategories?.length || 0,
      totalRequired: 4
    },
    {
      id: 'skills',
      name: 'Skills Management',
      icon: 'Award',
      count: configurations.skills?.length || 0,
      totalRequired: 12
    },
    {
      id: 'regions',
      name: 'Regions & Tax Centers',
      icon: 'Globe2',
      count: `${configurations.regions?.length || 0} regions`,
      totalRequired: 6
    },
    {
      id: 'risk_indicators',
      name: 'Risk Indicators',
      icon: 'AlertTriangle',
      count: configurations.riskIndicators?.length || 0,
      totalRequired: 10
    },
    {
      id: 'audit_standards',
      name: 'Audit Standards',
      icon: 'CheckCircle2',
      count: 'Configured',
      totalRequired: 1
    },
    {
      id: 'workflow_approval',
      name: 'Workflow & Approval',
      icon: 'GitBranch',
      count: 'Configured',
      totalRequired: 1
    },
    {
      id: 'feature_flags',
      name: 'Feature Flags',
      icon: 'ToggleLeft',
      count: '7 toggles',
      totalRequired: 7
    },
    {
      id: 'national_kpi',
      name: 'National KPI & Mgmt',
      icon: 'Gauge',
      count: configurations.nationalKPIs?.length || 0,
      totalRequired: 1
    },
    {
      id: 'data_management',
      name: 'Data Management',
      icon: 'Database',
      count: 'Ready',
      totalRequired: 1
    }
  ];

  // Filter modules by search
  const filteredModules = modules.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total stats
  const totalModules = modules.length;
  const configuredItems = Object.values(configurations).reduce((sum, val) => {
    if (Array.isArray(val)) return sum + val.length;
    return sum;
  }, 0);

  // Get status for each module
  const getModuleStatus = (moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return 'attention';
    
    const config = configurations[moduleId.replace(/-/g, '_')];
    if (!config) return 'attention';
    
    if (Array.isArray(config)) {
      if (config.length === module.totalRequired) return 'active';
      if (config.length > 0) return 'partial';
      return 'attention';
    }
    
    return 'active';
  };

  // Render module view or dashboard
  if (selectedModule) {
    const renderModuleContent = () => {
      switch (selectedModule) {
        case 'audit_types':
          return <AuditTypesModule data={configurations.auditTypes} onUpdate={(data) => handleModuleUpdate('auditTypes', data)} />;
        case 'tax_types':
          return <TaxTypesModule data={configurations.taxTypes} onUpdate={(data) => handleModuleUpdate('taxTypes', data)} />;
        case 'industries':
          return <IndustriesModule data={configurations.industries} onUpdate={(data) => handleModuleUpdate('industries', data)} />;
        case 'taxpayer_categories':
          return <TaxpayerCategoriesModule data={configurations.taxpayerCategories} onUpdate={(data) => handleModuleUpdate('taxpayerCategories', data)} />;
        case 'skills':
          return <SkillsModule data={configurations.skills} onUpdate={(data) => handleModuleUpdate('skills', data)} />;
        case 'regions':
          return <RegionsTaxCentersModule regions={configurations.regions} taxCenters={configurations.taxCenters} onUpdate={(regions, taxCenters) => {
            handleModuleUpdate('regions', regions);
            handleModuleUpdate('taxCenters', taxCenters);
          }} />;
        case 'risk_indicators':
          return <RiskIndicatorsModule data={configurations.riskIndicators} onUpdate={(data) => handleModuleUpdate('riskIndicators', data)} />;
        case 'audit_standards':
          return <AuditStandardsModule data={configurations.auditStandards} onUpdate={(data) => handleModuleUpdate('auditStandards', data)} />;
        case 'workflow_approval':
          return <WorkflowApprovalModule data={configurations.workflowApproval} onUpdate={(data) => handleModuleUpdate('workflowApproval', data)} />;
        case 'feature_flags':
          return <FeatureFlagsModule data={configurations.featureFlags} onUpdate={(data) => handleModuleUpdate('featureFlags', data)} />;
        case 'national_kpi':
          return <NationalKPIModule configurations={configurations} onUpdate={handleModuleUpdate} />;
        case 'data_management':
          return <NationalKPIModule configurations={configurations} onUpdate={handleModuleUpdate} isDataMgmt={true} />;
        default:
          return null;
      }
    };

    return (
      <div className="min-h-screen bg-neutral-900 text-text-hi p-8">
        <button 
          onClick={() => setSelectedModule(null)}
          className="mb-6 text-blue hover:text-orange-500 transition-colors text-sm font-medium"
        >
          ◀ Back to Dashboard
        </button>
        {renderModuleContent()}
      </div>
    );
  }

  // Dashboard view
  return (
    <div className="min-h-screen bg-neutral-900 text-text-hi p-8">
      <DashboardHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        stats={{
          totalModules,
          configuredItems,
          coverage: '100%'
        }}
      />
      <ModuleGrid 
        modules={filteredModules}
        onModuleClick={setSelectedModule}
        getModuleStatus={getModuleStatus}
      />
    </div>
  );
}

export default ConfigurationDashboard;
