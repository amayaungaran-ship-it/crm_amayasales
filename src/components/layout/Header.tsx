import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Bell,
  ChevronDown,
  Plus,
  Check,
  Building,
  User,
  FileSpreadsheet,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { TimePeriodFilter } from '../../types';

interface HeaderProps {
  currentTab: string;
  onOpenAddLeadModal: () => void;
  onOpenAddClosingModal: () => void;
  onOpenAddEventModal: () => void;
  onOpenUserModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenAddLeadModal,
  onOpenAddClosingModal,
  onOpenAddEventModal,
  onOpenUserModal,
}) => {
  const {
    periodFilter,
    setPeriodFilter,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    currentUser,
  } = useCrm();

  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const periodRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const periodOptions: TimePeriodFilter[] = [
    'Semua periode',
    'Hari Ini',
    'Minggu Ini',
    'Bulan Ini',
    'Bulan Sebelumnya',
    'Tahun Ini',
    'Custom Date Range',
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (periodRef.current && !periodRef.current.contains(event.target as Node)) {
        setPeriodDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'leads':
        return 'Leads';
      case 'prospecting':
        return 'Prospecting';
      case 'closing':
        return 'Closing Transaksi';
      case 'calendar':
        return 'Calendar Event';
      case 'visit-instansi':
        return 'Visit Instansi (B2B)';
      case 'kpi':
        return 'KPI Target Sales';
      case 'forecast':
        return 'Marketing Forecast';
      case 'house-types':
        return 'Master Tipe Rumah';
      case 'reports':
        return 'Laporan & Export';
      case 'settings':
        return 'Pengaturan Sistem & Database';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200/80 px-6 py-3.5 no-print">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Title and Period Subtitle */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {getTabTitle()}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Periode data:{' '}
            <span className="font-semibold text-emerald-800">{periodFilter}</span>
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Period Dropdown Button (styled exactly like screenshot) */}
          <div className="relative" ref={periodRef}>
            <button
              onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 px-3.5 py-2 rounded-xl text-sm font-medium shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <CalendarIcon size={16} className="text-slate-500" />
              <span>{periodFilter}</span>
              <ChevronDown size={15} className="text-slate-400 ml-1" />
            </button>

            {periodDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Pilih Periode
                </div>
                {periodOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setPeriodFilter(opt);
                      setPeriodDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-sm text-left hover:bg-emerald-50 transition-colors ${
                      periodFilter === opt
                        ? 'font-semibold text-emerald-800 bg-emerald-50/60'
                        : 'text-slate-700'
                    }`}
                  >
                    <span>{opt}</span>
                    {periodFilter === opt && <Check size={16} className="text-emerald-700" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              title="Notifikasi & Reminder"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-mono text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800">Pusat Notifikasi</span>
                    {unreadCount > 0 && (
                      <span className="bg-rose-100 text-rose-700 font-mono text-xs px-2 py-0.5 rounded-full font-semibold">
                        {unreadCount} baru
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
                    >
                      Tandai semua dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-400">
                      Tidak ada notifikasi saat ini
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => markNotificationAsRead(item.id)}
                        className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                          !item.isRead ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-slate-800">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Add Action Button */}
          {currentTab === 'closing' ? (
            <button
              onClick={onOpenAddClosingModal}
              className="flex items-center gap-2 bg-[#127144] hover:bg-[#0e5c36] text-white px-3.5 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus size={16} />
              <span>Input Closing</span>
            </button>
          ) : currentTab === 'calendar' ? (
            <button
              onClick={onOpenAddEventModal}
              className="flex items-center gap-2 bg-[#127144] hover:bg-[#0e5c36] text-white px-3.5 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus size={16} />
              <span>Entry Event Baru</span>
            </button>
          ) : (
            <button
              onClick={onOpenAddLeadModal}
              className="flex items-center gap-2 bg-[#127144] hover:bg-[#0e5c36] text-white px-3.5 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus size={16} />
              <span>Tambah Leads</span>
            </button>
          )}

          {/* User Button */}
          <button
            onClick={onOpenUserModal}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
            title="Ganti Pengguna"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
