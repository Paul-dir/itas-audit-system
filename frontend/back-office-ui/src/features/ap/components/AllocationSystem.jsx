import React from 'react';
import { AllocationProvider, useAllocation } from '../context/AllocationContext';
import DirectorAllocateView from './allocation/DirectorAllocateView';
import RegionalAllocateView from './allocation/RegionalAllocateView';
import TaxCenterAllocateView from './allocation/TaxCenterAllocateView';
import './allocation/AllocationSystem.css';

/**
 * AllocationSystem - Complete allocation workflow container
 * Handles routing between different allocation views
 */

function AllocationSystemContent() {
  const { currentView } = useAllocation();

  const renderView = () => {
    switch (currentView) {
      case 'director-list':
      case 'director-create':
        return <DirectorAllocateView />;
      case 'regional-list':
      case 'regional-detail':
        return <RegionalAllocateView />;
      case 'tax-center-list':
        return <TaxCenterAllocateView />;
      default:
        return <DirectorAllocateView />;
    }
  };

  return (
    <div className="allocation-system">
      {renderView()}
    </div>
  );
}

export function AllocationSystem() {
  return (
    <AllocationProvider>
      <AllocationSystemContent />
    </AllocationProvider>
  );
}

export default AllocationSystem;
