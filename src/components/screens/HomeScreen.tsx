import React from 'react';
import { UserCheck, RefreshCw, ChevronRight, Activity, ShieldCheck, WifiOff } from 'lucide-react';
import { LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface HomeScreenProps {
  lang: LanguageCode;
  onNavigate: (screen: any) => void;
  pendingSyncCount: number;
  isOnline: boolean;
  isWireframe?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  lang,
  onNavigate,
  pendingSyncCount,
  isOnline,
  isWireframe,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  if (isWireframe) {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-200 p-5 font-mono text-xs select-none">
        {/* Wireframe Header */}
        <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-slate-400 rounded-full flex items-center justify-center text-[10px]">
              💧
            </div>
            <span className="font-bold tracking-wider text-slate-100">HAEMASCAN_AI</span>
          </div>
          <div className="border border-slate-600 px-2 py-0.5 rounded text-[10px] text-slate-400">
            LANG: {lang.toUpperCase()}
          </div>
        </div>

        {/* Wireframe Center Logo & Title */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="w-14 h-14 border-2 border-dashed border-rose-400/70 rounded-full flex items-center justify-center mb-3">
            <span className="text-xl">🩸</span>
          </div>
          <h1 className="text-lg font-bold text-slate-100">[HaemaScan AI]</h1>
          <p className="text-[11px] text-slate-400">[Anemia Intelligence Platform]</p>
        </div>

        {/* Wireframe Primary Action */}
        <div className="space-y-3 my-auto">
          <button
            onClick={() => onNavigate('register_patient')}
            className="w-full h-14 border-2 border-rose-500 bg-rose-950/40 text-rose-200 rounded-xl flex items-center justify-center font-bold tracking-wide active:scale-[0.98]"
          >
            [ + {t.startNewScreening.toUpperCase()} ]
          </button>

          {/* Secondary Action 1 */}
          <button
            onClick={() => onNavigate('patient_list')}
            className="w-full h-12 border border-slate-600 bg-slate-800/60 rounded-xl flex items-center justify-between px-4 text-slate-300 active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <span>📋</span> [{t.patientRecords}]
            </span>
            <span>➔</span>
          </button>

          {/* Secondary Action 2 */}
          <button
            onClick={() => onNavigate('settings')}
            className="w-full h-12 border border-slate-600 bg-slate-800/60 rounded-xl flex items-center justify-between px-4 text-slate-300 active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <span>🔄</span> [{t.syncData}] {pendingSyncCount > 0 && `(${pendingSyncCount})`}
            </span>
            <span>➔</span>
          </button>
        </div>

        {/* Wireframe Quick Indicator */}
        <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
          <span>MODE: {isOnline ? 'ONLINE' : 'OFFLINE_FIRST'}</span>
          <span>QUEUE: {pendingSyncCount} REC</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 select-none overflow-y-auto">
      {/* Top Bar with Language Tag and Offline Badge */}
      <div className="px-5 pt-3 pb-2 flex justify-between items-center bg-white border-b border-slate-100">
        <button
          onClick={() => onNavigate('offline_queue')}
          className="flex items-center gap-1.5 active:scale-95 transition-all text-left"
          title="Open Offline Queue Manager"
        >
          {!isOnline && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
              <WifiOff className="w-3 h-3 text-amber-600" />
              {t.offlineReady}
            </span>
          )}
          {isOnline && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {t.synced}
            </span>
          )}
          {pendingSyncCount > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full animate-pulse border border-amber-300">
              <RefreshCw className="w-2.5 h-2.5 text-amber-700" />
              {pendingSyncCount} in Queue
            </span>
          )}
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 transition-all"
        >
          {lang.toUpperCase()}
        </button>
      </div>

      {/* Main Content Area matching the Hero App Screen */}
      <div className="flex-1 px-6 flex flex-col justify-between py-6">
        {/* Brand Icon and Header */}
        <div className="flex flex-col items-center text-center mt-2">
          {/* Animated Blood Droplet Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-50 to-[#8B1E3F]/10 border border-[#8B1E3F]/20 flex items-center justify-center shadow-sm mb-3">
            <svg
              viewBox="0 0 24 24"
              className="w-9 h-9 text-[#8B1E3F] fill-[#8B1E3F]"
              strokeWidth="0"
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            HaemaScan AI
          </h1>
          <p className="text-xs font-medium text-slate-500 tracking-wide mt-0.5">
            {t.tagline}
          </p>

          {/* Two Layer Pill */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-[11px] font-semibold text-[#8B1E3F]">
            <Activity className="w-3.5 h-3.5" />
            <span>Layer 1 Vision AI + Layer 2 BioSense</span>
          </div>
        </div>

        {/* Action Buttons Hub (Direct translation of infographic) */}
        <div className="space-y-3 my-auto w-full max-w-xs mx-auto">
          {/* Primary CTA: Start New Screening */}
          <button
            id="btn-start-new-screening"
            onClick={() => onNavigate('register_patient')}
            className="w-full py-4 px-5 rounded-2xl bg-[#8B1E3F] text-white font-bold text-base shadow-lg shadow-[#8B1E3F]/25 hover:bg-[#731833] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            <span>{t.startNewScreening}</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Secondary Button: Patient Records */}
          <button
            id="btn-patient-records"
            onClick={() => onNavigate('patient_list')}
            className="w-full py-3.5 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold text-sm shadow-xs hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <UserCheck className="w-4 h-4 text-slate-700" />
              </div>
              <span className="text-slate-800 text-sm font-medium">{t.patientRecords}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Secondary Button: Sync Data */}
          <button
            id="btn-sync-data"
            onClick={() => onNavigate('offline_queue')}
            className="w-full py-3.5 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold text-sm shadow-xs hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <RefreshCw className="w-4 h-4 text-slate-700" />
              </div>
              <span className="text-slate-800 text-sm font-medium">{t.syncData}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {pendingSyncCount > 0 && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {pendingSyncCount} pending
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </button>
        </div>

        {/* Bottom Feature Micro-Strip */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs text-[11px] text-slate-600 flex items-center justify-between">
          <div>
            <div className="font-semibold text-slate-800">Community Outreach</div>
            <div className="text-[10px] text-slate-500">Pantang Sub-District • CHW-042</div>
          </div>
          <button
            onClick={() => onNavigate('reports')}
            className="text-[11px] font-bold text-[#8B1E3F] hover:underline"
          >
            {t.reports} ➔
          </button>
        </div>
      </div>
    </div>
  );
};
