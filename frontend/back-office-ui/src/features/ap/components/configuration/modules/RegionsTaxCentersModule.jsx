import React from 'react';

function RegionsTaxCentersModule({ regions, taxCenters, onUpdate }) {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-text-hi mb-6">Regions & Tax Centers</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-text-hi mb-4">Regions ({regions.length})</h3>
          <div className="space-y-3">
            {regions.map(region => (
              <div key={region.id} className="bg-card-dark border border-border-dark rounded-lg p-4">
                <h4 className="font-semibold text-text-hi">{region.name}</h4>
                <p className="text-sm text-text-mid">
                  Taxpayers: {region.taxpayers} • Auditors: {region.availableAuditors}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-text-hi mb-4">Tax Centers ({taxCenters.length})</h3>
          <div className="space-y-3">
            {taxCenters.map(center => (
              <div key={center} className="bg-card-dark border border-border-dark rounded-lg p-4">
                <p className="text-text-hi">{center}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegionsTaxCentersModule;
