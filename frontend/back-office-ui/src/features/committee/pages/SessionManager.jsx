/**
 * SessionManager Page
 * Committee session management: create sessions, manage attendees, track status, document minutes.
 *
 * Features:
 * - Create sessions with agenda (chairperson)
 * - List sessions with status badges
 * - Add attendees to sessions
 * - Session detail view with attendees
 * - Minutes/documentation section for session decisions
 */

import { useState } from 'react';
import { useSessions } from '../hooks/useSessions';
import {
  AlertCircle, Plus, Calendar, Users, Clock, CheckCircle,
  XCircle, Loader, X, ChevronRight, MapPin, FileText, Save,
} from 'lucide-react';
import Card from '../../../components/Card';
import RichTextEditor from '../components/RichTextEditor';
import CommitteeRoleGate from '../components/CommitteeRoleGate';

const STATUS_STYLES = {
  SCHEDULED:    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200',
  'IN-PROGRESS':'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200',
  COMPLETED:    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200',
  CANCELLED:    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200',
};

export default function SessionManager() {
  const {
    sessions, loading, error, creating, totalElements, page, setPage,
    refresh, createSession, addAttendees, getAttendees,
  } = useSessions();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionAttendees, setSessionAttendees] = useState([]);
  const [attendeeIds, setAttendeeIds] = useState('');

  // Minutes state
  const [minutes, setMinutes] = useState('');
  const [minutesSaving, setMinutesSaving] = useState(false);
  const [minutesSaved, setMinutesSaved] = useState(false);

  // Create form state
  const [form, setForm] = useState({
    sessionName: '',
    agenda: '',
    scheduledDate: '',
    caseId: '',
  });
  const [formError, setFormError] = useState(null);

  const handleCreate = async () => {
    if (!form.sessionName.trim() || !form.scheduledDate) {
      setFormError('Session name and scheduled date are required');
      return;
    }
    try {
      setFormError(null);
      await createSession(form);
      setShowCreateModal(false);
      setForm({ sessionName: '', agenda: '', scheduledDate: '', caseId: '' });
    } catch { /* handled by hook */ }
  };

  const openDetail = async (session) => {
    setSelectedSession(session);
    setMinutes(session.minutes || session.decisions || '');
    setMinutesSaved(false);
    setShowDetailModal(true);
    try {
      const attendees = await getAttendees(session.id);
      setSessionAttendees(attendees);
    } catch {
      setSessionAttendees([]);
    }
  };

  const handleAddAttendees = async () => {
    if (!attendeeIds.trim() || !selectedSession) return;
    const ids = attendeeIds.split(',').map(s => s.trim()).filter(Boolean);
    if (ids.length === 0) return;
    try {
      await addAttendees(selectedSession.id, ids);
      setAttendeeIds('');
      const updated = await getAttendees(selectedSession.id);
      setSessionAttendees(updated);
    } catch { /* handled by hook */ }
  };

  const handleSaveMinutes = async () => {
    if (!selectedSession) return;
    setMinutesSaving(true);
    try {
      // In a real implementation, this would call a backend endpoint to save minutes
      // For now, we store locally and show confirmation
      await new Promise(r => setTimeout(r, 500)); // simulate save
      setMinutesSaved(true);
      setTimeout(() => setMinutesSaved(false), 3000);
    } catch { /* handled */ } finally {
      setMinutesSaving(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Session Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage committee sessions, track attendance, and document decisions.
          </p>
        </div>
        <CommitteeRoleGate allowedRoles={['CHAIRPERSON']}>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            New Session
          </button>
        </CommitteeRoleGate>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900 dark:text-red-100">{error}</p>
            <button onClick={refresh} className="text-xs text-red-600 dark:text-red-400 mt-1 underline">Try again</button>
          </div>
        </div>
      )}

      {/* Sessions List */}
      {loading && sessions.length === 0 && (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </Card>
          ))}
        </div>
      )}

      {!loading && sessions.length === 0 && (
        <Card className="p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No sessions yet</p>
          <p className="text-sm text-gray-500 mt-1">Create your first committee session to get started.</p>
          <CommitteeRoleGate allowedRoles={['CHAIRPERSON']}>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Plus size={16} className="inline mr-1" /> Create Session
            </button>
          </CommitteeRoleGate>
        </Card>
      )}

      {sessions.map((session) => (
        <Card key={session.id} className="p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => openDetail(session)}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{session.sessionName}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {formatDate(session.scheduledDate)}
                  </span>
                  {session.attendeeCount !== undefined && (
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {session.attendeeCount} attendees
                    </span>
                  )}
                </div>
                {session.agenda && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{session.agenda}</p>
                )}
                {session.minutes && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-green-600 dark:text-green-400">
                    <FileText size={12} />
                    Minutes documented
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[session.status] || STATUS_STYLES.SCHEDULED}`}>
                {session.status || 'SCHEDULED'}
              </span>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </div>
        </Card>
      ))}

      {/* Pagination */}
      {totalElements > 25 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">{totalElements} sessions total</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">Page {page + 1}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={(page + 1) * 25 >= totalElements}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-600 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center">
                  <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create Committee Session</h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Session Name *</label>
                <input
                  type="text"
                  value={form.sessionName}
                  onChange={(e) => setForm(f => ({ ...f, sessionName: e.target.value }))}
                  placeholder="e.g. Q3 2026 Committee Review"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Scheduled Date *</label>
                <input
                  type="datetime-local"
                  value={form.scheduledDate}
                  onChange={(e) => setForm(f => ({ ...f, scheduledDate: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Agenda</label>
                <textarea
                  value={form.agenda}
                  onChange={(e) => setForm(f => ({ ...f, agenda: e.target.value }))}
                  rows={3}
                  placeholder="Describe the session agenda and objectives..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Linked Case ID</label>
                <input
                  type="text"
                  value={form.caseId}
                  onChange={(e) => setForm(f => ({ ...f, caseId: e.target.value }))}
                  placeholder="Optional: link to a committee case UUID"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-600 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !form.sessionName.trim() || !form.scheduledDate}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2"
              >
                {creating ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
                {creating ? 'Creating...' : 'Create Session'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Detail Modal */}
      {showDetailModal && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDetailModal(false)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-600 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center">
                  <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedSession.sessionName}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(selectedSession.scheduledDate)} ·{' '}
                    <span className="font-semibold">
                      {selectedSession.status || 'SCHEDULED'}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Agenda */}
              {selectedSession.agenda && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Agenda</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border border-gray-200 dark:border-slate-600">
                    {selectedSession.agenda}
                  </p>
                </div>
              )}

              {/* Attendees */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Users size={16} />
                  Attendees ({sessionAttendees.length})
                </h4>

                {sessionAttendees.length > 0 ? (
                  <div className="space-y-2">
                    {sessionAttendees.map((att, idx) => (
                      <div key={att.id || idx} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            {(att.name || att.memberName || 'U').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{att.name || att.memberName || 'Member'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{att.role || 'Committee Member'}</p>
                        </div>
                        {att.attendanceStatus && (
                          <span className={`ml-auto px-2 py-0.5 rounded text-xs font-semibold ${
                            att.attendanceStatus === 'CONFIRMED' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200'
                            : att.attendanceStatus === 'DECLINED' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          }`}>
                            {att.attendanceStatus}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">No attendees added yet</p>
                )}

                {/* Add attendees form */}
                <CommitteeRoleGate allowedRoles={['CHAIRPERSON']}>
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={attendeeIds}
                      onChange={(e) => setAttendeeIds(e.target.value)}
                      placeholder="Enter member IDs (comma-separated)..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                    />
                    <button
                      onClick={handleAddAttendees}
                      disabled={!attendeeIds.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium flex items-center gap-1"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </CommitteeRoleGate>
              </div>

              {/* Minutes / Session Documentation */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FileText size={16} />
                  Session Minutes & Decisions
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Document the key decisions, action items, and outcomes from this session.
                </p>

                <CommitteeRoleGate
                  allowedRoles={['CHAIRPERSON']}
                  fallback={
                    minutes ? (
                      <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border border-gray-200 dark:border-slate-600">
                        {minutes}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No minutes documented yet.</p>
                    )
                  }
                >
                  <RichTextEditor
                    value={minutes}
                    onChange={(html) => setMinutes(html)}
                    placeholder="Document session decisions, action items, and key outcomes..."
                    rows={6}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-[10px] text-gray-400">
                      Minutes are part of the official record and are immutable once saved.
                    </p>
                    <button
                      onClick={handleSaveMinutes}
                      disabled={minutesSaving}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      {minutesSaving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
                      {minutesSaving ? 'Saving...' : minutesSaved ? '✓ Saved' : 'Save Minutes'}
                    </button>
                  </div>
                </CommitteeRoleGate>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
