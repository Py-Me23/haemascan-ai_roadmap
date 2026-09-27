import React, { useState } from 'react';
import { Calendar, Download, TrendingUp, Users, CheckCircle, AlertTriangle, FileSpreadsheet, Share2 } from 'lucide-react';
import { LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface ReportsScreenProps {
  lang: LanguageCode;
  isWireframe?: boolean;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({
  lang,
  isWireframe,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [dateRange, setDateRange] = useState('01 May 2026 - 20 May 2026');
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  if (isWireframe) {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-200 p-4 font-mono text-xs select-none">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-3">
          <span className="font-bold text-slate-100">[REPORTS_AGGREGATE]</span>
          <span className="text-[10px] text-slate-500">DISTRICT_ANALYTICS</span>
        </div>

        {/* Date Filter */}
        <div className="p-2 border border-slate-700 rounded bg-slate-950/40 text-center mb-3 text-[10px] text-slate-300">
          DATE_RANGE: [{dateRange}] ▼
        </div>

        {/* Key Metrics Grid */}
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {/* Total Screened */}
          <div className="p-3 border border-slate-700 rounded bg-slate-950/30 flex justify-between items-center">
            <div>
              <div className="text-[10px] text-slate-400">TOTAL_SCREENED</div>
              <div className="text-2xl font-bold text-slate-100">128</div>
            </div>
            <span className="text-[10px] text-slate-500">[LAYER 1]</span>
          </div>

          {/* Screen Positive */}
          <div className="p-3 border-2 border-rose-500/70 rounded bg-rose-950/30 flex justify-between items-center">
            <div>
              <div className="text-[10px] text-rose-300">SCREEN_POSITIVE</div>
              <div className="text-2xl font-bold text-rose-400">52 (40.6%)</div>
            </div>
            <span className="text-[10px] text-rose-300">[PALLOR+]</span>
          </div>

          {/* Likely Iron Deficiency */}
          <div className="p-3 border-2 border-emerald-500/70 rounded bg-emerald-950/30 flex justify-between items-center">
            <div>
              <div className="text-[10px] text-emerald-300">LIKELY_IRON_DEFICIENCY</div>
              <div className="text-2xl font-bold text-emerald-400">33 (63.5%)</div>
            </div>
            <span className="text-[10px] text-emerald-300">[BIOSENSE Fe↓]</span>
          </div>

          {/* Referred */}
          <div className="p-3 border border-amber-500/70 rounded bg-amber-950/30 flex justify-between items-center">
            <div>
              <div className="text-[10px] text-amber-300">REFERRED_HOSPITAL</div>
              <div className="text-2xl font-bold text-amber-400">7 (13.5%)</div>
            </div>
            <span className="text-[10px] text-amber-300">[SEVERE/CRP↑]</span>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-slate-800">
          <button
            onClick={handleExport}
            className="w-full h-12 border-2 border-rose-500 bg-rose-950/50 text-rose-200 font-bold rounded-xl flex items-center justify-center"
          >
            [ EXPORT_REPORT.CSV ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 select-none">
      {/* Header matching screenshot */}
      <div className="px-4 py-3 bg-white border-b border-slate-100 flex justify-between items-center">
        <h1 className="text-base font-extrabold text-slate-900">{t.reports}</h1>
        <div className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          DHIMS2 Sync Ready
        </div>
      </div>

      {/* Date Dropdown matching Screenshot */}
      <div className="p-4 bg-white border-b border-slate-100">
        <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{dateRange}</span>
          </div>
          <span className="text-[10px] text-slate-400">▼</span>
        </div>
      </div>

      {/* Main Metric Cards matching Screenshot */}
      <div className="flex-1 px-4 py-3.5 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-3">
          {/* Total Screened & Screen Positive Hero Row */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-slate-500">{t.totalScreened}</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">128</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Pantang Sub-District</div>
              </div>

              <div className="border-l border-slate-100 pl-4">
                <div className="text-xs font-medium text-[#8B1E3F]">{t.screenPositive}</div>
                <div className="text-3xl font-extrabold text-[#8B1E3F] mt-1">
                  52 <span className="text-sm font-semibold text-slate-500">(40.6%)</span>
                </div>
                <div className="text-[10px] text-[#8B1E3F] font-medium mt-0.5">Stratified to Layer 2</div>
              </div>
            </div>
          </div>

          {/* Likely Iron Deficiency Card matching Screenshot */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-bold text-emerald-800">
                  {t.likelyIronDeficiency}
                </div>
                <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                  33 <span className="text-sm font-semibold text-slate-500">(63.5%)</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Confirmed IDA • Iron Supplement Protocol Initiated
                </div>
              </div>

              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* Referred Card matching Screenshot */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-bold text-rose-800">{t.referred}</div>
                <div className="text-2xl font-extrabold text-rose-600 mt-1">
                  7 <span className="text-sm font-semibold text-slate-500">(13.5%)</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Severe Pallor (Hb &lt; 7.0) / High CRP Infection
                </div>
              </div>

              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            </div>
          </div>
        </div>

        {/* Export CTA matching Screenshot */}
        <div className="pt-4 mt-auto">
          <button
            id="btn-export-report"
            onClick={handleExport}
            className="w-full py-3.5 rounded-xl bg-[#8B1E3F] text-white font-bold text-sm shadow-md shadow-[#8B1E3F]/20 hover:bg-[#731833] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{exported ? '✓ Report Exported (CSV & PDF)' : t.exportReport}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
