import React, { useState, useEffect } from 'react';
import { Modal } from '../../../../components/ui/index.jsx';
import TaxpayerProfileView from '../../components/taxpayer/TaxpayerProfileView.jsx';

export default function CaseDetailModal({ caseData, onClose, users = [] }) {
  const [taxpayer, setTaxpayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tin = caseData?.tin || caseData?.taxpayerId || caseData?.taxIdNumber;

  useEffect(() => {
    if (!tin) return;
    let isMounted = true;
    setLoading(true);
    setError(null);

    // Fetch full authentic taxpayer record from backend
    fetch(`/api/public/v1/taxpayers/${tin}`)
      .then(res => {
        if (!res.ok) throw new Error(`Taxpayer record not found (${res.status})`);
        return res.json();
      })
      .then(json => {
        if (isMounted) {
          setTaxpayer(json.data || json);
        }
      })
      .catch(err => {
        console.warn('Could not fetch real taxpayer data for TIN:', tin, err);
        if (isMounted) {
          // Fallback to building taxpayer object from caseData
          setTaxpayer(caseData);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [tin, caseData]);

  if (!caseData) return null;

  const title = `Taxpayer Dossier & Case Details · ${caseData.caseNumber || caseData.id || ''}`;

  return (
    <Modal open={!!caseData} onClose={onClose} title={title} size="full">
      {loading && !taxpayer ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Fetching Authentic Taxpayer Records
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
              TIN: {tin} · Querying SIGTAS & ITAS Registry Database...
            </p>
          </div>
        </div>
      ) : (
        <TaxpayerProfileView
          taxpayer={taxpayer || caseData}
          caseData={caseData}
          onClose={onClose}
        />
      )}
    </Modal>
  );
}
