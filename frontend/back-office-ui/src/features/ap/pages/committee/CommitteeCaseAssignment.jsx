import { useState } from 'react';
import { Tabs } from '../../../../components/ui/index.jsx';
import CaseAssignmentToTeamLeaders from '../../components/CaseAssignmentToTeamLeaders.jsx';
import { useAuth } from '../../../../context/AuthContext.jsx';

/**
 * CommitteeCaseAssignment Page
 * For committee members (tp-committee, joint-committee) to assign cases to their team leaders
 */
export default function CommitteeCaseAssignment() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('transfer-pricing');

  // Determine which committee the user belongs to based on auditType or username
  const auditTypeStr = (user?.auditType || '').toUpperCase();
  const userNameStr = (user?.username || '').toLowerCase();
  
  const isTPCommittee = auditTypeStr.includes('TRANSFER') || auditTypeStr.includes('TP') || userNameStr.includes('tp') || (!auditTypeStr.includes('JOINT') && !userNameStr.includes('joint'));
  const isJointCommittee = auditTypeStr.includes('JOINT') || userNameStr.includes('joint') || (!auditTypeStr.includes('TRANSFER') && !userNameStr.includes('tp'));
  const committeeActor = user?.username || (isTPCommittee ? 'tp-committee' : 'joint-committee');


  const tabs = [
    isTPCommittee && {
      id: 'transfer-pricing',
      label: '💰 Transfer Pricing Committee Cases',
    },
    isJointCommittee && {
      id: 'joint-audit',
      label: '🤝 Joint Audit Committee Cases',
    },
  ].filter(Boolean);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          📊 Committee Case Assignment
        </h1>
        <p className="text-gray-600 dark:text-slate-400 mt-2">
          Assign high-risk audit cases from the committee jurisdiction to specialized Team Leaders for execution
        </p>
      </div>

      {/* Tabs for different committee types */}
      {tabs.length > 1 && (
        <Tabs
          tabs={tabs}
          active={activeTab}
          onChange={setActiveTab}
        />
      )}

      {/* Active Assignment Workspace */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
        {activeTab === 'transfer-pricing' && (
          <CaseAssignmentToTeamLeaders
            committee={committeeActor}
            auditType="TRANSFER_PRICING"
            taxCenter={user?.taxCenter}
          />
        )}
        {activeTab === 'joint-audit' && (
          <CaseAssignmentToTeamLeaders
            committee={committeeActor}
            auditType="JOINT_AUDIT"
            taxCenter={user?.taxCenter}
          />
        )}
      </div>
    </div>
  );
}
