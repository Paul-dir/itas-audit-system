/**
 * EntryConferencePanel - Comprehensive scheduling and management mechanism for Entry Conference
 * 
 * Features:
 * - Full scheduling form (Mode: In-Person/Virtual, Date, Time, Duration, Location/Link)
 * - Taxpayer representative contacts (Name, Designation, Email, Phone)
 * - Standard statutory audit agenda selection + custom agenda items
 * - Multi-channel taxpayer notification (Portal, Email, SMS, Official Letter)
 * - Optional step waiver mechanism with audit justification logging
 * - Conference minutes & agreements recording post-meeting
 */

import { useState, useMemo } from 'react';
import {
  Calendar, Clock, MapPin, Video, Users, Mail, Globe, MessageSquare,
  FileText, CheckCircle, AlertTriangle, ArrowRight, Download, Send,
  RefreshCw, X, Shield, Building, Phone, Info, Check, Eye, Edit3
} from 'lucide-react';
import { Card, Button, Badge } from '../../../components/ui/index.jsx';

const DEFAULT_AGENDA_ITEMS = [
  { id: 'scope', label: 'Audit Scope & Period of Review (Tax Types & Years)', checked: true },
  { id: 'docs', label: 'Initial Document & Information Request Checklist', checked: true },
  { id: 'caat', label: 'Electronic Records & ERP/Accounting System Data Access', checked: true },
  { id: 'logistics', label: 'Examination Schedule, Working Hours & Workplace Facilities', checked: true },
  { id: 'rights', label: 'Taxpayer Rights, Legal Protections & Penalty Provisions', checked: true },
];

const NOTIFICATION_CHANNELS = [
  {
    id: 'PORTAL',
    name: 'Taxpayer Portal',
    icon: Globe,
    badge: 'Real-time',
    color: 'blue',
    desc: 'Instant notice published to taxpayer ITAS self-service portal dashboard',
  },
  {
    id: 'EMAIL',
    name: 'Official Email',
    icon: Mail,
    badge: 'Calendar (.ics)',
    color: 'purple',
    desc: 'Formal notification with calendar invite sent to registered email addresses',
  },
  {
    id: 'SMS',
    name: 'SMS Notification',
    icon: MessageSquare,
    badge: 'Instant Alert',
    color: 'emerald',
    desc: 'Automated SMS reminder dispatched to primary contact phone number',
  },
  {
    id: 'LETTER',
    name: 'Official Letter',
    icon: FileText,
    badge: 'Formal Summons',
    color: 'amber',
    desc: 'Generate formal printable entry conference summons letter for physical service',
  },
];

export default function EntryConferencePanel({
  caseId,
  caseData,
  conference,
  onSchedule,
  onRecordMinutes,
  onSkip,
  isAuditor = true,
  isTeamLeader = false,
}) {
  // Determine initial phase: 'schedule' | 'scheduled' | 'minutes' | 'done' | 'skipped'
  const initialPhase = useMemo(() => {
    if (conference?.status === 'SKIPPED') return 'skipped';
    if (conference?.status === 'COMPLETED' || conference?.status === 'APPROVED') return 'done';
    if (conference?.status === 'MINUTES_RECORDED') return 'done';
    if (conference?.scheduledDate || conference?.status === 'SCHEDULED') return 'scheduled';
    return 'schedule';
  }, [conference]);

  const [phase, setPhase] = useState(initialPhase);

  // ── Scheduling Form State ──
  const [meetingMode, setMeetingMode] = useState('IN_PERSON'); // 'IN_PERSON' | 'VIRTUAL' | 'HYBRID'
  const [meetingDate, setMeetingDate] = useState(
    conference?.scheduledDate ? new Date(conference.scheduledDate).toISOString().split('T')[0] : ''
  );
  const [meetingTime, setMeetingTime] = useState(
    conference?.scheduledDate
      ? new Date(conference.scheduledDate).toTimeString().slice(0, 5)
      : '10:00'
  );
  const [duration, setDuration] = useState('1 Hour');
  const [location, setLocation] = useState(conference?.location || 'Ministry of Revenue Head Office, Audit Room 302');
  const [virtualLink, setVirtualLink] = useState('https://meet.mor.gov.et/audit-conf-' + (caseId ? caseId.slice(0, 8) : '001'));
  
  // Taxpayer contact details
  const [tpContactName, setTpContactName] = useState(caseData?.taxpayerName || 'Managing Director / Tax Representative');
  const [tpContactEmail, setTpContactEmail] = useState(caseData?.email || 'finance@' + (caseData?.taxpayerName ? caseData.taxpayerName.toLowerCase().replace(/[^a-z0-9]/g, '') : 'taxpayer') + '.et');
  const [tpContactPhone, setTpContactPhone] = useState(caseData?.phone || '+251 91 100 0000');
  
  // Agenda
  const [agendaList, setAgendaList] = useState(DEFAULT_AGENDA_ITEMS);
  const [customAgenda, setCustomAgenda] = useState('');

  // Notification channels
  const [selectedChannels, setSelectedChannels] = useState(['PORTAL', 'EMAIL']);
  const [customNoticeText, setCustomNoticeText] = useState('');
  const [notifSent, setNotifSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Minutes Form State
  const [minutesText, setMinutesText] = useState(
    typeof conference?.minutes === 'string' ? conference.minutes : ''
  );
  const [actualAttendees, setActualAttendees] = useState(
    `1. ${caseData?.taxpayerName || 'Taxpayer Representative'} (CFO)\n2. Lead Auditor\n3. Assistant Auditor`
  );
  const [agreedDeadline, setAgreedDeadline] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [keyAgreements, setKeyAgreements] = useState(
    `- Taxpayer agreed to provide financial statements, general ledger, and invoices by ${new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]}.\n- Audit examination will take place at taxpayer premises on business days.`
  );

  // Waiver / Skip State
  const [showWaiverModal, setShowWaiverModal] = useState(false);
  const [waiverReason, setWaiverReason] = useState('DESK_AUDIT');
  const [waiverNotes, setWaiverNotes] = useState('');

  // UI helpers
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleChannel = (id) => {
    setSelectedChannels(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleAgendaItem = (id) => {
    setAgendaList(prev =>
      prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  // Handle Save / Submit Schedule
  const handleSaveSchedule = async (andNotify = true) => {
    if (!meetingDate || !meetingTime) {
      setFormError('Please select both a meeting date and time.');
      return;
    }
    setFormError('');
    setSubmitting(true);

    try {
      const scheduledIso = new Date(`${meetingDate}T${meetingTime}`).toISOString();
      const venueInfo = meetingMode === 'VIRTUAL' ? virtualLink : meetingMode === 'HYBRID' ? `${location} / ${virtualLink}` : location;
      
      const activeAgendas = agendaList.filter(a => a.checked).map(a => a.label);
      if (customAgenda.trim()) {
        activeAgendas.push(customAgenda.trim());
      }

      const schedulePayload = {
        scheduledDate: scheduledIso,
        location: venueInfo,
        agenda: activeAgendas.join('; '),
        meetingMode,
        duration,
        contactName: tpContactName,
        contactEmail: tpContactEmail,
        contactPhone: tpContactPhone,
        notificationChannels: andNotify ? selectedChannels : [],
      };

      if (onSchedule) {
        await onSchedule(schedulePayload);
      }

      if (andNotify && selectedChannels.length > 0) {
        setIsSending(true);
        // Best effort notify
        try {
          await fetch(`/api/v1/backoffice/ap/cases/${caseId}/conference/notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              channels: selectedChannels,
              scheduledDate: scheduledIso,
              location: venueInfo,
              taxpayerName: caseData?.taxpayerName,
              message: customNoticeText || `Entry Conference scheduled on ${meetingDate} at ${meetingTime}. Location: ${venueInfo}`,
            }),
          });
        } catch (e) {
          console.warn('[Conference] Notification send non-fatal error:', e);
        }
        setIsSending(false);
        setNotifSent(true);
      }

      setPhase('scheduled');
    } catch (err) {
      setFormError(err.message || 'Failed to schedule entry conference.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Record Minutes
  const handleSaveMinutes = async () => {
    if (!minutesText.trim() && !keyAgreements.trim()) {
      setFormError('Please enter conference minutes or key agreements.');
      return;
    }
    setFormError('');
    setSubmitting(true);

    try {
      const fullMinutes = `ENTRY CONFERENCE MINUTES\n\nATTENDEES:\n${actualAttendees}\n\nDISCUSSION & NOTES:\n${minutesText}\n\nKEY AGREEMENTS:\n${keyAgreements}\n\nAGREED DOCUMENT SUBMISSION DEADLINE:\n${agreedDeadline}`;
      
      if (onRecordMinutes) {
        await onRecordMinutes(fullMinutes);
      }
      setPhase('done');
    } catch (err) {
      setFormError(err.message || 'Failed to record conference minutes.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Waive / Skip
  const handleConfirmWaiver = async () => {
    const reasonText = waiverReason === 'DESK_AUDIT'
      ? `Waived — Desk Audit (Field conference not required). ${waiverNotes}`
      : waiverReason === 'PRIOR_AGREEMENT'
      ? `Waived — Prior informal entry conference conducted with taxpayer. ${waiverNotes}`
      : waiverReason === 'TAXPAYER_REQUEST'
      ? `Waived — Taxpayer formally waived entry conference. ${waiverNotes}`
      : `Waived — ${waiverNotes || 'Not applicable for this audit type'}`;

    setSubmitting(true);
    try {
      if (onSkip) {
        await onSkip(reasonText);
      }
      setShowWaiverModal(false);
      setPhase('skipped');
    } catch (err) {
      setFormError(err.message || 'Failed to waive entry conference.');
    } finally {
      setSubmitting(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: COMPLETED OR SKIPPED SUMMARY VIEWS
  // ═══════════════════════════════════════════════════════════════════════════

  if (phase === 'skipped') {
    return (
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl">
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Entry Conference Waived</h3>
                <Badge color="yellow">Optional Gate Waived</Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                The Entry Conference was formally waived for this audit case.
              </p>
            </div>
          </div>
          {isAuditor && (
            <Button
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={() => setPhase('schedule')}
            >
              Re-open &amp; Schedule Meeting
            </Button>
          )}
        </div>

        <div className="mt-5 p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl space-y-2">
          <p className="text-xs font-semibold uppercase text-amber-800 dark:text-amber-300 tracking-wider">
            Official Waiver Justification
          </p>
          <p className="text-sm text-gray-800 dark:text-slate-200">
            {conference?.minutes || waiverNotes || 'Waived — not required for this audit engagement.'}
          </p>
        </div>

        <div className="mt-5 flex justify-end">
          <Button
            variant="primary"
            icon={ArrowRight}
            onClick={() => onRecordMinutes?.('Waived')}
          >
            Continue to Information Request
          </Button>
        </div>
      </Card>
    );
  }

  if (phase === 'done') {
    return (
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl">
              <CheckCircle size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Entry Conference Completed</h3>
                <Badge color="green">Completed</Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                Conference was conducted, and minutes have been formally filed into the case dossier.
              </p>
            </div>
          </div>
          {isAuditor && (
            <Button
              variant="secondary"
              size="sm"
              icon={Edit3}
              onClick={() => setPhase('minutes')}
            >
              Edit Minutes
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {conference?.scheduledDate && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                <span className="text-xs text-gray-400 dark:text-slate-500 uppercase font-semibold">Held Date &amp; Time</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                  {new Date(conference.scheduledDate).toLocaleString()}
                </p>
              </div>
              <div className="p-3.5 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                <span className="text-xs text-gray-400 dark:text-slate-500 uppercase font-semibold">Location / Mode</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                  {conference.location || 'Official Tax Office'}
                </p>
              </div>
            </div>
          )}

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 mb-2">
              Recorded Conference Minutes &amp; Agreed Terms
            </p>
            <pre className="text-xs font-sans text-gray-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {typeof conference?.minutes === 'string'
                ? conference.minutes
                : JSON.stringify(conference?.minutes, null, 2)}
            </pre>
          </div>
        </div>
      </Card>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: SCHEDULING FORM OR SCHEDULED VIEW
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="space-y-5">
      {/* ── Top Info & Waiver Banner ── */}
      <Card className="p-5 border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-xl">
              <Calendar size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Step 4: Entry Conference
                </h3>
                <Badge color="blue">Optional Gate</Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                The Entry Conference introduces the audit scope, legal mandate, and preliminary information request to{' '}
                <strong className="text-gray-900 dark:text-white font-semibold">
                  {caseData?.taxpayerName || 'the taxpayer'}
                </strong>. You can schedule the meeting, send multi-channel notifications, or waive this step if not applicable.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              icon={AlertTriangle}
              onClick={() => setShowWaiverModal(true)}
              className="text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700/50 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              Waive Conference
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Form Error Banner ── */}
      {formError && (
        <div className="p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
          <AlertTriangle size={16} className="shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* ── PHASE 1: SCHEDULE FORM ── */}
      {phase === 'schedule' && (
        <Card className="p-6 space-y-6">
          <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              Meeting Scheduling Mechanism
            </h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              Configure the date, time, format, and taxpayer representative invitees for the entry meeting.
            </p>
          </div>

          {/* Meeting Mode / Format Selector */}
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 tracking-wider mb-2 block">
              Meeting Mode / Format *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'IN_PERSON', label: 'In-Person Meeting', icon: Building, desc: 'Tax Office or Taxpayer Office' },
                { id: 'VIRTUAL', label: 'Virtual Conference', icon: Video, desc: 'Microsoft Teams / Zoom / Meet' },
                { id: 'HYBRID', label: 'Hybrid Format', icon: Globe, desc: 'In-person with virtual attendance link' },
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMeetingMode(m.id)}
                  className={`flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all ${
                    meetingMode === m.id
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm'
                      : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <m.icon size={16} className={meetingMode === m.id ? 'text-blue-600' : 'text-gray-400'} />
                    {meetingMode === m.id && <CheckCircle size={14} className="text-blue-600" />}
                  </div>
                  <span className={`text-xs font-bold ${meetingMode === m.id ? 'text-blue-900 dark:text-blue-300' : 'text-gray-800 dark:text-slate-200'}`}>
                    {m.label}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5">
                    {m.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Date, Time & Duration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 tracking-wider mb-1.5 block">
                Meeting Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={meetingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setMeetingDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 tracking-wider mb-1.5 block">
                Start Time *
              </label>
              <input
                type="time"
                value={meetingTime}
                onChange={e => setMeetingTime(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 tracking-wider mb-1.5 block">
                Estimated Duration
              </label>
              <select
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="30 Minutes">30 Minutes</option>
                <option value="45 Minutes">45 Minutes</option>
                <option value="1 Hour">1 Hour (Standard)</option>
                <option value="1.5 Hours">1.5 Hours</option>
                <option value="2 Hours">2 Hours (In-depth)</option>
              </select>
            </div>
          </div>

          {/* Location or Virtual Link */}
          {(meetingMode === 'IN_PERSON' || meetingMode === 'HYBRID') && (
            <div>
              <label className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 tracking-wider mb-1.5 block">
                Physical Meeting Location / Room *
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Ministry of Revenue Head Office, Room 302, Addis Ababa"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}

          {(meetingMode === 'VIRTUAL' || meetingMode === 'HYBRID') && (
            <div>
              <label className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 tracking-wider mb-1.5 block">
                Virtual Video Conference Link / Platform *
              </label>
              <div className="relative">
                <Video size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  value={virtualLink}
                  onChange={e => setVirtualLink(e.target.value)}
                  placeholder="https://teams.microsoft.com/... or Zoom meeting URL"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Taxpayer Representative Contacts */}
          <div className="p-4 bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700/60 rounded-xl space-y-3">
            <h5 className="text-xs font-bold uppercase text-gray-700 dark:text-slate-300 tracking-wider flex items-center gap-1.5">
              <Users size={14} className="text-blue-600" /> Taxpayer Primary Contact &amp; Invitee
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-gray-500 dark:text-slate-400 block mb-1">Invitee Name / Title</label>
                <input
                  type="text"
                  value={tpContactName}
                  onChange={e => setTpContactName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 dark:text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={tpContactEmail}
                  onChange={e => setTpContactEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 dark:text-slate-400 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={tpContactPhone}
                  onChange={e => setTpContactPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Agenda Checklist */}
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 tracking-wider mb-2 block">
              Meeting Agenda &amp; Discussion Topics
            </label>
            <div className="space-y-2">
              {agendaList.map(item => (
                <label
                  key={item.id}
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/40 cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleAgendaItem(item.id)}
                    className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-800 dark:text-slate-200">{item.label}</span>
                </label>
              ))}
            </div>
            <div className="mt-2">
              <input
                type="text"
                value={customAgenda}
                onChange={e => setCustomAgenda(e.target.value)}
                placeholder="+ Add supplementary agenda item..."
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-dashed border-gray-300 dark:border-slate-700 bg-transparent text-gray-900 dark:text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Notification Channels Multi-Select */}
          <div className="border-t border-gray-100 dark:border-slate-800 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h5 className="text-xs font-bold uppercase text-gray-700 dark:text-slate-300 tracking-wider">
                  Taxpayer Dispatch Channels (Multi-Select)
                </h5>
                <p className="text-[11px] text-gray-500 dark:text-slate-400">
                  Select which methods to use for dispatching the meeting summons and calendar invitation.
                </p>
              </div>
              <Badge color="blue">{selectedChannels.length} Channels Selected</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {NOTIFICATION_CHANNELS.map(ch => {
                const isSelected = selectedChannels.includes(ch.id);
                const Icon = ch.icon;
                return (
                  <div
                    key={ch.id}
                    onClick={() => toggleChannel(ch.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-900/20 shadow-sm'
                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isSelected ? 'text-blue-900 dark:text-blue-300' : 'text-gray-800 dark:text-slate-200'}`}>
                          {ch.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 font-mono">
                          {ch.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1 leading-snug">
                        {ch.desc}
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 dark:border-slate-600'
                    }`}>
                      {isSelected && <Check size={11} />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom note to taxpayer */}
            {selectedChannels.length > 0 && (
              <div className="mt-4">
                <label className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                  Custom Notice Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customNoticeText}
                  onChange={e => setCustomNoticeText(e.target.value)}
                  placeholder="e.g. Please bring your valid tax agent authorization letter and valid identity document to the meeting..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <Button
              variant="secondary"
              size="md"
              onClick={() => handleSaveSchedule(false)}
              disabled={submitting}
            >
              Save Schedule Only (No Dispatch)
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                icon={Send}
                loading={submitting}
                onClick={() => handleSaveSchedule(true)}
              >
                Schedule &amp; Dispatch Notice
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* ── PHASE 2: MEETING SCHEDULED STATE ── */}
      {phase === 'scheduled' && (
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                  <Clock size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">
                      Meeting Scheduled
                    </h4>
                    <Badge color="blue">Upcoming Conference</Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                    Invitation dispatched to taxpayer. Once the meeting is held, proceed to record minutes.
                  </p>
                </div>
              </div>

              {isAuditor && (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Edit3}
                  onClick={() => setPhase('schedule')}
                >
                  Reschedule
                </Button>
              )}
            </div>

            {/* Scheduled Details Card */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                <span className="text-xs text-gray-400 dark:text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                  <Calendar size={13} /> Scheduled Date &amp; Time
                </span>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                  {meetingDate} at {meetingTime} ({duration})
                </p>
              </div>

              <div className="p-3.5 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                <span className="text-xs text-gray-400 dark:text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                  <MapPin size={13} /> Venue / Platform
                </span>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 truncate" title={location}>
                  {meetingMode === 'VIRTUAL' ? virtualLink : location}
                </p>
              </div>

              <div className="p-3.5 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                <span className="text-xs text-gray-400 dark:text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                  <Users size={13} /> Taxpayer Representative
                </span>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 truncate">
                  {tpContactName} ({tpContactPhone})
                </p>
              </div>
            </div>

            {/* Dispatch Status Badges */}
            <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-800/40 rounded-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <CheckCircle size={14} className="text-blue-600" /> Dispatched via Channels:
              </span>
              <div className="flex gap-2">
                {selectedChannels.map(ch => (
                  <Badge key={ch} color="blue">{ch}</Badge>
                ))}
              </div>
            </div>

            {/* Next Action: Proceed to Record Minutes */}
            <div className="mt-6 pt-5 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-800 dark:text-slate-200">
                  Meeting conducted?
                </p>
                <p className="text-[11px] text-gray-500 dark:text-slate-400">
                  Document the discussions, attendance, and document submission deadlines agreed with the taxpayer.
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                icon={FileText}
                onClick={() => setPhase('minutes')}
              >
                Record Conference Minutes
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── PHASE 3: RECORD MINUTES FORM ── */}
      {phase === 'minutes' && (
        <Card className="p-6 space-y-5">
          <div className="border-b border-gray-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                Record Official Conference Minutes
              </h4>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Formally record the discussions, attendees, agreements, and document delivery commitments.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPhase('scheduled')}
            >
              ← Back to Schedule
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 tracking-wider mb-1.5 block">
                Actual Attendees (Taxpayer &amp; Audit Team) *
              </label>
              <textarea
                rows={4}
                value={actualAttendees}
                onChange={e => setActualAttendees(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 tracking-wider mb-1.5 block">
                Agreed Document Delivery Deadline *
              </label>
              <input
                type="date"
                value={agreedDeadline}
                onChange={e => setAgreedDeadline(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-emerald-500 outline-none mb-3"
              />
              <span className="text-[11px] text-gray-500 dark:text-slate-400 block">
                Standard statutory compliance provides 15 business days for taxpayer record submission.
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 tracking-wider mb-1.5 block">
              Key Discussion Points &amp; Scope Overview
            </label>
            <textarea
              rows={4}
              value={minutesText}
              onChange={e => setMinutesText(e.target.value)}
              placeholder="e.g. Discussed audit period 2022-2024. Taxpayer explained their ERP transition to SAP. Agreed on contact person for daily fieldwork..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 tracking-wider mb-1.5 block">
              Formal Agreements &amp; Commitments
            </label>
            <textarea
              rows={3}
              value={keyAgreements}
              onChange={e => setKeyAgreements(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setPhase('scheduled')}
            >
              Cancel
            </Button>

            <Button
              variant="success"
              size="md"
              icon={CheckCircle}
              loading={submitting}
              onClick={handleSaveMinutes}
            >
              Submit Minutes &amp; Complete Gate
            </Button>
          </div>
        </Card>
      )}

      {/* ── WAIVER MODAL ── */}
      {showWaiverModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
                  <AlertTriangle size={20} />
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white">
                  Waive Entry Conference
                </h4>
              </div>
              <button
                onClick={() => setShowWaiverModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
              The Entry Conference is an optional step in the statutory audit execution workflow. 
              Waiving this gate records a formal compliance memo in the case history and advances the case directly to Information Request.
            </p>

            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                Waiver Justification Reason *
              </label>
              <select
                value={waiverReason}
                onChange={e => setWaiverReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="DESK_AUDIT">Desk Audit — Field entry conference not required</option>
                <option value="PRIOR_AGREEMENT">Prior informal conference already conducted</option>
                <option value="TAXPAYER_REQUEST">Taxpayer formally requested direct document request</option>
                <option value="SPECIAL_EXAMINATION">Special / Urgent inquiry under audit committee directive</option>
                <option value="OTHER">Other specific administrative justification</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                Detailed Memo Notes *
              </label>
              <textarea
                rows={3}
                value={waiverNotes}
                onChange={e => setWaiverNotes(e.target.value)}
                placeholder="Explain the administrative grounds for waiving this conference..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-slate-800">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowWaiverModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="warning"
                size="sm"
                icon={AlertTriangle}
                loading={submitting}
                onClick={handleConfirmWaiver}
              >
                Confirm &amp; Waive Step
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
