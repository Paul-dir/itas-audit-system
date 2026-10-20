/**
 * useCommitteeSSE Hook
 * Provides a React-friendly interface for subscribing to real-time SSE events.
 *
 * Usage:
 *   // Global dashboard stream — activity feed
 *   useCommitteeSSE({
 *     onActivity: (data) => setActivity(prev => [data, ...prev]),
 *     onVoteCast: (data) => refreshMetrics(),
 *   });
 *
 *   // Per-case stream — live vote tally
 *   useCommitteeSSE({
 *     caseId: 'uuid-here',
 *     onVoteTallyUpdated: (tally) => setVoteTally(tally),
 *     onOwnershipChanged: (data) => refreshCase(),
 *   });
 */

import { useEffect, useRef, useCallback } from 'react';
import { committeeSSE } from '../services/sse';

/**
 * @param {Object} options
 * @param {string}  [options.caseId]                - If set, subscribes to case-specific stream
 * @param {Function} [options.onVoteTallyUpdated]   - Vote tally updated for a case
 * @param {Function} [options.onVoteCast]            - Any vote cast (global)
 * @param {Function} [options.onOwnershipChanged]    - Ownership taken/released
 * @param {Function} [options.onResearchNoteAdded]   - New research note
 * @param {Function} [options.onCaseStatusChanged]   - Case lifecycle transition
 * @param {Function} [options.onAuditorNominated]    - Auditor nominated
 * @param {Function} [options.onActivity]            - Generic activity stream event
 * @param {Function} [options.onConnected]           - Connection established
 * @param {Function} [options.onError]               - Connection error
 */
export function useCommitteeSSE(options = {}) {
  const {
    caseId,
    onVoteTallyUpdated,
    onVoteCast,
    onOwnershipChanged,
    onResearchNoteAdded,
    onCaseStatusChanged,
    onAuditorNominated,
    onActivity,
    onConnected,
    onError,
  } = options;

  // Use refs to avoid stale closures in SSE callbacks
  const callbacksRef = useRef({});
  callbacksRef.current = {
    onVoteTallyUpdated,
    onVoteCast,
    onOwnershipChanged,
    onResearchNoteAdded,
    onCaseStatusChanged,
    onAuditorNominated,
    onActivity,
    onConnected,
    onError,
  };

  useEffect(() => {
    const unsubs = [];

    const makeHandler = (callbackKey) => (data) => {
      const fn = callbacksRef.current[callbackKey];
      if (fn) fn(data);
    };

    if (caseId) {
      // ── Case-specific stream ──────────────────────────────────────
      const unsub = committeeSSE.subscribeCase(caseId, {
        connected: makeHandler('onConnected'),
        vote_tally_updated: makeHandler('onVoteTallyUpdated'),
        ownership_changed: makeHandler('onOwnershipChanged'),
        research_note_added: makeHandler('onResearchNoteAdded'),
        case_status_changed: makeHandler('onCaseStatusChanged'),
        auditor_nominated: makeHandler('onAuditorNominated'),
      });
      unsubs.push(unsub);
    } else {
      // ── Global stream (dashboard) ─────────────────────────────────
      const unsub = committeeSSE.subscribeGlobal({
        connected: makeHandler('onConnected'),
        vote_cast: makeHandler('onVoteCast'),
        activity: makeHandler('onActivity'),
        case_status_changed: makeHandler('onCaseStatusChanged'),
      });
      unsubs.push(unsub);
    }

    // Monitor connection state
    const unsubState = committeeSSE.onStateChange((state) => {
      if (state === 'disconnected' && callbacksRef.current.onError) {
        callbacksRef.current.onError('Connection lost. Reconnecting...');
      }
    });
    unsubs.push(unsubState);

    // Cleanup on unmount
    return () => {
      unsubs.forEach(fn => fn());
    };
  }, [caseId]); // Re-subscribe only when caseId changes

  return {
    connectionState: committeeSSE.state,
  };
}
