import React from 'react';

function RiskIndicatorsModule({ data, onUpdate }) {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-text-hi mb-6">Risk Indicators ({data.length})</h2>
      <div className="space-y-3">
        {data.map(item => (
          <div key={item.id} className="bg-card-dark border border-border-dark rounded-lg p-4">
            <h3 className="text-lg font-semibold text-text-hi">{item.name}</h3>
            <p className="text-sm text-text-mid">
              Weight: {item.weight} • {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RiskIndicatorsModule;
