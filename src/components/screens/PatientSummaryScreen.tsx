import React from 'react';
import { ChevronLeft, Calendar, MapPin, Phone, ShieldCheck, Activity, FileText, ArrowLeft } from 'lucide-react';
import { LanguageCode, Patient } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface PatientSummaryScreenProps {
  lang: LanguageCode;
  patient: Patient;
  onBack: () => void;
  onViewReferralSlip: () => void;
  onStartNewScreeningForPatient: () => void;
  isWireframe?: boolean;
}

export const PatientSummaryScreen: React.FC<PatientSummaryScreenProps> = ({
  lang,
  patient,
  onBack,
  onViewReferralSlip,
  onStartNewScreeningForPatient,
  isWireframe,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const screening = patient.latestScreening;

  if (isWireframe) {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-200 p-4 font-mono text-xs select-none">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-3">
          <button onClick={onBack} className="text-slate-400">
            [ &lt; BACK ]
          </button>
          <span className="font-bold text-slate-100">[PATIENT_SUMMARY]</span>
          <span className="text-[10px] text-slate-500">HS-DETAIL</span>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {/* Avatar & Demographic Card */}
          <div className="p-3 border border-slate-700 rounded bg-slate-950/40 text-center">
            <div className="w-14 h-14 rounded-full border-2 border-slate-500 mx-auto flex items-center justify-center text-base font-bold text-slate-300 mb-2">
              [IMG]
            </div>
            <div className="font-bold text-slate-100 text-sm">{patient.name}</div>
            <div className="text-[10px] text-slate-400">
              ID: {patient.id} | {patient.age} yrs | {patient.gender}
            </div>
          </div>

          {/* Screening Layer 1 */}
          <div className="p-2.5 border border-slate-700 rounded bg-slate-950/20">
            <div className="text-[10px] text-slate-400">LAYER 1: SCREENING</div>
            <div className="text-xs font-bold text-amber-300">
              {screening?.layer1.severity || 'MODERATE'} ANEMIA ({screening?.layer1.confidence || 86}%)
            </div>
          </div>

          {/* Test Result Layer 2 */}
          <div className="p-2.5 border border-slate-700 rounded bg-slate-950/20">
            <div className="text-[10px] text-slate-400">LAYER 2: TEST RESULT</div>
            <div className="text-xs font-bold text-emerald-300">
              {screening?.layer2?.interpretation || 'LIKELY IRON DEFICIENCY (88%)'}
            </div>
          </div>

          {/* Date */}
          <div className="p-2.5 border border-slate-700 rounded text-[10px] text-slate-400">
            DATE: {screening?.date || '20 May 2026, 09:30 AM'}
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-slate-800 space-y-2">
          <button
            onClick={onViewReferralSlip}
            className="w-full h-11 border-2 border-rose-500 bg-rose-950/50 text-rose-200 font-bold rounded-xl flex items-center justify-center"
          >
            [ VIEW / PRINT REFERRAL SLIP ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 select-none">
      {/* Header matching screenshot */}
      <div className="px-4 py-3 bg-white border-b border-slate-100 flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-1 px-2 rounded-lg flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <h2 className="text-sm font-bold text-slate-900">Patient Summary</h2>

        <div className="w-10" />
      </div>

      {/* Main Body matching Screenshot */}
      <div className="flex-1 px-5 py-4 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          {/* Patient Hero Avatar & Details */}
          <div className="flex flex-col items-center text-center bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 border-2 border-[#8B1E3F]/30 flex items-center justify-center font-bold text-lg text-[#8B1E3F] shadow-inner mb-2">
              {patient.name.split(' ').map((n) => n[0]).join('')}
            </div>

            <h3 className="text-base font-extrabold text-slate-900">{patient.name}</h3>
            <div className="text-xs font-medium text-slate-500 mt-0.5">
              ID: {patient.id} | {patient.age} yrs | {patient.gender}
            </div>

            {patient.isPregnant && (
              <span className="mt-2 text-[10px] font-bold bg-rose-50 text-[#8B1E3F] px-2.5 py-0.5 rounded-full border border-rose-200">
                Antenatal Care (2nd Trimester)
              </span>
            )}
          </div>

          {/* Results Summary Box matching Screenshot */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
            {/* Screening Row */}
            <div className="pb-3 border-b border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                Screening
              </span>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm font-bold text-slate-900">
                  {screening?.layer1.severity || 'Moderate'} Anemia
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200">
                  {screening?.layer1.confidence || 86}%
                </span>
              </div>
            </div>

            {/* Test Result Row */}
            <div className="pb-3 border-b border-slate-100">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                Test Result
              </span>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm font-bold text-emerald-700">
                  {screening?.layer2?.interpretation || 'Likely Iron Deficiency'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {screening?.layer2?.confidence || 88}%
                </span>
              </div>
            </div>

            {/* Date Row */}
            <div>
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                Date
              </span>
              <div className="text-xs font-medium text-slate-700 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{screening?.date || '20 May 2026, 09:30 AM'}</span>
              </div>
            </div>
          </div>

          {/* Location & Facility info */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-3 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{patient.village}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Pantang Health Centre (CHW ID: CHW-042)</span>
            </div>
          </div>
        </div>

        {/* Action Button matching screenshot ("View Details" / "Print Referral Slip") */}
        <div className="pt-4 mt-auto space-y-2">
          <button
            id="btn-summary-view-details"
            onClick={onViewReferralSlip}
            className="w-full py-3.5 rounded-xl bg-[#8B1E3F] text-white font-bold text-sm shadow-md shadow-[#8B1E3F]/20 hover:bg-[#731833] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>{t.viewDetails} / Referral Slip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
