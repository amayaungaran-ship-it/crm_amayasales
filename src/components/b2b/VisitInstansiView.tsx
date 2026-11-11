import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Phone,
  Calendar,
  Users,
  Eye,
  Edit2,
  Trash2,
  Send,
  X,
  MapPin,
  CheckCircle,
  Briefcase,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { Instansi, InstansiVisit, InstansiCategory, CooperationStatus } from '../../types';
import {
  formatIndonesianDate,
  formatWhatsAppLink,
  getCooperationStatusBadgeStyle,
} from '../../utils/formatters';

export const VisitInstansiView: React.FC = () => {
  const {
    instansiList,
    instansiVisits,
    addInstansi,
    updateInstansi,
    deleteInstansi,
    addInstansiVisit,
  } = useCrm();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modals
  const [isAddInstansiOpen, setIsAddInstansiOpen] = useState(false);
  const [selectedInstansiForVisit, setSelectedInstansiForVisit] = useState<Instansi | null>(null);
  const [selectedInstansiDetail, setSelectedInstansiDetail] = useState<Instansi | null>(null);

  // Form states for Visit
  const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0, 10));
  const [picMet, setPicMet] = useState('');
  const [salesPic, setSalesPic] = useState('Senja');
  const [objective, setObjective] = useState('');
  const [meetingResult, setMeetingResult] = useState('');
  const [potentialLeadsCount, setPotentialLeadsCount] = useState(10);
  const [actionPlan, setActionPlan] = useState('');
  const [nextVisitDate, setNextVisitDate] = useState('');

  // Form states for Add Instansi
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InstansiCategory>('Perusahaan Swasta');
  const [city, setCity] = useState('Semarang');
  const [picInstansi, setPicInstansi] = useState('');
  const [phone, setPhone] = useState('');
  const [picSalesName, setPicSalesName] = useState('Senja');
  const [cooperationStatus, setCooperationStatus] = useState<CooperationStatus>('Belum Dikunjungi');
  const [notes, setNotes] = useState('');
  const [potentialEmployees, setPotentialEmployees] = useState(500);

  // Filtered Instansi
  const filteredInstansi = instansiList.filter((ins) => {
    const matchSearch =
      searchQuery === '' ||
      ins.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.picInstansi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === 'all' || ins.category === filterCategory;
    const matchStat = filterStatus === 'all' || ins.cooperationStatus === filterStatus;
    return matchSearch && matchCat && matchStat;
  });

  const handleSaveVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInstansiForVisit || !meetingResult.trim()) return;

    addInstansiVisit({
      instansiId: selectedInstansiForVisit.id,
      instansiName: selectedInstansiForVisit.name,
      visitDate,
      picMet: picMet || selectedInstansiForVisit.picInstansi,
      salesPic,
      objective: objective || 'Sosialisasi Program Perumahan Amaya',
      meetingResult,
      potentialLeadsCount: Number(potentialLeadsCount),
      actionPlan: actionPlan || 'Follow-up proposal B2B',
      nextVisitDate: nextVisitDate || undefined,
    });

    setSelectedInstansiForVisit(null);
    setMeetingResult('');
    setObjective('');
    setActionPlan('');
  };

  const handleSaveInstansi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const picSalesId = picSalesName.includes('Senja') ? 'usr-3' : 'usr-4';

    addInstansi({
      name,
      category,
      city,
      picInstansi,
      phone,
      picSalesId,
      picSalesName,
      cooperationStatus,
      notes,
      potentialEmployees: Number(potentialEmployees),
    });

    setIsAddInstansiOpen(false);
    setName('');
    setPicInstansi('');
    setPhone('');
    setNotes('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-slate-500 text-xs font-semibold">Total Mitra Instansi</span>
          <p className="text-3xl font-bold font-mono text-slate-900 mt-2">{instansiList.length}</p>
          <span className="text-[11px] text-slate-500">Perusahaan & Lembaga</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-slate-500 text-xs font-semibold">Kunjungan Terlaksana</span>
          <p className="text-3xl font-bold font-mono text-emerald-800 mt-2">{instansiVisits.length}</p>
          <span className="text-[11px] text-emerald-700">Agenda visit & sosialisasi</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-slate-500 text-xs font-semibold">Kerja Sama Aktif / Negosiasi</span>
          <p className="text-3xl font-bold font-mono text-amber-700 mt-2">
            {instansiList.filter((i) => i.cooperationStatus.includes('Kerja Sama') || i.cooperationStatus.includes('Negosiasi')).length}
          </p>
          <span className="text-[11px] text-amber-700">Program corporate housing</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-slate-500 text-xs font-semibold">Total Potensi Karyawan</span>
          <p className="text-3xl font-bold font-mono text-slate-900 mt-2">
            {instansiList.reduce((sum, i) => sum + (i.potentialEmployees || 0), 0).toLocaleString('id-ID')}
          </p>
          <span className="text-[11px] text-slate-500">Target market B2B</span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama instansi, nama PIC, atau kota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddInstansiOpen(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#127144] hover:bg-[#0e5c36] text-white flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={16} />
              <span>+ Tambah Mitra Instansi</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="all">Semua Kategori</option>
              <option value="Perusahaan Swasta">Perusahaan Swasta</option>
              <option value="BUMN">BUMN</option>
              <option value="Bank / Finansial">Bank / Finansial</option>
              <option value="Rumah Sakit">Rumah Sakit</option>
              <option value="Instansi Pemerintah">Instansi Pemerintah</option>
            </select>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="all">Semua Status Kerja Sama</option>
              <option value="Belum Dikunjungi">Belum Dikunjungi</option>
              <option value="Sudah Dikunjungi">Sudah Dikunjungi</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Negosiasi Kerja Sama">Negosiasi Kerja Sama</option>
              <option value="Kerja Sama Aktif">Kerja Sama Aktif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Instansi Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="font-bold text-sm text-slate-800">Daftar Mitra B2B Amaya Home Resort</span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
            {filteredInstansi.length} instansi
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200/80 font-semibold uppercase text-[11px]">
                <th className="py-3 px-3.5">Kode</th>
                <th className="py-3 px-3.5">Nama Instansi / Lembaga</th>
                <th className="py-3 px-3.5">Kategori</th>
                <th className="py-3 px-3.5">Kota</th>
                <th className="py-3 px-3.5">PIC Instansi</th>
                <th className="py-3 px-3.5">Sales PJ</th>
                <th className="py-3 px-3.5 text-center">Status Kerja Sama</th>
                <th className="py-3 px-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInstansi.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada mitra instansi yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredInstansi.map((ins) => {
                  const badgeClass = getCooperationStatusBadgeStyle(ins.cooperationStatus);
                  return (
                    <tr key={ins.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-3.5 px-3.5 font-mono font-semibold text-emerald-900 whitespace-nowrap">
                        {ins.code}
                      </td>
                      <td className="py-3.5 px-3.5">
                        <button
                          onClick={() => setSelectedInstansiDetail(ins)}
                          className="font-bold text-slate-900 hover:text-emerald-700 text-left transition-colors hover:underline block"
                        >
                          {ins.name}
                        </button>
                        {ins.notes && (
                          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{ins.notes}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-3.5 whitespace-nowrap text-slate-600">
                        {ins.category}
                      </td>
                      <td className="py-3.5 px-3.5 whitespace-nowrap text-slate-600">
                        {ins.city}
                      </td>
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <span className="font-semibold text-slate-800">{ins.picInstansi}</span>
                        {ins.phone && (
                          <a
                            href={formatWhatsAppLink(ins.phone, ins.picInstansi)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-emerald-700 hover:underline block font-mono"
                          >
                            {ins.phone}
                          </a>
                        )}
                      </td>
                      <td className="py-3.5 px-3.5 whitespace-nowrap font-semibold text-slate-800">
                        {ins.picSalesName}
                      </td>
                      <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}`}>
                          {ins.cooperationStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedInstansiForVisit(ins);
                              setPicMet(ins.picInstansi);
                              setSalesPic(ins.picSalesName);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1 shadow-2xs"
                            title="Catat Kunjungan / Visit"
                          >
                            <Calendar size={13} />
                            <span>Catat Visit</span>
                          </button>
                          <button
                            onClick={() => setSelectedInstansiDetail(ins)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                            title="Lihat Histori Visit"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => deleteInstansi(ins.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50"
                            title="Hapus Mitra"
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

      {/* Record Visit Modal */}
      {selectedInstansiForVisit && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  {selectedInstansiForVisit.code}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Catat Kunjungan: {selectedInstansiForVisit.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInstansiForVisit(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveVisit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Kunjungan
                  </label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    PIC yang Ditemui
                  </label>
                  <input
                    type="text"
                    required
                    value={picMet}
                    onChange={(e) => setPicMet(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sales yang Bertugas
                  </label>
                  <select
                    value={salesPic}
                    onChange={(e) => setSalesPic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Senja">Senja</option>
                    <option value="Eka">Eka</option>
                    <option value="Hendra Setiawan">Hendra Setiawan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estimasi Potensi Leads
                  </label>
                  <input
                    type="number"
                    value={potentialLeadsCount}
                    onChange={(e) => setPotentialLeadsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tujuan Kunjungan
                </label>
                <input
                  type="text"
                  placeholder="Sosialisasi promo kredit B2B karyawan"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Hasil Pertemuan *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Karyawan tertarik dengan tipe Foresta dan Linea, pihak HRD menyetujui jadwal open booth..."
                  value={meetingResult}
                  onChange={(e) => setMeetingResult(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Rencana Tindak Lanjut
                  </label>
                  <input
                    type="text"
                    placeholder="Kirim materi penawaran"
                    value={actionPlan}
                    onChange={(e) => setActionPlan(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jadwal Kunjungan Berikutnya
                  </label>
                  <input
                    type="date"
                    value={nextVisitDate}
                    onChange={(e) => setNextVisitDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedInstansiForVisit(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Send size={14} />
                  <span>Simpan Laporan Visit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Instansi Modal */}
      {isAddInstansiOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Tambah Mitra Instansi (B2B) Baru
              </h3>
              <button onClick={() => setIsAddInstansiOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveInstansi} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Perusahaan / Lembaga / Instansi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Telkom Indonesia Regional IV"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori Instansi
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Perusahaan Swasta">Perusahaan Swasta</option>
                    <option value="BUMN">BUMN</option>
                    <option value="Instansi Pemerintah">Instansi Pemerintah</option>
                    <option value="Bank / Finansial">Bank / Finansial</option>
                    <option value="Rumah Sakit">Rumah Sakit</option>
                    <option value="Komunitas">Komunitas</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kota / Wilayah
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama PIC Instansi (HRD / Direksi)
                  </label>
                  <input
                    type="text"
                    placeholder="Bpk. Hendro (HR Manager)"
                    value={picInstansi}
                    onChange={(e) => setPicInstansi(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor Telepon / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="08123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sales Penanggung Jawab
                  </label>
                  <select
                    value={picSalesName}
                    onChange={(e) => setPicSalesName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Senja">Senja</option>
                    <option value="Eka">Eka</option>
                    <option value="Hendra Setiawan">Hendra Setiawan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Kerja Sama
                  </label>
                  <select
                    value={cooperationStatus}
                    onChange={(e) => setCooperationStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Belum Dikunjungi">Belum Dikunjungi</option>
                    <option value="Sudah Dikunjungi">Sudah Dikunjungi</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Negosiasi Kerja Sama">Negosiasi Kerja Sama</option>
                    <option value="Kerja Sama Aktif">Kerja Sama Aktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan Potensi & Keterangan Tambahan
                </label>
                <textarea
                  rows={2}
                  placeholder="Karyawan tetap 800 orang, subsidi perumahan perusahaan..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddInstansiOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-sm"
                >
                  Simpan Mitra B2B
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instansi Detail Modal with Visit History */}
      {selectedInstansiDetail && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  {selectedInstansiDetail.code}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedInstansiDetail.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedInstansiDetail.category} · {selectedInstansiDetail.city} · PIC Sales: {selectedInstansiDetail.picSalesName}
                </p>
              </div>
              <button
                onClick={() => setSelectedInstansiDetail(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Histori Kunjungan Tim Sales:
              </h4>

              {instansiVisits.filter((v) => v.instansiId === selectedInstansiDetail.id).length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                  Belum ada catatan kunjungan visit untuk instansi ini.
                </div>
              ) : (
                instansiVisits
                  .filter((v) => v.instansiId === selectedInstansiDetail.id)
                  .map((v) => (
                    <div key={v.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {formatIndonesianDate(v.visitDate)}
                        </span>
                        <span className="font-semibold text-emerald-800 font-mono">
                          +{v.potentialLeadsCount} Potensi Leads
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        <strong>Hasil:</strong> {v.meetingResult}
                      </p>
                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                        <span>PIC Ditemui: {v.picMet}</span>
                        <span>Sales: {v.salesPic}</span>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedInstansiDetail(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
