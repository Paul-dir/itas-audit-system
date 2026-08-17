# Risk Engine Contract

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

## 1. Overview

The Risk Engine is an external system responsible for scoring taxpayers using ML models. The Core system accesses it strictly via the `RiskEnginePort`.

## 2. Java Interface (Port)

```java
package com.act.audit.shared.infrastructure.integration.risk;

import java.util.List;
import java.util.UUID;

public interface RiskEnginePort {

    /**
     * Retrieves the risk score and category for a single taxpayer.
     */
    TaxpayerRiskProfile getRiskProfile(String tin);

    /**
     * Retrieves a scoped list of high-risk taxpayers for annual planning.
     */
    List<TaxpayerRiskProfile> getHighRiskTaxpayers(String taxCenterCode, int limit);
    
    /**
     * Reports an audit finding back to the Risk Engine to update its ML model.
     */
    void reportAuditFindingFeedback(String tin, AuditFindingFeedback feedback);
}
```

## 3. Data Transfer Objects

```java
public record TaxpayerRiskProfile(
    String tin,
    RiskCategory category, // HIGH, MEDIUM, LOW
    int score,             // 0-100
    List<String> riskIndicators // e.g., ["Frequent losses", "Large cross-border transfers"]
) {}

public record AuditFindingFeedback(
    UUID auditCaseId,
    boolean riskWasValid,
    String varianceReason
) {}
```
