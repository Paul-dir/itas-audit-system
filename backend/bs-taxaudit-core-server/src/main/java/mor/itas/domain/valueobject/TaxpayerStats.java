package mor.itas.domain.valueobject;

public record TaxpayerStats(
    long total,
    long active,
    long inactive
) {}
