package mor.itas.application.port.outboundport.dms;

import java.util.UUID;

public interface DmsPort {
    UUID uploadDocument(String filename, byte[] content);
}
