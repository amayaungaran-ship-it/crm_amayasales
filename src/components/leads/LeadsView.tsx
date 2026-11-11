import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  FileSpreadsheet,
  Printer,
  Phone,
  Mail,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  Building,
  User,
  ArrowUpDown,
  MessageCircle,
  ExternalLink,
  X,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { Lead, LeadSource, LeadStatus } from '../../types';
import {
  formatRupiah,
  formatIndonesianDate,
  formatIndonesianDateTime,
  formatWhatsAppLink,
  getStatusBadgeStyle,
  exportToCsv,
} from '../../utils/formatters';

interface LeadsViewProps {
  onOpenAddModal: () => void;
  selectedLeadForDetail?: Lead | null;
  onSelectLeadForDetail: (lead: Lead | null) => void;
  onOpenEditModal: (lead: Lead) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  onOpenAddModal,
  selectedLeadForDetail,
  onSelectLeadForDetail,
  onOpenEditModal,
}) => {
  const { leads, houseTypes, users, deleteLead, updateLeadStatus, followUps, statusHistories } = useCrm();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterPic, setFilterPic] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchSearch =
        searchQuery === '' ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        lead.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSource = filterSource === 'all' || lead.source === filterSource;
      const matchPic = filterPic === 'all' || lead.picName.includes(filterPic);
      const matchType = filterType === 'all' || lead.houseTypeInterest === filterType;
      const matchStatus = filterStatus === 'all' || lead.status === filterStatus;

      return matchSearch && matchSource && matchPic && matchType && matchStatus;
    });
  }, [leads, searchQuery, filterSource, filterPic, filterType, filterStatus]);

  // Export to Excel / CSV
  const handleExportExcel = () => {
    const headers = [
      'Kode Leads',
      'Tanggal Masuk',
      'Nama Konsumen',
      'Kota',
      'WhatsApp',
      'Email',
      'Minat Tipe',
      'Budget (Rp)',
      'Cara Bayar',
      'Sumber Leads',
      'PIC Sales',
      'Status',
      'Catatan',
    ];

    const rows = filteredLeads.map((l) => [
      l.code,
      l.date,
      l.name,
      l.city,
      l.phone,
      l.email || '-',
      l.houseTypeInterest,
      l.budget,
      l.paymentMethodPreference,
      l.source,
      l.picName,
      l.status,
      l.notes || '-',
    ]);

    exportToCsv(`Amaya_Leads_Report_${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama konsumen, telepon, kode AHR, atau kota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <FileSpreadsheet size={15} className="text-emerald-700" />
              <span>Export Excel</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Printer size={15} className="text-slate-600" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#127144] hover:bg-[#0e5c36] text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus size={16} />
              <span>+ Tambah Leads</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* Source Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Sumber Leads
            </label>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">Semua Sumber</option>
              <option value="Meta Ads">Meta Ads</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Walk In">Walk In</option>
              <option value="Canvassing">Canvassing</option>
              <option value="Open Table">Open Table</option>
              <option value="Event">Event</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* PIC Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              PIC Sales
            </label>
            <select
              value={filterPic}
              onChange={(e) => setFilterPic(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">Semua PIC</option>
              <option value="Senja">Senja</option>
              <option value="Eka">Eka</option>
              <option value="Hendra">Hendra Setiawan</option>
              <option value="Rina">Rina Marketing</option>
            </select>
          </div>

          {/* House Type Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Tipe Rumah
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">Semua Tipe</option>
              {houseTypes.map((ht) => (
                <option key={ht.id} value={ht.name}>
                  {ht.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Status Leads
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">Semua Status</option>
              <option value="Lead">Lead</option>
              <option value="Warm Prospect">Warm Prospect</option>
              <option value="Hot Prospect">Hot Prospect</option>
              <option value="Closing">Closing</option>
              <option value="Loss">Loss</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-800">Daftar Data Calon Konsumen</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono tabular-nums">
              {filteredLeads.length} data ditampilkan
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200/80 font-semibold tracking-wider uppercase text-[11px]">
                <th className="py-3 px-3.5">Kode</th>
                <th className="py-3 px-3.5">Tanggal</th>
                <th className="py-3 px-3.5">Nama Konsumen</th>
                <th className="py-3 px-3.5">Kota</th>
                <th className="py-3 px-3.5">WhatsApp</th>
                <th className="py-3 px-3.5">Minat Tipe</th>
                <th className="py-3 px-3.5">Sumber</th>
                <th className="py-3 px-3.5">PIC</th>
                <th className="py-3 px-3.5 text-center">Status</th>
                <th className="py-3 px-3.5 text-right no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    Tidak ditemukan data leads yang sesuai filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const badge = getStatusBadgeStyle(lead.status);
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-emerald-50/30 transition-colors group"
                    >
                      {/* Kode */}
                      <td className="py-3 px-3.5 font-mono font-semibold text-emerald-900 whitespace-nowrap">
                        {lead.code}
                      </td>

                      {/* Tanggal */}
                      <td className="py-3 px-3.5 whitespace-nowrap text-slate-500 font-mono">
                        {formatIndonesianDate(lead.date)}
                      </td>

                      {/* Nama */}
                      <td className="py-3 px-3.5">
                        <button
                          onClick={() => onSelectLeadForDetail(lead)}
                          className="font-bold text-slate-900 hover:text-emerald-700 text-left transition-colors flex items-center gap-1 group-hover:underline"
                        >
                          <span>{lead.name}</span>
                        </button>
                        {lead.address && (
                          <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                            {lead.address}
                          </p>
                        )}
                      </td>

                      {/* Kota */}
                      <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap">
                        {lead.city}
                      </td>

                      {/* WhatsApp (Direct Link) */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <a
                          href={formatWhatsAppLink(lead.phone, lead.name, lead.houseTypeInterest)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono font-medium transition-colors"
                          title="Buka Chat WhatsApp"
                        >
                          <Phone size={13} className="text-emerald-600" />
                          <span>{lead.phone}</span>
                        </a>
                      </td>

                      {/* Minat Tipe */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="font-semibold text-slate-800">
                          {lead.houseTypeInterest}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {formatRupiah(lead.budget)}
                        </div>
                      </td>

                      {/* Sumber */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-[11px]">
                          {lead.source}
                        </span>
                      </td>

                      {/* PIC */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="font-semibold text-slate-800">{lead.picName}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          <span>{lead.status}</span>
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap no-print">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectLeadForDetail(lead)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            title="Lihat Detail Riwayat"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => onOpenEditModal(lead)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                            title="Edit Data Leads"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(lead.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            title="Hapus Leads"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <h4 className="text-base font-bold text-slate-900">
              Konfirmasi Hapus Leads
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus data calon konsumen ini? Data yang dihapus tidak dapat dipulihkan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteLead(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-rose-600 text-white hover:bg-rose-700"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedLeadForDetail && (
        <LeadDetailModal
          lead={selectedLeadForDetail}
          onClose={() => onSelectLeadForDetail(null)}
          onStatusChange={updateLeadStatus}
          followUps={followUps.filter((f) => f.leadId === selectedLeadForDetail.id)}
          statusHistories={statusHistories.filter((s) => s.leadId === selectedLeadForDetail.id)}
        />
      )}
    </div>
  );
};

// Sub-component: Lead Detail Modal with Communication and Follow-Up History
interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: LeadStatus) => void;
  followUps: any[];
  statusHistories: any[];
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onStatusChange,
  followUps,
  statusHistories,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'followup' | 'history'>('info');

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 to-[#127144] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-white/20 px-2 py-0.5 rounded-md font-semibold">
                {lead.code}
              </span>
              <span className="text-xs text-emerald-200">
                Terdaftar: {formatIndonesianDate(lead.date)}
              </span>
            </div>
            <h3 className="text-xl font-bold mt-1 tracking-tight">{lead.name}</h3>
            <p className="text-xs text-emerald-100 flex items-center gap-2 mt-0.5">
              <span>{lead.city}</span> · <span>Minat {lead.houseTypeInterest}</span> · <span>PIC: {lead.picName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 px-5 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'info'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Informasi Konsumen
          </button>
          <button
            onClick={() => setActiveTab('followup')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'followup'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Riwayat Follow-Up</span>
            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-mono text-[10px]">
              {followUps.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Histori Perubahan Status
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'info' && (
            <div className="space-y-4 text-xs">
              {/* Quick Status Bar */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-slate-500 block text-[11px]">Status Saat Ini:</span>
                  <span className="font-bold text-sm text-slate-900">{lead.status}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-500 mr-1">Ubah ke:</span>
                  {lead.status !== 'Warm Prospect' && (
                    <button
                      onClick={() => onStatusChange(lead.id, 'Warm Prospect')}
                      className="px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold border border-amber-200"
                    >
                      Warm
                    </button>
                  )}
                  {lead.status !== 'Hot Prospect' && (
                    <button
                      onClick={() => onStatusChange(lead.id, 'Hot Prospect')}
                      className="px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-900 font-semibold border border-rose-200"
                    >
                      Hot 🔥
                    </button>
                  )}
                  {lead.status !== 'Closing' && (
                    <button
                      onClick={() => onStatusChange(lead.id, 'Closing')}
                      className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold border border-emerald-200"
                    >
                      Closing
                    </button>
                  )}
                  {lead.status !== 'Loss' && (
                    <button
                      onClick={() => onStatusChange(lead.id, 'Loss')}
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                    >
                      Loss
                    </button>
                  )}
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-medium block">Nomor WhatsApp</label>
                  <a
                    href={formatWhatsAppLink(lead.phone, lead.name, lead.houseTypeInterest)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <MessageCircle size={14} />
                    <span>{lead.phone}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
                <div>
                  <label className="text-slate-400 font-medium block">Email</label>
                  <p className="font-semibold text-slate-800 mt-0.5">{lead.email || '-'}</p>
                </div>
                <div>
                  <label className="text-slate-400 font-medium block">Kota / Domisili</label>
                  <p className="font-semibold text-slate-800 mt-0.5">{lead.city}</p>
                </div>
                <div>
                  <label className="text-slate-400 font-medium block">Alamat Lengkap</label>
                  <p className="font-semibold text-slate-800 mt-0.5">{lead.address || '-'}</p>
                </div>
                <div>
                  <label className="text-slate-400 font-medium block">Minat Tipe Rumah</label>
                  <p className="font-bold text-slate-900 mt-0.5">{lead.houseTypeInterest}</p>
                </div>
                <div>
                  <label className="text-slate-400 font-medium block">Budget Pembelian</label>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">
                    {formatRupiah(lead.budget)}
                  </p>
                </div>
                <div>
                  <label className="text-slate-400 font-medium block">Rencana Cara Bayar</label>
                  <p className="font-semibold text-slate-800 mt-0.5">{lead.paymentMethodPreference}</p>
                </div>
                <div>
                  <label className="text-slate-400 font-medium block">Sumber Leads</label>
                  <p className="font-semibold text-slate-800 mt-0.5">{lead.source}</p>
                </div>
                <div>
                  <label className="text-slate-400 font-medium block">PIC Sales Amaya</label>
                  <p className="font-semibold text-emerald-800 mt-0.5">{lead.picName}</p>
                </div>
                <div>
                  <label className="text-slate-400 font-medium block">Jadwal Survey</label>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {lead.surveyScheduledDate ? formatIndonesianDate(lead.surveyScheduledDate) : 'Belum dijadwalkan'}
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-slate-400 font-medium block">Catatan Tambahan Sales</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed mt-1">
                  {lead.notes || 'Belum ada catatan sales.'}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'followup' && (
            <div className="space-y-3">
              {followUps.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada log follow-up untuk calon konsumen ini. Silakan catat follow-up melalui menu Prospecting.
                </div>
              ) : (
                followUps.map((fu) => (
                  <div key={fu.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{fu.method}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          {fu.consumerResponse}
                        </span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {formatIndonesianDate(fu.date)} {fu.time}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      Hasil: {fu.result}
                    </p>
                    <div className="pt-1 text-[11px] text-slate-500 border-t border-slate-200/60 flex items-center justify-between">
                      <span>Rencana: {fu.actionPlan}</span>
                      <span>Oleh: {fu.picName}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {statusHistories.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada catatan perpindahan status.
                </div>
              ) : (
                statusHistories.map((sh) => (
                  <div key={sh.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-start gap-3">
                    <Clock size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">
                          {sh.fromStatus} → <strong className="text-emerald-700">{sh.toStatus}</strong>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatIndonesianDateTime(sh.timestamp)}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">{sh.reason}</p>
                      <span className="text-[10px] text-slate-400">Oleh: {sh.changedBy}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <a
            href={formatWhatsAppLink(lead.phone, lead.name, lead.houseTypeInterest)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors"
          >
            <MessageCircle size={15} />
            <span>Chat WhatsApp Konsumen</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-white"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
