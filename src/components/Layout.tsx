import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Receipt, LineChart, Shield, Wallet, Menu, UserCircle, LogOut, KeyRound, Trash2 } from 'lucide-react';
import { useFinanceStore } from '../stores/financeStore';
import ThemeToggle from './ThemeToggle';
import clsx from 'clsx';
import type { Role } from '../types/index';

const Layout = () => {
  const { role, setRole, user, logout, adminPassword, setAdminPassword, clearTransactions } = useFinanceStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <Receipt size={20} /> },
    { name: 'Insights', path: '/insights', icon: <LineChart size={20} /> },
  ];

  const SidebarContent = () => (
    <>
      <div>
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="flex items-center gap-2 font-bold text-xl text-primary">
            <Wallet className="h-6 w-6" /> FinDash
          </span>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:bg-surface/50 hover:text-text'
                )
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        {user && (
          <div className="flex items-center gap-3 mb-4 px-2 bg-surface p-2 rounded-lg border border-border">
            <UserCircle className="text-primary h-8 w-8" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-text truncate">{user.name}</span>
              <span className="text-xs text-text-muted truncate">{user.email}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4 px-2">
          <span className="text-sm font-medium text-text-muted flex items-center gap-2">
            <Shield size={16} /> Role
          </span>
          <select
            value={role}
            onChange={(e) => {
              const newRole = e.target.value as Role;
              if (newRole === 'Admin') {
                const pass = window.prompt('Enter Admin Password to unlock:');
                if (pass === adminPassword) {
                  setRole('Admin');
                } else if (pass !== null) {
                  alert('Incorrect password. Access denied.');
                }
              } else {
                setRole(newRole);
              }
            }}
            className="bg-surface border border-border text-text text-sm rounded-md focus:ring-primary focus:border-primary px-2 py-1 outline-none"
          >
            <option value="Viewer">Viewer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between mb-4 px-2">
           <span className="text-sm font-medium text-text-muted">Theme</span>
           <ThemeToggle />
        </div>

        {role === 'Admin' && (
          <button
            onClick={() => {
              const newPass = window.prompt('Enter new Admin Password:');
              if (newPass) {
                setAdminPassword(newPass);
                alert('Admin password updated successfully!');
              }
            }}
            className="w-full mb-2 flex items-center justify-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium text-text hover:bg-primary/5 hover:border-primary/30 transition-colors"
          >
            <KeyRound size={16} className="text-primary" /> Change Admin Key
          </button>
        )}

        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all transactions? This will reset your dashboard to zero.')) {
              clearTransactions();
            }
          }}
          className="w-full mb-2 flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-text hover:bg-expense/5 hover:text-expense hover:border-expense/20 transition-colors"
        >
          <Trash2 size={16} /> Reset Dashboard
        </button>

        <button
          onClick={() => logout()}
          className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-text hover:bg-expense/10 hover:text-expense hover:border-expense/20 transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Drawer Sidebar Overlay */}
      <div 
        className={clsx(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Drawer Sidebar */}
      <aside 
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border flex flex-col justify-between transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 border-b border-border glass-panel rounded-none z-10 sticky top-0 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-text-muted hover:text-text"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-xl flex items-center gap-2 text-primary">
               FinDash
            </span>
          </div>
          <div className="flex gap-4">
             <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background/50 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
