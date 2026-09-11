/**
 * Committee API Service
 * Complete backend API integration for all JAC (Joint Audit Committee) features.
 * Covers all 6 backend controllers:
 *   1. CommitteeWorkspaceController  (dashboard, cases, voting, ownership)
 *   2. CommitteeResearchController   (research notes, comments, attachments, feed)
 *   3. CommitteeAuditorController    (nominations, search, profiles)
 *   4. CommitteeChairpersonController(team lead, viability, team, handoff, SLA)
 *   5. CommitteeSessionController    (sessions, attendees)
 *   6. CommitteeAuditTrailController (audit logs, export)
 */

const API_BASE = '/api/v1/backoffice/ap/committee';

function getHeaders() {
  const token = localStorage.getItem('authToken');
  // Get the current user's ID from the session to pass as X-Actor-Id
  const session = JSON.parse(localStorage.getItem('mor_aps_session') || '{}');
  const userId = session?.id || '';
  
  // Map frontend user IDs to backend UUIDs
  const idMap = {
    'u-tl-aa1a': '10000000-0000-0000-0000-000000000001',
    'u-tl-aa3a': '10000000-0000-0000-0000-000000000002',
    'u-tl-aa2a': '10000000-0000-0000-0000-000000000007',
    'u-tl-or1a': '10000000-0000-0000-0000-000000000017',
    'u-cc-aa1': '10000000-0000-0000-0000-000000000005',
    'u-cc-aa2': '10000000-0000-0000-0000-000000000006',
    'u-cc-aa3': '10000000-0000-0000-0000-000000000008',
    'u-cc-or1': '10000000-0000-0000-0000-000000000016',
    'u-cm-aa1': '20000000-0000-0000-0000-000000000001',
    'u-cm-aa2': '20000000-0000-0000-0000-000000000002',
    'u-cm-aa3': '20000000-0000-0000-0000-000000000003',
    'u-cm-or1': '20000000-0000-0000-0000-000000000004',
    // Addis Ababa TC1 Joint Audit Team
    'aa1.chair': '20000000-0000-0000-0001-000000000001',
    'aa1.member': '20000000-0000-0000-0001-000000000002',
    'aa1.tl': '10000000-0000-0000-0001-000000000001',
    'aa1.tl2': '10000000-0000-0000-0001-000000000002',
    // Federal LTO1 Joint Audit Team
    'fed.ja.chair': '20000000-0000-0000-0099-000000000001',
    'fed.ja.member': '20000000-0000-0000-0099-000000000002',
    'fed.ja.tl': '10000000-0000-0000-0099-000000000001',
    'fed.ja.tl2': '10000000-0000-0000-0099-000000000002',
    // Federal LTO2 Joint Audit Team
    'fed2.ja.chair': '20000000-0000-0000-0098-000000000001',
    'fed2.ja.member': '20000000-0000-0000-0098-000000000002',
    'fed2.ja.tl': '10000000-0000-0000-0098-000000000001',
    'fed2.ja.tl2': '10000000-0000-0000-0098-000000000002',
  };
  const actorId = idMap[userId] || userId;
  
  return {
    'Content-Type': 'application/json',
    'X-Actor-Id': actorId,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

function buildParams(obj) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.append(k, v);
  });
  return params;
}

/* ------------------------------------------------------------------ */
/*  1. Workspace – Dashboard, Cases, Voting, Ownership                 */
/* ------------------------------------------------------------------ */
export const committeeAPI = {
  // ── Dashboard ──────────────────────────────────────────────────────
  getDashboard: async (taxCenter) => {
    const params = taxCenter ? `?taxCenter=${encodeURIComponent(taxCenter)}` : '';
    const res = await fetch(`${API_BASE}/dashboard${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
    return res.json();
  },

  // ── Cases ──────────────────────────────────────────────────────────
  getCases: async (page = 0, size = 25, filters = {}) => {
    const params = buildParams({ page, size, ...filters });
    const res = await fetch(`${API_BASE}/cases?${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch cases');
    return res.json();
  },

  getCaseDetail: async (caseId) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch case detail');
    return res.json();
  },

  // ── Ownership ──────────────────────────────────────────────────────
  takeOwnership: async (caseId) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/take-ownership`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to take ownership');
    return res.json();
  },

  releaseOwnership: async (caseId) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/release-ownership`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to release ownership');
    return res.json();
  },

  // ── Voting ─────────────────────────────────────────────────────────
  castVote: async (caseId, voteOption) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/votes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ voteOption }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.message || body?.error || `Failed to cast vote (${res.status})`);
    }
    return res.json();
  },

  getVoteTally: async (caseId) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/vote-tally`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch vote tally');
    return res.json();
  },

  getVoteHistory: async (caseId, page = 0, size = 25) => {
    const params = buildParams({ page, size });
    const res = await fetch(`${API_BASE}/cases/${caseId}/vote-history?${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch vote history');
    return res.json();
  },

  /* ---------------------------------------------------------------- */
  /*  2. Research – Notes, Comments, Attachments, Feed                 */
  /* ---------------------------------------------------------------- */

  addResearchNote: async (caseId, { content, category }) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/research-notes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content, category }),
    });
    if (!res.ok) throw new Error('Failed to add research note');
    return res.json();
  },

  getResearchNotes: async (caseId, page = 0, size = 25) => {
    const params = buildParams({ page, size });
    const res = await fetch(`${API_BASE}/cases/${caseId}/research-notes?${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch research notes');
    return res.json();
  },

  addComment: async (noteId, { content }) => {
    const res = await fetch(`${API_BASE}/research-notes/${noteId}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error('Failed to add comment');
    return res.json();
  },

  getComments: async (noteId, page = 0, size = 25) => {
    const params = buildParams({ page, size });
    const res = await fetch(`${API_BASE}/research-notes/${noteId}/comments?${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
  },

  uploadAttachment: async (noteId, file, description = '') => {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('file', file);
    if (description) formData.append('description', description);
    const res = await fetch(`${API_BASE}/research-notes/${noteId}/attachments`, {
      method: 'POST',
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload attachment');
  },

  getResearchFeed: async (caseId, page = 0, size = 25) => {
    const params = buildParams({ page, size });
    const res = await fetch(`${API_BASE}/cases/${caseId}/research-feed?${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch research feed');
    return res.json();
  },

  downloadAttachment: async (documentId) => {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE}/attachments/${documentId}`, {
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    });
    if (!res.ok) throw new Error('Failed to download attachment');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attachment-${documentId}`;
    a.click();
    URL.revokeObjectURL(url);
  },

  /* ---------------------------------------------------------------- */
  /*  3. Auditor – Nomination, Search, Profile                         */
  /* ---------------------------------------------------------------- */

  nominateAuditor: async (caseId, { auditorId, reason, role }) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/nominate-auditor`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ auditorId, justification: reason, role: role || 'AUDITOR' }),
    });
    if (!res.ok) throw new Error('Failed to nominate auditor');
    return res.json();
  },

  getNominations: async (caseId, page = 0, size = 25) => {
    const params = buildParams({ page, size });
    const res = await fetch(`${API_BASE}/cases/${caseId}/nominations?${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch nominations');
    const data = await res.json();
    // Normalize nomination fields for frontend consumption
    if (data.content) {
      data.content = data.content.map(n => ({
        ...n,
        reason: n.justification,
      }));
    }
    return data;
  },

  searchAuditors: async (filters = {}, page = 0, size = 25) => {
    const params = buildParams({ page, size, ...filters });
    const res = await fetch(`${API_BASE}/auditors/search?${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to search auditors');
    const data = await res.json();
    // Normalize auditor fields so frontend components can use id, name, email
    if (data.content) {
      data.content = data.content.map(a => ({
        ...a,
        id: a.auditorId,
        name: [a.firstName, a.lastName].filter(Boolean).join(' '),
        email: `${(a.firstName || '').toLowerCase()}.${(a.lastName || '').toLowerCase().replace(/\s+/g, '')}@mor.gov.et`,
      }));
    }
    return data;
  },

  searchTeamLeaders: async (filters = {}) => {
    const params = buildParams(filters);
    const res = await fetch(`${API_BASE}/auditors/team-leaders?${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to search team leaders');
    return res.json();
  },

  /**
   * Search auditors filtered by the current user's tax center.
   * Convenience wrapper that automatically adds the taxCenter param.
   */
  searchAuditorsByTaxCenter: async (taxCenter, filters = {}, page = 0, size = 25) => {
    const params = buildParams({ page, size, taxCenter, ...filters });
    const res = await fetch(`${API_BASE}/auditors/search?${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to search auditors');
    const data = await res.json();
    if (data.content) {
      data.content = data.content.map(a => ({
        ...a,
        id: a.auditorId,
        name: [a.firstName, a.lastName].filter(Boolean).join(' '),
        email: `${(a.firstName || '').toLowerCase()}.${(a.lastName || '').toLowerCase().replace(/\s+/g, '')}@mor.gov.et`,
      }));
    }
    return data;
  },

  /**
   * Search team leaders filtered by the current user's tax center.
   * Convenience wrapper that automatically adds the taxCenter param.
   */
  searchTeamLeadersByTaxCenter: async (taxCenter, filters = {}) => {
    const params = buildParams({ taxCenter, ...filters });
    const res = await fetch(`${API_BASE}/auditors/team-leaders?${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to search team leaders');
    return res.json();
  },

  getAuditorProfile: async (auditorId) => {
    const res = await fetch(`${API_BASE}/auditors/${auditorId}/profile`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch auditor profile');
    return res.json();
  },

  // ── Team Leader Nominations ──────────────────────────────────────────

  getTeamLeaderNominations: async (caseId) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/team-leader-nominations`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch team leader nominations');
    return res.json();
  },

  getAuditorNominations: async (caseId) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/auditor-nominations`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch auditor nominations');
    return res.json();
  },

  removeNomination: async (caseId, nominationId) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/nominations/${nominationId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to remove nomination');
    return res.json();
  },

  checkNomination: async (caseId, auditorId) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/nominations/check/${auditorId}`, { headers: getHeaders() });
    if (!res.ok) return { nominated: false };
    return res.json();
  },

  selectTeamLeader: async (caseId, nominationId) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/select-team-leader`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ nominationId }),
    });
    if (!res.ok) throw new Error('Failed to select team leader');
    return res.json();
  },

  assignAuditorToCase: async (caseId, { auditorId, teamLeaderId }) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/assign-auditor-to-case`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ auditorId, teamLeaderId: teamLeaderId || '' }),
    });
    if (!res.ok) throw new Error('Failed to assign auditor to case');
    return res.json();
  },

  // ── Team Formation & Capacity ────────────────────────────────────────

  createTeam: async ({ teamLeaderId, teamLeaderName, auditorIds, auditorNames, capacity, description }) => {
    const res = await fetch(`${API_BASE}/teams`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ teamLeaderId, teamLeaderName, auditorIds, auditorNames, capacity, description }),
    });
    if (!res.ok) throw new Error('Failed to create team');
    return res.json();
  },

  getTeams: async () => {
    const res = await fetch(`${API_BASE}/teams`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch teams');
    return res.json();
  },

  getAvailableTeams: async () => {
    const res = await fetch(`${API_BASE}/teams/available`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch available teams');
    return res.json();
  },

  getTeamsForChairperson: async () => {
    const res = await fetch(`${API_BASE}/teams/chairperson`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch teams for chairperson');
    return res.json();
  },

  assignTeamToCase: async (caseId, teamId) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/assign-team-from-list`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ teamId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to assign team to case');
    }
    return res.json();
  },

  getTeamCapacity: async (teamId) => {
    const res = await fetch(`${API_BASE}/teams/${teamId}/capacity`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch team capacity');
    return res.json();
  },

  getCapacityOverview: async () => {
    const res = await fetch(`${API_BASE}/teams/capacity-overview`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch capacity overview');
    return res.json();
  },

  /* ---------------------------------------------------------------- */
  /*  4. Chairperson – Team Lead, Viability, Team, Handoff, SLA       */
  /* ---------------------------------------------------------------- */

  appointTeamLead: async (caseId, auditorId, reason) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/appoint-team-lead`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ auditorId, reason }),
    });
    if (!res.ok) throw new Error('Failed to appoint team lead');
    return res.json();
  },

  finalizeViability: async (caseId, decision, reason, digitalSignature) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/finalize-viability`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ decision, reason, digitalSignature }),
    });
    if (!res.ok) throw new Error('Failed to finalize viability');
    return res.json();
  },

  assignTeam: async (caseId, auditorIds) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/assign-team`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ auditorIds }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to assign team');
    }
    return res.json();
  },

  transferToExecution: async (caseId, { teamLeaderId, teamMemberIds, committeeSummary }) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/transfer-to-execution`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ teamLeaderId, teamMemberIds, committeeSummary }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to transfer to execution');
    }
    return res.json();
  },

  // ── Legal Actions ────────────────────────────────────────────────────

  sendReport: async (caseId, notes = '') => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/send-report`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ notes }),
    });
    if (!res.ok) throw new Error('Failed to send report');
    return res.json();
  },

  escalateFraud: async (caseId, reason = '') => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/escalate-fraud`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw new Error('Failed to escalate fraud');
    return res.json();
  },

  publishAssessment: async (caseId, notes = '') => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/publish-assessment`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ notes }),
    });
    if (!res.ok) throw new Error('Failed to publish assessment');
    return res.json();
  },

  overrideSLA: async (caseId, { extensionBusinessDays, reason }) => {
    const res = await fetch(`${API_BASE}/cases/${caseId}/override-sla`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ extensionBusinessDays, reason }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to override SLA');
    }
    return res.json();
  },

  /* ---------------------------------------------------------------- */
  /*  5. Sessions – Create, List, Attendees                            */
  /* ---------------------------------------------------------------- */

  createSession: async ({ sessionName, agenda, scheduledDate, caseId }) => {
    const res = await fetch(`${API_BASE}/sessions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ sessionName, agenda, scheduledDate, caseId }),
    });
    if (!res.ok) throw new Error('Failed to create session');
    return res.json();
  },

  listSessions: async (page = 0, size = 25) => {
    const params = buildParams({ page, size });
    const res = await fetch(`${API_BASE}/sessions?${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch sessions');
    return res.json();
  },

  getSession: async (sessionId) => {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch session');
    return res.json();
  },

  addAttendees: async (sessionId, { memberIds }) => {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}/attendees`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ memberIds }),
    });
    if (!res.ok) throw new Error('Failed to add attendees');
    return res.json();
  },

  getAttendees: async (sessionId, page = 0, size = 50) => {
    const params = buildParams({ page, size });
    const res = await fetch(`${API_BASE}/sessions/${sessionId}/attendees?${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch attendees');
    return res.json();
  },

  /* ---------------------------------------------------------------- */
  /*  6. Audit Trail – Case Trail, Global Trail, Export                */
  /* ---------------------------------------------------------------- */

  getCaseAuditTrail: async (caseId, page = 0, size = 25) => {
    const params = buildParams({ page, size });
    const res = await fetch(`${API_BASE}/cases/${caseId}/audit-trail?${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch case audit trail');
    return res.json();
  },

  getGlobalAuditTrail: async (filters = {}, page = 0, size = 25) => {
    const params = buildParams({ page, size, ...filters });
    const res = await fetch(`${API_BASE}/audit-trail?${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch audit trail');
    return res.json();
  },

  exportAuditTrail: async (caseId, format = 'csv') => {
    const params = buildParams({ caseId, format });
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE}/audit-trail/export?${params}`, {
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    });
    if (!res.ok) throw new Error('Failed to export audit trail');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-trail.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  },
};

export default committeeAPI;
