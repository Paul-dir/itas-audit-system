import React from 'react';

function DashboardHeader({ searchTerm, onSearchChange, stats }) {
  return (
    <div className="mb-8">
      {/* Title Section */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-text-hi mb-2">Configuration & Standards Management</h1>
        <p className="text-sm text-text-mid">Centralized administration hub for all audit system parameters</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card-dark border border-border-dark rounded-lg p-4">
          <div className="text-xs font-bold uppercase text-text-mid tracking-wider mb-2">Modules</div>
          <div className="text-2xl font-bold text-text-hi">{stats.totalModules}</div>
          <div className="text-xs text-text-mid mt-1">Configured</div>
        </div>
        <div className="bg-card-dark border border-border-dark rounded-lg p-4">
          <div className="text-xs font-bold uppercase text-text-mid tracking-wider mb-2">Total Items</div>
          <div className="text-2xl font-bold text-text-hi">{stats.configuredItems}</div>
          <div className="text-xs text-text-mid mt-1">Configured</div>
        </div>
        <div className="bg-card-dark border border-border-dark rounded-lg p-4">
          <div className="text-xs font-bold uppercase text-text-mid tracking-wider mb-2">Coverage</div>
          <div className="text-2xl font-bold text-text-hi">{stats.coverage}</div>
          <div className="text-xs text-text-mid mt-1">Complete</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-3 text-text-mid">🔍</span>
        <input
          type="text"
          placeholder="Search modules by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-card-dark border border-border-dark rounded-lg text-text-hi placeholder-text-mid focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue focus:ring-opacity-20 transition-all duration-200"
        />
      </div>
    </div>
  );
}

export default DashboardHeader;
