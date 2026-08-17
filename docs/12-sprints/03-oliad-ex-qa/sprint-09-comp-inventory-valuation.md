# Sprint 09: Comp Audit Inventory Valuation

**Objective:** Allow the comprehensive auditor to document physical inventory checks and compare them against the taxpayer's declared Cost of Goods Sold (COGS).

**Developer:** Oliad
**Cluster Prefix:** `ex_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint XX (Vertical Slice).
> - **Database:** Create `ex_inventory_checks`.
> - **Domain:** Calculate variance between declared and physical counts.

---

## 2. Backend Implementation
1. **Application API:**
   - Implement `POST /api/v1/ex/cases/{caseId}/comprehensive/inventory`.
   - Accepts a JSON payload of SKUs, Declared Value, and Physical Count Value.

---

## 3. Frontend Implementation
1. **UI Components:**
   - Build `<InventoryValuationGrid />`.
   - A data table allowing the auditor to input physical counts. The UI instantly calculates the ETB variance row-by-row.
