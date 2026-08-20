import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

/**
 * Data Service - React-based data management
 * Provides centralized state management for all audit planning data
 * Uses localStorage for persistence with automatic migration
 */

export const STORAGE_KEY = 'audit_planning_system_v2';
export const DATA_VERSION = '2.5'; // IMPORTANT: Only increment when sample data changes, NOT for code updates
// Changed to 2.5 to clear all sample plans and start fresh

// Create Data Context
const DataContext = createContext(null);

export function getDefaultData() {
  // Sample plan for demonstration with enhanced status tracking
  const samplePlan = {
    id: 'AP-0001',
    name: 'Annual Audit Plan 2027',
    status: 'DIRECTOR_APPROVED', // Ready to submit to regions
    version: 1,
    fiscalYear: 2027,
    createdDate: new Date().toISOString(),
    // ✅ Track which regions have been sent this plan (for regional director access)
    sentToRegions: [], // Empty - not submitted yet
    sentToRegionsDate: null,
    // ✅ Track feedback status by region
    regionFeedbackStatus: {
      'addis_ababa': {
        status: 'feedback_collected',
        receivedDate: new Date(Date.now() - 7*24*60*60*1000).toISOString(),
        acknowledgedDate: new Date(Date.now() - 6*24*60*60*1000).toISOString()
      },
      'oromia': {
        status: 'feedback_collected',
        receivedDate: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
        acknowledgedDate: new Date(Date.now() - 4*24*60*60*1000).toISOString()
      },
      'amhara': {
        status: 'feedback_collected',
        receivedDate: new Date(Date.now() - 6*24*60*60*1000).toISOString(),
        acknowledgedDate: new Date(Date.now() - 5*24*60*60*1000).toISOString()
      },
      'snnpr': {
        status: 'feedback_collected',
        receivedDate: new Date(Date.now() - 7*24*60*60*1000).toISOString(),
        acknowledgedDate: new Date(Date.now() - 6*24*60*60*1000).toISOString()
      },
      'somali': {
        status: 'feedback_collected',
        receivedDate: new Date(Date.now() - 8*24*60*60*1000).toISOString(),
        acknowledgedDate: new Date(Date.now() - 7*24*60*60*1000).toISOString()
      }
    },
    regionalAllocation: {
      'addis_ababa': {
        'desk_audit': 50,
        'field_audit': 30,
        'joint_audit': 20,
        'transfer_pricing': 10,
        'comprehensive': 15,
        'issue_audit': 5
      },
      'amhara': {
        'desk_audit': 40,
        'field_audit': 25,
        'joint_audit': 15,
        'transfer_pricing': 8,
        'comprehensive': 12,
        'issue_audit': 4
      },
      'oromia': {
        'desk_audit': 60,
        'field_audit': 40,
        'joint_audit': 25,
        'transfer_pricing': 12,
        'comprehensive': 18,
        'issue_audit': 6
      },
      'snnpr': {
        'desk_audit': 35,
        'field_audit': 20,
        'joint_audit': 15,
        'transfer_pricing': 7,
        'comprehensive': 10,
        'issue_audit': 3
      },
      'somali': {
        'desk_audit': 25,
        'field_audit': 15,
        'joint_audit': 10,
        'transfer_pricing': 5,
        'comprehensive': 8,
        'issue_audit': 2
      }
    },
    // NEW: Unified allocation status tracking
    allocationStatus: {
      'addis_ababa': {
        status: 'SENT',
        sentDate: new Date(Date.now() - 7*24*60*60*1000).toISOString(),
        sentBy: 'Regional Director',
        taxCenterReceipts: {
          'addis_ababa-tc1': { status: 'RECEIVED', receivedDate: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
          'addis_ababa-tc2': { status: 'RECEIVED', receivedDate: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
          'addis_ababa-tc3': { status: 'RECEIVED', receivedDate: new Date(Date.now() - 5*24*60*60*1000).toISOString() }
        }
      },
      'amhara': {
        status: 'SENT',
        sentDate: new Date(Date.now() - 10*24*60*60*1000).toISOString(),
        sentBy: 'Regional Director',
        taxCenterReceipts: {
          'amhara-tc1': { status: 'RECEIVED', receivedDate: new Date(Date.now() - 8*24*60*60*1000).toISOString() },
          'amhara-tc2': { status: 'RECEIVED', receivedDate: new Date(Date.now() - 8*24*60*60*1000).toISOString() },
          'amhara-tc3': { status: 'RECEIVED', receivedDate: new Date(Date.now() - 8*24*60*60*1000).toISOString() }
        }
      },
      'oromia': {
        status: 'SENT',
        sentDate: new Date(Date.now() - 14*24*60*60*1000).toISOString(),
        sentBy: 'Regional Director',
        taxCenterReceipts: {
          'oromia-tc1': { status: 'RECEIVED', receivedDate: new Date(Date.now() - 12*24*60*60*1000).toISOString() },
          'oromia-tc2': { status: 'RECEIVED', receivedDate: new Date(Date.now() - 12*24*60*60*1000).toISOString() },
          'oromia-tc3': { status: 'RECEIVED', receivedDate: new Date(Date.now() - 12*24*60*60*1000).toISOString() }
        }
      },
      'snnpr': {
        status: 'PENDING',
        sentDate: null,
        sentBy: null,
        taxCenterReceipts: {}
      },
      'somali': {
        status: 'PENDING',
        sentDate: null,
        sentBy: null,
        taxCenterReceipts: {}
      }
    },
    // Enhanced: Support for pending/accepted allocations at REGIONAL level
    regionalAllocations: [
      // Regional Director accepts/rejects allocations from Director
      // ADDIS ABABA
      {
        id: 'alloc-add-001',
        region: 'addis_ababa',
        status: 'PENDING_ACCEPTANCE',
        sentDate: new Date(Date.now() - 7*24*60*60*1000).toISOString(), // 7 days ago
        dueDate: new Date(Date.now() + 3*24*60*60*1000).toISOString(), // Due in 3 days
        acceptedDate: null,
        rejectionReason: null,
        allocationDetails: { desk: 50, field: 30, joint: 20 }
      },
      // AMHARA
      {
        id: 'alloc-amh-001',
        region: 'amhara',
        status: 'ACCEPTED',
        sentDate: new Date(Date.now() - 14*24*60*60*1000).toISOString(),
        acceptedDate: new Date(Date.now() - 7*24*60*60*1000).toISOString(),
        allocationDetails: { desk: 40, field: 25, joint: 15 }
      },
      // OROMIA
      {
        id: 'alloc-oro-001',
        region: 'oromia',
        status: 'ACCEPTED',
        sentDate: new Date(Date.now() - 21*24*60*60*1000).toISOString(),
        acceptedDate: new Date(Date.now() - 14*24*60*60*1000).toISOString(),
        allocationDetails: { desk: 60, field: 40, joint: 25 }
      },
      // SNNPR
      {
        id: 'alloc-snnpr-001',
        region: 'snnpr',
        status: 'PENDING_ACCEPTANCE',
        sentDate: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
        dueDate: new Date(Date.now() + 5*24*60*60*1000).toISOString(),
        acceptedDate: null,
        allocationDetails: { desk: 35, field: 20, joint: 15 }
      },
      // SOMALI
      {
        id: 'alloc-som-001',
        region: 'somali',
        status: 'ACCEPTED',
        sentDate: new Date(Date.now() - 28*24*60*60*1000).toISOString(),
        acceptedDate: new Date(Date.now() - 21*24*60*60*1000).toISOString(),
        allocationDetails: { desk: 25, field: 15, joint: 10 }
      }
    ],
    taxCenterAllocations: {
      'addis_ababa': {
        'addis_ababa-tc1': {
          'desk_audit': 20,
          'field_audit': 12,
          'joint_audit': 8,
          'transfer_pricing': 4,
          'comprehensive': 6,
          'issue_audit': 2
        },
        'addis_ababa-tc2': {
          'desk_audit': 18,
          'field_audit': 10,
          'joint_audit': 7,
          'transfer_pricing': 3,
          'comprehensive': 5,
          'issue_audit': 2
        },
        'addis_ababa-tc3': {
          'desk_audit': 12,
          'field_audit': 8,
          'joint_audit': 5,
          'transfer_pricing': 3,
          'comprehensive': 4,
          'issue_audit': 1
        }
      },
      'amhara': {
        'amhara-tc1': {
          'desk_audit': 15,
          'field_audit': 10,
          'joint_audit': 6,
          'transfer_pricing': 3,
          'comprehensive': 4,
          'issue_audit': 1
        },
        'amhara-tc2': {
          'desk_audit': 14,
          'field_audit': 9,
          'joint_audit': 5,
          'transfer_pricing': 2,
          'comprehensive': 4,
          'issue_audit': 1
        },
        'amhara-tc3': {
          'desk_audit': 11,
          'field_audit': 6,
          'joint_audit': 4,
          'transfer_pricing': 3,
          'comprehensive': 4,
          'issue_audit': 2
        }
      },
      'oromia': {
        'oromia-tc1': {
          'desk_audit': 25,
          'field_audit': 16,
          'joint_audit': 10,
          'transfer_pricing': 4,
          'comprehensive': 6,
          'issue_audit': 2
        },
        'oromia-tc2': {
          'desk_audit': 22,
          'field_audit': 14,
          'joint_audit': 9,
          'transfer_pricing': 4,
          'comprehensive': 6,
          'issue_audit': 2
        },
        'oromia-tc3': {
          'desk_audit': 13,
          'field_audit': 10,
          'joint_audit': 6,
          'transfer_pricing': 4,
          'comprehensive': 6,
          'issue_audit': 2
        }
      },
      'snnpr': {
        'snnpr-tc1': {
          'desk_audit': 14,
          'field_audit': 8,
          'joint_audit': 6,
          'transfer_pricing': 2,
          'comprehensive': 3,
          'issue_audit': 1
        },
        'snnpr-tc2': {
          'desk_audit': 12,
          'field_audit': 7,
          'joint_audit': 5,
          'transfer_pricing': 2,
          'comprehensive': 3,
          'issue_audit': 1
        },
        'snnpr-tc3': {
          'desk_audit': 9,
          'field_audit': 5,
          'joint_audit': 4,
          'transfer_pricing': 3,
          'comprehensive': 4,
          'issue_audit': 1
        }
      },
      'somali': {
        'somali-tc1': {
          'desk_audit': 10,
          'field_audit': 6,
          'joint_audit': 4,
          'transfer_pricing': 2,
          'comprehensive': 3,
          'issue_audit': 1
        },
        'somali-tc2': {
          'desk_audit': 9,
          'field_audit': 5,
          'joint_audit': 4,
          'transfer_pricing': 2,
          'comprehensive': 3,
          'issue_audit': 1
        },
        'somali-tc3': {
          'desk_audit': 6,
          'field_audit': 4,
          'joint_audit': 2,
          'transfer_pricing': 1,
          'comprehensive': 2,
          'issue_audit': 0
        }
      }
    },
    // CRITICAL: Submission records for tax centers
    submittedToTaxCenters: {
      'addis_ababa': {
        status: 'SUBMITTED',
        submittedBy: 'Regional Director',
        submittedDate: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
        submittedTo: ['addis_ababa-tc1', 'addis_ababa-tc2', 'addis_ababa-tc3'],
        taxCentersInRegion: ['addis_ababa-tc1', 'addis_ababa-tc2', 'addis_ababa-tc3'],
        readyForAcceptance: true,
        allocationsSet: true
      },
      'oromia': {
        status: 'SUBMITTED',
        submittedBy: 'Regional Director',
        submittedDate: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
        submittedTo: ['oromia-tc1', 'oromia-tc2', 'oromia-tc3'],
        taxCentersInRegion: ['oromia-tc1', 'oromia-tc2', 'oromia-tc3'],
        readyForAcceptance: true,
        allocationsSet: true
      }
    },
    // Enhanced: Support for pending/submitted feedback at TAX CENTER level
    taxCenterFeedback: {
      'addis_ababa': {
        'addis_ababa-tc1': {
          id: 'feedback-add-tc1-001',
          status: 'PENDING_SUBMISSION',
          dueDate: new Date(Date.now() + 5*24*60*60*1000).toISOString(),
          submittedDate: null,
          capacity: null,
          notes: null
        },
        'addis_ababa-tc2': {
          id: 'feedback-add-tc2-001',
          status: 'SUBMITTED',
          dueDate: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
          submittedDate: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
          capacity: 100,
          notes: 'Can deliver all allocated work'
        }
      },
      'amhara': {
        'amhara-tc1': {
          id: 'feedback-amh-tc1-001',
          status: 'SUBMITTED',
          dueDate: new Date(Date.now() - 7*24*60*60*1000).toISOString(),
          submittedDate: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
          capacity: 95,
          notes: 'Team has adequate capacity'
        }
      },
      'oromia': {
        'oromia-tc1': {
          id: 'feedback-oro-tc1-001',
          status: 'SUBMITTED',
          submittedDate: new Date(Date.now() - 10*24*60*60*1000).toISOString(),
          capacity: 85
        }
      }
    },
    // Sample submission - Regional Director submitted this plan to tax centers
    submittedToTaxCenters: {
      'addis_ababa': {
        status: 'SUBMITTED',
        submittedBy: 'Regional Director',
        submittedDate: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
        submittedTo: ['addis_ababa-tc1', 'addis_ababa-tc2', 'addis_ababa-tc3'],
        taxCentersInRegion: ['addis_ababa-tc1', 'addis_ababa-tc2', 'addis_ababa-tc3'],
        readyForAcceptance: true,
        allocationsSet: true
      },
      'oromia': {
        status: 'SUBMITTED',
        submittedBy: 'Regional Director',
        submittedDate: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
        submittedTo: ['oromia-tc1', 'oromia-tc2', 'oromia-tc3'],
        taxCentersInRegion: ['oromia-tc1', 'oromia-tc2', 'oromia-tc3'],
        readyForAcceptance: true,
        allocationsSet: true
      }
    },
    // CRITICAL: Tax center acceptance - MUST have this for cascade team to see plans
    taxCenterAcceptance: {
      'addis_ababa': {
        'addis_ababa-tc1': {
          status: 'ACCEPTED',
          taxCenter: 'addis_ababa-tc1',
          acceptedDate: new Date(Date.now() - 4*24*60*60*1000).toISOString(),
          acceptedBy: 'Tax Center Manager'
        },
        'addis_ababa-tc2': {
          status: 'ACCEPTED',
          taxCenter: 'addis_ababa-tc2',
          acceptedDate: new Date(Date.now() - 4*24*60*60*1000).toISOString(),
          acceptedBy: 'Tax Center Manager'
        },
        'addis_ababa-tc3': {
          status: 'ACCEPTED',
          taxCenter: 'addis_ababa-tc3',
          acceptedDate: new Date(Date.now() - 4*24*60*60*1000).toISOString(),
          acceptedBy: 'Tax Center Manager'
        }
      },
      'oromia': {
        'oromia-tc1': {
          status: 'ACCEPTED',
          taxCenter: 'oromia-tc1',
          acceptedDate: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
          acceptedBy: 'Tax Center Manager'
        },
        'oromia-tc2': {
          status: 'ACCEPTED',
          taxCenter: 'oromia-tc2',
          acceptedDate: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
          acceptedBy: 'Tax Center Manager'
        },
        'oromia-tc3': {
          status: 'ACCEPTED',
          taxCenter: 'oromia-tc3',
          acceptedDate: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
          acceptedBy: 'Tax Center Manager'
        }
      }
    },
    cascadedToCases: false
  };

  // Sample feedback data with pending/submitted statuses
  const sampleFeedback = [
    {
      id: 'feedback-reg-add-001',
      region: 'addis_ababa',
      status: 'PENDING_SUBMISSION',
      dueDate: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
      sentDate: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
      submittedDate: null,
      feedback: null
    },
    {
      id: 'feedback-reg-amh-001',
      region: 'amhara',
      status: 'SUBMITTED',
      sentDate: new Date(Date.now() - 10*24*60*60*1000).toISOString(),
      submittedDate: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
      feedback: 'Ready to execute audit plan'
    }
  ];

  // Sample cases with status tracking
  const sampleCases = [
    {
      id: 'case-add-001',
      taxCenter: 'addis_ababa-tc1',
      region: 'addis_ababa',
      status: 'ASSIGNED',
      assignedDate: new Date(Date.now() - 5*24*60*60*1000).toISOString(), // 5 days ago
      dueDate: new Date(Date.now() + 25*24*60*60*1000).toISOString(), // Due in 25 days
      auditType: 'Standard Audit',
      assignedTo: null,
      completionDate: null
    },
    {
      id: 'case-add-002',
      taxCenter: 'addis_ababa-tc1',
      region: 'addis_ababa',
      status: 'IN_PROGRESS',
      assignedDate: new Date(Date.now() - 10*24*60*60*1000).toISOString(), // 10 days ago
      dueDate: new Date(Date.now() + 10*24*60*60*1000).toISOString(), // Due in 10 days
      auditType: 'Compliance Audit',
      assignedTo: 'AUDIT-045-AUD',
      completionDate: null
    },
    {
      id: 'case-add-003',
      taxCenter: 'addis_ababa-tc1',
      region: 'addis_ababa',
      status: 'CLOSED',
      assignedDate: new Date(Date.now() - 30*24*60*60*1000).toISOString(), // 30 days ago
      dueDate: new Date(Date.now() - 5*24*60*60*1000).toISOString(), // Was due 5 days ago
      auditType: 'Risk-Based Audit',
      assignedTo: 'AUDIT-043-AUD',
      completionDate: new Date(Date.now() - 2*24*60*60*1000).toISOString() // Closed 2 days ago
    }
  ];

  // Second plan for testing multiple plans per tax center
  const secondPlan = {
    id: 'AP-0002',
    name: 'Annual Audit Plan 2027 - Phase 2',
    status: 'DIRECTOR_APPROVED', // Ready to submit to regions
    version: 1,
    fiscalYear: 2027,
    createdDate: new Date(Date.now() - 30*24*60*60*1000).toISOString(),
    // ✅ Track which regions have been sent this plan (for regional director access)
    sentToRegions: [], // Empty - not submitted yet
    sentToRegionsDate: null,
    // ✅ Track feedback status by region
    regionFeedbackStatus: {
      'addis_ababa': {
        status: 'feedback_collected',
        receivedDate: new Date(Date.now() - 6*24*60*60*1000).toISOString(),
        acknowledgedDate: new Date(Date.now() - 5*24*60*60*1000).toISOString()
      },
      'oromia': {
        status: 'feedback_collected',
        receivedDate: new Date(Date.now() - 6*24*60*60*1000).toISOString(),
        acknowledgedDate: new Date(Date.now() - 5*24*60*60*1000).toISOString()
      },
      'amhara': {
        status: 'feedback_collected',
        receivedDate: new Date(Date.now() - 7*24*60*60*1000).toISOString(),
        acknowledgedDate: new Date(Date.now() - 6*24*60*60*1000).toISOString()
      },
      'snnpr': {
        status: 'feedback_collected',
        receivedDate: new Date(Date.now() - 8*24*60*60*1000).toISOString(),
        acknowledgedDate: new Date(Date.now() - 7*24*60*60*1000).toISOString()
      },
      'somali': {
        status: 'feedback_collected',
        receivedDate: new Date(Date.now() - 9*24*60*60*1000).toISOString(),
        acknowledgedDate: new Date(Date.now() - 8*24*60*60*1000).toISOString()
      }
    },
    regionalAllocation: {
      'addis_ababa': {
        'desk_audit': 45,
        'field_audit': 28,
        'joint_audit': 18,
        'transfer_pricing': 9,
        'comprehensive': 14,
        'issue_audit': 4
      },
      'amhara': {
        'desk_audit': 38,
        'field_audit': 23,
        'joint_audit': 14,
        'transfer_pricing': 7,
        'comprehensive': 11,
        'issue_audit': 3
      },
      'oromia': {
        'desk_audit': 55,
        'field_audit': 38,
        'joint_audit': 22,
        'transfer_pricing': 11,
        'comprehensive': 17,
        'issue_audit': 5
      },
      'snnpr': {
        'desk_audit': 32,
        'field_audit': 18,
        'joint_audit': 12,
        'transfer_pricing': 6,
        'comprehensive': 9,
        'issue_audit': 3
      },
      'somali': {
        'desk_audit': 22,
        'field_audit': 13,
        'joint_audit': 8,
        'transfer_pricing': 4,
        'comprehensive': 6,
        'issue_audit': 2
      }
    },
    allocationStatus: {
      'addis_ababa': {
        status: 'SENT',
        sentDate: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
        sentBy: 'Regional Director',
        taxCenterReceipts: {
          'addis_ababa-tc1': { status: 'RECEIVED', receivedDate: new Date(Date.now() - 3*24*60*60*1000).toISOString() },
          'addis_ababa-tc2': { status: 'RECEIVED', receivedDate: new Date(Date.now() - 3*24*60*60*1000).toISOString() },
          'addis_ababa-tc3': { status: 'RECEIVED', receivedDate: new Date(Date.now() - 3*24*60*60*1000).toISOString() }
        }
      },
      'amhara': {
        status: 'SENT',
        sentDate: new Date(Date.now() - 8*24*60*60*1000).toISOString(),
        sentBy: 'Regional Director',
        taxCenterReceipts: {
          'amhara-tc1': { status: 'RECEIVED', receivedDate: new Date(Date.now() - 6*24*60*60*1000).toISOString() },
          'amhara-tc2': { status: 'RECEIVED', receivedDate: new Date(Date.now() - 6*24*60*60*1000).toISOString() },
          'amhara-tc3': { status: 'RECEIVED', receivedDate: new Date(Date.now() - 6*24*60*60*1000).toISOString() }
        }
      },
      'oromia': {
        status: 'SENT',
        sentDate: new Date(Date.now() - 12*24*60*60*1000).toISOString(),
        sentBy: 'Regional Director',
        taxCenterReceipts: {
          'oromia-tc1': { status: 'RECEIVED', receivedDate: new Date(Date.now() - 10*24*60*60*1000).toISOString() },
          'oromia-tc2': { status: 'RECEIVED', receivedDate: new Date(Date.now() - 10*24*60*60*1000).toISOString() },
          'oromia-tc3': { status: 'RECEIVED', receivedDate: new Date(Date.now() - 10*24*60*60*1000).toISOString() }
        }
      },
      'snnpr': {
        status: 'PENDING',
        sentDate: null,
        sentBy: null,
        taxCenterReceipts: {}
      },
      'somali': {
        status: 'PENDING',
        sentDate: null,
        sentBy: null,
        taxCenterReceipts: {}
      }
    },
    regionalAllocations: [
      {
        id: 'alloc-add-002',
        region: 'addis_ababa',
        status: 'ACCEPTED',
        sentDate: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
        acceptedDate: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
        allocationDetails: { desk: 45, field: 28, joint: 18 }
      },
      {
        id: 'alloc-amh-002',
        region: 'amhara',
        status: 'ACCEPTED',
        sentDate: new Date(Date.now() - 8*24*60*60*1000).toISOString(),
        acceptedDate: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
        allocationDetails: { desk: 38, field: 23, joint: 14 }
      },
      {
        id: 'alloc-oro-002',
        region: 'oromia',
        status: 'ACCEPTED',
        sentDate: new Date(Date.now() - 12*24*60*60*1000).toISOString(),
        acceptedDate: new Date(Date.now() - 9*24*60*60*1000).toISOString(),
        allocationDetails: { desk: 55, field: 38, joint: 22 }
      },
      {
        id: 'alloc-snnpr-002',
        region: 'snnpr',
        status: 'PENDING_ACCEPTANCE',
        sentDate: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
        dueDate: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
        acceptedDate: null,
        allocationDetails: { desk: 32, field: 18, joint: 12 }
      },
      {
        id: 'alloc-som-002',
        region: 'somali',
        status: 'ACCEPTED',
        sentDate: new Date(Date.now() - 19*24*60*60*1000).toISOString(),
        acceptedDate: new Date(Date.now() - 16*24*60*60*1000).toISOString(),
        allocationDetails: { desk: 22, field: 13, joint: 8 }
      }
    ],
    taxCenterAllocations: {
      'addis_ababa': {
        'addis_ababa-tc1': {
          'desk_audit': 18,
          'field_audit': 11,
          'joint_audit': 7,
          'transfer_pricing': 3,
          'comprehensive': 5,
          'issue_audit': 1
        },
        'addis_ababa-tc2': {
          'desk_audit': 16,
          'field_audit': 9,
          'joint_audit': 6,
          'transfer_pricing': 3,
          'comprehensive': 5,
          'issue_audit': 1
        },
        'addis_ababa-tc3': {
          'desk_audit': 11,
          'field_audit': 8,
          'joint_audit': 5,
          'transfer_pricing': 3,
          'comprehensive': 4,
          'issue_audit': 2
        }
      },
      'amhara': {
        'amhara-tc1': {
          'desk_audit': 14,
          'field_audit': 9,
          'joint_audit': 5,
          'transfer_pricing': 2,
          'comprehensive': 4,
          'issue_audit': 1
        },
        'amhara-tc2': {
          'desk_audit': 13,
          'field_audit': 8,
          'joint_audit': 5,
          'transfer_pricing': 2,
          'comprehensive': 4,
          'issue_audit': 1
        },
        'amhara-tc3': {
          'desk_audit': 11,
          'field_audit': 6,
          'joint_audit': 4,
          'transfer_pricing': 3,
          'comprehensive': 3,
          'issue_audit': 1
        }
      },
      'oromia': {
        'oromia-tc1': {
          'desk_audit': 22,
          'field_audit': 15,
          'joint_audit': 9,
          'transfer_pricing': 4,
          'comprehensive': 6,
          'issue_audit': 2
        },
        'oromia-tc2': {
          'desk_audit': 18,
          'field_audit': 12,
          'joint_audit': 7,
          'transfer_pricing': 3,
          'comprehensive': 5,
          'issue_audit': 1
        },
        'oromia-tc3': {
          'desk_audit': 15,
          'field_audit': 11,
          'joint_audit': 6,
          'transfer_pricing': 4,
          'comprehensive': 6,
          'issue_audit': 2
        }
      },
      'snnpr': {
        'snnpr-tc1': {
          'desk_audit': 11,
          'field_audit': 6,
          'joint_audit': 4,
          'transfer_pricing': 2,
          'comprehensive': 3,
          'issue_audit': 1
        },
        'snnpr-tc2': {
          'desk_audit': 11,
          'field_audit': 6,
          'joint_audit': 4,
          'transfer_pricing': 2,
          'comprehensive': 3,
          'issue_audit': 1
        },
        'snnpr-tc3': {
          'desk_audit': 10,
          'field_audit': 6,
          'joint_audit': 4,
          'transfer_pricing': 2,
          'comprehensive': 3,
          'issue_audit': 1
        }
      },
      'somali': {
        'somali-tc1': {
          'desk_audit': 8,
          'field_audit': 5,
          'joint_audit': 3,
          'transfer_pricing': 1,
          'comprehensive': 2,
          'issue_audit': 1
        },
        'somali-tc2': {
          'desk_audit': 8,
          'field_audit': 4,
          'joint_audit': 2,
          'transfer_pricing': 1,
          'comprehensive': 2,
          'issue_audit': 1
        },
        'somali-tc3': {
          'desk_audit': 6,
          'field_audit': 4,
          'joint_audit': 3,
          'transfer_pricing': 2,
          'comprehensive': 2,
          'issue_audit': 0
        }
      }
    },
    taxCenterFeedback: {},
    submittedToTaxCenters: {
      'oromia': {
        status: 'SUBMITTED',
        submittedBy: 'Regional Director',
        submittedDate: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
        submittedTo: ['oromia-tc1', 'oromia-tc2'],
        taxCentersInRegion: ['oromia-tc1', 'oromia-tc2'],
        readyForAcceptance: true,
        allocationsSet: true
      }
    },
    taxCenterAcceptance: {
      'oromia': {
        'oromia-tc1': {
          status: 'ACCEPTED',
          taxCenter: 'oromia-tc1',
          acceptedDate: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
          acceptedBy: 'Tax Center Manager'
        },
        'oromia-tc2': {
          status: 'ACCEPTED',
          taxCenter: 'oromia-tc2',
          acceptedDate: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
          acceptedBy: 'Tax Center Manager'
        },
        'oromia-tc3': {
          status: 'ACCEPTED',
          taxCenter: 'oromia-tc3',
          acceptedDate: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
          acceptedBy: 'Tax Center Manager'
        }
      }
    },
    cascadedToCases: false
  };

  return {
    plans: [],
    cases: sampleCases,
    feedback: sampleFeedback,
    auditCases: [],
    activity: [],
    auditors: ['Alice', 'Bob', 'Carol', 'David', 'Eve'],
    planCounter: 1,
    caseCounter: 4,
    taxCenterFeedback: [],
    riskEngine: {},
    taxpayerPool: {
      total: 125000,
      byType: {
        'Large Taxpayer': 2500,
        'Medium Taxpayer': 15000,
        'Small Taxpayer': 45000,
        'Micro Taxpayer': 62500
      },
      byRegion: {
        'addis_ababa': 35000,
        'oromia': 30000,
        'amhara': 22000,
        'snnpr': 15000,
        'somali': 11000
      }
    }
  };
}

export function createTestDataWithFeedback() {
  console.log('🧪 Creating test data WITH TAX CENTER FEEDBACK...');
  
  const testData = getDefaultData();
  
  // Create a test plan
  const testPlan = {
    id: 'AP-TEST-001',
    name: 'Test Plan with Feedback',
    status: 'submitted',
    planCounter: 1,
    nationalAllocations: {
      desk_audit: 50,
      field_audit: 30,
      joint_audit: 20,
      transfer_pricing: 10,
      comprehensive: 15,
      issue_audit: 5
    },
    regionalAllocation: {
      'addis_ababa': {
        desk_audit: 50,
        field_audit: 30,
        joint_audit: 20,
        transfer_pricing: 10,
        comprehensive: 15,
        issue_audit: 5
      }
    },
    taxCenterAllocations: {
      'addis_ababa': {
        'addis_ababa-tc1': {
          desk_audit: 20,
          field_audit: 12,
          joint_audit: 8,
          transfer_pricing: 4,
          comprehensive: 6,
          issue_audit: 2
        },
        'addis_ababa-tc2': {
          desk_audit: 18,
          field_audit: 10,
          joint_audit: 7,
          transfer_pricing: 3,
          comprehensive: 5,
          issue_audit: 1
        },
        'addis_ababa-tc3': {
          desk_audit: 12,
          field_audit: 8,
          joint_audit: 5,
          transfer_pricing: 3,
          comprehensive: 4,
          issue_audit: 2
        }
      }
    },
    allocationSentStatus: {
      'addis_ababa': {
        status: 'SENT',
        sentDate: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
        sentBy: 'Regional Director',
        taxCenters: ['addis_ababa-tc1', 'addis_ababa-tc2', 'addis_ababa-tc3']
      }
    },
    // ADD TAX CENTER FEEDBACK IN NEW FORMAT
    taxCenterFeedback: {
      'addis_ababa': {
        'addis_ababa-tc1': {
          feedbackByType: {
            desk_audit: { allocated: 20, proposedAmount: 22, capacity: 'Adequate', resourceStatus: 'Available', timeline: 'On Schedule', remarks: 'Can handle 22 cases' },
            field_audit: { allocated: 12, proposedAmount: 14, capacity: 'Adequate', resourceStatus: 'Available', timeline: 'On Schedule', remarks: 'Need 2 extra resources' },
            joint_audit: { allocated: 8, proposedAmount: 8, capacity: 'Adequate', resourceStatus: 'Available', timeline: 'On Schedule', remarks: '' },
            transfer_pricing: { allocated: 4, proposedAmount: 4, capacity: 'Adequate', resourceStatus: 'Limited', timeline: 'On Schedule', remarks: 'Minimal resources' },
            comprehensive: { allocated: 6, proposedAmount: 5, capacity: 'Adequate', resourceStatus: 'Available', timeline: 'On Schedule', remarks: '' },
            issue_audit: { allocated: 2, proposedAmount: 2, capacity: 'Adequate', resourceStatus: 'Available', timeline: 'On Schedule', remarks: '' }
          },
          feedbackDate: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
          feedbackBy: 'Tax Center Manager',
          taxCenter: 'addis_ababa-tc1',
          planId: 'AP-TEST-001'
        },
        'addis_ababa-tc2': {
          feedbackByType: {
            desk_audit: { allocated: 18, proposedAmount: 20, capacity: 'Can Handle', resourceStatus: 'Available', timeline: 'On Schedule', remarks: 'Can absorb 2 extra' },
            field_audit: { allocated: 10, proposedAmount: 10, capacity: 'Adequate', resourceStatus: 'Available', timeline: 'On Schedule', remarks: '' },
            joint_audit: { allocated: 7, proposedAmount: 7, capacity: 'Adequate', resourceStatus: 'Limited', timeline: 'On Schedule', remarks: '' },
            transfer_pricing: { allocated: 3, proposedAmount: 3, capacity: 'Adequate', resourceStatus: 'Available', timeline: 'On Schedule', remarks: '' },
            comprehensive: { allocated: 5, proposedAmount: 4, capacity: 'Adequate', resourceStatus: 'Need Support', timeline: 'At Risk', remarks: 'Need 1 extra resource' },
            issue_audit: { allocated: 1, proposedAmount: 1, capacity: 'Adequate', resourceStatus: 'Available', timeline: 'On Schedule', remarks: '' }
          },
          feedbackDate: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
          feedbackBy: 'Tax Center Manager',
          taxCenter: 'addis_ababa-tc2',
          planId: 'AP-TEST-001'
        },
        'addis_ababa-tc3': {
          feedbackByType: {
            desk_audit: { allocated: 12, proposedAmount: 10, capacity: 'Adequate', resourceStatus: 'Available', timeline: 'On Schedule', remarks: 'Resource constraints' },
            field_audit: { allocated: 8, proposedAmount: 6, capacity: 'Adequate', resourceStatus: 'Limited', timeline: 'Need Extension', remarks: '' },
            joint_audit: { allocated: 5, proposedAmount: 5, capacity: 'Adequate', resourceStatus: 'Available', timeline: 'On Schedule', remarks: '' },
            transfer_pricing: { allocated: 3, proposedAmount: 3, capacity: 'Adequate', resourceStatus: 'Available', timeline: 'On Schedule', remarks: '' },
            comprehensive: { allocated: 4, proposedAmount: 5, capacity: 'Can Handle', resourceStatus: 'Available', timeline: 'On Schedule', remarks: 'Can take 1 more' },
            issue_audit: { allocated: 2, proposedAmount: 2, capacity: 'Adequate', resourceStatus: 'Available', timeline: 'On Schedule', remarks: '' }
          },
          feedbackDate: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
          feedbackBy: 'Tax Center Manager',
          taxCenter: 'addis_ababa-tc3',
          planId: 'AP-TEST-001'
        }
      }
    }
  };
  
  testData.plans.push(testPlan);
  
  console.log('✅ Test plan created with feedback from 3 tax centers');
  return testData;
}

export function loadTestDataWithFeedback() {
  const testData = createTestDataWithFeedback();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(testData));
  console.log('✅ Test data saved to localStorage');
  return testData;
}

export function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  
  // CRITICAL FIX: Only clear data if specifically needed, NOT on every code update
  // This prevents data loss when you update code
  const storedVersion = localStorage.getItem('data_version');
  
  // If no stored version, first time setup
  if (!storedVersion) {
    console.log('📝 First time setup - initializing data');
    localStorage.setItem('data_version', DATA_VERSION);
    const defaultData = getDefaultData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
  
  // ✅ VERSION MISMATCH: Force data reset when version changes (major migrations)
  if (storedVersion !== DATA_VERSION) {
    console.warn(`🔄 DATA VERSION CHANGED: ${storedVersion} → ${DATA_VERSION}. Clearing old data and reinitializing...`);
    localStorage.clear();
    localStorage.setItem('data_version', DATA_VERSION);
    const defaultData = getDefaultData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
  
  // If data exists, KEEP IT (same version, no changes needed)
  if (raw) {
    try {
      const data = JSON.parse(raw);
      
      // Validate data structure, add missing fields if needed (migration, not reset)
      if (!data.plans) data.plans = [];
      if (!data.auditCases) data.auditCases = [];
      if (!data.cases) data.cases = [];
      if (!data.feedback) data.feedback = [];
      if (!data.activity) data.activity = [];
      
      // ✅ DATA MIGRATION: Ensure all plans have required fields
      data.plans = data.plans.map(plan => {
        if (!plan.regionalAllocation) {
          console.warn(`🔧 Adding missing regionalAllocation to plan ${plan.id}`);
          plan.regionalAllocation = {
            'addis_ababa': { 'desk_audit': 50, 'field_audit': 30, 'joint_audit': 20, 'transfer_pricing': 10, 'comprehensive': 15, 'issue_audit': 5 },
            'oromia': { 'desk_audit': 60, 'field_audit': 40, 'joint_audit': 25, 'transfer_pricing': 12, 'comprehensive': 18, 'issue_audit': 6 },
            'amhara': { 'desk_audit': 40, 'field_audit': 25, 'joint_audit': 15, 'transfer_pricing': 8, 'comprehensive': 12, 'issue_audit': 4 },
            'snnpr': { 'desk_audit': 35, 'field_audit': 20, 'joint_audit': 15, 'transfer_pricing': 7, 'comprehensive': 10, 'issue_audit': 3 },
            'somali': { 'desk_audit': 25, 'field_audit': 15, 'joint_audit': 10, 'transfer_pricing': 5, 'comprehensive': 8, 'issue_audit': 2 }
          };
        }
        
        // ✅ AUTO-ACCEPT: For testing, auto-accept plans so they can be allocated
        // This simulates regional directors accepting plans without manual steps
        if (!plan.planAcceptanceStatus) {
          console.warn(`🔧 Adding missing planAcceptanceStatus to plan ${plan.id} - auto-accepting all regions`);
          plan.planAcceptanceStatus = {
            'addis_ababa': { status: 'ACCEPTED', acceptedDate: new Date().toISOString(), acceptedBy: 'Migration' },
            'oromia': { status: 'ACCEPTED', acceptedDate: new Date().toISOString(), acceptedBy: 'Migration' },
            'amhara': { status: 'ACCEPTED', acceptedDate: new Date().toISOString(), acceptedBy: 'Migration' },
            'snnpr': { status: 'ACCEPTED', acceptedDate: new Date().toISOString(), acceptedBy: 'Migration' },
            'somali': { status: 'ACCEPTED', acceptedDate: new Date().toISOString(), acceptedBy: 'Migration' }
          };
        }
        
        // ✅ FIX: Clear old test data that has pre-populated sentToRegions without a date
        // This was test data from development - proper submissions have sentToRegionsDate
        if (plan.sentToRegions && plan.sentToRegions.length > 0 && !plan.sentToRegionsDate) {
          console.log(`🔧 MIGRATION: Clearing old test sentToRegions for plan ${plan.id} (had no sentToRegionsDate)`);
          plan.sentToRegions = [];
          plan.sentToRegionsDate = null;
        }
        
        // ✅ DO NOT auto-fill sentToRegions - let director submit it intentionally
        // This allows testing the submission workflow
        // if (!plan.sentToRegions) {
        //   console.warn(`🔧 Adding missing sentToRegions to plan ${plan.id}`);
        //   plan.sentToRegions = ['addis_ababa', 'oromia', 'amhara', 'snnpr', 'somali'];
        // }
        
        if (!plan.taxCenterAllocations) {
          console.warn(`🔧 Adding missing taxCenterAllocations to plan ${plan.id}`);
          plan.taxCenterAllocations = {
            'addis_ababa': {
              'addis_ababa-tc1': { 'desk_audit': 20, 'field_audit': 12, 'joint_audit': 8, 'transfer_pricing': 4, 'comprehensive': 6, 'issue_audit': 2 },
              'addis_ababa-tc2': { 'desk_audit': 18, 'field_audit': 10, 'joint_audit': 7, 'transfer_pricing': 3, 'comprehensive': 5, 'issue_audit': 2 },
              'addis_ababa-tc3': { 'desk_audit': 12, 'field_audit': 8, 'joint_audit': 5, 'transfer_pricing': 3, 'comprehensive': 4, 'issue_audit': 1 }
            },
            'oromia': {
              'oromia-tc1': { 'desk_audit': 25, 'field_audit': 16, 'joint_audit': 10, 'transfer_pricing': 4, 'comprehensive': 6, 'issue_audit': 2 },
              'oromia-tc2': { 'desk_audit': 22, 'field_audit': 14, 'joint_audit': 9, 'transfer_pricing': 4, 'comprehensive': 6, 'issue_audit': 2 },
              'oromia-tc3': { 'desk_audit': 13, 'field_audit': 10, 'joint_audit': 6, 'transfer_pricing': 4, 'comprehensive': 6, 'issue_audit': 2 }
            },
            'amhara': {
              'amhara-tc1': { 'desk_audit': 15, 'field_audit': 10, 'joint_audit': 6, 'transfer_pricing': 3, 'comprehensive': 4, 'issue_audit': 1 },
              'amhara-tc2': { 'desk_audit': 14, 'field_audit': 9, 'joint_audit': 5, 'transfer_pricing': 2, 'comprehensive': 4, 'issue_audit': 1 },
              'amhara-tc3': { 'desk_audit': 11, 'field_audit': 6, 'joint_audit': 4, 'transfer_pricing': 3, 'comprehensive': 4, 'issue_audit': 2 }
            },
            'snnpr': {
              'snnpr-tc1': { 'desk_audit': 14, 'field_audit': 8, 'joint_audit': 6, 'transfer_pricing': 2, 'comprehensive': 3, 'issue_audit': 1 },
              'snnpr-tc2': { 'desk_audit': 12, 'field_audit': 7, 'joint_audit': 5, 'transfer_pricing': 2, 'comprehensive': 3, 'issue_audit': 1 },
              'snnpr-tc3': { 'desk_audit': 9, 'field_audit': 5, 'joint_audit': 4, 'transfer_pricing': 3, 'comprehensive': 4, 'issue_audit': 1 }
            },
            'somali': {
              'somali-tc1': { 'desk_audit': 10, 'field_audit': 6, 'joint_audit': 4, 'transfer_pricing': 2, 'comprehensive': 3, 'issue_audit': 1 },
              'somali-tc2': { 'desk_audit': 9, 'field_audit': 5, 'joint_audit': 4, 'transfer_pricing': 2, 'comprehensive': 3, 'issue_audit': 1 },
              'somali-tc3': { 'desk_audit': 6, 'field_audit': 4, 'joint_audit': 2, 'transfer_pricing': 1, 'comprehensive': 2, 'issue_audit': 0 }
            }
          };
          
          // ✅ AUTO-MARK as SENT: Mark allocations as sent so tax centers can see them
          if (!plan.allocationSentStatus) {
            plan.allocationSentStatus = {
              'addis_ababa': { status: 'SENT', sentDate: new Date().toISOString(), sentBy: 'Migration', taxCenters: ['addis_ababa-tc1', 'addis_ababa-tc2', 'addis_ababa-tc3'] },
              'oromia': { status: 'SENT', sentDate: new Date().toISOString(), sentBy: 'Migration', taxCenters: ['oromia-tc1', 'oromia-tc2', 'oromia-tc3'] },
              'amhara': { status: 'SENT', sentDate: new Date().toISOString(), sentBy: 'Migration', taxCenters: ['amhara-tc1', 'amhara-tc2', 'amhara-tc3'] },
              'snnpr': { status: 'SENT', sentDate: new Date().toISOString(), sentBy: 'Migration', taxCenters: ['snnpr-tc1', 'snnpr-tc2', 'snnpr-tc3'] },
              'somali': { status: 'SENT', sentDate: new Date().toISOString(), sentBy: 'Migration', taxCenters: ['somali-tc1', 'somali-tc2', 'somali-tc3'] }
            };
          }
        } else {
          // ✅ FIX: Migrate old tax center names from dash format to space format
          // Old format: 'addis_ababa-tc1', New format: 'addis_ababa-tc1'
          const nameMappings = {
            'addis_ababa-tc1': 'addis_ababa-tc1',
            'addis_ababa-tc2': 'addis_ababa-tc2',
            'addis_ababa-tc3': 'addis_ababa-tc3',
            'oromia-tc1': 'oromia-tc1',
            'oromia-tc2': 'oromia-tc2',
            'oromia-tc3': 'oromia-tc3',
            'amhara-tc1': 'amhara-tc1',
            'amhara-tc2': 'amhara-tc2',
            'amhara-tc3': 'amhara-tc3',
            'snnpr-tc1': 'snnpr-tc1',
            'snnpr-tc2': 'snnpr-tc2',
            'snnpr-tc3': 'snnpr-tc3',
            'somali-tc1': 'somali-tc1',
            'somali-tc2': 'somali-tc2',
            'somali-tc3': 'somali-tc3'
          };
          
          // Fix all regions' tax center allocations
          Object.keys(plan.taxCenterAllocations).forEach(region => {
            const regionAllocations = plan.taxCenterAllocations[region];
            Object.keys(regionAllocations).forEach(oldTcName => {
              const newTcName = nameMappings[oldTcName];
              if (newTcName && oldTcName !== newTcName) {
                console.log(`🔧 MIGRATION: Renaming tax center ${oldTcName} → ${newTcName} in plan ${plan.id}`);
                regionAllocations[newTcName] = regionAllocations[oldTcName];
                delete regionAllocations[oldTcName];
              }
            });
          });
        }
        
        return plan;
      });
      
      // ✅ DEDUPLICATION: Remove duplicate plan IDs
      const seenIds = new Set();
      const dedupedPlans = [];
      data.plans.forEach(plan => {
        if (!seenIds.has(plan.id)) {
          seenIds.add(plan.id);
          dedupedPlans.push(plan);
        } else {
          console.warn(`⚠️  Removed duplicate plan: ${plan.id}`);
        }
      });
      
      if (dedupedPlans.length !== data.plans.length) {
        console.log(`🔧 Deduplication: ${data.plans.length} → ${dedupedPlans.length} plans`);
        data.plans = dedupedPlans;
        // Save deduplicated data
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
      
      // ✅ SAVE MIGRATED DATA: After adding missing fields, persist to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      
      console.log(`✅ Loaded existing data (version: ${storedVersion}). Plans: ${data.plans.length}`);
      return data;
    } catch (e) {
      console.error('❌ Data corruption detected:', e);
      console.log('🔄 Clearing corrupted data and reinitializing...');
      localStorage.clear();
      localStorage.setItem('data_version', DATA_VERSION);
      const defaultData = getDefaultData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
      return defaultData;
    }
  }
  
  // No data at all - initialize
  console.log('📝 No data found - initializing default data');
  localStorage.setItem('data_version', DATA_VERSION);
  const defaultData = getDefaultData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  return defaultData;
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Dispatch a custom event to notify React components that data has changed
  window.dispatchEvent(new CustomEvent('local-data-updated'));
}

export function resetAllData() {
  console.log('🔄 Resetting all data - clearing EVERYTHING...');
  // COMPLETELY CLEAR EVERYTHING
  localStorage.clear();
  // Also clear other possible keys
  for (let i = 0; i < 100; i++) {
    localStorage.removeItem(`tax_center_${i}`);
    localStorage.removeItem(`tax_center_${i}_region`);
    localStorage.removeItem(`tax_center_${i}_plan`);
  }
  console.log('✅ ALL localStorage cleared');
  // Return empty data structure (NO sample plans)
  return {
    plans: [],
    cases: [],
    feedback: [],
    auditCases: [],
    activity: [],
    auditors: [],
    planCounter: 1,
    caseCounter: 1,
    taxCenterFeedback: [],
    riskEngine: {},
    taxpayerPool: {
      total: 0,
      byType: {},
      byRegion: {}
    }
  };
}

export function clearAllPlans() {
  console.log('🗑️ Clearing all plans...');
  const data = loadData();
  data.plans = [];
  data.planCounter = 1;
  data.cases = [];
  data.caseCounter = 1;
  data.feedback = [];
  data.taxCenterFeedback = [];
  data.regionalFeedback = [];
  saveData(data);
  console.log('✅ All plans cleared - data saved');
  return data;
}

/**
 * RECOVERY FUNCTION: Fix already-submitted plans that aren't showing in tax centers
 * This adds/updates submittedToTaxCenters for all FINALIZED plans
 * @param {string} region - Region to add submission for (e.g., 'oromia')
 * @param {array} taxCenters - List of tax centers (e.g., ['oromia-tc1', 'oromia-tc2', 'oromia-tc3'])
 */
export function recoverSubmittedPlans(region, taxCenters) {
  console.log('🔧 RECOVERY MODE: Fixing already-submitted plans...');
  
  const data = loadData();
  let fixed = 0;
  let skipped = 0;
  
  data.plans.forEach(plan => {
    // Only process FINALIZED plans
    if (plan.status !== 'FINALIZED') {
      console.log(`  ⏭️  ${plan.id}: Status is ${plan.status}, skipping`);
      skipped++;
      return;
    }
    
    // Check if plan has regional allocation for this region
    if (!plan.regionalAllocation || !plan.regionalAllocation[region]) {
      console.log(`  ⏭️  ${plan.id}: No allocation for ${region}, skipping`);
      skipped++;
      return;
    }
    
    // Check if already submitted
    if (plan.submittedToTaxCenters?.[region]?.status === 'SUBMITTED') {
      console.log(`  ✓ ${plan.id}: Already submitted to ${region}, skipping`);
      skipped++;
      return;
    }
    
    // RECOVER: Add submission record
    if (!plan.submittedToTaxCenters) {
      plan.submittedToTaxCenters = {};
    }
    
    // Get regional allocation for distribution
    let regionalTotal = 0;
    if (typeof plan.regionalAllocation[region] === 'object') {
      regionalTotal = Object.values(plan.regionalAllocation[region]).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
    } else {
      regionalTotal = parseInt(plan.regionalAllocation[region]) || 0;
    }
    
    // Initialize tax center allocations
    if (!plan.taxCenterAllocations) {
      plan.taxCenterAllocations = {};
    }
    if (!plan.taxCenterAllocations[region]) {
      plan.taxCenterAllocations[region] = {};
    }
    
    // Distribute allocation to tax centers
    const numTaxCenters = taxCenters.length;
    const allocationPerTC = Math.floor(regionalTotal / numTaxCenters);
    
    taxCenters.forEach((tc, index) => {
      const allocation = index === numTaxCenters - 1
        ? regionalTotal - (allocationPerTC * (numTaxCenters - 1))
        : allocationPerTC;
      
      // Allocate by audit type
      if (typeof plan.regionalAllocation[region] === 'object') {
        const auditTypeAlloc = {};
        Object.keys(plan.regionalAllocation[region]).forEach(auditType => {
          const typeTotal = parseInt(plan.regionalAllocation[region][auditType]) || 0;
          const typePerTC = Math.floor(typeTotal / numTaxCenters);
          auditTypeAlloc[auditType] = index === numTaxCenters - 1
            ? typeTotal - (typePerTC * (numTaxCenters - 1))
            : typePerTC;
        });
        plan.taxCenterAllocations[region][tc] = auditTypeAlloc;
      } else {
        plan.taxCenterAllocations[region][tc] = allocation;
      }
    });
    
    // Add submission record
    plan.submittedToTaxCenters[region] = {
      status: 'SUBMITTED',
      submittedBy: 'System Recovery',
      submittedDate: new Date().toISOString(),
      submittedTo: taxCenters,
      taxCentersInRegion: taxCenters,
      readyForAcceptance: true,
      allocationsSet: true
    };
    
    console.log(`  ✅ FIXED ${plan.id}: Added submission for ${region} to ${taxCenters.length} tax centers`);
    fixed++;
  });
  
  // Save recovered data
  saveData(data);
  
  console.log(`\n✨ RECOVERY COMPLETE:`);
  console.log(`  Fixed: ${fixed} plans`);
  console.log(`  Skipped: ${skipped} plans`);
  console.log(`  Total: ${data.plans.length} plans`);
  
  return { fixed, skipped, total: data.plans.length };
}

/**
 * COMPLETE RECOVERY: Fix ALL submitted plans across ALL regions and ALL tax centers at once
 * Completely dynamic - automatically discovers all regions and tax centers from auditConfig
 */
export function recoverAllSubmissions() {
  console.log('%c🔧 COMPLETE SYSTEM RECOVERY STARTED', 'color: #ff9800; font-size: 14px; font-weight: bold;');
  
  const data = loadData();
  const { auditConfig } = require('../config/auditConfig');
  
  let totalFixed = 0;
  let totalSkipped = 0;
  let regionsProcessed = 0;
  
  // Process ALL regions dynamically from auditConfig
  auditConfig.regions.forEach(regionConfig => {
    const region = regionConfig.name;
    const taxCenters = regionConfig.taxCenters || [];
    
    if (taxCenters.length === 0) {
      console.log(`⏭️  Skipping ${region} - no tax centers configured`);
      return;
    }
    
    console.log(`\n🏢 Processing Region: ${region}`);
    console.log(`   Tax Centers: ${taxCenters.join(', ')}`);
    
    let regionFixed = 0;
    let regionSkipped = 0;
    
    data.plans.forEach(plan => {
      // Only process FINALIZED plans
      if (plan.status !== 'FINALIZED') {
        regionSkipped++;
        return;
      }
      
      // Check if plan has regional allocation for this region
      if (!plan.regionalAllocation || !plan.regionalAllocation[region]) {
        regionSkipped++;
        return;
      }
      
      // Check if already submitted
      if (plan.submittedToTaxCenters?.[region]?.status === 'SUBMITTED') {
        regionSkipped++;
        return;
      }
      
      // RECOVER: Add submission record
      if (!plan.submittedToTaxCenters) {
        plan.submittedToTaxCenters = {};
      }
      
      // Get regional allocation for distribution
      let regionalTotal = 0;
      if (typeof plan.regionalAllocation[region] === 'object') {
        regionalTotal = Object.values(plan.regionalAllocation[region]).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
      } else {
        regionalTotal = parseInt(plan.regionalAllocation[region]) || 0;
      }
      
      // Initialize tax center allocations
      if (!plan.taxCenterAllocations) {
        plan.taxCenterAllocations = {};
      }
      if (!plan.taxCenterAllocations[region]) {
        plan.taxCenterAllocations[region] = {};
      }
      
      // Distribute allocation to tax centers
      const numTaxCenters = taxCenters.length;
      const allocationPerTC = Math.floor(regionalTotal / numTaxCenters);
      
      taxCenters.forEach((tc, index) => {
        const allocation = index === numTaxCenters - 1
          ? regionalTotal - (allocationPerTC * (numTaxCenters - 1))
          : allocationPerTC;
        
        // Allocate by audit type
        if (typeof plan.regionalAllocation[region] === 'object') {
          const auditTypeAlloc = {};
          Object.keys(plan.regionalAllocation[region]).forEach(auditType => {
            const typeTotal = parseInt(plan.regionalAllocation[region][auditType]) || 0;
            const typePerTC = Math.floor(typeTotal / numTaxCenters);
            auditTypeAlloc[auditType] = index === numTaxCenters - 1
              ? typeTotal - (typePerTC * (numTaxCenters - 1))
              : typePerTC;
          });
          plan.taxCenterAllocations[region][tc] = auditTypeAlloc;
        } else {
          plan.taxCenterAllocations[region][tc] = allocation;
        }
      });
      
      // Add submission record
      plan.submittedToTaxCenters[region] = {
        status: 'SUBMITTED',
        submittedBy: 'System Recovery',
        submittedDate: new Date().toISOString(),
        submittedTo: taxCenters,
        taxCentersInRegion: taxCenters,
        readyForAcceptance: true,
        allocationsSet: true
      };
      
      regionFixed++;
    });
    
    console.log(`   ✅ Fixed: ${regionFixed} plans`);
    console.log(`   ⏭️  Skipped: ${regionSkipped} plans`);
    
    totalFixed += regionFixed;
    totalSkipped += regionSkipped;
    if (regionFixed > 0) regionsProcessed++;
  });
  
  // Save all recovered data
  saveData(data);
  
  console.log('%c✨ COMPLETE RECOVERY FINISHED', 'color: #4caf50; font-size: 14px; font-weight: bold;');
  console.log(`  🏢 Regions: ${regionsProcessed}/${auditConfig.regions.length}`);
  console.log(`  ✅ Plans Fixed: ${totalFixed}`);
  console.log(`  ⏭️  Plans Skipped: ${totalSkipped}`);
  console.log(`  📦 Total Plans: ${data.plans.length}`);
  
  return {
    regions: regionsProcessed,
    fixed: totalFixed,
    skipped: totalSkipped,
    total: data.plans.length
  };
}


// ============================================
// React Context Provider & Hook
// ============================================

/**
 * DataProvider - Wraps app with data context
 * Provides centralized data state management
 */
export function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize data on mount
  useEffect(() => {
    try {
      const initialData = loadData();
      setData(initialData);
      console.log('✅ DataProvider initialized with', initialData.plans?.length || 0, 'plans');
    } catch (err) {
      setError(err.message);
      console.error('❌ DataProvider initialization failed:', err);
    } finally {
      setLoading(false);
    }

    // Listen for custom data updates from businessLogic or outside context
    const handleDataUpdate = () => {
      try {
        const freshData = loadData();
        setData(freshData);
      } catch (err) {
        console.error('❌ DataProvider failed to sync with event:', err);
      }
    };

    window.addEventListener('local-data-updated', handleDataUpdate);
    return () => {
      window.removeEventListener('local-data-updated', handleDataUpdate);
    };
  }, []);

  // Update data handler
  const updateData = useCallback((newData) => {
    try {
      saveData(newData);
      setData(newData);
      console.log('✅ Data updated and saved to localStorage');
    } catch (err) {
      setError(err.message);
      console.error('❌ Failed to update data:', err);
    }
  }, []);

  // Refresh data from localStorage
  const refreshData = useCallback(() => {
    try {
      const freshData = loadData();
      setData(freshData);
      console.log('✅ Data refreshed from localStorage');
    } catch (err) {
      setError(err.message);
      console.error('❌ Failed to refresh data:', err);
    }
  }, []);

  // Clear all data
  const clearData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('data_version');
      const newData = getDefaultData();
      setData(newData);
      saveData(newData);
      console.log('✅ Data cleared and reset to defaults');
    } catch (err) {
      setError(err.message);
      console.error('❌ Failed to clear data:', err);
    }
  }, []);

  const value = {
    data,
    loading,
    error,
    updateData,
    refreshData,
    clearData,
    STORAGE_KEY,
    DATA_VERSION,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

/**
 * useData Hook - Access data context in components
 * Provides data state and update functions
 * 
 * Usage:
 * const { data, updateData, loading } = useData();
 */
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}

// ============================================
// Backward Compatibility - Keep old API
// ============================================

/**
 * These functions maintain backward compatibility
 * with existing code that uses loadData() and saveData()
 * They work outside React context
 */

// Pure functions (no React dependency)
export const loadDataDirect = loadData;
export const saveDataDirect = saveData;
export const getDefaultDataDirect = getDefaultData;
