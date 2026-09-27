import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Radio,
  Phone,
  Building2,
  CheckCircle2,
  AlertCircle,
  Send,
  MessageSquare,
  BadgeCheck,
  Sparkles,
} from 'lucide-react';
import { CHWProfile } from '../../types';
import { INITIAL_CHW_TEAM } from '../../data/mockData';

interface CHWTeamDirectoryProps {
  onSelectChwForFilter?: (chwName: string) => void;
}

export const CHWTeamDirectory: React.FC<CHWTeamDirectoryProps> = ({ onSelectChwForFilter }) => {
  const [teamList, setTeamList] = useState<CHWProfile[]>(INITIAL_CHW_TEAM);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setBroadcastMessage('');
    }, 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">
            Field Operations & Workforce Management
          </span>
          <h3 className="text-base font-extrabold text-white mt-0.5">
            Community Health Worker (CHW) Roster & QA Concordance
          </h3>
          <p className="text-xs text-slate-400">
            Monitor active field personnel, diagnostic precision concordance with supervisor audits, and test kit assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>4 Field Agents Active</span>
          </span>
        </div>
      </div>

      {/* CHW Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamList.map((chw) => (
          <div
            key={chw.id}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-rose-900/60 transition-all space-y-3"
          >
            {/* Top Row: Name, Status & ID */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#8B1E3F]/80 border border-rose-500/40 flex items-center justify-center font-bold text-white text-sm">
                  {chw.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm leading-tight">{chw.name}</h4>
                  <div className="text-[11px] font-mono text-slate-400">{chw.id}</div>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  chw.activeStatus === 'active' || chw.activeStatus === 'in_field'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {chw.activeStatus === 'in_field' ? 'In Field' : chw.activeStatus === 'active' ? 'Active' : 'Offline'}
              </span>
            </div>

            {/* Zone & Facility */}
            <div className="space-y-1 text-xs text-slate-300 border-t border-slate-900 pt-2">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Building2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate">{chw.facility}</span>
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                Zone: <strong className="text-slate-300 font-medium">{chw.zone}</strong>
              </div>
            </div>

            {/* Performance Matrix */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Screenings</span>
                <span className="text-sm font-extrabold text-white">{chw.totalScreenings}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">QA Concordance</span>
                <span className="text-sm font-extrabold text-emerald-400">{chw.accuracyScore}%</span>
              </div>
            </div>

            {/* Test Strip Lot Assignment */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-900 pt-2 font-mono">
              <span>Lot: <strong className="text-slate-200">{chw.assignedLotNumber}</strong></span>
              <span className="text-[10px] text-slate-500">Sync: {chw.lastActive}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast Directives to Field Force */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-rose-400" />
          <h4 className="text-xs font-bold text-white">
            Broadcast Supervisor Field Directive & Clinical Bulletins
          </h4>
        </div>

        <form onSubmit={handleSendBroadcast} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            placeholder="Type directive to push to all connected CHW Android tablets (e.g. Ensure sunlight calibration in Teiman)..."
            className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500 font-medium"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#8B1E3F] hover:bg-[#A3234B] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-rose-950"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch to Field</span>
          </button>
        </form>

        {broadcastSuccess && (
          <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Directive pushed instantly to 4 active CHW Android tablets via MQTT push stream!</span>
          </div>
        )}
      </div>
    </div>
  );
};
