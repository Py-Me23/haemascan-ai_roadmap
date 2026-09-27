import React, { useState } from 'react';
import {
  MapPin,
  TrendingUp,
  Activity,
  AlertTriangle,
  Users,
  Droplets,
  ShieldAlert,
  BarChart3,
  PieChart,
  Filter,
} from 'lucide-react';
import { Patient } from '../../types';

interface EpidemiologicalHeatmapProps {
  patients: Patient[];
}

export const EpidemiologicalHeatmap: React.FC<EpidemiologicalHeatmapProps> = ({ patients }) => {
  const [selectedCohort, setSelectedCohort] = useState<'All' | 'Pregnant' | 'SevereOnly'>('All');

  // Community clusters in Ga East / La Nkwantanang
  const communities = [
    {
      name: 'Abokobi Community',
      zone: 'Abokobi Sector',
      tested: 184,
      positive: 78,
      prevalence: 42.4,
      severe: 8,
      pregnantTested: 42,
      riskLevel: 'High',
      topEtiology: 'Iron Deficiency (IDA)',
      coordinates: '5.736° N, 0.201° W',
    },
    {
      name: 'Pantang / Sesemi',
      zone: 'Pantang Sub-District',
      tested: 210,
      positive: 82,
      prevalence: 39.0,
      severe: 6,
      pregnantTested: 51,
      riskLevel: 'Moderate',
      topEtiology: 'Iron Deficiency + Parasitic',
      coordinates: '5.698° N, 0.174° W',
    },
    {
      name: 'Danfa & Otinibi',
      zone: 'Danfa CHPS Zone',
      tested: 146,
      positive: 68,
      prevalence: 46.5,
      severe: 11,
      pregnantTested: 36,
      riskLevel: 'Critical',
      topEtiology: 'Mixed Inflammation / Malaria',
      coordinates: '5.748° N, 0.149° W',
    },
    {
      name: 'Oyarifa Wards',
      zone: 'Oyarifa Clinic Area',
      tested: 162,
      positive: 58,
      prevalence: 35.8,
      severe: 4,
      pregnantTested: 39,
      riskLevel: 'Moderate',
      topEtiology: 'Dietary Micronutrient',
      coordinates: '5.728° N, 0.165° W',
    },
    {
      name: 'Teiman & Ayi Mensah',
      zone: 'Eastern Ridge Corridor',
      tested: 128,
      positive: 52,
      prevalence: 40.6,
      severe: 5,
      pregnantTested: 28,
      riskLevel: 'High',
      topEtiology: 'Iron Deficiency (IDA)',
      coordinates: '5.751° N, 0.182° W',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">
            District Health Information System (DHIS2)
          </span>
          <h3 className="text-base font-extrabold text-white mt-0.5 flex items-center gap-2">
            <span>Epidemiological Anemia Surveillance & Spatial Heatmap</span>
          </h3>
          <p className="text-xs text-slate-400">
            Real-time prevalence tracking, etiology stratification, and high-risk hotspot detection.
          </p>
        </div>

        {/* Cohort Toggle */}
        <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedCohort('All')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedCohort === 'All'
                ? 'bg-[#8B1E3F] text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Cohorts
          </button>
          <button
            onClick={() => setSelectedCohort('Pregnant')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedCohort === 'Pregnant'
                ? 'bg-purple-950 text-purple-300 border border-purple-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ANC Mothers (High Risk)
          </button>
          <button
            onClick={() => setSelectedCohort('SevereOnly')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedCohort === 'SevereOnly'
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Severe Hospital Cases
          </button>
        </div>
      </div>

      {/* Grid: Spatial Map View + Etiology Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Spatial Cluster Map & Community Hotspots */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>Ga East Community Prevalence Clusters</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">5 Field Zones Monitored</span>
          </div>

          {/* Interactive Community Cards */}
          <div className="space-y-3">
            {communities.map((comm) => (
              <div
                key={comm.name}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-rose-900/60 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{comm.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({comm.zone})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">{comm.coordinates}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        comm.riskLevel === 'Critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                          : comm.riskLevel === 'High'
                          ? 'bg-orange-950 text-orange-300 border border-orange-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {comm.riskLevel} Risk ({comm.prevalence}%)
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Screened: {comm.tested}</span>
                    <span>Anemia Positive: <strong className="text-white">{comm.positive}</strong> ({comm.prevalence}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${100 - comm.prevalence}%` }}
                      title="Normal"
                    />
                    <div
                      className="bg-amber-500 h-full"
                      style={{ width: `${comm.prevalence * 0.7}%` }}
                      title="Mild / Moderate"
                    />
                    <div
                      className="bg-rose-600 h-full"
                      style={{ width: `${comm.prevalence * 0.3}%` }}
                      title="Severe Anemia"
                    />
                  </div>
                </div>

                {/* Footnote Data */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 border-t border-slate-900 pt-2">
                  <span>ANC Pregnant Screened: <strong className="text-purple-300">{comm.pregnantTested}</strong></span>
                  <span>Severe Cases: <strong className="text-rose-400">{comm.severe}</strong></span>
                  <span className="text-indigo-300 font-medium">{comm.topEtiology}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Etiology Breakdown & Protocol Adherence */}
        <div className="lg:col-span-5 space-y-4">
          {/* Etiology Pie/Bar Matrix */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-indigo-400" />
              <span>BioSense Etiology Stratification</span>
            </h4>

            <div className="space-y-3 text-xs">
              {/* Category 1 */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-rose-300">1. Pure Iron Deficiency (IDA)</span>
                  <span className="text-white font-mono">63.5%</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Low Ferritin + Normal CRP • Protocol: Oral Iron + Folate
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full" style={{ width: '63.5%' }} />
                </div>
              </div>

              {/* Category 2 */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-amber-300">2. Anemia of Chronic Disease</span>
                  <span className="text-white font-mono">23.0%</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Normal/High Ferritin + Elevated CRP • Protocol: Medical Workup
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: '23.0%' }} />
                </div>
              </div>

              {/* Category 3 */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex justify-between font-bold">
                  <span className="text-indigo-300">3. Mixed Etiology / Malaria Infection</span>
                  <span className="text-white font-mono">13.5%</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Low Ferritin + Elevated CRP • Protocol: Antimalarial + Iron
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full" style={{ width: '13.5%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Supervisor Directives Box */}
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/50 space-y-2 text-xs">
            <div className="font-bold text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Supervisor Epidemiological Directive</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Danfa & Otinibi CHPS zone shows elevated CRP positivity (46.5%). Recommend deploying supplementary malaria Rapid Diagnostic Tests (mRDT) along with BioSense cassettes for field visits this week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
