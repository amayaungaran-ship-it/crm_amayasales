import React from 'react';
import {
  LayoutGrid,
  Users,
  Compass,
  Handshake,
  Calendar,
  Building2,
  Target,
  Megaphone,
  Home,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onOpenUserModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  collapsed,
  setCollapsed,
  onOpenUserModal,
}) => {
  const { currentUser, dashboardMetrics } = useCrm();

  const mainNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutGrid,
    },
    {
      id: 'leads',
      label: 'Leads',
      icon: Users,
      badge: dashboardMetrics.totalLeads,
    },
    {
      id: 'prospecting',
      label: 'Prospecting',
      icon: Compass,
      badge: dashboardMetrics.warmProspects + dashboardMetrics.hotProspects,
    },
    {
      id: 'closing',
      label: 'Closing',
      icon: Handshake,
      badge: dashboardMetrics.closingCount,
    },
    {
      id: 'calendar',
      label: 'Calendar Event',
      icon: Calendar,
    },
    {
      id: 'visit-instansi',
      label: 'Visit Instansi (B2B)',
      icon: Building2,
    },
    {
      id: 'kpi',
      label: 'KPI Target',
      icon: Target,
    },
    {
      id: 'forecast',
      label: 'Marketing Forecast',
      icon: Megaphone,
    },
  ];

  const secondaryNavItems = [
    {
      id: 'house-types',
      label: 'Master Tipe Rumah',
      icon: Home,
    },
    {
      id: 'reports',
      label: 'Laporan & Export',
      icon: FileSpreadsheet,
    },
    {
      id: 'settings',
      label: 'Pengaturan & Backup',
      icon: Settings,
    },
  ];

  const getRoleBadgeLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'manager_sales':
        return 'Manager Sales';
      case 'sales':
        return 'Sales Executive';
      case 'marketing':
        return 'Marketing';
      default:
        return role;
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-white border-r border-slate-200/90 transition-all duration-300 flex flex-col no-print ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              A
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-[17px] text-emerald-900 leading-tight tracking-tight truncate">
                CRM & Sales Desk
              </h1>
              <p className="text-[10px] font-semibold text-emerald-700/80 tracking-wider uppercase truncate">
                Amaya Home Resort
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            A
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title={collapsed ? 'Perluas Sidebar' : 'Perkecil Sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 relative ${
                  isActive
                    ? 'bg-[#127144] text-white shadow-sm shadow-emerald-900/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  size={20}
                  className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`}
                />
                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!collapsed && item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono tabular-nums ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="pt-4 pb-2">
          {!collapsed && (
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Master & Laporan
            </p>
          )}
          <hr className="my-2 border-slate-100" />
        </div>

        <div className="space-y-1">
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-[#127144] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  size={19}
                  className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}
                />
                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/70">
        <button
          onClick={onOpenUserModal}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-200 text-left"
          title="Klik untuk ganti pengguna / role"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-300">
            {currentUser.name.charAt(0)}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                {currentUser.role === 'super_admin' ? (
                  <ShieldCheck size={12} />
                ) : (
                  <UserCheck size={12} />
                )}
                <span className="truncate">{getRoleBadgeLabel(currentUser.role)}</span>
              </div>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
