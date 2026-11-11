import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Calendar,
  Filter,
  Download,
  CheckCircle,
  FileText,
  Building,
  TrendingUp,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import {
  formatRupiah,
  formatCompactRupiah,
  formatIndonesianDate,
  exportToCsv,
} from '../../utils/formatters';

export const ReportsView: React.FC = () => {
  const { leads, closings, followUps, events, instansiList, instansiVisits, kpiTargets } = useCrm();

  const [selectedReport, setSelectedReport] = useState<number>(1);
  const [filterStartDate, setFilterStartDate] = useState('2026-10-01');
  const [filterEndDate, setFilterEndDate] = useState('2026-11-30');
  const [filterPic, setFilterPic] = useState('all');

  const reportList = [
    { id: 1, title: 'Laporan Seluruh Data Leads', desc: 'Rekap database prospek konsumen masuk dan sumber channel' },
    { id: 2, title: 'Laporan Pipeline Prospecting', desc: 'Daftar konsumen Warm & Hot Prospect dengan potensi transaksi' },
    { id: 3, title: 'Laporan Aktivitas Follow-Up Sales', desc: 'Log komunikasi berkala, hasil respon, dan rencana tindak lanjut' },
    { id: 4, title: 'Laporan Transaksi Closing Unit', desc: 'Rincian transaksi unit deal, nomor unit, dan status akad' },
    { id: 5, title: 'Laporan Omzet Penjualan', desc: 'Perolehan nilai bruto transaksi dan komisi sales' },
    { id: 6, title: 'Laporan Performa Sales (Leaderboard)', desc: 'Pencapaian KPI individu dan efektivitas konversi' },
    { id: 7, title: 'Laporan Event & Promosi Marketing', desc: 'Realisasi pameran, gathering, open table, dan anggaran' },
    { id: 8, title: 'Laporan Visit Instansi (B2B)', desc: 'Kemitraan korporasi, kunjungan institusi, dan potensi pasar' },
    { id: 9, title: 'Laporan Pencapaian Target KPI', desc: 'Komparasi bulanan target vs realisasi 7 indikator' },
    { id: 10, title: 'Laporan Marketing Forecast', desc: 'Proyeksi omzet penjualan berbobot probabilitas' },
  ];

  // Export handler based on selected report
  const handleDownloadExcel = () => {
    const today = new Date().toISOString().slice(0, 10);

    if (selectedReport === 1) {
      const headers = ['Kode Leads', 'Tanggal', 'Nama', 'Kota', 'WhatsApp', 'Email', 'Minat Tipe', 'Budget', 'Cara Bayar', 'Sumber', 'PIC', 'Status'];
      const rows = leads.map((l) => [l.code, l.date, l.name, l.city, l.phone, l.email || '-', l.houseTypeInterest, l.budget, l.paymentMethodPreference, l.source, l.picName, l.status]);
      exportToCsv(`Amaya_Laporan_Seluruh_Leads_${today}`, headers, rows);
    } else if (selectedReport === 2) {
      const active = leads.filter((l) => l.status === 'Warm Prospect' || l.status === 'Hot Prospect');
      const headers = ['Kode', 'Tanggal', 'Nama', 'Status', 'Tipe Rumah', 'Budget', 'PIC', 'WhatsApp', 'Catatan'];
      const rows = active.map((l) => [l.code, l.date, l.name, l.status, l.houseTypeInterest, l.budget, l.picName, l.phone, l.notes || '-']);
      exportToCsv(`Amaya_Laporan_Prospecting_${today}`, headers, rows);
    } else if (selectedReport === 3) {
      const headers = ['Tanggal', 'Jam', 'Nama Konsumen', 'Metode', 'Respon Konsumen', 'Hasil Komunikasi', 'Rencana Lanjut', 'Sales PIC'];
      const rows = followUps.map((f) => [f.date, f.time, f.leadName || '-', f.method, f.consumerResponse, f.result, f.actionPlan, f.picName]);
      exportToCsv(`Amaya_Laporan_FollowUp_${today}`, headers, rows);
    } else if (selectedReport === 4 || selectedReport === 5) {
      const headers = ['Kode Closing', 'Tanggal', 'Nama Konsumen', 'No. WA', 'Tipe Unit', 'Nomor Kavling', 'Harga Net', 'Cara Bayar', 'Komisi', 'Status Transaksi', 'PIC'];
      const rows = closings.map((c) => [c.closingCode, c.closingDate, c.consumerName, c.phone, c.houseType, c.unitNumber, c.finalPrice, c.paymentMethod, c.commission, c.transactionStatus, c.picName]);
      exportToCsv(`Amaya_Laporan_Closing_Omzet_${today}`, headers, rows);
    } else if (selectedReport === 7) {
      const headers = ['Tanggal', 'Nama Kegiatan', 'Jenis', 'Lokasi', 'PIC', 'Target', 'Anggaran', 'Status'];
      const rows = events.map((e) => [e.date, e.title, e.eventType, e.location, e.picName, e.targetParticipants, e.budget, e.status]);
      exportToCsv(`Amaya_Laporan_Event_${today}`, headers, rows);
    } else if (selectedReport === 8) {
      const headers = ['Kode', 'Nama Instansi', 'Kategori', 'Kota', 'PIC Instansi', 'Telepon', 'Sales PJ', 'Status'];
      const rows = instansiList.map((i) => [i.code, i.name, i.category, i.city, i.picInstansi, i.phone, i.picSalesName, i.cooperationStatus]);
      exportToCsv(`Amaya_Laporan_B2B_Instansi_${today}`, headers, rows);
    } else {
      // General report
      const headers = ['Indikator', 'Nilai Realisasi', 'Keterangan'];
      const rows = [
        ['Total Database Leads', leads.length, 'Database calon pembeli'],
        ['Total Closing Transaksi', closings.length, 'Unit deal'],
        ['Total Omzet Closing', closings.reduce((s, c) => s + c.finalPrice, 0), 'Rupiah bruto'],
        ['Mitra B2B Terdaftar', instansiList.length, 'Perusahaan mitra'],
      ];
      exportToCsv(`Amaya_Laporan_Ringkasan_${today}`, headers, rows);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            <FileSpreadsheet size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Pusat Laporan & Export Data
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Amaya Home Resort · Ekspor Data Excel (.csv) & Cetak Format Laporan Resmi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleDownloadExcel}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-[#127144] hover:bg-[#0e5c36] text-white flex items-center gap-1.5 shadow-sm"
          >
            <Download size={15} />
            <span>Download Excel</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 shadow-2xs"
          >
            <Printer size={15} />
            <span>Cetak / Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* Grid: Left Report Selector, Right Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Menu List */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 lg:col-span-1 no-print">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-2 py-1">
            Pilih Format Laporan
          </span>

          <div className="space-y-1">
            {reportList.map((rep) => (
              <button
                key={rep.id}
                onClick={() => setSelectedReport(rep.id)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  selectedReport === rep.id
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-950 shadow-2xs'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{rep.title}</span>
                  {selectedReport === rep.id && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{rep.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Report Preview Sheet (Printable) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs lg:col-span-2 space-y-6">
          {/* Official Printable Header */}
          <div className="border-b-2 border-emerald-900 pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-emerald-900 tracking-tight">
                  AMAYA HOME RESORT
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Sales & Marketing Gallery · Jl. MT Haryono, Ungaran, Kabupaten Semarang
              </p>
              <h4 className="text-base font-bold text-slate-900 mt-3 uppercase tracking-tight">
                {reportList.find((r) => r.id === selectedReport)?.title}
              </h4>
            </div>

            <div className="text-right text-xs text-slate-500 font-mono">
              <p>Tanggal Cetak: {formatIndonesianDate(new Date().toISOString())}</p>
              <p>Status: Laporan Terverifikasi</p>
            </div>
          </div>

          {/* Quick Summary Preview Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Rincian Cuplikan Dokumen</span>
              <span className="font-mono">Total Data Terkait: {leads.length} record</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3">Parameter Laporan</th>
                    <th className="py-2.5 px-3 text-right">Nilai / Kuantitas</th>
                    <th className="py-2.5 px-3">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">Total Calon Konsumen (Leads)</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">1.742 leads</td>
                    <td className="py-2.5 px-3 text-slate-500">Database aktif pemasaran</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">Warm Prospect Terproses</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-700">16 orang</td>
                    <td className="py-2.5 px-3 text-slate-500">Dalam tahap follow-up intensif</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">Hot Prospect Siap Booking</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-700">4 orang</td>
                    <td className="py-2.5 px-3 text-slate-500">Potensi closing Rp 3.309.641.000</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">Transaksi Closing Sukses</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">2 unit</td>
                    <td className="py-2.5 px-3 text-slate-500">Nilai closing Rp 3.201.900.000</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">Kemitraan Instansi B2B</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">{instansiList.length} instansi</td>
                    <td className="py-2.5 px-3 text-slate-500">Kerja sama program perumahan</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Printable Signature Footnote */}
          <div className="pt-8 grid grid-cols-2 text-center text-xs text-slate-700">
            <div>
              <p className="text-slate-500 mb-12">Disiapkan Oleh:</p>
              <p className="font-bold border-t border-slate-300 pt-1 inline-block px-8">
                Sales & Marketing Desk
              </p>
            </div>
            <div>
              <p className="text-slate-500 mb-12">Mengetahui / Menyetujui:</p>
              <p className="font-bold border-t border-slate-300 pt-1 inline-block px-8">
                Manager Sales Amaya
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
