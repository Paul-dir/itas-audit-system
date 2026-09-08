/**
 * CommitteeRoleGate Component
 * Conditionally renders children based on user role.
 *
 * Usage:
 *   <CommitteeRoleGate allowedRoles={['CHAIRPERSON']}>
 *     <ChairpersonControls />
 *   </CommitteeRoleGate>
 *
 *   <CommitteeRoleGate allowedRoles={['CHAIRPERSON']} fallback={<LockedMessage />}>
 *     <ApproveButton />
 *   </CommitteeRoleGate>
 *
 *   // Hide from non-allowed roles entirely (no fallback)
 *   <CommitteeRoleGate allowedRoles={['CHAIRPERSON']}>
 *     <button>Delete</button>
 *   </CommitteeRoleGate>
 */

import { useAuth } from '../../../context/AuthContext';

const ROLE_ALIASES = {
  COMMITTEE_MEMBER: ['COMMITTEE_MEMBER', 'committee'],
  CHAIRPERSON: ['CHAIRPERSON', 'committee_chair', 'chairperson'],
};

export default function CommitteeRoleGate({ allowedRoles = [], children, fallback = null }) {
  const { user } = useAuth();

  if (!user || !user.role) return fallback;

  const userRole = user.role.toUpperCase();

  const isAllowed = allowedRoles.some(role => {
    const normalised = role.toUpperCase();
    if (userRole === normalised) return true;
    // Check aliases
    const aliases = ROLE_ALIASES[normalised] || [];
    return aliases.some(a => a.toUpperCase() === userRole);
  });

  return isAllowed ? children : fallback;
}

/**
 * Inline hook version for conditional logic inside components.
 *
 * Usage:
 *   const { isChairperson, isMember } = useCommitteeRole();
 *   if (isChairperson) { ... }
 */
export function useCommitteeRole() {
  const { user } = useAuth();
  const role = (user?.role || '').toUpperCase();

  // Check if role matches any of the committee roles (including aliases)
  const isChairperson = role === 'CHAIRPERSON' || role === 'COMMITTEE_CHAIR'
    || (ROLE_ALIASES.CHAIRPERSON || []).some(a => a.toUpperCase() === role);
  const isMember = role === 'COMMITTEE_MEMBER'
    || (ROLE_ALIASES.COMMITTEE_MEMBER || []).some(a => a.toUpperCase() === role);

  return {
    role,
    isChairperson,
    isMember,
    isAllowed: (allowedRoles) => {
      return allowedRoles.some(r => r.toUpperCase() === role);
    },
  };
}
