import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  UserCheck,
  Download,
  Upload,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Database,
  Users,
  Activity,
  Lock,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export const SettingsBackupView: React.FC = () => {
  const {
    currentUser,
    users,
    switchUser,
    exportBackupJson,
    importBackupJson,
    resetToDefaultData,
    activityLogs,
  } = useCrm();

  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleImport = () => {
    if (!importText.trim()) return;
    const success = importBackupJson(importText);
    if (success) {
      setImportStatus('Data berhasil dipulihkan dari cadangan JSON!');
      setImportText('');
    } else {
      setImportStatus('Format JSON tidak valid atau rusak!');
    }
    setTimeout(() => setImportStatus(null), 4000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackupJson(content);
      if (success) {
        setImportStatus('Data berhasil dipulihkan dari file JSON!');
      } else {
        setImportStatus('Format file cadangan tidak valid!');
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  const getRoleDesc = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Akses penuh ke semua modul, master data tipe rumah, pengaturan target KPI, manajemen user, dan ekspor seluruh laporan.';
      case 'manager_sales':
        return 'Memantau seluruh leads, aktivitas sales, closing transaksi, memonitor target dan KPI, serta evaluasi forecast.';
      case 'sales':
        return 'Mengelola leads & prospect yang ditugaskan, mencatat follow-up, membuat jadwal survey konsumen, dan melihat KPI pribadi.';
      case 'marketing':
        return 'Mengelola dan menganalisis performa channel sumber leads, event promosi pameran/gathering, dan laporan konversi.';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Settings size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Pengaturan Sistem, Hak Akses & Database
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Amaya Home Resort · Konfigurasi User Role dan Manajemen Cadangan Data
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Roles & Permissions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-emerald-700" />
              <h4 className="font-bold text-sm text-slate-900">
                Pengguna & Hak Akses (Role Simulator)
              </h4>
            </div>
            <span className="text-xs text-slate-400">Pilih profil untuk berganti peran</span>
          </div>

          <div className="space-y-2.5">
            {users.map((usr) => {
              const isActive = currentUser.id === usr.id;
              return (
                <div
                  key={usr.id}
                  onClick={() => switchUser(usr.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-2xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                        {usr.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-slate-900">{usr.name}</span>
                        <p className="text-[11px] text-slate-500">{usr.email}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {usr.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                    {getRoleDesc(usr.role)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Database Backup & Restore */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Database size={18} className="text-emerald-700" />
              <h4 className="font-bold text-sm text-slate-900">
                Cadangan & Pemulihan Database
              </h4>
            </div>
            <span className="text-xs text-slate-400">Penyimpanan Terpusat Real-Time</span>
          </div>

          {importStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-700 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}

          {/* Backup Download Button */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h5 className="font-bold text-xs text-slate-900">1. Unduh Cadangan (Backup JSON)</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ekspor seluruh database Amaya CRM (Leads, Prospecting, Closing, Kegiatan, Mitra B2B, Target KPI, Log Aktivitas) ke file JSON lokal Anda.
            </p>
            <button
              onClick={exportBackupJson}
              className="mt-2 px-4 py-2 text-xs font-bold rounded-xl bg-[#127144] hover:bg-[#0e5c36] text-white flex items-center gap-1.5 shadow-sm"
            >
              <Download size={15} />
              <span>Unduh File Cadangan JSON</span>
            </button>
          </div>

          {/* Restore / Import */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h5 className="font-bold text-xs text-slate-900">2. Pulihkan Data (Restore Backup)</h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pilih file JSON cadangan dari komputer Anda untuk memulihkan seluruh data operasional CRM:
            </p>
            <label className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs">
              <Upload size={15} className="text-emerald-700" />
              <span>Pilih File Backup JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Factory Reset */}
          <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200 space-y-2">
            <h5 className="font-bold text-xs text-rose-900">3. Reset ke Database Awal Proyek</h5>
            <p className="text-xs text-rose-800 leading-relaxed">
              Mengembalikan dataset ke kondisi awal referensi Amaya (1.742 leads, 16 warm, 4 hot prospect, 2 closing, dll).
            </p>
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200"
              >
                Reset Database ke Default
              </button>
            ) : (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-rose-800 font-bold">Yakin ingin reset?</span>
                <button
                  onClick={() => {
                    resetToDefaultData();
                    setShowResetConfirm(false);
                    setImportStatus('Database telah di-reset ke nilai default Amaya Home Resort!');
                    setTimeout(() => setImportStatus(null), 3000);
                  }}
                  className="px-3 py-1 text-xs font-bold rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                >
                  Ya, Reset Sekarang
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1 text-xs font-medium rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Audit Log */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-emerald-700" />
            <h4 className="font-bold text-sm text-slate-900">
              Audit Trail & Riwayat Aktivitas Sistem
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">50 Riwayat Terakhir</span>
        </div>

        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
          {activityLogs.map((log) => (
            <div key={log.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px] whitespace-nowrap">
                  {log.module}
                </span>
                <div>
                  <span className="font-bold text-slate-900">{log.user}: </span>
                  <span className="text-slate-600">{log.detail}</span>
                </div>
              </div>
              <span className="text-slate-400 font-mono text-[11px] whitespace-nowrap">
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
