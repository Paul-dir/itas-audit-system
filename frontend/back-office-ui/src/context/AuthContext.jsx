import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { storage, STORE_KEYS } from '../features/ap/services/storage.js';
import { SEED_USERS } from '../features/ap/data/seed.js';
import { buildCompleteUserProfile, synthesizeUserFromPattern, mapBackendUserToProfile } from '../features/ap/data/userResolver.js';

/**
 * Auth Context
 * 
 * Manages user authentication, complete session state, and organizational context.
 * Supports login via Username (e.g. u-pt-01, u-tcm-federal-lto1) or Email (e.g. tsega.mulugeta@mor.gov.et).
 * Synchronized with the backend user directory (/api/v1/backoffice/ap/users).
 */
const AuthContext = createContext({
  user: null,
  authContext: null,
  isAuthenticated: false,
  loading: true,
  login: () => false,
  logout: () => {},
  getUserInfo: () => null,
  hasPermission: () => false
});

async function fetchBackendDirectoryUsers() {
  try {
    const res = await fetch('/api/v1/backoffice/ap/users');
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.data || []);
      return list.map(mapBackendUserToProfile).filter(Boolean);
    }
  } catch (err) {
    console.warn('Could not fetch backend users for auth:', err);
  }
  return [];
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const directoryUsersRef = useRef([]);

  // Restore session on mount & sync backend directory
  useEffect(() => {
    let isMounted = true;
    async function initAuth() {
      try {
        const saved = storage.get('session');
        const cachedRaw = storage.get(STORE_KEYS.USERS, []);
        const cached = (Array.isArray(cachedRaw) ? cachedRaw : []).map(buildCompleteUserProfile);
        const seedList = SEED_USERS.map(buildCompleteUserProfile);
        let pool = [...cached, ...seedList];
        directoryUsersRef.current = pool;

        let currentUser = null;
        if (saved && (saved.id || saved.email || saved.username)) {
          const targetId = (saved.id || saved.email || saved.username).toLowerCase();
          currentUser = pool.find(u => 
            (u.id && u.id.toLowerCase() === targetId) ||
            (u.username && u.username.toLowerCase() === targetId) ||
            (u.email && u.email.toLowerCase() === targetId)
          );
          if (!currentUser && saved.user) {
            currentUser = buildCompleteUserProfile(saved.user);
          }
          if (!currentUser) {
            currentUser = synthesizeUserFromPattern(saved.id);
          }
          if (currentUser && isMounted) {
            setUser(currentUser);
          }
        }

        // Fetch full directory of system accounts from backend
        const backendUsers = await fetchBackendDirectoryUsers();
        if (backendUsers && backendUsers.length > 0) {
          directoryUsersRef.current = backendUsers;
          storage.set(STORE_KEYS.USERS, backendUsers);

          // Re-resolve active session with authoritative backend profile
          if (saved && (saved.id || saved.email || saved.username)) {
            const targetId = (saved.id || saved.email || saved.username).toLowerCase();
            const matched = backendUsers.find(u =>
              (u.id && u.id.toLowerCase() === targetId) ||
              (u.username && u.username.toLowerCase() === targetId) ||
              (u.email && u.email.toLowerCase() === targetId)
            );
            if (matched && isMounted) {
              setUser(matched);
              storage.set('session', { id: matched.id, role: matched.role, user: matched });
              sessionStorage.setItem('userId', matched.id);
              sessionStorage.setItem('userRole', matched.role);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to restore session:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initAuth();
    return () => { isMounted = false; };
  }, []);

  // Login user - supports User Object, Username, or Email
  const login = useCallback(async (emailOrUsernameOrObj, password) => {
    setLoading(true);
    try {
      if (!emailOrUsernameOrObj) {
        throw new Error('Username or email is required');
      }

      // If already a complete user object
      if (typeof emailOrUsernameOrObj === 'object' && emailOrUsernameOrObj !== null) {
        const completeUser = mapBackendUserToProfile(emailOrUsernameOrObj);
        setUser(completeUser);
        storage.set('session', { id: completeUser.id, role: completeUser.role, user: completeUser });
        sessionStorage.setItem('userId', completeUser.id);
        sessionStorage.setItem('userRole', completeUser.role);
        return completeUser;
      }

      const input = String(emailOrUsernameOrObj).trim();
      if (!input) {
        throw new Error('Username or email is required');
      }
      const inputLower = input.toLowerCase();
      const inputBase = inputLower.replace(/@mor\.gov\.et$/, '');

      // Check current in-memory directory
      let allUsers = directoryUsersRef.current || [];
      if (allUsers.length === 0) {
        const cachedRaw = storage.get(STORE_KEYS.USERS, []);
        allUsers = (Array.isArray(cachedRaw) ? cachedRaw : []).map(buildCompleteUserProfile);
      }
      if (allUsers.length === 0) {
        allUsers = SEED_USERS.map(buildCompleteUserProfile);
      }

      // Search directory
      let found = allUsers.find(u => 
        (u.id && u.id.toLowerCase() === inputLower) ||
        (u.username && u.username.toLowerCase() === inputLower) ||
        (u.username && u.username.toLowerCase() === inputBase) ||
        (u.email && u.email.toLowerCase() === inputLower) ||
        (u.name && u.name.toLowerCase() === inputLower) ||
        (u.userId && u.userId.toLowerCase() === inputLower)
      );

      // If still not found, fetch fresh from backend API
      if (!found) {
        const freshUsers = await fetchBackendDirectoryUsers();
        if (freshUsers && freshUsers.length > 0) {
          directoryUsersRef.current = freshUsers;
          storage.set(STORE_KEYS.USERS, freshUsers);
          found = freshUsers.find(u => 
            (u.id && u.id.toLowerCase() === inputLower) ||
            (u.username && u.username.toLowerCase() === inputLower) ||
            (u.username && u.username.toLowerCase() === inputBase) ||
            (u.email && u.email.toLowerCase() === inputLower) ||
            (u.name && u.name.toLowerCase() === inputLower) ||
            (u.userId && u.userId.toLowerCase() === inputLower)
          );
        }
      }

      // If not in database/directory, synthesize based on standard naming pattern
      if (!found) {
        found = synthesizeUserFromPattern(input);
      }

      if (!found) {
        throw new Error(`User "${input}" not found in system.`);
      }

      const completeUser = buildCompleteUserProfile(found);

      // Store in session and local storage
      setUser(completeUser);
      storage.set('session', { id: completeUser.id, role: completeUser.role, user: completeUser });
      sessionStorage.setItem('userId', completeUser.id);
      sessionStorage.setItem('userRole', completeUser.role);

      return completeUser;
    } catch (err) {
      setUser(null);
      storage.remove('session');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    storage.remove('session');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userRole');
  }, []);

  const getUserInfo = useCallback(() => user || null, [user]);

  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    return (user.permissions || []).includes(permission);
  }, [user]);

  // Backward compatibility authContext object
  const authContext = user ? {
    user,
    userId: user.id,
    email: user.email,
    role: user.role,
    fullName: user.name,
    region: user.region,
    taxCenter: user.taxCenter,
    auditType: user.auditType,
    permissions: user.permissions || [],
    org_context: {
      assignedRegion: user.region,
      assignedTaxCenter: user.taxCenter,
      level: user.role
    }
  } : null;

  return (
    <AuthContext.Provider value={{
      user,
      authContext,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
      getUserInfo,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
