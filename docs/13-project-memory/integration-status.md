# Integration Status Tracker

**Version:** 1.0
**Last Updated:** 2026-08-16

This document tracks the status of the internal and external engine mock adapters.

| Integration Port | Responsible | Status | Notes |
| :--- | :--- | :--- | :--- |
| `RiskEnginePort` | Pawlos | PENDING | Needs `@Profile("mock")` adapter returning fake risk scores. |
| `WorkflowEnginePort`| Pawlos | PENDING | Needs dummy auto-approver for plan overrides. |
| `DmsPort` | Oliad | PENDING | Needs local file storage mock for evidence upload. |
| `CaatEnginePort` | Oliad | PENDING | Needs fake anomaly generator for Comp Audits. |
| `ComparablesEnginePort`| Borifa | PENDING | Needs static JSON returns for Arm's Length ranges. |
| `LedgerEnginePort` | Yoseph | PENDING | Needs mock to simulate posting tax liabilities. |
