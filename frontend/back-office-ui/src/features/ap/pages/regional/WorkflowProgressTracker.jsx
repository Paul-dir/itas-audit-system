import { CheckCircle, Clock, AlertCircle, Zap, Activity } from 'lucide-react';
import { Badge } from '../../../../components/ui/index.jsx';

export function WorkflowProgressTracker({ plan, workflowStatus, region }) {
  const status = workflowStatus[plan.id];
  
  if (!status) return null;

  const steps = [
    {
      id: 'feedback',
      label: 'Regional Feedback',
      description: 'Awaiting regional feedback',
      completed: status.feedbackSubmitted,
      active: plan.status === 'AWAITING_REGIONAL_FEEDBACK' && !status.feedbackSubmitted,
      icon: 'feedback'
    },
    {
      id: 'collection',
      label: 'Tax Center Review',
      description: 'Tax centers providing input',
      completed: ['FEEDBACK_COLLECTED', 'AMENDMENT_REQUIRED', 'SUBMITTED_TO_SENIOR_MGMT', 'SENIOR_MGMT_APPROVED', 'APPROVED_TO_REGIONS', 'FINALIZED'].includes(plan.status),
      active: false,
      icon: 'collection'
    },
    {
      id: 'deployment',
      label: 'Regional Deployment',
      description: 'Deploying to tax centers',
      completed: status.deployedToTC,
      active: plan.status === 'APPROVED_TO_REGIONS' && !status.deployedToTC,
      icon: 'deployment'
    },
    {
      id: 'cases',
      label: 'Case Generation',
      description: 'Generating audit cases',
      completed: status.casesGenerated,
      active: false,
      icon: 'cases'
    }
  ];

  const getStepIcon = (step) => {
    if (step.completed) {
      return <CheckCircle size={20} className="text-green-600" />;
    } else if (step.active) {
      return <Zap size={20} className="text-yellow-600 animate-pulse" />;
    } else {
      return <Clock size={20} className="text-gray-400" />;
    }
  };

  const getStepColor = (step) => {
    if (step.completed) return 'bg-green-50 border-green-200';
    if (step.active) return 'bg-yellow-50 border-yellow-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">
        <Activity size={12} className="inline mr-1" />
        Workflow Progress
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {steps.map((step, idx) => (
          <div key={step.id}>
            <div className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all ${getStepColor(step)}`}>
              {getStepIcon(step)}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {step.label}
                </p>
              </div>
            </div>
            
            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div className="flex justify-center py-0.5">
                <div className={`w-0.5 h-2 ${
                  step.completed ? 'bg-green-400' : 'bg-gray-300'
                }`}></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Status update indicator */}
      {status.statusChanged && (
        <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg dark:bg-blue-900 dark:text-blue-200">
          <Activity size={14} className="animate-spin" />
          Status updated just now
        </div>
      )}

      {/* Last updated */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Last updated: {status.lastUpdated?.toLocaleTimeString() || 'Now'}
      </div>
    </div>
  );
}

export function WorkflowStatusBadge({ plan, workflowStatus }) {
  const status = workflowStatus[plan.id];
  
  if (!status) return null;

  const statusConfig = {
    'DRAFT': { color: 'gray', label: 'Draft' },
    'AWAITING_REGIONAL_FEEDBACK': { color: 'yellow', label: '⏳ Awaiting Feedback' },
    'FEEDBACK_COLLECTED': { color: 'blue', label: '📋 Feedback Collected' },
    'AMENDMENT_REQUIRED': { color: 'orange', label: '✏️ Amendment Needed' },
    'SUBMITTED_TO_SENIOR_MGMT': { color: 'purple', label: '🔄 Senior Review' },
    'SENIOR_MGMT_APPROVED': { color: 'green', label: '✓ Approved' },
    'APPROVED_TO_REGIONS': { color: 'green', label: '🚀 Ready to Deploy' },
    'FINALIZED': { color: 'green', label: '✅ Finalized' }
  };

  const config = statusConfig[plan.status] || { color: 'gray', label: plan.status };

  return (
    <Badge 
      color={config.color} 
      dot
      className={`
        ${plan.status === 'AWAITING_REGIONAL_FEEDBACK' ? 'animate-pulse' : ''}
        ${status.statusChanged ? 'ring-2 ring-offset-2 ring-blue-400' : ''}
      `}
    >
      {config.label}
    </Badge>
  );
}

export function WorkflowSummary({ plans, workflowStatus, region }) {
  const summary = {
    pending: plans.filter(p => p.status === 'AWAITING_REGIONAL_FEEDBACK' && !workflowStatus[p.id]?.feedbackSubmitted).length,
    inReview: plans.filter(p => ['FEEDBACK_COLLECTED', 'AMENDMENT_REQUIRED', 'SUBMITTED_TO_SENIOR_MGMT'].includes(p.status)).length,
    readyToDeploy: plans.filter(p => p.status === 'APPROVED_TO_REGIONS' && !workflowStatus[p.id]?.deployedToTC).length,
    deployed: plans.filter(p => workflowStatus[p.id]?.deployedToTC).length,
    finalized: plans.filter(p => p.status === 'FINALIZED').length
  };

  return (
    <div className="grid grid-cols-5 gap-3">
      <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-3 border border-yellow-200 dark:border-yellow-700">
        <p className="text-xs text-yellow-700 dark:text-yellow-200 font-semibold">Pending</p>
        <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{summary.pending}</p>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
        <p className="text-xs text-blue-700 dark:text-blue-200 font-semibold">In Review</p>
        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{summary.inReview}</p>
      </div>
      
      <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
        <p className="text-xs text-purple-700 dark:text-purple-200 font-semibold">Ready Deploy</p>
        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{summary.readyToDeploy}</p>
      </div>
      
      <div className="bg-green-50 dark:bg-green-900 rounded-lg p-3 border border-green-200 dark:border-green-700">
        <p className="text-xs text-green-700 dark:text-green-200 font-semibold">Deployed</p>
        <p className="text-2xl font-bold text-green-900 dark:text-green-100">{summary.deployed}</p>
      </div>
      
      <div className="bg-emerald-50 dark:bg-emerald-900 rounded-lg p-3 border border-emerald-200 dark:border-emerald-700">
        <p className="text-xs text-emerald-700 dark:text-emerald-200 font-semibold">Finalized</p>
        <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{summary.finalized}</p>
      </div>
    </div>
  );
}
