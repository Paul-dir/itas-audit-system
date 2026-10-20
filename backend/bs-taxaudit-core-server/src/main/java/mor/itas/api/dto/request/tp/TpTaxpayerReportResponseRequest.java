package mor.itas.api.dto.request.tp;

import lombok.Data;

@Data
public class TpTaxpayerReportResponseRequest {
    private String action;         // SIGN, OBJECT, NO_RESPONSE
    private String responseDetail; // signature ref or objection summary
}
