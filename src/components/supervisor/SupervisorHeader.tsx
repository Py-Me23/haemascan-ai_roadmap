import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Bell,
  RefreshCw,
  Lock,
  UserCheck,
  Download,
  Wifi,
  Sparkles,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

interface SupervisorHeaderProps {
  onSyncCentralStream: () => void;
  isSyncing: boolean;
  totalRecordsCount: number;
  unverifiedCount: number;
  onQuickSimulateIncomingTest: () => void;
  activeFacilityFilter: string;
  onSelectFacilityFilter: (facility: string) => void;
}

export const SupervisorHeader: React.FC<SupervisorHeaderProps> = ({
  onSyncCentralStream,
  isSyncing,
  totalRecordsCount,
  unverifiedCount,
  onQuickSimulateIncomingTest,
  activeFacilityFilter,
  onSelectFacilityFilter,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFacilityMenu, setShowFacilityMenu] = useState(false);

  const facilities = [
    'All Facilities (District-Wide)',
    'Pantang Health Centre',
    'Abokobi Health Post',
    'Danfa CHPS Compound',
    'Oyarifa Clinic',
    'Madina Polyclinic',
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
      {/* Top Banner Row: Administrative Identity & Live Connection Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B1E3F] to-rose-900 flex items-center justify-center shadow-lg shadow-rose-950/60 border border-rose-400/40 shrink-0">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                HaemaScan Centralized Supervisor Platform
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/90 text-amber-300 border border-amber-800/70 font-mono">
                <Lock className="w-3 h-3 text-amber-400" />
                ADMIN_ROLE: LEVEL-3 SUPERVISOR
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                <Wifi className="w-3 h-3" />
                GHS Central Stream Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Ministry of Health / Ghana Health Service (GHS) • Ga East Municipal Health Directorate
            </p>
          </div>
        </div>

        {/* Supervisor Profile Card & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* Incoming Packet Injector Demo Tool */}
          <button
            id="btn-simulate-incoming-test"
            onClick={onQuickSimulateIncomingTest}
            title="Simulate receiving a new screening packet from a field CHW tablet in real-time"
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Simulate Incoming Field Test</span>
          </button>

          {/* Sync Trigger */}
          <button
            id="btn-supervisor-sync"
            onClick={onSyncCentralStream}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl bg-[#8B1E3F] hover:bg-[#A3234B] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-rose-950/50 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Central Hub'}</span>
          </button>

          {/* Notification Badge */}
          <div className="relative">
            <button
              id="btn-supervisor-notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unverifiedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-slate-900 shadow-xs">
                  {unverifiedCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl z-50 text-xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">Supervisor Alerts & Action Items</span>
                  <span className="text-[10px] text-slate-400 font-mono">{unverifiedCount} Pending</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200">
                    <div className="font-bold flex items-center gap-1 text-[11px]">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      Critical Severe Case Escalation
                    </div>
                    <p className="text-[10px] text-rose-300/80 mt-0.5">
                      Patient Faustina Tetteh (Hb 5.9 g/dL, CRP+) requires emergency hospital bed confirmation at Ga East Municipal Hospital.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-amber-200">
                    <div className="font-bold text-[11px]">QA Audit Required</div>
                    <p className="text-[10px] text-amber-300/80 mt-0.5">
                      3 new Layer 1 + Layer 2 test packets await supervisor sign-off and clinical validation.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300">
                    <div className="font-bold text-[11px]">BioSense Lot Inventory Alert</div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Danfa CHPS Compound has 38 cassettes remaining (Below safety buffer of 50).
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Supervisor User Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="w-7 h-7 rounded-full bg-rose-900/60 border border-rose-500/40 flex items-center justify-center text-xs font-bold text-rose-200">
              KA
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-white leading-tight">Dr. Kwesi Appiah</div>
              <div className="text-[10px] text-slate-400 leading-tight">District Health Director / Lead Clinical Supervisor</div>
            </div>
          </div>
        </div>
      </div>

      {/* Facility Filter Bar & Quick Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Active Facility Scope Selector */}
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="text-slate-400 font-medium">Facility Jurisdiction:</span>
          <div className="relative">
            <button
              onClick={() => setShowFacilityMenu(!showFacilityMenu)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold border border-slate-800 flex items-center gap-2 transition-all"
            >
              <span>{activeFacilityFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showFacilityMenu && (
              <div className="absolute left-0 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-2xl p-1.5 shadow-2xl z-50 space-y-1">
                {facilities.map((fac) => (
                  <button
                    key={fac}
                    onClick={() => {
                      onSelectFacilityFilter(fac);
                      setShowFacilityMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeFacilityFilter === fac
                        ? 'bg-[#8B1E3F] text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {fac}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Central Sync Stream Meta */}
        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px]">Live WebSocket Stream • Latency 14ms</span>
          </div>
          <div className="text-[11px] font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
            Total Central Records: <strong className="text-rose-400">{totalRecordsCount}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
