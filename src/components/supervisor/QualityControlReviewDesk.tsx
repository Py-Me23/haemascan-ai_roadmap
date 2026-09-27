import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Eye,
  Droplets,
  BadgeCheck,
  Edit3,
  MessageSquare,
  Clock,
  ArrowRight,
  UserCheck,
  Sliders,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { Patient, Severity, VerificationStatus } from '../../types';

interface QualityControlReviewDeskProps {
  patients: Patient[];
  onUpdateSupervisorReview: (
    patientId: string,
    status: VerificationStatus,
    notes: string,
    overrideSeverity?: Severity
  ) => void;
  onOpenReferralModal: (patient: Patient) => void;
}

export const QualityControlReviewDesk: React.FC<QualityControlReviewDeskProps> = ({
  patients,
  onUpdateSupervisorReview,
  onOpenReferralModal,
}) => {
  // Find tests that need review or are recently reviewed
  const reviewQueue = patients.filter((p) => p.latestScreening);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [overrideSeverity, setOverrideSeverity] = useState<Severity | 'None'>('None');
  const [activeTab, setActiveTab] = useState<'layer1' | 'layer2' | 'clinical'>('layer1');
  const [isSuccessFeedback, setIsSuccessFeedback] = useState<boolean>(false);

  const currentPatient = reviewQueue[selectedIndex] || reviewQueue[0];
  const screening = currentPatient?.latestScreening;

  if (!currentPatient || !screening) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
        <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="font-bold text-white">All clinical test streams have been audited!</p>
        <p className="text-xs text-slate-500 mt-1">No pending tests in the quality control queue.</p>
      </div>
    );
  }

  const handleVerify = () => {
    onUpdateSupervisorReview(
      currentPatient.id,
      'verified',
      reviewNotes || 'Verified by Lead Supervisor. AI vision segmentation and BioSense line densities conform with clinical protocol.',
      undefined
    );
    triggerSuccess();
  };

  const handleOverride = () => {
    if (overrideSeverity === 'None') return;
    onUpdateSupervisorReview(
      currentPatient.id,
      'overridden',
      reviewNotes || `Clinical classification overridden to ${overrideSeverity} by Lead Medical Supervisor based on secondary findings.`,
      overrideSeverity
    );
    triggerSuccess();
  };

  const handleFlagForRetest = () => {
    onUpdateSupervisorReview(
      currentPatient.id,
      'flagged',
      reviewNotes || 'Flagged for CHW field retest: Image lighting / cassette baseline requires confirmation.',
      undefined
    );
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setIsSuccessFeedback(true);
    setTimeout(() => {
      setIsSuccessFeedback(false);
      // Auto move to next if available
      if (selectedIndex < reviewQueue.length - 1) {
        setSelectedIndex(selectedIndex + 1);
        setReviewNotes('');
        setOverrideSeverity('None');
      }
    }, 1200);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-5">
      {/* QA Header & Queue Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">
              Supervisor Clinical Audit Desk
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
              Quality Assurance (QA/QC)
            </span>
          </div>
          <h3 className="text-base font-extrabold text-white mt-0.5">
            Two-Layer Diagnostic Verification & Sign-Off
          </h3>
        </div>

        {/* Record Carousel Navigator */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-400 font-mono">
            Record {selectedIndex + 1} of {reviewQueue.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => {
                setSelectedIndex(Math.max(0, selectedIndex - 1));
                setReviewNotes('');
                setOverrideSeverity('None');
              }}
              disabled={selectedIndex === 0}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 text-xs font-bold"
            >
              Prev
            </button>
            <button
              onClick={() => {
                setSelectedIndex(Math.min(reviewQueue.length - 1, selectedIndex + 1));
                setReviewNotes('');
                setOverrideSeverity('None');
              }}
              disabled={selectedIndex === reviewQueue.length - 1}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 text-xs font-bold"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Patient Header Banner */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-800/60 flex items-center justify-center font-bold text-rose-300 text-sm">
            {currentPatient.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-extrabold text-white text-sm flex items-center gap-2">
              <span>{currentPatient.name}</span>
              <span className="font-mono text-xs font-normal text-slate-400">({currentPatient.id})</span>
              {currentPatient.isPregnant && (
                <span className="px-2 py-0.2 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">
                  Pregnant (ANC {currentPatient.trimester || '2nd'})
                </span>
              )}
            </div>
            <div className="text-slate-400 text-[11px] mt-0.5">
              {currentPatient.age} yrs • {currentPatient.gender} • {currentPatient.village}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
            <span className="text-slate-500">CHW: </span>
            <strong className="text-slate-200">{screening.chwName.split('(')[0]}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
            <span className="text-slate-500">Facility: </span>
            <strong className="text-slate-200">{screening.facilityName}</strong>
          </div>
          {screening.supervisorReview?.status === 'verified' && (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold flex items-center gap-1.5 text-[11px]">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Signed by {screening.supervisorReview.supervisorName.split('(')[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Two-Layer Verification Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 6 Cols: Layer 1 & Layer 2 Optical Telemetry */}
        <div className="lg:col-span-7 space-y-4">
          {/* Sub-Tabs for Optical Inspection */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('layer1')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'layer1'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>1. Vision AI Palpebral Scan</span>
            </button>
            <button
              onClick={() => setActiveTab('layer2')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'layer2'
                  ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>2. BioSense Cassette Optical Lines</span>
            </button>
          </div>

          {/* TAB 1: Layer 1 Vision Telemetry */}
          {activeTab === 'layer1' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  Palpebral Conjunctiva Image Segmentation
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Target Hex: <strong className="text-white">{screening.layer1.conjunctivaColorHex}</strong>
                </span>
              </div>

              {/* Simulated Micro-Camera View with Bounding Reticle */}
              <div className="relative h-44 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
                {/* Simulated Conjunctiva Gradient Visual */}
                <div
                  className="w-full h-full opacity-60 transition-all"
                  style={{
                    background: `radial-gradient(ellipse at 50% 60%, ${screening.layer1.conjunctivaColorHex} 0%, #1e1014 80%)`,
                  }}
                />

                {/* Reticle Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-20 rounded-[50%] border-2 border-dashed border-rose-400/80 bg-rose-500/10 flex items-center justify-center">
                    <span className="text-[10px] font-mono text-rose-200 bg-slate-950/80 px-2 py-0.5 rounded border border-rose-900">
                      Region of Interest (ROI) • Erythema: 0.28
                    </span>
                  </div>
                </div>

                {/* Camera Metas */}
                <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-300 bg-slate-950/90 px-2 py-1 rounded border border-slate-800">
                  Ambient Lux: {screening.layer1.lightingLux || 540} lux (Pass AAA)
                </div>
                <div className="absolute top-2 right-3 text-[10px] font-mono text-slate-300 bg-slate-950/90 px-2 py-1 rounded border border-slate-800">
                  Confidence: {screening.layer1.confidence}%
                </div>
              </div>

              {/* Vision AI Analytical Metrics */}
              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Estimated Hb</span>
                  <span className="text-base font-extrabold text-white">
                    {screening.layer1.estimatedHb} <small className="text-xs font-normal text-slate-400">g/dL</small>
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">AI Severity</span>
                  <span className="text-xs font-bold text-amber-400 block mt-1">
                    {screening.layer1.severity} Anemia
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Layer 2 Gate</span>
                  <span className="text-xs font-bold text-rose-400 block mt-1">
                    {screening.layer1.isPositive ? 'Required Confirmatory' : 'Negative'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Layer 2 BioSense Telemetry */}
          {activeTab === 'layer2' && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  BioSense Dual-Analyte Cassette Strip Scan
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Lot: <strong className="text-white">{screening.layer2?.cassetteLotNumber || 'BIO-26-8812'}</strong>
                </span>
              </div>

              {/* Cassette Strip Visual Simulation */}
              <div className="h-44 rounded-xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-center items-center">
                <div className="w-64 bg-slate-200 text-slate-900 rounded-xl p-3 shadow-inner border border-slate-400 flex flex-col justify-between h-32">
                  <div className="flex justify-between items-center text-[10px] font-bold font-mono text-slate-700">
                    <span>BIOSENSE F+CRP</span>
                    <span>#BIO-26-8812</span>
                  </div>

                  {/* Test Window */}
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-300 flex items-center justify-around">
                    {/* Control Line */}
                    <div className="text-center">
                      <div className="w-1.5 h-10 bg-rose-600 rounded-full mx-auto shadow-xs" />
                      <span className="text-[9px] font-bold text-slate-600 block mt-0.5">C (Control)</span>
                    </div>

                    {/* Ferritin Line */}
                    <div className="text-center">
                      <div
                        className={`w-1.5 h-10 rounded-full mx-auto ${
                          screening.layer2?.detectedLines.ferritinLine
                            ? 'bg-rose-500 shadow-xs'
                            : 'bg-slate-300 opacity-40'
                        }`}
                      />
                      <span className="text-[9px] font-bold text-slate-600 block mt-0.5">F (Ferritin)</span>
                    </div>

                    {/* CRP Line */}
                    <div className="text-center">
                      <div
                        className={`w-1.5 h-10 rounded-full mx-auto ${
                          screening.layer2?.detectedLines.crpLine
                            ? 'bg-rose-700 shadow-xs'
                            : 'bg-slate-300 opacity-40'
                        }`}
                      />
                      <span className="text-[9px] font-bold text-slate-600 block mt-0.5">CRP (Inflam)</span>
                    </div>
                  </div>

                  <div className="text-[9px] text-slate-600 text-center font-mono">
                    Optical Density Calibration: Valid Run
                  </div>
                </div>
              </div>

              {/* BioSense Interpretation Metrics */}
              {screening.layer2 ? (
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Ferritin Line Status</span>
                    <span className="text-xs font-bold text-rose-300 block mt-0.5">
                      {screening.layer2.ferritin === 'Low' ? 'Low (Iron Depleted)' : 'Normal Stores'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">CRP Inflammation Status</span>
                    <span className="text-xs font-bold text-amber-300 block mt-0.5">
                      {screening.layer2.crp === 'Elevated' ? 'Elevated (Inflammation+)' : 'Normal (<5 mg/L)'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-900 rounded-xl text-center text-xs text-slate-400">
                  BioSense finger-prick test was not triggered (Normal screening result).
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Supervisor QA Decision Desk */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-rose-400" />
              <span>Current Clinical Prescription & Protocol</span>
            </span>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
              <div className="font-bold text-rose-300">{screening.recommendation.primaryAction}</div>
              <div className="text-[11px] text-slate-400">
                {screening.recommendation.supplementDetails.type}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Dosage: {screening.recommendation.supplementDetails.dosage}
              </div>
            </div>

            {/* Referral Status Callout */}
            {screening.recommendation.referralIndicated && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold block">Hospital Referral Triggered</span>
                  <span className="text-[10px] text-rose-300/80">{screening.recommendation.referralReason}</span>
                </div>
                <button
                  onClick={() => onOpenReferralModal(currentPatient)}
                  className="px-2 py-1 rounded bg-rose-900 hover:bg-rose-800 text-white text-[10px] font-bold"
                >
                  View Slip
                </button>
              </div>
            )}

            {/* Supervisor Clinical Review Notes */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-400">
                Supervisor Clinical Audit Notes:
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter audit observations, protocol compliance notes, or rationale..."
                rows={2}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-xs"
              />
            </div>

            {/* Override Severity Selector */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-400">
                Override Clinical Severity (Optional):
              </label>
              <select
                value={overrideSeverity}
                onChange={(e) => setOverrideSeverity(e.target.value as Severity | 'None')}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="None">Keep Current AI Severity ({screening.layer1.severity})</option>
                <option value="Normal">Override to: Normal (No Anemia)</option>
                <option value="Mild">Override to: Mild Pallor</option>
                <option value="Moderate">Override to: Moderate Anemia</option>
                <option value="Severe">Override to: Severe Anemia (Urgent Referral)</option>
              </select>
            </div>
          </div>

          {/* Supervisor Action Buttons */}
          <div className="space-y-2">
            {isSuccessFeedback && (
              <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-200 text-center text-xs font-bold flex items-center justify-center gap-1.5 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Audit Signed & Committed to GHS Central Registry!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                id="btn-qa-verify-sign"
                onClick={handleVerify}
                className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950 transition-all active:scale-95"
              >
                <BadgeCheck className="w-4 h-4" />
                <span>Verify & Sign</span>
              </button>

              {overrideSeverity !== 'None' ? (
                <button
                  id="btn-qa-override"
                  onClick={handleOverride}
                  className="px-3 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-purple-950 transition-all active:scale-95"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Apply Override</span>
                </button>
              ) : (
                <button
                  id="btn-qa-flag-retest"
                  onClick={handleFlagForRetest}
                  className="px-3 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950 transition-all active:scale-95"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Flag Retest</span>
                </button>
              )}

              <button
                onClick={() => onOpenReferralModal(currentPatient)}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <FileText className="w-4 h-4 text-rose-400" />
                <span>Print Slip</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
