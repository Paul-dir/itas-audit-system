/**
 * TeamLeaderAppointment Override Screen
 * Chairperson appoints a joint audit team leader and sees the auditor team
 */
import { useState, useMemo, useEffect, useRef } from 'react';
import { X, Users, UserCheck, ChevronRight, Search, CheckCircle, Shield, Loader2, AlertCircle, Gauge } from 'lucide-react';
import { SEED_USERS } from '../../ap/data/seed.js';
import { committeeAPI } from '../services/api';

export default function TeamLeaderAppointment({ open, onClose, caseData }) {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formedTeams, setFormedTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Fetch formed teams from backend when modal opens
  useEffect(() => {
    if (!open) return;
    const fetchTeams = async () => {
      setTeamsLoading(true);
      try {
        const teams = await committeeAPI.getTeamsForChairperson();
        setFormedTeams(Array.isArray(teams) ? teams : []);
      } catch (err) {
        console.error('[TeamLeaderAppointment] Failed to fetch formed teams:', err.message);
        setFormedTeams([]);
      } finally {
        setTeamsLoading(false);
      }
    };
    fetchTeams();
  }, [open]);

  // Safely parse auditorNames/auditorIds which may be array or string from backend
  const parseStringOrArray = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      // Backend stores as Java toString: "[Name1, Name2]"
      const cleaned = val.replace(/^\[|\]$/g, '').trim();
      if (!cleaned) return [];
      return cleaned.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  // Get auditors for the selected team
  const auditorTeam = useMemo(() => {
    if (!selectedTeam) return [];
    // Try to get from seed data first
    const teamAuditors = SEED_USERS.filter(u =>
      u.role === 'auditor' && u.teamLeader === selectedTeam.teamLeaderId
    );
    if (teamAuditors.length > 0) return teamAuditors;
    // Fallback: parse auditor names from the team record
    const names = parseStringOrArray(selectedTeam.auditorNames);
    const ids = parseStringOrArray(selectedTeam.auditorIds);
    return names.map((name, idx) => ({
      id: ids[idx] || `aud-${idx}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@mor.gov.et`,
    }));
  }, [selectedTeam]);

  // Filter teams by search
  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return formedTeams;
    const q = searchQuery.toLowerCase();
    return formedTeams.filter(t =>
      (t.teamLeaderName || '').toLowerCase().includes(q) ||
      (t.description || '').toLowerCase().includes(q)
    );
  }, [formedTeams, searchQuery]);

  // Get capacity color
  const getCapacityColor = (team) => {
    if (team.atCapacity) return 'text-red-600 dark:text-red-400';
    if (team.currentCases >= team.capacity * 0.8) return 'text-amber-600 dark:text-amber-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getCapacityBg = (team) => {
    if (team.atCapacity) return 'bg-red-100 dark:bg-red-900/30';
    if (team.currentCases >= team.capacity * 0.8) return 'bg-amber-100 dark:bg-amber-900/30';
    return 'bg-green-100 dark:bg-green-900/30';
  };

  const handleConfirm = async () => {
    if (!selectedTeam || !caseData) return;
    setLoading(true);
    setError(null);
    try {
      const caseId = caseData.committeeCaseId || caseData.id;
      if (!caseId) {
        setError('Case ID not found');
        setLoading(false);
        return;
      }
      // Check if team is at capacity
      if (selectedTeam.atCapacity) {
        setError(`Team '${selectedTeam.teamLeaderName}' has reached its capacity limit (${selectedTeam.currentCases}/${selectedTeam.capacity} cases).`);
        setLoading(false);
        return;
      }
      // Try to assign team to case
      let assignSuccess = false;
      try {
        await committeeAPI.assignTeamToCase(caseId, selectedTeam.teamId);
        assignSuccess = true;
      } catch (apiErr) {
        console.warn('[TeamLeaderAppointment] assignTeamToCase failed:', apiErr.message);
      }
      if (!assignSuccess) {
        await committeeAPI.appointTeamLead(caseId, selectedTeam.teamLeaderId, 'Appointed by chairperson');
      }
      // Show success
      if (mountedRef.current) {
        setConfirmed(true);
        setTimeout(() => {
          if (mountedRef.current) {
            setConfirmed(false);
            setSelectedTeam(null);
            setLoading(false);
            try { onClose(); } catch (e) { console.warn('onClose error:', e); }
          }
        }, 2000);
      }
    } catch (err) {
      console.error('[TeamLeaderAppointment] Failed:', err);
      if (mountedRef.current) {
        setError(err.message || 'Failed to assign team to case');
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    if (!mountedRef.current) return;
    setSelectedTeam(null);
    setSearchQuery('');
    setConfirmed(false);
    setLoading(false);
    setError(null);
    try { onClose(); } catch (e) { console.warn('onClose error:', e); }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Override Screen */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-600 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-800/50 flex items-center justify-center">
              <Users size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Assign Team to Case</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select a formed team to assign to case {caseData?.committeeCaseId || caseData?.id || 'N/A'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {confirmed ? (
            /* Confirmation Success */
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Team Assigned to Case</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                <strong>{selectedTeam?.teamLeaderName}</strong>'s team has been assigned to this case
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                {auditorTeam.length} auditor{auditorTeam.length !== 1 ? 's' : ''} assigned to team
              </p>
            </div>
          ) : !selectedTeam ? (
            /* Step 1: Select Team */
            <div className="p-6">
              {/* Search */}
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by team leader name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Teams List */}
              {teamsLoading ? (
                <div className="text-center py-8">
                  <Loader2 size={32} className="mx-auto mb-2 animate-spin text-gray-400" />
                  <p className="text-sm text-gray-500">Loading formed teams...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTeams.map((team) => (
                    <button
                      key={team.teamId}
                      onClick={() => !team.atCapacity && setSelectedTeam(team)}
                      disabled={team.atCapacity}
                      className={`w-full text-left px-4 py-4 rounded-lg border transition-all ${
                        team.atCapacity
                          ? 'border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/30 opacity-60 cursor-not-allowed'
                          : 'border-gray-200 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800/50 flex items-center justify-center flex-shrink-0">
                          <Users size={18} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{team.teamLeaderName}</p>
                            {team.atCapacity && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-bold">FULL</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{team.description || 'Audit Team'}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {parseStringOrArray(team.auditorNames).length || 0} auditor(s) in team
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          {/* Capacity Gauge */}
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCapacityBg(team)} ${getCapacityColor(team)}`}>
                            <Gauge size={12} />
                            {team.currentCases}/{team.capacity} cases
                          </div>
                          {/* Capacity Bar */}
                          <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                team.atCapacity ? 'bg-red-500' :
                                team.currentCases >= team.capacity * 0.8 ? 'bg-amber-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${(team.currentCases / team.capacity) * 100}%` }}
                            />
                          </div>
                          {!team.atCapacity && (
                            <ChevronRight size={16} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                  {filteredTeams.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Users size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No teams found</p>
                      <p className="text-xs text-gray-400 mt-1">Committee members must form teams first via Team Formation.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Step 2: Review & Confirm with Team */
            <div className="p-6">
              {/* Selected Team Summary */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-200 dark:bg-purple-700 flex items-center justify-center">
                  <UserCheck size={24} className="text-purple-700 dark:text-purple-300" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedTeam.teamLeaderName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTeam.description || 'Audit Team'}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-800/50 text-purple-700 dark:text-purple-300">
                      Team Leader
                    </span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getCapacityBg(selectedTeam)} ${getCapacityColor(selectedTeam)}`}>
                      <Gauge size={10} className="inline mr-1" />
                      {selectedTeam.currentCases}/{selectedTeam.capacity} cases
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Change
                </button>
              </div>

              {/* Capacity Warning */}
              {selectedTeam.currentCases >= selectedTeam.capacity * 0.8 && !selectedTeam.atCapacity && (
                <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                    <AlertCircle size={16} />
                    <span className="font-medium">Warning:</span>
                    <span>This team is nearing capacity ({selectedTeam.currentCases}/{selectedTeam.capacity} cases)</span>
                  </div>
                </div>
              )}

              {/* Auditor Team */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Shield size={16} />
                  Team Auditors ({auditorTeam.length} member{auditorTeam.length !== 1 ? 's' : ''})
                </h4>
                {auditorTeam.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {auditorTeam.map((auditor) => (
                      <div
                        key={auditor.id}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            {auditor.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{auditor.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{auditor.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-slate-600 rounded-lg">
                    <Users size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No auditors in this team yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!confirmed && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-600">
            {error && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}
            <div className="flex items-center justify-between">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              {selectedTeam && !selectedTeam.atCapacity && (
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="px-5 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> Assigning...</>
                  ) : (
                    <><UserCheck size={16} /> Assign {selectedTeam.teamLeaderName}'s Team</>
                  )}
                </button>
              )}
              {selectedTeam?.atCapacity && (
                <span className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                  <AlertCircle size={14} /> Team at capacity
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
