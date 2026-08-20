import React from 'react';

function WorkflowApprovalModule({ data, onUpdate }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-text-hi mb-6">Workflow & Approval</h2>
      <div className="bg-card-dark border border-border-dark rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-text-hi mb-2">Director Approval Required</label>
          <p className="text-text-mid">{data.requiresDirectorApproval ? 'Yes' : 'No'}</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-hi mb-2">Regional Feedback Required</label>
          <p className="text-text-mid">{data.requiresRegionalFeedback ? 'Yes' : 'No'}</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-hi mb-2">Senior Management Approval</label>
          <p className="text-text-mid">{data.requiresSeniorManagementApproval ? 'Yes' : 'No'}</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-hi mb-2">Max Rounds of Amendments</label>
          <p className="text-text-mid">{data.maxRoundOfAmendments}</p>
        </div>
      </div>
    </div>
  );
}

export default WorkflowApprovalModule;
