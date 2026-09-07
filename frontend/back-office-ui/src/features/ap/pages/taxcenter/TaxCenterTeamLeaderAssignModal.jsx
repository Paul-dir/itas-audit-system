import { useState, useEffect, useMemo } from 'react';
import { Users, CheckCircle, AlertCircle, RefreshCw, Shield, ArrowRight, UserCheck } from 'lucide-react';
import { Modal, Button, Badge, Alert, Select } from '../../../../components/ui/index.jsx';
import { AUDIT_TYPES, getAuditTypeDef, isAuditTypeMatch } from '../../data/constants.js';

export default function TaxCenterTeamLeaderAssignModal({
  open,
  onClose,
  selectedCases = [],
  taxCenter,
  user,
  onSuccess
}) {
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [loadingTLs, setLoadingTLs] = useState(false);
  const [manualSelections, setManualSelections] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [resultSummary, setResultSummary] = useState(null);

  // Fetch eligible Team Leaders for this Tax Center
  useEffect(() => {
    if (!open) return;
    let isMounted = true;
    const fetchTeamLeaders = async () => {
      setLoadingTLs(true);
      setError(null);
      try {
        const tcQuery = taxCenter ? `&taxCenter=${encodeURIComponent(taxCenter)}` : '';
        const res = await fetch(`/api/v1/backoffice/ap/users?role=team_leader${tcQuery}`, {
          headers: { 'X-Actor-Id': user?.username || user?.id || 'u-tc-manager' }
        });
        if (res.ok) {
          const json = await res.json();
          const list = json.data || json || [];
          if (isMounted) {
            setTeamLeaders(list);
          }
        }
      } catch (err) {
        console.error('Failed to load team leaders:', err);
        if (isMounted) setError('Failed to load eligible team leaders from server.');
      } finally {
        if (isMounted) setLoadingTLs(false);
      }
    };
    fetchTeamLeaders();
    return () => { isMounted = false; };
  }, [open, taxCenter, user?.id, user?.username]);

  // Group selected cases by their audit type
  const casesByType = useMemo(() => {
    const groups = {};
    selectedCases.forEach(c => {
      const typeKey = c.auditType || 'UNKNOWN';
      if (!groups[typeKey]) groups[typeKey] = [];
      groups[typeKey].push(c);
    });
    return groups;
  }, [selectedCases]);

  // For each audit type, find candidate team leaders matching the audit type
  const candidatesByType = useMemo(() => {
    const map = {};
    Object.keys(casesByType).forEach(at => {
      const matching = teamLeaders.filter(tl => {
        if (!tl.auditType) return true;
        return isAuditTypeMatch(tl.auditType, at);
      });
      map[at] = matching.length > 0 ? matching : teamLeaders;
    });
    return map;
  }, [casesByType, teamLeaders]);

  const handleSelectionChange = (auditType, value) => {
    setManualSelections(prev => ({
      ...prev,
      [auditType]: value
    }));
  };

  const handleAssign = async () => {
    if (!selectedCases.length) return;
    setSubmitting(true);
    setError(null);
    setResultSummary(null);

    try {
      const assignments = [];
      const rrCounter = {};

      for (const [auditType, cases] of Object.entries(casesByType)) {
        const targetOption = manualSelections[auditType] || 'auto';
        const candidates = candidatesByType[auditType] || [];
        const isCommittee = ['JOINT_AUDIT', 'TRANSFER_PRICING', 'joint_audit', 'transfer_pricing'].includes(auditType);

        if (targetOption !== 'auto') {
          // Manual assignment to chosen Team Leader
          cases.forEach(c => {
            assignments.push({
              caseId: c.id,
              teamLeaderId: targetOption,
              status: 'ASSIGNED_TO_TEAM_LEADER'
            });
          });
        } else {
          // Auto round-robin among candidates
          if (candidates.length === 0) {
            // Dynamically construct tax-center-isolated TL identifier
            const atShort = auditType.toLowerCase().includes('transfer') ? 'tp'
              : auditType.toLowerCase().includes('joint') ? 'joint'
              : auditType.toLowerCase().includes('comp') ? 'comp'
              : auditType.toLowerCase().includes('desk') ? 'desk'
              : 'issue';
            cases.forEach(c => {
              const caseTc = (c.taxCenterCode || taxCenter || user?.taxCenter || 'federal-lto1').toLowerCase().replace('tc-', '').replace('-', '_');
              const dynamicFallbackTL = `u-tl-${caseTc}-${atShort}-1`;
              assignments.push({
                caseId: c.id,
                teamLeaderId: dynamicFallbackTL,
                status: isCommittee ? 'ASSIGNED_TO_COMMITTEE' : 'ASSIGNED_TO_TEAM_LEADER'
              });
            });
          } else {
            cases.forEach(c => {
              const idx = (rrCounter[auditType] || 0) % candidates.length;
              rrCounter[auditType] = idx + 1;
              const chosen = candidates[idx];
              const tlId = chosen.username || chosen.userId || chosen.id;
              assignments.push({
                caseId: c.id,
                teamLeaderId: tlId,
                status: 'ASSIGNED_TO_TEAM_LEADER'
              });
            });
          }
        }
      }

      const res = await fetch('/api/v1/backoffice/ap/cases/bulk-assign-team-leader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': user?.username || user?.id || 'u-tc-manager'
        },
        body: JSON.stringify({ assignments })
      });

      const data = await res.json();
      if (data.status === 'ERROR' || data.error) {
        throw new Error(data.error?.message || data.message || 'Assignment failed');
      }

      setResultSummary({
        assigned: data.data?.assigned || assignments.length,
        total: assignments.length
      });

      if (onSuccess) {
        onSuccess();
      }
      window.dispatchEvent(new Event('notification-updated'));

      setTimeout(() => {
        onClose();
      }, 1200);

    } catch (err) {
      console.error('Assignment error:', err);
      setError(err.message || 'Failed to complete assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="👤 Assign Audit Cases to Team Leaders"
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-gray-500">
            {selectedCases.length} case{selectedCases.length === 1 ? '' : 's'} selected
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              icon={UserCheck}
              loading={submitting}
              onClick={handleAssign}
              disabled={selectedCases.length === 0 || loadingTLs}
            >
              Confirm Assignment
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {error && (
          <Alert type="error" title="Assignment Error">
            {error}
          </Alert>
        )}

        {resultSummary && (
          <Alert type="success" title="Assignment Succeeded">
            Successfully assigned {resultSummary.assigned} of {resultSummary.total} cases! Refreshing case list...
          </Alert>
        )}

        <div className="bg-blue-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-blue-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">
              Tax Center Case Allocation
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Assign selected backlog cases to specialized Team Leaders for audit planning & auditor allocation.
            </p>
          </div>
          <Badge color="blue" size="xs">
            {taxCenter ? (taxCenter.replace(/-/g, ' ').toUpperCase()) : 'CURRENT TC'}
          </Badge>
        </div>

        {loadingTLs ? (
          <div className="py-8 text-center text-gray-500">
            <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-blue-500" />
            <p className="text-xs">Loading eligible Team Leaders for this jurisdiction...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Distribution by Audit Stream ({Object.keys(casesByType).length} Streams)
            </p>

            {Object.entries(casesByType).map(([auditType, casesList]) => {
              const auditDef = getAuditTypeDef(auditType);
              const candidates = candidatesByType[auditType] || [];
              const isCommittee = ['JOINT_AUDIT', 'TRANSFER_PRICING', 'joint_audit', 'transfer_pricing'].includes(auditType);
              const currentValue = manualSelections[auditType] || 'auto';

              return (
                <div
                  key={auditType}
                  className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge color={auditDef?.color || 'teal'} size="xs">
                        {auditDef?.shortName || auditType.replace(/_/g, ' ')}
                      </Badge>
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                        {auditDef?.name || auditType.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500">
                      {casesList.length} case{casesList.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  {isCommittee && (
                    <p className="text-[11px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/30 px-2.5 py-1 rounded border border-purple-200 dark:border-purple-800">
                      ⚖️ <strong>Committee Governance:</strong> These cases are routed under Joint / TP committee jurisdiction.
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block mb-1">
                        Assignee Mode / Team Leader
                      </label>
                      <select
                        className="w-full text-xs rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-gray-800 dark:text-gray-100 focus:ring-1 focus:ring-blue-500"
                        value={currentValue}
                        onChange={(e) => handleSelectionChange(auditType, e.target.value)}
                      >
                        <option value="auto">
                          ⚡ Auto Balanced ({candidates.length} candidate{candidates.length === 1 ? '' : 's'})
                        </option>
                        {candidates.map(tl => (
                          <option key={tl.userId || tl.username} value={tl.username || tl.userId}>
                            {tl.fullName || tl.username} ({tl.username})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block mb-1">
                        Eligible Team Leaders Available
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {candidates.slice(0, 3).map(tl => (
                          <span
                            key={tl.userId || tl.username}
                            className="inline-block text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                          >
                            {tl.fullName || tl.username}
                          </span>
                        ))}
                        {candidates.length > 3 && (
                          <span className="text-[10px] text-gray-400 self-center">
                            +{candidates.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Cases Preview */}
        <div className="border-t border-gray-100 dark:border-slate-700 pt-3">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Selected Cases ({selectedCases.length})
          </p>
          <div className="max-h-36 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700 text-xs">
            {selectedCases.map(c => (
              <div key={c.id} className="py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{c.caseNumber}</span>
                  <span className="text-gray-800 dark:text-gray-200 truncate max-w-xs">{c.taxpayerName || c.taxpayerId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge color="gray" size="xs">Score: {c.riskScore || 0}</Badge>
                  <span className="text-gray-500 capitalize text-[11px]">{c.auditType?.replace(/_/g, ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
