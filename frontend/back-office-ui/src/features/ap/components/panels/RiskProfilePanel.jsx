import React from 'react';

/**
 * RiskProfilePanel - Sub-component for displaying risk profiling data
 * Shows risk score, risk level, risk strength, and risk indicators
 */

function RiskProfilePanel({ caseData }) {
  if (!caseData) return null;

  const { riskScore = 0, riskLevel = 'Unknown', riskStrength = 'N/A', riskIndicators = [] } = caseData;

  const getRiskColor = (riskLevel) => {
    const colors = {
      'Critical': '#ff5252',
      'High': '#ff9800',
      'Medium': '#ffc107',
      'Low': '#4caf50'
    };
    return colors[riskLevel] || '#999';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'High': '#ff5252',
      'Medium': '#ff9800',
      'Low': '#4caf50'
    };
    return colors[severity] || '#999';
  };

  return (
    <div style={{
      background: '#1c2128',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      border: '1px solid #30363d'
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '13px', fontWeight: '600', color: '#f0f6fc' }}>
        <i className="fas fa-chart-line"></i> Risk Profile
      </h3>

      {/* Risk Score Gauge */}
      <div style={{
        background: '#0f1419',
        borderRadius: '6px',
        padding: '12px',
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: getRiskColor(riskLevel),
          margin: '8px 0'
        }}>
          {riskScore}/100
        </div>
        <div style={{
          width: '100%',
          height: '6px',
          background: '#30363d',
          borderRadius: '3px',
          overflow: 'hidden',
          marginBottom: '8px'
        }}>
          <div style={{
            width: `${riskScore}%`,
            height: '100%',
            background: getRiskColor(riskLevel),
            transition: 'width 0.3s ease'
          }}></div>
        </div>
        <small style={{ color: '#8b949e' }}>Risk Score</small>
      </div>

      {/* Risk Level & Strength */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ flex: 1 }}>
          <small style={{ color: '#8b949e', display: 'block', marginBottom: '4px' }}>RISK LEVEL</small>
          <span style={{
            background: getRiskColor(riskLevel),
            color: '#fff',
            padding: '6px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            {riskLevel}
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <small style={{ color: '#8b949e', display: 'block', marginBottom: '4px' }}>RISK STRENGTH</small>
          <span style={{
            background: '#30363d',
            color: '#f0f6fc',
            padding: '6px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            {riskStrength}
          </span>
        </div>
      </div>

      {/* Risk Indicators */}
      {riskIndicators && riskIndicators.length > 0 && (
        <div>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '11px', fontWeight: '600', color: '#f0f6fc', textTransform: 'uppercase' }}>
            Risk Indicators
          </h4>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {riskIndicators.map((indicator, idx) => (
              <div key={idx} style={{
                background: '#0f1419',
                borderRadius: '6px',
                padding: '10px',
                borderLeft: `3px solid ${getSeverityColor(indicator.severity)}`
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '4px'
                }}>
                  <strong style={{ color: '#f0f6fc', fontSize: '12px' }}>
                    {indicator.indicator}
                  </strong>
                  <span style={{
                    background: getSeverityColor(indicator.severity),
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    {indicator.severity}
                  </span>
                </div>
                <small style={{ color: '#8b949e', lineHeight: '1.4' }}>
                  {indicator.evidence}
                </small>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!riskIndicators || riskIndicators.length === 0) && (
        <small style={{ color: '#8b949e', fontStyle: 'italic' }}>
          No risk indicators available
        </small>
      )}
    </div>
  );
}

export default RiskProfilePanel;
