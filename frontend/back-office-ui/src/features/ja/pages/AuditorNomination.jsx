/**
 * TeamFormation Page
 * Complete Team Formation Workflow (chairperson-only):
 *   Phase 1: Select auditors from auditor pool (local state)
 *   Phase 2: Select team leaders from team leaders pool (local state)
 *   Phase 3: Form the team → calls createTeam API
 *
 * Team building is case-independent — the formed team can later be assigned to cases.
 */

import { useState, useCallback } from 'react';
import { useAuditors } from '../hooks/useAuditors';
import { committeeAPI } from '../services/api';
import {
  AlertCircle, Search, Users, UserPlus, Award,
  Loader, X, Star, Crown, Shield,
  CheckCircle, CircleDot, MapPin, Trash2, Target,
  CheckSquare, AlertTriangle,
} from 'lucide-react';
import Card from '../../../components/Card';

const EXPERTISE_OPTIONS = [
  'All', 'Corporate Tax', 'Transfer Pricing', 'International Tax',
  'VAT Compliance', 'Audit Investigation',
];
const SENIORITY_OPTIONS = ['All', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'PRINCIPAL'];

export default function TeamFormation() {
  /* ── Hook for fetching auditor & team leader pools ─────────────── */
  const {
    auditors, teamLeaders, loading, error, search, formedTeams, fetchTeams, fetchTeamLeaders,
  } = useAuditors(''); // empty caseId — we only use the pool

  /* ── Formed Team Member IDs (already in active teams) ─────────── */
  /* ── Formed Team Member IDs (already in active teams) ─────────── */
  const formedLeaderIds = new Set();
  const formedAuditorIds = new Set();
  (formedTeams || []).forEach(team => {
    if (team.teamLeaderId) {
      formedLeaderIds.add(String(team.teamLeaderId).toLowerCase().trim());
    }
    if (team.teamLeaderName) {
      formedLeaderIds.add(String(team.teamLeaderName).toLowerCase().trim());
    }
    let aids = team.auditorIds;
    if (typeof aids === 'string') {
      try {
        aids = JSON.parse(aids);
      } catch {
        aids = aids.replace(/[\[\]"]/g, '').split(',').map(s => s.trim());
      }
    }
    if (Array.isArray(aids)) {
      aids.forEach(id => {
        if (id) formedAuditorIds.add(String(id).toLowerCase().trim());
      });
    }
    let anames = team.auditorNames;
    if (typeof anames === 'string') {
      try {
        anames = JSON.parse(anames);
      } catch {
        anames = anames.replace(/[\[\]"]/g, '').split(',').map(s => s.trim());
      }
    }
    if (Array.isArray(anames)) {
      anames.forEach(name => {
        if (name) formedAuditorIds.add(String(name).toLowerCase().trim());
      });
    }
  });

  /* ── Local state for team being built ──────────────────────────── */
  const [teamAuditors, setTeamAuditors] = useState([]);      // [{id, name, email, expertise, seniority, taxCenter, reason}]
  const [teamLeader, setTeamLeader] = useState(null);         // {id, name, email, auditType, taxCenter, reason}
  const [teamCapacity, setTeamCapacity] = useState(5);
  const [teamDescription, setTeamDescription] = useState('');

  /* ── UI state ──────────────────────────────────────────────────── */
  const [expertiseFilter, setExpertiseFilter] = useState('All');
  const [seniorityFilter, setSeniorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [addReason, setAddReason] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);
  const [addRole, setAddRole] = useState('AUDITOR');
  const [formingTeam, setFormingTeam] = useState(false);
  const [teamFormed, setTeamFormed] = useState(false);
  const [formedTeam, setFormedTeam] = useState(null);
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const [showFormTeamConfirm, setShowFormTeamConfirm] = useState(false);
  const [apiError, setApiError] = useState('');

  /* ── Filtered pools (excluding already formed members) ────────── */
  const filteredAuditors = auditors.filter(a => {
    const aid = String(a.id || a.auditorId || '').toLowerCase().trim();
    const aname = String(a.name || '').toLowerCase().trim();
    if (formedAuditorIds.has(aid) || (aname && formedAuditorIds.has(aname))) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (a.name || '').toLowerCase().includes(q) ||
      (a.email || '').toLowerCase().includes(q) ||
      (a.expertise || '').toLowerCase().includes(q);
  });

  const filteredTeamLeaders = teamLeaders.filter(tl => {
    const tlid = String(tl.id || '').toLowerCase().trim();
    const tlname = String(tl.name || '').toLowerCase().trim();
    const tluname = String(tl.username || '').toLowerCase().trim();
    if (formedLeaderIds.has(tlid) || (tlname && formedLeaderIds.has(tlname)) || (tluname && formedLeaderIds.has(tluname))) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (tl.name || '').toLowerCase().includes(q) ||
      (tl.email || '').toLowerCase().includes(q) ||
      (tl.auditType || '').toLowerCase().includes(q);
  });

  /* ── Duplicate checks ──────────────────────────────────────────── */
  const isAuditorAdded = useCallback((id) => teamAuditors.some(a => a.id === id), [teamAuditors]);
  const isLeaderAdded = useCallback((id) => teamLeader?.id === id, [teamLeader]);

  /* ── Search ──────────────────────────────────────────────────── */
  const handleSearch = () => {
    const filters = {};
    if (expertiseFilter !== 'All') filters.expertise = expertiseFilter;
    if (seniorityFilter !== 'All') filters.seniority = seniorityFilter;
    search(filters);
  };

  /* ── Add auditor to team (local state) ────────────────────────── */
  const openAddModal = (member, role = 'AUDITOR') => {
    if (role === 'AUDITOR' && isAuditorAdded(member.id || member.auditorId)) {
      setDuplicateWarning('This auditor is already on the team.');
      setTimeout(() => setDuplicateWarning(''), 3000);
      return;
    }
    if (role === 'TEAM_LEADER' && isLeaderAdded(member.id)) {
      setDuplicateWarning('This team leader is already on the team.');
      setTimeout(() => setDuplicateWarning(''), 3000);
      return;
    }
    setSelectedMember(member);
    setAddReason('');
    setAddRole(role);
    setShowAddModal(true);
    setAddSuccess(false);
    setDuplicateWarning('');
  };

  const handleAddToTeam = () => {
    if (!selectedMember) return;
    const id = selectedMember.id || selectedMember.auditorId;
    const member = {
      id,
      name: selectedMember.name,
      email: selectedMember.email,
      expertise: selectedMember.expertise,
      seniority: selectedMember.seniority,
      taxCenter: selectedMember.taxCenter,
      auditType: selectedMember.auditType,
      reason: addReason,
      addedAt: new Date().toISOString(),
    };

    if (addRole === 'TEAM_LEADER') {
      setTeamLeader(member);
    } else {
      setTeamAuditors(prev => [...prev, member]);
    }

    setAddSuccess(true);
    setTimeout(() => {
      setShowAddModal(false);
      setSelectedMember(null);
      setAddSuccess(false);
    }, 1200);
  };

  /* ── Remove from team (local state) ────────────────────────────── */
  const handleRemoveAuditor = (id) => {
    setTeamAuditors(prev => prev.filter(a => a.id !== id));
  };

  const handleRemoveLeader = () => {
    setTeamLeader(null);
  };

  /* ── Form Team (API call) ────────────────────────────────────── */
  const handleFormTeam = async () => {
    if (!teamLeader || teamAuditors.length === 0) return;
    setFormingTeam(true);
    setApiError('');
    try {
      const result = await committeeAPI.createTeam({
        teamLeaderId: teamLeader.id,
        teamLeaderName: teamLeader.name,
        auditorIds: teamAuditors.map(a => a.id),
        auditorNames: teamAuditors.map(a => a.name),
        capacity: teamCapacity,
        description: teamDescription || `Team led by ${teamLeader.name}`,
      });
      setFormedTeam({
        ...result,
        teamLeaderName: teamLeader.name,
        auditorCount: teamAuditors.length,
      });
      setTeamFormed(true);
      setShowFormTeamConfirm(false);
      // Clear current selection so Chair can immediately form the next team
      setTeamAuditors([]);
      setTeamLeader(null);
      // Refresh teams and pools so formed leader and auditors immediately disappear!
      await fetchTeams();
      await search({});
      await fetchTeamLeaders();
    } catch (err) {
      setApiError(err.message || 'Failed to form team');
    }
    setFormingTeam(false);
  };

  /* ── Computed ──────────────────────────────────────────────────── */
  const canFormTeam = teamLeader && teamAuditors.length > 0;
  const progressPercent = (() => {
    let s = 0;
    if (teamAuditors.length > 0) s++;
    if (teamLeader) s++;
    return Math.round((s / 2) * 100);
  })();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Formation</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Build an audit team by selecting auditors and a team leader, then form the team.
        </p>
      </div>

      {/* Progress Bar */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center">
            <Target size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Team Formation Progress</p>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                {teamAuditors.length > 0 ? <CheckCircle size={12} className="text-green-500" /> : <CircleDot size={12} className="text-gray-400" />}
                Auditors: {teamAuditors.length}
              </span>
              <span className="flex items-center gap-1">
                {teamLeader ? <CheckCircle size={12} className="text-green-500" /> : <CircleDot size={12} className="text-gray-400" />}
                Team Leader: {teamLeader ? teamLeader.name : 'Not selected'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Warnings / Errors */}
      {duplicateWarning && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-amber-800 dark:text-amber-200">{duplicateWarning}</p>
        </div>
      )}
      {(error || apiError) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
          <p className="text-sm text-red-900 dark:text-red-100">{apiError || error}</p>
        </div>
      )}

      {/* Team Formed Success */}
      {teamFormed && formedTeam && (
        <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
              <CheckCircle size={28} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-900 dark:text-green-100">Team Formed Successfully!</h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Team <span className="font-semibold">{formedTeam.teamLeaderName}</span> created with {formedTeam.auditorCount || 5} auditor(s).
                Capacity: {formedTeam.capacity || teamCapacity} cases. The selected members have been assigned and removed from the candidate pool.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Formed Teams Overview */}
      {formedTeams && formedTeams.length > 0 && (
        <Card className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-gray-900 dark:text-white text-base">
                Formed Audit Teams ({formedTeams.length})
              </h3>
            </div>
            <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-100 dark:bg-emerald-900/50 px-2.5 py-1 rounded-full">
              Active in Tax Center
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formedTeams.map((t, idx) => {
              let names = t.auditorNames;
              if (typeof names === 'string') {
                try { names = JSON.parse(names); } catch { names = names.replace(/[\[\]"]/g, '').split(',').map(s => s.trim()); }
              }
              return (
                <div key={t.teamId || idx} className="p-3.5 bg-white dark:bg-gray-800 rounded-lg border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 text-sm">
                      <Crown size={15} className="text-amber-500" />
                      {t.teamLeaderName || 'Team Leader'}
                    </span>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-medium">
                      Capacity: {t.capacity} cases
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">
                    Assigned Auditors ({Array.isArray(names) ? names.length : 0}):
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(names) && names.map((name, i) => (
                      <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Search & Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Search Auditor Pool</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search by name, email, or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={expertiseFilter}
            onChange={(e) => setExpertiseFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {EXPERTISE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <div className="flex gap-2">
            <select
              value={seniorityFilter}
              onChange={(e) => setSeniorityFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {SENIORITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <button onClick={handleSearch} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">Search</button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── Main Content (2/3) ─── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Phase 1: Auditor Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2 border-b-2 border-blue-200 dark:border-blue-800 pb-2">
              <span className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded text-sm">Phase 1</span>
              <Users size={20} />
              Add Auditors to Team
              {teamAuditors.length > 0 && (
                <span className="ml-auto bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {teamAuditors.length} added
                </span>
              )}
            </h3>

            {loading && filteredAuditors.length === 0 && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </Card>
                ))}
              </div>
            )}

            {!loading && filteredAuditors.length === 0 && (
              <Card className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No auditors found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search filters.</p>
              </Card>
            )}

            {filteredAuditors.map((auditor) => {
              const aid = auditor.id || auditor.auditorId;
              const added = isAuditorAdded(aid);
              return (
                <Card key={aid} className={`p-4 transition-all ${added ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'hover:shadow-md'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${added ? 'bg-green-100 dark:bg-green-900/40' : 'bg-blue-100 dark:bg-blue-900/40'}`}>
                      {added ? <CheckCircle size={20} className="text-green-600 dark:text-green-400" /> : (
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {(auditor.name || 'U').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{auditor.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{auditor.email}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {auditor.expertise && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200 rounded text-xs font-medium">
                            <Award size={12} /> {auditor.expertise}
                          </span>
                        )}
                        {auditor.seniority && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                            <Star size={12} /> {auditor.seniority}
                          </span>
                        )}
                        {auditor.taxCenter && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 rounded text-xs font-medium">
                            <MapPin size={12} /> {auditor.taxCenter.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {added ? (
                        <span className="flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs font-medium">
                          <CheckCircle size={14} /> Added
                        </span>
                      ) : (
                        <button
                          onClick={() => openAddModal(auditor, 'AUDITOR')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium flex-shrink-0"
                        >
                          <UserPlus size={14} /> Add to Team
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Phase 2: Team Leader Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-purple-700 dark:text-purple-400 flex items-center gap-2 border-b-2 border-purple-200 dark:border-purple-800 pb-2">
              <span className="bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded text-sm">Phase 2</span>
              <Crown size={20} />
              Add Team Leader
              {teamLeader && (
                <span className="ml-auto bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle size={10} /> {teamLeader.name}
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select a team leader from the pool. Only one team leader can be selected per team.
            </p>

            {filteredTeamLeaders.length === 0 && !loading && (
              <Card className="p-6 text-center">
                <Crown className="w-8 h-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">No team leaders found.</p>
              </Card>
            )}

            {filteredTeamLeaders.map((leader) => {
              const isSelected = teamLeader?.id === leader.id;
              return (
                <Card key={leader.id} className={`p-4 transition-all border-l-4 ${
                  isSelected
                    ? 'border-l-green-500 bg-green-50 dark:bg-green-900/10 ring-2 ring-green-400'
                    : 'border-l-purple-400 dark:border-l-purple-600 hover:shadow-md'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-green-100 dark:bg-green-900/40' : 'bg-purple-100 dark:bg-purple-900/40'}`}>
                      {isSelected ? <CheckCircle size={20} className="text-green-600 dark:text-green-400" /> : <Crown size={20} className="text-purple-600 dark:text-purple-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{leader.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{leader.email}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {leader.auditType && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200 rounded text-xs font-medium">
                            <Award size={12} /> {leader.auditType.replace(/_/g, ' ')}
                          </span>
                        )}
                        {leader.taxCenter && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 rounded text-xs font-medium">
                            <Crown size={12} /> {leader.taxCenter.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected ? (
                      <span className="flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs font-semibold">
                        <CheckCircle size={14} /> Selected
                      </span>
                    ) : (
                      <button
                        onClick={() => openAddModal(leader, 'TEAM_LEADER')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium flex-shrink-0"
                      >
                        <Crown size={14} /> Add as Team Leader
                      </button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* ─── Right Sidebar: Team Summary (1/3) ─── */}
        <div className="space-y-6">
          {/* Selected Auditors */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UserPlus size={20} className="text-blue-600" />
              Team Auditors ({teamAuditors.length})
            </h3>
            {teamAuditors.length === 0 && (
              <Card className="p-6 text-center">
                <UserPlus className="w-8 h-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">No auditors added yet</p>
                <p className="text-xs text-gray-500 mt-1">Click "Add to Team" on an auditor above.</p>
              </Card>
            )}
            {teamAuditors.map((a) => (
              <Card key={a.id} className="p-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {(a.name || 'U').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{a.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{a.expertise || 'Auditor'} · {a.seniority || ''}</p>
                    {a.reason && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 italic truncate">"{a.reason}"</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveAuditor(a.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                    title="Remove from team"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Selected Team Leader */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Crown size={20} className="text-purple-600" />
              Team Leader
            </h3>
            {!teamLeader && (
              <Card className="p-6 text-center">
                <Crown className="w-8 h-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">No team leader added yet</p>
                <p className="text-xs text-gray-500 mt-1">Click "Add as Team Leader" above.</p>
              </Card>
            )}
            {teamLeader && (
              <Card className="p-3 ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{teamLeader.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{teamLeader.auditType?.replace(/_/g, ' ') || 'Team Leader'}</p>
                    {teamLeader.reason && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 italic truncate">"{teamLeader.reason}"</p>
                    )}
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-semibold">
                      <CheckCircle size={12} /> Confirmed
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveLeader}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                    title="Remove team leader"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </Card>
            )}
          </div>

          {/* Phase 3: Form Team */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b-2 border-green-200 dark:border-green-800 pb-2">
              <span className="bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded text-sm">Phase 3</span>
              <Shield size={20} />
              Form Team
            </h3>

            {teamFormed && formedTeam ? (
              <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle size={20} className="text-green-600" />
                  <p className="text-sm font-bold text-green-800 dark:text-green-200">Team Formed</p>
                </div>
                <div className="space-y-2 text-xs text-green-700 dark:text-green-300">
                  <p><span className="font-semibold">Leader:</span> {formedTeam.teamLeaderName}</p>
                  <p><span className="font-semibold">Auditors:</span> {teamAuditors.length}</p>
                  <p><span className="font-semibold">Capacity:</span> {formedTeam.capacity || teamCapacity} cases</p>
                </div>
              </Card>
            ) : (
              <>
                <Card className="p-4 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Team Capacity</label>
                    <select
                      value={teamCapacity}
                      onChange={(e) => setTeamCapacity(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    >
                      {[2, 3, 4, 5, 6, 8, 10].map(n => (
                        <option key={n} value={n}>{n} cases max</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Description (optional)</label>
                    <input
                      type="text"
                      value={teamDescription}
                      onChange={(e) => setTeamDescription(e.target.value)}
                      placeholder="e.g. Corporate Tax Audit Team"
                      className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-500"
                    />
                  </div>
                </Card>

                <Card className="p-4">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Requirements to Form Team:</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      {teamAuditors.length > 0
                        ? <CheckCircle size={14} className="text-green-500" />
                        : <CircleDot size={14} className="text-gray-400" />}
                      <span className={teamAuditors.length > 0 ? 'text-green-700 dark:text-green-300' : 'text-gray-500'}>
                        At least 1 auditor ({teamAuditors.length} added)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {teamLeader
                        ? <CheckCircle size={14} className="text-green-500" />
                        : <CircleDot size={14} className="text-gray-400" />}
                      <span className={teamLeader ? 'text-green-700 dark:text-green-300' : 'text-gray-500'}>
                        {teamLeader ? `Team leader: ${teamLeader.name}` : 'Select a team leader'}
                      </span>
                    </div>
                  </div>
                </Card>

                <button
                  onClick={() => setShowFormTeamConfirm(true)}
                  disabled={!canFormTeam || formingTeam}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                    canFormTeam
                      ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/20'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {formingTeam ? <><Loader size={16} className="animate-spin" /> Forming Team...</> : <><CheckSquare size={16} /> Form Team</>}
                </button>
                {!canFormTeam && (
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    Add at least 1 auditor and select a team leader to form the team.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── Form Team Confirmation Modal ─── */}
      {showFormTeamConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFormTeamConfirm(false)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-600 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-800/50 flex items-center justify-center">
                  <CheckSquare size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Team Formation</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Review and confirm your team</p>
                </div>
              </div>
              <button onClick={() => setShowFormTeamConfirm(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {teamLeader && (
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">Team Leader</p>
                  <div className="flex items-center gap-2">
                    <Crown size={16} className="text-purple-600" />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{teamLeader.name}</span>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">Auditors ({teamAuditors.length})</p>
                <div className="space-y-1.5">
                  {teamAuditors.map((a) => (
                    <div key={a.id} className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                      <CheckCircle size={14} className="text-blue-500 flex-shrink-0" />
                      <span>{a.name}</span>
                      <span className="text-xs text-gray-500">· {a.expertise}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600">
                <span className="text-sm text-gray-600 dark:text-gray-300">Max concurrent cases:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{teamCapacity}</span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-600 flex items-center justify-end gap-3">
              <button onClick={() => setShowFormTeamConfirm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                onClick={handleFormTeam}
                disabled={formingTeam}
                className="px-5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {formingTeam ? <Loader size={16} className="animate-spin" /> : <CheckSquare size={16} />}
                {formingTeam ? 'Forming...' : 'Confirm & Form Team'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add to Team Modal ─── */}
      {showAddModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-600 bg-gradient-to-r ${
              addRole === 'TEAM_LEADER' ? 'from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30' : 'from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${addRole === 'TEAM_LEADER' ? 'bg-purple-100 dark:bg-purple-800/50' : 'bg-blue-100 dark:bg-blue-800/50'}`}>
                  {addRole === 'TEAM_LEADER' ? <Crown size={20} className="text-purple-600 dark:text-purple-400" /> : <UserPlus size={20} className="text-blue-600 dark:text-blue-400" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {addRole === 'TEAM_LEADER' ? 'Add Team Leader to Team' : 'Add Auditor to Team'}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedMember.name}</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              {addSuccess ? (
                <div className="flex flex-col items-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <Award size={32} className="text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {addRole === 'TEAM_LEADER' ? 'Team Leader Added' : 'Added to Team'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{selectedMember.name} has been added to the team</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 mb-5">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${addRole === 'TEAM_LEADER' ? 'bg-purple-100 dark:bg-purple-900/40' : 'bg-blue-100 dark:bg-blue-900/40'}`}>
                      {addRole === 'TEAM_LEADER' ? <Crown size={20} className="text-purple-600 dark:text-purple-400" /> : (
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {(selectedMember.name || 'U').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedMember.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{selectedMember.email}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {selectedMember.expertise && (
                          <span className="inline-block px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200 rounded text-xs font-medium">{selectedMember.expertise}</span>
                        )}
                        {selectedMember.taxCenter && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 rounded text-xs font-medium">
                            <MapPin size={10} /> {selectedMember.taxCenter.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${addRole === 'TEAM_LEADER' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200'}`}>
                      {addRole === 'TEAM_LEADER' ? <Crown size={12} /> : <UserPlus size={12} />}
                      {addRole === 'TEAM_LEADER' ? 'Team Leader' : 'Auditor'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Reason</label>
                    <textarea
                      value={addReason}
                      onChange={(e) => setAddReason(e.target.value)}
                      rows={4}
                      placeholder={addRole === 'TEAM_LEADER' ? 'Explain why this person should lead the audit team...' : 'Explain why this auditor is a good fit for the audit team...'}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400"
                    />
                  </div>
                </>
              )}
            </div>

            {!addSuccess && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-600 flex items-center justify-end gap-3">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
                <button
                  onClick={handleAddToTeam}
                  className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2 ${addRole === 'TEAM_LEADER' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  <UserPlus size={16} /> Add to Team
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
