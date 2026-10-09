import React, { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle2, AlertTriangle, ShieldCheck, 
  Scale, Calculator, CheckSquare, Layers, 
  RefreshCw, Clock, ArrowLeft, Search, FileSearch, HelpCircle
} from 'lucide-react';
import { Card, Button, Badge, Alert } from '../../../../components/ui/index';
import { itasApi } from '../../services/api';
import { TeamLeaderActionModal } from './TeamLeaderActionModal';
import { CaseFullData } from '../../data/initialData';
import { formatRevenue } from '../../../ap/utils/revenueFormatter';

interface DaTeamLeaderWorkspaceProps {
  caseId: string;
  onBack: () => void;
  onRefresh?: () => void;
}

export const DaTeamLeaderWorkspace: React.FC<DaTeamLeaderWorkspaceProps> = ({ 
  caseId, 
  onBack,
  onRefresh 
}) => {
  const [data, setData] = useState<CaseFullData | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const loadCase = async () => {
    setLoading(true);
    try {
      const caseData = await itasApi.getCaseData(caseId);
      caseData.auditCase.status = 'SUBMITTED';
      setData(caseData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCase();
  }, [caseId]);

  const handleDecision = async (action: 'APPROVE_AUDIT' | 'RETURN_FOR_CORRECTION', comment: string) => {
    if (!data) return;
    
    // Create new audit trail entry
    const entry = {
      id: 'at-' + Date.now(),
      timestamp: new Date().toISOString(),
      actor: 'Team Leader',
      action: action,
      description: comment,
      type: action === 'APPROVE_AUDIT' ? 'success' : 'alert'
    };
    
    const updatedData = { ...data };
    updatedData.auditTrail = [entry, ...updatedData.auditTrail];
    updatedData.auditCase.status = action === 'APPROVE_AUDIT' ? 'APPROVED' : 'IN_PROGRESS';
    
    // Save to local storage cache simulating backend
    await itasApi.autosaveCase(caseId, updatedData);
    
    if (onRefresh) onRefresh();
    onBack();
  };

  if (loading || !data) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-gray-500 font-medium">Loading Submitted Workspace...</p>
        </div>
      </div>
    );
  }

  const { auditCase, procedures, findings, draftReport, analysis, evidence, queries } = data;
  const totalImpact = findings.reduce((sum, f) => sum + f.totalTaxImpact, 0);

  return (
    <div className="flex-1 bg-gray-50 flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Team Leader Review Workspace</h1>
              <Badge variant={auditCase.status === 'SUBMITTED' ? 'warning' : 'success'}>
                {auditCase.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Case {auditCase.caseNumber} • {auditCase.taxpayerName} (TIN: {auditCase.taxpayerId})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setModalOpen(true)}
            className="border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
          >
            <ShieldCheck size={16} className="mr-2" />
            Make Decision
          </Button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6 pb-24">
        
        {/* Top Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-l-indigo-500">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Procedures</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-gray-900">{procedures.length}</h3>
              <span className="text-sm font-medium text-emerald-600">Completed</span>
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-amber-500">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Findings</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-gray-900">{findings.length}</h3>
              <span className="text-sm font-medium text-amber-600">Identified</span>
            </div>
          </Card>
          <Card className="p-4 border-l-4 border-l-emerald-500 col-span-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Tax Adjustment Impact</p>
            <h3 className="text-2xl font-bold text-emerald-600">{formatRevenue(totalImpact)}</h3>
          </Card>
        </div>

        {/* Financial Analysis Section */}
        <Card className="overflow-hidden border border-gray-200 shadow-sm">
          <div className="bg-gray-50/80 px-5 py-4 border-b border-gray-200 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-800">Return & Ratio Analysis</h3>
          </div>
          <div className="p-5">
            {analysis?.notes ? (
              <div className="bg-white border border-gray-200 rounded p-4 text-sm text-gray-700 whitespace-pre-wrap">
                {analysis.notes}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No analysis notes submitted.</p>
            )}
          </div>
        </Card>

        {/* Evidence Collected Section */}
        <Card className="overflow-hidden border border-gray-200 shadow-sm">
          <div className="bg-gray-50/80 px-5 py-4 border-b border-gray-200 flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-800">Evidence Collected</h3>
          </div>
          <div className="p-0">
            {evidence && evidence.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Title</th>
                    <th className="px-5 py-3 font-semibold">Type</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {evidence.map(e => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{e.title}</td>
                      <td className="px-5 py-3 text-gray-600">{e.type}</td>
                      <td className="px-5 py-3">
                        <Badge variant={e.status === 'Verified' ? 'success' : 'default'}>{e.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-5 text-sm text-gray-500 italic">No evidence collected.</div>
            )}
          </div>
        </Card>

        {/* Audit Procedures Executed */}
        <Card className="overflow-hidden border border-gray-200 shadow-sm">
          <div className="bg-gray-50/80 px-5 py-4 border-b border-gray-200 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-gray-800">Audit Procedures Executed</h3>
          </div>
          <div className="p-0">
            {procedures && procedures.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Code</th>
                    <th className="px-5 py-3 font-semibold">Description</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {procedures.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{p.code}</td>
                      <td className="px-5 py-3 text-gray-600">{p.description}</td>
                      <td className="px-5 py-3">
                        <Badge variant={p.status === 'COMPLETED' ? 'success' : p.status === 'IN_PROGRESS' ? 'warning' : 'default'}>{p.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-5 text-sm text-gray-500 italic">No audit procedures executed.</div>
            )}
          </div>
        </Card>

        {/* Taxpayer Queries */}
        <Card className="overflow-hidden border border-gray-200 shadow-sm">
          <div className="bg-gray-50/80 px-5 py-4 border-b border-gray-200 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-gray-800">Taxpayer Queries</h3>
          </div>
          <div className="p-0">
            {queries && queries.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Subject</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {queries.map(q => (
                    <tr key={q.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{q.subject}</td>
                      <td className="px-5 py-3">
                        <Badge variant={q.status === 'RESOLVED' ? 'success' : 'warning'}>{q.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-5 text-sm text-gray-500 italic">No taxpayer queries generated.</div>
            )}
          </div>
        </Card>

        {/* Findings Summary */}
        <Card className="overflow-hidden border border-gray-200 shadow-sm">
          <div className="bg-gray-50/80 px-5 py-4 border-b border-gray-200 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-gray-800">Audit Findings & Adjustments</h3>
          </div>
          <div className="p-0">
            {findings.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Title</th>
                    <th className="px-5 py-3 font-semibold">Tax Type</th>
                    <th className="px-5 py-3 font-semibold text-right">Tax Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {findings.map(f => (
                    <tr key={f.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{f.title}</td>
                      <td className="px-5 py-3 text-gray-600">{f.taxType}</td>
                      <td className="px-5 py-3 text-right font-semibold text-gray-900">{formatRevenue(f.totalTaxImpact)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-5 text-sm text-gray-500 italic">No findings reported.</div>
            )}
          </div>
        </Card>

        {/* Draft Report */}
        <Card className="overflow-hidden border border-gray-200 shadow-sm">
          <div className="bg-gray-50/80 px-5 py-4 border-b border-gray-200 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold text-gray-800">Draft Report Summary</h3>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <h4 className="text-xs font-semibold uppercase text-gray-500 mb-1">Executive Summary</h4>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{draftReport?.executiveSummary || 'Not provided.'}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase text-gray-500 mb-1">Recommended Adjustments</h4>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{draftReport?.recommendedAdjustments || 'Not provided.'}</p>
            </div>
          </div>
        </Card>

      </div>

      <TeamLeaderActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        caseData={auditCase}
        onExecuteAction={handleDecision}
      />
    </div>
  );
};
