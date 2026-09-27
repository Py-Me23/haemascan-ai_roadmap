import React, { useState } from 'react';
import { ChevronLeft, Check, AlertCircle, FileText, Share2, Heart, PlusCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LanguageCode, Patient } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface RecommendationScreenProps {
  lang: LanguageCode;
  patient: {
    name: string;
    age: number;
    gender: 'Female' | 'Male';
    isPregnant?: boolean;
    village: string;
  };
  severity: 'Normal' | 'Mild' | 'Moderate' | 'Severe';
  onBack: () => void;
  onSaveAndFinish: () => void;
  onViewReferralSlip: () => void;
  isWireframe?: boolean;
}

export const RecommendationScreen: React.FC<RecommendationScreenProps> = ({
  lang,
  patient,
  severity,
  onBack,
  onSaveAndFinish,
  onViewReferralSlip,
  isWireframe,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [supplementStarted, setSupplementStarted] = useState(true);

  const handleFinish = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // ignore
    }
    onSaveAndFinish();
  };

  if (isWireframe) {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-200 p-4 font-mono text-xs select-none">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-3">
          <button onClick={onBack} className="text-slate-400">
            [ &lt; BACK ]
          </button>
          <span className="font-bold text-slate-100">[ACTION_RECOMMENDATION]</span>
          <span className="text-[10px] text-slate-500">STEP 7/7</span>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {/* Primary Protocol Card */}
          <div className="p-3 border-2 border-emerald-500 bg-emerald-950/40 rounded">
            <div className="text-[10px] text-emerald-400 font-bold">[PRIMARY_ACTION]</div>
            <div className="text-sm font-bold text-emerald-200 mt-1">
              [{t.startIronSupplement.toUpperCase()}]
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              DOSAGE: Ferrous Sulfate 200mg (65mg elemental Fe) + 400mcg Folic Acid daily
            </div>
          </div>

          {/* Also Consider Section */}
          <div className="p-3 border border-slate-700 rounded bg-slate-950/30 space-y-1.5">
            <div className="text-[10px] text-slate-400 font-bold">[{t.alsoConsider.toUpperCase()}]</div>
            <div className="text-slate-300">• Dietary counseling (Kontomire, liver, beans)</div>
            <div className="text-slate-300">• Follow-up screening in 4 weeks</div>
            <div className="text-slate-300">• Deworming if 2nd/3rd trimester ANC</div>
          </div>

          {/* Referral Button */}
          <button
            onClick={onViewReferralSlip}
            className="w-full py-2.5 border border-amber-500 rounded bg-amber-950/30 text-amber-300 text-center font-bold"
          >
            [ {t.referIfIndicated.toUpperCase()} ➔ ]
          </button>
        </div>

        <div className="mt-auto pt-3 border-t border-slate-800">
          <button
            onClick={handleFinish}
            className="w-full h-12 border-2 border-rose-500 bg-rose-950/60 text-rose-200 font-bold rounded-xl flex items-center justify-center"
          >
            [ {t.saveAndFinish.toUpperCase()} ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white text-slate-900 select-none">
      {/* Header matching screenshot 7 */}
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-white">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-1 px-2 rounded-lg flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          {t.back}
        </button>

        <div className="text-center">
          <h2 className="text-sm font-bold text-slate-900">{t.recommendation}</h2>
          <div className="text-[10px] text-slate-400">{patient.name} • Step 7/7</div>
        </div>

        <div className="w-10" />
      </div>

      {/* Main Content matching Screenshot 7 */}
      <div className="flex-1 px-5 py-4 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-3.5">
          {/* Patient Quick Context Header */}
          <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-xs font-bold text-slate-800">{patient.name}</span>
              <span className="text-[11px] text-slate-500 ml-1.5">
                ({patient.age} yrs • {patient.gender} {patient.isPregnant ? '• Pregnant' : ''})
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
              Moderate IDA
            </span>
          </div>

          {/* Dominant Green Action Box matching Screenshot 7 */}
          <div className="bg-emerald-700 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold leading-tight">
                  {t.startIronSupplement}
                </h3>
                <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                  Ferrous Sulfate 200mg (65mg elemental iron) + Folic Acid 400mcg daily for 3 months.
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-emerald-600/60 flex justify-between items-center text-[11px] text-emerald-100">
              <span>Standard GHS Protocol</span>
              <span className="font-semibold">Take 30m before food with water/citrus</span>
            </div>
          </div>

          {/* Also Consider Section matching Screenshot 7 */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              {t.alsoConsider}
            </h4>

            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-[#8B1E3F] font-bold">•</span>
                <span>Dietary counseling on iron-rich traditional foods (Kontomire, beans, fish, liver).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8B1E3F] font-bold">•</span>
                <span>Advise to avoid tea, coffee, or calcium milk within 2 hours of taking iron.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8B1E3F] font-bold">•</span>
                <span>Follow-up Vision AI rescreening in 4 weeks.</span>
              </li>
              {patient.isPregnant && (
                <li className="flex items-start gap-2 text-rose-800 font-medium">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>Ensure attendance at next scheduled Antenatal Care (ANC) visit.</span>
                </li>
              )}
            </ul>
          </div>

          {/* Secondary Referral Option Button matching screenshot 7 */}
          <button
            id="btn-referral-slip"
            type="button"
            onClick={onViewReferralSlip}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-between shadow-2xs active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>{t.referIfIndicated} / Referral Slip</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Primary Save & Finish CTA matching Screenshot 7 */}
        <div className="pt-3 mt-auto">
          <button
            id="btn-recommendation-save-finish"
            type="button"
            onClick={handleFinish}
            className="w-full py-3.5 rounded-xl bg-[#8B1E3F] text-white font-bold text-sm shadow-md shadow-[#8B1E3F]/20 hover:bg-[#731833] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <span>{t.saveAndFinish}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
