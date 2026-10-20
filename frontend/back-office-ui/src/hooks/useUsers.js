import { useState, useCallback, useEffect } from 'react';
import apiClient from '../services/apiClient';

/**
 * Custom hook for fetching users
 * 
 * Usage:
 * const { users, loading, error, refetch } = useUsers();
 */
export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiClient.getUsers();
      setUsers(result.data || []);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
};

/**
 * Custom hook for fetching committee users
 * 
 * Usage:
 * const { users, loading } = useCommitteeUsers('TRANSFER_PRICING');
 */
export const useCommitteeUsers = (auditType) => {
  const { users, loading, error, refetch } = useUsers();
  
  const committeeUsers = users.filter(u => 
    u.userType === 'COMMITTEE_MEMBER' && 
    u.auditType === auditType
  );

  return {
    users: committeeUsers,
    allUsers: users,
    loading,
    error,
    refetch,
  };
};

/**
 * Custom hook for fetching team leaders
 * 
 * Usage:
 * const { teamLeaders, loading } = useTeamLeaders('DESK_AUDIT');
 */
export const useTeamLeaders = (auditType) => {
  const { users, loading, error, refetch } = useUsers();
  
  const teamLeaders = users.filter(u => 
    u.userType === 'TEAM_LEADER' && 
    u.auditType === auditType
  );

  return {
    teamLeaders,
    allUsers: users,
    loading,
    error,
    refetch,
  };
};

/**
 * Custom hook for fetching auditors
 * 
 * Usage:
 * const { auditors, loading } = useAuditors('DESK_AUDIT');
 */
export const useAuditors = (auditType) => {
  const { users, loading, error, refetch } = useUsers();
  
  const auditors = users.filter(u => 
    u.userType === 'AUDITOR' && 
    u.auditType === auditType
  );

  return {
    auditors,
    allUsers: users,
    loading,
    error,
    refetch,
  };
};

/**
 * Custom hook for getting a user by ID
 * 
 * Usage:
 * const { user, loading } = useUser('u-com-fed-tpchair');
 */
export const useUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiClient.getUserById(userId);
      setUser(result.data || null);
    } catch (err) {
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
};

export default useUsers;
