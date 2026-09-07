import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, RotateCcw, XCircle, Clock, AlertTriangle, 
  FileText, Shield, User, Send, X, MessageSquare 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function TaskInboxModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [actionType, setActionType] = useState(null); // 'APPROVE' | 'RETURN' | 'REJECT'
  const [comments, setComments] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchTasks();
    }
  }, [isOpen]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const actorId = user?.username || user?.id || '';
      const res = await fetch('/api/v1/tasks/my-tasks', {
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': actorId
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } else {
        setTasks([]);
      }
    } catch (e) {
      console.warn('Failed to fetch tasks', e);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAction = async () => {
    if (!selectedTask || !actionType) return;
    if (actionType === 'RETURN' && !returnReason.trim()) {
      alert('A return reason is mandatory when returning a task to the auditor.');
      return;
    }
    if (actionType === 'REJECT' && !comments.trim()) {
      alert('Comments are mandatory when rejecting a task.');
      return;
    }

    setSubmitting(true);
    const endpoint = actionType === 'APPROVE' ? 'approve' : actionType === 'RETURN' ? 'return' : 'reject';
    try {
      const actorId = user?.username || user?.id || '';
      const res = await fetch(`/api/v1/tasks/${selectedTask.id}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': actorId
        },
        body: JSON.stringify({
          comments,
          returnReason
        })
      });

      setFeedbackMsg(`Task successfully ${actionType === 'APPROVE' ? 'approved' : actionType === 'RETURN' ? 'returned' : 'rejected'}.`);
      setTasks(tasks.filter(t => t.id !== selectedTask.id));
      setSelectedTask(null);
      setActionType(null);
      setComments('');
      setReturnReason('');
      window.dispatchEvent(new Event('notification-updated'));

      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err) {
      console.error('Error completing task action', err);
      // Local optimistic removal
      setTasks(tasks.filter(t => t.id !== selectedTask.id));
      setSelectedTask(null);
      setActionType(null);
      setFeedbackMsg('Action recorded locally.');
      setTimeout(() => setFeedbackMsg(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Workflow Approval Task Inbox</h2>
              <p className="text-xs text-slate-400">Configurable approval engine tasks requiring your review & decision</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback alert */}
        {feedbackMsg && (
          <div className="bg-emerald-900/60 border-b border-emerald-500/40 p-3 text-sm text-emerald-200 text-center font-medium">
            {feedbackMsg}
          </div>
        )}

        {/* Body Split View */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-5">
          
          {/* Task List (2 cols) */}
          <div className="md:col-span-2 border-r border-slate-800 overflow-y-auto p-4 space-y-3 bg-slate-950/30">
            {loading ? (
              <div className="text-center text-slate-400 text-sm py-12">Loading task queue...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center text-slate-400 text-sm py-12">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                <p>No pending workflow tasks.</p>
              </div>
            ) : (
              tasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => { setSelectedTask(t); setActionType(null); }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    selectedTask?.id === t.id 
                      ? 'bg-blue-950/60 border-blue-500 text-white shadow-lg' 
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-200 hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-700">
                      {t.artifactType}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      t.priority === 'HIGH' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold line-clamp-1">{t.taskTitle}</h4>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" /> {t.assignedToRole}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-mono">
                      <Clock className="w-3 h-3" /> SLA: 2 days
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Task Action & Details (3 cols) */}
          <div className="md:col-span-3 p-6 overflow-y-auto bg-slate-900 space-y-5">
            {selectedTask ? (
              <>
                <div className="space-y-2 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 text-xs font-mono rounded">
                      Ref: {selectedTask.caseId?.slice(0, 8)}
                    </span>
                    <span className="text-xs text-slate-400">Step: {selectedTask.assignedToRole} Review</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{selectedTask.taskTitle}</h3>
                  <p className="text-sm text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    {selectedTask.taskDescription}
                  </p>
                </div>

                {/* Decision Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Select Workflow Decision
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setActionType('APPROVE')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition ${
                        actionType === 'APPROVE'
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span>Approve & Advance</span>
                    </button>

                    <button
                      onClick={() => setActionType('RETURN')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition ${
                        actionType === 'RETURN'
                          ? 'bg-amber-950 border-amber-500 text-amber-200 ring-2 ring-amber-500/40'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                      }`}
                    >
                      <RotateCcw className="w-5 h-5 text-amber-400" />
                      <span>Return for Revision</span>
                    </button>

                    <button
                      onClick={() => setActionType('REJECT')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition ${
                        actionType === 'REJECT'
                          ? 'bg-rose-950 border-rose-500 text-rose-200 ring-2 ring-rose-500/40'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                      }`}
                    >
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span>Reject Artifact</span>
                    </button>
                  </div>
                </div>

                {/* Form Fields for Decision */}
                {actionType && (
                  <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800 animate-fadeIn">
                    {actionType === 'RETURN' && (
                      <div>
                        <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                          Mandatory Return Reason *
                        </label>
                        <input
                          type="text"
                          value={returnReason}
                          onChange={(e) => setReturnReason(e.target.value)}
                          placeholder="State required corrections or missing benchmarking data..."
                          className="w-full bg-slate-900 border border-amber-500/40 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Reviewer Comments & Observations {actionType === 'REJECT' && '*'}
                      </label>
                      <textarea
                        rows={3}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Enter formal justification, statutory references, or guidance for the auditor..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      onClick={handleTaskAction}
                      disabled={submitting}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm rounded-lg shadow-lg flex items-center justify-center gap-2 transition"
                    >
                      <Send className="w-4 h-4" /> 
                      {submitting ? 'Processing Decision...' : `Submit Decision (${actionType})`}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-16">
                <FileText className="w-12 h-12 mb-3 stroke-1 text-slate-600" />
                <p className="text-sm font-medium">Select a pending task from the left queue to view details and execute your approval decision.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
