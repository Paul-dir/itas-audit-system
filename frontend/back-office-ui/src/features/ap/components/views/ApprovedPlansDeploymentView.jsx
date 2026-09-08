/**
 * ApprovedPlansDeploymentView — Send approved plans to regions
 * Used by both Director (to send) and Regional Directors (to acknowledge)
 * Fully converted to Tailwind CSS with enterprise-grade design.
 */

import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Badge from '../Badge';
import PlanDetailsView from './PlanDetailsView';
import { useData } from '../../services/dataService';
import { getStatusDisplay, getBadgeClass } from '../../utils/businessLogic';
import { auditConfig } from '../../config/auditConfig';
import { useRegional } from '../../context/RegionalContext';

function ApprovedPlansDeploymentView({ userRole }) {
  const { selectedRegion, assignedRegion } = useRegional();
  const { data, updateData } = useData();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const userRegion = selectedRegion || assignedRegion;

  useEffect(() => {
    loadPlans();
  }, [userRegion]);

  const loadPlans = () => {
    // Using data from hook
    
    if (userRole === 'director') {
      const directorPlans = data.plans.filter(p => 
        p.status === 'SENIOR_MANAGEMENT_APPROVED' || 
        p.status === 'AWAITING_SENIOR_MANAGEMENT_APPROVAL'
      );
      setPlans(directorPlans);
    } else if (userRole === 'regional') {
      const regionalPlans = data.plans.filter(p => 
        p.status === 'FINALIZED' &&
        p.regionalAllocation &&
        p.regionalAllocation[userRegion]
      );
      setPlans(regionalPlans);
    }
  };

  const handleDirectorDeploy = (planId) => {
    // Using data from hook
    const plan = data.plans.find(p => p.id === planId);
    
    if (!plan || (plan.status !== 'SENIOR_MANAGEMENT_APPROVED' && plan.status !== 'AWAITING_SENIOR_MANAGEMENT_APPROVAL')) {
      alert('Plan must be approved by Senior Management');
      return;
    }

    const allRegions = auditConfig.regions.map(r => r.name);
    
    plan.status = 'FINALIZED';
    plan.sentToRegions = allRegions;
    plan.sentToRegionsDate = new Date().toISOString();
    plan.lastModified = new Date().toISOString();
    
    if (!plan.approvalHistory) plan.approvalHistory = [];
    plan.approvalHistory.push({
      action: 'FINALIZED_AND_DEPLOYED',
      by: 'Director',
      date: new Date().toISOString(),
      notes: `Plan finalized and deployed to ${allRegions.length} regions for acknowledgment`,
      version: plan.version
    });
    
    updateData(data);
    alert(`✅ Plan deployed to ${allRegions.length} regions!\n\nRegions: ${allRegions.join(', ')}`);
    setSelectedPlan(null);
    loadPlans();
  };

  const handleRegionalAcknowledge = (planId) => {
    // Using data from hook
    const plan = data.plans.find(p => p.id === planId);
    
    if (!plan || plan.status !== 'FINALIZED') {
      alert('Plan must be FINALIZED');
      return;
    }

    if (!userRegion) {
      alert('Region not assigned. Cannot acknowledge.');
      return;
    }

    if (!plan.regionalAcknowledgment) {
      plan.regionalAcknowledgment = {};
    }

    plan.regionalAcknowledgment[userRegion] = {
      status: 'ACKNOWLEDGED',
      region: userRegion,
      acknowledgedDate: new Date().toISOString(),
      acknowledgedBy: 'Regional Director'
    };

    if (!plan.approvalHistory) plan.approvalHistory = [];
    plan.approvalHistory.push({
      action: 'ACKNOWLEDGED_BY_REGION',
      by: 'Regional Director',
      date: new Date().toISOString(),
      notes: `Plan acknowledged by ${userRegion}`,
      version: plan.version
    });

    updateData(data);
    alert(`✅ ${userRegion} acknowledged the finalized plan`);
    setSelectedPlan(null);
    loadPlans();
  };

  if (selectedPlan) {
    return (
      <div className="space-y-6 p-8 bg-neutral-900 min-h-screen">
        <PlanDetailsView 
          plan={selectedPlan}
          onBack={() => setSelectedPlan(null)}
          readOnly={true}
        />
        <div className="flex justify-end gap-3 pt-4">
          {userRole === 'director' && selectedPlan.status === 'SENIOR_MANAGEMENT_APPROVED' && (
            <button 
              className="inline-flex items-center gap-2 rounded-lg bg-success-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-success-700"
              onClick={() => handleDirectorDeploy(selectedPlan.id)}
            >
              <i className="fas fa-paper-plane"></i> Deploy to All Regions
            </button>
          )}
          {userRole === 'regional' && selectedPlan.status === 'FINALIZED' && (
            <button 
              className="inline-flex items-center gap-2 rounded-lg bg-success-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-success-700"
              onClick={() => handleRegionalAcknowledge(selectedPlan.id)}
            >
              <i className="fas fa-thumbs-up"></i> Acknowledge Receipt
            </button>
          )}
        </div>
      </div>
    );
  }

  const title = userRole === 'director' 
    ? 'Deploy Approved Plans to Regions'
    : `Acknowledge Finalized Plans — ${userRegion || 'Region'}`;
  
  const subtitle = userRole === 'director'
    ? 'Plans approved by Senior Management, ready to deploy to regions'
    : `Finalized plans for ${userRegion || 'your region'} from Director`;

  return (
    <div className="space-y-6 p-8 bg-neutral-900 min-h-screen">
      <div className="border-b border-neutral-700 pb-4">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-neutral-50">
          <i className={`fas ${userRole === 'director' ? 'fa-paper-plane' : 'fa-check-double'} text-primary-400`}></i>
          {title}
        </h2>
        <p className="mt-1 text-sm text-neutral-400">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card 
          title={userRole === 'director' ? 'Ready to Deploy' : 'Ready to Acknowledge'} 
          number={plans.length} 
          icon={userRole === 'director' ? 'fas fa-paper-plane' : 'fas fa-check-double'} 
        />
        {userRole === 'regional' && (
          <Card title="Acknowledged" number={plans.filter(p => p.regionalAcknowledgment).length} icon="fas fa-check-circle" />
        )}
      </div>

      <div className="border-b border-neutral-700 pb-2">
        <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-50">
          <i className={`fas ${userRole === 'director' ? 'fa-envelope' : 'fa-inbox'} text-primary-400`}></i>
          {userRole === 'director' ? 'Plans for Deployment' : 'Plans for Acknowledgment'}
        </h3>
      </div>
      
      <div className="overflow-hidden rounded-lg border border-neutral-700">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-700 bg-neutral-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300">Plan ID</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-neutral-300">Fiscal Year</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-neutral-300">Total Cases</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-neutral-300">Version</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-neutral-300">Status</th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-neutral-300">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700">
            {plans.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center">
                  <i className="fas fa-inbox mb-4 block text-5xl text-neutral-600"></i>
                  <span className="text-neutral-400">
                    {userRole === 'director' 
                      ? 'No approved plans ready to deploy'
                      : 'No finalized plans to acknowledge'}
                  </span>
                </td>
              </tr>
            ) : (
              plans.map(plan => (
                <tr key={plan.id} className="transition-colors hover:bg-neutral-700/50">
                  <td className="px-6 py-4 font-semibold text-neutral-50">{plan.id}</td>
                  <td className="px-6 py-4 text-center text-neutral-300">{plan.fiscalYear}</td>
                  <td className="px-6 py-4 text-center text-neutral-300">{plan.totalVolume}</td>
                  <td className="px-6 py-4 text-center text-neutral-300">v{plan.version}</td>
                  <td className="px-6 py-4 text-center">
                    <Badge status={getStatusDisplay(plan.status)} className={getBadgeClass(plan.status)} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      className="inline-flex items-center gap-1 rounded bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-700"
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <i className="fas fa-eye"></i> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-primary-700 bg-primary-900/20 p-4">
        <p className="flex items-center gap-2 font-semibold text-primary-400">
          <i className="fas fa-info-circle"></i>
          {userRole === 'director' ? 'Director Deployment' : 'Regional Acknowledgment'}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-primary-300/80">
          {userRole === 'director' 
            ? 'Deploy approved plans to all regions for final distribution to tax centers. Plans will be marked as FINALIZED and regions will be able to acknowledge receipt.'
            : 'Acknowledge receipt of finalized plans from Director. This confirms that your region is ready to cascade the plan to audit cases.'}
        </p>
      </div>
    </div>
  );
}

export default ApprovedPlansDeploymentView;
