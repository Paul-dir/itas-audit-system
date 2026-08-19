import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * AllocationContext - Pure React allocation workflow state management
 * Handles complete allocation flow: Director → Regions → Tax Centers
 */

const AllocationContext = createContext(null);

export function AllocationProvider({ children }) {
  // ===== CORE STATE =====
  const [allocations, setAllocations] = useState([]);
  const [currentView, setCurrentView] = useState('director-list'); // director-list, director-create, regional-list, regional-detail, tax-center-list
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  // ===== MOCK DATA =====
  const regions = ['Addis Ababa', 'Oromia', 'Amhara', 'SNNPR', 'Somali'];
  const auditTypes = ['Desk Audit', 'Field Audit', 'Joint Audit', 'Transfer Pricing', 'Comprehensive', 'Issue Audit'];
  const taxCenters = {
    'Addis Ababa': ['Addis Ababa TC1', 'Addis Ababa TC2', 'Addis Ababa TC3'],
    'Oromia': ['Oromia TC1', 'Oromia TC2', 'Oromia TC3'],
    'Amhara': ['Amhara TC1', 'Amhara TC2', 'Amhara TC3'],
    'SNNPR': ['SNNPR TC1', 'SNNPR TC2', 'SNNPR TC3'],
    'Somali': ['Somali TC1', 'Somali TC2', 'Somali TC3']
  };

  // ===== ACTIONS =====

  /**
   * Director creates new allocation to region
   */
  const createAllocation = useCallback((planName, regionName, auditCounts) => {
    const newAlloc = {
      id: `alloc-${Date.now()}`,
      planName,
      region: regionName,
      status: 'PENDING_AT_REGION',
      createdBy: 'Director',
      createdDate: new Date().toISOString(),
      auditCounts: auditCounts, // { 'Desk Audit': 50, 'Field Audit': 30, ... }
      regionalFeedback: null,
      taxCenterAllocations: {}, // Will be filled by regional director
      taxCenterFeedback: {}
    };

    setAllocations([...allocations, newAlloc]);
    return newAlloc;
  }, [allocations]);

  /**
   * Regional director receives and reviews allocation
   */
  const reviewAllocation = useCallback((allocationId) => {
    setSelectedAllocation(allocationId);
    setCurrentView('regional-detail');
  }, []);

  /**
   * Regional director accepts allocation and moves to tax center distribution
   */
  const acceptAllocation = useCallback((allocationId) => {
    setAllocations(prev =>
      prev.map(a =>
        a.id === allocationId
          ? { ...a, status: 'ACCEPTED_BY_REGION' }
          : a
      )
    );
  }, []);

  /**
   * Regional director rejects allocation
   */
  const rejectAllocation = useCallback((allocationId, reason) => {
    setAllocations(prev =>
      prev.map(a =>
        a.id === allocationId
          ? { ...a, status: 'REJECTED_BY_REGION', rejectionReason: reason }
          : a
      )
    );
    setCurrentView('regional-list');
  }, []);

  /**
   * Regional director allocates to tax centers
   */
  const allocateToTaxCenters = useCallback((allocationId, taxCenterDistribution) => {
    setAllocations(prev =>
      prev.map(a =>
        a.id === allocationId
          ? {
              ...a,
              taxCenterAllocations: taxCenterDistribution,
              status: 'SENT_TO_TAX_CENTERS'
            }
          : a
      )
    );
  }, []);

  /**
   * Tax center manager provides feedback
   */
  const submitTaxCenterFeedback = useCallback((allocationId, taxCenter, feedback) => {
    setAllocations(prev =>
      prev.map(a =>
        a.id === allocationId
          ? {
              ...a,
              taxCenterFeedback: {
                ...a.taxCenterFeedback,
                [taxCenter]: feedback
              }
            }
          : a
      )
    );
  }, []);

  /**
   * Get allocations for director (all allocations)
   */
  const getDirectorAllocations = useCallback(() => {
    return allocations;
  }, [allocations]);

  /**
   * Get allocations for regional director (only for their region)
   */
  const getRegionalAllocations = useCallback((region) => {
    return allocations.filter(a => a.region === region);
  }, [allocations]);

  /**
   * Get allocations for tax center manager (only for their tax center)
   */
  const getTaxCenterAllocations = useCallback((taxCenter) => {
    return allocations.filter(a =>
      a.taxCenterAllocations &&
      Object.keys(a.taxCenterAllocations).includes(taxCenter)
    );
  }, [allocations]);

  /**
   * Navigate to view
   */
  const navigateTo = useCallback((view) => {
    setCurrentView(view);
    setSelectedAllocation(null);
    setSelectedRegion(null);
  }, []);

  /**
   * Navigate to regional view for specific region
   */
  const navigateToRegion = useCallback((region) => {
    setSelectedRegion(region);
    setCurrentView('regional-list');
  }, []);

  const value = {
    // State
    allocations,
    currentView,
    selectedAllocation,
    selectedRegion,

    // Config
    regions,
    auditTypes,
    taxCenters,

    // Actions
    createAllocation,
    reviewAllocation,
    acceptAllocation,
    rejectAllocation,
    allocateToTaxCenters,
    submitTaxCenterFeedback,
    getDirectorAllocations,
    getRegionalAllocations,
    getTaxCenterAllocations,
    navigateTo,
    navigateToRegion,

    // Utils
    setSelectedAllocation,
    setAllocations // For bulk updates if needed
  };

  return (
    <AllocationContext.Provider value={value}>
      {children}
    </AllocationContext.Provider>
  );
}

export function useAllocation() {
  const context = useContext(AllocationContext);
  if (!context) {
    throw new Error('useAllocation must be used within AllocationProvider');
  }
  return context;
}
