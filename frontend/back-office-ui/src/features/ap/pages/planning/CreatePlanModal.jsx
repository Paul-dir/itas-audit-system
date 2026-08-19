/**
 * CreatePlanModal — 3-step wizard
 *
 * Step 1: Risk Engine Analysis (view data, optionally use as defaults)
 * Step 2: Plan Basic Info (name, year, description, strategy)
 * Step 3: Case Distribution (editable table, pre-filled from risk data)
 */
import { useState, useCallback } from 'react';
import { Activity, ArrowRight, BarChart2, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Modal, Input, Textarea, Button, Alert, Select } from '../../components/ui/index.jsx';
import { EditableDistributionTable } from '../shared/DistributionTable.jsx';
import { REGIONS, AUDIT_TYPES } from '../../data/constants.js';
import RiskAnalysisDashboard from './RiskAnalysisDashboard.jsx';
import { useRiskEngine } from '../../hooks/useRiskEngine.js';
import { auditConfig } from '../../config/auditConfig.js';

const emptyDistribution = () => {
  const dist = {};
  REGIONS.forEach(r => { dist[r.id] = {}; AUDIT_TYPES.forEach(a => { dist[r.id][a.id] = 0; }); });
  return dist;
};

export default function CreatePlanModal({ open, onClose }) {
  const { actions } = useApp();
  const { user } = useAuth();
  const { planDefaults, source } = useRiskEngine();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    year: new Date().getFullYear(),
    description: '',
    strategy: '',
    riskBased: false,
  });
  const [distribution, setDistribution] = useState(emptyDistribution);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usedDefaults, setUsedDefaults] = useState(false);

  const totalCases = Object.values(distribution).reduce(
    (sum, regionDist) => sum + Object.values(regionDist).reduce((s, v) => s + v, 0), 0
  );

  const applyDefaults = useCallback((defaults) => {
    if (!defaults) return;
    // Merge defaults into current distribution (override zeros)
    const merged = emptyDistribution();
    REGIONS.forEach(r => {
      AUDIT_TYPES.forEach(a => {
        merged[r.id][a.id] = defaults[r.id]?.[a.id] ?? 0;
      });
    });
    setDistribution(merged);
    setUsedDefaults(true);
    setStep(2);
  }, []);

  const handleCreate = () => {
    if (!form.name.trim()) { setError('Plan name is required'); return; }
    if (totalCases === 0) { setError('Please distribute at least some cases across regions'); return; }
    setLoading(true);
    setTimeout(() => {
      actions.createPlan({
        ...form,
        year: parseInt(form.year),
        distribution,
        totalCases,
        createdBy: user.id,
        riskBased: usedDefaults || form.riskBased,
      });
      setLoading(false);
      handleClose();
    }, 300);
  };

  const handleClose = () => {
    onClose();
    setStep(1);
    setError('');
    setUsedDefaults(false);
    setForm({ name: '', year: new Date().getFullYear(), description: '', strategy: '', riskBased: false });
    setDistribution(emptyDistribution());
  };

  const stepTitles = {
    1: 'Create Audit Plan — Risk Engine Analysis',
    2: 'Create Audit Plan — Plan Details',
    3: 'Create Audit Plan — Case Distribution',
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={stepTitles[step]}
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <span className="inline-flex gap-1">
              {[1,2,3].map(s => (
                <span key={s} className={`w-2 h-2 rounded-full ${step === s ? 'bg-blue-600' : s < step ? 'bg-blue-300' : 'bg-gray-200'}`} />
              ))}
            </span>
            Step {step} of 3
          </div>
          <div className="flex gap-2">
            {step === 1 && (
              <>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button onClick={() => setStep(2)}>Skip → Plan Details</Button>
              </>
            )}
            {step === 2 && (
              <>
                <Button variant="secondary" onClick={() => setStep(1)}>← Back</Button>
                <Button onClick={() => {
                  if (!form.name.trim()) { setError('Plan name is required'); return; }
                  setError('');
                  setStep(3);
                }}>Next: Distribution →</Button>
              </>
            )}
            {step === 3 && (
              <>
                <Button variant="secondary" onClick={() => setStep(2)}>← Back</Button>
                <Button variant="primary" loading={loading} onClick={handleCreate}>
                  Create Plan
                </Button>
              </>
            )}
          </div>
        </div>
      }
    >
      {/* ── Step 1: Risk Engine ── */}
      {step === 1 && (
        <div className="space-y-4">
          <Alert type="info" title="Review risk data before creating your plan">
            The risk engine analysis below shows the current taxpayer risk landscape.
            Click <strong>"Create Plan with Defaults"</strong> to pre-fill the distribution table with
            risk-based recommendations — you can adjust all values in step 3.
          </Alert>
          <RiskAnalysisDashboard onUsePlanDefaults={(defaults) => applyDefaults(defaults)} />
        </div>
      )}

      {/* ── Step 2: Plan Details ── */}
      {step === 2 && (
        <div className="space-y-4">
          {error && <Alert type="error">{error}</Alert>}
          {usedDefaults && (
            <Alert type="success" title="Risk-based defaults applied ✓">
              Distribution table is pre-filled from the risk engine analysis.
              You can review and override values in step 3.
            </Alert>
          )}
          <Input
            label="Plan Name *"
            placeholder="e.g. FY 2026 National Audit Plan"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Fiscal Year"
            type="number"
            value={form.year}
            onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
          />
          <Select
            label="Audit Strategy"
            value={form.strategy}
            onChange={e => setForm(f => ({ ...f, strategy: e.target.value }))}
            placeholder="Select audit strategy..."
            options={auditConfig.auditStrategies.map(s => ({ value: s.id, label: s.name }))}
          />
          <Textarea
            label="Description"
            placeholder="Describe the plan objectives, focus sectors, risk criteria, and special considerations..."
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={4}
          />
          {!usedDefaults && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-900">
              <Activity size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Pre-fill from Risk Engine?</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                  Go back to Step 1 to view the risk analysis and use those numbers as your distribution baseline.
                </p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => setStep(1)}>
                ← View Risk Data
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── Step 3: Distribution ── */}
      {step === 3 && (
        <div className="space-y-4">
          {error && <Alert type="error">{error}</Alert>}
          {usedDefaults && (
            <Alert type="success" title={`Pre-filled from ${source === 'live' ? 'Live Risk Engine' : 'Risk Estimates'} ✓`}>
              Values below are based on risk engine recommendations. Edit any cell to override.
            </Alert>
          )}
          <Alert type="info" title="Distribute cases by Region × Audit Type">
            Enter how many cases should be allocated to each region for each audit type. Each row and column total
            is shown automatically.
          </Alert>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-slate-200">Case Distribution Table</p>
            <div className="flex items-center gap-2">
              {usedDefaults && (
                <Badge color="green" dot>Risk-based defaults</Badge>
              )}
              <div className="text-sm font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-900">
                Total: {totalCases.toLocaleString()} cases
              </div>
            </div>
          </div>
          <EditableDistributionTable distribution={distribution} onChange={setDistribution} />
          <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-slate-400">
            <CheckCircle size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
            <span>
              Effort estimate: ~{Math.round(totalCases * 40 / 2000)} auditor-years at 40 hrs/case.
              You can refine effort guidelines in Configuration.
            </span>
          </div>
        </div>
      )}
    </Modal>
  );
}

// Re-export Badge since we use it inline
function Badge({ color = 'gray', dot, children }) {
  const colors = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    gray: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.gray}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${color === 'green' ? 'bg-green-500' : 'bg-blue-500'}`} />}
      {children}
    </span>
  );
}
