import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Info, Sparkles, Activity } from 'lucide-react';
import { LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface AiInterpretationScreenProps {
  lang: LanguageCode;
  patientName: string;
  ferritin: 'Low' | 'Normal' | 'High';
  crp: 'Normal' | 'Elevated';
  interpretation: string;
  confidence: number;
  onBack: () => void;
  onNext: () => void;
  isWireframe?: boolean;
}

export const AiInterpretationScreen: React.FC<AiInterpretationScreenProps> = ({
  lang,
  patientName,
  ferritin,
  crp,
  interpretation,
  confidence,
  onBack,
  onNext,
  isWireframe,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const isInflammation = crp === 'Elevated';

  if (isWireframe) {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-200 p-4 font-mono text-xs select-none">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-3">
          <button onClick={onBack} className="text-slate-400">
            [ &lt; BACK ]
          </button>
          <span className="font-bold text-slate-100">[AI_INTERPRETATION]</span>
          <span className="text-[10px] text-slate-500">STEP 6/7</span>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto">
          {/* Analyte Readouts Table */}
          <div className="p-3 border border-slate-700 rounded bg-slate-950/40 space-y-2">
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span>{t.ferritin.toUpperCase()} (IRON STORE):</span>
              <span className="font-bold text-amber-400">[{ferritin.toUpperCase()}]</span>
            </div>
            <div className="flex justify-between">
              <span>{t.crp.toUpperCase()} (INFLAMMATION):</span>
              <span className={`font-bold ${isInflammation ? 'text-rose-400' : 'text-emerald-400'}`}>
                [{crp.toUpperCase()}]
              </span>
            </div>
          </div>

          {/* Interpretation Block */}
          <div className="p-4 border-2 border-emerald-500 bg-emerald-950/30 rounded text-center">
            <div className="text-[10px] text-emerald-400 font-bold mb-1">[INTERPRETATION]</div>
            <div className="text-sm font-bold text-emerald-200">{interpretation}</div>
            <div className="text-xs text-slate-400 mt-2 font-mono">CONFIDENCE: {confidence}%</div>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-slate-800">
          <button
            onClick={onNext}
            className="w-full h-12 border-2 border-rose-500 bg-rose-950/50 text-rose-200 font-bold rounded-xl flex items-center justify-center"
          >
            [ NEXT ➔ ACTION_RECOMMENDATION ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white text-slate-900 select-none">
      {/* Header matching screenshot */}
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-white">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-1 px-2 rounded-lg flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          {t.back}
        </button>

        <div className="text-center">
          <h2 className="text-sm font-bold text-slate-900">{t.testResult}</h2>
          <div className="text-[10px] text-slate-400">{patientName} • Step 6/7</div>
        </div>

        <div className="w-10" />
      </div>

      {/* Main Content matching Screenshot 6 */}
      <div className="flex-1 px-6 py-6 flex flex-col justify-between overflow-y-auto">
        <div className="w-full space-y-4">
          {/* Two-Analyte Readout Card */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
            {/* Ferritin Row */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#8B1E3F]" />
                <span className="text-sm font-bold text-slate-800">{t.ferritin}</span>
              </div>
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                  ferritin === 'Low'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {ferritin === 'Low' ? t.low : ferritin}
              </span>
            </div>

            {/* CRP Row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600" />
                <span className="text-sm font-bold text-slate-800">{t.crp}</span>
              </div>
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                  crp === 'Elevated'
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {crp === 'Normal' ? t.normal : t.elevated}
              </span>
            </div>
          </div>

          {/* AI Clinical Interpretation Box */}
          <div className="text-center pt-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t.interpretation}
            </span>

            <div className="mt-2 p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl shadow-xs">
              <h3 className="text-base font-extrabold text-emerald-900 leading-snug">
                {interpretation.includes('Likely Iron Deficiency')
                  ? t.likelyIronDeficiency
                  : interpretation}
              </h3>
              <p className="text-xs font-semibold text-emerald-700 mt-1">
                {isInflammation ? 'Elevated CRP indicates active inflammation/infection' : t.inflammationUnlikely}
              </p>
            </div>
          </div>

          {/* Confidence Indicator */}
          <div className="flex flex-col items-center justify-center pt-1">
            <div className="text-xs font-medium text-slate-500">{t.confidence}</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{confidence}%</div>
          </div>

          {/* Clinical Rationale Note */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] text-slate-600 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <span>
              Combining conjunctival pallor with low ferritin and normal CRP confirms <strong>pure Iron Deficiency Anemia (IDA)</strong>, ruling out anemia of chronic disease or malaria-induced acute response.
            </span>
          </div>
        </div>

        {/* Bottom Proceed Button */}
        <div className="pt-4 mt-auto">
          <button
            id="btn-interpretation-next"
            onClick={onNext}
            className="w-full py-3.5 rounded-xl bg-[#8B1E3F] text-white font-bold text-sm shadow-md shadow-[#8B1E3F]/20 hover:bg-[#731833] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <span>{t.next} (Clinical Recommendation)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
