import React, { useState } from 'react';
import {
  TrendingUp,
  Megaphone,
  DollarSign,
  PieChart,
  Calendar,
  Filter,
  ArrowUpRight,
  CheckCircle,
  Users,
  Flame,
  Thermometer,
  FileSpreadsheet,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { formatRupiah, formatCompactRupiah, exportToCsv } from '../../utils/formatters';

export const MarketingForecastView: React.FC = () => {
  const { leads, closings } = useCrm();

  const [groupBy, setGroupBy] = useState<'pic' | 'type' | 'month' | 'source'>('pic');

  // Filter active prospects (Hot & Warm)
  const activeProspects = leads.filter(
    (l) => l.status === 'Hot Prospect' || l.status === 'Warm Prospect'
  );

  // Compute probability based forecasting
  const forecastItems = activeProspects.map((lead) => {
    const isHot = lead.status === 'Hot Prospect';
    const probability = isHot ? 75 : 30; // 75% for Hot, 30% for Warm
    const estimatedValue = Math.round(lead.budget * (probability / 100));
    const targetMonth = isHot ? 'November 2026' : 'Desember 2026 / Q1 2027';

    return {
      lead,
      potentialValue: lead.budget,
      probability,
      estimatedValue,
      targetMonth,
    };
  });

  const totalForecastValue = forecastItems.reduce((sum, item) => sum + item.estimatedValue, 0);
  const totalPotentialGross = forecastItems.reduce((sum, item) => sum + item.potentialValue, 0);
  const realizedClosingValue = closings.reduce((sum, c) => sum + c.finalPrice, 0);

  // Conversion rate (Closed vs Total Leads)
  const conversionRate = Number(((closings.length / 1742) * 100).toFixed(2));

  // Monthly Forecast Chart Data (Simulated 6 Months Trend)
  const monthlyProjection = [
    { month: 'Okt 2026', realisasi: 1450000000, forecast: 1450000000 },
    { month: 'Nov 2026 (Ini)', realisasi: 3201900000, forecast: 4200000000 },
    { month: 'Des 2026', realisasi: 0, forecast: 4800000000 },
    { month: 'Jan 2027', realisasi: 0, forecast: 3600000000 },
    { month: 'Feb 2027', realisasi: 0, forecast: 4100000000 },
    { month: 'Mar 2027', realisasi: 0, forecast: 5500000000 },
  ];

  // Grouped aggregation
  const groupedSummary = () => {
    const map: Record<string, { potential: number; forecast: number; count: number }> = {};

    forecastItems.forEach((item) => {
      let key = '';
      if (groupBy === 'pic') key = item.lead.picName;
      else if (groupBy === 'type') key = item.lead.houseTypeInterest;
      else if (groupBy === 'month') key = item.targetMonth;
      else key = item.lead.source;

      if (!map[key]) map[key] = { potential: 0, forecast: 0, count: 0 };
      map[key].potential += item.potentialValue;
      map[key].forecast += item.estimatedValue;
      map[key].count += 1;
    });

    return Object.entries(map);
  };

  const handleExport = () => {
    const headers = [
      'Kode',
      'Nama Konsumen',
      'Status',
      'Tipe Rumah',
      'PIC Sales',
      'Nilai Potensi (Rp)',
      'Probabilitas (%)',
      'Estimasi Nilai Closing (Rp)',
      'Estimasi Bulan Closing',
    ];

    const rows = forecastItems.map((item) => [
      item.lead.code,
      item.lead.name,
      item.lead.status,
      item.lead.houseTypeInterest,
      item.lead.picName,
      item.potentialValue,
      item.probability,
      item.estimatedValue,
      item.targetMonth,
    ]);

    exportToCsv(`Amaya_Marketing_Forecast_${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 8 Top Forecast Metrics (as requested in spec #10) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-slate-500 text-xs font-semibold">1. Total Leads</span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">1.742</p>
          <span className="text-[11px] text-slate-400">Database aktif</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-slate-500 text-xs font-semibold">2. Warm Prospect</span>
          <p className="text-2xl font-bold font-mono text-amber-700 mt-1">16</p>
          <span className="text-[11px] text-amber-600">Probabilitas ~30%</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-slate-500 text-xs font-semibold">3. Hot Prospect</span>
          <p className="text-2xl font-bold font-mono text-rose-700 mt-1">4</p>
          <span className="text-[11px] text-rose-600">Probabilitas ~75%</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-slate-500 text-xs font-semibold">4. Jadwal Survey</span>
          <p className="text-2xl font-bold font-mono text-blue-700 mt-1">6</p>
          <span className="text-[11px] text-blue-600">Show unit minggu ini</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-slate-500 text-xs font-semibold">5. Potensi Closing</span>
          <p className="text-2xl font-bold font-mono text-emerald-800 mt-1">7 unit</p>
          <span className="text-[11px] text-slate-400">Estimasi pipeline</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-slate-500 text-xs font-semibold">6. Forecast Omzet</span>
          <p className="text-xl font-bold font-mono text-emerald-900 mt-1">
            {formatCompactRupiah(totalForecastValue)}
          </p>
          <span className="text-[11px] text-emerald-700">Weighted forecast</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-slate-500 text-xs font-semibold">7. Realisasi Closing</span>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1">
            {formatCompactRupiah(realizedClosingValue)}
          </p>
          <span className="text-[11px] text-slate-400">2 unit terealisasi</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-slate-500 text-xs font-semibold">8. Konversi Leads</span>
          <p className="text-2xl font-bold font-mono text-purple-700 mt-1">{conversionRate}%</p>
          <span className="text-[11px] text-slate-400">Lead ke closing deal</span>
        </div>
      </div>

      {/* Monthly Sales Forecast Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Grafik Proyeksi Penjualan & Forecast Omzet (6 Bulan Kedepan)
            </h3>
            <p className="text-xs text-slate-500">
              Perhitungan estimasi berbasis data prospect aktif dan tren konversi tim marketing
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#127144]" />
              <span>Realisasi Closing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-400" />
              <span>Forecast Proyeksi</span>
            </div>
          </div>
        </div>

        {/* Bar & Trend Chart Canvas */}
        <div className="relative h-64 flex items-end">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-xs text-slate-400 font-mono">
            <div className="border-b border-slate-100 w-full flex justify-between pb-0.5">
              <span>Rp 6 M</span>
            </div>
            <div className="border-b border-slate-100 w-full flex justify-between pb-0.5">
              <span>Rp 4.5 M</span>
            </div>
            <div className="border-b border-slate-100 w-full flex justify-between pb-0.5">
              <span>Rp 3 M</span>
            </div>
            <div className="border-b border-slate-100 w-full flex justify-between pb-0.5">
              <span>Rp 1.5 M</span>
            </div>
            <div className="border-b border-slate-200 w-full flex justify-between pb-0.5">
              <span>Rp 0</span>
            </div>
          </div>

          <div className="relative w-full h-full flex items-end justify-around px-4 z-10">
            {monthlyProjection.map((m) => {
              const maxVal = 6000000000;
              const realHeight = Math.min(100, (m.realisasi / maxVal) * 100);
              const forecastHeight = Math.min(100, (m.forecast / maxVal) * 100);

              return (
                <div key={m.month} className="flex flex-col items-center group w-20">
                  <div className="flex items-end gap-1.5 w-full justify-center h-48">
                    {/* Realization Bar */}
                    {m.realisasi > 0 && (
                      <div
                        className="w-5 bg-[#127144] rounded-t-md transition-all duration-300 group-hover:brightness-110"
                        style={{ height: `${realHeight}%` }}
                        title={`Realisasi: ${formatRupiah(m.realisasi)}`}
                      />
                    )}

                    {/* Forecast Bar */}
                    <div
                      className="w-5 bg-amber-400 rounded-t-md transition-all duration-300 group-hover:brightness-110"
                      style={{ height: `${forecastHeight}%` }}
                      title={`Forecast: ${formatRupiah(m.forecast)}`}
                    />
                  </div>

                  <span className="mt-3 text-xs font-semibold text-slate-700 whitespace-nowrap">
                    {m.month}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatCompactRupiah(m.forecast)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grouping & Detailed Forecast Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-sm text-slate-800">
              Rincian Estimasi Pipeline Penjualan Aktif
            </span>
            <p className="text-xs text-slate-500">
              Dihitung dari {activeProspects.length} prospect aktif (Hot & Warm)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Grouping Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <span className="text-slate-500 px-2 font-medium">Grup:</span>
              <button
                onClick={() => setGroupBy('pic')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  groupBy === 'pic' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Sales / PIC
              </button>
              <button
                onClick={() => setGroupBy('type')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  groupBy === 'type' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Tipe Rumah
              </button>
              <button
                onClick={() => setGroupBy('month')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  groupBy === 'month' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Bulan
              </button>
            </div>

            <button
              onClick={handleExport}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5"
            >
              <FileSpreadsheet size={14} className="text-emerald-700" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Group Breakdown Strip */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {groupedSummary().map(([groupName, val]) => (
            <div key={groupName} className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-700 block truncate">{groupName}</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-slate-400 text-[11px]">{val.count} prospect</span>
                <span className="font-bold font-mono text-emerald-900">
                  {formatCompactRupiah(val.forecast)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase text-[11px]">
                <th className="py-3 px-3.5">Kode</th>
                <th className="py-3 px-3.5">Nama Konsumen</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5">Tipe Rumah</th>
                <th className="py-3 px-3.5">Sales PIC</th>
                <th className="py-3 px-3.5 text-right">Potensi Transaksi</th>
                <th className="py-3 px-3.5 text-center">Probabilitas Closing</th>
                <th className="py-3 px-3.5 text-right">Estimasi Nilai Closing</th>
                <th className="py-3 px-3.5">Estimasi Bulan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {forecastItems.map((item) => (
                <tr key={item.lead.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="py-3.5 px-3.5 font-mono font-semibold text-emerald-900 whitespace-nowrap">
                    {item.lead.code}
                  </td>
                  <td className="py-3.5 px-3.5 font-bold text-slate-900 whitespace-nowrap">
                    {item.lead.name}
                  </td>
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        item.lead.status === 'Hot Prospect'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.lead.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3.5 font-semibold text-slate-800 whitespace-nowrap">
                    {item.lead.houseTypeInterest}
                  </td>
                  <td className="py-3.5 px-3.5 whitespace-nowrap">{item.lead.picName}</td>
                  <td className="py-3.5 px-3.5 text-right font-mono font-semibold text-slate-900 whitespace-nowrap">
                    {formatRupiah(item.potentialValue)}
                  </td>
                  <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                        item.probability >= 70
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.probability}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3.5 text-right font-mono font-bold text-emerald-900 whitespace-nowrap">
                    {formatRupiah(item.estimatedValue)}
                  </td>
                  <td className="py-3.5 px-3.5 whitespace-nowrap text-slate-600 font-medium">
                    {item.targetMonth}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
