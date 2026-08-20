import { createContext, useContext, useState, useEffect } from 'react';
import { storage, STORE_KEYS } from '../features/ap/services/storage.js';
import { SEED_USERS } from '../features/ap/data/seed.js';

const AuthContext = createContext({ user: null, login: () => false, logout: () => {}, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session
    const saved = storage.get('session');
    if (saved) {
      const users = storage.get(STORE_KEYS.USERS, SEED_USERS);
      const found = users.find(u => u.id === saved.id);
      if (found) setUser(found);
    }
    setLoading(false);
  }, []);

  const login = (emailOrId, password) => {
    const users = storage.get(STORE_KEYS.USERS, SEED_USERS);
    // Find user by email or ID
    const found = users.find(u => u.email === emailOrId || u.id === emailOrId);
    
    if (found) {
      // Demo mode: Accept common password for all users
      const DEMO_PASSWORD = 'password123';
      const acceptedPasswords = [found.password, DEMO_PASSWORD];
      
      // Check password if provided
      if (password && !acceptedPasswords.includes(password)) {
        throw new Error('Invalid password');
      }
      setUser(found);
      storage.set('session', { id: found.id });
      return true;
    }
    throw new Error('User not found');
  };

  const logout = () => {
    setUser(null);
    storage.remove('session');
  };

  // Helper function to get user info
  const getUserInfo = () => user || null;

  // Helper function to check permissions
  const hasPermission = (permission) => {
    if (!user) return false;
    return (user.permissions || []).includes(permission);
  };

  // Build authContext object for backward compatibility
  const authContext = user ? {
    user,
    userId: user.id,
    email: user.email,
    role: user.role,
    fullName: user.name,
    region: user.region,
    taxCenter: user.taxCenter,
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
      login, 
      logout, 
      loading,
      getUserInfo,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
