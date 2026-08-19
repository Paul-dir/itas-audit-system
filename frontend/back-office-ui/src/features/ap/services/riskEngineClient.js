/**
 * Risk Engine API Client
 * Base: https://audit-ally-score.lovable.app
 * All endpoints return { data, error, meta } envelope.
 */

const RISK_ENGINE_BASE = 'https://audit-ally-score.lovable.app';

class RiskEngineClient {
  async _request(endpoint, params = {}) {
    const url = new URL(`${RISK_ENGINE_BASE}${endpoint}`);
    Object.entries(params).forEach(([k, v]) => v !== undefined && url.searchParams.set(k, v));
    const res = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.error?.message) throw new Error(json.error.message);
    return { data: json.data, meta: json.meta };
  }

  /** Aggregate risk statistics — totals by risk level, region, recommendation, etc. */
  async getStatistics() {
    return this._request('/api/public/v1/statistics');
  }

  /** National risk ranking — ordered by priority_rank */
  async getRanking(params = {}) {
    return this._request('/api/public/v1/risk-ranking', params);
  }

  /** Aggregated risk ranking by region */
  async getRegionRankings() {
    return this._request('/api/public/v1/risk-ranking/regions');
  }

  /** Aggregated risk ranking by tax center */
  async getTaxCenterRankings(region) {
    return this._request('/api/public/v1/risk-ranking/tax-centers', region ? { region } : {});
  }

  /** Audit recommendations with suggested_audit_type, ordered by priority */
  async getRecommendations(params = {}) {
    return this._request('/api/public/v1/recommendations', params);
  }

  /** High and critical risk taxpayers */
  async getHighRisk(params = {}) {
    return this._request('/api/public/v1/high-risk', params);
  }

  /** Current risk assessments, filterable */
  async getAssessments(params = {}) {
    return this._request('/api/public/v1/risk-assessments', params);
  }

  /** Risk assessment for one taxpayer */
  async getAssessmentByTin(tin) {
    return this._request(`/api/public/v1/risk-assessments/${tin}`);
  }

  /** Configured risk rules */
  async getRiskRules() {
    return this._request('/api/public/v1/risk-rules');
  }

  /** Risk categories */
  async getRiskCategories() {
    return this._request('/api/public/v1/risk-categories');
  }
}

export default new RiskEngineClient();
