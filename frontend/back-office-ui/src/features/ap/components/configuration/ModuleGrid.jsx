import React from 'react';
import ModuleCard from './shared/ModuleCard';

function ModuleGrid({ modules, onModuleClick, getModuleStatus }) {
  const iconMap = {
    'BarChart3': '📊',
    'Briefcase': '💼',
    'Building2': '🏢',
    'Users': '👥',
    'Award': '🏆',
    'Globe2': '🌍',
    'AlertTriangle': '⚠️',
    'CheckCircle2': '✓',
    'GitBranch': '🔀',
    'ToggleLeft': '⚙️',
    'Gauge': '📈',
    'Database': '💾'
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {modules.length > 0 ? (
        modules.map(module => (
          <ModuleCard
            key={module.id}
            module={module}
            icon={iconMap[module.icon]}
            status={getModuleStatus(module.id)}
            onClick={() => onModuleClick(module.id)}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-text-mid">No modules found. Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
}

export default ModuleGrid;
