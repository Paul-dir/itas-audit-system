import { Badge } from '../../components/ui/index.jsx';
import { PLAN_STATUS } from '../../data/constants.js';

export default function PlanStatusBadge({ status }) {
  const s = PLAN_STATUS[status] || { label: status, color: 'gray' };
  return <Badge color={s.color} dot>{s.label}</Badge>;
}
