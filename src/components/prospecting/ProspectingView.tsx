import React, { useState, useMemo } from 'react';
import {
  Thermometer,
  Flame,
  Search,
  Plus,
  Phone,
  MessageCircle,
  Eye,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  User,
  ExternalLink,
  ChevronRight,
  X,
  Send,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { Lead, LeadStatus } from '../../types';
import {
  formatRupiah,
  formatIndonesianDate,
  formatIndonesianDateTime,
  formatWhatsAppLink,
  getStatusBadgeStyle,
} from '../../utils/formatters';

interface ProspectingViewProps {
  onOpenClosingModalWithLead: (lead: Lead) => void;
  onSelectLeadForDetail: (lead: Lead | null) => void;
}

export const ProspectingView: React.FC<ProspectingViewProps> = ({
  onOpenClosingModalWithLead,
  onSelectLeadForDetail,
}) => {
  const { leads, updateLeadStatus, addFollowUp, followUps, houseTypes } = useCrm();

  const [activeTab, setActiveTab] = useState<'warm' | 'hot'>('warm');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPic, setFilterPic] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterSource, setFilterSource] = useState('all');

  // Follow-up modal state
  const [followUpLead, setFollowUpLead] = useState<Lead | null>(null);
  const [followUpMethod, setFollowUpMethod] = useState<'WhatsApp' | 'Telepon' | 'Bertemu Langsung'>('WhatsApp');
  const [followUpResult, setFollowUpResult] = useState('');
  const [consumerResponse, setConsumerResponse] = useState<'Sangat Tertarik' | 'Tertarik' | 'Pikir-Pikir' | 'Belum Ada Respon' | 'Tidak Berminat'>('Sangat Tertarik');
  const [actionPlan, setActionPlan] = useState('');
  const [nextDate, setNextDate] = useState('');

  // Filtered Prospects
  const currentStatusTarget: LeadStatus = activeTab === 'warm' ? 'Warm Prospect' : 'Hot Prospect';

  const filteredProspects = useMemo(() => {
    return leads.filter((lead) => {
      if (lead.status !== currentStatusTarget) return false;

      const matchSearch =
        searchQuery === '' ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        lead.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchPic = filterPic === 'all' || lead.picName.includes(filterPic);
      const matchType = filterType === 'all' || lead.houseTypeInterest === filterType;
      const matchSource = filterSource === 'all' || lead.source === filterSource;

      return matchSearch && matchPic && matchType && matchSource;
    });
  }, [leads, currentStatusTarget, searchQuery, filterPic, filterType, filterSource]);

  // Count totals
  const warmCount = leads.filter((l) => l.status === 'Warm Prospect').length;
  const hotCount = leads.filter((l) => l.status === 'Hot Prospect').length;
  const hotTotalValue = leads
    .filter((l) => l.status === 'Hot Prospect')
    .reduce((sum, l) => sum + l.budget, 0);

  // Submit Follow-Up
  const handleSaveFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpLead || !followUpResult.trim()) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = now.toISOString().slice(0, 10);

    addFollowUp({
      leadId: followUpLead.id,
      leadCode: followUpLead.code,
      leadName: followUpLead.name,
      date: dateStr,
      time: timeStr,
      method: followUpMethod,
      result: followUpResult,
      consumerResponse,
      actionPlan: actionPlan || 'Follow-up berkala',
      nextFollowUpDate: nextDate || undefined,
      picName: followUpLead.picName,
    });

    setFollowUpLead(null);
    setFollowUpResult('');
    setActionPlan('');
    setNextDate('');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Alert Banner for Follow-Up Reminders */}
      <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 flex items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-800 shrink-0">
            <Clock size={18} />
          </div>
          <div>
            <span className="font-bold block text-sm">Pusat Jadwal Follow-Up Tim Sales</span>
            <span className="text-amber-700">
              Ada <strong>1 jadwal follow-up jatuh tempo hari ini</strong> (Bpk. Ir. Wisnu Wardhana - Hot Prospect Amaya Hook Blok A-03).
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            setActiveTab('hot');
            const target = leads.find((l) => l.code === 'AHR-1738');
            if (target) setFollowUpLead(target);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold whitespace-nowrap shadow-xs"
        >
          Follow-Up Sekarang
        </button>
      </div>

      {/* Main Tabs (WARM PROSPECT vs HOT PROSPECT as in reference screenshot) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-0.5">
        <button
          onClick={() => setActiveTab('warm')}
          className={`flex items-center gap-2.5 px-6 py-3 font-bold text-sm rounded-t-xl transition-all border-b-2 ${
            activeTab === 'warm'
              ? 'border-emerald-700 text-emerald-800 bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Thermometer size={18} className={activeTab === 'warm' ? 'text-amber-600' : 'text-slate-400'} />
          <span>WARM PROSPECT</span>
          <span
            className={`font-mono text-xs px-2 py-0.5 rounded-full ${
              activeTab === 'warm' ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {warmCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('hot')}
          className={`flex items-center gap-2.5 px-6 py-3 font-bold text-sm rounded-t-xl transition-all border-b-2 ${
            activeTab === 'hot'
              ? 'border-emerald-700 text-emerald-800 bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Flame size={18} className={activeTab === 'hot' ? 'text-rose-600' : 'text-slate-400'} />
          <span>HOT PROSPECT</span>
          <span
            className={`font-mono text-xs px-2 py-0.5 rounded-full ${
              activeTab === 'hot' ? 'bg-rose-100 text-rose-900 font-bold' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {hotCount}
          </span>
          <span className="text-[11px] font-mono text-emerald-700 font-semibold hidden md:inline">
            ({formatRupiah(hotTotalValue)})
          </span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama prospect, nomor WhatsApp, kota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            {/* Filter PIC */}
            <select
              value={filterPic}
              onChange={(e) => setFilterPic(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
            >
              <option value="all">Semua PIC</option>
              <option value="Senja">Senja</option>
              <option value="Eka">Eka</option>
              <option value="Hendra">Hendra</option>
            </select>

            {/* Filter Tipe */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
            >
              <option value="all">Semua Tipe</option>
              {houseTypes.map((ht) => (
                <option key={ht.id} value={ht.name}>
                  {ht.name}
                </option>
              ))}
            </select>

            {/* Filter Sumber */}
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
            >
              <option value="all">Semua Sumber</option>
              <option value="Meta Ads">Meta Ads</option>
              <option value="Instagram">Instagram</option>
              <option value="Website">Website</option>
              <option value="Walk In">Walk In</option>
              <option value="Referral">Referral</option>
            </select>
          </div>
        </div>
      </div>

      {/* Prospecting Table (Matching Screenshot Columns: Kode, Tanggal, Nama, Kota, Phone, Minat, PIC, Source, Status, Aksi) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-800">
              {activeTab === 'warm' ? 'Daftar Calon Konsumen Warm Prospect' : 'Daftar Calon Konsumen Hot Prospect'}
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono tabular-nums">
              {filteredProspects.length} prospect
            </span>
          </div>

          {activeTab === 'hot' && (
            <div className="text-xs text-slate-600">
              Total Potensi Transaksi:{' '}
              <strong className="text-emerald-800 font-mono">
                {formatRupiah(filteredProspects.reduce((sum, p) => sum + p.budget, 0))}
              </strong>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200/80 font-semibold tracking-wider uppercase text-[11px]">
                <th className="py-3 px-3.5">Kode</th>
                <th className="py-3 px-3.5">Tanggal</th>
                <th className="py-3 px-3.5">Nama Konsumen</th>
                <th className="py-3 px-3.5">Kota</th>
                <th className="py-3 px-3.5">Phone (WA)</th>
                <th className="py-3 px-3.5">Minat & Budget</th>
                <th className="py-3 px-3.5">PIC</th>
                <th className="py-3 px-3.5">Source</th>
                <th className="py-3 px-3.5 text-center">Status</th>
                <th className="py-3 px-3.5 text-right">Aksi Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProspects.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    Tidak ada calon konsumen pada kategori ini.
                  </td>
                </tr>
              ) : (
                filteredProspects.map((lead) => {
                  const badge = getStatusBadgeStyle(lead.status);
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-emerald-50/30 transition-colors group"
                    >
                      {/* Kode */}
                      <td className="py-3.5 px-3.5 font-mono font-semibold text-emerald-900 whitespace-nowrap">
                        {lead.code}
                      </td>

                      {/* Tanggal */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap font-mono text-slate-500">
                        {formatIndonesianDate(lead.date)}
                      </td>

                      {/* Nama */}
                      <td className="py-3.5 px-3.5">
                        <button
                          onClick={() => onSelectLeadForDetail(lead)}
                          className="font-bold text-slate-900 hover:text-emerald-700 text-left transition-colors group-hover:underline block"
                        >
                          {lead.name}
                        </button>
                        {lead.notes && (
                          <p className="text-[10px] text-slate-500 line-clamp-1 max-w-[220px] mt-0.5">
                            {lead.notes}
                          </p>
                        )}
                      </td>

                      {/* Kota */}
                      <td className="py-3.5 px-3.5 text-slate-600 whitespace-nowrap">
                        {lead.city}
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <a
                          href={formatWhatsAppLink(lead.phone, lead.name, lead.houseTypeInterest)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono font-medium transition-colors"
                        >
                          <Phone size={12} className="text-emerald-600" />
                          <span>{lead.phone}</span>
                        </a>
                      </td>

                      {/* Minat & Budget */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <span className="font-bold text-slate-900">{lead.houseTypeInterest}</span>
                        <div className="text-[10px] text-emerald-800 font-mono font-semibold">
                          {formatRupiah(lead.budget)}
                        </div>
                      </td>

                      {/* PIC */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap font-semibold text-slate-800">
                        {lead.picName}
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-[11px]">
                          {lead.source}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          <span>{lead.status}</span>
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Catat Follow-Up Button */}
                          <button
                            onClick={() => setFollowUpLead(lead)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1 shadow-2xs"
                            title="Catat Riwayat Follow-Up"
                          >
                            <MessageCircle size={13} />
                            <span>Follow-Up</span>
                          </button>

                          {/* Promote to Hot Prospect */}
                          {lead.status === 'Warm Prospect' && (
                            <button
                              onClick={() => updateLeadStatus(lead.id, 'Hot Prospect', 'Respon sangat positif, siap survey')}
                              className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200"
                              title="Promosikan ke Hot Prospect"
                            >
                              🔥 Hot
                            </button>
                          )}

                          {/* Direct Closing Action */}
                          <button
                            onClick={() => onOpenClosingModalWithLead(lead)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-2xs"
                            title="Buat Transaksi Closing Unit"
                          >
                            Closing
                          </button>

                          {/* Detail */}
                          <button
                            onClick={() => onSelectLeadForDetail(lead)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            title="Lihat Detail Riwayat"
                          >
                            <Eye size={15} />
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

      {/* Follow-Up Modal */}
      {followUpLead && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  {followUpLead.code}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Catat Follow-Up: {followUpLead.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Minat {followUpLead.houseTypeInterest} · PIC: {followUpLead.picName}
                </p>
              </div>
              <button
                onClick={() => setFollowUpLead(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveFollowUp} className="space-y-3.5 text-xs">
              {/* Communication Method */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Metode Komunikasi *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['WhatsApp', 'Telepon', 'Bertemu Langsung'] as const).map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setFollowUpMethod(m)}
                      className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                        followUpMethod === m
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Consumer Response */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Respon Calon Konsumen
                </label>
                <select
                  value={consumerResponse}
                  onChange={(e) => setConsumerResponse(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Sangat Tertarik">Sangat Tertarik (Siap survey / booking)</option>
                  <option value="Tertarik">Tertarik (Membutuhkan simulasi KPR)</option>
                  <option value="Pikir-Pikir">Pikir-Pikir (Diskusi keluarga)</option>
                  <option value="Belum Ada Respon">Belum Ada Respon (Pesan terkirim)</option>
                  <option value="Tidak Berminat">Tidak Berminat</option>
                </select>
              </div>

              {/* Follow-up Result */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Hasil Komunikasi / Pembicaraan *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Contoh: Konsumen menanyakan diskon khusus promo HUT, sudah dikirimkan pricelist tipe Linea. Berencana datang survey hari Sabtu..."
                  value={followUpResult}
                  onChange={(e) => setFollowUpResult(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Action Plan */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Rencana Tindak Lanjut
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Siapkan berkas KPR Mandiri dan booking show unit"
                  value={actionPlan}
                  onChange={(e) => setActionPlan(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Next Schedule */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Jadwal Follow-Up Berikutnya
                </label>
                <input
                  type="date"
                  value={nextDate}
                  onChange={(e) => setNextDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFollowUpLead(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Send size={14} />
                  <span>Simpan Catatan Follow-Up</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
