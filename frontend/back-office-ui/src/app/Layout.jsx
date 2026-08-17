import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  // Mock JWT Role check for Sprint 00
  const userRoles = ['ROLE_PROCESS_OWNER']; // Hardcoded for local testing

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 bg-slate-800">
          <h1 className="text-xl font-bold">MOR</h1>
          <p className="text-sm text-slate-400">Audit Planning System</p>
        </div>
        
        <div className="p-4 border-b border-slate-700">
          <p className="font-semibold">Planning Auditor</p>
          <p className="text-xs text-slate-400">planning.auditor1@mor.gov.et</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <p className="text-xs text-slate-500 uppercase font-bold mb-4">Menu</p>
          
          <Link to="/" className="block p-2 rounded hover:bg-slate-800">
            Dashboard
          </Link>
          
          {userRoles.includes('ROLE_PROCESS_OWNER') && (
            <>
              <Link to="/ap/plans" className="block p-2 rounded hover:bg-slate-800">
                Audit Plans
              </Link>
              <Link to="/ap/risk" className="block p-2 rounded hover:bg-slate-800">
                Risk Analysis
              </Link>
            </>
          )}

          {userRoles.includes('ROLE_AUDITOR') && (
            <Link to="/ex/cases" className="block p-2 rounded hover:bg-slate-800">
              My Audit Cases
            </Link>
          )}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold text-gray-800">Planning Dashboard</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{new Date().toDateString()}</span>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              PA
            </div>
          </div>
        </header>

        {/* Workspace */}
        <main className="flex-1 overflow-auto p-6">
          {children || <div className="text-gray-500">Workspace Area</div>}
        </main>
      </div>
    </div>
  );
};

export default Layout;
