package com.mor.itas.infrastructure.dms;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
@Profile("mock")
public class MockDmsAdapter implements DmsPort {

    @Override
    public UUID uploadDocument(String filename, byte[] content) {
        return UUID.randomUUID(); // Mock document ID
    }
}
