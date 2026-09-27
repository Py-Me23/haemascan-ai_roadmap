import React from 'react';
import { ChevronLeft, AlertTriangle, CheckCircle2, ChevronRight, Activity, ArrowRight } from 'lucide-react';
import { LanguageCode, Severity } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface ScreeningResultScreenProps {
  lang: LanguageCode;
  patientName: string;
  severity: Severity;
  confidence: number;
  estimatedHb: number;
  onBack: () => void;
  onNext: () => void;
  onSkipToRecommendation?: () => void;
  isWireframe?: boolean;
}

export const ScreeningResultScreen: React.FC<ScreeningResultScreenProps> = ({
  lang,
  patientName,
  severity,
  confidence,
  estimatedHb,
  onBack,
  onNext,
  onSkipToRecommendation,
  isWireframe,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const isPositive = severity === 'Moderate' || severity === 'Severe' || severity === 'Mild';
  const requiresLayer2 = severity === 'Moderate' || severity === 'Severe';

  // Semicircular progress arc calculation
  // Normal: ~25%, Mild: ~50%, Moderate: ~75%, Severe: ~95%
  const getSeverityPercent = () => {
    switch (severity) {
      case 'Normal':
        return 25;
      case 'Mild':
        return 50;
      case 'Moderate':
        return 75;
      case 'Severe':
        return 95;
      default:
        return 75;
    }
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'Normal':
        return '#10B981'; // Green
      case 'Mild':
        return '#F59E0B'; // Yellow/Orange
      case 'Moderate':
        return '#F97316'; // Deep Orange (Matching screenshot arc)
      case 'Severe':
        return '#EF4444'; // Red
      default:
        return '#F97316';
    }
  };

  if (isWireframe) {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-200 p-4 font-mono text-xs select-none">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-3">
          <button onClick={onBack} className="text-slate-400">
            [ &lt; BACK ]
          </button>
          <span className="font-bold text-slate-100">[SCREENING_RESULT]</span>
          <span className="text-[10px] text-slate-500">STEP 3/7</span>
        </div>

        {/* Arc Gauge Box */}
        <div className="flex-1 flex flex-col items-center justify-center my-4">
          <div className="w-48 h-32 border-t-4 border-l-4 border-r-4 border-amber-500 rounded-t-full flex flex-col items-center justify-center pt-6 bg-slate-950/40">
            <span className="text-base font-bold text-amber-300">
              [{severity.toUpperCase()} ANEMIA]
            </span>
            <span className="text-[10px] text-slate-400">(PROBABLE)</span>
            <span className="text-xs text-slate-300 mt-2 font-mono">CONF: {confidence}%</span>
          </div>

          <div className="mt-4 p-3 border border-dashed border-slate-600 rounded bg-slate-950/30 text-center w-full max-w-xs">
            <div className="text-[10px] text-slate-400">ESTIMATED_HB: {estimatedHb} g/dL</div>
            <div className="text-xs text-slate-200 font-bold mt-1">
              {requiresLayer2
                ? `[STRATIFICATION: ${t.proceedConfirmatory.toUpperCase()}]`
                : '[STRATIFICATION: ROUTINE MONITORING]'}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-3 border-t border-slate-800">
          <button
            onClick={requiresLayer2 ? onNext : (onSkipToRecommendation || onNext)}
            className="w-full h-12 border-2 border-rose-500 bg-rose-950/50 text-rose-200 font-bold rounded-xl flex items-center justify-center"
          >
            [ {requiresLayer2 ? 'PROCEED TO BIOSENSE TEST ➔' : 'VIEW RECOMMENDATION ➔'} ]
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
          <h2 className="text-sm font-bold text-slate-900">{t.screeningResult}</h2>
          <div className="text-[10px] text-slate-400">{patientName} • Step 3/7</div>
        </div>

        <div className="w-10" />
      </div>

      {/* Main Body with Semicircular Gauge (Direct translation of the Screenshot) */}
      <div className="flex-1 px-6 py-6 flex flex-col items-center justify-between overflow-y-auto">
        <div className="w-full flex flex-col items-center mt-2">
          {/* Gauge Component */}
          <div className="relative w-64 h-44 flex flex-col items-center justify-end">
            <svg viewBox="0 0 200 120" className="w-full h-full">
              {/* Background Arc */}
              <path
                d="M 20 110 A 80 80 0 0 1 180 110"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="14"
                strokeLinecap="round"
              />

              {/* Severity Segment Markers (Normal, Mild, Moderate, Severe) */}
              <path
                d="M 20 110 A 80 80 0 0 1 180 110"
                fill="none"
                stroke={getSeverityColor()}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 * (1 - getSeverityPercent() / 100)}
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner Center Label inside the arc */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 text-center">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {severity === 'Moderate'
                  ? t.moderateAnemia
                  : severity === 'Normal'
                  ? t.normal
                  : severity === 'Mild'
                  ? t.mild
                  : t.severe}
              </span>
              <span className="text-xs text-slate-500 font-medium">(Probable)</span>

              <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
                <span>{t.confidence}</span>
                <span className="font-bold text-slate-900">{confidence}%</span>
              </div>
            </div>
          </div>

          {/* Color Stratification Spectrum Bar */}
          <div className="w-full max-w-xs mt-3 flex items-center justify-between text-[10px] font-medium text-slate-500 px-2">
            <span className={severity === 'Normal' ? 'font-bold text-emerald-600' : ''}>Normal</span>
            <span className={severity === 'Mild' ? 'font-bold text-amber-600' : ''}>Mild</span>
            <span className={severity === 'Moderate' ? 'font-bold text-orange-600' : ''}>Moderate</span>
            <span className={severity === 'Severe' ? 'font-bold text-rose-600' : ''}>Severe</span>
          </div>

          {/* Estimated Hemoglobin Tile */}
          <div className="w-full max-w-xs mt-4 p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#8B1E3F]" />
              <span className="text-xs font-semibold text-slate-700">Estimated Hemoglobin (Hb)</span>
            </div>
            <span className="text-sm font-mono font-extrabold text-[#8B1E3F]">
              ~{estimatedHb} g/dL
            </span>
          </div>

          {/* Clinical Stratification Decision Callout */}
          <div className="w-full max-w-xs mt-3 p-3.5 bg-rose-50 border border-rose-100 rounded-xl">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#8B1E3F] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-[#8B1E3F]">
                  Layer 1 Screening Positive
                </div>
                <p className="text-[11px] text-slate-700 mt-0.5 leading-relaxed">
                  {requiresLayer2
                    ? t.proceedConfirmatory
                    : 'Low risk of anemia. Recommend dietary education and routine annual follow-up.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="w-full max-w-xs pt-4 mt-auto">
          {requiresLayer2 ? (
            <button
              id="btn-screening-proceed-layer2"
              onClick={onNext}
              className="w-full py-3.5 rounded-xl bg-[#8B1E3F] text-white font-bold text-sm shadow-md shadow-[#8B1E3F]/20 hover:bg-[#731833] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <span>{t.next} (Layer 2 BioSense)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-screening-finish-normal"
              onClick={onSkipToRecommendation || onNext}
              className="w-full py-3.5 rounded-xl bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 hover:bg-emerald-800 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <span>{t.viewDetails}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
