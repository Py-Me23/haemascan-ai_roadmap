import React from 'react';
import { X, Printer, Download, QrCode, ShieldCheck, Phone, MapPin, AlertTriangle } from 'lucide-react';
import { Patient } from '../../types';

interface ReferralSlipModalProps {
  patient: Patient;
  onClose: () => void;
}

export const ReferralSlipModal: React.FC<ReferralSlipModalProps> = ({
  patient,
  onClose,
}) => {
  const screening = patient.latestScreening;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="bg-white text-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Action Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#8B1E3F] flex items-center justify-center text-white text-xs font-bold">
              💧
            </div>
            <span className="font-bold text-sm">Official Clinical Referral Slip (GHS Form)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 text-white"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 space-y-5 print:p-0">
          {/* Header & Logo */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                Ghana Health Service • Primary Care Division
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                HAEMASCAN AI CLINICAL REFERRAL
              </h2>
              <div className="text-xs text-slate-600 mt-0.5">
                Two-Layer Anemia Screening & Decision Support System
              </div>
            </div>

            {/* Simulated QR Code for Rapid Hospital Intake */}
            <div className="border border-slate-300 p-1.5 rounded-lg bg-slate-50 flex flex-col items-center">
              <QrCode className="w-12 h-12 text-slate-900" />
              <span className="text-[8px] font-mono text-slate-500 mt-0.5">VERIFY ID</span>
            </div>
          </div>

          {/* Patient Details Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500">Patient Name:</span>
              <div className="font-extrabold text-slate-900 text-sm">{patient.name}</div>
            </div>
            <div>
              <span className="text-slate-500">Patient ID:</span>
              <div className="font-mono font-bold text-slate-900">{patient.id}</div>
            </div>
            <div>
              <span className="text-slate-500">Age / Gender:</span>
              <div className="font-bold text-slate-800">
                {patient.age} yrs • {patient.gender} {patient.isPregnant ? '• Pregnant (2nd Trimester)' : ''}
              </div>
            </div>
            <div>
              <span className="text-slate-500">Community / Village:</span>
              <div className="font-bold text-slate-800">{patient.village}</div>
            </div>
          </div>

          {/* Diagnostic Results Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 px-3.5 py-2 font-bold text-slate-800 flex justify-between">
              <span>Diagnostic Layer</span>
              <span>Result & Severity</span>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="p-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">Layer 1: Smartphone Vision AI</div>
                  <div className="text-[11px] text-slate-500">Palpebral Conjunctiva Color Analysis</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    {screening?.layer1.severity || 'Moderate'} Anemia (Hb ~{screening?.layer1.estimatedHb || 8.6} g/dL)
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">Confidence: {screening?.layer1.confidence || 86}%</div>
                </div>
              </div>

              <div className="p-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">Layer 2: BioSense Rapid Dual-Analyte</div>
                  <div className="text-[11px] text-slate-500">Ferritin (Iron Store) + CRP (Inflammation)</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Ferritin: Low • CRP: Normal
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">Confidence: 88%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Clinical Conclusion */}
          <div className="p-3.5 bg-rose-50/80 border border-rose-200 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B1E3F]">
              <AlertTriangle className="w-4 h-4" />
              <span>Clinical Algorithm Recommendation:</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 leading-relaxed">
              Likely Pure Iron Deficiency Anemia (IDA). Oral iron supplementation protocol (Ferrous Sulfate 200mg + Folic Acid 400mcg daily) initiated.
            </p>
          </div>

          {/* Referral Provider & Stamp Info */}
          <div className="pt-2 flex justify-between items-end text-xs text-slate-600 border-t border-slate-200">
            <div>
              <div className="font-semibold text-slate-800">Referring Facility:</div>
              <div>Pantang Health Centre (Adentan District)</div>
              <div>CHW: Kofi Owusu (ID: CHW-042)</div>
              <div>Date: {screening?.date || '20 May 2026, 09:30 AM'}</div>
            </div>

            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1" />
              <span className="text-[10px] text-slate-400 uppercase">Provider Signature / Stamp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
