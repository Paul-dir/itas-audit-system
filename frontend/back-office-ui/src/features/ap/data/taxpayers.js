/**
 * Local Taxpayer Database
 * Simulates Risk Engine data for testing
 * 
 * EXPANDED DATABASE (v2):
 * - 50+ taxpayers per tax center (150+ total for Addis Ababa)
 * - Realistic Ethiopian businesses
 * - Distributed across all risk levels
 * - Covers all audit types
 */

// ============================================================
// TAXPAYER DATABASE - ADDIS ABABA (Real Data)
// ============================================================

export const ADDIS_ABABA_TAXPAYERS = [
  // ═══════════════════════════════════════════════════════════
  // ADDIS ABABA - TC1 (High-value businesses) - 50 taxpayers
  // ═══════════════════════════════════════════════════════════
  
  // CRITICAL RISK - Comprehensive Audits
  {
    id: 'tp-aa-001',
    tin: 'TIN-1001234',
    name: 'Abyssinia Bank S.C.',
    sector: 'Financial Services',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 92,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 5200000000, // 5.2 Billion ETB
    employees: 450,
    registeredDate: '2010-03-15',
    lastAudit: '2022-06-10',
    complianceHistory: 'Multiple late filings',
    address: 'Bole, Addis Ababa'
  },
  {
    id: 'tp-aa-002',
    tin: 'TIN-1001235',
    name: 'Ethiopian Airlines Ground Services',
    sector: 'Transportation',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 90,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 4800000000,
    employees: 520,
    registeredDate: '2008-01-20',
    lastAudit: '2021-11-15',
    complianceHistory: 'Transfer pricing concerns',
    address: 'Bole International Airport Area'
  },
  {
    id: 'tp-aa-003',
    tin: 'TIN-1001236',
    name: 'Nib International Bank',
    sector: 'Financial Services',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 88,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 3900000000,
    employees: 380,
    registeredDate: '2011-05-10',
    lastAudit: '2022-09-20',
    complianceHistory: 'Good compliance record',
    address: 'Meskel Square, Addis Ababa'
  },

  // HIGH RISK - Field Audits
  {
    id: 'tp-aa-004',
    tin: 'TIN-1001237',
    name: 'Sunshine Construction PLC',
    sector: 'Construction',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 82,
    riskLevel: 'HIGH',
    suggestedAuditType: 'field_audit',
    annualRevenue: 2100000000,
    employees: 280,
    registeredDate: '2015-08-12',
    lastAudit: '2023-02-14',
    complianceHistory: 'VAT discrepancies',
    address: 'Kazanchis, Addis Ababa'
  },
  {
    id: 'tp-aa-005',
    tin: 'TIN-1001238',
    name: 'Moenco Engineering',
    sector: 'Construction',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 80,
    riskLevel: 'HIGH',
    suggestedAuditType: 'field_audit',
    annualRevenue: 1850000000,
    employees: 310,
    registeredDate: '2012-04-20',
    lastAudit: '2022-12-05',
    complianceHistory: 'Payroll tax issues',
    address: 'CMC Area, Addis Ababa'
  },
  {
    id: 'tp-aa-006',
    tin: 'TIN-1001239',
    name: 'Imperial Hotel Group',
    sector: 'Hospitality',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 78,
    riskLevel: 'HIGH',
    suggestedAuditType: 'field_audit',
    annualRevenue: 1650000000,
    employees: 195,
    registeredDate: '2009-11-08',
    lastAudit: '2023-01-18',
    complianceHistory: 'Service tax concerns',
    address: 'Bole Road, Addis Ababa'
  },

  // MEDIUM RISK - Desk Audits
  {
    id: 'tp-aa-007',
    tin: 'TIN-1001240',
    name: 'Addis Import Export Ltd',
    sector: 'Import/Export',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 68,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 950000000,
    employees: 85,
    registeredDate: '2016-02-14',
    lastAudit: '2023-05-22',
    complianceHistory: 'Minor filing delays',
    address: 'Piazza, Addis Ababa'
  },
  {
    id: 'tp-aa-008',
    tin: 'TIN-1001241',
    name: 'Sheger Pharmaceuticals',
    sector: 'Pharmaceuticals',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 65,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 820000000,
    employees: 72,
    registeredDate: '2017-06-30',
    lastAudit: '2023-07-10',
    complianceHistory: 'Good compliance',
    address: 'Merkato, Addis Ababa'
  },
  
  // ─────────────────────────────────────────────────────────
  // ADDIS ABABA - TC2 (Medium businesses)
  // ─────────────────────────────────────────────────────────
  
  // Transfer Pricing cases
  {
    id: 'tp-aa-101',
    tin: 'TIN-1002001',
    name: 'China Road Bridge Corporation - Ethiopia',
    sector: 'Construction',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 85,
    riskLevel: 'HIGH',
    suggestedAuditType: 'transfer_pricing',
    annualRevenue: 3200000000,
    employees: 420,
    registeredDate: '2013-03-10',
    lastAudit: '2022-08-15',
    complianceHistory: 'Related party transactions',
    address: 'Lebu, Addis Ababa'
  },
  {
    id: 'tp-aa-102',
    tin: 'TIN-1002002',
    name: 'Unilever Ethiopia',
    sector: 'Manufacturing',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 83,
    riskLevel: 'HIGH',
    suggestedAuditType: 'transfer_pricing',
    annualRevenue: 2800000000,
    employees: 350,
    registeredDate: '2010-07-22',
    lastAudit: '2022-10-30',
    complianceHistory: 'Intercompany pricing review needed',
    address: 'Kality, Addis Ababa'
  },

  // Joint Audits (Complex cases)
  {
    id: 'tp-aa-103',
    tin: 'TIN-1002003',
    name: 'Ethio Telecom',
    sector: 'Telecommunications',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 95,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'joint_audit',
    annualRevenue: 8500000000,
    employees: 1200,
    registeredDate: '2008-01-01',
    lastAudit: '2021-12-20',
    complianceHistory: 'Complex revenue streams, needs joint audit',
    address: 'Churchill Avenue, Addis Ababa'
  },
  {
    id: 'tp-aa-104',
    tin: 'TIN-1002004',
    name: 'Commercial Bank of Ethiopia',
    sector: 'Financial Services',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 93,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'joint_audit',
    annualRevenue: 7200000000,
    employees: 980,
    registeredDate: '2007-05-15',
    lastAudit: '2022-03-10',
    complianceHistory: 'Multiple revenue sources, complex structure',
    address: 'Mexico Square, Addis Ababa'
  },

  // More Desk Audits
  {
    id: 'tp-aa-105',
    tin: 'TIN-1002005',
    name: 'Addis Supermarket Chain',
    sector: 'Retail',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 62,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 680000000,
    employees: 145,
    registeredDate: '2018-04-12',
    lastAudit: '2023-06-05',
    complianceHistory: 'Clean record',
    address: 'Sarbet, Addis Ababa'
  },

  // ─────────────────────────────────────────────────────────
  // ADDIS ABABA - TC3 (Small to Medium businesses)
  // ─────────────────────────────────────────────────────────
  
  {
    id: 'tp-aa-201',
    tin: 'TIN-1003001',
    name: 'Bole Printing Press',
    sector: 'Manufacturing',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 58,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 420000000,
    employees: 68,
    registeredDate: '2019-01-20',
    lastAudit: '2023-08-15',
    complianceHistory: 'Good',
    address: 'Bole, Addis Ababa'
  },
  {
    id: 'tp-aa-202',
    tin: 'TIN-1003002',
    name: 'Meskel Flower Export',
    sector: 'Agriculture',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 72,
    riskLevel: 'HIGH',
    suggestedAuditType: 'field_audit',
    annualRevenue: 1250000000,
    employees: 220,
    registeredDate: '2014-09-10',
    lastAudit: '2022-11-28',
    complianceHistory: 'Export tax verification needed',
    address: 'Meskel Square Area'
  },
  {
    id: 'tp-aa-203',
    tin: 'TIN-1003003',
    name: 'Awash Wine Factory',
    sector: 'Manufacturing',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 55,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 385000000,
    employees: 52,
    registeredDate: '2020-02-14',
    lastAudit: '2023-09-10',
    complianceHistory: 'Clean',
    address: 'Kality Industrial Zone'
  },
  

  {
    id: 'tp-aa-tc1-100',
    tin: 'TIN-1200',
    name: 'Ethio IT Solutions PLC',
    sector: 'Telecommunications',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 93,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 5501000000,
    employees: 749,
    registeredDate: '2019-04-30',
    lastAudit: '2023-03-03',
    complianceHistory: 'Minor discrepancies noted',
    address: 'Bole, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-101',
    tin: 'TIN-1201',
    name: 'Muller & Phipps Ethiopia',
    sector: 'Import/Export',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 65,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 275000000,
    employees: 57,
    registeredDate: '2013-06-24',
    lastAudit: '2021-01-18',
    complianceHistory: 'Minor filing delays',
    address: 'Arat Kilo, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-102',
    tin: 'TIN-1202',
    name: 'Abay Bank S.C.',
    sector: 'Financial Services',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 64,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 345000000,
    employees: 57,
    registeredDate: '2012-09-14',
    lastAudit: '2021-05-25',
    complianceHistory: 'Production volume discrepancies',
    address: 'Arat Kilo, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-103',
    tin: 'TIN-1203',
    name: 'Wonji Sugar Factory',
    sector: 'Manufacturing',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 54,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 512000000,
    employees: 76,
    registeredDate: '2015-04-08',
    lastAudit: '2021-03-21',
    complianceHistory: 'Intercompany pricing review needed',
    address: 'Piazza, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-104',
    tin: 'TIN-1204',
    name: 'Hayat Medical Center',
    sector: 'Healthcare',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 47,
    riskLevel: 'LOW',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 161000000,
    employees: 53,
    registeredDate: '2009-03-01',
    lastAudit: '2021-03-04',
    complianceHistory: 'Payroll tax issues',
    address: 'Piazza, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-105',
    tin: 'TIN-1205',
    name: 'Meri Best Supermarket PLC',
    sector: 'Retail',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 55,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 596000000,
    employees: 105,
    registeredDate: '2014-03-08',
    lastAudit: '2022-04-17',
    complianceHistory: 'Export tax verification needed',
    address: 'Mexico Square, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-106',
    tin: 'TIN-1206',
    name: 'Digital Ethiopia Corp',
    sector: 'Telecommunications',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 60,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 681000000,
    employees: 103,
    registeredDate: '2014-04-24',
    lastAudit: '2023-04-13',
    complianceHistory: 'Clean record',
    address: 'Gerji, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-107',
    tin: 'TIN-1207',
    name: 'Intercontinental Hotel',
    sector: 'Hospitality',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 85,
    riskLevel: 'HIGH',
    suggestedAuditType: 'field_audit',
    annualRevenue: 1739000000,
    employees: 266,
    registeredDate: '2014-02-06',
    lastAudit: '2021-12-05',
    complianceHistory: 'Intercompany pricing review needed',
    address: 'CMC, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-108',
    tin: 'TIN-1208',
    name: 'Flintstone Development',
    sector: 'Real Estate',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 91,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 4398000000,
    employees: 638,
    registeredDate: '2011-12-22',
    lastAudit: '2021-05-27',
    complianceHistory: 'Minor discrepancies noted',
    address: 'Megenagna, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-109',
    tin: 'TIN-1209',
    name: 'Etete Supermarket',
    sector: 'Retail',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 52,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 642000000,
    employees: 86,
    registeredDate: '2017-02-16',
    lastAudit: '2022-04-14',
    complianceHistory: 'Intercompany pricing review needed',
    address: 'CMC, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-110',
    tin: 'TIN-1210',
    name: 'Kaleb Engineering',
    sector: 'Construction',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 62,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 627000000,
    employees: 113,
    registeredDate: '2015-10-27',
    lastAudit: '2021-10-03',
    complianceHistory: 'Intercompany pricing review needed',
    address: 'Lebu, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-111',
    tin: 'TIN-1211',
    name: 'Tsehay Bank',
    sector: 'Financial Services',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 55,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 698000000,
    employees: 94,
    registeredDate: '2014-10-20',
    lastAudit: '2023-09-11',
    complianceHistory: 'Complex revenue streams',
    address: 'Sarbet, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-112',
    tin: 'TIN-1212',
    name: 'Todo Market',
    sector: 'Retail',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 94,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 6656000000,
    employees: 1055,
    registeredDate: '2014-01-06',
    lastAudit: '2023-08-14',
    complianceHistory: 'VAT discrepancies',
    address: 'Bambis, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-113',
    tin: 'TIN-1213',
    name: 'Etete Supermarket Co.',
    sector: 'Retail',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 94,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 8426000000,
    employees: 1008,
    registeredDate: '2018-05-19',
    lastAudit: '2022-03-08',
    complianceHistory: 'Late filings',
    address: 'Gerji, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-114',
    tin: 'TIN-1214',
    name: 'Mama Fresh Market',
    sector: 'Retail',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 55,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 709000000,
    employees: 141,
    registeredDate: '2010-03-01',
    lastAudit: '2023-05-21',
    complianceHistory: 'VAT discrepancies',
    address: 'Kazanchis, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-115',
    tin: 'TIN-1215',
    name: 'Nazret Brewery',
    sector: 'Manufacturing',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 62,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 531000000,
    employees: 101,
    registeredDate: '2018-09-23',
    lastAudit: '2021-03-27',
    complianceHistory: 'Payroll tax issues',
    address: 'Kotebe, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-116',
    tin: 'TIN-1216',
    name: 'Messebo Cement',
    sector: 'Manufacturing',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 30,
    riskLevel: 'LOW',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 162000000,
    employees: 52,
    registeredDate: '2011-05-24',
    lastAudit: '2022-02-21',
    complianceHistory: 'Revenue underreporting concerns',
    address: 'Meskel Square, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-117',
    tin: 'TIN-1217',
    name: 'Jupiter International Hotel',
    sector: 'Hospitality',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 42,
    riskLevel: 'LOW',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 144000000,
    employees: 55,
    registeredDate: '2017-12-28',
    lastAudit: '2022-04-06',
    complianceHistory: 'Clean record',
    address: 'Kazanchis, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-118',
    tin: 'TIN-1218',
    name: 'Digital Ethiopia',
    sector: 'Telecommunications',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 56,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 241000000,
    employees: 50,
    registeredDate: '2014-05-21',
    lastAudit: '2023-10-20',
    complianceHistory: 'Multiple late filings',
    address: 'Gerji, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-119',
    tin: 'TIN-1219',
    name: 'Wegagen Bus',
    sector: 'Transportation',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 52,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 701000000,
    employees: 96,
    registeredDate: '2017-03-12',
    lastAudit: '2023-01-23',
    complianceHistory: 'Service tax concerns',
    address: 'Bole, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-120',
    tin: 'TIN-1220',
    name: 'Addis Land PLC',
    sector: 'Real Estate',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 44,
    riskLevel: 'LOW',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 125000000,
    employees: 30,
    registeredDate: '2011-07-04',
    lastAudit: '2022-07-18',
    complianceHistory: 'Late filings',
    address: 'Piazza, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-121',
    tin: 'TIN-1221',
    name: 'Addis International Bank',
    sector: 'Financial Services',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 62,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 609000000,
    employees: 93,
    registeredDate: '2015-01-13',
    lastAudit: '2021-03-29',
    complianceHistory: 'Clean record',
    address: 'Kotebe, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-122',
    tin: 'TIN-1222',
    name: 'Admas University',
    sector: 'Education',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 47,
    riskLevel: 'LOW',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 96000000,
    employees: 64,
    registeredDate: '2009-01-17',
    lastAudit: '2022-02-09',
    complianceHistory: 'Export tax verification needed',
    address: 'Sidist Kilo, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-123',
    tin: 'TIN-1223',
    name: 'Sheger Transport',
    sector: 'Transportation',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 33,
    riskLevel: 'LOW',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 176000000,
    employees: 43,
    registeredDate: '2008-07-02',
    lastAudit: '2022-10-02',
    complianceHistory: 'Late filings',
    address: 'Arat Kilo, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-124',
    tin: 'TIN-1224',
    name: 'Guna Trading House',
    sector: 'Import/Export',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 35,
    riskLevel: 'LOW',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 175000000,
    employees: 68,
    registeredDate: '2012-08-25',
    lastAudit: '2021-07-04',
    complianceHistory: 'Good compliance record',
    address: 'Kality, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-125',
    tin: 'TIN-1225',
    name: 'Selam Bus',
    sector: 'Transportation',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 65,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 630000000,
    employees: 96,
    registeredDate: '2016-11-28',
    lastAudit: '2022-08-17',
    complianceHistory: 'Service tax concerns',
    address: 'Kality, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-126',
    tin: 'TIN-1226',
    name: 'Bole Real Estate Corp',
    sector: 'Real Estate',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 69,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 292000000,
    employees: 65,
    registeredDate: '2015-09-26',
    lastAudit: '2022-01-02',
    complianceHistory: 'Excise tax review needed',
    address: 'Akaki, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-127',
    tin: 'TIN-1227',
    name: 'ICT Ethiopia',
    sector: 'Telecommunications',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 48,
    riskLevel: 'LOW',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 130000000,
    employees: 67,
    registeredDate: '2020-04-06',
    lastAudit: '2021-04-23',
    complianceHistory: 'VAT discrepancies',
    address: 'Merkato, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-128',
    tin: 'TIN-1228',
    name: 'Nile Petroleum',
    sector: 'Energy',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 67,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 718000000,
    employees: 125,
    registeredDate: '2016-10-15',
    lastAudit: '2021-08-14',
    complianceHistory: 'Compliant',
    address: 'Sidist Kilo, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-129',
    tin: 'TIN-1229',
    name: 'Wonji Sugar Factory Ltd',
    sector: 'Manufacturing',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 98,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 7980000000,
    employees: 864,
    registeredDate: '2014-09-07',
    lastAudit: '2021-05-06',
    complianceHistory: 'Clean record',
    address: 'Merkato, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-130',
    tin: 'TIN-1230',
    name: 'Meta Abo Brewery',
    sector: 'Manufacturing',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 61,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 438000000,
    employees: 69,
    registeredDate: '2020-08-05',
    lastAudit: '2022-06-26',
    complianceHistory: 'Late filings',
    address: 'Sarbet, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-131',
    tin: 'TIN-1231',
    name: 'Zemzem Bank',
    sector: 'Financial Services',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 88,
    riskLevel: 'HIGH',
    suggestedAuditType: 'field_audit',
    annualRevenue: 1472000000,
    employees: 174,
    registeredDate: '2015-11-08',
    lastAudit: '2022-07-31',
    complianceHistory: 'Payroll tax issues',
    address: 'Summit, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-132',
    tin: 'TIN-1232',
    name: 'Yekatit Hospital Supply S.C.',
    sector: 'Healthcare',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 59,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 784000000,
    employees: 138,
    registeredDate: '2020-08-18',
    lastAudit: '2021-07-02',
    complianceHistory: 'Late filings',
    address: 'Meskel Square, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-133',
    tin: 'TIN-1233',
    name: 'Myungsung Medical Center Group',
    sector: 'Healthcare',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 58,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 649000000,
    employees: 115,
    registeredDate: '2012-09-15',
    lastAudit: '2022-08-15',
    complianceHistory: 'Multiple revenue sources',
    address: 'Bambis, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-134',
    tin: 'TIN-1234',
    name: 'Etete Supermarket',
    sector: 'Retail',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 64,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 646000000,
    employees: 135,
    registeredDate: '2016-10-15',
    lastAudit: '2021-12-06',
    complianceHistory: 'VAT discrepancies',
    address: 'Piazza, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-135',
    tin: 'TIN-1235',
    name: 'Jimma Coffee Ltd',
    sector: 'Agriculture',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 55,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 329000000,
    employees: 85,
    registeredDate: '2019-10-03',
    lastAudit: '2023-04-28',
    complianceHistory: 'Payroll tax issues',
    address: 'Sarbet, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-136',
    tin: 'TIN-1236',
    name: 'Abay Bus Co.',
    sector: 'Transportation',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 53,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 696000000,
    employees: 121,
    registeredDate: '2017-12-12',
    lastAudit: '2021-04-17',
    complianceHistory: 'Minor filing delays',
    address: 'Mexico Square, Addis Ababa'
  },

  {
    id: 'tp-aa-tc1-137',
    tin: 'TIN-1237',
    name: 'Yassin Coffee Export PLC',
    sector: 'Agriculture',
    taxCenter: 'addis_ababa-tc1',
    region: 'addis_ababa',
    riskScore: 62,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 778000000,
    employees: 100,
    registeredDate: '2020-05-20',
    lastAudit: '2023-02-20',
    complianceHistory: 'Minor discrepancies noted',
    address: 'Mexico Square, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-200',
    tin: 'TIN-2300',
    name: 'Goh Betoch Trading Group',
    sector: 'Import/Export',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 39,
    riskLevel: 'LOW',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 125000000,
    employees: 52,
    registeredDate: '2015-05-24',
    lastAudit: '2022-08-10',
    complianceHistory: 'Export tax verification needed',
    address: 'Lebu, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-201',
    tin: 'TIN-2301',
    name: 'NetSol Ethiopia Corp',
    sector: 'Telecommunications',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 80,
    riskLevel: 'HIGH',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 1159000000,
    employees: 204,
    registeredDate: '2019-09-10',
    lastAudit: '2021-11-19',
    complianceHistory: 'Multiple late filings',
    address: 'CMC, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-202',
    tin: 'TIN-2302',
    name: 'Guna Trading House Group',
    sector: 'Import/Export',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 59,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 548000000,
    employees: 82,
    registeredDate: '2009-02-15',
    lastAudit: '2023-02-09',
    complianceHistory: 'Service tax concerns',
    address: 'Megenagna, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-203',
    tin: 'TIN-2303',
    name: 'Oromia Bank',
    sector: 'Financial Services',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 51,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 268000000,
    employees: 45,
    registeredDate: '2019-12-27',
    lastAudit: '2021-12-05',
    complianceHistory: 'Complex revenue streams',
    address: 'Akaki, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-204',
    tin: 'TIN-2304',
    name: 'Admas University',
    sector: 'Education',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 34,
    riskLevel: 'LOW',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 170000000,
    employees: 35,
    registeredDate: '2010-04-22',
    lastAudit: '2021-08-06',
    complianceHistory: 'Minor filing delays',
    address: 'Bole, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-205',
    tin: 'TIN-2305',
    name: 'Sher Ethiopia S.C.',
    sector: 'Agriculture',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 53,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 690000000,
    employees: 83,
    registeredDate: '2015-12-07',
    lastAudit: '2021-02-22',
    complianceHistory: 'Revenue underreporting concerns',
    address: 'Bambis, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-206',
    tin: 'TIN-2306',
    name: 'NetSol Ethiopia',
    sector: 'Telecommunications',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 54,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 712000000,
    employees: 140,
    registeredDate: '2019-03-26',
    lastAudit: '2022-08-31',
    complianceHistory: 'Excise tax review needed',
    address: 'Merkato, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-207',
    tin: 'TIN-2307',
    name: 'Ethiopian Sugar Corporation',
    sector: 'Manufacturing',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 96,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 7970000000,
    employees: 1230,
    registeredDate: '2011-11-17',
    lastAudit: '2021-08-14',
    complianceHistory: 'Related party transactions need review',
    address: 'Lebu, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-208',
    tin: 'TIN-2308',
    name: 'Bethel Medical',
    sector: 'Healthcare',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 57,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 459000000,
    employees: 102,
    registeredDate: '2018-05-10',
    lastAudit: '2021-06-22',
    complianceHistory: 'Service tax concerns',
    address: 'Piazza, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-209',
    tin: 'TIN-2309',
    name: 'Microlink College',
    sector: 'Education',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 72,
    riskLevel: 'HIGH',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 1136000000,
    employees: 153,
    registeredDate: '2017-06-02',
    lastAudit: '2023-04-30',
    complianceHistory: 'Late filings',
    address: 'Kality, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-210',
    tin: 'TIN-2310',
    name: 'Ras Desta Medical',
    sector: 'Healthcare',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 90,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 7249000000,
    employees: 1168,
    registeredDate: '2012-05-13',
    lastAudit: '2021-05-16',
    complianceHistory: 'Intercompany pricing review needed',
    address: 'Akaki, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-211',
    tin: 'TIN-2311',
    name: 'Nile Petroleum',
    sector: 'Energy',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 62,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 415000000,
    employees: 79,
    registeredDate: '2015-12-09',
    lastAudit: '2023-03-03',
    complianceHistory: 'Minor discrepancies noted',
    address: 'CMC, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-212',
    tin: 'TIN-2312',
    name: 'Addis International Bank',
    sector: 'Financial Services',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 51,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 647000000,
    employees: 126,
    registeredDate: '2018-08-15',
    lastAudit: '2023-11-08',
    complianceHistory: 'Service tax concerns',
    address: 'Summit, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-213',
    tin: 'TIN-2313',
    name: 'Bole Real Estate Co.',
    sector: 'Real Estate',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 83,
    riskLevel: 'HIGH',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 889000000,
    employees: 146,
    registeredDate: '2009-09-08',
    lastAudit: '2021-11-28',
    complianceHistory: 'Complex revenue streams',
    address: 'Arat Kilo, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-214',
    tin: 'TIN-2314',
    name: 'Safaricom Ethiopia',
    sector: 'Telecommunications',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 68,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 776000000,
    employees: 167,
    registeredDate: '2008-12-15',
    lastAudit: '2023-03-03',
    complianceHistory: 'Late filings',
    address: 'Meskel Square, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-215',
    tin: 'TIN-2315',
    name: 'Total Ethiopia',
    sector: 'Energy',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 84,
    riskLevel: 'HIGH',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 1346000000,
    employees: 242,
    registeredDate: '2018-01-23',
    lastAudit: '2021-04-04',
    complianceHistory: 'Compliant',
    address: 'Merkato, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-216',
    tin: 'TIN-2316',
    name: 'Unity University',
    sector: 'Education',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 72,
    riskLevel: 'HIGH',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 1366000000,
    employees: 180,
    registeredDate: '2017-07-07',
    lastAudit: '2022-09-30',
    complianceHistory: 'Transfer pricing concerns',
    address: 'Kality, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-217',
    tin: 'TIN-2317',
    name: 'Rift Valley University',
    sector: 'Education',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 91,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 4122000000,
    employees: 555,
    registeredDate: '2008-04-29',
    lastAudit: '2023-06-18',
    complianceHistory: 'Revenue underreporting concerns',
    address: 'Kazanchis, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-218',
    tin: 'TIN-2318',
    name: 'Berhan Bank PLC',
    sector: 'Financial Services',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 66,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 714000000,
    employees: 98,
    registeredDate: '2011-07-27',
    lastAudit: '2021-10-25',
    complianceHistory: 'Minor discrepancies noted',
    address: 'Gerji, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-219',
    tin: 'TIN-2319',
    name: 'Koye Feche Real Estate',
    sector: 'Real Estate',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 64,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 733000000,
    employees: 121,
    registeredDate: '2009-01-27',
    lastAudit: '2022-12-17',
    complianceHistory: 'Minor filing delays',
    address: 'Megenagna, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-220',
    tin: 'TIN-2320',
    name: 'Eliana Hotel Co.',
    sector: 'Hospitality',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 67,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 409000000,
    employees: 82,
    registeredDate: '2012-06-11',
    lastAudit: '2023-03-25',
    complianceHistory: 'Minor filing delays',
    address: 'Merkato, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-221',
    tin: 'TIN-2321',
    name: 'Gurd Shola Real Estate',
    sector: 'Real Estate',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 59,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 244000000,
    employees: 52,
    registeredDate: '2018-05-15',
    lastAudit: '2021-04-24',
    complianceHistory: 'Related party transactions need review',
    address: 'Bambis, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-222',
    tin: 'TIN-2322',
    name: 'Aman Import Export',
    sector: 'Import/Export',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 65,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 721000000,
    employees: 164,
    registeredDate: '2017-08-04',
    lastAudit: '2023-08-06',
    complianceHistory: 'Complex revenue streams',
    address: 'Kality, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-223',
    tin: 'TIN-2323',
    name: 'Flintstone Development',
    sector: 'Real Estate',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 52,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 463000000,
    employees: 83,
    registeredDate: '2009-03-31',
    lastAudit: '2021-06-30',
    complianceHistory: 'Excise tax review needed',
    address: 'Akaki, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-224',
    tin: 'TIN-2324',
    name: 'Anbessa City Bus',
    sector: 'Transportation',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 89,
    riskLevel: 'HIGH',
    suggestedAuditType: 'field_audit',
    annualRevenue: 1382000000,
    employees: 206,
    registeredDate: '2017-01-30',
    lastAudit: '2022-12-08',
    complianceHistory: 'Late filings',
    address: 'Meskel Square, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-225',
    tin: 'TIN-2325',
    name: 'Kefeta Trading',
    sector: 'Import/Export',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 99,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 7866000000,
    employees: 1136,
    registeredDate: '2012-10-29',
    lastAudit: '2023-03-09',
    complianceHistory: 'Excise tax review needed',
    address: 'Arat Kilo, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-226',
    tin: 'TIN-2326',
    name: 'Cooperative Bank of Oromia',
    sector: 'Financial Services',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 66,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 336000000,
    employees: 46,
    registeredDate: '2020-05-07',
    lastAudit: '2023-01-25',
    complianceHistory: 'Good compliance record',
    address: 'Lebu, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-227',
    tin: 'TIN-2327',
    name: 'Guji Coffee Export',
    sector: 'Agriculture',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 55,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 275000000,
    employees: 71,
    registeredDate: '2008-12-27',
    lastAudit: '2023-04-25',
    complianceHistory: 'Minor filing delays',
    address: 'Kality, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-228',
    tin: 'TIN-2328',
    name: 'Ras Desta Medical',
    sector: 'Healthcare',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 66,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 372000000,
    employees: 102,
    registeredDate: '2015-03-12',
    lastAudit: '2022-09-11',
    complianceHistory: 'VAT discrepancies',
    address: 'Summit, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-229',
    tin: 'TIN-2329',
    name: 'Gurd Shola Real Estate',
    sector: 'Real Estate',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 58,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 455000000,
    employees: 95,
    registeredDate: '2012-11-23',
    lastAudit: '2023-06-15',
    complianceHistory: 'Compliant',
    address: 'Gerji, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-230',
    tin: 'TIN-2330',
    name: 'Rift Valley University',
    sector: 'Education',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 44,
    riskLevel: 'LOW',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 52000000,
    employees: 19,
    registeredDate: '2008-08-11',
    lastAudit: '2021-05-05',
    complianceHistory: 'Complex revenue streams',
    address: 'CMC, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-231',
    tin: 'TIN-2331',
    name: 'Bambis Supermarket',
    sector: 'Retail',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 53,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 201000000,
    employees: 64,
    registeredDate: '2014-02-13',
    lastAudit: '2022-03-02',
    complianceHistory: 'Excise tax review needed',
    address: 'Lebu, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-232',
    tin: 'TIN-2332',
    name: 'Myungsung Medical Center',
    sector: 'Healthcare',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 43,
    riskLevel: 'LOW',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 198000000,
    employees: 46,
    registeredDate: '2019-09-23',
    lastAudit: '2022-04-02',
    complianceHistory: 'Intercompany pricing review needed',
    address: 'Piazza, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-233',
    tin: 'TIN-2333',
    name: 'Ethio IT Solutions',
    sector: 'Telecommunications',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 55,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 417000000,
    employees: 68,
    registeredDate: '2017-09-14',
    lastAudit: '2023-11-28',
    complianceHistory: 'Intercompany pricing review needed',
    address: 'Bole, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-234',
    tin: 'TIN-2334',
    name: 'Trans Ethiopia Trading',
    sector: 'Import/Export',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 32,
    riskLevel: 'LOW',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 163000000,
    employees: 58,
    registeredDate: '2014-09-19',
    lastAudit: '2022-04-16',
    complianceHistory: 'Minor filing delays',
    address: 'Kotebe, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-235',
    tin: 'TIN-2335',
    name: 'Global Petroleum',
    sector: 'Energy',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 41,
    riskLevel: 'LOW',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 77000000,
    employees: 25,
    registeredDate: '2010-10-17',
    lastAudit: '2021-07-27',
    complianceHistory: 'Good compliance record',
    address: 'Gerji, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-236',
    tin: 'TIN-2336',
    name: 'Mama Fresh Market S.C.',
    sector: 'Retail',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 68,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 622000000,
    employees: 128,
    registeredDate: '2019-08-28',
    lastAudit: '2023-08-10',
    complianceHistory: 'Multiple revenue sources',
    address: 'Meskel Square, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-237',
    tin: 'TIN-2337',
    name: 'Meri Best Supermarket',
    sector: 'Retail',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 64,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 400000000,
    employees: 72,
    registeredDate: '2018-12-21',
    lastAudit: '2022-08-10',
    complianceHistory: 'Late filings',
    address: 'Kotebe, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-238',
    tin: 'TIN-2338',
    name: 'Amhara Bank',
    sector: 'Financial Services',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 93,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 6173000000,
    employees: 659,
    registeredDate: '2020-12-24',
    lastAudit: '2023-08-11',
    complianceHistory: 'Revenue underreporting concerns',
    address: 'Kality, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-239',
    tin: 'TIN-2339',
    name: 'Gurd Shola Real Estate',
    sector: 'Real Estate',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 62,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 296000000,
    employees: 65,
    registeredDate: '2014-08-30',
    lastAudit: '2023-04-06',
    complianceHistory: 'Excise tax review needed',
    address: 'Akaki, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-240',
    tin: 'TIN-2340',
    name: 'Holland Car',
    sector: 'Import/Export',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 56,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 327000000,
    employees: 50,
    registeredDate: '2011-09-14',
    lastAudit: '2021-06-11',
    complianceHistory: 'Export tax verification needed',
    address: 'Kotebe, Addis Ababa'
  },

  {
    id: 'tp-aa-tc2-241',
    tin: 'TIN-2341',
    name: 'Alpha University',
    sector: 'Education',
    taxCenter: 'addis_ababa-tc2',
    region: 'addis_ababa',
    riskScore: 42,
    riskLevel: 'LOW',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 77000000,
    employees: 27,
    registeredDate: '2012-10-01',
    lastAudit: '2023-05-28',
    complianceHistory: 'Multiple revenue sources',
    address: 'Sarbet, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-300',
    tin: 'TIN-3400',
    name: 'Opal Construction Group',
    sector: 'Construction',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 57,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 726000000,
    employees: 111,
    registeredDate: '2019-09-21',
    lastAudit: '2023-06-14',
    complianceHistory: 'Transfer pricing concerns',
    address: 'Kazanchis, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-301',
    tin: 'TIN-3401',
    name: 'Abay Bus',
    sector: 'Transportation',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 55,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 414000000,
    employees: 77,
    registeredDate: '2017-07-26',
    lastAudit: '2022-06-26',
    complianceHistory: 'Related party transactions need review',
    address: 'Meskel Square, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-302',
    tin: 'TIN-3402',
    name: 'Mama Fresh Market S.C.',
    sector: 'Retail',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 99,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 8137000000,
    employees: 1298,
    registeredDate: '2012-10-20',
    lastAudit: '2023-09-13',
    complianceHistory: 'Import duty concerns',
    address: 'Summit, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-303',
    tin: 'TIN-3403',
    name: 'Sky Bus',
    sector: 'Transportation',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 70,
    riskLevel: 'HIGH',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 1914000000,
    employees: 246,
    registeredDate: '2011-07-30',
    lastAudit: '2021-05-24',
    complianceHistory: 'Import duty concerns',
    address: 'Megenagna, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-304',
    tin: 'TIN-3404',
    name: 'Unity University Ltd',
    sector: 'Education',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 67,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 488000000,
    employees: 100,
    registeredDate: '2009-05-20',
    lastAudit: '2021-02-26',
    complianceHistory: 'Minor discrepancies noted',
    address: 'Kotebe, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-305',
    tin: 'TIN-3405',
    name: 'Samson Trading',
    sector: 'Import/Export',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 100,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 6568000000,
    employees: 1102,
    registeredDate: '2013-09-02',
    lastAudit: '2021-02-05',
    complianceHistory: 'VAT discrepancies',
    address: 'Merkato, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-306',
    tin: 'TIN-3406',
    name: 'Messebo Cement Group',
    sector: 'Manufacturing',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 81,
    riskLevel: 'HIGH',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 1711000000,
    employees: 231,
    registeredDate: '2009-04-02',
    lastAudit: '2023-08-30',
    complianceHistory: 'Multiple late filings',
    address: 'Summit, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-307',
    tin: 'TIN-3407',
    name: 'Guna Trading House',
    sector: 'Import/Export',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 85,
    riskLevel: 'HIGH',
    suggestedAuditType: 'transfer_pricing',
    annualRevenue: 896000000,
    employees: 142,
    registeredDate: '2011-08-05',
    lastAudit: '2023-02-28',
    complianceHistory: 'Payroll tax issues',
    address: 'Akaki, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-308',
    tin: 'TIN-3408',
    name: 'Unity University',
    sector: 'Education',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 63,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 214000000,
    employees: 53,
    registeredDate: '2014-09-16',
    lastAudit: '2022-04-19',
    complianceHistory: 'Multiple revenue sources',
    address: 'Bole, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-309',
    tin: 'TIN-3409',
    name: 'Ayat Real Estate',
    sector: 'Real Estate',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 53,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 320000000,
    employees: 60,
    registeredDate: '2015-04-25',
    lastAudit: '2021-06-10',
    complianceHistory: 'Compliant',
    address: 'Megenagna, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-310',
    tin: 'TIN-3410',
    name: 'Microlink College',
    sector: 'Education',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 68,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 658000000,
    employees: 129,
    registeredDate: '2011-02-15',
    lastAudit: '2023-05-19',
    complianceHistory: 'Revenue underreporting concerns',
    address: 'Lebu, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-311',
    tin: 'TIN-3411',
    name: 'Nexus Hotel Group',
    sector: 'Hospitality',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 67,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 289000000,
    employees: 41,
    registeredDate: '2018-08-15',
    lastAudit: '2023-02-23',
    complianceHistory: 'Complex revenue streams',
    address: 'CMC, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-312',
    tin: 'TIN-3412',
    name: 'Addis Land',
    sector: 'Real Estate',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 83,
    riskLevel: 'HIGH',
    suggestedAuditType: 'field_audit',
    annualRevenue: 1508000000,
    employees: 226,
    registeredDate: '2016-04-05',
    lastAudit: '2022-10-17',
    complianceHistory: 'Payroll tax issues',
    address: 'Merkato, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-313',
    tin: 'TIN-3413',
    name: 'Derba Midroc Cement',
    sector: 'Manufacturing',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 72,
    riskLevel: 'HIGH',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 800000000,
    employees: 83,
    registeredDate: '2010-04-10',
    lastAudit: '2023-03-13',
    complianceHistory: 'Production volume discrepancies',
    address: 'Sarbet, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-314',
    tin: 'TIN-3414',
    name: 'Saba Engineering S.C.',
    sector: 'Construction',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 50,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 319000000,
    employees: 56,
    registeredDate: '2011-02-27',
    lastAudit: '2021-07-16',
    complianceHistory: 'VAT discrepancies',
    address: 'Summit, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-315',
    tin: 'TIN-3415',
    name: 'Etete Supermarket S.C.',
    sector: 'Retail',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 39,
    riskLevel: 'LOW',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 127000000,
    employees: 49,
    registeredDate: '2017-06-28',
    lastAudit: '2022-10-31',
    complianceHistory: 'Compliant',
    address: 'Gerji, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-316',
    tin: 'TIN-3416',
    name: 'Alpha University',
    sector: 'Education',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 84,
    riskLevel: 'HIGH',
    suggestedAuditType: 'field_audit',
    annualRevenue: 888000000,
    employees: 144,
    registeredDate: '2018-02-10',
    lastAudit: '2021-08-10',
    complianceHistory: 'Production volume discrepancies',
    address: 'Megenagna, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-317',
    tin: 'TIN-3417',
    name: 'Fresh Corner Supermarket Ltd',
    sector: 'Retail',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 54,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 534000000,
    employees: 101,
    registeredDate: '2013-03-01',
    lastAudit: '2023-10-12',
    complianceHistory: 'Transfer pricing concerns',
    address: 'Kotebe, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-318',
    tin: 'TIN-3418',
    name: 'ET Highland Flora Ltd',
    sector: 'Agriculture',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 60,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 766000000,
    employees: 129,
    registeredDate: '2019-04-18',
    lastAudit: '2023-08-16',
    complianceHistory: 'Related party transactions need review',
    address: 'Bole, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-319',
    tin: 'TIN-3419',
    name: 'Japan Motors Ethiopia',
    sector: 'Import/Export',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 93,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 6930000000,
    employees: 964,
    registeredDate: '2012-02-17',
    lastAudit: '2022-03-14',
    complianceHistory: 'Revenue underreporting concerns',
    address: 'CMC, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-320',
    tin: 'TIN-3420',
    name: 'Kality Gas S.C.',
    sector: 'Energy',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 83,
    riskLevel: 'HIGH',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 1307000000,
    employees: 147,
    registeredDate: '2020-12-22',
    lastAudit: '2021-07-25',
    complianceHistory: 'Minor discrepancies noted',
    address: 'Mexico Square, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-321',
    tin: 'TIN-3421',
    name: 'Zewditu Pharmacy PLC',
    sector: 'Healthcare',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 75,
    riskLevel: 'HIGH',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 932000000,
    employees: 110,
    registeredDate: '2010-02-19',
    lastAudit: '2021-05-11',
    complianceHistory: 'Related party transactions need review',
    address: 'Merkato, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-322',
    tin: 'TIN-3422',
    name: 'Flintstone Development',
    sector: 'Real Estate',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 32,
    riskLevel: 'LOW',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 87000000,
    employees: 56,
    registeredDate: '2019-07-18',
    lastAudit: '2021-05-25',
    complianceHistory: 'Minor discrepancies noted',
    address: 'Lebu, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-323',
    tin: 'TIN-3423',
    name: 'Sheger Transport',
    sector: 'Transportation',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 51,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 329000000,
    employees: 45,
    registeredDate: '2011-11-02',
    lastAudit: '2023-08-17',
    complianceHistory: 'Late filings',
    address: 'CMC, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-324',
    tin: 'TIN-3424',
    name: 'Guna Trading House',
    sector: 'Import/Export',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 60,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 228000000,
    employees: 38,
    registeredDate: '2015-06-09',
    lastAudit: '2021-02-10',
    complianceHistory: 'Export tax verification needed',
    address: 'Gerji, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-325',
    tin: 'TIN-3425',
    name: 'Anbessa City Bus S.C.',
    sector: 'Transportation',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 63,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 543000000,
    employees: 72,
    registeredDate: '2018-08-19',
    lastAudit: '2021-10-24',
    complianceHistory: 'Transfer pricing concerns',
    address: 'Sidist Kilo, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-326',
    tin: 'TIN-3426',
    name: 'Berhan Bank',
    sector: 'Financial Services',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 97,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 5397000000,
    employees: 644,
    registeredDate: '2008-12-21',
    lastAudit: '2022-05-23',
    complianceHistory: 'Complex revenue streams',
    address: 'Bole, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-327',
    tin: 'TIN-3427',
    name: 'Akaki Power Plant',
    sector: 'Energy',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 78,
    riskLevel: 'HIGH',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 1202000000,
    employees: 164,
    registeredDate: '2018-04-21',
    lastAudit: '2023-06-19',
    complianceHistory: 'Minor discrepancies noted',
    address: 'CMC, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-328',
    tin: 'TIN-3428',
    name: 'Sky Bus PLC',
    sector: 'Transportation',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 98,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 4417000000,
    employees: 557,
    registeredDate: '2012-12-09',
    lastAudit: '2022-12-20',
    complianceHistory: 'Intercompany pricing review needed',
    address: 'Bambis, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-329',
    tin: 'TIN-3429',
    name: 'Ethiopian Cargo',
    sector: 'Transportation',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 100,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 4339000000,
    employees: 560,
    registeredDate: '2014-07-16',
    lastAudit: '2023-09-20',
    complianceHistory: 'Production volume discrepancies',
    address: 'Bambis, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-330',
    tin: 'TIN-3430',
    name: 'Abay Trading',
    sector: 'Import/Export',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 81,
    riskLevel: 'HIGH',
    suggestedAuditType: 'field_audit',
    annualRevenue: 1879000000,
    employees: 278,
    registeredDate: '2018-03-13',
    lastAudit: '2023-02-23',
    complianceHistory: 'Late filings',
    address: 'Sidist Kilo, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-331',
    tin: 'TIN-3431',
    name: 'Yekatit Hospital Supply Co.',
    sector: 'Healthcare',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 52,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 500000000,
    employees: 126,
    registeredDate: '2017-01-26',
    lastAudit: '2022-10-15',
    complianceHistory: 'Complex revenue streams',
    address: 'Akaki, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-332',
    tin: 'TIN-3432',
    name: 'Saba Engineering',
    sector: 'Construction',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 39,
    riskLevel: 'LOW',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 137000000,
    employees: 44,
    registeredDate: '2011-09-12',
    lastAudit: '2022-02-20',
    complianceHistory: 'Multiple revenue sources',
    address: 'Kazanchis, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-333',
    tin: 'TIN-3433',
    name: 'Kaleb Engineering',
    sector: 'Construction',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 84,
    riskLevel: 'HIGH',
    suggestedAuditType: 'field_audit',
    annualRevenue: 1633000000,
    employees: 201,
    registeredDate: '2018-06-23',
    lastAudit: '2023-10-02',
    complianceHistory: 'Late filings',
    address: 'Arat Kilo, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-334',
    tin: 'TIN-3434',
    name: 'Zemen Tech Group',
    sector: 'Telecommunications',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 88,
    riskLevel: 'HIGH',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 1330000000,
    employees: 169,
    registeredDate: '2011-09-02',
    lastAudit: '2021-10-19',
    complianceHistory: 'Good compliance record',
    address: 'Akaki, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-335',
    tin: 'TIN-3435',
    name: 'Gurd Shola Real Estate PLC',
    sector: 'Real Estate',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 53,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 225000000,
    employees: 77,
    registeredDate: '2019-05-22',
    lastAudit: '2022-11-02',
    complianceHistory: 'Excise tax review needed',
    address: 'Sidist Kilo, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-336',
    tin: 'TIN-3436',
    name: 'Opal Construction Group',
    sector: 'Construction',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 98,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 6079000000,
    employees: 944,
    registeredDate: '2016-02-01',
    lastAudit: '2023-10-20',
    complianceHistory: 'VAT discrepancies',
    address: 'CMC, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-337',
    tin: 'TIN-3437',
    name: 'Marriott Executive',
    sector: 'Hospitality',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 90,
    riskLevel: 'CRITICAL',
    suggestedAuditType: 'comprehensive',
    annualRevenue: 7234000000,
    employees: 1100,
    registeredDate: '2016-05-21',
    lastAudit: '2023-10-21',
    complianceHistory: 'Production volume discrepancies',
    address: 'Sarbet, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-338',
    tin: 'TIN-3438',
    name: 'Etete Supermarket',
    sector: 'Retail',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 77,
    riskLevel: 'HIGH',
    suggestedAuditType: 'field_audit',
    annualRevenue: 1767000000,
    employees: 198,
    registeredDate: '2014-03-18',
    lastAudit: '2021-03-27',
    complianceHistory: 'Export tax verification needed',
    address: 'Summit, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-339',
    tin: 'TIN-3439',
    name: 'Eliana Hotel',
    sector: 'Hospitality',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 58,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 656000000,
    employees: 103,
    registeredDate: '2012-11-27',
    lastAudit: '2022-08-14',
    complianceHistory: 'Multiple late filings',
    address: 'Lebu, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-340',
    tin: 'TIN-3440',
    name: 'Moha Soft Drinks',
    sector: 'Manufacturing',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 55,
    riskLevel: 'MEDIUM',
    suggestedAuditType: 'desk_audit',
    annualRevenue: 440000000,
    employees: 71,
    registeredDate: '2017-07-31',
    lastAudit: '2023-02-05',
    complianceHistory: 'Multiple late filings',
    address: 'Akaki, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-341',
    tin: 'TIN-3441',
    name: 'Digital Ethiopia',
    sector: 'Telecommunications',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 79,
    riskLevel: 'HIGH',
    suggestedAuditType: 'issue_audit',
    annualRevenue: 1132000000,
    employees: 179,
    registeredDate: '2011-12-11',
    lastAudit: '2021-12-04',
    complianceHistory: 'Transfer pricing concerns',
    address: 'Gerji, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-342',
    tin: 'TIN-3442',
    name: 'Bazezew Trading',
    sector: 'Import/Export',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 89,
    riskLevel: 'HIGH',
    suggestedAuditType: 'transfer_pricing',
    annualRevenue: 1511000000,
    employees: 248,
    registeredDate: '2015-11-23',
    lastAudit: '2021-09-24',
    complianceHistory: 'Service tax concerns',
    address: 'Sidist Kilo, Addis Ababa'
  },

  {
    id: 'tp-aa-tc3-343',
    tin: 'TIN-3443',
    name: 'Golden Bus',
    sector: 'Transportation',
    taxCenter: 'addis_ababa-tc3',
    region: 'addis_ababa',
    riskScore: 89,
    riskLevel: 'HIGH',
    suggestedAuditType: 'field_audit',
    annualRevenue: 1781000000,
    employees: 247,
    registeredDate: '2020-01-18',
    lastAudit: '2022-12-12',
    complianceHistory: 'Intercompany pricing review needed',
    address: 'Merkato, Addis Ababa'
  }
];

// ============================================================
// OTHER REGIONS - Summary Counts Only (for testing)
// ============================================================

export const REGIONAL_TAXPAYER_COUNTS = {
  oromia: {
    'oromia-tc1': {
      total: 450,
      byRisk: { CRITICAL: 45, HIGH: 135, MEDIUM: 180, LOW: 90 },
      byAuditType: { 
        desk_audit: 180, 
        field_audit: 135, 
        joint_audit: 54, 
        transfer_pricing: 36, 
        comprehensive: 27, 
        issue_audit: 18 
      }
    },
    'oromia-tc2': {
      total: 420,
      byRisk: { CRITICAL: 42, HIGH: 126, MEDIUM: 168, LOW: 84 },
      byAuditType: { 
        desk_audit: 168, 
        field_audit: 126, 
        joint_audit: 50, 
        transfer_pricing: 34, 
        comprehensive: 25, 
        issue_audit: 17 
      }
    },
    'oromia-tc3': {
      total: 380,
      byRisk: { CRITICAL: 38, HIGH: 114, MEDIUM: 152, LOW: 76 },
      byAuditType: { 
        desk_audit: 152, 
        field_audit: 114, 
        joint_audit: 46, 
        transfer_pricing: 30, 
        comprehensive: 23, 
        issue_audit: 15 
      }
    }
  },
  
  amhara: {
    'amhara-tc1': {
      total: 350,
      byRisk: { CRITICAL: 35, HIGH: 105, MEDIUM: 140, LOW: 70 },
      byAuditType: { 
        desk_audit: 140, 
        field_audit: 105, 
        joint_audit: 42, 
        transfer_pricing: 28, 
        comprehensive: 21, 
        issue_audit: 14 
      }
    },
    'amhara-tc2': {
      total: 320,
      byRisk: { CRITICAL: 32, HIGH: 96, MEDIUM: 128, LOW: 64 },
      byAuditType: { 
        desk_audit: 128, 
        field_audit: 96, 
        joint_audit: 38, 
        transfer_pricing: 26, 
        comprehensive: 19, 
        issue_audit: 13 
      }
    },
    'amhara-tc3': {
      total: 290,
      byRisk: { CRITICAL: 29, HIGH: 87, MEDIUM: 116, LOW: 58 },
      byAuditType: { 
        desk_audit: 116, 
        field_audit: 87, 
        joint_audit: 35, 
        transfer_pricing: 23, 
        comprehensive: 17, 
        issue_audit: 12 
      }
    }
  },

  snnpr: {
    'snnpr-tc1': {
      total: 280,
      byRisk: { CRITICAL: 28, HIGH: 84, MEDIUM: 112, LOW: 56 },
      byAuditType: { 
        desk_audit: 112, 
        field_audit: 84, 
        joint_audit: 34, 
        transfer_pricing: 22, 
        comprehensive: 17, 
        issue_audit: 11 
      }
    },
    'snnpr-tc2': {
      total: 260,
      byRisk: { CRITICAL: 26, HIGH: 78, MEDIUM: 104, LOW: 52 },
      byAuditType: { 
        desk_audit: 104, 
        field_audit: 78, 
        joint_audit: 31, 
        transfer_pricing: 21, 
        comprehensive: 16, 
        issue_audit: 10 
      }
    },
    'snnpr-tc3': {
      total: 240,
      byRisk: { CRITICAL: 24, HIGH: 72, MEDIUM: 96, LOW: 48 },
      byAuditType: { 
        desk_audit: 96, 
        field_audit: 72, 
        joint_audit: 29, 
        transfer_pricing: 19, 
        comprehensive: 14, 
        issue_audit: 10 
      }
    }
  },

  somali: {
    'somali-tc1': {
      total: 220,
      byRisk: { CRITICAL: 22, HIGH: 66, MEDIUM: 88, LOW: 44 },
      byAuditType: { 
        desk_audit: 88, 
        field_audit: 66, 
        joint_audit: 26, 
        transfer_pricing: 18, 
        comprehensive: 13, 
        issue_audit: 9 
      }
    },
    'somali-tc2': {
      total: 200,
      byRisk: { CRITICAL: 20, HIGH: 60, MEDIUM: 80, LOW: 40 },
      byAuditType: { 
        desk_audit: 80, 
        field_audit: 60, 
        joint_audit: 24, 
        transfer_pricing: 16, 
        comprehensive: 12, 
        issue_audit: 8 
      }
    },
    'somali-tc3': {
      total: 180,
      byRisk: { CRITICAL: 18, HIGH: 54, MEDIUM: 72, LOW: 36 },
      byAuditType: { 
        desk_audit: 72, 
        field_audit: 54, 
        joint_audit: 22, 
        transfer_pricing: 14, 
        comprehensive: 11, 
        issue_audit: 7 
      }
    }
  }
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get taxpayers for a specific tax center
 */
export function getTaxpayersForTaxCenter(taxCenterId) {
  // For Addis Ababa, return real taxpayers
  if (taxCenterId.startsWith('addis_ababa')) {
    return ADDIS_ABABA_TAXPAYERS.filter(tp => tp.taxCenter === taxCenterId);
  }
  
  // For other regions, return empty (just counts available)
  return [];
}

/**
 * Get taxpayer counts for a tax center
 */
export function getTaxpayerCountsForTaxCenter(taxCenterId) {
  // Check if it's Addis Ababa
  if (taxCenterId.startsWith('addis_ababa')) {
    const taxpayers = getTaxpayersForTaxCenter(taxCenterId);
    return {
      total: taxpayers.length,
      byRisk: countByField(taxpayers, 'riskLevel'),
      byAuditType: countByField(taxpayers, 'suggestedAuditType')
    };
  }
  
  // For other regions, use summary counts
  const [region] = taxCenterId.split('-');
  return REGIONAL_TAXPAYER_COUNTS[region]?.[taxCenterId] || { total: 0, byRisk: {}, byAuditType: {} };
}


/**
 * Helper to count items by a specific field
 */
function countByField(items, field) {
  return items.reduce((acc, item) => {
    const value = item[field];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Get taxpayers by risk level
 */
export function getTaxpayersByRiskLevel(taxCenterId, riskLevel) {
  const taxpayers = getTaxpayersForTaxCenter(taxCenterId);
  return taxpayers.filter(tp => tp.riskLevel === riskLevel);
}

/**
 * Get taxpayers by suggested audit type
 */
export function getTaxpayersByAuditType(taxCenterId, auditType) {
  const taxpayers = getTaxpayersForTaxCenter(taxCenterId);
  return taxpayers.filter(tp => tp.suggestedAuditType === auditType);
}

/**
 * Select top N taxpayers by risk score for case generation
 */
export function selectTopRiskTaxpayers(taxCenterId, count) {
  const taxpayers = getTaxpayersForTaxCenter(taxCenterId);
  return taxpayers
    .sort((a, b) => b.riskScore - a.riskScore) // Sort by risk score descending
    .slice(0, count); // Take top N
}

/**
 * Generate cases from plan allocation
 * This is the smart case generation function
 */
export function generateCasesFromPlan(planId, taxCenterId, allocation, planAllocation) {
  const taxpayers = getTaxpayersForTaxCenter(taxCenterId);
  const cases = [];
  
  // Sort taxpayers by risk score (highest first)
  const sortedTaxpayers = [...taxpayers].sort((a, b) => b.riskScore - a.riskScore);
  
  let taxpayerIndex = 0;
  
  // For each audit type in the allocation
  Object.entries(allocation).forEach(([auditType, count]) => {
    for (let i = 0; i < count; i++) {
      if (taxpayerIndex >= sortedTaxpayers.length) {
        // Not enough taxpayers, break
        break;
      }
      
      const taxpayer = sortedTaxpayers[taxpayerIndex];
      taxpayerIndex++;
      
      // Create case with deep audit profile fields
      cases.push({
        id: `CASE-${planId}-${taxpayer.tin}`,
        caseNumber: `JAC-${planId.slice(0, 8)}-${taxpayer.tin}`,
        planId,
        tin: taxpayer.tin,
        taxIdNumber: taxpayer.tin,
        taxpayerName: taxpayer.name,
        sector: taxpayer.sector,
        industry: taxpayer.sector,
        businessType: taxpayer.businessType || 'Commercial Enterprise',
        segment: taxpayer.segment || 'LARGE',
        totalAmount: taxpayer.totalAmount || (taxpayer.annualRevenue ? taxpayer.annualRevenue * 0.05 : 50000000),
        assessmentScore: taxpayer.assessmentScore || '90',
        annualRevenue: taxpayer.annualRevenue,
        employees: taxpayer.employees,
        address: taxpayer.address,
        city: taxpayer.city,
        region: taxpayer.region,
        taxCenter: taxpayer.taxCenter,
        riskScore: taxpayer.riskScore,
        riskLevel: taxpayer.riskLevel,
        riskPriority: taxpayer.riskLevel,
        auditType: auditType,
        suggestedAuditType: taxpayer.suggestedAuditType,
        complianceHistory: taxpayer.complianceHistory,
        complianceIssues: taxpayer.complianceIssues || [
          'Discrepancy between Customs import declarations and domestic VAT filings.',
          'Cross-border payments subject to non-resident withholding tax verification.'
        ],
        riskIndicators: taxpayer.riskIndicators || [
          { id: 'customs_sigtas_gap', name: 'Customs vs Domestic Turnover Gap', weight: 3.5, severity: 'HIGH', source: 'ASYCUDA / SIGTAS', description: 'Imported volume exceeds declared sales turnover.' }
        ],
        representatives: taxpayer.representatives || [
          { name: 'Authorized General Manager', title: 'Managing Director', phone: '+251-911-000000', email: 'management@taxpayer.gov.et' }
        ],
        status: 'PENDING',
        priority: taxpayer.riskLevel === 'CRITICAL' ? 'HIGH' : 'NORMAL',
        assignedTeamLeader: null,
        assignedAuditor: null,
        assignedAt: null,
        startDate: null,
        completedDate: null,
        notes: '',
        createdAt: new Date().toISOString(),
        taxpayerData: taxpayer
      });
    }
  });
  
  return cases;
}

/**
 * Get all Addis Ababa taxpayers (for testing)
 */
export function getAllAddisAbabaTaxpayers() {
  return ADDIS_ABABA_TAXPAYERS;
}

/**
 * Get taxpayer by TIN
 */
export function getTaxpayerByTIN(tin) {
  return ADDIS_ABABA_TAXPAYERS.find(tp => tp.tin === tin);
}

/**
 * Search taxpayers
 */
export function searchTaxpayers(query, taxCenterId = null) {
  let taxpayers = taxCenterId 
    ? getTaxpayersForTaxCenter(taxCenterId)
    : ADDIS_ABABA_TAXPAYERS;
  
  const lowerQuery = query.toLowerCase();
  return taxpayers.filter(tp => 
    tp.name.toLowerCase().includes(lowerQuery) ||
    tp.tin.toLowerCase().includes(lowerQuery) ||
    tp.sector.toLowerCase().includes(lowerQuery)
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DEEP JOINT AUDIT TAXPAYER PROFILES (FOR ALL 18 TAX CENTERS)
// ═══════════════════════════════════════════════════════════════════════════
export const JOINT_AUDIT_TAXPAYERS = [
  {
    "id": "tp-joint-aa1-01",
    "tin": "0081234001",
    "name": "Abyssinia Steel Rolling Mills & Heavy Machinery Importers PLC",
    "sector": "Heavy Manufacturing",
    "businessType": "Industrial Rolling Mill & Machinery Import",
    "segment": "LARGE",
    "taxCenter": "addis_ababa-tc1",
    "region": "addis_ababa",
    "city": "Addis Ababa",
    "address": "Bole Sub-City, Woreda 04, House 210",
    "riskScore": 94,
    "riskLevel": "CRITICAL",
    "suggestedAuditType": "joint_audit",
    "annualRevenue": 3850000000,
    "totalAmount": 112000000,
    "assessmentScore": "95",
    "employees": 780,
    "registeredDate": "2013-05-12",
    "lastAudit": "2021-10-18",
    "complianceHistory": "Multiple customs CIF discrepancies, non-resident technical fees without withholding tax",
    "customsImportCIF": 2650000000,
    "domesticVatTurnover": 1780000000,
    "customsDomesticGap": 870000000,
    "unreconciledVatCredit": 24500000,
    "nonResidentWithholdingExposure": 31200000,
    "nbeForexDiscrepancy": 48000000,
    "complianceIssues": [
      "ASYCUDA Customs import declarations exceed declared SIGTAS Domestic Sales by ETB 87.0M with zero corresponding inventory build-up.",
      "Input VAT deduction of ETB 24.5M claimed on imported machinery spare parts lacking certified Customs Single Administrative Document (SAD) release stamps.",
      "Failure to withhold statutory 30% Non-Resident Withholding Tax on foreign plant engineering and automation fees of ETB 104.0M paid to UAE technical partner.",
      "Declared customs CIF valuations on imported steel billets are 32% below World Customs Organization (WCO) transaction value benchmark indices.",
      "National Bank of Ethiopia foreign currency approval of USD 9.6M exceeds physical port arrival entries at Mojo Dry Port by USD 2.1M."
    ],
    "riskIndicators": [
      {
        "id": "customs_sigtas_gap",
        "name": "Customs vs Domestic Turnover Gap",
        "weight": 3.5,
        "severity": "HIGH",
        "source": "ASYCUDA / SIGTAS Integration",
        "description": "Imported CIF volume significantly exceeds reported domestic turnover and audited warehouse balances."
      },
      {
        "id": "unverified_vat_credit",
        "name": "Unsubstantiated Import VAT Claims",
        "weight": 3.0,
        "severity": "HIGH",
        "source": "Domestic Tax System (SIGTAS)",
        "description": "Substantial input VAT credits claimed without corresponding customs import declaration vouchers."
      },
      {
        "id": "non_resident_wht_omission",
        "name": "Non-Resident Technical Fees Omission",
        "weight": 2.8,
        "severity": "HIGH",
        "source": "Commercial Bank Transfer Records",
        "description": "Significant cross-border remittances executed without statutory 30% withholding tax retention."
      },
      {
        "id": "forex_import_variance",
        "name": "NBE Forex Allocation Anomaly",
        "weight": 3.2,
        "severity": "HIGH",
        "source": "National Bank of Ethiopia (NBE)",
        "description": "Hard currency acquired from commercial banks exceeds declared customs entry valuations by over 25%."
      }
    ],
    "representatives": [
      {
        "name": "Ato Solomon Mengistu",
        "title": "Managing Director & CEO",
        "phone": "+251-911-234567",
        "email": "s.mengistu@abyssiniasteel.com.et"
      },
      {
        "name": "W/ro Bethlehem Tadesse",
        "title": "Chief Financial Officer",
        "phone": "+251-911-345678",
        "email": "b.tadesse@abyssiniasteel.com.et"
      },
      {
        "name": "Ato Daniel Kassa (CPA)",
        "title": "Authorized Tax Agent & Legal Counsel",
        "phone": "+251-911-456789",
        "email": "daniel@kassatax.com.et"
      }
    ]
  },
  {
    "id": "tp-joint-aa2-01",
    "tin": "0081234002",
    "name": "Ethio-Nile Multimodal Logistics & Freight Forwarding S.C.",
    "sector": "Transportation & Logistics",
    "businessType": "Cross-Border Logistics & Bonded Warehousing",
    "segment": "LARGE",
    "taxCenter": "addis_ababa-tc2",
    "region": "addis_ababa",
    "city": "Addis Ababa",
    "address": "Kirkos Sub-City, Woreda 02, House 105",
    "riskScore": 91,
    "riskLevel": "CRITICAL",
    "suggestedAuditType": "joint_audit",
    "annualRevenue": 2950000000,
    "totalAmount": 78000000,
    "assessmentScore": "92",
    "employees": 540,
    "registeredDate": "2015-02-18",
    "lastAudit": "2022-01-14",
    "complianceHistory": "Unreported transit container revenues, withholding omissions on foreign shipping line commissions",
    "customsImportCIF": 1820000000,
    "domesticVatTurnover": 1240000000,
    "customsDomesticGap": 580000000,
    "unreconciledVatCredit": 16200000,
    "nonResidentWithholdingExposure": 22800000,
    "nbeForexDiscrepancy": 32000000,
    "complianceIssues": [
      "Discrepancy of ETB 58.0M between declared customs freight charges and audited international transit accounts.",
      "Failure to collect and remit 30% withholding tax on foreign maritime feeder line disbursements of ETB 76.0M.",
      "Reverse VAT omissions on imported container demurrage and technical handling services.",
      "Significant mismatch between NBE dry-port clearing allocations and physical shipping manifest records."
    ],
    "riskIndicators": [
      {
        "id": "freight_variance",
        "name": "International Freight Clearing Gap",
        "weight": 3.4,
        "severity": "HIGH",
        "source": "Customs Transit & Manifest Data",
        "description": "Transit clearance fees exceed declared domestic transport revenue."
      },
      {
        "id": "shipping_wht_omission",
        "name": "Maritime Feeder Withholding Omission",
        "weight": 3.0,
        "severity": "HIGH",
        "source": "National Bank / Commercial Banking",
        "description": "Offshore remittances without required 30% tax retention."
      }
    ],
    "representatives": [
      {
        "name": "Captain Yonas Berhanu",
        "title": "Chief Executive Officer",
        "phone": "+251-911-567890",
        "email": "y.berhanu@ethionile.com.et"
      },
      {
        "name": "Ato Dawit Girma",
        "title": "Director of Finance",
        "phone": "+251-911-678901",
        "email": "d.girma@ethionile.com.et"
      }
    ]
  },
  {
    "id": "tp-joint-aa3-01",
    "tin": "0081234003",
    "name": "East Africa Pharmaceutical Manufacturing & Chemical Imports Corp",
    "sector": "Healthcare & Pharmaceuticals",
    "businessType": "Drug Formulation & Active Pharmaceutical Ingredient (API) Import",
    "segment": "LARGE",
    "taxCenter": "addis_ababa-tc3",
    "region": "addis_ababa",
    "city": "Addis Ababa",
    "address": "Akaki-Kality Sub-City, Woreda 08, House 77",
    "riskScore": 89,
    "riskLevel": "HIGH",
    "suggestedAuditType": "joint_audit",
    "annualRevenue": 2400000000,
    "totalAmount": 64000000,
    "assessmentScore": "90",
    "employees": 420,
    "registeredDate": "2016-09-01",
    "lastAudit": "2022-04-10",
    "complianceHistory": "Customs duty-free incentive abuse, unreported local commercial sales of duty-exempt APIs",
    "customsImportCIF": 1450000000,
    "domesticVatTurnover": 980000000,
    "customsDomesticGap": 470000000,
    "unreconciledVatCredit": 14000000,
    "nonResidentWithholdingExposure": 18500000,
    "nbeForexDiscrepancy": 26000000,
    "complianceIssues": [
      "Abuse of Second Schedule customs duty-free exemptions: imported raw chemicals diverted to taxable commercial re-sale.",
      "Input VAT credits claimed on duty-exempt inputs in violation of Article 21 of the VAT Proclamation.",
      "Unreported foreign license royalty payments to European patent holding subsidiary."
    ],
    "riskIndicators": [
      {
        "id": "duty_free_leakage",
        "name": "Customs Duty-Free Diversion",
        "weight": 3.6,
        "severity": "HIGH",
        "source": "Customs Tariff & Duty Exemption Monitoring",
        "description": "Duty-free imported chemicals found in taxable domestic commercial distribution."
      }
    ],
    "representatives": [
      {
        "name": "Dr. Aster Bekele",
        "title": "Managing Director",
        "phone": "+251-911-789012",
        "email": "a.bekele@eastafricapharma.com.et"
      },
      {
        "name": "Ato Henok Alemayehu",
        "title": "Head of Finance & Tax",
        "phone": "+251-911-890123",
        "email": "h.alemayehu@eastafricapharma.com.et"
      }
    ]
  },
  {
    "id": "tp-joint-or1-01",
    "tin": "0081234004",
    "name": "Awash Agro-Industrial Processing & Fertilizer Importers PLC",
    "sector": "Agro-Industry",
    "businessType": "Agricultural Commodity Export & Agro-Chemical Import",
    "segment": "LARGE",
    "taxCenter": "oromia-tc1",
    "region": "oromia",
    "city": "Adama",
    "address": "Adama Industrial Zone, Kebele 02",
    "riskScore": 93,
    "riskLevel": "CRITICAL",
    "suggestedAuditType": "joint_audit",
    "annualRevenue": 3200000000,
    "totalAmount": 92000000,
    "assessmentScore": "94",
    "employees": 890,
    "registeredDate": "2014-11-20",
    "lastAudit": "2021-08-05",
    "complianceHistory": "Export proceeds under-repatriation, customs import valuation manipulation",
    "customsImportCIF": 2100000000,
    "domesticVatTurnover": 1350000000,
    "customsDomesticGap": 750000000,
    "unreconciledVatCredit": 21000000,
    "nonResidentWithholdingExposure": 26000000,
    "nbeForexDiscrepancy": 41000000,
    "complianceIssues": [
      "Customs export declarations show under-invoicing of sesame and pulses exports by 24% compared to ECX auction benchmark prices.",
      "Substantial delay in mandatory export proceeds repatriation exceeding NBE 90-day statutory directive.",
      "Input VAT credits claimed on exempt agricultural machinery components."
    ],
    "riskIndicators": [
      {
        "id": "export_underinvoicing",
        "name": "Export Value Under-Invoicing",
        "weight": 3.7,
        "severity": "CRITICAL",
        "source": "ECX / Customs Export Reconciliation",
        "description": "Declared export contracts systematically lower than transparent market commodity benchmarks."
      }
    ],
    "representatives": [
      {
        "name": "Ato Gemechu Tufa",
        "title": "General Manager",
        "phone": "+251-911-901234",
        "email": "g.tufa@awashagro.com.et"
      },
      {
        "name": "W/ro Chaltu Lema",
        "title": "Finance Controller",
        "phone": "+251-911-012345",
        "email": "c.lema@awashagro.com.et"
      }
    ]
  },
  {
    "id": "tp-joint-or2-01",
    "tin": "0081234005",
    "name": "Mojo Leather & Footwear Manufacturing Cross-Border Consortium",
    "sector": "Manufacturing",
    "businessType": "Tannery & Export Leather Goods Production",
    "segment": "LARGE",
    "taxCenter": "oromia-tc2",
    "region": "oromia",
    "city": "Mojo",
    "address": "Mojo Industrial Corridor, Plot 45",
    "riskScore": 88,
    "riskLevel": "HIGH",
    "suggestedAuditType": "joint_audit",
    "annualRevenue": 1950000000,
    "totalAmount": 52000000,
    "assessmentScore": "89",
    "employees": 610,
    "registeredDate": "2017-03-15",
    "lastAudit": "2022-05-19",
    "complianceHistory": "Imported tanning chemicals diverted to informal market, export rebate anomalies",
    "customsImportCIF": 1200000000,
    "domesticVatTurnover": 850000000,
    "customsDomesticGap": 350000000,
    "unreconciledVatCredit": 11000000,
    "nonResidentWithholdingExposure": 14000000,
    "nbeForexDiscrepancy": 21000000,
    "complianceIssues": [
      "Duty-free imported tanning agents diverted to unorganized local micro-processors.",
      "Export voucher scheme non-reconciliation: finished leather export output does not match imported raw chemical input formulas."
    ],
    "riskIndicators": [
      {
        "id": "voucher_reconciliation",
        "name": "Export Voucher Scheme Discrepancy",
        "weight": 3.3,
        "severity": "HIGH",
        "source": "Customs Voucher Monitoring System",
        "description": "Chemical consumption ratios deviate from standard industrial leather formulation yields."
      }
    ],
    "representatives": [
      {
        "name": "Ato Diriba Keneni",
        "title": "Managing Director",
        "phone": "+251-911-123450",
        "email": "d.keneni@mojoleather.com.et"
      }
    ]
  },
  {
    "id": "tp-joint-or3-01",
    "tin": "0081234006",
    "name": "Rift Valley Commercial Farming & Chemical Supply PLC",
    "sector": "Agriculture & Trading",
    "businessType": "Large Scale Commercial Horticulture & Agro-Supplies",
    "segment": "LARGE",
    "taxCenter": "oromia-tc3",
    "region": "oromia",
    "city": "Bishoftu",
    "address": "Bishoftu Commercial Axis, Kebele 01",
    "riskScore": 86,
    "riskLevel": "HIGH",
    "suggestedAuditType": "joint_audit",
    "annualRevenue": 1750000000,
    "totalAmount": 46000000,
    "assessmentScore": "88",
    "employees": 450,
    "registeredDate": "2018-07-22",
    "lastAudit": "2022-07-11",
    "complianceHistory": "Forex diversion, transfer pricing on imported greenhouse materials",
    "customsImportCIF": 1100000000,
    "domesticVatTurnover": 790000000,
    "customsDomesticGap": 310000000,
    "unreconciledVatCredit": 9500000,
    "nonResidentWithholdingExposure": 12500000,
    "nbeForexDiscrepancy": 19000000,
    "complianceIssues": [
      "Disproportionate transfer prices on greenhouse equipment imported from Dutch affiliate.",
      "Omission of withholding tax on offshore consulting and agronomist fees."
    ],
    "riskIndicators": [
      {
        "id": "tp_greenhouse",
        "name": "Related Party Equipment Valuation",
        "weight": 3.1,
        "severity": "HIGH",
        "source": "Customs Valuation & TP Benchmarks",
        "description": "Import invoice values 35% higher than independent arm length imports."
      }
    ],
    "representatives": [
      {
        "name": "Ato Fikadu Negash",
        "title": "Operations Director",
        "phone": "+251-911-234501",
        "email": "f.negash@riftfarming.com.et"
      }
    ]
  },
  {
    "id": "tp-joint-am1-01",
    "tin": "0081234007",
    "name": "Blue Nile Cement & Heavy Industrial Mining Corp",
    "sector": "Mining & Industrial",
    "businessType": "Limestone Mining & Clinker Cement Production",
    "segment": "LARGE",
    "taxCenter": "amhara-tc1",
    "region": "amhara",
    "city": "Bahir Dar",
    "address": "Industrial Highway, Kebele 11",
    "riskScore": 92,
    "riskLevel": "CRITICAL",
    "suggestedAuditType": "joint_audit",
    "annualRevenue": 3100000000,
    "totalAmount": 88000000,
    "assessmentScore": "93",
    "employees": 720,
    "registeredDate": "2015-04-10",
    "lastAudit": "2021-11-25",
    "complianceHistory": "Imported plant spares input VAT overstatement, royalty fee omissions",
    "customsImportCIF": 1950000000,
    "domesticVatTurnover": 1380000000,
    "customsDomesticGap": 570000000,
    "unreconciledVatCredit": 19500000,
    "nonResidentWithholdingExposure": 25000000,
    "nbeForexDiscrepancy": 36000000,
    "complianceIssues": [
      "Customs input VAT deductions claimed on heavy conveyor equipment without SAD customs vouchers.",
      "Offshore technical management royalties paid without 30% withholding retention."
    ],
    "riskIndicators": [
      {
        "id": "mining_spares_vat",
        "name": "Unsubstantiated Heavy Equipment VAT",
        "weight": 3.5,
        "severity": "HIGH",
        "source": "SIGTAS / Customs Cross-Match",
        "description": "Discrepancy between port clearance entries and SIGTAS return schedules."
      }
    ],
    "representatives": [
      {
        "name": "Ato Tadesse Kebede",
        "title": "Managing Director",
        "phone": "+251-911-345012",
        "email": "t.kebede@bluenilecement.com.et"
      }
    ]
  },
  {
    "id": "tp-joint-am2-01",
    "tin": "0081234008",
    "name": "Gondar Agro-Export & Sesame Cleansing Enterprise",
    "sector": "Agro-Export",
    "businessType": "Agricultural Cleaning & Global Export",
    "segment": "LARGE",
    "taxCenter": "amhara-tc2",
    "region": "amhara",
    "city": "Gondar",
    "address": "Airport Road Industrial Sector",
    "riskScore": 87,
    "riskLevel": "HIGH",
    "suggestedAuditType": "joint_audit",
    "annualRevenue": 1850000000,
    "totalAmount": 49000000,
    "assessmentScore": "89",
    "employees": 390,
    "registeredDate": "2016-12-05",
    "lastAudit": "2022-03-30",
    "complianceHistory": "Export proceeds mismatch, customs export documentation discrepancies",
    "customsImportCIF": 920000000,
    "domesticVatTurnover": 680000000,
    "customsDomesticGap": 240000000,
    "unreconciledVatCredit": 8500000,
    "nonResidentWithholdingExposure": 13000000,
    "nbeForexDiscrepancy": 22000000,
    "complianceIssues": [
      "Under-reporting of export contract FOB amounts compared to destination customs manifests.",
      "Failure to reconcile foreign exchange surrender requirements with NBE."
    ],
    "riskIndicators": [
      {
        "id": "export_manifest_gap",
        "name": "Port Manifest vs Return Variance",
        "weight": 3.2,
        "severity": "HIGH",
        "source": "Customs Export Division",
        "description": "Tonnage cleared through Metema border exceeds declared sales invoices."
      }
    ],
    "representatives": [
      {
        "name": "Ato Getnet Alemu",
        "title": "Chief Executive",
        "phone": "+251-911-450123",
        "email": "g.alemu@gondarexport.com.et"
      }
    ]
  },
  {
    "id": "tp-joint-am3-01",
    "tin": "0081234009",
    "name": "Wollo Textile & Garment Manufacturing S.C.",
    "sector": "Textiles & Apparel",
    "businessType": "Yarn Spinning & Apparel Export",
    "segment": "LARGE",
    "taxCenter": "amhara-tc3",
    "region": "amhara",
    "city": "Dessie",
    "address": "Kombolcha Industrial Park, Shed 03",
    "riskScore": 85,
    "riskLevel": "HIGH",
    "suggestedAuditType": "joint_audit",
    "annualRevenue": 1650000000,
    "totalAmount": 42000000,
    "assessmentScore": "87",
    "employees": 680,
    "registeredDate": "2017-08-19",
    "lastAudit": "2022-06-14",
    "complianceHistory": "Duty-free fabric imports sold locally, withholding omissions",
    "customsImportCIF": 890000000,
    "domesticVatTurnover": 640000000,
    "customsDomesticGap": 250000000,
    "unreconciledVatCredit": 7800000,
    "nonResidentWithholdingExposure": 11500000,
    "nbeForexDiscrepancy": 18000000,
    "complianceIssues": [
      "Industrial park duty-free synthetic fabric imported for export diverted to domestic retail traders.",
      "Exempt raw material waste ratios inflated to conceal unaccounted local fabric sales."
    ],
    "riskIndicators": [
      {
        "id": "park_fabric_diversion",
        "name": "Industrial Park Duty-Free Diversion",
        "weight": 3.4,
        "severity": "HIGH",
        "source": "Park Customs Monitoring Office",
        "description": "Significant discrepancy between imported yarn weights and exported garment weights."
      }
    ],
    "representatives": [
      {
        "name": "W/ro Hirut Kebede",
        "title": "Managing Director",
        "phone": "+251-911-501234",
        "email": "h.kebede@wollotextile.com.et"
      }
    ]
  },
  {
    "id": "tp-joint-dd1-01",
    "tin": "0081234010",
    "name": "Dire Dawa International Dry Port Logistics & Assembly Enterprise",
    "sector": "Logistics & Assembly",
    "businessType": "Vehicle CKD Assembly & Multimodal Freight Logistics",
    "segment": "LARGE",
    "taxCenter": "dire_dawa-tc1",
    "region": "dire_dawa",
    "city": "Dire Dawa",
    "address": "Free Trade Zone, Area A",
    "riskScore": 95,
    "riskLevel": "CRITICAL",
    "suggestedAuditType": "joint_audit",
    "annualRevenue": 3600000000,
    "totalAmount": 105000000,
    "assessmentScore": "96",
    "employees": 820,
    "registeredDate": "2013-08-14",
    "lastAudit": "2021-09-12",
    "complianceHistory": "Free Trade Zone tax exemption violations, transfer pricing on vehicle component kits",
    "customsImportCIF": 2500000000,
    "domesticVatTurnover": 1650000000,
    "customsDomesticGap": 850000000,
    "unreconciledVatCredit": 23000000,
    "nonResidentWithholdingExposure": 29000000,
    "nbeForexDiscrepancy": 46000000,
    "complianceIssues": [
      "Goods cleared through Free Trade Zone tariff shelter sold into domestic customs territory without duty payment.",
      "CKD vehicle component kits misclassified under lower customs tariff subheadings.",
      "Unwithheld 30% tax on overseas technical assembly supervisory contracts."
    ],
    "riskIndicators": [
      {
        "id": "ftz_leakage",
        "name": "Free Trade Zone Domestic Infiltration",
        "weight": 3.8,
        "severity": "CRITICAL",
        "source": "FTZ Customs Control Division",
        "description": "Uncontrolled transfer of bonded FTZ assembly kits into domestic wholesale channels."
      }
    ],
    "representatives": [
      {
        "name": "Ato Ibrahim Hassan",
        "title": "Managing Director",
        "phone": "+251-911-612345",
        "email": "i.hassan@diredawadryport.com.et"
      }
    ]
  },
  {
    "id": "tp-joint-dd2-01",
    "tin": "0081234011",
    "name": "Horn of Africa Petroleum Products Import & Bunkering Ltd",
    "sector": "Energy & Petroleum",
    "businessType": "Petroleum Lubricants & Industrial Fuel Imports",
    "segment": "LARGE",
    "taxCenter": "dire_dawa-tc2",
    "region": "dire_dawa",
    "city": "Dire Dawa",
    "address": "Railway Compound, Depot 04",
    "riskScore": 90,
    "riskLevel": "CRITICAL",
    "suggestedAuditType": "joint_audit",
    "annualRevenue": 2800000000,
    "totalAmount": 74000000,
    "assessmentScore": "91",
    "employees": 310,
    "registeredDate": "2015-10-28",
    "lastAudit": "2022-02-18",
    "complianceHistory": "Excise tax discrepancies, customs fuel density and volume conversion variances",
    "customsImportCIF": 1900000000,
    "domesticVatTurnover": 1320000000,
    "customsDomesticGap": 580000000,
    "unreconciledVatCredit": 15500000,
    "nonResidentWithholdingExposure": 21000000,
    "nbeForexDiscrepancy": 33000000,
    "complianceIssues": [
      "Customs declared metric tons vs SIGTAS domestic cubic meter sales show significant volume shrinkage unaccounted for.",
      "Under-payment of excise tax on specialized synthetic lubricants."
    ],
    "riskIndicators": [
      {
        "id": "fuel_volume_shrinkage",
        "name": "Customs Volume vs Declared Sales Discrepancy",
        "weight": 3.5,
        "severity": "HIGH",
        "source": "Customs Petroleum Division",
        "description": "Discrepancy exceeding allowable transit evaporation thresholds."
      }
    ],
    "representatives": [
      {
        "name": "Ato Kedir Gemeda",
        "title": "General Manager",
        "phone": "+251-911-723456",
        "email": "k.gemeda@hornoil.com.et"
      }
    ]
  },
  {
    "id": "tp-joint-dd3-01",
    "tin": "0081234012",
    "name": "Ethio-Djibouti Railway Multimodal Freight Transit S.C.",
    "sector": "Transportation",
    "businessType": "Rail Freight & Container Terminal Management",
    "segment": "LARGE",
    "taxCenter": "dire_dawa-tc3",
    "region": "dire_dawa",
    "city": "Dire Dawa",
    "address": "Terminal Station Complex",
    "riskScore": 86,
    "riskLevel": "HIGH",
    "suggestedAuditType": "joint_audit",
    "annualRevenue": 1800000000,
    "totalAmount": 47000000,
    "assessmentScore": "88",
    "employees": 480,
    "registeredDate": "2016-06-11",
    "lastAudit": "2022-05-23",
    "complianceHistory": "Cross-border transit fee apportionment disputes, withholding omissions",
    "customsImportCIF": 1100000000,
    "domesticVatTurnover": 790000000,
    "customsDomesticGap": 310000000,
    "unreconciledVatCredit": 9800000,
    "nonResidentWithholdingExposure": 13500000,
    "nbeForexDiscrepancy": 20000000,
    "complianceIssues": [
      "Failure to properly apportion railway freight turnover between Ethiopian and Djibouti sovereign tax jurisdictions.",
      "Withholding omissions on locomotive maintenance contracts paid to foreign engineers."
    ],
    "riskIndicators": [
      {
        "id": "rail_jurisdiction_split",
        "name": "Cross-Border Revenue Allocation Mismatch",
        "weight": 3.1,
        "severity": "HIGH",
        "source": "Bilateral Railway Joint Audit Commission",
        "description": "Disputed apportionment of transit tariffs between neighboring tax authorities."
      }
    ],
    "representatives": [
      {
        "name": "Ato Tesfaye Hailu",
        "title": "Chief Financial Controller",
        "phone": "+251-911-834567",
        "email": "t.hailu@edrailway.com.et"
      }
    ]
  },
  {
    "id": "tp-joint-sn1-01",
    "tin": "0081234013",
    "name": "Southern Ethiopia Agro-Industrial Park Processing S.C.",
    "sector": "Agro-Processing",
    "businessType": "Avocado Oil & Fruit Processing for Global Export",
    "segment": "LARGE",
    "taxCenter": "snnpr-tc1",
    "region": "snnpr",
    "city": "Hawassa",
    "address": "Yirgalem Agro-Industrial Park, Plot 02",
    "riskScore": 91,
    "riskLevel": "CRITICAL",
    "suggestedAuditType": "joint_audit",
    "annualRevenue": 2750000000,
    "totalAmount": 72000000,
    "assessmentScore": "92",
    "employees": 650,
    "registeredDate": "2017-02-14",
    "lastAudit": "2021-12-08",
    "complianceHistory": "Duty-free processing equipment imported and under-utilized, transfer pricing on oil exports",
    "customsImportCIF": 1750000000,
    "domesticVatTurnover": 1150000000,
    "customsDomesticGap": 600000000,
    "unreconciledVatCredit": 15800000,
    "nonResidentWithholdingExposure": 20500000,
    "nbeForexDiscrepancy": 31000000,
    "complianceIssues": [
      "Transfer pricing variance on crude avocado oil shipped to Dutch holding company at 30% below global spot market.",
      "Input VAT credits claimed on packaging materials without customs export proof."
    ],
    "riskIndicators": [
      {
        "id": "agro_tp_variance",
        "name": "Related Party Commodity Transfer Pricing",
        "weight": 3.6,
        "severity": "HIGH",
        "source": "International Market Price Index",
        "description": "Export pricing deviates significantly from benchmark international sales."
      }
    ],
    "representatives": [
      {
        "name": "Ato Yonas Mengistu",
        "title": "Managing Director",
        "phone": "+251-911-945678",
        "email": "y.mengistu@southernagro.com.et"
      }
    ]
  },
  {
    "id": "tp-joint-sn2-01",
    "tin": "0081234014",
    "name": "Hawassa Textile & Industrial Apparel Exporters PLC",
    "sector": "Textiles & Garments",
    "businessType": "Garment Export & Synthetic Thread Import",
    "segment": "LARGE",
    "taxCenter": "snnpr-tc2",
    "region": "snnpr",
    "city": "Hawassa",
    "address": "Hawassa Industrial Park, Shed 14",
    "riskScore": 87,
    "riskLevel": "HIGH",
    "suggestedAuditType": "joint_audit",
    "annualRevenue": 1900000000,
    "totalAmount": 51000000,
    "assessmentScore": "89",
    "employees": 950,
    "registeredDate": "2018-05-20",
    "lastAudit": "2022-04-18",
    "complianceHistory": "Duty-free thread and button diversion, employee withholding reconciliation issues",
    "customsImportCIF": 1150000000,
    "domesticVatTurnover": 820000000,
    "customsDomesticGap": 330000000,
    "unreconciledVatCredit": 10500000,
    "nonResidentWithholdingExposure": 14500000,
    "nbeForexDiscrepancy": 21000000,
    "complianceIssues": [
      "Customs voucher non-clearance for imported specialized synthetic fabrics.",
      "Withholding tax non-deduction on expatriate managerial salaries paid into overseas bank accounts."
    ],
    "riskIndicators": [
      {
        "id": "expat_salary_wht",
        "name": "Expatriate Managerial Remuneration Omission",
        "weight": 3.2,
        "severity": "HIGH",
        "source": "Immigration & Labor Records",
        "description": "Expatriate executive benefits not reflected in domestic payroll tax declarations."
      }
    ],
    "representatives": [
      {
        "name": "Ato Berhanu Nega",
        "title": "Plant General Manager",
        "phone": "+251-911-056789",
        "email": "b.nega@hawassatextile.com.et"
      }
    ]
  },
  {
    "id": "tp-joint-sn3-01",
    "tin": "0081234015",
    "name": "Gibe River Agricultural Machinery & Irrigation Importers Ltd",
    "sector": "Wholesale & Machinery",
    "businessType": "Heavy Agricultural Implements & Irrigation System Imports",
    "segment": "LARGE",
    "taxCenter": "snnpr-tc3",
    "region": "snnpr",
    "city": "Wolaita Sodo",
    "address": "Commercial Avenue, Plot 10",
    "riskScore": 84,
    "riskLevel": "HIGH",
    "suggestedAuditType": "joint_audit",
    "annualRevenue": 1550000000,
    "totalAmount": 39000000,
    "assessmentScore": "86",
    "employees": 280,
    "registeredDate": "2019-01-15",
    "lastAudit": "2022-08-25",
    "complianceHistory": "Tariff classification manipulation on irrigation pump assemblies",
    "customsImportCIF": 980000000,
    "domesticVatTurnover": 710000000,
    "customsDomesticGap": 270000000,
    "unreconciledVatCredit": 8200000,
    "nonResidentWithholdingExposure": 11000000,
    "nbeForexDiscrepancy": 17000000,
    "complianceIssues": [
      "Commercial diesel water pumps imported under zero-tariff agricultural duty heading instead of standard commercial tariff.",
      "Input VAT credits claimed on vehicles registered as private rather than commercial."
    ],
    "riskIndicators": [
      {
        "id": "tariff_misclassification",
        "name": "Customs Tariff Misclassification",
        "weight": 3.3,
        "severity": "HIGH",
        "source": "Customs Tariff Audit Team",
        "description": "Inappropriate tariff lines selected to avoid statutory customs and excise duties."
      }
    ],
    "representatives": [
      {
        "name": "Ato Daniel Tesfaye",
        "title": "Commercial Director",
        "phone": "+251-911-167890",
        "email": "d.tesfaye@gibemachinery.com.et"
      }
    ]
  },
  {
    "id": "tp-joint-so1-01",
    "tin": "0081234016",
    "name": "Ogaden Natural Gas Exploration Logistics & Engineering S.C.",
    "sector": "Energy & Extraction",
    "businessType": "Energy Drilling Logistics & Heavy Equipment Importation",
    "segment": "LARGE",
    "taxCenter": "somali-tc1",
    "region": "somali",
    "city": "Jigjiga",
    "address": "Industrial Sector, Zone 01",
    "riskScore": 94,
    "riskLevel": "CRITICAL",
    "suggestedAuditType": "joint_audit",
    "annualRevenue": 3400000000,
    "totalAmount": 98000000,
    "assessmentScore": "95",
    "employees": 520,
    "registeredDate": "2015-09-18",
    "lastAudit": "2021-07-29",
    "complianceHistory": "Cross-border equipment lease withholding omission, customs temporary import violations",
    "customsImportCIF": 2300000000,
    "domesticVatTurnover": 1500000000,
    "customsDomesticGap": 800000000,
    "unreconciledVatCredit": 21500000,
    "nonResidentWithholdingExposure": 28000000,
    "nbeForexDiscrepancy": 44000000,
    "complianceIssues": [
      "Heavy drilling equipment brought in under temporary customs import status expired without re-export or full duty settlement.",
      "Offshore equipment lease payments executed without statutory 30% Non-Resident Withholding Tax deduction."
    ],
    "riskIndicators": [
      {
        "id": "temp_import_breach",
        "name": "Expired Temporary Customs Importation",
        "weight": 3.7,
        "severity": "CRITICAL",
        "source": "Customs Temporary Admission Registry",
        "description": "High-value machinery exceeding allowable temporary admission duration without duty assessment."
      }
    ],
    "representatives": [
      {
        "name": "Ato Ibrahim Mohammed",
        "title": "Managing Director",
        "phone": "+251-911-278901",
        "email": "i.mohammed@ogadenenergy.com.et"
      }
    ]
  },
  {
    "id": "tp-joint-so2-01",
    "tin": "0081234017",
    "name": "Jigjiga Livestock Export & Veterinary Pharmaceuticals Union",
    "sector": "Livestock & Agro-Export",
    "businessType": "Quarantine Processing, Live Animal Export & Veterinary Imports",
    "segment": "LARGE",
    "taxCenter": "somali-tc2",
    "region": "somali",
    "city": "Jigjiga",
    "address": "Quarantine Corridor, Road 05",
    "riskScore": 88,
    "riskLevel": "HIGH",
    "suggestedAuditType": "joint_audit",
    "annualRevenue": 2100000000,
    "totalAmount": 56000000,
    "assessmentScore": "90",
    "employees": 380,
    "registeredDate": "2016-11-12",
    "lastAudit": "2022-03-15",
    "complianceHistory": "Border crossing informal trade leakage, export proceeds repatriation delays",
    "customsImportCIF": 1300000000,
    "domesticVatTurnover": 920000000,
    "customsDomesticGap": 380000000,
    "unreconciledVatCredit": 11800000,
    "nonResidentWithholdingExposure": 15500000,
    "nbeForexDiscrepancy": 24000000,
    "complianceIssues": [
      "Declared live animal export headcounts mismatch regional quarantine border transit certificates.",
      "Substantial delay in repatriation of hard currency export proceeds from Gulf purchasers."
    ],
    "riskIndicators": [
      {
        "id": "quarantine_transit_mismatch",
        "name": "Border Quarantine vs Customs Declarations",
        "weight": 3.4,
        "severity": "HIGH",
        "source": "Regional Quarantine Authority & Customs",
        "description": "Discrepancy in live animal export counts cleared through Tog Wajale border post."
      }
    ],
    "representatives": [
      {
        "name": "Ato Ahmed Hassan",
        "title": "Union Chairman",
        "phone": "+251-911-389012",
        "email": "a.hassan@jigjigalivestock.com.et"
      }
    ]
  },
  {
    "id": "tp-joint-so3-01",
    "tin": "0081234018",
    "name": "Somali Region Cross-Border Commercial Trading & Haulage PLC",
    "sector": "Trading & Transport",
    "businessType": "General Merchandize Importation & Heavy Fleet Transport",
    "segment": "LARGE",
    "taxCenter": "somali-tc3",
    "region": "somali",
    "city": "Degehabur",
    "address": "Trade Transit Boulevard",
    "riskScore": 86,
    "riskLevel": "HIGH",
    "suggestedAuditType": "joint_audit",
    "annualRevenue": 1700000000,
    "totalAmount": 44000000,
    "assessmentScore": "88",
    "employees": 290,
    "registeredDate": "2018-04-20",
    "lastAudit": "2022-09-02",
    "complianceHistory": "Customs valuation disputes on consumer goods imports, parallel transit sales",
    "customsImportCIF": 1050000000,
    "domesticVatTurnover": 760000000,
    "customsDomesticGap": 290000000,
    "unreconciledVatCredit": 9100000,
    "nonResidentWithholdingExposure": 12000000,
    "nbeForexDiscrepancy": 18500000,
    "complianceIssues": [
      "Customs valuation disputes on containerized consumer commodities transiting from Berbera port.",
      "Failure to reconcile domestic sales invoices with imported bulk goods."
    ],
    "riskIndicators": [
      {
        "id": "berbera_transit_variance",
        "name": "Berbera Corridor Valuation Gap",
        "weight": 3.2,
        "severity": "HIGH",
        "source": "Cross-Border Transit Taskforce",
        "description": "Declared CIF values 25% below equivalent imports cleared through Djibouti."
      }
    ],
    "representatives": [
      {
        "name": "Ato Farah Abdi",
        "title": "Operations Director",
        "phone": "+251-911-490123",
        "email": "f.abdi@somalitrading.com.et"
      }
    ]
  }
];
