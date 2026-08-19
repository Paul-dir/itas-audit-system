import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Badge from '../Badge';
import CreatePlanModal from '../modals/CreatePlanModal';
import { useData } from '../../services/dataService';
import { submitPlanToDirector, cascadePlanToCases, getStatusDisplay, getBadgeClass } from '../../utils/businessLogic';

function AuditTeamView() {
  const [plans, setPlans] = useState([]);
  const { data, updateData } = useData();
  const [showModal, setShowModal] = useState(false);

  const loadPlans = () => {
    // Using data from hook
    setPlans(data.plans);
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleSubmitToDirector = (planId) => {
    if (submitPlanToDirector(planId)) {
      alert('Plan submitted to Director.');
      loadPlans();
    } else {
      alert('Cannot submit. Plan must be in DRAFT status.');
    }
  };

  const handleCascade = (planId) => {
    if (window.confirm('Are you sure you want to cascade this plan to cases?')) {
      if (cascadePlanToCases(planId)) {
        alert('Plan cascaded successfully!');
        loadPlans();
      } else {
        alert('Cannot cascade. Plan must be SENIOR_APPROVED.');
      }
    }
  };

  const handleViewDetails = (planId) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    let msg = `Plan: ${plan.id}\nYear: ${plan.year}\nStatus: ${plan.status}\nTotal: ${plan.nationalTotal}\n\nAllocations:\n`;
    plan.allocations.forEach(a => {
      msg += `${a.region}: ${a.total} (Desk:${a.desk}, Field:${a.field}, TP:${a.tp}, Issue:${a.issue})\n`;
    });
    alert(msg);
  };

  const stats = {
    draft: plans.filter(p => p.status === 'DRAFT').length,
    withDirector: plans.filter(p => p.status === 'SUBMITTED_TO_DIRECTOR').length,
    withSenior: plans.filter(p => p.status === 'SUBMITTED_TO_SENIOR_MANAGEMENT').length,
    approved: plans.filter(p => p.status === 'SENIOR_APPROVED').length,
    readyCascade: plans.filter(p => p.status === 'SENIOR_APPROVED').length
  };

  const renderActions = (plan) => {
    if (plan.status === 'DRAFT') {
      return (
        <button className="btn btn-sm btn-primary" onClick={() => handleSubmitToDirector(plan.id)}>
          Submit to Director
        </button>
      );
    } else if (plan.status === 'SUBMITTED_TO_DIRECTOR') {
      return <Badge status="With Director" className="submitted" />;
    } else if (plan.status === 'DIRECTOR_APPROVED' || plan.status === 'FEEDBACK_COLLECTED') {
      return <Badge status="Director Approved" className="director-approved" />;
    } else if (plan.status === 'SUBMITTED_TO_SENIOR_MANAGEMENT') {
      return <Badge status="With Senior Mgmt" className="senior-pending" />;
    } else if (plan.status === 'SENIOR_APPROVED') {
      return (
        <button className="btn btn-sm btn-success" onClick={() => handleCascade(plan.id)}>
          <i className="fas fa-arrow-down"></i> Cascade
        </button>
      );
    } else if (plan.status === 'CASCADED') {
      return <Badge status="Cascaded" className="cascaded" />;
    } else if (plan.status === 'AWAITING_FEEDBACK') {
      return <Badge status="With Branches" className="feedback" />;
    }
    return '-';
  };

  return (
    <div>
      <div className="cards">
        <Card title="Draft" number={stats.draft} icon="fas fa-pen" />
        <Card title="With Director" number={stats.withDirector} icon="fas fa-paper-plane" />
        <Card title="With Senior" number={stats.withSenior} icon="fas fa-crown" />
        <Card title="Approved" number={stats.approved} icon="fas fa-check-circle" />
        <Card title="Ready to Cascade" number={stats.readyCascade} icon="fas fa-arrow-down" />
      </div>

      <div className="action-bar">
        <div></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus"></i> New Plan
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Year</th>
              <th>Status</th>
              <th>Total</th>
              <th>Regions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.length === 0 ? (
              <tr><td colSpan="6">No national plans yet.</td></tr>
            ) : (
              plans.map(plan => (
                <tr key={plan.id}>
                  <td>{plan.id}</td>
                  <td>{plan.year}</td>
                  <td>
                    <Badge status={getStatusDisplay(plan.status)} className={getBadgeClass(plan.status)} />
                  </td>
                  <td>{plan.nationalTotal}</td>
                  <td>{plan.allocations.length}</td>
                  <td>{renderActions(plan)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && <CreatePlanModal onClose={() => { setShowModal(false); loadPlans(); }} />}
    </div>
  );
}

export default AuditTeamView;
