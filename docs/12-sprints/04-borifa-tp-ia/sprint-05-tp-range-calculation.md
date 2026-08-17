# Sprint 05: Arm's Length Range Calculation

**Objective:** Perform the Interquartile Range (IQR) math on the accepted comparables to determine if the taxpayer's margins fall within the acceptable range.

**Developer:** Borifa
**Cluster Prefix:** `tp_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 05 (Vertical Slice).
> - **Backend:** Implement the mathematical IQR algorithm within a Domain Service.

---

## 2. Database Implementation
1. **Flyway Script (`V4_4__tp_range.sql`):**
   - Add `lower_quartile`, `median`, `upper_quartile`, and `taxpayer_margin` to the execution table.

---

## 3. Backend Implementation
1. **Domain Service:**
   - Create `InterquartileRangeCalculator`.
   - It takes the array of accepted comparable PLIs, sorts them, and calculates the 25th percentile, Median, and 75th percentile.
2. **Application API:**
   - Implement `POST /api/v1/tp/cases/{caseId}/calculate-range`.

---

## 4. Frontend Implementation
1. **UI Components:**
   - Build `<ArmsLengthRangeChart />`.
   - Visually display a scale from 0% to 10%, highlighting the 25th-75th range in green. Plot the taxpayer's margin as a red line. If it falls outside the green zone, display an "Adjustment Required" banner.
