/**
 * Revenue formatting utilities for consistent display across all dashboards
 * 
 * Rules:
 * - ≥ 1 Trillion: show as X.XT (e.g., 16.5T)
 * - ≥ 1 Billion: show as X.XB (e.g., 124.5B)
 * - ≥ 1 Million: show as X.XM (e.g., 3.2M)
 * - < 1 Million: show as X.XK (e.g., 500K)
 * - 0 or null: show as "—"
 */

/**
 * Format a revenue value (in ETB) to a human-readable string with B/M suffix
 * @param {number|null|undefined} value - Revenue in ETB
 * @param {number} decimals - Decimal places (default: 1)
 * @returns {string} Formatted string like "124.5B", "3.2M", "500K"
 */
export function formatRevenue(value, decimals = 1) {
  if (value === null || value === undefined || value === 0) return '—';
  
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (abs >= 1e12) return `${sign}${(abs / 1e12).toFixed(decimals)}T`;
  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(decimals)}B`;
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(decimals)}M`;
  if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(decimals)}K`;
  return `${sign}${abs}`;
}

/**
 * Format revenue with currency symbol
 * @param {number|null|undefined} value - Revenue in ETB
 * @param {number} decimals - Decimal places (default: 1)
 * @returns {string} Formatted string like "124.5B ETB"
 */
export function formatRevenueWithCurrency(value, decimals = 1) {
  if (value === null || value === undefined || value === 0) return '— ETB';
  return `${formatRevenue(value, decimals)} ETB`;
}

/**
 * Format case count with comma separators
 * @param {number} count
 * @returns {string} e.g., "46,694"
 */
export function formatCaseCount(count) {
  if (count === null || count === undefined) return '0';
  return count.toLocaleString();
}
