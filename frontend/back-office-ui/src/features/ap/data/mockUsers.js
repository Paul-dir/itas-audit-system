/**
 * Mock User Database
 * Real users with names and roles for development
 * Can be replaced with API calls when User Management API is available
 */

export const MOCK_USERS = [
  // Audit Planning Team
  {
    id: 'user-001',
    full_name: 'Ahmed Hassan',
    email: 'ahmed.hassan@mor.gov.et',
    role: 'audit_team',
    status: 'active'
  },
  {
    id: 'user-002',
    full_name: 'Fatima Mohamed',
    email: 'fatima.mohamed@mor.gov.et',
    role: 'audit_team',
    status: 'active'
  },
  {
    id: 'user-003',
    full_name: 'Alemayehu Tekle',
    email: 'alemayehu.tekle@mor.gov.et',
    role: 'audit_team',
    status: 'active'
  },

  // Audit Directors
  {
    id: 'user-004',
    full_name: 'Dr. Abebe Assefa',
    email: 'abebe.assefa@mor.gov.et',
    role: 'audit_director',
    status: 'active'
  },
  {
    id: 'user-005',
    full_name: 'Dr. Hirut Kebede',
    email: 'hirut.kebede@mor.gov.et',
    role: 'audit_director',
    status: 'active'
  },

  // Regional Directors
  {
    id: 'user-006',
    full_name: 'Tesfaye Megersa (Oromia)',
    email: 'tesfaye.megersa@mor.gov.et',
    role: 'regional_director',
    status: 'active'
  },
  {
    id: 'user-007',
    full_name: 'Meseret Lemma (Amhara)',
    email: 'meseret.lemma@mor.gov.et',
    role: 'regional_director',
    status: 'active'
  },
  {
    id: 'user-008',
    full_name: 'Getnet Desta (SNNPR)',
    email: 'getnet.desta@mor.gov.et',
    role: 'regional_director',
    status: 'active'
  },
  {
    id: 'user-009',
    full_name: 'Mulu Tadesse (Addis Ababa)',
    email: 'mulu.tadesse@mor.gov.et',
    role: 'regional_director',
    status: 'active'
  },
  {
    id: 'user-010',
    full_name: 'Tewodros Bahru (Tigray)',
    email: 'tewodros.bahru@mor.gov.et',
    role: 'regional_director',
    status: 'active'
  },

  // Tax Center Managers
  {
    id: 'user-011',
    full_name: 'Kebede Abebe (Oromia TC1)',
    email: 'kebede.abebe@mor.gov.et',
    role: 'tax_center_manager',
    status: 'active'
  },
  {
    id: 'user-012',
    full_name: 'Selam Girma (Oromia TC2)',
    email: 'selam.girma@mor.gov.et',
    role: 'tax_center_manager',
    status: 'active'
  },
  {
    id: 'user-013',
    full_name: 'Yohannes Worku (Amhara TC1)',
    email: 'yohannes.worku@mor.gov.et',
    role: 'tax_center_manager',
    status: 'active'
  },
  {
    id: 'user-014',
    full_name: 'Almaz Tekle (Addis Ababa TC1)',
    email: 'almaz.tekle@mor.gov.et',
    role: 'tax_center_manager',
    status: 'active'
  },



  // Team Leaders
  {
    id: 'user-017',
    full_name: 'Solomon Negatu (Desk Audit Lead)',
    email: 'solomon.negatu@mor.gov.et',
    role: 'team_leader',
    status: 'active'
  },
  {
    id: 'user-018',
    full_name: 'Bethel Taye (Field Audit Lead)',
    email: 'bethel.taye@mor.gov.et',
    role: 'team_leader',
    status: 'active'
  },
  {
    id: 'user-019',
    full_name: 'Lulu Ahmed (Joint Audit Lead)',
    email: 'lulu.ahmed@mor.gov.et',
    role: 'team_leader',
    status: 'active'
  },

  // Auditors
  {
    id: 'user-020',
    full_name: 'Kefyalew Mulat',
    email: 'kefyalew.mulat@mor.gov.et',
    role: 'auditor',
    status: 'active'
  },
  {
    id: 'user-021',
    full_name: 'Tigist Seyoum',
    email: 'tigist.seyoum@mor.gov.et',
    role: 'auditor',
    status: 'active'
  },
  {
    id: 'user-022',
    full_name: 'Worku Bekele',
    email: 'worku.bekele@mor.gov.et',
    role: 'auditor',
    status: 'active'
  },
  {
    id: 'user-023',
    full_name: 'Abreham Tesfaye',
    email: 'abreham.tesfaye@mor.gov.et',
    role: 'auditor',
    status: 'active'
  },
  {
    id: 'user-024',
    full_name: 'Zewdie Mekonnen',
    email: 'zewdie.mekonnen@mor.gov.et',
    role: 'auditor',
    status: 'active'
  },

  // Senior Management
  {
    id: 'user-025',
    full_name: 'Dr. Desta Alemu (Commissioner)',
    email: 'desta.alemu@mor.gov.et',
    role: 'senior_management',
    status: 'active'
  },
  {
    id: 'user-026',
    full_name: 'Eng. Mengistu Gebre (Deputy Commissioner)',
    email: 'mengistu.gebre@mor.gov.et',
    role: 'senior_management',
    status: 'active'
  }
];

/**
 * Get users by role
 */
export function getUsersByRole(role) {
  return MOCK_USERS.filter(u => u.role === role);
}

/**
 * Get all users
 */
export function getAllUsers() {
  return MOCK_USERS;
}

/**
 * Get user by ID
 */
export function getUserById(id) {
  return MOCK_USERS.find(u => u.id === id);
}

/**
 * Get user by email
 */
export function getUserByEmail(email) {
  return MOCK_USERS.find(u => u.email === email);
}
