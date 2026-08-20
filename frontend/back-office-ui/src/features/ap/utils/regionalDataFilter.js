/**
 * Regional Data Filtering Utility
 * Ensures regional directors only see plans allocated to their region
 */

export function filterPlansForRegion(plans, userRegion) {
  if (!userRegion) return [];
  
  return plans.filter(plan => {
    // Check if plan has regional allocations for this region
    if (plan.regionalAllocations && Array.isArray(plan.regionalAllocations)) {
      return plan.regionalAllocations.some(ra => 
        normalizeRegion(ra.region) === normalizeRegion(userRegion)
      );
    }
    
    // Fallback: check if plan has feedback for this region
    if (plan.regionalFeedback && typeof plan.regionalFeedback === 'object') {
      return Object.keys(plan.regionalFeedback).some(regionKey => 
        normalizeRegion(regionKey) === normalizeRegion(userRegion)
      );
    }
    
    return false;
  });
}

export function getRegionalAllocation(plan, userRegion) {
  if (!plan.regionalAllocations || !userRegion) return null;
  
  return plan.regionalAllocations.find(ra => 
    normalizeRegion(ra.region) === normalizeRegion(userRegion)
  );
}

export function getRegionalFeedback(plan, userRegion) {
  if (!plan.regionalFeedback || !userRegion) return null;
  
  const feedbackKey = Object.keys(plan.regionalFeedback).find(key =>
    normalizeRegion(key) === normalizeRegion(userRegion)
  );
  
  return feedbackKey ? plan.regionalFeedback[feedbackKey] : null;
}

export function normalizeRegion(region) {
  if (!region) return '';
  return region.toLowerCase().replace(/\s+/g, '_').trim();
}

export function getRegionName(regionId) {
  const regionNames = {
    'addis_ababa': 'Addis Ababa',
    'amhara': 'Amhara',
    'oromia': 'Oromia',
    'snnpr': 'SNNPR',
    'somali': 'Somali',
    'tigray': 'Tigray',
    'afar': 'Afar',
    'dire_dawa': 'Dire Dawa',
    'djibouti': 'Djibouti',
  };
  
  return regionNames[normalizeRegion(regionId)] || regionId;
}
