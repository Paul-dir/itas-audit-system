package mor.itas.infrastructure.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Custom converter allowing non-UUID identifiers (such as "c-tp-default-01" or "default")
 * to be safely resolved to the primary active database Transfer Pricing case without throwing 500 errors.
 */
@Component
public class StringToUUIDConverter implements Converter<String, UUID> {

    private static final UUID DEFAULT_TP_CASE_ID = UUID.fromString("0a4500d1-0842-4c07-a077-ceed404af705");

    @Override
    public UUID convert(String source) {
        if (source == null || source.isBlank()) {
            return null;
        }
        try {
            return UUID.fromString(source.trim());
        } catch (IllegalArgumentException e) {
            return DEFAULT_TP_CASE_ID;
        }
    }
}
