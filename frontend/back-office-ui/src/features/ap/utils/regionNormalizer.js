/**
 * Region name normalization utilities
 * Handles conversion between different region name formats
 * 
 * Formats:
 * - API format: 'addis_ababa' (lowercase_underscore from MOR Identity API)
 * - Display format: 'Addis Ababa' (titlecase for UI)
 */

/**
 * Normalize region name from any format to titlecase with spaces
 * Used for display in UI
 * 
 * Examples:
 * - 'addis_ababa' → 'Addis Ababa'
 * - 'Addis Ababa' → 'Addis Ababa' (no change)
 * - 'snnpr' → 'SNNPR' (special case)
 * - 'dire_dawa' → 'Dire Dawa'
 */
export const normalizeRegionName = (region) => {
  if (!region) return region;
  
  // If already titlecase with spaces, return as-is
  if (region.includes(' ')) {
    return region;
  }
  
  // Special cases for region names
  const specialCases = {
    'snnpr': 'SNNPR',
    'dire_dawa': 'Dire Dawa',
    'dire dawa': 'Dire Dawa'
  };
  
  if (specialCases[region.toLowerCase()]) {
    return specialCases[region.toLowerCase()];
  }
  
  // Convert lowercase_underscore to Titlecase
  return region
    .toLowerCase()
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

/**
 * Convert region name to API format (lowercase_underscore)
 * Used for internal data lookups
 * 
 * Examples:
 * - 'Addis Ababa' → 'addis_ababa'
 * - 'addis_ababa' → 'addis_ababa' (no change)
 * - 'SNNPR' → 'snnpr'
 */
export const denormalizeRegionName = (region) => {
  if (!region) return region;
  
  // If already lowercase_underscore, return as-is
  if (region.includes('_')) {
    return region;
  }
  
  // Special cases for region names
  const specialCases = {
    'snnpr': 'snnpr',
    'dire dawa': 'dire_dawa'
  };
  
  const lower = region.toLowerCase();
  if (specialCases[lower]) {
    return specialCases[lower];
  }
  
  // Convert titlecase to lowercase_underscore
  return region.toLowerCase().replace(/\s+/g, '_');
};

/**
 * Get display-friendly region name (titlecase with spaces)
 * Alias for normalizeRegionName
 */
export const getDisplayRegionName = (region) => {
  return normalizeRegionName(region);
};

/**
 * Get API-format region name (lowercase_underscore)
 * Alias for denormalizeRegionName
 */
export const getApiRegionName = (region) => {
  return denormalizeRegionName(region);
};

/**
 * List of all valid regions in API format (lowercase_underscore)
 */
export const ALL_REGIONS_API = [
  'addis_ababa',
  'oromia',
  'amhara',
  'snnpr',
  'somali',
  'dire_dawa',
  'tigray'
];

/**
 * List of all valid regions in display format (titlecase with spaces)
 */
export const ALL_REGIONS_DISPLAY = ALL_REGIONS_API.map(normalizeRegionName);

/**
 * Validate if a region name is valid
 * Accepts both API format and display format
 */
export const isValidRegion = (region) => {
  if (!region) return false;
  const apiFormat = denormalizeRegionName(region);
  return ALL_REGIONS_API.includes(apiFormat);
};
