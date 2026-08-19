import { loadDataDirect as loadData, saveDataDirect as saveData } from '../services/dataService';

export function addActivity(event, ref, status) {
  const data = loadData();
  data.activity.unshift({ event, ref, status, date: new Date().toLocaleString() });
  if (data.activity.length > 50) data.activity.pop();
  saveData(data);
}

export function createAuditPlan(planData) {
  const data = loadData();
  const totalCases = planData.totalCases || 0;
  const plan = {
    id: 'AP-' + String(data.planCounter++).padStart(4, '0'),
    version: 1,
    fiscalYear: planData.fiscalYear,
    startDate: planData.startDate,
    endDate: planData.endDate,
    strategy: planData.strategy || '',
    name: planData.name || `Annual Audit Plan ${planData.fiscalYear}`,
    status: planData.submitImmediate ? 'SUBMITTED_TO_DIRECTOR' : (planData.status || 'DRAFT'),
    workflowStatus: planData.submitImmediate ? 'DIRECTOR_FINAL_REVIEW' : 'DRAFT', // ✅ Initialize workflow status
    createdDate: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    auditTypeAllocation: planData.auditTypeAllocation || {},
    regionalAllocation: planData.regionalAllocation || {},
    totalCases: totalCases,
    totalVolume: totalCases, // For backward compatibility
    totalEffort: planData.totalEffort || 0,
    totalEffortHours: planData.totalEffort || 0,
    approvalHistory: [
      {
        action: 'SUBMITTED_TO_DIRECTOR',
        by: 'Audit Planning Team',
        date: new Date().toISOString(),
        notes: 'Plan submitted for director review',
        version: 1
      }
    ],
    regionFeedbackStatus: {},
    taxCenterAllocations: {},
    taxCenterFeedback: [],
    riskEngine: {},
    allocationMetadata: {}
  };
  
  data.plans.push(plan);
  addActivity(
    planData.submitImmediate ? 'Plan Created & Submitted' : 'Plan Created', 
    plan.id, 
    `${plan.status} (v${plan.version})`
  );
  saveData(data);
  return plan;
}

// Wrapper function for CreatePlanModal compatibility
export function createNationalPlan(year, allocations, effort, startDate, endDate) {
  // Convert allocations array to regional allocation object
  const regionalAllocation = {};
  const auditTypeAllocation = {
    desk_audit: 0,
    field_audit: 0,
    joint_audit: 0,
    transfer_pricing: 0,
    comprehensive: 0,
    issue_audit: 0
  };
  
  let totalCases = 0;
  
  allocations.forEach(alloc => {
    const regionKey = alloc.region.toLowerCase().replace(/ /g, '_');
    regionalAllocation[regionKey] = {
      desk_audit: alloc.desk || 0,
      field_audit: alloc.field || 0,
      joint_audit: 0, // Not in modal, default to 0
      transfer_pricing: alloc.tp || 0,
      comprehensive: 0, // Not in modal, default to 0
      issue_audit: alloc.issue || 0
    };
    
    // Aggregate by audit type
    auditTypeAllocation.desk_audit += alloc.desk || 0;
    auditTypeAllocation.field_audit += alloc.field || 0;
    auditTypeAllocation.transfer_pricing += alloc.tp || 0;
    auditTypeAllocation.issue_audit += alloc.issue || 0;
    
    totalCases += alloc.total || 0;
  });
  
  return createAuditPlan({
    fiscalYear: parseInt(year),
    startDate,
    endDate,
    name: `Annual Audit Plan ${year}`,
    status: 'DRAFT',
    submitImmediate: false,
    regionalAllocation,
    auditTypeAllocation,
    totalCases,
    totalEffort: effort
  });
}

export function updateAuditPlan(planId, planData) {
  const data = loadData();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan) return false;
  
  // Save current version to history
  plan.versionHistory.push({
    version: plan.version,
    data: {
      fiscalYear: plan.fiscalYear,
      startDate: plan.startDate,
      endDate: plan.endDate,
      tactics: plan.tactics,
      auditTypes: JSON.parse(JSON.stringify(plan.auditTypes)),
      locations: JSON.parse(JSON.stringify(plan.locations)),
      totalVolume: plan.totalVolume,
      totalEffortHours: plan.totalEffortHours
    },
    modifiedBy: plan.status === 'REVISION_REQUESTED' ? 'Audit Team (after revision)' : 'Audit Team',
    modifiedDate: plan.lastModified
  });
  
  // Increment version
  plan.version++;
  
  plan.fiscalYear = planData.fiscalYear;
  plan.startDate = planData.startDate;
  plan.endDate = planData.endDate;
  plan.duration = planData.duration;
  plan.tactics = planData.tactics || '';
  plan.notes = planData.notes || '';
  plan.auditTypes = planData.auditTypes || [];
  plan.locations = planData.locations || [];
  plan.skillRequirements = planData.skillRequirements || [];
  plan.totalVolume = planData.totalVolume || 0;
  plan.totalEffortHours = planData.totalEffortHours || 0;
  plan.lastModified = new Date().toISOString();
  
  if (planData.submitImmediate && (plan.status === 'DRAFT' || plan.status === 'REVISION_REQUESTED')) {
    plan.status = 'SUBMITTED_TO_DIRECTOR';
    plan.approvalHistory.push({ 
      action: 'SUBMITTED_TO_DIRECTOR', 
      by: 'Audit Team', 
      date: new Date().toISOString(),
      version: plan.version
    });
    addActivity('Plan Updated & Submitted', plan.id, `SUBMITTED_TO_DIRECTOR (v${plan.version})`);
  } else {
    addActivity('Plan Updated', plan.id, `${plan.status} (v${plan.version})`);
  }
  
  saveData(data);
  return true;
}

export function submitPlanToDirector(planId) {
  const data = loadData();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan) return false;

  // Prevent resubmission - only allow submit from DRAFT or REVISION_REQUESTED status
  if (plan.status !== 'DRAFT' && plan.status !== 'REVISION_REQUESTED') {
    console.warn(`Cannot submit plan with status ${plan.status}. Only DRAFT or REVISION_REQUESTED plans can be submitted.`);
    return false;
  }

  plan.status = 'SUBMITTED_TO_DIRECTOR';
  plan.directorFeedbackRequested = true;
  plan.submittedToDirectorDate = new Date().toISOString();
  plan.approvalHistory.push({
    action: 'SUBMITTED_TO_DIRECTOR',
    by: 'Planning Team',
    date: new Date().toISOString(),
    version: plan.version,
    notes: 'Plan submitted for director review'
  });

  addActivity('Plan Submitted to Director', plan.id, 'SUBMITTED_TO_DIRECTOR');
  saveData(data);
  return true;
}

export function directorApprovePlan(planId, notes = '') {
  const data = loadData();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan) return false;

  plan.status = 'DIRECTOR_APPROVED';
  plan.directorNotes = notes;
  plan.directorApprovedDate = new Date().toISOString();
  plan.approvalHistory.push({
    action: 'DIRECTOR_APPROVED',
    by: 'Director',
    date: new Date().toISOString(),
    version: plan.version,
    notes: notes
  });

  addActivity('Plan Approved by Director', plan.id, 'DIRECTOR_APPROVED');
  saveData(data);
  return true;
}

export function directorSendToRegions(planId, selectedRegions = null) {
  const data = loadData();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan) return false;

  // Prevent resending - only allow from DIRECTOR_APPROVED status
  if (plan.status !== 'DIRECTOR_APPROVED') {
    console.warn(`Cannot send to regions. Plan status is ${plan.status}, but must be DIRECTOR_APPROVED.`);
    return false;
  }

  plan.status = 'AWAITING_REGIONAL_FEEDBACK';
  plan.sentToRegionsDate = new Date().toISOString();
  plan.regionFeedbackStatus = {}; // Track feedback from each region
  
  // If selectedRegions provided, only send to those regions
  // Otherwise send to all regions (backward compatibility)
  const targetRegions = selectedRegions || plan.locations?.map(l => l.name) || [];
  
  // Initialize feedback tracking for selected regions only
  targetRegions.forEach(regionName => {
    plan.regionFeedbackStatus[regionName] = {
      status: 'pending', // pending, received, acknowledged
      taxCenterFeedback: [],
      regionalFeedback: null,
      receivedDate: null
    };
  });

  plan.approvalHistory.push({
    action: 'SENT_TO_REGIONS_FOR_FEEDBACK',
    by: 'Director',
    date: new Date().toISOString(),
    version: plan.version,
    details: `Sent to ${targetRegions.length} region(s): ${targetRegions.join(', ')}`
  });

  // Create regional director assignments for each region receiving the plan
  assignRegionsToDirectors(data, targetRegions, planId);

  addActivity('Plan Sent to Regions for Feedback', plan.id, 'AWAITING_REGIONAL_FEEDBACK');
  saveData(data);
  return true;
}

// Helper function to assign regions to regional directors
function assignRegionsToDirectors(data, regions, planId) {
  // Initialize regional assignments if not exists
  if (!data.regionalDirectorAssignments) {
    data.regionalDirectorAssignments = {};
  }

  // For each region in the plan, create an assignment
  regions.forEach(region => {
    // Store the mapping: region -> planId
    data.regionalDirectorAssignments[region] = {
      planId: planId,
      assignedDate: new Date().toISOString(),
      status: 'active'
    };

    // Also store in localStorage for quick access when switching users
    localStorage.setItem(`regional_assignment_${region}`, JSON.stringify({
      planId: planId,
      assignedDate: new Date().toISOString()
    }));
  });
}

export function regionalDirectorViewPlan(planId, region) {
  const data = loadData();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan) return null;

  // Return only the relevant location for this region
  const regionLocation = plan.locations?.find(l => l.name === region);
  if (!regionLocation) return null;

  return {
    ...plan,
    locations: [regionLocation], // Only show their region
    viewedByRegion: region,
    viewDate: new Date().toISOString()
  };
}

export function taxCenterReceiveAllocation(planId, region, taxCenterName) {
  const data = loadData();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan) return null;

  // Return plan filtered for this tax center
  const regionLocation = plan.locations?.find(l => l.name === region);
  if (!regionLocation) return null;

  // Create tax center specific view (same format as region, just their allocation)
  return {
    planId: plan.id,
    planName: plan.name || 'Annual Audit Plan',
    version: plan.version,
    region: region,
    taxCenter: taxCenterName,
    totalCases: regionLocation.cases,
    auditTypes: plan.auditTypes,
    locations: [regionLocation],
    status: 'AWAITING_FEEDBACK',
    receivedDate: new Date().toISOString()
  };
}

export function submitRegionalFeedback(planId, region, feedback, taxCenterFeedbackArray) {
  const data = loadData();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan) return false;

  // Store regional feedback
  if (!plan.regionFeedbackStatus) {
    plan.regionFeedbackStatus = {};
  }

  if (plan.regionFeedbackStatus[region]?.status === 'received') {
    return false; // Already submitted
  }

  plan.regionFeedbackStatus[region] = {
    status: 'received',
    regionalFeedback: feedback,
    receivedDate: new Date().toISOString(),
    taxCenterFeedback: taxCenterFeedbackArray || []
  };

  plan.approvalHistory = plan.approvalHistory || [];
  plan.approvalHistory.push({
    action: 'REGIONAL_FEEDBACK_RECEIVED',
    by: `${region} Regional Director`,
    date: new Date().toISOString(),
    region: region,
    version: plan.version
  });

  // ✅ Get all regions that the plan was distributed to (from regionalAllocation)
  const planRegions = plan.regionalAllocation ? Object.keys(plan.regionalAllocation) : [];
  
  // ✅ Check if all regions that received the plan have submitted feedback
  const allRegionsFeedbackReceived = planRegions.length > 0 && 
    planRegions.every(r => plan.regionFeedbackStatus[r]?.status === 'received');
  
  console.log('🔍 FEEDBACK STATUS CHECK:', {
    planId: plan.id,
    planRegions: planRegions,
    feedbackReceived: Object.keys(plan.regionFeedbackStatus),
    allRegionsFeedbackReceived: allRegionsFeedbackReceived,
    currentStatus: plan.status
  });
  
  if (allRegionsFeedbackReceived && plan.status === 'AWAITING_REGIONAL_FEEDBACK') {
    plan.status = 'FEEDBACK_COLLECTED';
    plan.feedbackCollectedDate = new Date().toISOString();
    plan.approvalHistory.push({
      action: 'FEEDBACK_COLLECTED',
      by: 'System',
      date: new Date().toISOString(),
      notes: 'All regional feedback has been collected from ' + planRegions.length + ' regions',
      version: plan.version
    });
    console.log('✅ ALL REGIONS SUBMITTED - Status changed to FEEDBACK_COLLECTED');
    addActivity('All Regional Feedback Collected', plan.id, 'FEEDBACK_COLLECTED');
  } else {
    console.log(`⏳ Feedback Received from ${region} - Awaiting feedback from other regions`);
    addActivity(`Feedback Received from ${region}`, plan.id, 'FEEDBACK_RECEIVED');
  }

  plan.lastModified = new Date().toISOString();
  saveData(data);
  return true;
}

export function submitTaxCenterFeedback(planId, region, taxCenter, feedbackPayload, fullName) {
  const data = loadData();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan) return { success: false, message: 'Plan not found' };

  // Check for duplicate submission
  if (plan.taxCenterFeedback?.[region]?.[taxCenter]?.feedbackDate) {
    return { 
      success: false, 
      message: 'Feedback already submitted', 
      submittedDate: plan.taxCenterFeedback[region][taxCenter].feedbackDate 
    };
  }

  // Initialize structure
  if (!plan.taxCenterFeedback) plan.taxCenterFeedback = {};
  if (!plan.taxCenterFeedback[region]) plan.taxCenterFeedback[region] = {};

  // Save the structured feedback
  plan.taxCenterFeedback[region][taxCenter] = {
    feedbackByType: feedbackPayload,
    feedbackDate: new Date().toISOString(),
    feedbackBy: fullName || 'Tax Center Manager',
    taxCenter: taxCenter,
    planId: planId
  };

  // Also mark for regional director to collect
  if (!plan.regionFeedbackTaxCenters) plan.regionFeedbackTaxCenters = {};
  if (!plan.regionFeedbackTaxCenters[region]) plan.regionFeedbackTaxCenters[region] = [];
  if (!plan.regionFeedbackTaxCenters[region].includes(taxCenter)) {
    plan.regionFeedbackTaxCenters[region].push(taxCenter);
  }

  addActivity(`Feedback from ${taxCenter}`, plan.id, 'TAX_CENTER_FEEDBACK');
  saveData(data);
  return { success: true };
}

export function planReadyForAmendment(planId) {
  const data = loadData();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan) return false;

  // Check if all regions have provided feedback
  let allFeedbackReceived = true;
  if (plan.regionFeedbackStatus) {
    Object.values(plan.regionFeedbackStatus).forEach(status => {
      if (status.status !== 'received') {
        allFeedbackReceived = false;
      }
    });
  }

  if (allFeedbackReceived) {
    plan.status = 'READY_FOR_AMENDMENT';
    addActivity('All Regional Feedback Received', plan.id, 'READY_FOR_AMENDMENT');
    saveData(data);
    return true;
  }
  return false;
}

export function amendPlanAndResubmit(planId, planData) {
  const data = loadData();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan) return false;

  // Save amended version
  plan.versionHistory.push({
    version: plan.version,
    data: {
      locations: JSON.parse(JSON.stringify(plan.locations))
    },
    modifiedBy: 'Planning Team (Amendment)',
    modifiedDate: plan.lastModified
  });

  plan.version++;
  plan.locations = planData.locations || plan.locations;
  plan.totalVolume = planData.totalVolume || plan.totalVolume;
  plan.totalEffortHours = planData.totalEffortHours || plan.totalEffortHours;
  plan.amendments = planData.amendments || 'Amended based on regional feedback';
  plan.lastModified = new Date().toISOString();

  plan.status = 'RESUBMITTED_TO_DIRECTOR';
  plan.approvalHistory.push({
    action: 'AMENDED_AND_RESUBMITTED_TO_DIRECTOR',
    by: 'Planning Team',
    date: new Date().toISOString(),
    version: plan.version,
    amendments: plan.amendments
  });

  addActivity('Plan Amended & Resubmitted to Director', plan.id, `RESUBMITTED_TO_DIRECTOR (v${plan.version})`);
  saveData(data);
  return true;
}

export function directorFinalApprove(planId, notes = '') {
  const data = loadData();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan) return false;

  plan.status = 'DIRECTOR_FINAL_APPROVED';
  plan.directorFinalNotes = notes;
  plan.directorFinalApprovedDate = new Date().toISOString();
  plan.approvalHistory.push({
    action: 'DIRECTOR_FINAL_APPROVED',
    by: 'Director',
    date: new Date().toISOString(),
    version: plan.version,
    notes: notes
  });

  addActivity('Plan Finally Approved by Director', plan.id, 'DIRECTOR_FINAL_APPROVED');
  saveData(data);
  return true;
}

export function submitToSeniorManagement(planId) {
  const data = loadData();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan) return false;

  // Prevent resubmission - allow from FEEDBACK_COLLECTED or DIRECTOR_APPROVED status
  if (plan.status !== 'FEEDBACK_COLLECTED' && plan.status !== 'DIRECTOR_APPROVED') {
    console.warn(`Cannot submit to Senior Management. Plan status is ${plan.status}, but must be FEEDBACK_COLLECTED or DIRECTOR_APPROVED.`);
    return false;
  }

  plan.status = 'SUBMITTED_TO_SENIOR_MANAGEMENT';
  plan.sentToSeniorDate = new Date().toISOString();
  plan.approvalHistory.push({
    action: 'SUBMITTED_TO_SENIOR_MANAGEMENT',
    by: 'Director',
    date: new Date().toISOString(),
    notes: 'Plan with consolidated regional feedback submitted to Senior Management',
    version: plan.version
  });

  addActivity('Plan Submitted to Senior Management', plan.id, 'SUBMITTED_TO_SENIOR_MANAGEMENT');
  saveData(data);
  return true;
}

export function directorApprove(planId, notes) {
  const data = loadData();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan || plan.status !== 'SUBMITTED_TO_DIRECTOR') return false;
  
  plan.status = 'DIRECTOR_APPROVED';
  plan.directorNotes = notes || '';
  plan.approvalHistory.push({ 
    action: 'DIRECTOR_APPROVED', 
    by: 'Audit Director', 
    date: new Date().toISOString(), 
    notes,
    version: plan.version
  });
  addActivity('Plan Approved by Director', plan.id, `DIRECTOR_APPROVED (v${plan.version})`);
  saveData(data);
  return true;
}

export function requestRegionalFeedback(planId, selectedRegions) {
  const data = loadData();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan || plan.status !== 'DIRECTOR_APPROVED') return false;
  
  plan.status = 'AWAITING_REGIONAL_FEEDBACK';
  plan.feedbackRequested = true;
  plan.regionalFeedback = selectedRegions.map(region => ({
    region,
    status: 'PENDING',
    submittedDate: null,
    feedback: null
  }));
  
  plan.approvalHistory.push({ 
    action: 'FEEDBACK_REQUESTED', 
    by: 'Audit Director', 
    date: new Date().toISOString(),
    notes: `Feedback requested from ${selectedRegions.length} regions`,
    version: plan.version
  });
  
  addActivity('Regional Feedback Requested', plan.id, `${selectedRegions.length} regions notified`);
  saveData(data);
  return true;
}

export function reviewAndAmendPlan(planId, amendments) {
  const data = loadData();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan || plan.status !== 'FEEDBACK_COLLECTED') return false;
  
  // Save current version to history
  plan.versionHistory.push({
    version: plan.version,
    data: {
      fiscalYear: plan.fiscalYear,
      startDate: plan.startDate,
      endDate: plan.endDate,
      tactics: plan.tactics,
      auditTypes: JSON.parse(JSON.stringify(plan.auditTypes)),
      locations: JSON.parse(JSON.stringify(plan.locations)),
      totalVolume: plan.totalVolume,
      totalEffortHours: plan.totalEffortHours
    },
    modifiedBy: 'Audit Director (incorporating feedback)',
    modifiedDate: plan.lastModified
  });
  
  // Increment version
  plan.version++;
  
  // Apply amendments
  if (amendments.locations) {
    plan.locations = amendments.locations;
  }
  if (amendments.auditTypes) {
    plan.auditTypes = amendments.auditTypes;
  }
  if (amendments.totalVolume) {
    plan.totalVolume = amendments.totalVolume;
  }
  if (amendments.totalEffortHours) {
    plan.totalEffortHours = amendments.totalEffortHours;
  }
  
  plan.status = 'FINALIZED';
  plan.lastModified = new Date().toISOString();
  plan.approvalHistory.push({ 
    action: 'PLAN_FINALIZED', 
    by: 'Audit Director', 
    date: new Date().toISOString(),
    notes: 'Plan finalized after incorporating regional feedback',
    version: plan.version
  });
  
  addActivity('Plan Finalized', plan.id, `Version ${plan.version} - Final`);
  saveData(data);
  return true;
}

export function directorRequestRevision(planId, feedback) {
  const data = loadData();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan || plan.status !== 'SUBMITTED_TO_DIRECTOR') return false;
  
  plan.status = 'REVISION_REQUESTED';
  plan.directorNotes = feedback || '';
  plan.approvalHistory.push({ 
    action: 'REVISION_REQUESTED', 
    by: 'Audit Director', 
    date: new Date().toISOString(), 
    notes: feedback,
    version: plan.version
  });
  addActivity('Revision Requested', plan.id, `REVISION_REQUESTED (v${plan.version})`);
  saveData(data);
  return true;
}

export function directorReject(planId, reason) {
  const data = loadData();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan || plan.status !== 'SUBMITTED_TO_DIRECTOR') return false;
  
  plan.status = 'REJECTED';
  plan.directorNotes = reason || '';
  plan.approvalHistory.push({ 
    action: 'REJECTED', 
    by: 'Audit Director', 
    date: new Date().toISOString(), 
    notes: reason,
    version: plan.version
  });
  addActivity('Plan Rejected', plan.id, `REJECTED (v${plan.version})`);
  saveData(data);
  return true;
}

export function seniorManagementApprove(planId, notes) {
  const data = loadData();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan || plan.status !== 'SUBMITTED_TO_SENIOR_MANAGEMENT') return false;
  
  // Set status back to DIRECTOR_APPROVED to send back to Director for finalization
  plan.status = 'SENIOR_MANAGEMENT_APPROVED';
  plan.lastModified = new Date().toISOString();
  plan.approvalHistory.push({ 
    action: 'SENIOR_MANAGEMENT_APPROVED', 
    by: 'Senior Management', 
    date: new Date().toISOString(),
    notes: notes || 'Plan approved by Senior Management - returned to Director for finalization',
    version: plan.version
  });
  addActivity('Plan Approved by Senior Management', plan.id, `SENIOR_MANAGEMENT_APPROVED (v${plan.version}) - Ready for Director finalization`);
  saveData(data);
  return true;
}

export function seniorManagementReject(planId, reason) {
  const data = loadData();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan || plan.status !== 'SUBMITTED_TO_SENIOR_MANAGEMENT') return false;
  
  plan.status = 'SENIOR_MANAGEMENT_REJECTED';
  plan.approvalHistory.push({ 
    action: 'SENIOR_MANAGEMENT_REJECTED', 
    by: 'Senior Management', 
    date: new Date().toISOString(),
    notes: reason || 'Plan rejected by Senior Management - needs revision',
    version: plan.version
  });
  addActivity('Plan Rejected by Senior Management', plan.id, `SENIOR_MANAGEMENT_REJECTED (v${plan.version})`);
  saveData(data);
  return true;
}

// New: Allow Director to resubmit rejected plan back to Senior Management after making changes
export function directorResubmitRejectedPlan(planId, revisedNotes = '') {
  const data = loadData();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan || plan.status !== 'SENIOR_MANAGEMENT_REJECTED') return false;
  
  // Increment version for the revision
  plan.version++;
  plan.status = 'SUBMITTED_TO_SENIOR_MANAGEMENT';
  plan.lastModified = new Date().toISOString();
  
  plan.approvalHistory.push({ 
    action: 'RESUBMITTED_TO_SENIOR_MANAGEMENT', 
    by: 'Director', 
    date: new Date().toISOString(),
    notes: revisedNotes || 'Plan revised and resubmitted after Senior Management feedback',
    version: plan.version
  });
  
  addActivity('Plan Resubmitted to Senior Management', plan.id, `SUBMITTED_TO_SENIOR_MANAGEMENT (v${plan.version})`);
  saveData(data);
  return true;
}

export function getStatusDisplay(status) {
  const map = {
    'DRAFT': 'Draft',
    'SUBMITTED_TO_DIRECTOR': 'Under Review',
    'DIRECTOR_APPROVED': 'Approved by Director',
    'AWAITING_REGIONAL_FEEDBACK': 'Awaiting Regional Feedback',
    'FEEDBACK_COLLECTED': 'Feedback Collected',
    'FINALIZED': 'Finalized (Ready for Senior Mgmt)',
    'SUBMITTED_TO_SENIOR_MANAGEMENT': 'With Senior Management',
    'SENIOR_MANAGEMENT_APPROVED': 'Approved by Senior Management',
    'SENIOR_MANAGEMENT_REJECTED': 'Rejected by Senior Management',
    'REVISION_REQUESTED': 'Revision Requested',
    'REJECTED': 'Rejected'
  };
  return map[status] || status;
}

export function getBadgeClass(status) {
  const map = {
    'DRAFT': 'draft',
    'SUBMITTED_TO_DIRECTOR': 'submitted',
    'DIRECTOR_APPROVED': 'director-approved',
    'AWAITING_REGIONAL_FEEDBACK': 'feedback',
    'FEEDBACK_COLLECTED': 'feedback-collected',
    'FINALIZED': 'senior-approved',
    'SUBMITTED_TO_SENIOR_MANAGEMENT': 'pending',
    'SENIOR_MANAGEMENT_APPROVED': 'senior-approved',
    'SENIOR_MANAGEMENT_REJECTED': 'rejected',
    'REVISION_REQUESTED': 'pending',
    'REJECTED': 'rejected'
  };
  return map[status] || 'draft';
}

/**
 * Delete a single plan by ID
 * @param {string} planId - The ID of the plan to delete
 * @returns {boolean} - True if deletion was successful
 */
export function deletePlan(planId) {
  const data = loadData();
  const planIndex = data.plans.findIndex(p => p.id === planId);
  
  if (planIndex === -1) {
    console.warn(`Plan ${planId} not found`);
    return false;
  }
  
  // Remove the plan
  const deletedPlan = data.plans.splice(planIndex, 1)[0];
  
  // Add activity log
  addActivity('Plan Deleted', planId, `${deletedPlan.name || 'Unnamed Plan'} (${deletedPlan.status})`);
  
  saveData(data);
  return true;
}

/**
 * Delete all plans
 * @returns {number} - Number of plans deleted
 */
export function deleteAllPlans() {
  const data = loadData();
  const count = data.plans.length;
  
  // Clear all plans
  data.plans = [];
  
  // Reset plan counter
  data.planCounter = 1;
  
  // Add activity log
  addActivity('All Plans Deleted', 'SYSTEM', `${count} plan(s) removed`);
  
  saveData(data);
  return count;
}
