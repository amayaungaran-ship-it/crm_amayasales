import React, { useState } from 'react';
import {
  Users,
  Thermometer,
  Flame,
  Handshake,
  Receipt,
  Banknote,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { formatRupiah, formatCompactRupiah, formatIndonesianDate } from '../../utils/formatters';

interface DashboardViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenAddLeadModal: () => void;
  onOpenAddClosingModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onOpenAddLeadModal,
  onOpenAddClosingModal,
}) => {
  const { dashboardMetrics, activityLogs, leads, closings } = useCrm();
  const [hoveredDonutSegment, setHoveredDonutSegment] = useState<number | null>(null);

  // SVG Donut calculation for Funnel per Status
  const radius = 80;
  const strokeWidth = 34;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  const totalStatusCount = dashboardMetrics.leadsByStatus.reduce((acc, curr) => acc + curr.count, 0) || 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 6 Top Summary Cards (Exact screenshot color and layout) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Card 1: Total Leads */}
        <div
          onClick={() => onNavigateTab('leads')}
          className="bg-[#13715e] text-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center gap-2 text-emerald-100 text-xs font-medium">
            <Users size={16} className="text-emerald-200" />
            <span className="truncate">Total Leads</span>
          </div>
          <div className="mt-2.5">
            <h3 className="text-3xl font-bold font-mono tracking-tight tabular-nums">
              {dashboardMetrics.totalLeads.toLocaleString('id-ID')}
            </h3>
          </div>
          <div className="mt-1 flex items-center text-[11px] text-emerald-200/90 gap-1">
            <span>Calon konsumen</span>
            <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Card 2: Warm Prospect */}
        <div
          onClick={() => onNavigateTab('prospecting')}
          className="bg-[#13715e] text-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center gap-2 text-emerald-100 text-xs font-medium">
            <Thermometer size={16} className="text-emerald-200" />
            <span className="truncate">Warm Prospect</span>
          </div>
          <div className="mt-2.5">
            <h3 className="text-3xl font-bold font-mono tracking-tight tabular-nums">
              {dashboardMetrics.warmProspects}
            </h3>
          </div>
          <div className="mt-1 flex items-center text-[11px] text-emerald-200/90 gap-1">
            <span>Minat positif</span>
            <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Card 3: Hot Prospect */}
        <div
          onClick={() => onNavigateTab('prospecting')}
          className="bg-[#13715e] text-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center gap-2 text-emerald-100 text-xs font-medium">
            <Flame size={16} className="text-amber-300" />
            <span className="truncate">Hot Prospect</span>
          </div>
          <div className="mt-2.5">
            <h3 className="text-3xl font-bold font-mono tracking-tight tabular-nums">
              {dashboardMetrics.hotProspects}
            </h3>
          </div>
          <div className="mt-1 flex items-center text-[11px] text-emerald-200/90 gap-1">
            <span>Siap booking</span>
            <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Card 4: Closing */}
        <div
          onClick={() => onNavigateTab('closing')}
          className="bg-[#13715e] text-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center gap-2 text-emerald-100 text-xs font-medium">
            <Handshake size={16} className="text-emerald-200" />
            <span className="truncate">Closing</span>
          </div>
          <div className="mt-2.5">
            <h3 className="text-3xl font-bold font-mono tracking-tight tabular-nums">
              {dashboardMetrics.closingCount}
            </h3>
          </div>
          <div className="mt-1 flex items-center text-[11px] text-emerald-200/90 gap-1">
            <span>Unit terjual</span>
            <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Card 5: Nilai Closing */}
        <div
          onClick={() => onNavigateTab('closing')}
          className="bg-[#13715e] text-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center gap-2 text-emerald-100 text-xs font-medium">
            <Receipt size={16} className="text-emerald-200" />
            <span className="truncate">Nilai Closing</span>
          </div>
          <div className="mt-2.5">
            <h3 className="text-lg lg:text-xl font-bold font-mono tracking-tight leading-snug break-words">
              {formatRupiah(dashboardMetrics.closingValue)}
            </h3>
          </div>
          <div className="mt-1 flex items-center text-[11px] text-emerald-200/90 gap-1">
            <span>Omzet realisasi</span>
          </div>
        </div>

        {/* Card 6: Nominal Hot Prospect */}
        <div
          onClick={() => onNavigateTab('forecast')}
          className="bg-[#13715e] text-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center gap-2 text-emerald-100 text-xs font-medium">
            <Banknote size={16} className="text-amber-300" />
            <span className="truncate">Nominal Hot Prospect</span>
          </div>
          <div className="mt-2.5">
            <h3 className="text-lg lg:text-xl font-bold font-mono tracking-tight leading-snug break-words">
              {formatRupiah(dashboardMetrics.hotProspectValue)}
            </h3>
          </div>
          <div className="mt-1 flex items-center text-[11px] text-emerald-200/90 gap-1">
            <span>Potensi closing</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row: Funnel per Status & Leads per PIC */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel per Status (Donut Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Funnel per Status
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Total {dashboardMetrics.totalLeads.toLocaleString('id-ID')} leads
            </span>
          </div>

          <div className="flex flex-col items-center">
            {/* SVG Donut */}
            <div className="relative w-64 h-64 flex items-center justify-center my-2">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
                {/* Background Track */}
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth={strokeWidth}
                />
                {dashboardMetrics.leadsByStatus.map((seg, i) => {
                  const segRatio = seg.count / totalStatusCount;
                  const strokeDasharray = `${segRatio * circumference} ${circumference}`;
                  const strokeDashoffset = -accumulatedAngle;
                  accumulatedAngle += segRatio * circumference;

                  return (
                    <circle
                      key={seg.status}
                      cx="120"
                      cy="120"
                      r={radius}
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth={hoveredDonutSegment === i ? strokeWidth + 4 : strokeWidth}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="butt"
                      className="transition-all duration-200 cursor-pointer"
                      onMouseEnter={() => setHoveredDonutSegment(i)}
                      onMouseLeave={() => setHoveredDonutSegment(null)}
                    />
                  );
                })}
              </svg>

              {/* Donut Center Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                {hoveredDonutSegment !== null ? (
                  <div>
                    <span className="text-xs text-slate-500 font-medium">
                      {dashboardMetrics.leadsByStatus[hoveredDonutSegment].status}
                    </span>
                    <p className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                      {dashboardMetrics.leadsByStatus[hoveredDonutSegment].count.toLocaleString('id-ID')}
                    </p>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      {dashboardMetrics.leadsByStatus[hoveredDonutSegment].percentage}%
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                      Semua Leads
                    </span>
                    <p className="text-3xl font-bold font-mono text-slate-800 tabular-nums">
                      {dashboardMetrics.totalLeads.toLocaleString('id-ID')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Donut Legend (Matching Screenshot: Lead, Warm Prospect, Hot Prospect, Closing, Loss) */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 text-xs font-medium">
              {dashboardMetrics.leadsByStatus.map((seg, i) => (
                <div
                  key={seg.status}
                  onMouseEnter={() => setHoveredDonutSegment(i)}
                  onMouseLeave={() => setHoveredDonutSegment(null)}
                  className={`flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded-lg transition-colors ${
                    hoveredDonutSegment === i ? 'bg-slate-100 font-bold' : 'text-slate-700'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-xs shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span>{seg.status}</span>
                  <span className="font-mono text-slate-400 tabular-nums">({seg.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leads per PIC (Bar Chart) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Leads per PIC
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Komparasi performa sales
              </span>
            </div>

            {/* Custom Bar Chart Canvas (Matching Screenshot Y-Axis: 0, 250, 500, 750, 1000) */}
            <div className="mt-6 pt-4 pb-2">
              <div className="relative h-64 flex items-end">
                {/* Y-Axis Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-xs text-slate-400 font-mono">
                  <div className="border-b border-slate-100 w-full flex justify-between pb-0.5">
                    <span>1000</span>
                  </div>
                  <div className="border-b border-slate-100 w-full flex justify-between pb-0.5">
                    <span>750</span>
                  </div>
                  <div className="border-b border-slate-100 w-full flex justify-between pb-0.5">
                    <span>500</span>
                  </div>
                  <div className="border-b border-slate-100 w-full flex justify-between pb-0.5">
                    <span>250</span>
                  </div>
                  <div className="border-b border-slate-200 w-full flex justify-between pb-0.5">
                    <span>0</span>
                  </div>
                </div>

                {/* Bars Area */}
                <div className="relative w-full h-full flex items-end justify-around px-8 z-10">
                  {dashboardMetrics.leadsByPic.map((pic) => {
                    const maxVal = 1000;
                    const heightPercent = Math.min(100, Math.max(8, (pic.count / maxVal) * 100));

                    return (
                      <div
                        key={pic.picName}
                        className="flex flex-col items-center group relative w-24"
                      >
                        {/* Number on top of bar (styled like screenshot) */}
                        <span
                          className="text-base font-bold font-mono mb-2 transition-transform group-hover:-translate-y-1"
                          style={{ color: pic.color }}
                        >
                          {pic.count}
                        </span>

                        {/* Bar */}
                        <div
                          className="w-full rounded-t-lg transition-all duration-300 group-hover:brightness-110 shadow-xs"
                          style={{
                            height: `${heightPercent}%`,
                            backgroundColor: pic.color,
                          }}
                        />

                        {/* X-Axis Name */}
                        <span className="mt-3 text-sm font-semibold text-slate-700">
                          {pic.picName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary Footnote */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>PIC dengan kontribusi tertinggi: <strong className="text-slate-800">Senja (52.2%)</strong></span>
            <button
              onClick={() => onNavigateTab('kpi')}
              className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
            >
              Lihat Ranking KPI <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Second Row: Leads per Source & Aktivitas Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads per Source */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Leads per Source
            </h3>
            <span className="text-xs text-slate-500 font-medium">Asal channel</span>
          </div>

          <div className="space-y-3 mt-2">
            {dashboardMetrics.leadsBySource.map((src) => (
              <div key={src.source} className="group">
                <div className="flex items-center justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700 group-hover:text-emerald-800 transition-colors">
                    {src.source}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono">{src.percentage}%</span>
                    <span className="font-bold text-slate-900 font-mono tabular-nums">
                      {src.count}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#13715e] h-full rounded-full transition-all duration-500 group-hover:bg-emerald-600"
                    style={{ width: `${Math.max(2, src.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aktivitas Terbaru & Sales Pipeline */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-emerald-700" />
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Aktivitas Terbaru
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Log real-time operasional</span>
            </div>

            <div className="divide-y divide-slate-100">
              {activityLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="py-3 flex items-start gap-3 hover:bg-slate-50/60 rounded-xl px-2 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-100 mt-0.5">
                    {log.user.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{log.user}</span>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {log.action}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {log.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Akses cepat operasional Amaya:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAddLeadModal}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
              >
                <Plus size={14} /> + Leads Baru
              </button>
              <button
                onClick={() => onNavigateTab('prospecting')}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors flex items-center gap-1.5"
              >
                Follow-Up Hot Prospect
              </button>
              <button
                onClick={onOpenAddClosingModal}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Handshake size={14} /> Input Closing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
