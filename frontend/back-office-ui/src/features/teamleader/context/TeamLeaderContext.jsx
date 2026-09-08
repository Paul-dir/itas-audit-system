/**
 * TeamLeaderContext
 * Global state management for team leader features
 */

import React, { createContext, useState, useCallback } from 'react';

const TeamLeaderContext = createContext(null);

export function TeamLeaderProvider({ children }) {
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseAssignments, setCaseAssignments] = useState({});
  const [activityNotifications, setActivityNotifications] = useState([]);

  const recordAssignment = useCallback((caseId, auditorId) => {
    setCaseAssignments(prev => ({
      ...prev,
      [caseId]: { auditorId, assignedAt: new Date().toISOString() }
    }));
  }, []);

  const addNotification = useCallback((notification) => {
    setActivityNotifications(prev => [
      { id: Date.now(), ...notification },
      ...prev.slice(0, 9)
    ]);
  }, []);

  return (
    <TeamLeaderContext.Provider
      value={{
        selectedCase,
        setSelectedCase,
        caseAssignments,
        recordAssignment,
        activityNotifications,
        addNotification,
      }}
    >
      {children}
    </TeamLeaderContext.Provider>
  );
}

export function useTeamLeaderContext() {
  const context = React.useContext(TeamLeaderContext);
  if (!context) {
    throw new Error('useTeamLeaderContext must be used within TeamLeaderProvider');
  }
  return context;
}
