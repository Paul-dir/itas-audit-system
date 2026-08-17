# Cross-Cluster Dependency Matrix

**Version:** 1.0
**Last Updated:** 2026-08-17

Because the team is split into 4 independent tracks, they must coordinate when touching shared boundaries.

## 1. AP -> EX Handoff
- **AP Cluster (Pawlos)** generates `ap_audit_cases`.
- **EX Cluster (Oliad)** must NOT modify `ap_audit_cases`. Oliad's `ex_audit_plans` and `ex_desk_audit_details` must use a Foreign Key pointing to `ap_audit_cases.id`.
- **Rule:** If Oliad needs a new column on the base case, he must submit a PR to Pawlos.

## 2. EX -> CM Handoff
- **EX Cluster (Oliad)** finalizes the Comprehensive Audit via Team Leader Review.
- **CM Cluster (Yoseph)** picks up the case. Yoseph's `cm_case_closures` references the `ap_audit_cases.id`.
- **Rule:** Yoseph relies on Oliad to fire the `CaseReadyForClosureEvent`.

## 3. AP -> JA/TP Routing
- **AP Cluster (Pawlos)** handles the assignment board.
- If `audit_type == TP` or `JOINT`, Pawlos routes the case to a `Committee ID`.
- **TP (Borifa)** and **JA (Yoseph)** rely on Pawlos's assignment logic. Borifa and Yoseph cannot start their workflows unless the case is successfully routed to a committee.

## 4. RF Event Sourcing
- **RF Cluster (Yoseph)** generates reports by querying `shared_audit_trail_entries`.
- **Rule:** ALL Developers (Pawlos, Oliad, Borifa) MUST ensure their aggregates fire Domain Events that correctly log to the shared audit trail, otherwise Yoseph's dashboards will be empty.
