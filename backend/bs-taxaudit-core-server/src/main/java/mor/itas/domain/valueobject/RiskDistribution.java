package mor.itas.domain.valueobject;

public record RiskDistribution(
    long critical,
    long high,
    long medium,
    long low
) {}
