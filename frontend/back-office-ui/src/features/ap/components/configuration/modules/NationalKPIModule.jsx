import React from 'react';

function NationalKPIModule({ configurations, onUpdate, isDataMgmt }) {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-text-hi mb-6">
        {isDataMgmt ? 'Data Management' : 'National KPI & Management'}
      </h2>
      
      {!isDataMgmt ? (
        <div className="bg-card-dark border border-border-dark rounded-lg p-6">
          <p className="text-text-mid">National KPI configuration and monitoring</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-card-dark border border-border-dark rounded-lg p-6">
            <h3 className="text-lg font-semibold text-text-hi mb-4">Backup & Restore</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue hover:bg-blue-600 text-white rounded-lg transition-colors">
                Export All Data
              </button>
              <button className="w-full px-4 py-2 bg-blue hover:bg-blue-600 text-white rounded-lg transition-colors">
                Create Backup
              </button>
              <button className="w-full px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-text-hi rounded-lg transition-colors">
                Import Data
              </button>
            </div>
          </div>

          <div className="bg-card-dark border border-border-dark rounded-lg p-6 border-red-500">
            <h3 className="text-lg font-semibold text-red-400 mb-4">⚠️ Danger Zone</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                Clear All Plans
              </button>
              <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                Reset All Configurations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NationalKPIModule;
