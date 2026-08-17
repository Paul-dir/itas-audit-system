import React, { useState } from 'react';
import { useCreatePlanMutation } from './apApi';

export const PlanCreationDashboard = () => {
  const [createPlan, { isLoading }] = useCreatePlanMutation();
  const [planData, setPlanData] = useState({ planYear: 2026, planName: '' });
  const [createdPlan, setCreatedPlan] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createPlan(planData).unwrap();
      setCreatedPlan(result);
    } catch (err) {
      console.error('Failed to create plan: ', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Annual Audit Plan Creation</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium">Plan Year</label>
          <input 
            type="number" 
            value={planData.planYear}
            onChange={e => setPlanData({...planData, planYear: parseInt(e.target.value)})}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Plan Name</label>
          <input 
            type="text" 
            value={planData.planName}
            onChange={e => setPlanData({...planData, planName: e.target.value})}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border"
            placeholder="e.g. FY2026 National Audit Plan"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isLoading ? 'Creating...' : 'Create Plan & Fetch Quotas'}
        </button>
      </form>

      {createdPlan && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Generated Allocations (Risk Engine)</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Center</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proposed Quota</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {createdPlan.allocations.map((alloc, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alloc.taxCenterCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alloc.proposedCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
