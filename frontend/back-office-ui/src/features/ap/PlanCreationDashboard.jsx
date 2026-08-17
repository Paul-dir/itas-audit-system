import React, { useState } from 'react';
import { useCreatePlanMutation } from './apApi';

const PlanCreationDashboard = () => {
  const [createPlan, { isLoading, error, data: createdPlan }] = useCreatePlanMutation();
  const [planYear, setPlanYear] = useState(new Date().getFullYear());
  const [planName, setPlanName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!planName) return;
    try {
      await createPlan({ planYear: parseInt(planYear, 10), planName }).unwrap();
    } catch (err) {
      console.error('Failed to create plan:', err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Annual Audit Plan Creation</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Define New Plan</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Year</label>
            <input 
              type="number" 
              value={planYear} 
              onChange={(e) => setPlanYear(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
            <input 
              type="text" 
              value={planName} 
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="e.g. National Tax Audit Plan 2026"
              className="w-full border border-gray-300 rounded-md p-2"
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading || !planName}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Generating Quotas...' : 'Create Plan & Fetch Quotas'}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">Error creating plan.</p>}
      </div>

      {createdPlan && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Generated Allocations (from Risk Engine)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm whitespace-nowrap">
              <thead className="uppercase tracking-wider border-b-2 border-gray-300 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 border-x border-gray-200">Tax Center Code</th>
                  <th className="px-6 py-3 border-x border-gray-200">Proposed Case Quota</th>
                </tr>
              </thead>
              <tbody>
                {createdPlan.allocations?.map((allocation, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 border-x border-gray-200 font-medium text-gray-900">{allocation.taxCenterCode}</td>
                    <td className="px-6 py-4 border-x border-gray-200 text-gray-600">{allocation.proposedCount}</td>
                  </tr>
                ))}
                {(!createdPlan.allocations || createdPlan.allocations.length === 0) && (
                  <tr>
                    <td colSpan="2" className="px-6 py-4 text-center text-gray-500">No allocations generated.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanCreationDashboard;
