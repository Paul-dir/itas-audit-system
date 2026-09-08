// Committee Feature Exports — Full JAC Frontend

// ── Pages ──────────────────────────────────────────────────────────────
export { default as CommitteeDashboard } from './pages/CommitteeDashboard';
export { default as CommitteeCases } from './pages/CommitteeCases';
export { default as CaseDetail } from './pages/CaseDetail';
export { default as ResearchWorkspace } from './pages/ResearchWorkspace';
export { default as AuditorNomination } from './pages/AuditorNomination';  // TeamFormation component
export { default as SessionManager } from './pages/SessionManager';
export { default as AuditTrail } from './pages/AuditTrail';

// ── Components ─────────────────────────────────────────────────────────
export { default as MetricCard } from './components/MetricCard';
export { default as StatusBadge } from './components/StatusBadge';
export { default as LoadingSpinner } from './components/LoadingSpinner';
export { default as ErrorAlert } from './components/ErrorAlert';
export { default as ExecutiveViability } from './components/ExecutiveViability';
export { default as TeamLeaderAppointment } from './components/TeamLeaderAppointment';
export { default as CommitteeRoleGate, useCommitteeRole } from './components/CommitteeRoleGate';
export { default as RichTextEditor } from './components/RichTextEditor';

// ── Hooks ──────────────────────────────────────────────────────────────
export { useDashboard } from './hooks/useDashboard';
export { useCases } from './hooks/useCases';
export { useVoting } from './hooks/useVoting';
export { useOwnership } from './hooks/useOwnership';
export { useResearch } from './hooks/useResearch';
export { useAuditors } from './hooks/useAuditors';
export { useChairperson } from './hooks/useChairperson';
export { useSessions } from './hooks/useSessions';
export { useAuditTrail } from './hooks/useAuditTrail';
export { useCommitteeSSE } from './hooks/useCommitteeSSE';

// ── Context ────────────────────────────────────────────────────────────
export { CommitteeProvider, useCommitteeContext } from './context/CommitteeContext';

// ── API Service ────────────────────────────────────────────────────────
export { committeeAPI } from './services/api';
export { committeeSSE } from './services/sse';
