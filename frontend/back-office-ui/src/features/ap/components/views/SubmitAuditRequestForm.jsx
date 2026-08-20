import React, { useState } from 'react';
import Badge from '../Badge';
import { useData } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';

/**
 * SubmitAuditRequestForm
 * Form for Directorate Requester and External Stakeholder to submit audit requests
 */

function SubmitAuditRequestForm({ userRole }) {
  const { getUserInfo } = useAuth();
  const { data, updateData } = useData();
  const userInfo = getUserInfo();
  const isDirectorate = userRole === 'directorate_requester';

  const [formData, setFormData] = useState({
    requesterType: isDirectorate ? 'Directorate' : 'External Stakeholder',
    directorateName: '',
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    requestType: 'Tax Clearance',
    taxpayerName: '',
    tin: '',
    priority: 'Medium',
    region: 'Addis Ababa',
    reason: '',
    justification: '',
    supportingNotes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (isDirectorate && !formData.directorateName.trim()) {
      errors.push('Directorate Name is required');
    }
    if (!isDirectorate && !formData.organizationName.trim()) {
      errors.push('Organization Name is required');
    }
    if (!formData.contactPerson.trim()) {
      errors.push('Contact Person is required');
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Valid Email Address is required');
    }
    if (!isDirectorate && !formData.phone.trim()) {
      errors.push('Phone Number is required');
    }
    if (!formData.taxpayerName.trim()) {
      errors.push('Taxpayer Name is required');
    }
    if (!formData.tin.trim() || !/^[A-Za-z0-9]{8,}$/.test(formData.tin)) {
      errors.push('Valid TIN is required (8+ alphanumeric characters)');
    }
    if (!formData.reason.trim()) {
      errors.push('Reason for Request is required');
    }
    if (!formData.justification.trim()) {
      errors.push('Justification is required');
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      alert('Please fix the following errors:\n' + errors.join('\n'));
      return;
    }

    // Using data from hook
    if (!data.auditRequests) {
      data.auditRequests = [];
    }

    const newRequest = {
      id: `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      requesterType: formData.requesterType,
      requesterInfo: {
        name: isDirectorate ? formData.directorateName : formData.organizationName,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        directorateName: isDirectorate ? formData.directorateName : null
      },
      requestType: formData.requestType,
      taxpayerName: formData.taxpayerName,
      tin: formData.tin,
      region: formData.region,
      priority: formData.priority,
      reason: formData.reason,
      justification: formData.justification,
      status: 'PENDING_REVIEW',
      submittedDate: new Date().toISOString(),
      submittedBy: userInfo?.fullName || 'User',
      lastModified: new Date().toISOString(),
      attachments: [],
      supportingNotes: formData.supportingNotes
    };

    data.auditRequests.push(newRequest);
    updateData(data);

    console.log('✓ Audit request submitted:', {
      requestId: newRequest.id,
      taxpayer: newRequest.taxpayerName,
      tin: newRequest.tin,
      requesterType: newRequest.requesterType,
      requesterName: newRequest.requesterInfo.name,
      status: newRequest.status
    });

    setSubmittedRequestId(newRequest.id);
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      requesterType: isDirectorate ? 'Directorate' : 'External Stakeholder',
      directorateName: '',
      organizationName: '',
      contactPerson: '',
      email: '',
      phone: '',
      requestType: 'Tax Clearance',
      taxpayerName: '',
      tin: '',
      priority: 'Medium',
      region: 'Addis Ababa',
      reason: '',
      justification: '',
      supportingNotes: ''
    });
  };

  if (submitted) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{
          background: '#1a3a1a',
          color: '#4caf50',
          padding: '40px',
          borderRadius: '8px',
          border: '2px solid #4caf50',
          textAlign: 'center',
          marginTop: '60px'
        }}>
          <i className="fas fa-check-circle" style={{ fontSize: '48px', color: '#4caf50', marginBottom: '16px', display: 'block' }}></i>
          <h2 style={{ color: '#4caf50', margin: '0 0 12px 0' }}>✓ Request Submitted Successfully</h2>
          <p style={{ color: '#a8d5a8', margin: '0 0 24px 0', fontSize: '15px', lineHeight: '1.6' }}>
            Your audit request has been submitted and is now pending review by the Process Owner.
          </p>
          <div style={{
            background: '#0f1419',
            border: '1px solid #4caf50',
            padding: '16px',
            borderRadius: '6px',
            marginBottom: '24px'
          }}>
            <p style={{ color: '#a8d5a8', margin: '0 0 8px 0', fontSize: '13px' }}>
              <strong>Request ID:</strong> <span style={{ color: '#4caf50', fontFamily: 'monospace' }}>{submittedRequestId}</span>
            </p>
            <p style={{ color: '#a8d5a8', margin: '0 0 8px 0', fontSize: '13px' }}>
              <strong>Taxpayer:</strong> {formData.taxpayerName}
            </p>
            <p style={{ color: '#a8d5a8', margin: '0', fontSize: '13px' }}>
              <strong>Status:</strong> Pending Review
            </p>
          </div>
          <p style={{ color: '#a8d5a8', margin: '0 0 24px 0', fontSize: '13px' }}>
            You can track the status of your request in "My Requests". You will receive a confirmation email at <strong>{formData.email}</strong>.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              handleReset();
            }}
            style={{
              padding: '12px 24px',
              background: '#4caf50',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-plus-circle"></i> Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div className="detail-header">
        <h2><i className="fas fa-plus-circle"></i> Submit Audit Request</h2>
        <Badge status={isDirectorate ? 'Directorate Requester' : 'External Stakeholder'} className="pending" />
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{
          background: '#1c2128',
          padding: '24px',
          borderRadius: '8px',
          border: '1px solid #30363d'
        }}>
          {/* Requester Information Section */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ color: '#f0f6fc', margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600' }}>
              <i className="fas fa-user-circle"></i> Requester Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              {isDirectorate ? (
                <div>
                  <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                    Directorate Name *
                  </label>
                  <input
                    type="text"
                    name="directorateName"
                    value={formData.directorateName}
                    onChange={handleChange}
                    placeholder="Enter directorate name"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      background: '#0f1419',
                      color: '#f0f6fc',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              ) : (
                <div>
                  <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder="Enter organization name"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      background: '#0f1419',
                      color: '#f0f6fc',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                  Contact Person *
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="Name of contact person"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    background: '#0f1419',
                    color: '#f0f6fc',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    background: '#0f1419',
                    color: '#f0f6fc',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {!isDirectorate && (
                <div>
                  <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+251 9 XXXXXXXX"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      background: '#0f1419',
                      color: '#f0f6fc',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Request Details Section */}
          <div style={{ marginBottom: '24px', paddingTop: '16px', borderTop: '1px solid #30363d' }}>
            <h3 style={{ color: '#f0f6fc', margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600' }}>
              <i className="fas fa-file-alt"></i> Request Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                  Request Type *
                </label>
                <select
                  name="requestType"
                  value={formData.requestType}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    background: '#0f1419',
                    color: '#f0f6fc',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Tax Clearance">Tax Clearance</option>
                  <option value="Business Closure">Business Closure</option>
                  <option value="Compliance Check">Compliance Check</option>
                  <option value="Transfer Verification">Transfer Verification</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                  Priority Level
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    background: '#0f1419',
                    color: '#f0f6fc',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                  Taxpayer Name *
                </label>
                <input
                  type="text"
                  name="taxpayerName"
                  value={formData.taxpayerName}
                  onChange={handleChange}
                  placeholder="Business name or individual name"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    background: '#0f1419',
                    color: '#f0f6fc',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                  TIN (Tax Identification Number) *
                </label>
                <input
                  type="text"
                  name="tin"
                  value={formData.tin}
                  onChange={handleChange}
                  placeholder="8+ alphanumeric characters"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    background: '#0f1419',
                    color: '#f0f6fc',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Region *
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  background: '#0f1419',
                  color: '#f0f6fc',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="Addis Ababa">Addis Ababa</option>
                <option value="Amhara">Amhara</option>
                <option value="Oromia">Oromia</option>
                <option value="SNNPR">SNNPR</option>
                <option value="Somali">Somali</option>
                <option value="Dire Dawa">Dire Dawa</option>
              </select>
            </div>
          </div>

          {/* Request Reason Section */}
          <div style={{ marginBottom: '24px', paddingTop: '16px', borderTop: '1px solid #30363d' }}>
            <h3 style={{ color: '#f0f6fc', margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600' }}>
              <i className="fas fa-comment"></i> Request Reason & Justification
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Reason for Request *
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Briefly describe why this audit is needed..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  background: '#0f1419',
                  color: '#f0f6fc',
                  fontSize: '13px',
                  minHeight: '80px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Justification *
              </label>
              <textarea
                name="justification"
                value={formData.justification}
                onChange={handleChange}
                placeholder="Provide detailed justification with supporting evidence..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  background: '#0f1419',
                  color: '#f0f6fc',
                  fontSize: '13px',
                  minHeight: '100px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Supporting Notes (Optional)
              </label>
              <textarea
                name="supportingNotes"
                value={formData.supportingNotes}
                onChange={handleChange}
                placeholder="Any additional information..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  background: '#0f1419',
                  color: '#f0f6fc',
                  fontSize: '13px',
                  minHeight: '60px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #30363d' }}>
            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: '10px 20px',
                border: '1px solid #30363d',
                borderRadius: '6px',
                background: '#0f1419',
                color: '#8b949e',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Clear Form
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                background: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-paper-plane"></i> Submit Request
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SubmitAuditRequestForm;
