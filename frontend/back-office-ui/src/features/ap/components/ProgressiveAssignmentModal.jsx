import React, { useState, useEffect } from 'react';
import { Modal, Button, Badge, Alert } from '../../../components/ui/index.jsx';
import { Building2, Send, Filter, Users, ShieldCheck, UserCheck } from 'lucide-react';

export default function ProgressiveAssignmentModal({ open, onClose, selectedCases = [], teamLeaders = [], onAssign, loading }) {
  const [selectedRegion, setSelectedRegion] = useState('REG-FED');
  const [selectedTc, setSelectedTc] = useState('federal-lto1');
  const [selectedAuditType, setSelectedAuditType] = useState('ALL');
  const [selectedCommittee, setSelectedCommittee] = useState('auto');
  const [manualTlSelections, setManualTlSelections] = useState({});

  if (!open) return null;

  const AUDIT_TYPES = [
    { id: 'DESK_AUDIT', shortName: 'Desk Audit', color: 'blue' },
    { id: 'COMPREHENSIVE_AUDIT', shortName: 'Comprehensive Audit', color: 'indigo' },
    { id: 'JOINT_AUDIT', shortName: 'Joint Audit', color: 'purple', isCommittee: true },
    { id: 'TRANSFER_PRICING', shortName: 'Transfer Pricing', color: 'emerald', isCommittee: true }
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Organize & Assign Cases (Progressive Organizational Routing)"
      size="xl"
      footer={
        <div className="flex justify-between w-full">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            variant="success"
            icon={Send}
            onClick={() => onAssign(manualTlSelections)}
            disabled={loading || selectedCases.length === 0}
          >
            {loading ? 'Processing Assignments…' : `Confirm & Assign ${selectedCases.length} Cases`}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <Alert type="info" title="Strict Organizational Assignment Hierarchy">
          Cases follow: <b>Region → Tax Center → Audit Type → Committee / Team → Team Leader → Auditor</b>. Cross-Tax Center or cross-audit type assignments are blocked by backend security policies.
        </Alert>

        {/* Step 1 & Step 2: Region & Tax Center Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
              Step 1: Region Scope
            </label>
            <select
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-semibold"
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
            >
              <option value="REG-FED">🏛️ Federal Directorate (National LTO)</option>
              <option value="REG-Z">📍 Region Z Directorate</option>
              <option value="REG-Y">📍 Region Y Directorate</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
              Step 2: Tax Center Scope
            </label>
            <select
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-semibold"
              value={selectedTc}
              onChange={e => setSelectedTc(e.target.value)}
            >
              {selectedRegion === 'REG-FED' && <option value="federal-lto1">🏢 Federal LTO 1</option>}
              {selectedRegion === 'REG-Z' && (
                <>
                  <option value="Z-TC-1">🏢 Region Z Tax Center 1 (Z-TC-1)</option>
                  <option value="Z-TC-2">🏢 Region Z Tax Center 2 (Z-TC-2)</option>
                  <option value="Z-TC-3">🏢 Region Z Tax Center 3 (Z-TC-3)</option>
                </>
              )}
              {selectedRegion === 'REG-Y' && (
                <>
                  <option value="Y-TC-1">🏢 Region Y Tax Center 1 (Y-TC-1)</option>
                  <option value="Y-TC-2">🏢 Region Y Tax Center 2 (Y-TC-2)</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Step 3 & Step 4: Audit Type & Committee / TL Selection */}
        <div>
          <p className="text-sm font-bold text-gray-800 dark:text-slate-200 mb-3 flex items-center gap-2">
            <Users size={16} className="text-blue-600" />
            Step 3 & 4: Specialized Routing by Audit Type
          </p>

          <div className="space-y-3">
            {AUDIT_TYPES.map(at => {
              const typeCases = selectedCases.filter(c => (c.auditType || '').toUpperCase() === at.id || c.auditTypeFrontendId === at.id.toLowerCase());
              if (!typeCases.length) return null;

              const matchingLeaders = teamLeaders.filter(tl => {
                const uAt = (tl.auditType || '').toUpperCase().replace(/\s+/g, '_');
                return uAt.includes(at.id.replace('_AUDIT', '')) || (at.isCommittee && tl.userType === 'COMMITTEE_MEMBER');
              });

              return (
                <div key={at.id} className="flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3.5 shadow-sm gap-3">
                  <div className="flex items-center gap-3">
                    <Badge color={at.color}>{at.shortName}</Badge>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      {typeCases.length} case{typeCases.length > 1 ? 's' : ''}
                    </span>
                    {at.isCommittee && (
                      <span className="text-[10px] bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold px-2 py-0.5 rounded-md">
                        🏛️ Requires Committee Review
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">Assign To:</span>
                    <select
                      className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                      value={manualTlSelections[at.id] || 'auto'}
                      onChange={e => setManualTlSelections(prev => ({ ...prev, [at.id]: e.target.value }))}
                    >
                      <option value="auto">⚡ Auto Load-Balance (Round-Robin)</option>
                      {matchingLeaders.map(tl => (
                        <option key={tl.id || tl.userId} value={tl.userId || tl.id}>
                          👤 {tl.name || tl.fullName} ({tl.auditType?.replace(/_/g, ' ') || 'Specialized TL'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
