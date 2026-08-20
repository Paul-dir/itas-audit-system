import { useCallback, useEffect } from 'react';
import { useData } from '../services/dataService';

/**
 * Reactive hook for app data stored in localStorage.
 * Now wraps useData hook for backward compatibility.
 * Re-loads when storage changes (cross-tab) or after explicit refresh.
 */
export function useAppData() {
  const { data, updateData } = useData();

  const refresh = useCallback(() => {
    // Data will auto-refresh through the hook context
    console.log('🔄 Data refresh triggered');
  }, []);

  const persist = useCallback((nextData) => {
    updateData(nextData);
  }, [updateData]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'audit_planning_system_v2' || e.key === null) {
        refresh();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refresh]);

  return { data, refresh, persist };
}
