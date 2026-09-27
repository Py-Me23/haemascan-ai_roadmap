import React, { useState } from 'react';
import { Globe, RefreshCw, Shield, QrCode, Cpu, User, HardDrive, CheckCircle2, ChevronRight, Wifi, WifiOff, Radio, Database } from 'lucide-react';
import { LanguageCode, LanguageOption } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../data/mockData';
import { TRANSLATIONS } from '../../data/translations';

interface SettingsScreenProps {
  lang: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  pendingSyncCount: number;
  onSyncNow: () => void;
  onNavigate?: (screen: any) => void;
  isWireframe?: boolean;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  lang,
  onSelectLanguage,
  isOnline,
  onToggleOnline,
  pendingSyncCount,
  onSyncNow,
  onNavigate,
  isWireframe,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [syncing, setSyncing] = useState(false);
  const [cassetteLot, setCassetteLot] = useState('BIO-26-8812');

  const handleManualSync = () => {
    setSyncing(true);
    setTimeout(() => {
      onSyncNow();
      setSyncing(false);
    }, 1200);
  };

  if (isWireframe) {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-200 p-4 font-mono text-xs select-none">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-3">
          <span className="font-bold text-slate-100">[SETTINGS_AND_SYNC]</span>
          <span className="text-[10px] text-slate-500">CONFIG</span>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {/* Sync Box */}
          <div className="p-3 border border-slate-700 rounded bg-slate-950/40">
            <div className="text-[10px] text-slate-400">OFFLINE_QUEUE: {pendingSyncCount} RECORDS</div>
            <button
              onClick={handleManualSync}
              className="mt-2 w-full py-1.5 border border-rose-500 rounded text-rose-300 text-center font-bold"
            >
              [ SYNC_NOW ]
            </button>
          </div>

          {/* Language Selector */}
          <div className="p-3 border border-slate-700 rounded bg-slate-950/20">
            <div className="text-[10px] text-slate-400 mb-1">LANGUAGE: [{lang.toUpperCase()}]</div>
            <div className="grid grid-cols-3 gap-1">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => onSelectLanguage(l.code)}
                  className={`py-1 text-[10px] rounded border ${
                    lang === l.code ? 'border-rose-400 bg-rose-950/60 font-bold' : 'border-slate-700'
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>

          {/* Test Kit Lot */}
          <div className="p-3 border border-slate-700 rounded text-[10px] text-slate-300">
            <div>CASSETTE_LOT: {cassetteLot}</div>
            <div className="text-slate-500 mt-1">CALIBRATION: 2026/08 ACTIVE</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 select-none">
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-slate-100 flex justify-between items-center">
        <h1 className="text-base font-extrabold text-slate-900">{t.settings}</h1>
        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
          v2.4.0 (GHS)
        </span>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {/* Offline Sync Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin text-[#8B1E3F]' : ''}`} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Offline Sync Queue</h3>
                <p className="text-[11px] text-slate-500">
                  {pendingSyncCount === 0
                    ? 'All patient records backed up to cloud'
                    : `${pendingSyncCount} screening records pending sync`}
                </p>
              </div>
            </div>

            <button
              onClick={onToggleOnline}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title="Toggle network connectivity"
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onNavigate && onNavigate('offline_queue')}
              className="py-2.5 px-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold hover:bg-amber-100 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 text-amber-700" />
              <span>Queue Manager ({pendingSyncCount})</span>
            </button>

            <button
              onClick={handleManualSync}
              disabled={syncing || pendingSyncCount === 0}
              className="py-2.5 px-2 rounded-xl bg-[#8B1E3F] text-white text-xs font-bold shadow-xs hover:bg-[#731833] disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        {/* Multi-language Selector (English, Twi, Dagbani, Ewe, French, Hausa) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#8B1E3F]" />
            <h3 className="text-xs font-bold text-slate-900">App Language (Dialect)</h3>
          </div>
          <p className="text-[11px] text-slate-500">
            Select regional language for community health worker field UI:
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => onSelectLanguage(l.code)}
                className={`py-2 px-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  lang === l.code
                    ? 'border-[#8B1E3F] bg-rose-50/70 text-[#8B1E3F] font-bold shadow-2xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>
                  <div className="text-xs">{l.name}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{l.nativeName}</div>
                </div>
                {lang === l.code && <CheckCircle2 className="w-4 h-4 text-[#8B1E3F]" />}
              </button>
            ))}
          </div>
        </div>

        {/* BioSense Cassette Batch Calibration */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-900">BioSense Kit Lot Calibration</h3>
          </div>
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <div className="font-mono font-bold text-slate-800">{cassetteLot}</div>
              <div className="text-[10px] text-slate-500">Ferritin cutoff: 30µg/L | CRP: 5mg/L</div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Calibrated
            </span>
          </div>
        </div>

        {/* CHW Profile & Facility binding */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-900">Field Worker Profile</h3>
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">CHW Name:</span>
              <span className="font-bold text-slate-800">Kofi Owusu (CHW-042)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Facility:</span>
              <span className="font-bold text-slate-800">Pantang Health Centre</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">District:</span>
              <span className="font-bold text-slate-800">Adentan Municipal District</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
