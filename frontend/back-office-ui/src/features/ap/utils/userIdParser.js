/**
 * User ID Parser Utility
 * 
 * Parses user IDs in MOR format to extract:
 * - Role information
 * - Assigned region
 * - Assigned tax center
 * - Team/Audit type information
 * 
 * Expected User ID Formats:
 * - director.addis_ababa@mor.gov.et
 * - manager.addis_ababa-tc1@mor.gov.et
 * - desk.tl1.addis_ababa-tc1@mor.gov.et
 * - desk.tl1.a1.addis_ababa-tc1@mor.gov.et
 * - field.tl2.addis_ababa@mor.gov.et
 * - joint.auditor.oromia-tc2@mor.gov.et
 */

/**
 * Parse user ID to extract metadata
 * Returns object with role, region, taxCenter, auditType, teamInfo
 * 
 * @param {string} email - User email (e.g., "director.addis_ababa@mor.gov.et")
 * @returns {Object} Parsed user metadata
 */
export const parseUserIdEmail = (email) => {
  if (!email) {
    return {
      valid: false,
      error: 'No email provided'
    };
  }

  // Remove domain if present
  const userPart = email.split('@')[0];
  const parts = userPart.split('.');

  // Initialize result
  const result = {
    valid: false,
    originalEmail: email,
    originalUserPart: userPart,
    rawParts: parts,
    role: null,
    roleTitle: null,
    assignedRegion: null,
    assignedTaxCenter: null,
    auditType: null,
    teamLevel: null,
    teamInfo: null,
    level: 'national', // national, regional, tax_center, team, auditor
    error: null
  };

  try {
    // First part is always the role/position
    const firstPart = parts[0].toLowerCase();

    // Role detection with region extraction
    if (firstPart === 'director') {
      result.role = 'audit_director';
      result.roleTitle = 'Audit Director';
      result.level = 'national';
      
      // Try to extract region if present (director.addis_ababa@...)
      if (parts.length > 1) {
        const regionPart = parts[1].toLowerCase();
        const region = extractRegionFromPart(regionPart);
        if (region) {
          result.assignedRegion = region;
          result.level = 'regional'; // Director with region assignment
          result.roleTitle = `Regional Director - ${region}`;
          result.role = 'regional_director';
        }
      }
    }
    // Regional Director pattern (might be just "regional" or "r.director")
    else if (firstPart === 'regional' || firstPart === 'r') {
      result.role = 'regional_director';
      result.roleTitle = 'Regional Director';
      result.level = 'regional';
      
      // Extract region from next part
      if (parts.length > 1) {
        const regionPart = parts[1].toLowerCase();
        const region = extractRegionFromPart(regionPart);
        if (region) {
          result.assignedRegion = region;
        }
      }
    }
    // Manager pattern (manager.region-tcX@...)
    else if (firstPart === 'manager') {
      result.role = 'tax_center_manager';
      result.roleTitle = 'Tax Center Manager';
      result.level = 'tax_center';
      
      if (parts.length > 1) {
        const locationPart = parts[1].toLowerCase();
        const location = extractRegionAndTaxCenter(locationPart);
        if (location) {
          result.assignedRegion = location.region;
          result.assignedTaxCenter = location.taxCenter;
        }
      }
    }
    // Desk audit team pattern (desk.tl#.region-tc#@... or desk.tl#.a#.region-tc#@...)
    else if (firstPart === 'desk') {
      result.auditType = 'desk_audit';
      
      // Check if it's Team Lead or Auditor
      if (parts.length > 1) {
        const secondPart = parts[1].toLowerCase();
        
        if (secondPart.startsWith('tl')) {
          // Team Lead
          result.role = 'team_leader';
          result.roleTitle = 'Desk Audit Team Lead';
          result.teamLevel = 'team_lead';
          result.teamInfo = secondPart; // e.g., 'tl1'
          
          // Extract region and tax center
          if (parts.length > 2) {
            // Format: desk.tl1.region-tc#@...
            const locationPart = parts[2].toLowerCase();
            const location = extractRegionAndTaxCenter(locationPart);
            if (location) {
              result.assignedRegion = location.region;
              result.assignedTaxCenter = location.taxCenter;
            }
          }
        } else if (secondPart.startsWith('a')) {
          // Auditor (format: desk.a# or desk.tl#.a#)
          result.role = 'auditor';
          result.roleTitle = 'Desk Auditor';
          result.teamLevel = 'auditor';
          result.teamInfo = secondPart; // e.g., 'a1'
          
          // Extract region and tax center
          if (parts.length > 2) {
            const locationPart = parts[2].toLowerCase();
            const location = extractRegionAndTaxCenter(locationPart);
            if (location) {
              result.assignedRegion = location.region;
              result.assignedTaxCenter = location.taxCenter;
            }
          }
        } else {
          // Format: desk.region-tc#@...
          const location = extractRegionAndTaxCenter(secondPart);
          if (location) {
            result.role = 'auditor';
            result.roleTitle = 'Desk Auditor';
            result.assignedRegion = location.region;
            result.assignedTaxCenter = location.taxCenter;
          }
        }
      }
      result.level = 'tax_center';
    }
    // Field audit team pattern
    else if (firstPart === 'field') {
      result.auditType = 'field_audit';
      
      if (parts.length > 1) {
        const secondPart = parts[1].toLowerCase();
        
        if (secondPart.startsWith('tl')) {
          result.role = 'team_leader';
          result.roleTitle = 'Field Audit Team Lead';
          result.teamLevel = 'team_lead';
          result.teamInfo = secondPart;
          
          if (parts.length > 2) {
            const locationPart = parts[2].toLowerCase();
            const location = extractRegionAndTaxCenter(locationPart);
            if (location) {
              result.assignedRegion = location.region;
              result.assignedTaxCenter = location.taxCenter;
            }
          }
        } else {
          result.role = 'auditor';
          result.roleTitle = 'Field Auditor';
          const location = extractRegionAndTaxCenter(secondPart);
          if (location) {
            result.assignedRegion = location.region;
            result.assignedTaxCenter = location.taxCenter;
          }
        }
      }
      result.level = 'tax_center';
    }
    // Joint audit pattern
    else if (firstPart === 'joint') {
      result.auditType = 'joint_audit';
      
      if (parts.length > 1) {
        const secondPart = parts[1].toLowerCase();
        
        if (secondPart.startsWith('tl')) {
          result.role = 'team_leader';
          result.roleTitle = 'Joint Audit Team Lead';
          result.teamLevel = 'team_lead';
          result.teamInfo = secondPart;
          
          if (parts.length > 2) {
            const locationPart = parts[2].toLowerCase();
            const location = extractRegionAndTaxCenter(locationPart);
            if (location) {
              result.assignedRegion = location.region;
              result.assignedTaxCenter = location.taxCenter;
            }
          }
        } else {
          result.role = 'auditor';
          result.roleTitle = 'Joint Auditor';
          const location = extractRegionAndTaxCenter(secondPart);
          if (location) {
            result.assignedRegion = location.region;
            result.assignedTaxCenter = location.taxCenter;
          }
        }
      }
      result.level = 'tax_center';
    }
    // Transfer pricing pattern
    else if (firstPart === 'transfer' || firstPart === 'tp') {
      result.auditType = 'transfer_pricing';
      result.role = firstPart === 'transfer' && parts.length > 1 && parts[1].toLowerCase().startsWith('tl')
        ? 'team_leader'
        : 'auditor';
      result.roleTitle = result.role === 'team_leader'
        ? 'Transfer Pricing Team Lead'
        : 'Transfer Pricing Analyst';
      
      if (result.role === 'team_leader' && parts.length > 2) {
        const locationPart = parts[2].toLowerCase();
        const location = extractRegionAndTaxCenter(locationPart);
        if (location) {
          result.assignedRegion = location.region;
          result.assignedTaxCenter = location.taxCenter;
        }
      } else if (parts.length > 1) {
        const locationPart = parts[1].toLowerCase();
        const location = extractRegionAndTaxCenter(locationPart);
        if (location) {
          result.assignedRegion = location.region;
          result.assignedTaxCenter = location.taxCenter;
        }
      }
      result.level = 'tax_center';
    }

    // Mark as valid if we found a role
    result.valid = !!result.role;

  } catch (error) {
    result.error = `Parse error: ${error.message}`;
    result.valid = false;
  }

  return result;
};

/**
 * Extract region from a part string
 * Handles formats like: addis_ababa, oromia, amhara, snnpr, somali, dire_dawa, tigray
 * 
 * @param {string} part - Part of user ID
 * @returns {string|null} Region in lowercase_underscore format or null
 */
export const extractRegionFromPart = (part) => {
  if (!part) return null;

  // List of valid regions in lowercase_underscore format
  const validRegions = [
    'addis_ababa',
    'oromia',
    'amhara',
    'snnpr',
    'somali',
    'dire_dawa',
    'tigray'
  ];

  // Check if the part exactly matches a region
  if (validRegions.includes(part)) {
    return part;
  }

  // Check if part contains a region (e.g., "addis_ababa-tc1" → "addis_ababa")
  for (const region of validRegions) {
    if (part.startsWith(region)) {
      return region;
    }
  }

  return null;
};

/**
 * Extract region AND tax center from a location part
 * Handles formats like: addis_ababa-tc1, oromia-tc2
 * 
 * @param {string} part - Location part with region and tax center
 * @returns {Object|null} {region, taxCenter} or null if not found
 */
export const extractRegionAndTaxCenter = (part) => {
  if (!part) return null;

  // Valid regions to search for
  const validRegions = [
    'addis_ababa',
    'oromia',
    'amhara',
    'snnpr',
    'somali',
    'dire_dawa',
    'tigray'
  ];

  // Check for pattern: region-tc# or region_tc#
  for (const region of validRegions) {
    if (part.startsWith(region)) {
      const remaining = part.substring(region.length);
      
      // Extract tax center (e.g., "-tc1" or "_tc1" or "tc1")
      const tcMatch = remaining.match(/[-_]?(tc\d+)/i);
      if (tcMatch) {
        return {
          region: region,
          taxCenter: tcMatch[1].toLowerCase() // normalize to "tc1" format
        };
      }
      
      // If no tax center found but region found, return just region
      if (remaining === '' || remaining === '-' || remaining === '_') {
        return {
          region: region,
          taxCenter: null
        };
      }
    }
  }

  return null;
};

/**
 * Convert parsed user metadata to org_context format for AuthContext
 * 
 * @param {Object} parsedUser - Result from parseUserIdEmail()
 * @returns {Object} org_context object ready for AuthContext
 */
export const toOrgContext = (parsedUser) => {
  if (!parsedUser || !parsedUser.valid) {
    return {
      assignedRegion: null,
      assignedRegionName: 'National Level',
      assignedTaxCenter: null,
      assignedTaxCenterName: 'N/A',
      auditType: null,
      teamId: null,
      teamName: null,
      level: 'national'
    };
  }

  return {
    assignedRegion: parsedUser.assignedRegion,
    assignedRegionName: parsedUser.assignedRegion ? parsedUser.assignedRegion : 'National Level',
    assignedTaxCenter: parsedUser.assignedTaxCenter,
    assignedTaxCenterName: parsedUser.assignedTaxCenter
      ? `${parsedUser.assignedRegion} - ${parsedUser.assignedTaxCenter.toUpperCase()}`
      : 'N/A',
    auditType: parsedUser.auditType,
    teamId: parsedUser.teamInfo,
    teamName: parsedUser.teamInfo ? `Team ${parsedUser.teamInfo}` : null,
    level: parsedUser.level
  };
};

/**
 * Get user display name from parsed user
 * 
 * @param {Object} parsedUser - Result from parseUserIdEmail()
 * @returns {string} Display name for the user
 */
export const getUserDisplayName = (parsedUser) => {
  if (!parsedUser || !parsedUser.valid) {
    return 'Unknown User';
  }

  let name = parsedUser.roleTitle || parsedUser.role;

  if (parsedUser.assignedRegion) {
    name += ` (${parsedUser.assignedRegion})`;
  }

  if (parsedUser.assignedTaxCenter) {
    name += ` - ${parsedUser.assignedTaxCenter}`;
  }

  return name;
};

/**
 * Test user ID parsing
 * Provides test cases for all user ID formats
 */
export const testUserIdParsing = () => {
  const testEmails = [
    // Directors
    'director.addis_ababa@mor.gov.et',
    'director.oromia@mor.gov.et',
    
    // Tax Center Managers
    'manager.addis_ababa-tc1@mor.gov.et',
    'manager.oromia-tc2@mor.gov.et',
    
    // Desk Audit Team
    'desk.tl1.addis_ababa-tc1@mor.gov.et',
    'desk.tl1.a1.addis_ababa-tc1@mor.gov.et',
    'desk.auditor.addis_ababa-tc1@mor.gov.et',
    
    // Field Audit Team
    'field.tl2.oromia-tc2@mor.gov.et',
    'field.a2.oromia-tc2@mor.gov.et',
    
    // Joint Audit
    'joint.tl1.amhara-tc1@mor.gov.et',
    'joint.auditor.amhara-tc1@mor.gov.et',
    
    // Transfer Pricing
    'tp.tl1.addis_ababa@mor.gov.et',
    'transfer.analyst.snnpr@mor.gov.et'
  ];

  const results = {};
  testEmails.forEach(email => {
    results[email] = parseUserIdEmail(email);
  });

  return results;
};

// Export all for React components to use
export default {
  parseUserIdEmail,
  extractRegionFromPart,
  extractRegionAndTaxCenter,
  toOrgContext,
  getUserDisplayName,
  testUserIdParsing
};
