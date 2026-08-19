import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Badge from '../Badge';
import { useData } from '../../services/dataService';
import { useRegional } from '../../context/RegionalContext';

/**
 * DashboardView - Main dashboard showing overview of audit planning activities
 * Displays KPI cards, recent plans, and activity feed
 */
function DashboardView({ currentRole }) {
  const { assignedRegion, assignedTaxCenter, setSelectedRegion, selectedRegion } = useRegional();
  const { data, updateData } = useData();
  const [currentRegion, setCurrentRegion] = useState(assignedRegion || selectedRegion || null);
  const [stats, setStats] = useState({
    myOpenTasks: 0,
    pendingReview: 0,
    underReview: 0,
    feedback: 0,
    totalPlans: 0,
    approvedPlans: 0,
    finalizedPlans: 0,
    revisedPlans: 0
  });
  const [recentPlans, setRecentPlans] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [currentRole, assignedRegion, assignedTaxCenter, currentRegion]);

  const handleRegionChange = (region) => {
    setCurrentRegion(region);
    setSelectedRegion(region);
    localStorage.setItem('user_selected_region', region);
  };

  const loadDashboardData = () => {
    // Using data from hook

    // Calculate stats based on role
    let statsData = {
      myOpenTasks: 0,
      pendingReview: 0,
      underReview: 0,
      feedback: 0,
      totalPlans: data.plans?.length || 0,
      approvedPlans: data.plans?.filter(p => p.status === 'DIRECTOR_APPROVED').length || 0,
      finalizedPlans: data.plans?.filter(p => p.status === 'FINALIZED').length || 0,
      revisedPlans: data.plans?.filter(p => p.status === 'REVISION_REQUESTED').length || 0
    };

    // Role-specific stats
    switch (currentRole) {
      case 'audit_team':
        statsData.myOpenTasks = data.plans?.filter(p => p.status === 'DRAFT' || p.status === 'REVISION_REQUESTED').length || 0;
        statsData.pendingReview = data.plans?.filter(p => p.status === 'SUBMITTED_TO_DIRECTOR').length || 0;
        statsData.underReview = data.plans?.filter(p => p.status === 'DIRECTOR_APPROVED').length || 0;
        statsData.feedback = data.plans?.filter(p => p.regionFeedbackStatus && Object.keys(p.regionFeedbackStatus).length > 0).length || 0;
        break;

      case 'director':
        statsData.myOpenTasks = data.plans?.filter(p => p.status === 'SUBMITTED_TO_DIRECTOR').length || 0;
        statsData.pendingReview = data.plans?.filter(p => p.status === 'DIRECTOR_APPROVED').length || 0;
        statsData.underReview = data.plans?.filter(p => p.status === 'SENIOR_MANAGEMENT_APPROVED').length || 0;
        statsData.feedback = data.plans?.filter(p => p.directorFeedback && Object.keys(p.directorFeedback).length > 0).length || 0;
        break;

      case 'regional':
        statsData.myOpenTasks = data.plans?.filter(p => p.status === 'FINALIZED' && p.regionalAcknowledgment?.[currentRegion]?.status === 'ACKNOWLEDGED').length || 0;
        statsData.pendingReview = data.plans?.filter(p => p.status === 'FINALIZED').length || 0;
        statsData.underReview = data.plans?.filter(p => p.submittedToTaxCenters?.[currentRegion]?.status === 'SUBMITTED').length || 0;
        statsData.feedback = data.plans?.filter(p => p.taxCenterFeedback?.[currentRegion]).length || 0;
        break;

      case 'tax_center':
        statsData.myOpenTasks = data.plans?.filter(p => p.submittedToTaxCenters && Object.keys(p.submittedToTaxCenters).length > 0).length || 0;
        statsData.pendingReview = data.plans?.filter(p => p.taxCenterAcceptance && Object.keys(p.taxCenterAcceptance).length > 0).length || 0;
        statsData.underReview = data.plans?.filter(p => p.taxCenterAllocations).length || 0;
        statsData.feedback = data.plans?.filter(p => p.taxCenterFeedback).length || 0;
        break;

      case 'senior_management':
        statsData.myOpenTasks = data.plans?.filter(p => p.status === 'DIRECTOR_APPROVED').length || 0;
        statsData.pendingReview = data.plans?.filter(p => p.status === 'SENIOR_MANAGEMENT_APPROVED').length || 0;
        statsData.underReview = data.plans?.filter(p => p.status === 'FINALIZED').length || 0;
        statsData.feedback = 0;
        break;

      default:
        break;
    }

    setStats(statsData);

    // Get recent plans (last 5)
    const recent = (data.plans || []).slice(-5).reverse();
    setRecentPlans(recent);

    // Get recent activities (last 10)
    const recentActivities = (data.activity || []).slice(0, 10);
    setActivities(recentActivities);
  };

  const getRoleLabel = () => {
    const roleLabels = {
      audit_team: 'Audit Planning Team',
      director: 'Audit Director',
      regional: 'Regional Director',
      tax_center: 'Tax Center Manager',
      senior_management: 'Senior Management'
    };
    return roleLabels[currentRole] || 'User';
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'DRAFT': 'draft',
      'SUBMITTED_TO_DIRECTOR': 'submitted',
      'DIRECTOR_APPROVED': 'director-approved',
      'SENIOR_MANAGEMENT_APPROVED': 'senior-approved',
      'FINALIZED': 'senior-approved',
      'REVISION_REQUESTED': 'feedback',
      'REJECTED': 'rejected',
      'SUBMITTED_TO_SENIOR_MANAGEMENT': 'submitted',
      'AWAITING_SENIOR_MANAGEMENT_APPROVAL': 'feedback'
    };
    return statusMap[status] || 'pending';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  };

  const getActivityIcon = (event) => {
    if (event.includes('Created')) return 'fa-plus-circle';
    if (event.includes('Submitted')) return 'fa-paper-plane';
    if (event.includes('Approved')) return 'fa-check-circle';
    if (event.includes('Rejected')) return 'fa-times-circle';
    if (event.includes('Feedback')) return 'fa-comments';
    return 'fa-info-circle';
  };

  const getActivityColor = (status) => {
    if (status.includes('SUBMITTED')) return '#74b7ff';
    if (status.includes('APPROVED')) return '#5ee89c';
    if (status.includes('REJECTED')) return '#ff7b7b';
    return '#f5c451';
  };

  return (
    <div className="px-6 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-text-primary dark:text-text-hi">
            Dashboard
          </h1>
          <p className="text-base text-text-muted dark:text-text-mid">
            Overview of all planning activities and your workload
          </p>
        </div>
        <div className="flex gap-lg items-center">
          {/* Region Selector for Regional Directors */}
          {currentRole === 'regional' && (
            <div className="flex gap-sm items-center">
              <label className="text-xs font-semibold text-text-muted dark:text-text-mid">Region:</label>
              <select
                value={currentRegion || ''}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="px-3 py-2 border border-neutral-300 dark:border-border-dark rounded-sm bg-white dark:bg-card text-text-primary dark:text-text-hi text-sm font-semibold cursor-pointer min-w-[150px]"
              >
                <option value="">-- Select Region --</option>
                {['Oromia', 'SNNPR', 'Addis Ababa', 'Amhara', 'Tigray'].map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          )}
          <div className="text-base text-text-muted dark:text-text-mid">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="cards mb-8">
        <Card title="My Open Tasks" number={stats.myOpenTasks} icon="fas fa-tasks" />
        <Card title="Pending Review" number={stats.pendingReview} icon="fas fa-inbox" />
        <Card title="Under Review" number={stats.underReview} icon="fas fa-eye" />
        <Card title="Feedback" number={stats.feedback} icon="fas fa-comments" />
      </div>

      {/* Recent Plans & Activity */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Recent Plans */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-text-primary dark:text-text-hi">
              <i className="fas fa-history mr-2 text-primary dark:text-blue-400"></i>
              Recent Plans
            </h2>
            <a href="#" className="text-xs text-primary dark:text-blue-400 no-underline font-semibold">
              View all →
            </a>
          </div>
          <p className="text-xs text-text-muted dark:text-text-mid mb-4">
            Latest audit plans that have been updated in the system.
          </p>

          {recentPlans.length === 0 ? (
            <div className="bg-white dark:bg-card px-8 py-8 rounded-lg text-center border border-neutral-200 dark:border-border-dark">
              <p className="text-text-muted dark:text-text-mid m-0">No plans available</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th className="text-left">PLAN ID</th>
                    <th className="text-left">PLAN NAME</th>
                    <th className="text-center">PERIOD</th>
                    <th className="text-left">STATUS</th>
                    <th className="text-right">UPDATED</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPlans.map((plan, idx) => (
                    <tr key={idx}>
                      <td><strong>{plan.id}</strong></td>
                      <td className="text-sm">{plan.name || `FY ${plan.fiscalYear} Plan`}</td>
                      <td className="text-center text-xs">{plan.fiscalYear}</td>
                      <td>
                        <Badge 
                          status={plan.status} 
                          className={getStatusBadgeClass(plan.status)} 
                        />
                      </td>
                      <td className="text-right text-xs text-text-muted dark:text-text-mid">
                        {formatDate(plan.lastModified || plan.createdDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-text-primary dark:text-text-hi">
              <i className="fas fa-clock mr-2 text-primary dark:text-blue-400"></i>
              Recent Activity
            </h2>
            <a href="#" className="text-xs text-primary dark:text-blue-400 no-underline font-semibold">
              View all →
            </a>
          </div>
          <p className="text-xs text-text-muted dark:text-text-mid mb-4">
            Latest actions and updates in audit planning.
          </p>

          {activities.length === 0 ? (
            <div className="bg-white dark:bg-card px-8 py-8 rounded-lg text-center border border-neutral-200 dark:border-border-dark">
              <p className="text-text-muted dark:text-text-mid m-0">No activities yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {activities.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 p-3 bg-white dark:bg-card rounded-md border border-neutral-200 dark:border-border-dark items-start"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
                    <i 
                      className={`fas ${getActivityIcon(activity.event)}`}
                      style={{ color: getActivityColor(activity.status), fontSize: '14px' }}
                    ></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold mb-1 text-text-primary dark:text-text-hi">
                      {activity.event}
                    </p>
                    <p className="text-xs text-text-muted dark:text-text-mid mb-1">
                      {activity.ref}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500">
                      {activity.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white dark:bg-card px-6 py-6 rounded-lg border border-neutral-200 dark:border-border-dark">
        <h3 className="text-base font-bold mb-4 text-text-primary dark:text-text-hi">
          <i className="fas fa-chart-bar mr-2 text-primary dark:text-blue-400"></i>
          Summary Statistics
        </h3>
        <div className="grid grid-cols-4 gap-lg">
          <div className="text-center">
            <p className="text-xs text-text-muted dark:text-text-mid mb-2">Total Plans</p>
            <p className="text-3xl font-bold text-text-primary dark:text-text-hi">
              {stats.totalPlans}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-muted dark:text-text-mid mb-2">Approved</p>
            <p className="text-3xl font-bold text-blue-500 dark:text-blue-400">
              {stats.approvedPlans}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-muted dark:text-text-mid mb-2">Finalized</p>
            <p className="text-3xl font-bold text-success-500 dark:text-success-400">
              {stats.finalizedPlans}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-muted dark:text-text-mid mb-2">In Revision</p>
            <p className="text-3xl font-bold text-warning-500 dark:text-warning-400">
              {stats.revisedPlans}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardView;
