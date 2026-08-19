import React from 'react';
import Sidebar from '../Sidebar';
import TopBar from '../TopBar';
import { useAuth } from '../../context/AuthContext';

/**
 * Shared role layout — fixed sidebar, workspace header, scrollable content.
 */
function RoleLayout({ children, currentView, onNavigate }) {
  const { authContext } = useAuth();
  const role = authContext?.role;

  return (
    <div className="flex min-h-screen bg-[#0d131a]">
      <Sidebar
        currentRole={role}
        currentView={currentView}
        onNavigate={onNavigate}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          currentRole={role}
          onNavigate={onNavigate}
        />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default RoleLayout;
