/**
 * useChairpersonPanel Hook
 * Manages all chairperson command panel state:
 *   - Active modal/screen tracking
 *   - SLA override flow
 *   - Legal action flows (report, fraud, assessment)
 *   - Accessible status announcements for screen readers
 */

import { useState, useCallback, useRef } from 'react';
import { committeeAPI } from '../services/api';
import { useChairperson } from './useChairperson';

/**
 * @returns {{
 *   // Modal visibility
 *   showTeamLeaderAppointment: boolean,
 *   showExecutiveViability: boolean,
 *   showSLAOverride: boolean,
 *   legalAction: null | 'report' | 'fraud' | 'assessment',
 *   // Legal action state
 *   legalNotes: string,
 *   legalLoading: boolean,
 *   legalResult: object | null,
 *   // SLA override state
 *   slaExtensionDays: number,
 *   slaReason: string,
 *   slaLoading: boolean,
 *   slaResult: object | null,
 *   // Announcer for screen readers
 *   announceRef: React.RefObject,
 *   announce: (msg: string) => void,
 *   // Actions
 *   openTeamLeader: () => void,
 *   closeTeamLeader: () => void,
 *   openViability: () => void,
 *   closeViability: () => void,
 *   openSLAOverride: () => void,
 *   closeSLAOverride: () => void,
 *   setLegalAction: (action: string | null) => void,
 *   setLegalNotes: (notes: string) => void,
 *   handleLegalAction: (caseId: string) => Promise<void>,
 *   clearLegalResult: () => void,
 *   setSlaExtensionDays: (days: number) => void,
 *   setSlaReason: (reason: string) => void,
 *   handleSLAOverride: (caseId: string) => Promise<void>,
 *   clearSLAResult: () => void,
 * }}
 */
export function useChairpersonPanel() {
  // ── Modal visibility ──────────────────────────────────────────────
  const [showTeamLeaderAppointment, setShowTeamLeaderAppointment] = useState(false);
  const [showExecutiveViability, setShowExecutiveViability] = useState(false);
  const [showSLAOverride, setShowSLAOverride] = useState(false);
  const [legalAction, setLegalAction] = useState(null); // null | 'report' | 'fraud' | 'assessment'

  // ── Legal action state ────────────────────────────────────────────
  const [legalNotes, setLegalNotes] = useState('');
  const [legalLoading, setLegalLoading] = useState(false);
  const [legalResult, setLegalResult] = useState(null);

  // ── SLA override state ────────────────────────────────────────────
  const [slaExtensionDays, setSlaExtensionDays] = useState(5);
  const [slaReason, setSlaReason] = useState('');
  const [slaLoading, setSlaLoading] = useState(false);
  const [slaResult, setSlaResult] = useState(null);

  // ── Screen reader announcer ───────────────────────────────────────
  const announceRef = useRef(null);

  const announce = useCallback((msg) => {
    if (announceRef.current) {
      // Clear then set so repeated identical messages still announce
      announceRef.current.textContent = '';
      requestAnimationFrame(() => {
        if (announceRef.current) {
          announceRef.current.textContent = msg;
        }
      });
    }
  }, []);

  // ── Modal open/close ──────────────────────────────────────────────
  const openTeamLeader = useCallback(() => setShowTeamLeaderAppointment(true), []);
  const closeTeamLeader = useCallback(() => setShowTeamLeaderAppointment(false), []);
  const openViability = useCallback(() => setShowExecutiveViability(true), []);
  const closeViability = useCallback(() => setShowExecutiveViability(false), []);
  const openSLAOverride = useCallback(() => setShowSLAOverride(true), []);
  const closeSLAOverride = useCallback(() => {
    setShowSLAOverride(false);
    setSlaExtensionDays(5);
    setSlaReason('');
    setSlaResult(null);
  }, []);

  // ── Legal action ──────────────────────────────────────────────────
  const clearLegalResult = useCallback(() => {
    setLegalResult(null);
    setLegalNotes('');
    setLegalAction(null);
  }, []);

  const handleLegalAction = useCallback(async (caseId) => {
    if (!legalAction || !caseId) return;
    try {
      setLegalLoading(true);
      setLegalResult(null);
      let result;
      switch (legalAction) {
        case 'report':
          result = await committeeAPI.sendReport(caseId, legalNotes);
          break;
        case 'fraud':
          result = await committeeAPI.escalateFraud(caseId, legalNotes);
          break;
        case 'assessment':
          result = await committeeAPI.publishAssessment(caseId, legalNotes);
          break;
      }
      setLegalResult(result);
      announce(`Legal action completed: ${legalAction}`);
    } catch (err) {
      setLegalResult({ status: 'ERROR', message: err.message });
      announce(`Legal action failed: ${err.message}`);
    } finally {
      setLegalLoading(false);
    }
  }, [legalAction, legalNotes, announce]);

  // ── SLA override ──────────────────────────────────────────────────
  const clearSLAResult = useCallback(() => {
    setSlaResult(null);
    setSlaReason('');
    setSlaExtensionDays(5);
  }, []);

  const { overrideSLA, loading: chairpersonLoading } = useChairperson();

  const handleSLAOverride = useCallback(async (caseId) => {
    if (!caseId) return;
    try {
      setSlaLoading(true);
      setSlaResult(null);
      const result = await overrideSLA(caseId, slaExtensionDays, slaReason);
      setSlaResult(result);
      announce(`SLA extended by ${slaExtensionDays} business days`);
    } catch (err) {
      setSlaResult({ status: 'ERROR', message: err.message });
      announce(`SLA override failed: ${err.message}`);
    } finally {
      setSlaLoading(false);
    }
  }, [overrideSLA, slaExtensionDays, slaReason, announce]);

  return {
    // Modal visibility
    showTeamLeaderAppointment,
    showExecutiveViability,
    showSLAOverride,
    legalAction,
    // Legal action state
    legalNotes,
    legalLoading,
    legalResult,
    // SLA override state
    slaExtensionDays,
    slaReason,
    slaLoading,
    slaResult,
    // Announcer
    announceRef,
    announce,
    // Modal actions
    openTeamLeader,
    closeTeamLeader,
    openViability,
    closeViability,
    openSLAOverride,
    closeSLAOverride,
    // Legal actions
    setLegalAction,
    setLegalNotes,
    handleLegalAction,
    clearLegalResult,
    // SLA actions
    setSlaExtensionDays,
    setSlaReason,
    handleSLAOverride,
    clearSLAResult,
  };
}
