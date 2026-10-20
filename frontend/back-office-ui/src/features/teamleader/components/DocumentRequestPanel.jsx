/**
 * DocumentRequestPanel - Manages Information Requests and Document Intake
 * 
 * Replaces the old split between Information Request and Document Collection.
 * Allows auditors to issue statutory document requests, attach received records,
 * and directly proceed to CAAT Analysis without blocking on Team Leader approval.
 */

import { useState } from 'react';
import {
  FileSearch, FileText, FileCheck, FolderOpen, Users, Send,
  ArrowRight, CheckCircle, Clock, Upload, Plus, Download, Trash2,
  Paperclip, Info
} from 'lucide-react';
import { Card, Button, Badge } from '../../../components/ui/index.jsx';

const REQUEST_TYPES = [
  { id: 'financial_statements', label: 'Financial Statements', icon: FileText, desc: 'Audited balance sheet, P&L, trial balance' },
  { id: 'tax_returns', label: 'Tax Returns & Filings', icon: FileCheck, desc: 'VAT, withholding, employment tax returns' },
  { id: 'bank_statements', label: 'Bank Records & Reconciliations', icon: FolderOpen, desc: 'Bank statements, cashbooks, deposit slips' },
  { id: 'invoices', label: 'Invoices & Sales Ledgers', icon: FileText, desc: 'Sales invoices, purchase vouchers, receipts' },
  { id: 'contracts', label: 'Contracts & Agreements', icon: Paperclip, desc: 'Major supplier/customer commercial contracts' },
  { id: 'payroll', label: 'Payroll & Withholding', icon: Users, desc: 'Payroll sheets, provident fund, pension records' },
];

export default function DocumentRequestPanel({
  caseData,
  requests = [],
  documents = [],
  onSubmitRequest,
  onUploadDoc,
  onProceed,
}) {
  const [docType, setDocType] = useState('financial_statements');
  const [description, setDescription] = useState('');
  const [dueDays, setDueDays] = useState('15');
  const [showAddForm, setShowAddForm] = useState(requests.length === 0);
  const [submitting, setSubmitting] = useState(false);

  // File upload state
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Financial Records');

  const handleSendRequest = async () => {
    if (!description.trim()) return;
    setSubmitting(true);
    try {
      const typeObj = REQUEST_TYPES.find(r => r.id === docType);
      const title = typeObj ? typeObj.label : docType;
      const dueDate = new Date(Date.now() + parseInt(dueDays || '15') * 86400000).toISOString();

      if (onSubmitRequest) {
        await onSubmitRequest({
          documentType: title,
          description: description.trim(),
          dueDate,
        });
      }
      setDescription('');
      setShowAddForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickUpload = () => {
    if (!uploadFileName.trim()) return;
    if (onUploadDoc) {
      onUploadDoc({
        id: `doc-${Date.now()}`,
        fileName: uploadFileName.trim(),
        title: uploadFileName.trim(),
        category: uploadCategory,
        uploadedAt: new Date().toISOString(),
        fileSize: 1024 * 250,
      });
    }
    setUploadFileName('');
  };

  return (
    <div className="space-y-5">
      {/* ── Top Header Banner ── */}
      <Card className="p-5 border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/40 to-transparent dark:from-blue-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-xl">
              <FileSearch size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Step 4: Information Request &amp; Record Intake
                </h3>
                <Badge color="blue">Auditor Driven</Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Issue formal document requests to <strong className="text-gray-900 dark:text-white font-semibold">{caseData?.taxpayerName || 'the taxpayer'}</strong>. 
                Document collection is integrated directly here — you can proceed to CAAT Analysis once ready without waiting for approvals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="primary"
              icon={ArrowRight}
              size="md"
              onClick={onProceed}
            >
              Proceed to CAAT Analysis
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Issued Requests List ── */}
      {requests.length > 0 && (
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase text-gray-700 dark:text-slate-300 tracking-wider flex items-center gap-1.5">
              <FileCheck size={15} className="text-blue-600" />
              Active Information Requests ({requests.length})
            </h4>
            <Button
              variant="secondary"
              size="xs"
              icon={Plus}
              onClick={() => setShowAddForm(s => !s)}
            >
              {showAddForm ? 'Hide Form' : 'New Request'}
            </Button>
          </div>

          <div className="space-y-2.5">
            {requests.map((req, idx) => (
              <div
                key={req.id || idx}
                className="p-3.5 bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700/60 rounded-xl flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg shrink-0 mt-0.5">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      {req.title || req.documentType || 'General Document Request'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-slate-300 mt-0.5">
                      {Array.isArray(req.items) ? req.items.join(', ') : req.description || 'All relevant accounting records'}
                    </p>
                    {req.deadline && (
                      <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <Clock size={11} /> Due Date: {new Date(req.deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Badge color="blue" dot>Dispatched</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Document Request Form ── */}
      {showAddForm && (
        <Card className="p-6 space-y-5">
          <div className="border-b border-gray-100 dark:border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Plus size={16} className="text-blue-600" />
              Issue New Document &amp; Information Request
            </h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Select category and provide specific instructions for records required from the taxpayer.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 tracking-wider mb-2 block">
              Document Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {REQUEST_TYPES.map(type => {
                const Icon = type.icon;
                const isSelected = docType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setDocType(type.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm'
                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <Icon size={18} className={`mb-1.5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                    <p className={`text-xs font-bold ${isSelected ? 'text-blue-900 dark:text-blue-300' : 'text-gray-800 dark:text-slate-200'}`}>
                      {type.label}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {type.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 tracking-wider mb-1.5 block">
                Required Items &amp; Instructions *
              </label>
              <textarea
                placeholder="List specific books of accounts, general ledgers, sample invoices, or digital ERP export formats required..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="w-full sm:w-1/3">
              <label className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400 tracking-wider mb-1.5 block">
                Statutory Due Window (Days)
              </label>
              <input
                type="number"
                value={dueDays}
                onChange={e => setDueDays(e.target.value)}
                min="1"
                max="90"
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <span className="text-[10px] text-gray-500 dark:text-slate-400 mt-1 block">
                Standard compliance is 15 working days.
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={Send}
                size="md"
                loading={submitting}
                disabled={!description.trim()}
                onClick={handleSendRequest}
              >
                Send Document Request to Taxpayer
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* ── Document Intake / Received Records ── */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase text-gray-700 dark:text-slate-300 tracking-wider flex items-center gap-1.5">
              <FolderOpen size={15} className="text-indigo-600" />
              Taxpayer Records Received &amp; Uploaded ({documents.length})
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
              Attach electronic general ledgers, trial balances, or invoice batches for CAAT processing.
            </p>
          </div>
        </div>

        {/* Quick Upload Bar */}
        <div className="p-3 bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700/60 rounded-xl flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Record title e.g. Trial_Balance_2023_Final.xlsx"
            value={uploadFileName}
            onChange={e => setUploadFileName(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
          />
          <select
            value={uploadCategory}
            onChange={e => setUploadCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none"
          >
            <option value="Financial Records">Financial Records</option>
            <option value="Sales / VAT Invoices">Sales / VAT Invoices</option>
            <option value="Bank Statements">Bank Statements</option>
            <option value="Customs Declarations">Customs Declarations</option>
          </select>
          <Button
            variant="secondary"
            size="sm"
            icon={Upload}
            onClick={handleQuickUpload}
            disabled={!uploadFileName.trim()}
          >
            Record Intake
          </Button>
        </div>

        {/* Document List */}
        {documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((doc, i) => (
              <div
                key={doc.id || i}
                className="p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Paperclip size={14} className="text-gray-400 shrink-0" />
                  <span className="font-medium text-gray-900 dark:text-white truncate">
                    {doc.fileName || doc.title || 'Attached Document'}
                  </span>
                  <Badge color="gray" size="xs">{doc.category || 'Record'}</Badge>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-gray-400">
                    {new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}
                  </span>
                  <Badge color="green" size="xs">Ready for CAAT</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center border border-dashed border-gray-200 dark:border-slate-700/60 rounded-xl text-xs text-gray-400">
            No electronic records uploaded yet. You can upload files here or proceed directly to CAAT analysis with system ledger data.
          </div>
        )}

        {/* Bottom Progression Bar */}
        <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-slate-400">
            Ready to perform automated anomaly analysis?
          </span>
          <Button
            variant="primary"
            icon={ArrowRight}
            size="md"
            onClick={onProceed}
          >
            Proceed to CAAT Analysis
          </Button>
        </div>
      </Card>
    </div>
  );
}
