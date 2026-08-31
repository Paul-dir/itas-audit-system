import { useState, useMemo, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Target, Database, Filter, Download, Play, CheckCircle, Eye, RefreshCw } from 'lucide-react';
import { useApp } from '../../../../context/AppContext.jsx';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { Card, StatCard, Button, Badge, Table, Input, Select, Modal, Alert, Tabs } from '../../../../components/ui/index.jsx';
import { AUDIT_TYPES } from '../../data/constants.js';

export default function RiskEngineDashboard() {
  const { state, actions } = useApp();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [auditTypeFilter, setAuditTypeFilter] = useState('ALL');
  const [tab, setTab] = useState('analysis');
  const [selectedTaxpayers, setSelectedTaxpayers] = useState([]);
  const [showCreateCasesModal, setShowCreateCasesModal] = useState(false);
  const [selectedAuditTypes, setSelectedAuditTypes] = useState({});
  const [selectedPlanForCases, setSelectedPlanForCases] = useState(null);
  const [mappingModal, setMappingModal] = useState(false);
  const [mappingResults, setMappingResults] = useState(null);

  // Backend taxpayer data
  const [taxpayers, setTaxpayers] = useState([]);
  const [taxpayersLoading, setTaxpayersLoading] = useState(false);
  const [taxpayersError, setTaxpayersError] = useState(null);
  const [totalTaxpayersCount, setTotalTaxpayersCount] = useState(0);

  const userTaxCenter = user.taxCenter;
  const userRegion = user.region;

  // Map frontend tax center to backend format
  const mapTaxCenter = (tc) => {
    if (!tc) return null;
    const mapping = {
      'addis_ababa-tc1': 'AA-TC1', 'addis_ababa-tc2': 'AA-TC2', 'addis_ababa-tc3': 'AA-TC3',
      'amhara-tc1': 'BA-TC1', 'amhara-tc2': 'BA-TC2', 'amhara-tc3': 'BA-TC3',
      'oromia-tc1': 'BB-TC1', 'oromia-tc2': 'BB-TC2', 'oromia-tc3': 'BB-TC3',
      'dire_dawa-tc1': 'AB-TC1', 'dire_dawa-tc2': 'AB-TC2', 'dire_dawa-tc3': 'AB-TC3',
      'snnpr-tc1': 'CA-TC1', 'snnpr-tc2': 'CA-TC2', 'snnpr-tc3': 'CA-TC3',
      'somali-tc1': 'SO-TC1', 'somali-tc2': 'SO-TC2', 'somali-tc3': 'SO-TC3',
    };
    return mapping[tc] || tc;
  };

  // Fetch taxpayers from backend
  useEffect(() => {
    const fetchTaxpayers = async () => {
      const tcCode = mapTaxCenter(userTaxCenter);
      if (!tcCode) return;
      setTaxpayersLoading(true);
      setTaxpayersError(null);
      try {
        const response = await fetch(
          `/api/v1/backoffice/ap/tax-center/taxpayers?taxCenterCode=${tcCode}`,
          { headers: { 'X-Actor-Id': user.id || 'tax-center-staff' } }
        );
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const result = await response.json();
        // Transform backend data to frontend format
        const rawTaxpayers = result.data?.taxpayers || [];
        const transformed = rawTaxpayers.map(tp => ({
          id: tp.tin || tp.id || `tp-${Math.random().toString(36).slice(2)}`,
          tin: tp.tin || 'N/A',
          name: tp.name || tp.businessName || 'Unknown',
          sector: tp.sector || tp.industry || 'Unknown',
          riskScore: tp.riskScore || 0,
          riskLevel: tp.riskLevel || 'LOW',
          suggestedAuditType: tp.recommendedAuditType || tp.suggestedAuditType || 'desk_audit',
          annualRevenue: tp.annualRevenue || tp.revenue || 0,
          employees: tp.employees || tp.employeeCount || 0,
        }));
        setTaxpayers(transformed);
        const totalCount = result.data?.totalTaxpayers || transformed.length;
        setTotalTaxpayersCount(totalCount);
        console.log('✅ Taxpayers loaded from backend:', transformed.length, 'total:', totalCount);
      } catch (error) {
        console.error('Failed to fetch taxpayers:', error);
        setTaxpayersError(error.message);
        setTaxpayers([]);
      } finally {
        setTaxpayersLoading(false);
      }
    };
    fetchTaxpayers();
  }, [userTaxCenter, user.id]);

  // Filter taxpayers
  const filteredTaxpayers = useMemo(() => {
    return taxpayers.filter(tp => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!tp.name?.toLowerCase().includes(q) && !tp.tin?.toLowerCase().includes(q) && !tp.sector?.toLowerCase().includes(q)) return false;
      }
      if (riskFilter !== 'ALL' && tp.riskLevel !== riskFilter) return false;
      if (sectorFilter !== 'ALL' && tp.sector !== sectorFilter) return false;
      if (auditTypeFilter !== 'ALL' && tp.suggestedAuditType !== auditTypeFilter) return false;
      return true;
    });
  }, [taxpayers, searchQuery, riskFilter, sectorFilter, auditTypeFilter]);

  const sectors = useMemo(() => [...new Set(taxpayers.map(tp => tp.sector))].sort(), [taxpayers]);

  const riskStats = useMemo(() => ({
    total: totalTaxpayersCount || filteredTaxpayers.length,
    CRITICAL: filteredTaxpayers.filter(tp => tp.riskLevel === 'CRITICAL').length,
    HIGH: filteredTaxpayers.filter(tp => tp.riskLevel === 'HIGH').length,
    MEDIUM: filteredTaxpayers.filter(tp => tp.riskLevel === 'MEDIUM').length,
    LOW: filteredTaxpayers.filter(tp => tp.riskLevel === 'LOW').length,
  }), [filteredTaxpayers, totalTaxpayersCount]);

  const auditTypeStats = useMemo(() => {
    const stats = {};
    AUDIT_TYPES.forEach(at => {
      stats[at.id] = filteredTaxpayers.filter(tp => tp.suggestedAuditType === at.id).length;
    });
    return stats;
  }, [filteredTaxpayers]);

  // Available plans from state (deployed/approved plans)
  const availablePlans = useMemo(() => {
    return state.plans.filter(p =>
      ['APPROVED_TO_REGIONS', 'FINALIZED', 'SENIOR_MGMT_APPROVED'].includes(p.status)
    );
  }, [state.plans]);

  // Selection
  const toggleTaxpayerSelection = (id) => {
    setSelectedTaxpayers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedTaxpayers(prev =>
      prev.length === filteredTaxpayers.length ? [] : filteredTaxpayers.map(tp => tp.id)
    );
  };

  // Create cases modal
  const openCreateCasesModal = () => {
    if (selectedTaxpayers.length === 0) { alert('Select at least one taxpayer.'); return; }
    if (availablePlans.length === 0) { alert('No available plans for case creation.'); return; }
    const selections = {};
    selectedTaxpayers.forEach(tpId => {
      const tp = taxpayers.find(t => t.id === tpId);
      if (tp) selections[tpId] = tp.suggestedAuditType || 'desk_audit';
    });
    setSelectedAuditTypes(selections);
    setSelectedPlanForCases(availablePlans[0]?.id || null);
    setShowCreateCasesModal(true);
  };

  // Trigger cascade via backend
  const handleCreateCasesFromSelection = async () => {
    if (!selectedPlanForCases) { alert('Select a plan.'); return; }
    try {
      const planId = selectedPlanForCases;
      const tcCode = mapTaxCenter(userTaxCenter);
      const cascadeBody = { taxCenterCode: tcCode };
      // Pass audit type filter if user has one selected
      if (auditTypeFilter && auditTypeFilter !== 'ALL') {
        cascadeBody.auditTypes = [auditTypeFilter];
      }
      const response = await fetch(`/api/v1/backoffice/ap/plans/${planId}/cascade-to-cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Actor-Id': user.id || 'tax-center-staff' },
        body: JSON.stringify(cascadeBody)
      });
      const result = await response.json();
      if (result.status === 'ERROR') throw new Error(result.error?.message || 'Cascade failed');
      alert(`✅ Success!\n\n${result.data?.totalCasesCreated || 0} audit cases created via risk engine cascade.`);
      setShowCreateCasesModal(false);
      setSelectedTaxpayers([]);
    } catch (error) {
      alert(`❌ Failed: ${error.message}`);
    }
  };

  const handleAuditTypeChange = (tpId, at) => {
    setSelectedAuditTypes(prev => ({ ...prev, [tpId]: at }));
  };

  const columns = [
    {
      key: 'select',
      label: <input type="checkbox" checked={selectedTaxpayers.length === filteredTaxpayers.length && filteredTaxpayers.length > 0}
        onChange={toggleSelectAll} className="w-4 h-4 text-blue-600 rounded" />,
      render: (_, row) => <input type="checkbox" checked={selectedTaxpayers.includes(row.id)}
        onChange={() => toggleTaxpayerSelection(row.id)} className="w-4 h-4 text-blue-600 rounded" />
    },
    { key: 'tin', label: 'TIN', render: v => <span className="font-mono text-xs text-gray-600 dark:text-slate-400">{v}</span> },
    { key: 'name', label: 'Taxpayer', render: (v, row) => (
      <div><p className="text-sm font-medium text-gray-900 dark:text-white">{v}</p><p className="text-xs text-gray-500">{row.sector}</p></div>
    )},
    { key: 'riskScore', label: 'Risk Score', render: (v, row) => (
      <div className="flex items-center gap-2">
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div className={`h-2 rounded-full ${row.riskLevel === 'CRITICAL' ? 'bg-red-500' : row.riskLevel === 'HIGH' ? 'bg-orange-500' : row.riskLevel === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'}`}
            style={{ width: `${v}%` }} />
        </div>
        <span className="text-sm font-semibold text-gray-900 tabular-nums">{v}</span>
      </div>
    )},
    { key: 'riskLevel', label: 'Risk', render: v => {
      const colors = { CRITICAL: 'red', HIGH: 'orange', MEDIUM: 'yellow', LOW: 'blue' };
      return <Badge color={colors[v]} dot>{v}</Badge>;
    }},
    { key: 'suggestedAuditType', label: 'Suggested Audit', render: v => {
      const at = AUDIT_TYPES.find(a => a.id === v);
      return <Badge color={at?.color || 'gray'}>{at?.shortName || v}</Badge>;
    }},
    { key: 'annualRevenue', label: 'Revenue', render: v => <span className="text-xs text-gray-600">{(v / 1000000).toFixed(1)}M</span> },
    { key: 'estimatedRevenue', label: 'Est. Recovery', render: v => (
      <span className="text-xs font-semibold text-green-700">{(v / 1000000).toFixed(1)}M ETB</span>
    ) },
  ];

  const tabs = [
    { id: 'analysis', label: 'Risk Analysis', count: filteredTaxpayers.length },
    { id: 'mapping', label: 'Plan Mapping', count: availablePlans.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Risk Engine Analysis</h1>
          <p className="text-sm text-gray-500 mt-1">
            AI-powered risk assessment and taxpayer mapping for {userTaxCenter ? mapTaxCenter(userTaxCenter) : 'your tax center'}
          </p>
        </div>
        <Button size="sm" variant="secondary" icon={RefreshCw} onClick={() => window.location.reload()}>Refresh</Button>
      </div>

      {taxpayersLoading && (
        <Card><div className="text-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-gray-500">Loading taxpayers from registration system...</p>
        </div></Card>
      )}

      {taxpayersError && (
        <Alert type="error" title="Failed to load taxpayers">{taxpayersError}</Alert>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard label="Total Taxpayers" value={riskStats.total.toLocaleString()} icon={Database} color="blue" sub="In database" />
        <StatCard label="Critical Risk" value={riskStats.CRITICAL} icon={AlertTriangle} color="red" sub="Immediate attention" />
        <StatCard label="High Risk" value={riskStats.HIGH} icon={TrendingUp} color="orange" sub="Priority audits" />
        <StatCard label="Medium Risk" value={riskStats.MEDIUM} icon={Target} color="yellow" sub="Regular monitoring" />
        <StatCard label="Low Risk" value={riskStats.LOW} icon={CheckCircle} color="green" sub="Compliant" />
        <StatCard label="Est. Revenue" value={`${(filteredTaxpayers.reduce((s, tp) => s + (tp.estimatedRevenue || 0), 0) / 1_000_000).toFixed(0)}M`} icon={Target} color="green" sub="ETB expected recovery" />
      </div>

      <Card padding={false}>
        <div className="px-6 pt-4 pb-0">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />
        </div>

        {tab === 'analysis' && (
          <div className="p-6 space-y-4">
            {selectedTaxpayers.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-blue-600" size={24} />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">{selectedTaxpayers.length} taxpayer{selectedTaxpayers.length > 1 ? 's' : ''} selected</p>
                    <p className="text-xs text-blue-700">Create audit cases from selected taxpayers</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setSelectedTaxpayers([])}>Clear</Button>
                  <Button size="sm" variant="success" icon={Play} onClick={openCreateCasesModal}>Create Cases</Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <Input placeholder="Search taxpayer, TIN, sector..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <Select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
                <option value="ALL">All Risk Levels</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </Select>
              <Select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}>
                <option value="ALL">All Sectors</option>
                {sectors.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
              <Select value={auditTypeFilter} onChange={(e) => setAuditTypeFilter(e.target.value)}>
                <option value="ALL">All Audit Types</option>
                {AUDIT_TYPES.map(at => <option key={at.id} value={at.id}>{at.name}</option>)}
              </Select>
              <Button variant="secondary" icon={Download} size="sm">Export CSV</Button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 dark:bg-slate-700">
              <p className="text-sm font-semibold text-gray-700 mb-3">Recommended Audit Types</p>
              <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
                {AUDIT_TYPES.map(at => (
                  <div key={at.id} className="bg-white rounded-lg border border-gray-200 px-3 py-2 text-center">
                    <p className="text-xs text-gray-500">{at.shortName}</p>
                    <p className="text-lg font-bold text-gray-900 tabular-nums">{auditTypeStats[at.id]}</p>
                  </div>
                ))}
              </div>
            </div>

            <Table columns={columns} rows={filteredTaxpayers} emptyMessage={taxpayersLoading ? 'Loading...' : 'No taxpayers match your filters'} />
          </div>
        )}

        {tab === 'mapping' && (
          <div className="p-6 space-y-4">
            <Alert type="info" title="Plan Mapping">
              Map taxpayers from the risk engine to approved audit plans. The system selects the highest-risk taxpayers for each audit type.
            </Alert>
            {availablePlans.length === 0 ? (
              <Alert type="warning">No approved plans found.</Alert>
            ) : (
              <div className="space-y-3">
                {availablePlans.map(plan => (
                  <Card key={plan.id}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 dark:text-white">{plan.name}</p>
                          <Badge color={plan.status === 'FINALIZED' ? 'green' : 'purple'} dot>{plan.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">FY {plan.planYear}</p>
                      </div>
                      <Button size="sm" variant="primary" icon={Play}
                        onClick={() => {
                          setSelectedPlanForCases(plan.id);
                          setSelectedTaxpayers(filteredTaxpayers.map(tp => tp.id));
                          openCreateCasesModal();
                        }}>Map & Create</Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Create Cases Modal */}
      {showCreateCasesModal && (
        <Modal open={showCreateCasesModal} onClose={() => setShowCreateCasesModal(false)}
          title="Create Cases from Selected Taxpayers" size="xl"
          footer={
            <div className="flex justify-between w-full">
              <Button variant="secondary" onClick={() => setShowCreateCasesModal(false)}>Cancel</Button>
              <Button variant="success" icon={CheckCircle} onClick={handleCreateCasesFromSelection} disabled={!selectedPlanForCases}>
                Create {selectedTaxpayers.length} Cases
              </Button>
            </div>
          }>
          <div className="space-y-4">
            <Alert type="info">{selectedTaxpayers.length} taxpayers selected. Choose a plan and review audit types.</Alert>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <label className="block text-sm font-semibold text-blue-900 mb-2">Select Plan *</label>
              <select value={selectedPlanForCases || ''} onChange={(e) => setSelectedPlanForCases(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-blue-300 rounded-lg bg-white dark:bg-gray-800">
                <option value="">-- Select a Plan --</option>
                {availablePlans.map(p => <option key={p.id} value={p.id}>{p.name} - FY {p.planYear}</option>)}
              </select>
            </div>
            <div className="bg-white rounded-xl border overflow-hidden max-h-80 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0 dark:bg-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Taxpayer</th>
                    <th className="px-4 py-3 text-center font-semibold">Risk</th>
                    <th className="px-4 py-3 text-center font-semibold">Suggested</th>
                    <th className="px-4 py-3 text-left font-semibold">Audit Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedTaxpayers.map(tpId => {
                    const tp = taxpayers.find(t => t.id === tpId);
                    if (!tp) return null;
                    const riskColors = { CRITICAL: 'red', HIGH: 'orange', MEDIUM: 'yellow', LOW: 'blue' };
                    return (
                      <tr key={tpId} className="hover:bg-blue-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{tp.name}</p>
                          <p className="text-xs text-gray-500">{tp.sector} • {tp.tin}</p>
                        </td>
                        <td className="px-4 py-3 text-center"><Badge color={riskColors[tp.riskLevel]} dot size="sm">{tp.riskLevel}</Badge></td>
                        <td className="px-4 py-3 text-center">
                          <Badge color={AUDIT_TYPES.find(a => a.id === tp.suggestedAuditType)?.color || 'gray'} size="sm">
                            {AUDIT_TYPES.find(a => a.id === tp.suggestedAuditType)?.shortName || 'N/A'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <select value={selectedAuditTypes[tpId] || tp.suggestedAuditType}
                            onChange={(e) => handleAuditTypeChange(tpId, e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border rounded-lg">
                            {AUDIT_TYPES.map(at => <option key={at.id} value={at.id}>{at.name}</option>)}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-sm font-semibold text-green-900">📊 {selectedTaxpayers.length} cases will be created via risk engine cascade</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
