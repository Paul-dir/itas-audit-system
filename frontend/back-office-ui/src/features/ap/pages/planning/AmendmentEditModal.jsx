import { useState } from 'react';
import { X, Edit, Save, RotateCcw, AlertCircle } from 'lucide-react';
import { Modal, Button, Textarea, Card, Alert, Badge, Input } from '../../../../components/ui/index.jsx';
import { DistributionTable } from '../shared/DistributionTable.jsx';
import { REGIONS, AUDIT_TYPES, getTaxCentersForRegion } from '../../data/constants.js';
import PlanTimeline from '../shared/PlanTimeline.jsx';
import { useApp } from '../../../../context/AppContext.jsx';
import { useAuth } from '../../../../context/AuthContext.jsx';

export default function AmendmentEditModal({ plan, open, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [saving, setSaving] = useState(false);
  const [editedDistribution, setEditedDistribution] = useState(null);

  const handleEdit = () => {
    setEditedPlan({ ...plan });
    setEditedDistribution({ ...plan.distribution });
    setIsEditing(true);
  };

  const handleDistributionChange = (regionId, auditTypeId, value) => {
    setEditedDistribution(prev => ({
      ...prev,
      [regionId]: {
        ...prev[regionId],
        [auditTypeId]: Math.max(0, parseInt(value) || 0)
      }
    }));
  };

  const calculateNewTotals = () => {
    const totals = {};
    AUDIT_TYPES.forEach(at => {
      totals[at.id] = REGIONS.reduce((sum, r) => sum + (editedDistribution?.[r.id]?.[at.id] || 0), 0);
    });
    const grandTotal = Object.values(totals).reduce((sum, v) => sum + v, 0);
    return { totals, grandTotal };
  };

  const { actions } = useApp();
  const { user } = useAuth();

  const handleSave = async () => {
    if (!editedPlan.name?.trim()) {
      alert('Plan name is required');
      return;
    }
    setSaving(true);
    try {
      const newTotal = calculateNewTotals().grandTotal;
      const updates = {
        ...editedPlan,
        distribution: editedDistribution,
        totalCases: newTotal
      };
      
      // Call backend amend API to save changes and resubmit to Director
      await actions.amendPlan(plan.id, user?.id || 'planning-team', updates);
      console.log('✅ Plan amended and resubmitted to Director');
      
      onUpdate(updates);
      setIsEditing(false);
      setEditedDistribution(null);
      alert('✅ Plan amended and resubmitted to the Director for review!');
    } catch (error) {
      console.error('❌ Failed to amend plan:', error);
      alert(`Failed to amend plan: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedPlan(null);
    setEditedDistribution(null);
    setIsEditing(false);
  };

  if (!plan) return null;
  const workingPlan = isEditing ? editedPlan : plan;
  const { totals, grandTotal } = isEditing && editedDistribution ? calculateNewTotals() : { totals: {}, grandTotal: 0 };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Amendment Required — ${plan.name}`}
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-amber-600">
            <AlertCircle className="inline mr-1" size={14} />
            Status: Amendment Required
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>Close</Button>
            {!isEditing ? (
              <Button variant="primary" icon={Edit} onClick={handleEdit}>
                Edit & Resubmit
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={handleCancel} icon={RotateCcw}>
                  Cancel
                </Button>
                <Button 
                  variant="success" 
                  icon={Save} 
                  onClick={handleSave} 
                  loading={saving}
                >
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Director's Amendment Comment */}
        {plan.amendmentComment && (
          <Alert type="warning" title="Director's Amendment Feedback" icon={AlertCircle}>
            <p className="text-sm">{plan.amendmentComment}</p>
          </Alert>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
            }`}
          >
            Plan Details
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'distribution'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
            }`}
          >
            Distribution
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'timeline'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
            }`}
          >
            Timeline
          </button>
        </div>

        {/* Overview Tab - EDITABLE WHEN AMENDING */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Plan Name</label>
                  <input
                    type="text"
                    value={editedPlan.name}
                    onChange={e => setEditedPlan({ ...editedPlan, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Description</label>
                  <Textarea
                    value={editedPlan.description}
                    onChange={e => setEditedPlan({ ...editedPlan, description: e.target.value })}
                    placeholder="Update the plan description with amendments..."
                    rows={4}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Plan Name</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{workingPlan.name}</p>
                    </div>
                    <Badge color="amber">Amendment Required</Badge>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Description</p>
                    <p className="text-sm text-gray-700 dark:text-slate-300 mt-1">{workingPlan.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">FY</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{workingPlan.planYear}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Total Cases</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{workingPlan.totalCases?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Distribution Tab */}
        {activeTab === 'distribution' && (
          <div className="space-y-4">
            <Alert type="info" title="Regional Allocation">
              {isEditing 
                ? 'Edit regional allocations across all audit types. Update values and click "Save Changes".'
                : 'Review the distribution across regions.'
              }
            </Alert>
            
            {isEditing && editedDistribution ? (
              <div className="bg-white rounded-lg border border-gray-200 dark:bg-slate-800 dark:border-gray-700 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-300">Region</th>
                      {AUDIT_TYPES.map(at => (
                        <th key={at.id} className="px-3 py-3 text-center font-semibold text-gray-700 dark:text-slate-300 text-xs">
                          {at.shortName}
                        </th>
                      ))}
                      <th className="px-3 py-3 text-center font-semibold text-gray-700 dark:text-slate-300">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {REGIONS.map(region => {
                      const regionTotal = AUDIT_TYPES.reduce((sum, at) => sum + (editedDistribution[region.id]?.[at.id] || 0), 0);
                      return (
                        <tr key={region.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{region.name}</td>
                          {AUDIT_TYPES.map(at => (
                            <td key={at.id} className="px-3 py-3 text-center">
                              <input
                                type="number"
                                min="0"
                                value={editedDistribution[region.id]?.[at.id] || 0}
                                onChange={(e) => handleDistributionChange(region.id, at.id, e.target.value)}
                                className="w-16 px-2 py-1 text-center border border-gray-300 rounded dark:bg-slate-600 dark:border-gray-500 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                              />
                            </td>
                          ))}
                          <td className="px-3 py-3 text-center font-semibold text-gray-900 dark:text-white">
                            {regionTotal}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-gray-100 dark:bg-slate-700 font-bold border-t-2 border-gray-300 dark:border-gray-600">
                      <td className="px-4 py-3 text-gray-900 dark:text-white">TOTAL</td>
                      {AUDIT_TYPES.map(at => (
                        <td key={at.id} className="px-3 py-3 text-center text-gray-900 dark:text-white">
                          {totals[at.id] || 0}
                        </td>
                      ))}
                      <td className="px-3 py-3 text-center text-gray-900 dark:text-white">
                        {grandTotal}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <DistributionTable distribution={workingPlan.distribution} readOnly={true} />
            )}
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">Plan approval and feedback history</p>
            <PlanTimeline plan={workingPlan} />
          </div>
        )}
      </div>
    </Modal>
  );
}
