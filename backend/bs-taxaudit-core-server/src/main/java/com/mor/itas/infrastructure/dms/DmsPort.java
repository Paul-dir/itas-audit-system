package com.mor.itas.infrastructure.dms;

import java.util.UUID;

public interface DmsPort {
    UUID uploadDocument(String filename, byte[] content);
}
