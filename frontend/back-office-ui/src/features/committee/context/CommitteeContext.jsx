/**
 * CommitteeContext
 * Global state management for committee features
 */

import React, { createContext, useState, useCallback } from 'react';

const CommitteeContext = createContext(null);

export function CommitteeProvider({ children }) {
  const [selectedCase, setSelectedCase] = useState(null);
  const [userVotes, setUserVotes] = useState({});
  const [caseOwnership, setCaseOwnership] = useState({});
  const [activityNotifications, setActivityNotifications] = useState([]);

  const recordVote = useCallback((caseId, voteOption) => {
    setUserVotes(prev => ({
      ...prev,
      [caseId]: voteOption
    }));
  }, []);

  const recordOwnership = useCallback((caseId, ownerId) => {
    setCaseOwnership(prev => ({
      ...prev,
      [caseId]: ownerId
    }));
  }, []);

  const addNotification = useCallback((notification) => {
    setActivityNotifications(prev => [
      { id: Date.now(), ...notification },
      ...prev.slice(0, 9)
    ]);
  }, []);

  return (
    <CommitteeContext.Provider
      value={{
        selectedCase,
        setSelectedCase,
        userVotes,
        recordVote,
        caseOwnership,
        recordOwnership,
        activityNotifications,
        addNotification,
      }}
    >
      {children}
    </CommitteeContext.Provider>
  );
}

export function useCommitteeContext() {
  const context = React.useContext(CommitteeContext);
  if (!context) {
    throw new Error('useCommitteeContext must be used within CommitteeProvider');
  }
  return context;
}
