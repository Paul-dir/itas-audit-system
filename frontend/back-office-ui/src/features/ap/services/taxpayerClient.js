/**
 * MOR Taxpayer Registration API Client
 * Base: https://project--d0918d51-a625-4432-b108-ecc84cb59ed8.lovable.app
 * All endpoints return { data, error, meta } envelope.
 */

const TAXPAYER_BASE = 'https://project--d0918d51-a625-4432-b108-ecc84cb59ed8.lovable.app';

class TaxpayerClient {
  async _request(endpoint, params = {}) {
    const url = new URL(`${TAXPAYER_BASE}${endpoint}`);
    Object.entries(params).forEach(([k, v]) => v !== undefined && url.searchParams.set(k, v));
    const res = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.error?.message) throw new Error(json.error.message);
    return { data: json.data, meta: json.meta };
  }

  /** National & per-region taxpayer statistics */
  async getStatistics() {
    return this._request('/api/public/v1/statistics');
  }

  /** List all regions */
  async getRegions() {
    return this._request('/api/public/v1/regions');
  }

  /** Get a region with its tax centers and taxpayer count */
  async getRegion(code) {
    return this._request(`/api/public/v1/regions/${code}`);
  }

  /** List tax centers, optionally filtered by region code */
  async getTaxCenters(region) {
    return this._request('/api/public/v1/tax-centers', region ? { region } : {});
  }

  /** Taxpayer list (paginated) */
  async getTaxpayers(params = {}) {
    return this._request('/api/public/v1/taxpayers', params);
  }

  /** Single taxpayer by TIN */
  async getTaxpayerByTin(tin) {
    return this._request(`/api/public/v1/taxpayers/${tin}`);
  }
}

export default new TaxpayerClient();
