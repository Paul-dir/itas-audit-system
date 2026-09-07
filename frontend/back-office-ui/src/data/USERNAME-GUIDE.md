# ITAS Back-Office User Guide

## System Credentials & Demo Access

The ITAS Back-office portal supports signing in with either your **System Username** or your **Official MOR Email Address**.

---

### Supported Login Identifiers

| Login Option | Format | Examples |
|--------------|--------|----------|
| **System Username** | `u-{role}-{location}-{type}-{number}` | `u-pt-01`, `u-com-fed-tpchair`, `u-tl-addis_ababa-tc1-desk-1` |
| **Official MOR Email** | `{name}@mor.gov.et` | `planning.auditor1@mor.gov.et`, `fed.tpcommittee1@mor.gov.et` |

> 💡 **Demo Mode Password**: `password123` (or leave blank in demo mode).

---

## Canonical Test Personas (All Roles Available)

### 1. National Directorate
- **Planning Team Lead**: `u-pt-01` (`planning.auditor1@mor.gov.et`)
- **Planning Team Member**: `u-pt-02` (`abebe.tadesse@mor.gov.et`)
- **Audit Director**: `u-ad-01` (`tesfaye.bekele@mor.gov.et`)
- **Senior Management**: `u-sm-01` (`rahel.hailu@mor.gov.et`)

### 2. Regional Directors
- **Addis Ababa**: `u-rd-aa` (`getnet.alemu@mor.gov.et`)
- **Oromia**: `u-rd-or` (`gemechu.negash@mor.gov.et`)
- **Amhara**: `u-rd-am` (`tadesse.kebede@mor.gov.et`)
- **Federal LTO**: `u-rd-fed` (`solomon.worku@mor.gov.et`)
- **Dire Dawa**: `u-rd-dd` (`yonas.mengistu.dd@mor.gov.et`)
- **SNNPR**: `u-rd-sn` (`yonas.mengistu@mor.gov.et`)
- **Somali**: `u-rd-so` (`ibrahim.hassan@mor.gov.et`)

### 3. Tax Center Managers
- **Addis Ababa TC1**: `u-tcm-addis_ababa-tc1` (`u-tcm-addis_ababa-tc1@mor.gov.et`)
- **Addis Ababa TC2**: `u-tcm-addis_ababa-tc2` (`u-tcm-addis_ababa-tc2@mor.gov.et`)
- **Federal LTO 1**: `u-tcm-federal-lto1` (`u-tcm-federal-lto1@mor.gov.et`)
- **Oromia TC1**: `u-tcm-oromia-tc1` (`u-tcm-oromia-tc1@mor.gov.et`)

### 4. Audit Committees
- **Federal TP Committee Chair**: `u-com-fed-tpchair` (`fed.tpcommittee1@mor.gov.et`)
- **Federal Joint Audit Committee Chair**: `u-com-fed-chair` (`fed.committee1@mor.gov.et`)
- **Federal Desk Audit Committee Chair**: `u-com-fed-deskchair` (`fed.deskcommittee@mor.gov.et`)
- **AA-TC1 TP Committee Chair**: `u-com-addis_ababa-tc1-tp` (`u-com-addis_ababa-tc1-tp@mor.gov.et`)
- **AA-TC1 Joint Audit Committee Chair**: `u-com-addis_ababa-tc1-ja` (`u-com-addis_ababa-tc1-ja@mor.gov.et`)

### 5. Team Leaders (AA-TC1)
- **Desk Audit TL**: `u-tl-addis_ababa-tc1-desk-1` (`u-tl-addis_ababa-tc1-desk-1@mor.gov.et`)
- **Transfer Pricing TL**: `u-tl-addis_ababa-tc1-tp-1` (`u-tl-addis_ababa-tc1-tp-1@mor.gov.et`)
- **Comprehensive Audit TL**: `u-tl-addis_ababa-tc1-comp-1` (`u-tl-addis_ababa-tc1-comp-1@mor.gov.et`)
- **Joint Audit TL**: `u-tl-addis_ababa-tc1-joint-1` (`u-tl-addis_ababa-tc1-joint-1@mor.gov.et`)
- **Issue Audit TL**: `u-tl-addis_ababa-tc1-issue-1` (`u-tl-addis_ababa-tc1-issue-1@mor.gov.et`)

### 6. Auditors (AA-TC1)
- **Desk Auditor**: `u-aud-addis_ababa-tc1-desk-1-1`
- **Transfer Pricing Auditor**: `u-aud-addis_ababa-tc1-tp-1-1`

### 7. Statutory Audit Requesters
- **Tax Clearance Officer**: `u-req-01` (`clearance.officer@mor.gov.et`)
- **Business Closure Directorate**: `u-req-02` (`closure.directorate@mor.gov.et`)
- **Fraud & Intelligence Directorate**: `u-req-03` (`fraud.intel@mor.gov.et`)
- **Ministry of Trade & Regional Integration (External)**: `u-req-04` (`external.motri@gov.et`)

### 8. External Taxpayer Portal
- **Crest Textiles CFO**: `taxpayer1` (`cfo@cresttextiles.et`)

---

## Database Synchronization

All 684 accounts are synchronized directly in PostgreSQL across:
- `users`
- `roles`
- `user_roles`
- `regions`
- `tax_centers`
- `committees`
- `user_organizational_assignments` (1 User = 1 Tax Center constraint)
