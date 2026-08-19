import React, { createContext, useState, useContext, useEffect } from 'react';
import { denormalizeRegionName, getApiRegionName } from '../utils/regionNormalizer';

// Create the context
const RegionalContext = createContext();

// Tax center mapping: region (lowercase_underscore) -> list of tax centers
// IMPORTANT: All keys MUST be in lowercase_underscore format to match API/data format
const TAX_CENTER_MAPPING = {
  'addis_ababa': ['addis_ababa-tc1', 'addis_ababa-tc2', 'addis_ababa-tc3'],
  'oromia': ['oromia-tc1', 'oromia-tc2', 'oromia-tc3'],
  'amhara': ['amhara-tc1', 'amhara-tc2', 'amhara-tc3'],
  'snnpr': ['snnpr-tc1', 'snnpr-tc2', 'snnpr-tc3'],
  'somali': ['somali-tc1', 'somali-tc2', 'somali-tc3'],
  'dire_dawa': ['dire_dawa-tc1', 'dire_dawa-tc2', 'dire_dawa-tc3'],
  'tigray': ['tigray-tc1', 'tigray-tc2', 'tigray-tc3']
};

// Provider component
export function RegionalProvider({ children, userRole }) {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedTaxCenter, setSelectedTaxCenter] = useState(null);
  const [storageUpdateTrigger, setStorageUpdateTrigger] = useState(0);
  
  // Assigned region for regional directors - now DYNAMIC from multiple sources
  // CRITICAL: Must be in lowercase_underscore format
  let assignedRegion = null;
  
  if (userRole === 'regional') {
    // Try localStorage first (set when plan is sent)
    assignedRegion = localStorage.getItem('user_assigned_region');
    
    // Normalize if titlecase was stored
    if (assignedRegion) {
      assignedRegion = denormalizeRegionName(assignedRegion);
    }
    
    // If not found, check localStorage for stored assignments
    if (!assignedRegion) {
      const storedAssignment = localStorage.getItem('regional_director_assignment');
      if (storedAssignment) {
        assignedRegion = denormalizeRegionName(storedAssignment);
      }
    }
  }
  
  // Assigned tax center for tax center managers or audit team leader
  // DYNAMIC from localStorage - can be set from multiple sources
  const [testTaxCenter, setTestTaxCenter] = useState(null);
  let assignedTaxCenter = null;
  let assignedTaxCenterRegion = null;
  
  if (userRole === 'tax_center' || userRole === 'audit_team_leader') {
    // PRIORITY ORDER (most current first):
    // 1. Test tax center (for testing specific tax centers)
    // 2. Currently selected tax center (from cascade or other views) - PRIMARY
    // 3. user_assigned_tax_center (legacy, from allocations)
    // 4. First available tax center from localStorage keys (tax_center_0, tax_center_1, etc.)
    assignedTaxCenter = testTaxCenter || 
                       localStorage.getItem('tax_center_selection') ||
                       localStorage.getItem('user_assigned_tax_center') ||
                       localStorage.getItem('test_tax_center') || 
                       localStorage.getItem('tax_center_0') ||
                       null;
    
    // Get the region for this tax center - MUST use matching region key in lowercase_underscore
    // Priority: use tax_center_selection_region if tax_center_selection is set
    const selectedTaxCenter = localStorage.getItem('tax_center_selection');
    if (selectedTaxCenter) {
      // If currently selected tax center exists, use its region
      assignedTaxCenterRegion = localStorage.getItem('tax_center_selection_region') || null;
    } else {
      // Otherwise fall back to allocation region keys
      assignedTaxCenterRegion = localStorage.getItem('user_assigned_tax_center_region') ||
                               localStorage.getItem('tax_center_0_region') ||
                               localStorage.getItem('tax_center_1_region') ||
                               localStorage.getItem('tax_center_2_region') ||
                               null;
    }
    
    // Normalize region to lowercase_underscore format
    if (assignedTaxCenterRegion) {
      assignedTaxCenterRegion = denormalizeRegionName(assignedTaxCenterRegion);
    }
    
    console.log('🏢 Tax Center Assignment:', { 
      assignedTaxCenter, 
      assignedTaxCenterRegion, 
      testTaxCenter,
      selectedTaxCenter,
      debugKeys: {
        tax_center_selection: localStorage.getItem('tax_center_selection'),
        tax_center_selection_region: localStorage.getItem('tax_center_selection_region'),
        tax_center_0: localStorage.getItem('tax_center_0'),
        tax_center_0_region: localStorage.getItem('tax_center_0_region')
      }
    });
  }

  // When user role changes, reset selections
  useEffect(() => {
    setSelectedRegion(null);
    setSelectedTaxCenter(null);
  }, [userRole]);

  // When region changes, reset tax center selection
  useEffect(() => {
    setSelectedTaxCenter(null);
  }, [selectedRegion]);

  // Expose a way to trigger context updates when localStorage changes
  const triggerUpdate = () => {
    setStorageUpdateTrigger(prev => prev + 1);
  };

  return (
    <RegionalContext.Provider value={{ 
      selectedRegion, 
      setSelectedRegion,
      selectedTaxCenter,
      setSelectedTaxCenter,
      userRole,
      assignedRegion,
      assignedTaxCenter,
      assignedTaxCenterRegion: assignedTaxCenterRegion,  // Use only tax center's actual region, no fallback
      setTestTaxCenter,
      TAX_CENTER_MAPPING,
      triggerUpdate
    }}>
      {children}
    </RegionalContext.Provider>
  );
}

// Custom hook to use the context
export function useRegional() {
  const context = useContext(RegionalContext);
  if (!context) {
    throw new Error('useRegional must be used within RegionalProvider');
  }
  return context;
}
