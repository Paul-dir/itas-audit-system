import React from 'react';

function FeatureFlagsModule({ data, onUpdate }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-text-hi mb-6">Feature Flags</h2>
      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="bg-card-dark border border-border-dark rounded-lg p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-text-hi capitalize">{key.replace(/_/g, ' ')}</h3>
            </div>
            <div className="text-text-mid">
              {value ? '🟢 Enabled' : '🔴 Disabled'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeatureFlagsModule;
