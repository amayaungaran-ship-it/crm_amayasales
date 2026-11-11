import React, { useState } from 'react';
import {
  Handshake,
  Plus,
  Receipt,
  FileText,
  Printer,
  FileSpreadsheet,
  Phone,
  Trash2,
  Edit2,
  Eye,
  CheckCircle,
  Building,
  User,
  ArrowUpRight,
  X,
  CreditCard,
  DollarSign,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { Closing, ClosingStatus, Lead } from '../../types';
import {
  formatRupiah,
  formatCompactRupiah,
  formatIndonesianDate,
  getClosingStatusBadgeStyle,
  exportToCsv,
} from '../../utils/formatters';

interface ClosingViewProps {
  onOpenAddModal: () => void;
  onOpenEditModal: (closing: Closing) => void;
}

export const ClosingView: React.FC<ClosingViewProps> = ({
  onOpenAddModal,
  onOpenEditModal,
}) => {
  const { closings, deleteClosing, updateClosing } = useCrm();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPic, setFilterPic] = useState<string>('all');
  const [selectedClosingDetail, setSelectedClosingDetail] = useState<Closing | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtered closings
  const filteredClosings = closings.filter((c) => {
    const matchSearch =
      searchQuery === '' ||
      c.consumerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.closingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.houseType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = filterStatus === 'all' || c.transactionStatus === filterStatus;
    const matchPic = filterPic === 'all' || c.picName.includes(filterPic);

    return matchSearch && matchStatus && matchPic;
  });

  // Calculate metrics
  const totalGrossOmzet = closings.reduce((sum, c) => sum + c.finalPrice, 0);
  const totalCommission = closings.reduce((sum, c) => sum + (c.commission || 0), 0);
  const avgTicket = closings.length > 0 ? totalGrossOmzet / closings.length : 0;

  // Export
  const handleExport = () => {
    const headers = [
      'Kode Closing',
      'Tanggal',
      'Nama Konsumen',
      'No. WhatsApp',
      'Tipe Rumah',
      'Nomor Unit',
      'Harga Unit (Rp)',
      'Diskon (Rp)',
      'Harga Bersih (Rp)',
      'Cara Bayar',
      'Booking Fee (Rp)',
      'PIC Sales',
      'Komisi (Rp)',
      'Status Transaksi',
      'Catatan',
    ];

    const rows = filteredClosings.map((c) => [
      c.closingCode,
      c.closingDate,
      c.consumerName,
      c.phone,
      c.houseType,
      c.unitNumber,
      c.unitPrice,
      c.discount,
      c.finalPrice,
      c.paymentMethod,
      c.bookingFee,
      c.picName,
      c.commission,
      c.transactionStatus,
      c.notes || '-',
    ]);

    exportToCsv(`Amaya_Closing_Transactions_${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 4 Closing Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Unit Closing</span>
            <Handshake size={18} className="text-emerald-700" />
          </div>
          <p className="text-3xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
            {closings.length}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">Unit properti terjual</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Omzet Closing</span>
            <Receipt size={18} className="text-emerald-700" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-900 mt-2 tabular-nums">
            {formatRupiah(totalGrossOmzet)}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Nilai bruto transaksi</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Komisi Sales</span>
            <DollarSign size={18} className="text-amber-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-900 mt-2 tabular-nums">
            {formatRupiah(totalCommission)}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Alokasi komisi tim sales</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Rata-Rata Harga Tiket</span>
            <Building size={18} className="text-slate-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-2 tabular-nums">
            {formatCompactRupiah(avgTicket)}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Rata-rata per unit</span>
        </div>
      </div>

      {/* Action and Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Cari transaksi closing, nama konsumen, nomor unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleExport}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <FileSpreadsheet size={15} className="text-emerald-700" />
              <span>Export Closing</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#127144] hover:bg-[#0e5c36] text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus size={16} />
              <span>+ Input Transaksi Closing</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="all">Semua Status Transaksi</option>
              <option value="Booking">Booking</option>
              <option value="Tanda Jadi">Tanda Jadi</option>
              <option value="Berkas KPR">Berkas KPR</option>
              <option value="Akad">Akad</option>
              <option value="Lunas">Lunas</option>
              <option value="Batal">Batal</option>
            </select>
          </div>
          <div>
            <select
              value={filterPic}
              onChange={(e) => setFilterPic(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="all">Semua Sales PIC</option>
              <option value="Senja">Senja</option>
              <option value="Eka">Eka</option>
              <option value="Hendra">Hendra</option>
            </select>
          </div>
        </div>
      </div>

      {/* Closing Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="font-bold text-sm text-slate-800">
            Daftar Transaksi Closing Amaya Home Resort
          </span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono tabular-nums">
            {filteredClosings.length} transaksi
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200/80 font-semibold tracking-wider uppercase text-[11px]">
                <th className="py-3 px-3.5">Kode Closing</th>
                <th className="py-3 px-3.5">Tanggal</th>
                <th className="py-3 px-3.5">Nama Konsumen</th>
                <th className="py-3 px-3.5">Tipe & Unit</th>
                <th className="py-3 px-3.5 text-right">Harga Bersih</th>
                <th className="py-3 px-3.5">Cara Bayar</th>
                <th className="py-3 px-3.5">Sales / PIC</th>
                <th className="py-3 px-3.5 text-right">Komisi</th>
                <th className="py-3 px-3.5 text-center">Status</th>
                <th className="py-3 px-3.5 text-right no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredClosings.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    Belum ada transaksi closing pada kategori ini.
                  </td>
                </tr>
              ) : (
                filteredClosings.map((c) => {
                  const badgeClass = getClosingStatusBadgeStyle(c.transactionStatus);
                  return (
                    <tr key={c.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-3 px-3.5 font-mono font-semibold text-emerald-900 whitespace-nowrap">
                        {c.closingCode}
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap font-mono text-slate-500">
                        {formatIndonesianDate(c.closingDate)}
                      </td>
                      <td className="py-3 px-3.5">
                        <button
                          onClick={() => setSelectedClosingDetail(c)}
                          className="font-bold text-slate-900 hover:text-emerald-700 text-left transition-colors hover:underline block"
                        >
                          {c.consumerName}
                        </button>
                        <span className="text-[10px] text-slate-400 font-mono">{c.phone}</span>
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="font-semibold text-slate-900">{c.houseType}</span>
                        <div className="text-[10px] text-emerald-800 font-semibold">{c.unitNumber}</div>
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap font-mono font-bold text-slate-900">
                        {formatRupiah(c.finalPrice)}
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {c.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap font-semibold text-slate-800">
                        {c.picName}
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap font-mono font-semibold text-amber-800">
                        {formatRupiah(c.commission)}
                      </td>
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}`}>
                          {c.transactionStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap no-print">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedClosingDetail(c)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                            title="Lihat Detail Transaksi & Cetak SPK"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => onOpenEditModal(c)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50"
                            title="Edit Transaksi"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(c.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50"
                            title="Hapus Transaksi"
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
            <h4 className="text-base font-bold text-slate-900">Hapus Transaksi Closing</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin membatalkan/menghapus transaksi closing ini? Omzet dashboard dan pencapaian sales akan otomatis diperbarui.
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
                  deleteClosing(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-rose-600 text-white hover:bg-rose-700"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Closing Modal & Official SPK Printable Receipt */}
      {selectedClosingDetail && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  {selectedClosingDetail.closingCode}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Surat Pemesanan Rumah (SPK)
                </h3>
                <p className="text-xs text-slate-500">Amaya Home Resort Ungaran</p>
              </div>
              <button
                onClick={() => setSelectedClosingDetail(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* SPK Printable Details */}
            <div className="p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block font-medium">Nama Konsumen:</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedClosingDetail.consumerName}</p>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Nomor WhatsApp:</span>
                  <p className="font-mono font-semibold text-slate-800 mt-0.5">{selectedClosingDetail.phone}</p>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Unit Dipesan:</span>
                  <p className="font-bold text-emerald-900 mt-0.5">
                    Tipe {selectedClosingDetail.houseType} ({selectedClosingDetail.unitNumber})
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Tanggal Transaksi:</span>
                  <p className="font-mono font-semibold text-slate-800 mt-0.5">
                    {formatIndonesianDate(selectedClosingDetail.closingDate)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Harga Unit Pricelist:</span>
                  <p className="font-mono text-slate-700 mt-0.5">{formatRupiah(selectedClosingDetail.unitPrice)}</p>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Diskon Khusus:</span>
                  <p className="font-mono text-rose-700 font-semibold mt-0.5">
                    - {formatRupiah(selectedClosingDetail.discount)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Harga Bersih Kesepakatan:</span>
                  <p className="font-mono text-base font-bold text-emerald-800 mt-0.5">
                    {formatRupiah(selectedClosingDetail.finalPrice)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Booking Fee (Tanda Jadi):</span>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">
                    {formatRupiah(selectedClosingDetail.bookingFee)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Metode Pembayaran:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedClosingDetail.paymentMethod}</p>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Sales Penanggung Jawab:</span>
                  <p className="font-semibold text-emerald-800 mt-0.5">{selectedClosingDetail.picName}</p>
                </div>
              </div>

              {selectedClosingDetail.notes && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-400 block font-medium">Catatan Transaksi:</span>
                  <p className="text-slate-700 mt-0.5 italic">{selectedClosingDetail.notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-900 text-white flex items-center gap-1.5 shadow-xs"
              >
                <Printer size={15} />
                <span>Cetak SPK / Bukti Transaksi</span>
              </button>
              <button
                onClick={() => setSelectedClosingDetail(null)}
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
