import React, { useState } from 'react';
import { Search, UserPlus, ChevronRight, Activity, Filter, CheckCircle2, Clock, RefreshCw, AlertCircle, Pause, Radio } from 'lucide-react';
import { LanguageCode, Patient } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface PatientListScreenProps {
  lang: LanguageCode;
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onNewPatient: () => void;
  onOpenSyncQueue?: () => void;
  isWireframe?: boolean;
}

export const PatientListScreen: React.FC<PatientListScreenProps> = ({
  lang,
  patients,
  onSelectPatient,
  onNewPatient,
  onOpenSyncQueue,
  isWireframe,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'positive' | 'pregnant' | 'pending_sync'>('all');

  const pendingCount = patients.filter((p) => p.latestScreening?.syncStatus === 'pending_sync').length;

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.village.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'positive') {
      return (
        p.latestScreening?.layer1.severity === 'Moderate' ||
        p.latestScreening?.layer1.severity === 'Severe' ||
        p.latestScreening?.layer1.severity === 'Mild'
      );
    }
    if (filterType === 'pregnant') {
      return p.isPregnant;
    }
    if (filterType === 'pending_sync') {
      return p.latestScreening?.syncStatus === 'pending_sync';
    }
    return true;
  });

  if (isWireframe) {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-200 p-4 font-mono text-xs select-none">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-3">
          <span className="font-bold text-slate-100">[PATIENT_LIST_DIRECTORY]</span>
          <button
            onClick={onNewPatient}
            className="border border-rose-500 text-rose-300 px-2 py-0.5 rounded text-[10px]"
          >
            [+ NEW]
          </button>
        </div>

        {/* Search */}
        <div className="p-2 border border-slate-700 rounded bg-slate-950/40 mb-3 flex items-center gap-2">
          <span>🔍</span>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="[SEARCH_NAME_OR_ID...]"
            className="bg-transparent text-slate-200 outline-none w-full text-xs"
          />
        </div>

        {/* Patient Rows */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className="p-2.5 border border-slate-700 rounded bg-slate-950/30 flex justify-between items-center cursor-pointer hover:border-slate-500"
            >
              <div>
                <div className="font-bold text-slate-100">{patient.name}</div>
                <div className="text-[10px] text-slate-400">
                  {patient.age} {patient.gender === 'Female' ? 'F' : 'M'} | {patient.id}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-600">
                  {patient.latestScreening?.layer1.severity || 'PENDING'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 select-none">
      {/* Header matching screenshot */}
      <div className="px-4 py-3 bg-white border-b border-slate-100 flex justify-between items-center">
        <h1 className="text-base font-extrabold text-slate-900">Patient List</h1>
        <button
          onClick={onNewPatient}
          className="inline-flex items-center gap-1 bg-[#8B1E3F] text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-[#731833] active:scale-95 shadow-xs transition-all"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>

      {/* Search Input matching Screenshot */}
      <div className="p-4 bg-white border-b border-slate-100 space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B1E3F]/30 focus:border-[#8B1E3F]"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-1.5 text-[11px] overflow-x-auto pb-0.5">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-full font-semibold transition-all shrink-0 ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({patients.length})
          </button>
          <button
            onClick={() => setFilterType('positive')}
            className={`px-2.5 py-1 rounded-full font-semibold transition-all shrink-0 ${
              filterType === 'positive'
                ? 'bg-[#8B1E3F] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Positive Anemia
          </button>
          <button
            onClick={() => setFilterType('pregnant')}
            className={`px-2.5 py-1 rounded-full font-semibold transition-all shrink-0 ${
              filterType === 'pregnant'
                ? 'bg-rose-700 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pregnant ANC
          </button>
          {pendingCount > 0 && (
            <button
              onClick={() => setFilterType('pending_sync')}
              className={`px-2.5 py-1 rounded-full font-semibold transition-all shrink-0 flex items-center gap-1 ${
                filterType === 'pending_sync'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>Pending Sync ({pendingCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Patient List matching screenshot (Ama Mensah, Kofi Boateng, Abena Darko, Yaw Asare) */}
      <div className="flex-1 px-4 py-3 overflow-y-auto space-y-2">
        {filteredPatients.map((patient) => {
          const screening = patient.latestScreening;
          const severity = screening?.layer1.severity;
          const isPending = screening?.syncStatus === 'pending_sync';
          const meta = screening?.syncMetadata;

          return (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs hover:border-slate-300 active:scale-[0.99] cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                {/* Patient Avatar Initials */}
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{patient.name}</span>
                    {patient.isPregnant && (
                      <span className="text-[9px] font-bold bg-rose-50 text-[#8B1E3F] px-1.5 py-0.2 rounded-md border border-rose-100">
                        Pregnant
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-2 flex-wrap">
                    <span>{patient.age} {patient.gender === 'Female' ? 'F' : 'M'} | ID: {patient.id}</span>
                    {isPending && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenSyncQueue) onOpenSyncQueue();
                        }}
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border inline-flex items-center gap-1 ${
                          meta?.status === 'failed'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : meta?.status === 'paused'
                            ? 'bg-slate-100 text-slate-700 border-slate-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                        title="Click to view in Queue Manager"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        {meta?.status === 'failed'
                          ? `Retry #${meta.attemptCount || 1}`
                          : meta?.status === 'paused'
                          ? 'Sync Paused'
                          : 'Pending Sync'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {severity && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      severity === 'Normal'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : severity === 'Moderate'
                        ? 'bg-orange-50 text-orange-800 border border-orange-200'
                        : severity === 'Severe'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {severity}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
