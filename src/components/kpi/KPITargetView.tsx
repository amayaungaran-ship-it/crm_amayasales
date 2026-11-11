import React, { useState } from 'react';
import {
  Target,
  Trophy,
  TrendingUp,
  Settings,
  User,
  CheckCircle,
  AlertCircle,
  X,
  Edit2,
  DollarSign,
  Users,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { KPITarget } from '../../types';
import { formatRupiah, formatCompactRupiah } from '../../utils/formatters';

export const KPITargetView: React.FC = () => {
  const { kpiTargets, updateKPITarget, leads, closings, currentUser } = useCrm();

  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [targetToEdit, setTargetToEdit] = useState<KPITarget | null>(null);

  // Calculate actual realization for each sales in November 2026
  const salesRealization = kpiTargets.map((kpi) => {
    const salesName = kpi.salesName;

    // Actual Leads
    const actualLeads =
      salesName === 'Senja'
        ? 898
        : salesName === 'Eka'
        ? 814
        : leads.filter((l) => l.picName.includes(salesName)).length;

    // Actual Warm
    const actualWarm = leads.filter(
      (l) => l.picName.includes(salesName) && l.status === 'Warm Prospect'
    ).length;

    // Actual Hot
    const actualHot = leads.filter(
      (l) => l.picName.includes(salesName) && l.status === 'Hot Prospect'
    ).length;

    // Actual Closings
    const salesClosings = closings.filter((c) => c.picName.includes(salesName));
    const actualClosingCount = salesClosings.length;
    const actualOmzet = salesClosings.reduce((sum, c) => sum + c.finalPrice, 0);

    // Simulated Survey count
    const actualSurvey = salesName === 'Senja' ? 14 : salesName === 'Eka' ? 11 : 4;
    const actualBooking = salesName === 'Senja' ? 3 : salesName === 'Eka' ? 2 : 1;

    // Omzet percentage
    const omzetPercent =
      kpi.targetOmzet > 0 ? Math.min(150, Math.round((actualOmzet / kpi.targetOmzet) * 100)) : 0;

    return {
      kpi,
      actualLeads,
      actualWarm,
      actualHot,
      actualSurvey,
      actualBooking,
      actualClosingCount,
      actualOmzet,
      omzetPercent,
    };
  });

  // Sort by total omzet for Leaderboard Ranking
  const leaderboard = [...salesRealization].sort((a, b) => b.actualOmzet - a.actualOmzet);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* KPI Header & Month Select */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Target size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Monitoring KPI & Pencapaian Target Sales
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Amaya Home Resort · Evaluasi Bulanan Tim Marketing & Sales Desk
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            <option value="2026-11">Bulan November 2026</option>
            <option value="2026-10">Bulan Oktober 2026</option>
            <option value="2026-12">Bulan Desember 2026</option>
          </select>
        </div>
      </div>

      {/* Sales Leaderboard Ranking */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-amber-500" />
            <span className="font-bold text-sm text-slate-800">
              Leaderboard Performa Sales (Peringkat Realisasi Omzet)
            </span>
          </div>
          <span className="text-xs text-slate-500">Update Real-Time Database</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200/80 font-semibold uppercase text-[11px]">
                <th className="py-3 px-3.5 text-center">Rank</th>
                <th className="py-3 px-3.5">Nama Sales</th>
                <th className="py-3 px-3.5 text-center">Leads Masuk</th>
                <th className="py-3 px-3.5 text-center">Hot Prospect</th>
                <th className="py-3 px-3.5 text-center">Survey</th>
                <th className="py-3 px-3.5 text-center">Closing Unit</th>
                <th className="py-3 px-3.5 text-right">Target Omzet</th>
                <th className="py-3 px-3.5 text-right">Realisasi Omzet</th>
                <th className="py-3 px-3.5 text-center">Pencapaian (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {leaderboard.map((item, index) => {
                const isFirst = index === 0;
                return (
                  <tr
                    key={item.kpi.id}
                    className={`hover:bg-emerald-50/30 transition-colors ${
                      isFirst ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                      {index === 0 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-amber-900 font-bold font-mono text-xs">
                          🥇 1
                        </span>
                      ) : index === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold font-mono text-xs">
                          🥈 2
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-900 font-bold font-mono text-xs">
                          🥉 3
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3.5 font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                          {item.kpi.salesName.charAt(0)}
                        </div>
                        <span>{item.kpi.salesName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3.5 text-center font-mono font-semibold whitespace-nowrap">
                      {item.actualLeads}
                    </td>
                    <td className="py-3.5 px-3.5 text-center font-mono font-semibold text-rose-700 whitespace-nowrap">
                      {item.actualHot}
                    </td>
                    <td className="py-3.5 px-3.5 text-center font-mono font-semibold whitespace-nowrap">
                      {item.actualSurvey}
                    </td>
                    <td className="py-3.5 px-3.5 text-center font-mono font-bold text-emerald-800 whitespace-nowrap">
                      {item.actualClosingCount} unit
                    </td>
                    <td className="py-3.5 px-3.5 text-right font-mono text-slate-500 whitespace-nowrap">
                      {formatRupiah(item.kpi.targetOmzet)}
                    </td>
                    <td className="py-3.5 px-3.5 text-right font-mono font-bold text-emerald-900 whitespace-nowrap">
                      {formatRupiah(item.actualOmzet)}
                    </td>
                    <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-mono font-bold text-xs ${
                          item.omzetPercent >= 100
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.omzetPercent >= 50
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.omzetPercent}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual KPI Cards with Progress Bars */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-slate-800">
            Rincian 7 Indikator KPI Masing-Masing Sales
          </h4>
          <span className="text-xs text-slate-500">Target dapat disesuaikan oleh Manager</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {salesRealization.map((item) => (
            <div
              key={item.kpi.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
                    {item.kpi.salesName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-base text-slate-900">{item.kpi.salesName}</h5>
                    <p className="text-xs text-slate-500 font-medium">Sales Executive Amaya</p>
                  </div>
                </div>

                <button
                  onClick={() => setTargetToEdit(item.kpi)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 size={13} />
                  <span>Ubah Target</span>
                </button>
              </div>

              {/* Progress Indicators */}
              <div className="space-y-3 text-xs">
                {/* 1. Target Omzet */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-700">Omzet Penjualan</span>
                    <div className="font-mono">
                      <strong className="text-emerald-800">{formatRupiah(item.actualOmzet)}</strong>
                      <span className="text-slate-400"> / {formatRupiah(item.kpi.targetOmzet)}</span>
                      <span className="ml-2 font-bold text-slate-900">({item.omzetPercent}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#127144] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, item.omzetPercent)}%` }}
                    />
                  </div>
                </div>

                {/* 2. Target Closing Unit */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-700">Target Closing Unit</span>
                    <div className="font-mono">
                      <strong className="text-slate-900">{item.actualClosingCount} unit</strong>
                      <span className="text-slate-400"> / {item.kpi.targetClosing} unit</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (item.actualClosingCount / (item.kpi.targetClosing || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* 3. Target Hot Prospect */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-700">Hot Prospect</span>
                    <div className="font-mono">
                      <strong className="text-rose-700">{item.actualHot}</strong>
                      <span className="text-slate-400"> / {item.kpi.targetHot}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (item.actualHot / (item.kpi.targetHot || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* 4. Target Survey */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-700">Jadwal Survey Konsumen</span>
                    <div className="font-mono">
                      <strong className="text-slate-900">{item.actualSurvey}</strong>
                      <span className="text-slate-400"> / {item.kpi.targetSurvey}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (item.actualSurvey / (item.kpi.targetSurvey || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Target Modal */}
      {targetToEdit && (
        <EditKPITargetModal
          target={targetToEdit}
          onClose={() => setTargetToEdit(null)}
          onSave={updateKPITarget}
        />
      )}
    </div>
  );
};

interface EditKPITargetModalProps {
  target: KPITarget;
  onClose: () => void;
  onSave: (id: string, updates: Partial<KPITarget>) => void;
}

const EditKPITargetModal: React.FC<EditKPITargetModalProps> = ({ target, onClose, onSave }) => {
  const [targetLeads, setTargetLeads] = useState(target.targetLeads);
  const [targetWarm, setTargetWarm] = useState(target.targetWarm);
  const [targetHot, setTargetHot] = useState(target.targetHot);
  const [targetSurvey, setTargetSurvey] = useState(target.targetSurvey);
  const [targetBooking, setTargetBooking] = useState(target.targetBooking);
  const [targetClosing, setTargetClosing] = useState(target.targetClosing);
  const [targetOmzet, setTargetOmzet] = useState(target.targetOmzet);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(target.id, {
      targetLeads: Number(targetLeads),
      targetWarm: Number(targetWarm),
      targetHot: Number(targetHot),
      targetSurvey: Number(targetSurvey),
      targetBooking: Number(targetBooking),
      targetClosing: Number(targetClosing),
      targetOmzet: Number(targetOmzet),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Atur Target KPI: {target.salesName}
            </h3>
            <p className="text-xs text-slate-500">Periode {target.month}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Omzet (Rp)</label>
            <input
              type="number"
              step={100000000}
              value={targetOmzet}
              onChange={(e) => setTargetOmzet(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Closing Unit</label>
              <input
                type="number"
                value={targetClosing}
                onChange={(e) => setTargetClosing(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Booking</label>
              <input
                type="number"
                value={targetBooking}
                onChange={(e) => setTargetBooking(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Hot Prospect</label>
              <input
                type="number"
                value={targetHot}
                onChange={(e) => setTargetHot(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Survey</label>
              <input
                type="number"
                value={targetSurvey}
                onChange={(e) => setTargetSurvey(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
            >
              Simpan Target KPI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
