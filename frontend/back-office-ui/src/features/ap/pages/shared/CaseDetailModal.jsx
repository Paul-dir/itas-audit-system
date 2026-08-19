import { Modal, Badge } from '../../components/ui/index.jsx';
import { AUDIT_TYPES, CASE_STATUS, RISK_LEVELS } from '../../data/constants.js';

const riskColor = { CRITICAL: 'red', HIGH: 'orange', MEDIUM: 'yellow', LOW: 'blue' };

export default function CaseDetailModal({ caseData, onClose, users = [] }) {
  if (!caseData) return null;
  const at = AUDIT_TYPES.find(a => a.id === caseData.auditType);
  const cs = CASE_STATUS[caseData.status];
  const tl = users.find(u => u.id === caseData.assignedTeamLeader);
  const aud = users.find(u => u.id === caseData.assignedAuditor);

  const Row = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-50 dark:border-slate-600 last:border-0">
      <span className="text-sm text-gray-500 dark:text-slate-400">{label}</span>
      <span className="text-sm font-medium text-gray-800 dark:text-slate-200">{value || '—'}</span>
    </div>
  );

  return (
    <Modal open={!!caseData} onClose={onClose} title="Case Details" size="lg">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between bg-gray-50 dark:bg-slate-700 rounded-xl p-4 border border-gray-100 dark:border-slate-600">
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Case ID</p>
            <p className="text-sm font-mono text-gray-600 dark:text-slate-300 mb-2">{caseData.id}</p>
            <p className="font-bold text-gray-900 dark:text-white text-lg">{caseData.taxpayerName}</p>
            <p className="text-sm font-mono text-gray-400 dark:text-slate-400 mt-0.5">TIN: {caseData.tin}</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {cs && <Badge color={cs.color} dot>{cs.label}</Badge>}
            <Badge color={riskColor[caseData.riskLevel] || 'gray'} dot>{caseData.riskLevel}</Badge>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
              Created: {new Date(caseData.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Taxpayer Profile */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">🏢 Taxpayer Profile</p>
          <div className="bg-blue-50 dark:!bg-slate-700 rounded-xl p-4 border border-blue-100 dark:border-slate-600">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Business Name</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{caseData.taxpayerName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">TIN Number</p>
                <p className="text-sm font-mono font-medium text-gray-900 dark:text-white mt-0.5">{caseData.tin}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Sector / Industry</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{caseData.sector || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Annual Revenue</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                  {caseData.annualRevenue ? `₦${(caseData.annualRevenue / 1000000).toFixed(1)}M` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Number of Employees</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{caseData.employees || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Tax Center</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                  {caseData.taxCenter?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">⚠️ Risk Assessment</p>
          <div className="bg-yellow-50 dark:!bg-slate-700 rounded-xl p-4 border border-yellow-100 dark:border-slate-600">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Risk Score</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        caseData.riskLevel === 'CRITICAL' ? 'bg-red-500' :
                        caseData.riskLevel === 'HIGH' ? 'bg-orange-500' :
                        caseData.riskLevel === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${caseData.riskScore}%` }}
                    />
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{caseData.riskScore}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Risk Level</p>
                <Badge color={riskColor[caseData.riskLevel] || 'gray'} className="mt-1">
                  {caseData.riskLevel}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Priority</p>
                <Badge color={
                  caseData.riskLevel === 'CRITICAL' ? 'red' :
                  caseData.riskLevel === 'HIGH' ? 'orange' : 'gray'
                } className="mt-1">
                  {caseData.riskLevel === 'CRITICAL' || caseData.riskLevel === 'HIGH' ? 'HIGH' : 'NORMAL'}
                </Badge>
              </div>
            </div>
            {caseData.riskFactors && caseData.riskFactors.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Risk Factors:</p>
                <div className="flex flex-wrap gap-1.5">
                  {caseData.riskFactors.map((factor, idx) => (
                    <span key={idx} className="text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2 py-1 rounded border border-red-200 dark:border-red-900">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Audit Information */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">📋 Audit Information</p>
          <div className="bg-green-50 dark:!bg-slate-700 rounded-xl p-4 border border-green-100 dark:border-slate-600">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Audit Type</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{at?.name || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Linked Plan</p>
                <p className="text-sm font-mono font-medium text-gray-900 dark:text-white mt-0.5">{caseData.planId || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Region</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                  {caseData.region?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Estimated Effort</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                  {at?.effortPerCase ? `${at.effortPerCase} hours` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Team Leader</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{tl?.name || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-slate-400">Auditor</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{aud?.name || 'Unassigned'}</p>
              </div>
              {caseData.startDate && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Start Date</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                    {new Date(caseData.startDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              {caseData.completedDate && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Completed Date</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                    {new Date(caseData.completedDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        {caseData.notes && (
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">📝 Notes</p>
            <div className="bg-purple-50 dark:!bg-slate-700 rounded-xl p-3 border border-purple-100 dark:border-slate-600">
              <p className="text-sm text-gray-700 dark:text-slate-200">{caseData.notes}</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
