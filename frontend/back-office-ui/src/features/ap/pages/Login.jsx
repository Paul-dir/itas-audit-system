import { useState } from 'react';
import { Eye, EyeOff, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext.jsx';
import UserDirectory from '../components/UserDirectory.jsx';
import { SEED_USERS } from '../data/seed.js';

// Curated demo accounts — committee roles + all DB auditors from t_auditor
const DEMO_ACCOUNTS = [
  { label: 'Chair Addis Ababa TC1', email: 'aa1.chair@mor.gov.et', role: 'Committee Chair · Addis Ababa TC1' },
  { label: 'Member Addis Ababa TC1', email: 'aa1.member@mor.gov.et', role: 'Committee Member · Addis Ababa TC1' },
  { label: 'TL Dawit Tadesse (AA1)', email: 'aa1.tl@mor.gov.et', role: 'Joint Team Leader · Addis Ababa TC1' },
  { label: 'Auditor Sara Mohammed (AA1)', email: 'aa1.auditor1@mor.gov.et', role: 'Auditor · Customs & Tariffs Valuation · Addis Ababa TC1' },
  { label: 'Auditor Yonas Berhanu (AA1)', email: 'aa1.auditor2@mor.gov.et', role: 'Auditor · Cross-Border & Transfer Pricing · Addis Ababa TC1' },
  { label: 'Auditor Hana Girma (AA1)', email: 'aa1.auditor3@mor.gov.et', role: 'Auditor · Domestic VAT & Sales Reconciliation · Addis Ababa TC1' },
  { label: 'Auditor Mulugeta Alemayehu (AA1)', email: 'aa1.auditor4@mor.gov.et', role: 'Auditor · Corporate Income Tax & Deductions · Addis Ababa TC1' },
  { label: 'Auditor Tigist Haile (AA1)', email: 'aa1.auditor5@mor.gov.et', role: 'Auditor · Forensic & Investigation · Addis Ababa TC1' },
  { label: 'Chair Addis Ababa TC2', email: 'aa2.chair@mor.gov.et', role: 'Committee Chair · Addis Ababa TC2' },
  { label: 'Member Addis Ababa TC2', email: 'aa2.member@mor.gov.et', role: 'Committee Member · Addis Ababa TC2' },
  { label: 'TL Berhanu Nega (AA2)', email: 'aa2.tl@mor.gov.et', role: 'Joint Team Leader · Addis Ababa TC2' },
  { label: 'Auditor Chaltu Bekele (AA2)', email: 'aa2.auditor1@mor.gov.et', role: 'Auditor · Customs & Tariffs Valuation · Addis Ababa TC2' },
  { label: 'Auditor Diriba Lema (AA2)', email: 'aa2.auditor2@mor.gov.et', role: 'Auditor · Cross-Border & Transfer Pricing · Addis Ababa TC2' },
  { label: 'Auditor Fikadu Desta (AA2)', email: 'aa2.auditor3@mor.gov.et', role: 'Auditor · Domestic VAT & Sales Reconciliation · Addis Ababa TC2' },
  { label: 'Auditor Gemechu Negash (AA2)', email: 'aa2.auditor4@mor.gov.et', role: 'Auditor · Corporate Income Tax & Deductions · Addis Ababa TC2' },
  { label: 'Auditor Haile Mengistu (AA2)', email: 'aa2.auditor5@mor.gov.et', role: 'Auditor · Forensic & Investigation · Addis Ababa TC2' },
  { label: 'Chair Addis Ababa TC3', email: 'aa3.chair@mor.gov.et', role: 'Committee Chair · Addis Ababa TC3' },
  { label: 'Member Addis Ababa TC3', email: 'aa3.member@mor.gov.et', role: 'Committee Member · Addis Ababa TC3' },
  { label: 'TL Kedir Kedir (AA3)', email: 'aa3.tl@mor.gov.et', role: 'Joint Team Leader · Addis Ababa TC3' },
  { label: 'Auditor Lemlem Tesfaye (AA3)', email: 'aa3.auditor1@mor.gov.et', role: 'Auditor · Customs & Tariffs Valuation · Addis Ababa TC3' },
  { label: 'Auditor Meron Hailu (AA3)', email: 'aa3.auditor2@mor.gov.et', role: 'Auditor · Cross-Border & Transfer Pricing · Addis Ababa TC3' },
  { label: 'Auditor Nardos Alemu (AA3)', email: 'aa3.auditor3@mor.gov.et', role: 'Auditor · Domestic VAT & Sales Reconciliation · Addis Ababa TC3' },
  { label: 'Auditor Obsa Banti (AA3)', email: 'aa3.auditor4@mor.gov.et', role: 'Auditor · Corporate Income Tax & Deductions · Addis Ababa TC3' },
  { label: 'Auditor Robel Wolde (AA3)', email: 'aa3.auditor5@mor.gov.et', role: 'Auditor · Forensic & Investigation · Addis Ababa TC3' },
  { label: 'Chair Oromia TC1', email: 'or1.chair@mor.gov.et', role: 'Committee Chair · Oromia TC1' },
  { label: 'Member Oromia TC1', email: 'or1.member@mor.gov.et', role: 'Committee Member · Oromia TC1' },
  { label: 'TL Urga Wakjira (OR1)', email: 'or1.tl@mor.gov.et', role: 'Joint Team Leader · Oromia TC1' },
  { label: 'Auditor Wondwossen Worku (OR1)', email: 'or1.auditor1@mor.gov.et', role: 'Auditor · Customs & Tariffs Valuation · Oromia TC1' },
  { label: 'Auditor Yared Kifle (OR1)', email: 'or1.auditor2@mor.gov.et', role: 'Auditor · Cross-Border & Transfer Pricing · Oromia TC1' },
  { label: 'Auditor Zinash Zewde (OR1)', email: 'or1.auditor3@mor.gov.et', role: 'Auditor · Domestic VAT & Sales Reconciliation · Oromia TC1' },
  { label: 'Auditor Almaz Solomon (OR1)', email: 'or1.auditor4@mor.gov.et', role: 'Auditor · Corporate Income Tax & Deductions · Oromia TC1' },
  { label: 'Auditor Biruk Melaku (OR1)', email: 'or1.auditor5@mor.gov.et', role: 'Auditor · Forensic & Investigation · Oromia TC1' },
  { label: 'Chair Oromia TC2', email: 'or2.chair@mor.gov.et', role: 'Committee Chair · Oromia TC2' },
  { label: 'Member Oromia TC2', email: 'or2.member@mor.gov.et', role: 'Committee Member · Oromia TC2' },
  { label: 'TL Fitsum Fanta (OR2)', email: 'or2.tl@mor.gov.et', role: 'Joint Team Leader · Oromia TC2' },
  { label: 'Auditor Getnet Tefera (OR2)', email: 'or2.auditor1@mor.gov.et', role: 'Auditor · Customs & Tariffs Valuation · Oromia TC2' },
  { label: 'Auditor Hirut Mekonnen (OR2)', email: 'or2.auditor2@mor.gov.et', role: 'Auditor · Cross-Border & Transfer Pricing · Oromia TC2' },
  { label: 'Auditor Iyasu Abera (OR2)', email: 'or2.auditor3@mor.gov.et', role: 'Auditor · Domestic VAT & Sales Reconciliation · Oromia TC2' },
  { label: 'Auditor Kalkidan Ayalew (OR2)', email: 'or2.auditor4@mor.gov.et', role: 'Auditor · Corporate Income Tax & Deductions · Oromia TC2' },
  { label: 'Auditor Lulit Regassa (OR2)', email: 'or2.auditor5@mor.gov.et', role: 'Auditor · Forensic & Investigation · Oromia TC2' },
  { label: 'Chair Oromia TC3', email: 'or3.chair@mor.gov.et', role: 'Committee Chair · Oromia TC3' },
  { label: 'Member Oromia TC3', email: 'or3.member@mor.gov.et', role: 'Committee Member · Oromia TC3' },
  { label: 'TL Rahel Bacha (OR3)', email: 'or3.tl@mor.gov.et', role: 'Joint Team Leader · Oromia TC3' },
  { label: 'Auditor Samuel Dejene (OR3)', email: 'or3.auditor1@mor.gov.et', role: 'Auditor · Customs & Tariffs Valuation · Oromia TC3' },
  { label: 'Auditor Tariku Shiferaw (OR3)', email: 'or3.auditor2@mor.gov.et', role: 'Auditor · Cross-Border & Transfer Pricing · Oromia TC3' },
  { label: 'Auditor Worku Zenebe (OR3)', email: 'or3.auditor3@mor.gov.et', role: 'Auditor · Domestic VAT & Sales Reconciliation · Oromia TC3' },
  { label: 'Auditor Yohannes Bogale (OR3)', email: 'or3.auditor4@mor.gov.et', role: 'Auditor · Corporate Income Tax & Deductions · Oromia TC3' },
  { label: 'Auditor Zewdu Amare (OR3)', email: 'or3.auditor5@mor.gov.et', role: 'Auditor · Forensic & Investigation · Oromia TC3' },
  { label: 'Chair Amhara TC1', email: 'am1.chair@mor.gov.et', role: 'Committee Chair · Amhara TC1' },
  { label: 'Member Amhara TC1', email: 'am1.member@mor.gov.et', role: 'Committee Member · Amhara TC1' },
  { label: 'TL Daniel Habte (AM1)', email: 'am1.tl@mor.gov.et', role: 'Joint Team Leader · Amhara TC1' },
  { label: 'Auditor Eyerusalem Jembere (AM1)', email: 'am1.auditor1@mor.gov.et', role: 'Auditor · Customs & Tariffs Valuation · Amhara TC1' },
  { label: 'Auditor Fasika Kassaye (AM1)', email: 'am1.auditor2@mor.gov.et', role: 'Auditor · Cross-Border & Transfer Pricing · Amhara TC1' },
  { label: 'Auditor Girma Legesse (AM1)', email: 'am1.auditor3@mor.gov.et', role: 'Auditor · Domestic VAT & Sales Reconciliation · Amhara TC1' },
  { label: 'Auditor Habtamu Mamo (AM1)', email: 'am1.auditor4@mor.gov.et', role: 'Auditor · Corporate Income Tax & Deductions · Amhara TC1' },
  { label: 'Auditor Kassahun Negussie (AM1)', email: 'am1.auditor5@mor.gov.et', role: 'Auditor · Forensic & Investigation · Amhara TC1' },
  { label: 'Chair Amhara TC2', email: 'am2.chair@mor.gov.et', role: 'Committee Chair · Amhara TC2' },
  { label: 'Member Amhara TC2', email: 'am2.member@mor.gov.et', role: 'Committee Member · Amhara TC2' },
  { label: 'TL Rediet Seyoum (AM2)', email: 'am2.tl@mor.gov.et', role: 'Joint Team Leader · Amhara TC2' },
  { label: 'Auditor Samson Tilahun (AM2)', email: 'am2.auditor1@mor.gov.et', role: 'Auditor · Customs & Tariffs Valuation · Amhara TC2' },
  { label: 'Auditor Tesfaye Wondimu (AM2)', email: 'am2.auditor2@mor.gov.et', role: 'Auditor · Cross-Border & Transfer Pricing · Amhara TC2' },
  { label: 'Auditor Walelign Yilma (AM2)', email: 'am2.auditor3@mor.gov.et', role: 'Auditor · Domestic VAT & Sales Reconciliation · Amhara TC2' },
  { label: 'Auditor Yeshi Zerihun (AM2)', email: 'am2.auditor4@mor.gov.et', role: 'Auditor · Corporate Income Tax & Deductions · Amhara TC2' },
  { label: 'Auditor Zeberga Abate (AM2)', email: 'am2.auditor5@mor.gov.et', role: 'Auditor · Forensic & Investigation · Amhara TC2' },
  { label: 'Chair Amhara TC3', email: 'am3.chair@mor.gov.et', role: 'Committee Chair · Amhara TC3' },
  { label: 'Member Amhara TC3', email: 'am3.member@mor.gov.et', role: 'Committee Member · Amhara TC3' },
  { label: 'TL Dejene Dinkayehu (AM3)', email: 'am3.tl@mor.gov.et', role: 'Joint Team Leader · Amhara TC3' },
  { label: 'Auditor Elsabeth Eshete (AM3)', email: 'am3.auditor1@mor.gov.et', role: 'Auditor · Customs & Tariffs Valuation · Amhara TC3' },
  { label: 'Auditor Fasil Fikre (AM3)', email: 'am3.auditor2@mor.gov.et', role: 'Auditor · Cross-Border & Transfer Pricing · Amhara TC3' },
  { label: 'Auditor Genet Gudina (AM3)', email: 'am3.auditor3@mor.gov.et', role: 'Auditor · Domestic VAT & Sales Reconciliation · Amhara TC3' },
  { label: 'Auditor Hiwot Hunde (AM3)', email: 'am3.auditor4@mor.gov.et', role: 'Auditor · Corporate Income Tax & Deductions · Amhara TC3' },
  { label: 'Auditor Jemal Jima (AM3)', email: 'am3.auditor5@mor.gov.et', role: 'Auditor · Forensic & Investigation · Amhara TC3' },
  { label: 'Chair Dire Dawa TC1', email: 'dd1.chair@mor.gov.et', role: 'Committee Chair · Dire Dawa TC1' },
  { label: 'Member Dire Dawa TC1', email: 'dd1.member@mor.gov.et', role: 'Committee Member · Dire Dawa TC1' },
  { label: 'TL Netsanet Molla (DD1)', email: 'dd1.tl@mor.gov.et', role: 'Joint Team Leader · Dire Dawa TC1' },
  { label: 'Auditor Roman Nida (DD1)', email: 'dd1.auditor1@mor.gov.et', role: 'Auditor · Customs & Tariffs Valuation · Dire Dawa TC1' },
  { label: 'Auditor Senait Olana (DD1)', email: 'dd1.auditor2@mor.gov.et', role: 'Auditor · Cross-Border & Transfer Pricing · Dire Dawa TC1' },
  { label: 'Auditor Tolera Roba (DD1)', email: 'dd1.auditor3@mor.gov.et', role: 'Auditor · Domestic VAT & Sales Reconciliation · Dire Dawa TC1' },
  { label: 'Auditor Winta Sori (DD1)', email: 'dd1.auditor4@mor.gov.et', role: 'Auditor · Corporate Income Tax & Deductions · Dire Dawa TC1' },
  { label: 'Auditor Yidnekachew Tufa (DD1)', email: 'dd1.auditor5@mor.gov.et', role: 'Auditor · Forensic & Investigation · Dire Dawa TC1' },
  { label: 'Chair Dire Dawa TC2', email: 'dd2.chair@mor.gov.et', role: 'Committee Chair · Dire Dawa TC2' },
  { label: 'Member Dire Dawa TC2', email: 'dd2.member@mor.gov.et', role: 'Committee Member · Dire Dawa TC2' },
  { label: 'TL Bizuayehu Yadeta (DD2)', email: 'dd2.tl@mor.gov.et', role: 'Joint Team Leader · Dire Dawa TC2' },
  { label: 'Auditor Desta Zewdie (DD2)', email: 'dd2.auditor1@mor.gov.et', role: 'Auditor · Customs & Tariffs Valuation · Dire Dawa TC2' },
  { label: 'Auditor Ephrem Addisu (DD2)', email: 'dd2.auditor2@mor.gov.et', role: 'Auditor · Cross-Border & Transfer Pricing · Dire Dawa TC2' },
  { label: 'Auditor Feven Bedada (DD2)', email: 'dd2.auditor3@mor.gov.et', role: 'Auditor · Domestic VAT & Sales Reconciliation · Dire Dawa TC2' },
  { label: 'Auditor Gashaw Chala (DD2)', email: 'dd2.auditor4@mor.gov.et', role: 'Auditor · Corporate Income Tax & Deductions · Dire Dawa TC2' },
  { label: 'Auditor Helen Defar (DD2)', email: 'dd2.auditor5@mor.gov.et', role: 'Auditor · Forensic & Investigation · Dire Dawa TC2' },
  { label: 'Chair Dire Dawa TC3', email: 'dd3.chair@mor.gov.et', role: 'Committee Chair · Dire Dawa TC3' },
  { label: 'Member Dire Dawa TC3', email: 'dd3.member@mor.gov.et', role: 'Committee Member · Dire Dawa TC3' },
  { label: 'TL Nigist Guta (DD3)', email: 'dd3.tl@mor.gov.et', role: 'Joint Team Leader · Dire Dawa TC3' },
  { label: 'Auditor Ruth Hiko (DD3)', email: 'dd3.auditor1@mor.gov.et', role: 'Auditor · Customs & Tariffs Valuation · Dire Dawa TC3' },
  { label: 'Auditor Sintayehu Jaleta (DD3)', email: 'dd3.auditor2@mor.gov.et', role: 'Auditor · Cross-Border & Transfer Pricing · Dire Dawa TC3' },
  { label: 'Auditor Tsion Keneni (DD3)', email: 'dd3.auditor3@mor.gov.et', role: 'Auditor · Domestic VAT & Sales Reconciliation · Dire Dawa TC3' },
  { label: 'Auditor Wubet Leta (DD3)', email: 'dd3.auditor4@mor.gov.et', role: 'Auditor · Corporate Income Tax & Deductions · Dire Dawa TC3' },
  { label: 'Auditor Yishak Merga (DD3)', email: 'dd3.auditor5@mor.gov.et', role: 'Auditor · Forensic & Investigation · Dire Dawa TC3' },
  { label: 'Chair SNNPR TC1', email: 'sn1.chair@mor.gov.et', role: 'Committee Chair · SNNPR TC1' },
  { label: 'Member SNNPR TC1', email: 'sn1.member@mor.gov.et', role: 'Committee Member · SNNPR TC1' },
  { label: 'TL Biniyam Reta (SN1)', email: 'sn1.tl@mor.gov.et', role: 'Joint Team Leader · SNNPR TC1' },
  { label: 'Auditor Elias Senbeta (SN1)', email: 'sn1.auditor1@mor.gov.et', role: 'Auditor · Customs & Tariffs Valuation · SNNPR TC1' },
  { label: 'Auditor Fisseha Tola (SN1)', email: 'sn1.auditor2@mor.gov.et', role: 'Auditor · Cross-Border & Transfer Pricing · SNNPR TC1' },
  { label: 'Auditor Getachew Utalo (SN1)', email: 'sn1.auditor3@mor.gov.et', role: 'Auditor · Domestic VAT & Sales Reconciliation · SNNPR TC1' },
  { label: 'Auditor Hermela Wako (SN1)', email: 'sn1.auditor4@mor.gov.et', role: 'Auditor · Corporate Income Tax & Deductions · SNNPR TC1' },
  { label: 'Auditor Kidan Yadessa (SN1)', email: 'sn1.auditor5@mor.gov.et', role: 'Auditor · Forensic & Investigation · SNNPR TC1' },
  { label: 'Chair SNNPR TC2', email: 'sn2.chair@mor.gov.et', role: 'Committee Chair · SNNPR TC2' },
  { label: 'Member SNNPR TC2', email: 'sn2.member@mor.gov.et', role: 'Committee Member · SNNPR TC2' },
  { label: 'TL Rekik Birhanu (SN2)', email: 'sn2.tl@mor.gov.et', role: 'Joint Team Leader · SNNPR TC2' },
  { label: 'Auditor Sisay Chemeda (SN2)', email: 'sn2.auditor1@mor.gov.et', role: 'Auditor · Customs & Tariffs Valuation · SNNPR TC2' },
  { label: 'Auditor Tamirat Dibaba (SN2)', email: 'sn2.auditor2@mor.gov.et', role: 'Auditor · Cross-Border & Transfer Pricing · SNNPR TC2' },
  { label: 'Auditor Weynshet Ejigu (SN2)', email: 'sn2.auditor3@mor.gov.et', role: 'Auditor · Domestic VAT & Sales Reconciliation · SNNPR TC2' },
  { label: 'Auditor Yosef Fufa (SN2)', email: 'sn2.auditor4@mor.gov.et', role: 'Auditor · Corporate Income Tax & Deductions · SNNPR TC2' },
  { label: 'Auditor Zerihun Gidisa (SN2)', email: 'sn2.auditor5@mor.gov.et', role: 'Auditor · Forensic & Investigation · SNNPR TC2' },
  { label: 'Chair SNNPR TC3', email: 'sn3.chair@mor.gov.et', role: 'Committee Chair · SNNPR TC3' },
  { label: 'Member SNNPR TC3', email: 'sn3.member@mor.gov.et', role: 'Committee Member · SNNPR TC3' },
  { label: 'TL Endale Jibat (SN3)', email: 'sn3.tl@mor.gov.et', role: 'Joint Team Leader · SNNPR TC3' },
  { label: 'Auditor Firew Kumela (SN3)', email: 'sn3.auditor1@mor.gov.et', role: 'Auditor · Customs & Tariffs Valuation · SNNPR TC3' },
  { label: 'Auditor Gizachew Lamessa (SN3)', email: 'sn3.auditor2@mor.gov.et', role: 'Auditor · Cross-Border & Transfer Pricing · SNNPR TC3' },
  { label: 'Auditor Hilina Mideksa (SN3)', email: 'sn3.auditor3@mor.gov.et', role: 'Auditor · Domestic VAT & Sales Reconciliation · SNNPR TC3' },
  { label: 'Auditor Kumsa Nugusa (SN3)', email: 'sn3.auditor4@mor.gov.et', role: 'Auditor · Corporate Income Tax & Deductions · SNNPR TC3' },
  { label: 'Auditor Michael Obse (SN3)', email: 'sn3.auditor5@mor.gov.et', role: 'Auditor · Forensic & Investigation · SNNPR TC3' },
  { label: 'Chair Somali TC1', email: 'so1.chair@mor.gov.et', role: 'Committee Chair · Somali TC1' },
  { label: 'Member Somali TC1', email: 'so1.member@mor.gov.et', role: 'Committee Member · Somali TC1' },
  { label: 'TL Solomon Tucho (SO1)', email: 'so1.tl@mor.gov.et', role: 'Joint Team Leader · Somali TC1' },
  { label: 'Auditor Tewodros Urgesa (SO1)', email: 'so1.auditor1@mor.gov.et', role: 'Auditor · Customs & Tariffs Valuation · Somali TC1' },
  { label: 'Auditor Wolde Wayessa (SO1)', email: 'so1.auditor2@mor.gov.et', role: 'Auditor · Cross-Border & Transfer Pricing · Somali TC1' },
  { label: 'Auditor Yostina Yadete (SO1)', email: 'so1.auditor3@mor.gov.et', role: 'Auditor · Domestic VAT & Sales Reconciliation · Somali TC1' },
  { label: 'Auditor Zewditu Zelalem (SO1)', email: 'so1.auditor4@mor.gov.et', role: 'Auditor · Corporate Income Tax & Deductions · Somali TC1' },
  { label: 'Auditor Amanuel Alebachew (SO1)', email: 'so1.auditor5@mor.gov.et', role: 'Auditor · Forensic & Investigation · Somali TC1' },
  { label: 'Chair Somali TC2', email: 'so2.chair@mor.gov.et', role: 'Committee Chair · Somali TC2' },
  { label: 'Member Somali TC2', email: 'so2.member@mor.gov.et', role: 'Committee Member · Somali TC2' },
  { label: 'TL Frehiwot Damte (SO2)', email: 'so2.tl@mor.gov.et', role: 'Joint Team Leader · Somali TC2' },
  { label: 'Auditor Gosa Endalew (SO2)', email: 'so2.auditor1@mor.gov.et', role: 'Auditor · Customs & Tariffs Valuation · Somali TC2' },
  { label: 'Auditor Hundessa Fentaw (SO2)', email: 'so2.auditor2@mor.gov.et', role: 'Auditor · Cross-Border & Transfer Pricing · Somali TC2' },
  { label: 'Auditor Leul Gashaw (SO2)', email: 'so2.auditor3@mor.gov.et', role: 'Auditor · Domestic VAT & Sales Reconciliation · Somali TC2' },
  { label: 'Auditor Million Hunegnaw (SO2)', email: 'so2.auditor4@mor.gov.et', role: 'Auditor · Corporate Income Tax & Deductions · Somali TC2' },
  { label: 'Auditor Nuredin Kindie (SO2)', email: 'so2.auditor5@mor.gov.et', role: 'Auditor · Forensic & Investigation · Somali TC2' },
  { label: 'Chair Somali TC3', email: 'so3.chair@mor.gov.et', role: 'Committee Chair · Somali TC3' },
  { label: 'Member Somali TC3', email: 'so3.member@mor.gov.et', role: 'Committee Member · Somali TC3' },
  { label: 'TL Tibebu Setegn (SO3)', email: 'so3.tl@mor.gov.et', role: 'Joint Team Leader · Somali TC3' },
  { label: 'Auditor Wondimu Tarekegn (SO3)', email: 'so3.auditor1@mor.gov.et', role: 'Auditor · Customs & Tariffs Valuation · Somali TC3' },
  { label: 'Auditor Yabsira Wassie (SO3)', email: 'so3.auditor2@mor.gov.et', role: 'Auditor · Cross-Border & Transfer Pricing · Somali TC3' },
  { label: 'Auditor Zena Yimam (SO3)', email: 'so3.auditor3@mor.gov.et', role: 'Auditor · Domestic VAT & Sales Reconciliation · Somali TC3' },
  { label: 'Auditor Kassaye Zewdu (SO3)', email: 'so3.auditor4@mor.gov.et', role: 'Auditor · Corporate Income Tax & Deductions · Somali TC3' },
  { label: 'Auditor Negussie Admasu (SO3)', email: 'so3.auditor5@mor.gov.et', role: 'Auditor · Forensic & Investigation · Somali TC3' }
];

export default function Login() {
  console.log("Login component mounted");
  const { login } = useAuth();
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [showDemo, setShowDemo]   = useState(false);
  const [showDirectory, setShowDirectory] = useState(false);

  const handleSubmit = async (e) => {
    console.log("Sign in button clicked");
    e.preventDefault();
    if (!email.trim())    { setError('Email is required');    return; }
    if (!password.trim()) { setError('Password is required'); return; }
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
    setShowDemo(false);
    setShowDirectory(false);
    setLoading(true);
    try {
      await login(demoEmail, 'password123');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* User Directory Modal */}
      {showDirectory && (
        <UserDirectory 
          onSelectUser={fillDemo} 
          onClose={() => setShowDirectory(false)} 
        />
      )}

      {/* Left Panel - Blue branded section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
            backgroundSize: '40px 40px' 
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
              <img
                src="/mor-logo.jpeg"
                alt="MOR"
                className="w-full h-full object-cover"
                onError={e => { 
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div 
                className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 items-center justify-center text-white font-bold text-lg hidden"
              >
                MOR
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold">ITAS Back-office</h1>
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-blue-300 font-semibold mb-2">
                MINISTRY OF REVENUE - ITAS
              </p>
              <h2 className="text-4xl font-bold leading-tight mb-4">
                Tax administration, operated with clarity.
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Sign in to access the back-office suite — registration, workflow tasks,
                and tax-type administration in one secure console.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 text-blue-300 text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Authorized personnel only.</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Dark login form */}
      <div className="w-full lg:w-1/2 bg-black flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo - shown only on small screens */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center border-2 border-blue-400">
              <img
                src="/mor-logo.jpeg"
                alt="MOR"
                className="w-full h-full object-cover"
                onError={e => { 
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <span className="text-white font-bold text-sm hidden">MOR</span>
            </div>
            <span className="text-white text-lg font-bold">ITAS Back-office</span>
          </div>

          {/* Form content */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
              <p className="text-gray-400 text-sm">
                Sign in to continue to the ITAS Back-office.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Username/Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 text-sm
                               rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 text-sm
                               rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-4 py-3 whitespace-pre-line">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-blue-600
                           hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold
                           rounded-lg transition-all shadow-lg shadow-blue-900/50"
              >
                {loading ? (
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : null}
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            {/* Demo section */}
            <div className="pt-6 border-t border-gray-800">
              {/* Demo info */}
              <div className="mb-4 p-3 bg-blue-950/30 border border-blue-900/50 rounded-lg">
                <p className="text-xs text-blue-300 font-medium mb-1">🎭 Demo Mode Active</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Use <strong className="text-white">any MOR email</strong> with password:{' '}
                  <code className="bg-gray-800 px-1.5 py-0.5 rounded font-mono text-blue-400 font-semibold">password123</code>
                </p>
              </div>

              {/* Browse users button */}
              <button
                onClick={() => setShowDirectory(true)}
                className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-2.5 
                           bg-gray-800 hover:bg-gray-700 border border-gray-700
                           text-gray-300 text-sm font-medium rounded-lg transition-all"
              >
                <Users size={16} />
                Demo Accounts ({DEMO_ACCOUNTS.length})
              </button>
              <p className="text-[11px] text-gray-600 text-center mb-3">
                {DEMO_ACCOUNTS.filter(u => u.role.startsWith('Team Leader')).length} team leaders + {DEMO_ACCOUNTS.filter(u => u.role.startsWith('Auditor')).length} auditors enabled.
              </p>

              {/* Quick access toggle */}
              <button
                onClick={() => setShowDemo(v => !v)}
                className="flex items-center justify-between w-full text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                <span className="font-medium">Quick access demo accounts</span>
                {showDemo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {/* Demo accounts list */}
              {showDemo && (
                <div className="mt-3 space-y-1.5 max-h-80 overflow-y-auto pr-1">
                  {DEMO_ACCOUNTS.map(u => (
                    <button
                      key={u.email}
                      onClick={() => fillDemo(u.email)}
                      className="w-full text-left px-3 py-2.5 rounded-lg bg-gray-900/50 border border-gray-800
                                 hover:bg-gray-800 hover:border-gray-700 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-white">{u.label}</p>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                          {u.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{u.email}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
