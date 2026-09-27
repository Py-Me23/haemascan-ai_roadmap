import React from 'react';
import {
  Users,
  Eye,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Boxes,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { Patient } from '../../types';

interface SupervisorKpiSummaryProps {
  patients: Patient[];
}

export const SupervisorKpiSummary: React.FC<SupervisorKpiSummaryProps> = ({ patients }) => {
  const totalScreened = patients.length;
  
  // Calculate Layer 1 stats
  const positiveL1 = patients.filter((p) => p.latestScreening?.layer1.isPositive).length;
  const positivityRate = totalScreened > 0 ? ((positiveL1 / totalScreened) * 100).toFixed(1) : '0.0';

  // Calculate Layer 2 stats
  const withLayer2 = patients.filter((p) => p.latestScreening?.layer2);
  const lowFerritinCount = withLayer2.filter((p) => p.latestScreening?.layer2?.ferritin === 'Low').length;
  const elevatedCrpCount = withLayer2.filter((p) => p.latestScreening?.layer2?.crp === 'Elevated').length;
  const idaPercentage = withLayer2.length > 0 ? ((lowFerritinCount / withLayer2.length) * 100).toFixed(1) : '0.0';

  // Severe / Referrals
  const referralsCount = patients.filter((p) => p.latestScreening?.recommendation.referralIndicated).length;
  const severeCount = patients.filter((p) => p.latestScreening?.layer1.severity === 'Severe').length;

  // QA Verification
  const verifiedCount = patients.filter(
    (p) => p.latestScreening?.supervisorReview?.status === 'verified'
  ).length;
  const pendingReviewCount = patients.filter(
    (p) => !p.latestScreening?.supervisorReview || p.latestScreening.supervisorReview.status === 'pending_review'
  ).length;
  const qaPercentage = totalScreened > 0 ? ((verifiedCount / totalScreened) * 100).toFixed(0) : '0';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: Total Screenings Centralized */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden group hover:border-rose-900/60 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Total Centralized Screenings</span>
          <div className="w-8 h-8 rounded-xl bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-[#8B1E3F]">
            <Users className="w-4 h-4 text-rose-400" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white tracking-tight">{totalScreened}</span>
          <span className="text-xs font-medium text-emerald-400 flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +18% this wk
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
          <span>Pregnant Mothers: <strong>{patients.filter((p) => p.isPregnant).length}</strong></span>
          <span className="text-slate-500">Across 5 Facilities</span>
        </div>
      </div>

      {/* Metric 2: Layer 1 Vision AI Positivity */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden group hover:border-amber-900/60 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Vision AI Positivity (Layer 1)</span>
          <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400">
            <Eye className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-amber-300 tracking-tight">{positivityRate}%</span>
          <span className="text-xs font-mono text-slate-400">({positiveL1}/{totalScreened})</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
          <span>BioSense Gated: <strong>{withLayer2.length} tests</strong></span>
          <span className="text-emerald-400 font-medium">60% finger-pricks saved</span>
        </div>
      </div>

      {/* Metric 3: Dual-Analyte Confirmed IDA */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden group hover:border-indigo-900/60 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Confirmed IDA (Low Ferritin)</span>
          <div className="w-8 h-8 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
            <Droplets className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-indigo-300 tracking-tight">{idaPercentage}%</span>
          <span className="text-xs text-slate-400">({lowFerritinCount} / {withLayer2.length})</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
          <span>Elevated CRP: <strong className="text-rose-300">{elevatedCrpCount} cases</strong></span>
          <span className="text-indigo-400">Inflammation Screened</span>
        </div>
      </div>

      {/* Metric 4: Urgent Referrals & QA Sign-off */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden group hover:border-emerald-900/60 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Urgent Referrals & QA Audit</span>
          <div className="w-8 h-8 rounded-xl bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-rose-400 tracking-tight">{referralsCount}</span>
          <span className="text-xs font-medium text-slate-400">Urgent Hospital Cases</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
          <span>Supervisor QA: <strong className="text-emerald-400">{qaPercentage}% Signed</strong></span>
          <span className="text-amber-400 font-mono font-bold">{pendingReviewCount} In Queue</span>
        </div>
      </div>
    </div>
  );
};
