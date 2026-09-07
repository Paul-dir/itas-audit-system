/**
 * User Resolver Utility
 * 
 * Normalizes roles, regions, audit types, and guarantees complete user profiles
 * for authentication and UI components (App.jsx, Sidebar.jsx, TopBar.jsx).
 */

export function normalizeRole(role) {
  if (!role) return 'auditor';
  const r = role.toLowerCase().replace(/[\s-]+/g, '_');
  if (r.includes('plan')) return 'planning_team';
  if (r.includes('direct') && !r.includes('region')) return 'audit_director';
  if (r.includes('senior')) return 'senior_management';
  if (r.includes('region')) return 'regional_director';
  if (r.includes('tax_center_mgr') || r.includes('tax_center_manager') || r.includes('tcm') || r.includes('tax_center') || r.includes('taxcenter') || r.startsWith('tc_') || r === 'tc') return 'tax_center_manager';
  if (r.includes('team_leader') || r.includes('teamleader') || r === 'tl' || r.startsWith('tl_')) return 'team_leader';
  if (r.includes('committee')) return 'committee_member';
  if (r.includes('request')) return 'audit_requester';
  if (r.includes('taxpayer') || r.includes('portal')) return 'taxpayer';
  if (r.includes('admin')) return 'planning_team';
  if (r.includes('auditor') || r === 'aud') return 'auditor';
  return r;
}

export function resolveRegion(loc) {
  if (!loc) return null;
  const l = loc.toLowerCase();
  if (l.startsWith('fed') || l.includes('lto')) return 'federal_level';
  if (l.startsWith('addis') || l.includes('aa')) return 'addis_ababa';
  if (l.startsWith('amhara') || l.includes('ba')) return 'amhara';
  if (l.startsWith('oromia') || l.includes('bb')) return 'oromia';
  if (l.startsWith('dire') || l.includes('ab')) return 'dire_dawa';
  if (l.startsWith('snnpr') || l.includes('ca')) return 'snnpr';
  if (l.startsWith('somali') || l.includes('so')) return 'somali';
  return loc;
}

export function resolveAuditType(str) {
  if (!str) return null;
  const s = str.toLowerCase();
  if (s.includes('desk')) return 'desk_audit';
  if (s.includes('joint') || s.includes('ja')) return 'joint_audit';
  if (s.includes('transfer') || s.includes('tp')) return 'transfer_pricing';
  if (s.includes('comp')) return 'comprehensive';
  if (s.includes('issue')) return 'issue_audit';
  return str;
}

export function buildCompleteUserProfile(rawUser) {
  if (!rawUser) return null;

  const id = rawUser.id || rawUser.userId || rawUser.username;
  const username = rawUser.username || id;
  const email = rawUser.email || `${username}@mor.gov.et`;
  const name = rawUser.fullName || rawUser.name || username;
  const role = normalizeRole(rawUser.role || rawUser.userType);
  const region = resolveRegion(rawUser.region || rawUser.assignedLocation);
  const taxCenter = rawUser.taxCenter || (rawUser.assignedLevel === 'TAX_CENTER' ? rawUser.assignedLocation : null) || null;
  const auditType = resolveAuditType(rawUser.auditType);
  const permissions = rawUser.permissions || [];

  return {
    id,
    userId: id,
    username,
    name,
    fullName: name,
    email,
    role,
    userType: role.toUpperCase(),
    region,
    taxCenter,
    auditType,
    permissions,
    password: rawUser.password || 'password123',
    status: rawUser.status || 'ACTIVE'
  };
}

/**
 * Maps raw user record from backend /api/v1/backoffice/ap/users into complete frontend user profile
 */
export function mapBackendUserToProfile(u) {
  if (!u) return null;
  const roleMapping = {
    'PLANNING_TEAM': 'planning_team',
    'NATIONAL_ADMIN': 'planning_team',
    'DIRECTOR': 'audit_director',
    'SENIOR_MANAGEMENT': 'senior_management',
    'REGIONAL_DIRECTOR': 'regional_director',
    'TAX_CENTER_MANAGER': 'tax_center_manager',
    'TEAM_LEADER': 'team_leader',
    'AUDITOR': 'auditor',
    'COMMITTEE_MEMBER': 'committee_member',
    'AUDIT_REQUESTER': 'audit_requester',
    'TAXPAYER': 'taxpayer'
  };

  let region = null;
  if (u.assignedLevel === 'REGIONAL') {
    const codeMap = { 'FED':'federal_level', 'AA':'addis_ababa', 'BA':'amhara', 'BB':'oromia', 'AB':'dire_dawa', 'CA':'snnpr', 'SO':'somali' };
    region = codeMap[u.assignedLocation] || resolveRegion(u.assignedLocation);
  } else if (u.assignedLevel === 'TAX_CENTER') {
    const loc = (u.assignedLocation || '').toLowerCase();
    if (loc.startsWith('federal'))      region = 'federal_level';
    else if (loc.startsWith('addis'))   region = 'addis_ababa';
    else if (loc.startsWith('amhara'))  region = 'amhara';
    else if (loc.startsWith('oromia'))  region = 'oromia';
    else if (loc.startsWith('dire'))    region = 'dire_dawa';
    else if (loc.startsWith('snnpr'))   region = 'snnpr';
    else if (loc.startsWith('somali'))  region = 'somali';
    else region = resolveRegion(loc);
  } else if (u.assignedLevel === 'NATIONAL') {
    region = 'federal_level';
  } else if (u.region) {
    region = resolveRegion(u.region);
  }

  const role = roleMapping[u.userType] || normalizeRole(u.role || u.userType);
  const id = u.username || u.userId || u.id;
  const name = u.fullName || u.name || u.username || id;
  const email = u.email || `${u.username || id}@mor.gov.et`;
  const taxCenter = u.taxCenter || (u.assignedLevel === 'TAX_CENTER' ? u.assignedLocation : null);
  const auditType = u.auditType ? resolveAuditType(u.auditType) : null;

  return {
    id,
    userId: u.userId || id,
    username: u.username || id,
    name,
    fullName: name,
    email,
    role,
    userType: (u.userType || role).toUpperCase(),
    region,
    taxCenter,
    auditType,
    permissions: u.permissions || [],
    status: u.status || 'ACTIVE',
    password: u.password || 'password123'
  };
}

/**
 * Fallback synthesizer for any valid ITAS username convention (e.g. u-tl-addis_ababa-tc1-desk-1)
 */
export function synthesizeUserFromPattern(identifier) {
  if (!identifier) return null;
  const input = identifier.trim().toLowerCase();
  const cleanInput = input.replace(/@mor\.gov\.et$/, '');

  // Pattern checks
  if (cleanInput === 'admin' || input.includes('admin@mor.gov.et')) {
    return buildCompleteUserProfile({
      id: 'admin',
      name: 'System Administrator',
      email: 'admin@mor.gov.et',
      role: 'planning_team'
    });
  }

  if (cleanInput === 'taxpayer1' || input.includes('cresttextiles.et') || input.includes('taxpayer')) {
    return buildCompleteUserProfile({
      id: 'taxpayer1',
      name: 'Crest Textiles CFO',
      email: 'cfo@cresttextiles.et',
      role: 'taxpayer'
    });
  }

  // Known auditor & team leader direct email aliases
  if (input === 'michael.abera@mor.gov.et' || input === 'michael.desta@mor.gov.et' || cleanInput === 'michael.abera' || cleanInput === 'michael.desta' || cleanInput === 'tolera.getachew') {
    return buildCompleteUserProfile({
      id: 'u-aud-addis_ababa-tc1-tp-1-1',
      username: 'u-aud-addis_ababa-tc1-tp-1-1',
      name: 'Michael Abera (TP Auditor)',
      email: 'michael.abera@mor.gov.et',
      role: 'auditor',
      region: 'addis_ababa',
      taxCenter: 'addis_ababa-tc1',
      auditType: 'transfer_pricing',
      teamLeader: 'u-tl-addis_ababa-tc1-tp-1'
    });
  }

  if (input === 'robel.girma@mor.gov.et' || cleanInput === 'robel.girma') {
    return buildCompleteUserProfile({
      id: 'u-tl-addis_ababa-tc1-tp-1',
      username: 'u-tl-addis_ababa-tc1-tp-1',
      name: 'Robel Girma (TP TL-1)',
      email: 'u-tl-addis_ababa-tc1-tp-1@mor.gov.et',
      role: 'team_leader',
      region: 'addis_ababa',
      taxCenter: 'addis_ababa-tc1',
      auditType: 'transfer_pricing'
    });
  }

  // Check prefix (using cleanInput without @mor.gov.et)
  const parts = cleanInput.split('-');
  if (parts[0] === 'u') {
    const type = parts[1]; // pt, ad, sm, rd, tcm, tc, com, tl, aud, req
    
    if (type === 'pt') {
      return buildCompleteUserProfile({
        id: cleanInput,
        name: `Planning Team Lead (${cleanInput})`,
        email: `${cleanInput}@mor.gov.et`,
        role: 'planning_team',
        region: 'federal_level'
      });
    }
    if (type === 'ad') {
      return buildCompleteUserProfile({
        id: cleanInput,
        name: `Audit Director (${cleanInput})`,
        email: `${cleanInput}@mor.gov.et`,
        role: 'audit_director',
        region: 'federal_level'
      });
    }
    if (type === 'sm') {
      return buildCompleteUserProfile({
        id: cleanInput,
        name: `Senior Management (${cleanInput})`,
        email: `${cleanInput}@mor.gov.et`,
        role: 'senior_management',
        region: 'federal_level'
      });
    }
    if (type === 'rd') {
      const reg = parts[2] || 'aa';
      return buildCompleteUserProfile({
        id: cleanInput,
        name: `Regional Director (${reg.toUpperCase()})`,
        email: `${cleanInput}@mor.gov.et`,
        role: 'regional_director',
        region: resolveRegion(reg)
      });
    }
    if (type === 'tcm' || type === 'tc') {
      const tc = parts.slice(2).join('-');
      return buildCompleteUserProfile({
        id: cleanInput,
        name: `Tax Center Manager (${tc || cleanInput})`,
        email: `${cleanInput}@mor.gov.et`,
        role: 'tax_center_manager',
        region: resolveRegion(tc),
        taxCenter: tc || cleanInput
      });
    }
    if (type === 'com') {
      const isFed = cleanInput.includes('fed');
      let at = resolveAuditType(cleanInput);
      if (cleanInput.includes('fed-chair') && !cleanInput.includes('tp')) {
        at = 'joint_audit';
      }
      const tc = isFed ? 'federal-lto1' : parts.slice(2, -1).join('-');
      return buildCompleteUserProfile({
        id: cleanInput,
        name: `${at ? at.replace(/_/g, ' ').toUpperCase() : ''} Committee Chair (${isFed ? 'Federal' : tc})`,
        email: `${cleanInput}@mor.gov.et`,
        role: 'committee_member',
        region: isFed ? 'federal_level' : resolveRegion(tc),
        taxCenter: tc,
        auditType: at
      });
    }
    if (type === 'tl') {
      // e.g. u-tl-addis_ababa-tc1-desk-1
      const atShort = parts[parts.length - 2];
      const tc = parts.slice(2, parts.length - 2).join('-');
      const num = parts[parts.length - 1];
      const at = resolveAuditType(atShort);
      return buildCompleteUserProfile({
        id: cleanInput,
        name: `${at ? at.replace(/_/g, ' ').toUpperCase() : ''} TL-${num} (${tc})`,
        email: `${cleanInput}@mor.gov.et`,
        role: 'team_leader',
        region: resolveRegion(tc),
        taxCenter: tc,
        auditType: at
      });
    }
    if (type === 'aud') {
      // e.g. u-aud-addis_ababa-tc1-desk-1-1
      const atShort = parts[parts.length - 3];
      const tc = parts.slice(2, parts.length - 3).join('-');
      const tlNum = parts[parts.length - 2];
      const audNum = parts[parts.length - 1];
      const at = resolveAuditType(atShort);
      return buildCompleteUserProfile({
        id: cleanInput,
        name: `${at ? at.replace(/_/g, ' ').toUpperCase() : ''} Aud-${audNum} (TL-${tlNum}, ${tc})`,
        email: `${cleanInput}@mor.gov.et`,
        role: 'auditor',
        region: resolveRegion(tc),
        taxCenter: tc,
        auditType: at
      });
    }
    if (type === 'req') {
      return buildCompleteUserProfile({
        id: cleanInput,
        name: `Audit Referral Officer (${cleanInput})`,
        email: `${cleanInput}@mor.gov.et`,
        role: 'audit_requester',
        region: 'federal_level'
      });
    }
  }

  // Semantic keyword heuristics if identifier doesn't use strict u- prefix
  if (cleanInput.includes('tcm') || cleanInput.includes('tax_center') || cleanInput.includes('taxcenter') || cleanInput.includes('tc1') || cleanInput.includes('tc2') || cleanInput.includes('tc3') || cleanInput.includes('lto')) {
    return buildCompleteUserProfile({
      id: cleanInput,
      name: input,
      email: input.includes('@') ? input : `${cleanInput}@mor.gov.et`,
      role: 'tax_center_manager'
    });
  }

  if (cleanInput.includes('team_leader') || cleanInput.includes('teamleader') || cleanInput.includes('.tl') || cleanInput.startsWith('tl-')) {
    return buildCompleteUserProfile({
      id: cleanInput,
      name: input,
      email: input.includes('@') ? input : `${cleanInput}@mor.gov.et`,
      role: 'team_leader'
    });
  }

  // Generic fallback with valid structure
  return buildCompleteUserProfile({
    id: cleanInput,
    name: input,
    email: input.includes('@') ? input : `${cleanInput}@mor.gov.et`,
    role: 'auditor'
  });
}
