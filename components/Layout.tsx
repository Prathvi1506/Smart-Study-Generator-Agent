import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen, LayoutDashboard, FileText, Sparkles, MessageSquare,
  CreditCard, ClipboardList, GitBranch, Calendar, Target,
  BarChart3, Settings, LogOut, ChevronLeft, ChevronRight,
  Moon, Sun, Brain, Menu, X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/materials', icon: FileText, label: 'Study Materials' },
  { to: '/generate', icon: Sparkles, label: 'Generate Notes' },
  { to: '/assistant', icon: MessageSquare, label: 'AI Assistant' },
  { to: '/flashcards', icon: CreditCard, label: 'Flashcards' },
  { to: '/quizzes', icon: ClipboardList, label: 'Practice Quizzes' },
  { to: '/concepts', icon: GitBranch, label: 'Concept Maps' },
  { to: '/planner', icon: Calendar, label: 'Study Planner' },
  { to: '/predictor', icon: Target, label: 'Exam Predictor' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const SidebarContent = ({ onNav }: { onNav?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-4 border-b border-slate-200 dark:border-slate-800 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Smart Study</p>
            <p className="text-xs text-indigo-500 font-medium">Generator Agent</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            onClick={onNav}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-4.5 h-4.5 flex-shrink-0 w-[18px] h-[18px]" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-2 space-y-0.5">
        <NavLink
          to="/settings"
          onClick={onNav}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                       : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            } ${collapsed ? 'justify-center' : ''}`
          }
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        <button
          onClick={toggleTheme}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${collapsed ? 'justify-center' : ''}`}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <Sun className="w-[18px] h-[18px] flex-shrink-0" /> : <Moon className="w-[18px] h-[18px] flex-shrink-0" />}
          {!collapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
        {collapsed && (
          <button onClick={handleLogout} className="w-full flex items-center justify-center py-2.5 text-slate-400 hover:text-red-500 transition-colors" title="Sign out">
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex-shrink-0 ${collapsed ? 'w-[68px]' : 'w-60'}`}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(p => !p)}
          className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-[calc(100%-1px)] z-10 w-5 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-r-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors hidden lg:flex"
          style={{ left: collapsed ? '67px' : '239px' }}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-white dark:bg-slate-900 flex flex-col h-full shadow-2xl">
            <button onClick={() => setMobileOpen(false)} className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent onNav={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-900 dark:text-white text-sm">Smart Study Agent</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
