import { Modal } from '../../../../components/ui/index.jsx';
import { UnifiedCaseInfo } from '../../../../components/shared/UnifiedCaseDetail.jsx';

export default function CaseDetailModal({ caseData, onClose, users = [] }) {
  if (!caseData) return null;

  return (
    <Modal open={!!caseData} onClose={onClose} title="Case Details" size="lg">
      <UnifiedCaseInfo
        caseData={caseData}
        compactRisk
        sections={{
          overview: true,
          taxpayer: true,
          address: true,
          risk: true,
          auditInfo: true,
          committeeDecision: false,
          segmentHistory: false,
        }}
      />
    </Modal>
  );
}
