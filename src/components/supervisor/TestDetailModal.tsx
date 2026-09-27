import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BadgeCheck,
  Edit3,
  Calendar,
  Building2,
  User,
  Eye,
  Droplets,
  Sliders,
  Send,
} from 'lucide-react';
import { Patient, Severity, VerificationStatus } from '../../types';

interface TestDetailModalProps {
  patient: Patient;
  onClose: () => void;
  onUpdateSupervisorReview: (
    patientId: string,
    status: VerificationStatus,
    notes: string,
    overrideSeverity?: Severity
  ) => void;
  onOpenReferralModal: (patient: Patient) => void;
}

export const TestDetailModal: React.FC<TestDetailModalProps> = ({
  patient,
  onClose,
  onUpdateSupervisorReview,
  onOpenReferralModal,
}) => {
  const screening = patient.latestScreening;
  const [reviewNotes, setReviewNotes] = useState<string>(
    screening?.supervisorReview?.reviewNotes || ''
  );
  const [overrideSeverity, setOverrideSeverity] = useState<Severity | 'None'>('None');
  const [isSaved, setIsSaved] = useState(false);

  if (!screening) return null;

  const handleVerify = () => {
    onUpdateSupervisorReview(
      patient.id,
      'verified',
      reviewNotes || 'Verified by District Supervisor.',
      undefined
    );
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const handleOverride = () => {
    if (overrideSeverity === 'None') return;
    onUpdateSupervisorReview(
      patient.id,
      'overridden',
      reviewNotes || `Overridden to ${overrideSeverity}`,
      overrideSeverity
    );
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const handleFlag = () => {
    onUpdateSupervisorReview(
      patient.id,
      'flagged',
      reviewNotes || 'Flagged for retest.',
      undefined
    );
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 my-8">
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">
                Central Clinical Record Audit
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {screening.id}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-white mt-1 flex items-center gap-2">
              <span>{patient.name}</span>
              <span className="text-xs font-mono font-normal text-slate-400">({patient.id})</span>
              {patient.isPregnant && (
                <span className="px-2 py-0.2 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">
                  Pregnant (ANC {patient.trimester || '2nd'})
                </span>
              )}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient Demographics & Facility Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Age & Gender</span>
            <span className="font-bold text-white mt-0.5 block">
              {patient.age} yrs • {patient.gender}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Community / Village</span>
            <span className="font-bold text-white mt-0.5 block truncate">{patient.village}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Facility & CHW</span>
            <span className="font-bold text-white mt-0.5 block truncate">
              {screening.facilityName}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Screening Date</span>
            <span className="font-mono text-slate-300 mt-0.5 block truncate">{screening.date}</span>
          </div>
        </div>

        {/* Two Layer Diagnostic Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Layer 1 Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-rose-900/40 space-y-2.5 text-xs">
            <div className="flex justify-between items-center font-bold text-rose-300">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-rose-400" />
                <span>Layer 1: Smartphone Vision AI</span>
              </span>
              <span className="font-mono text-slate-400">{screening.layer1.confidence}% conf</span>
            </div>

            <div className="space-y-1 text-slate-300">
              <div>
                Severity: <strong className="text-amber-400">{screening.layer1.severity} Anemia</strong>
              </div>
              <div>
                Estimated Hemoglobin: <strong className="text-white">{screening.layer1.estimatedHb} g/dL</strong>
              </div>
              <div className="flex items-center gap-2">
                <span>Conjunctiva Hex:</span>
                <span
                  className="w-4 h-4 rounded-full border border-slate-600 inline-block"
                  style={{ backgroundColor: screening.layer1.conjunctivaColorHex }}
                />
                <span className="font-mono text-slate-400">{screening.layer1.conjunctivaColorHex}</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Lighting: {screening.layer1.lightingLux || 540} lux (Pass)
              </div>
            </div>
          </div>

          {/* Layer 2 Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-900/40 space-y-2.5 text-xs">
            <div className="flex justify-between items-center font-bold text-indigo-300">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-indigo-400" />
                <span>Layer 2: BioSense Rapid Strip</span>
              </span>
              {screening.layer2 && (
                <span className="font-mono text-slate-400">{screening.layer2.confidence}% conf</span>
              )}
            </div>

            {screening.layer2 ? (
              <div className="space-y-1 text-slate-300">
                <div className="flex gap-2">
                  <span>
                    Ferritin: <strong className="text-rose-300">{screening.layer2.ferritin}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    CRP: <strong className="text-amber-300">{screening.layer2.crp}</strong>
                  </span>
                </div>
                <div className="font-medium text-indigo-200">
                  {screening.layer2.interpretation}
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  Lot: {screening.layer2.cassetteLotNumber}
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-xs italic py-2">
                Layer 2 not performed. Patient stratified out non-invasively.
              </div>
            )}
          </div>
        </div>

        {/* Clinical Recommendation Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <div className="font-bold text-white flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-rose-400" />
            <span>Prescription & Action Plan:</span>
          </div>
          <div className="text-rose-300 font-bold">{screening.recommendation.primaryAction}</div>
          <div className="text-slate-400 text-[11px]">
            {screening.recommendation.supplementDetails.type} — {screening.recommendation.supplementDetails.dosage}
          </div>
          {screening.recommendation.referralIndicated && (
            <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-200 font-semibold text-[11px] flex justify-between items-center">
              <span>⚠️ Referral Indicated: {screening.recommendation.referralReason}</span>
              <button
                onClick={() => {
                  onClose();
                  onOpenReferralModal(patient);
                }}
                className="px-2.5 py-1 rounded bg-rose-800 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Open Official Referral Form
              </button>
            </div>
          )}
        </div>

        {/* Supervisor QA Form */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
          <div className="font-bold text-white flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-emerald-400" />
            <span>Supervisor Quality Review & Sign-Off:</span>
          </div>

          <textarea
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            placeholder="Add supervisor notes or feedback..."
            rows={2}
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Override:</span>
              <select
                value={overrideSeverity}
                onChange={(e) => setOverrideSeverity(e.target.value as any)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs"
              >
                <option value="None">Keep ({screening.layer1.severity})</option>
                <option value="Normal">Normal</option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFlag}
                className="px-3 py-1.5 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 font-bold transition-all"
              >
                Flag Retest
              </button>
              {overrideSeverity !== 'None' ? (
                <button
                  onClick={handleOverride}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all"
                >
                  Save Override
                </button>
              ) : (
                <button
                  onClick={handleVerify}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md shadow-emerald-950"
                >
                  Verify & Sign Off
                </button>
              )}
            </div>
          </div>

          {isSaved && (
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-300 font-bold text-center animate-pulse">
              Sign-Off Recorded Successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
