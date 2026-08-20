import React from 'react';

function AuditStandardsModule({ data, onUpdate }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-text-hi mb-6">Audit Standards</h2>
      <div className="bg-card-dark border border-border-dark rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-text-hi mb-2">Documentation Required</label>
          <p className="text-text-mid">{data.documentationRequired ? 'Yes' : 'No'}</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-hi mb-2">Work Paper Standards</label>
          <p className="text-text-mid">{data.workPaperStandards}</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-hi mb-2">Compliance Framework</label>
          <p className="text-text-mid">{data.complianceFramework}</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-hi mb-2">Quality Review Level</label>
          <p className="text-text-mid">Level {data.qualityReviewLevel}</p>
        </div>
      </div>
    </div>
  );
}

export default AuditStandardsModule;
