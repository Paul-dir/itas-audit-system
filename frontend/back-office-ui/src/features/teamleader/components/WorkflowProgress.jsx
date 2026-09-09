/**
 * WorkflowProgress Component
 * Visual 10-step progress tracker for the audit execution workflow.
 * Shows completed, current, and upcoming steps with icons and labels.
 */

import {
  FileText, ClipboardList, Calendar, FileSearch,
  FolderOpen, Cpu, TestTube, AlertTriangle, MessageSquare, CheckCircle,
} from 'lucide-react';
import { WORKFLOW_STEPS } from '../data/workflowConstants';

const STEP_ICONS = {
  CASE_DETAIL:         FileText,
  PLANNING:            ClipboardList,
  ENTRY_CONFERENCE:    Calendar,
  INFO_REQUEST:        FileSearch,
  DOCUMENT_COLLECTION: FolderOpen,
  CAAT_ANALYSIS:       Cpu,
  AUDIT_TESTING:       TestTube,
  FINDINGS:            AlertTriangle,
  TAXPAYER_RESPONSE:   MessageSquare,
  CONCLUSION:          CheckCircle,
};

export default function WorkflowProgress({ currentStep, stepStatuses = {} }) {
  const currentIdx = WORKFLOW_STEPS.findIndex(s => s.id === currentStep) ?? -1;

  return (
    <div className="w-full">
      {/* Horizontal progress line for large screens */}
      <div className="hidden lg:block">
        <div className="relative flex items-start justify-between">
          {/* Background line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 z-0" />
          {/* Active line */}
          <div
            className="absolute top-5 left-0 h-0.5 bg-blue-600 dark:bg-blue-400 z-0 transition-all duration-500"
            style={{ width: `${currentIdx >= 0 ? (currentIdx / (WORKFLOW_STEPS.length - 1)) * 100 : 0}%` }}
          />

          {WORKFLOW_STEPS.map((step, idx) => {
            const Icon = STEP_ICONS[step.id];
            const stepState = stepStatuses[step.id] || 'upcoming';
            const isCompleted = stepState === 'completed';
            const isCurrent = step.id === currentStep;
            const isUpcoming = !isCompleted && !isCurrent;

            return (
              <div key={step.id} className="flex flex-col items-center z-10 relative" style={{ flex: 1 }}>
                {/* Step circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? 'bg-green-600 border-green-600 text-white'
                    : isCurrent
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                }`}>
                  {isCompleted ? (
                    <CheckCircle size={18} />
                  ) : (
                    <Icon size={16} />
                  )}
                </div>

                {/* Step label */}
                <div className="mt-2 text-center px-1">
                  <p className={`text-[10px] font-bold uppercase ${
                    isCurrent ? 'text-blue-600 dark:text-blue-400' :
                    isCompleted ? 'text-green-600 dark:text-green-400' :
                    'text-gray-400 dark:text-gray-500'
                  }`}>
                    {step.number}
                  </p>
                  <p className={`text-[10px] leading-tight mt-0.5 ${
                    isCurrent ? 'text-gray-900 dark:text-white font-semibold' :
                    isCompleted ? 'text-gray-700 dark:text-gray-300' :
                    'text-gray-400 dark:text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vertical list for small screens */}
      <div className="lg:hidden space-y-2">
        {WORKFLOW_STEPS.map((step, idx) => {
          const Icon = STEP_ICONS[step.id];
          const stepState = stepStatuses[step.id] || 'upcoming';
          const isCompleted = stepState === 'completed';
          const isCurrent = step.id === currentStep;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                isCurrent ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' :
                isCompleted ? 'bg-green-50 dark:bg-green-900/10' :
                ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isCompleted ? 'bg-green-600 text-white' :
                isCurrent ? 'bg-blue-600 text-white' :
                'bg-gray-200 dark:bg-gray-700 text-gray-400'
              }`}>
                {isCompleted ? <CheckCircle size={14} /> : <Icon size={14} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  isCurrent ? 'text-blue-700 dark:text-blue-300' :
                  isCompleted ? 'text-green-700 dark:text-green-300' :
                  'text-gray-500 dark:text-gray-400'
                }`}>
                  Step {step.number}: {step.label}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{step.actor}</p>
              </div>
              {isCompleted && (
                <span className="text-xs text-green-600 dark:text-green-400 font-semibold">Done</span>
              )}
              {isCurrent && (
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Active</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
