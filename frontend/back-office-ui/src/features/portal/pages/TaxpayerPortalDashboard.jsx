import React, { useState } from 'react';
import { 
  FileText, Upload, CheckCircle, Clock, AlertTriangle, Send, Download, 
  Shield, Building, Calendar, HelpCircle, ChevronRight, Eye, UserCheck
} from 'lucide-react';

export default function TaxpayerPortalDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [idrResponseText, setIdrResponseText] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Mock TP case active for taxpayer (e.g. Crest Textiles PLC)
  const activeCase = {
    caseId: 'TP-2026-LTO-0089',
    taxpayerName: 'Crest Textiles Manufacturing Share Company',
    tin: '0049281729',
    auditType: 'Transfer Pricing Comprehensive Audit',
    taxYear: '2022 - 2024',
    currentStage: 'Phase 4 - Information Request & Fact Verification',
    assignedTeam: 'LTO TP Audit Team 01',
    status: 'ACTION_REQUIRED',
    dueDate: '2026-09-18',
    openRequests: [
      {
        id: 'IDR-2026-001',
        title: 'Master File & Local File Transfer Pricing Documentation',
        issuedDate: '2026-09-01',
        dueDate: '2026-09-15',
        status: 'PENDING',
        description: 'Provide 2022-2024 OECD Chapter V compliant Master File, Local File, and Segmented Financial statements for Related Party Transactions with Crest Global Trading FZE (UAE).'
      },
      {
        id: 'IDR-2026-002',
        title: 'Royalty & Technical Service Agreement Contracts',
        issuedDate: '2026-09-03',
        dueDate: '2026-09-18',
        status: 'PENDING',
        description: 'Provide benefit test evidence (timesheets, deliverable reports, economic utility analysis) supporting the 5% management fee paid to parent company.'
      }
    ],
    notices: [
      {
        id: 'NOT-2026-0044',
        type: 'Formal Notice of Transfer Pricing Audit Commencement',
        issuedDate: '2026-08-15',
        amountProposed: 'ETB 42,500,000.00',
        status: 'ACKNOWLEDGEMENT_SENT',
        downloadUrl: '#'
      }
    ]
  };

  const handleResponseSubmit = (e) => {
    e.preventDefault();
    setSubmissionSuccess(true);
    setTimeout(() => {
      setSubmissionSuccess(false);
      setIdrResponseText('');
      setFileToUpload(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 space-y-6">
      {/* Portal Top Header */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-800 to-indigo-900 border border-blue-700/40 rounded-xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Taxpayer Compliance Portal
            </span>
            <span className="text-xs text-slate-400">TIN: {activeCase.tin}</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">{activeCase.taxpayerName}</h1>
          <p className="text-sm text-slate-300">Official MoR Transfer Pricing Statutory Response & Audit File Exchange</p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          <Building className="w-8 h-8 text-blue-400" />
          <div>
            <div className="text-xs text-slate-400">Audit Reference</div>
            <div className="text-sm font-mono font-bold text-amber-400">{activeCase.caseId}</div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Action Required</div>
            <div className="text-lg font-bold text-white">2 Open Requests</div>
            <div className="text-xs text-amber-400">Due in 11 days</div>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Audit Phase</div>
            <div className="text-sm font-semibold text-blue-200">{activeCase.currentStage}</div>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Assigned Team</div>
            <div className="text-sm font-semibold text-emerald-200">{activeCase.assignedTeam}</div>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Statutory Notice Status</div>
            <div className="text-sm font-semibold text-indigo-200">Commencement Notice Issued</div>
          </div>
        </div>
      </div>

      {/* Portal Tabs */}
      <div className="flex border-b border-slate-700 gap-6 text-sm font-medium">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition-colors ${activeTab === 'overview' ? 'text-blue-400 border-b-2 border-blue-500 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Information Requests (IDR)
        </button>
        <button 
          onClick={() => setActiveTab('notices')}
          className={`pb-3 transition-colors ${activeTab === 'notices' ? 'text-blue-400 border-b-2 border-blue-500 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Statutory Notices & Findings
        </button>
        <button 
          onClick={() => setActiveTab('upload')}
          className={`pb-3 transition-colors ${activeTab === 'upload' ? 'text-blue-400 border-b-2 border-blue-500 font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Document Submission Hub
        </button>
      </div>

      {/* Tab 1: Information Requests */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {activeCase.openRequests.map((req) => (
            <div key={req.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 font-mono text-xs border border-amber-500/30 rounded">
                    {req.id}
                  </span>
                  <h3 className="text-lg font-bold text-white">{req.title}</h3>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>Issued: {req.issuedDate}</span>
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Due: {req.dueDate}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-300 mb-4 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                {req.description}
              </p>

              <form onSubmit={handleResponseSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Taxpayer Official Response Statement
                  </label>
                  <textarea
                    rows={3}
                    value={idrResponseText}
                    onChange={(e) => setIdrResponseText(e.target.value)}
                    placeholder="Enter formal statutory response or explanation accompanying requested documents..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white rounded-lg flex items-center gap-2 border border-slate-600 transition">
                      <Upload className="w-4 h-4 text-blue-400" />
                      <span>{fileToUpload ? fileToUpload.name : 'Attach TP File (PDF/ZIP)'}</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => setFileToUpload(e.target.files[0])} 
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-lg shadow-lg flex items-center gap-2 transition"
                  >
                    <Send className="w-4 h-4" /> Submit Official Response
                  </button>
                </div>

                {submissionSuccess && (
                  <div className="p-3 bg-emerald-900/50 border border-emerald-600/50 text-emerald-200 rounded-lg text-sm flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span>Response and documents submitted successfully. Encrypted audit trail ID generated.</span>
                  </div>
                )}
              </form>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Notices */}
      {activeTab === 'notices' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white mb-2">Issued Tax Notices & Assessment Findings</h2>
          {activeCase.notices.map((notice) => (
            <div key={notice.id} className="p-4 bg-slate-900 border border-slate-700 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-slate-800 text-blue-300 px-2 py-0.5 rounded">{notice.id}</span>
                  <h4 className="font-semibold text-white">{notice.type}</h4>
                </div>
                <p className="text-xs text-slate-400 mt-1">Issued Date: {notice.issuedDate}</p>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition">
                  <Download className="w-4 h-4 text-blue-400" /> Download PDF Notice
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow flex items-center gap-1.5 transition">
                  <Eye className="w-4 h-4" /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Upload Hub */}
      {activeTab === 'upload' && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">General Document Upload Hub</h2>
          <p className="text-sm text-slate-300">
            Upload supplemental Transfer Pricing documentation (benchmarking reports, intercompany agreements, functional analysis narratives).
          </p>

          <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-8 text-center bg-slate-900/50 transition cursor-pointer">
            <Upload className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-200">Drag & drop files here, or browse from computer</p>
            <p className="text-xs text-slate-400 mt-1">Supported Formats: PDF, XLSX, ZIP (Max 100MB per file)</p>
          </div>
        </div>
      )}
    </div>
  );
}
