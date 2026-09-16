import React, { useState } from 'react';
import { 
  BarChart2, FileText, CheckCircle2, AlertTriangle, 
  Layers, Calculator, Check, ArrowRight, DollarSign,
  Scale, Clock, TrendingUp, Search, Info
} from 'lucide-react';
import { Card, Button, Badge, Input, Textarea, Select } from '../../../../components/ui/index.jsx';

export default function Phase4SubSteps({
  subStepId,
  fullState,
  selectedMethod,
  setSelectedMethod,
  methodJustification,
  setMethodJustification,
  iqrMin,
  setIqrMin,
  iqrMedian,
  setIqrMedian,
  iqrMax,
  setIqrMax,
  taxpayerResult,
  setTaxpayerResult,
  varianceAmt,
  setVarianceAmt,
  completedSubSteps,
  onToggleComplete,
  saving,
  executeApiAction
}) {
  const isDone = completedSubSteps.includes(subStepId);

  // States for Economic Analysis
  const [testedParty, setTestedParty] = useState('Local Manufacturing & Distribution Entity (Ethiopian S.C.)');
  const [testedPartyRationale, setTestedPartyRationale] = useState('Selected because it possesses the least complex functional profile, owns routine assets, and reliable audited financial statements are available.');
  const [pliType, setPliType] = useState('Operating Margin (OM = Operating Profit / Net Sales)');
  const [comparableSearchStrategy, setComparableSearchStrategy] = useState('Database search using Pan-African and Emerging Markets Orbis/TP Catalyst comparable sets. Quantitative independence filter >50%, 3-year active financial reporting, NACE/SIC code match.');
  const [workingCapitalAdjustments, setWorkingCapitalAdjustments] = useState('Adjustments applied for differences in trade accounts receivable (+0.3%), inventory turnover days (-0.15%), and trade accounts payable (+0.1%) benchmarked at commercial prime rate (14.5%).');

  // Sub-step 4.1: Most Appropriate Method (MAM) Selection
  if (subStepId === '4.1') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
          <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
            <Scale size={15} /> Most Appropriate Method (MAM) Evaluation — Directive No. 43/2015
          </h4>
          <p className="text-xs text-indigo-800 dark:text-indigo-300 mt-1">
            Under Article 79 and statutory TP Directives, select the most appropriate method among: CUP, Resale Price Method, Cost Plus Method, TNMM, or Profit Split.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Selected Primary TP Method
            </label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full text-xs font-bold p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="TNMM">TNMM - Transactional Net Margin Method (Recommended)</option>
              <option value="CUP">CUP - Comparable Uncontrolled Price Method</option>
              <option value="RESALE_PRICE">Resale Price Method (RPM)</option>
              <option value="COST_PLUS">Cost Plus Method (CPM)</option>
              <option value="PROFIT_SPLIT">Profit Split Method (PSM)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Method Selection Justification
            </label>
            <Textarea
              value={methodJustification || 'TNMM is the most reliable method due to product differentiation and absence of sufficiently detailed internal or external CUP data for specialized management services.'}
              onChange={(e) => setMethodJustification(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('4.1', !isDone, { selectedMethod, methodJustification })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 4.1 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 4.1 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 4.2: Tested Party Identification
  if (subStepId === '4.2') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Layers size={15} /> Tested Party Designation Rationale
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Designate the tested party (local entity vs. foreign affiliate) whose operating profit is tested against independent comparables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Designated Tested Party
            </label>
            <Input
              value={testedParty}
              onChange={(e) => setTestedParty(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Least Complex Profile Rationale
            </label>
            <Textarea
              value={testedPartyRationale}
              onChange={(e) => setTestedPartyRationale(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('4.2', !isDone, { testedParty, testedPartyRationale })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 4.2 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 4.2 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 4.3: Profit Level Indicator (PLI) Selection
  if (subStepId === '4.3') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <BarChart2 size={15} /> Profit Level Indicator (PLI)
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Choose the financial ratio that measures the relationship between profit and costs incurred, sales, or assets employed.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Selected Profit Level Indicator
          </label>
          <select
            value={pliType}
            onChange={(e) => setPliType(e.target.value)}
            className="w-full text-xs font-bold p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="Operating Margin">Operating Margin (OM = EBIT / Net Sales) — Recommended for distribution/manufacturing</option>
            <option value="Full Cost Plus">Net Cost Plus (NCP = EBIT / Total Costs) — Recommended for contract service providers</option>
            <option value="Berry Ratio">Berry Ratio (Gross Profit / Operating Expenses) — Recommended for intermediary logistics</option>
            <option value="ROCE">Return on Capital Employed (EBIT / Capital Employed) — Capital-intensive operations</option>
          </select>
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('4.3', !isDone, { pliType })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 4.3 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 4.3 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 4.4: Comparable Search & Screening Strategy
  if (subStepId === '4.4') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
            <Search size={15} /> Database Search Matrix & Screening Filters
          </h4>
          <p className="text-xs text-blue-800 dark:text-blue-300 mt-1">
            Document database parameters, independence thresholds, activity codes, and quantitative/qualitative rejection logs.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Search Strategy & Independence Rejection Matrix
          </label>
          <Textarea
            value={comparableSearchStrategy}
            onChange={(e) => setComparableSearchStrategy(e.target.value)}
            rows={5}
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('4.4', !isDone, { comparableSearchStrategy })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 4.4 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 4.4 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 4.5: Economic & Working Capital Adjustments
  if (subStepId === '4.5') {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Calculator size={15} /> Working Capital Financing Adjustments
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Eliminate material differences in accounts receivable, inventory, and accounts payable to ensure economic parity with comparables.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Working Capital Adjustment Schedule
          </label>
          <Textarea
            value={workingCapitalAdjustments}
            onChange={(e) => setWorkingCapitalAdjustments(e.target.value)}
            rows={5}
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={() => onToggleComplete('4.5', !isDone, { workingCapitalAdjustments })}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 4.5 Completed ✓ (Click to Undo)' : 'Mark Sub-Step 4.5 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  // Sub-step 4.6: Interquartile Range (IQR) & Median Calculation
  if (subStepId === '4.6') {
    const revenue = Number(fullState?.caseDetails?.estimatedRevenue || 575000000);
    const variance = (taxpayerResult < iqrMin) ? Math.round(revenue * ((iqrMedian - taxpayerResult) / 100)) : 0;

    return (
      <div className="space-y-4">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
          <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp size={15} /> Statutory Interquartile Range (IQR) & Arm's Length Adjustment
          </h4>
          <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
            Under Article 79, if the tested party's actual result falls outside the arm's length range (25th to 75th percentile), the tax base must be adjusted to the Median (50th percentile).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <span className="text-xs text-slate-500 uppercase font-bold">25th Percentile (Min)</span>
            <Input
              type="number"
              step="0.1"
              value={iqrMin}
              onChange={(e) => setIqrMin(Number(e.target.value))}
              className="text-center font-bold text-base mt-2"
            />
            <span className="text-[11px] text-slate-400">Lower Quartile Q1</span>
          </Card>
          <Card className="p-4 text-center border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-900/10">
            <span className="text-xs text-blue-600 dark:text-blue-400 uppercase font-bold">Median (50th Pct)</span>
            <Input
              type="number"
              step="0.1"
              value={iqrMedian}
              onChange={(e) => setIqrMedian(Number(e.target.value))}
              className="text-center font-bold text-base mt-2 text-blue-600"
            />
            <span className="text-[11px] text-blue-500">Statutory Target Point</span>
          </Card>
          <Card className="p-4 text-center">
            <span className="text-xs text-slate-500 uppercase font-bold">75th Percentile (Max)</span>
            <Input
              type="number"
              step="0.1"
              value={iqrMax}
              onChange={(e) => setIqrMax(Number(e.target.value))}
              className="text-center font-bold text-base mt-2"
            />
            <span className="text-[11px] text-slate-400">Upper Quartile Q3</span>
          </Card>
          <Card className="p-4 text-center border-rose-200 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-900/10">
            <span className="text-xs text-rose-600 dark:text-rose-400 uppercase font-bold">Taxpayer Actual EBIT</span>
            <Input
              type="number"
              step="0.1"
              value={taxpayerResult}
              onChange={(e) => setTaxpayerResult(Number(e.target.value))}
              className="text-center font-bold text-base mt-2 text-rose-600"
            />
            <span className="text-[11px] text-rose-500">Below Q1 Range</span>
          </Card>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase font-bold">Computed TP Primary Adjustment to Median:</span>
            <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-0.5">
              ETB {variance.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500">
              Tested EBIT {taxpayerResult}% adjusted to Median {iqrMedian}% across audited base of ETB {revenue.toLocaleString()}
            </p>
          </div>
          <Badge color="red" size="lg">Adjustment Required</Badge>
        </div>

        <div className="flex justify-end pt-3">
          <Button
            size="sm"
            onClick={async () => {
              setVarianceAmt(variance);
              await executeApiAction('/analysis/recalculate', {
                armsLengthRangeMin: iqrMin,
                armsLengthRangeMedian: iqrMedian,
                armsLengthRangeMax: iqrMax,
                taxpayerActualResult: taxpayerResult,
                varianceAmount: variance
              }, 'Economic benchmarking model saved.');
              onToggleComplete('4.6', !isDone, { iqrMin, iqrMedian, iqrMax, taxpayerResult, varianceAmount: variance });
            }}
            disabled={saving}
            className={isDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            <Check size={14} className="mr-1.5" />
            {isDone ? 'Sub-Step 4.6 Completed ✓ (Click to Undo)' : 'Save & Mark Sub-Step 4.6 Complete'}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
