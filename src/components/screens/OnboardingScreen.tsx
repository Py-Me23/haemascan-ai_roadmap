import React, { useState } from 'react';
import { Eye, TestTube, CheckCircle2, ChevronRight, ChevronLeft, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface OnboardingScreenProps {
  lang: LanguageCode;
  onFinishOnboarding: () => void;
  isWireframe?: boolean;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  lang,
  onFinishOnboarding,
  isWireframe,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    {
      title: 'Two-Layer Intelligence',
      subtitle: 'Screen → Stratify → Test → Interpret → Act',
      icon: '🧠',
      content: (
        <div className="space-y-3">
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8B1E3F]">
              <Eye className="w-4 h-4 text-[#8B1E3F]" />
              Layer 1: Smartphone Vision AI
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Analyzes conjunctival microvascular pallor to estimate hemoglobin severity instantly at $0 marginal cost.
            </p>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
              <TestTube className="w-4 h-4 text-indigo-700" />
              Layer 2: BioSense Rapid Test
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              For patients who screen positive, a low-cost dual analyte (Ferritin + CRP) strip is performed and read by AI.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'How to Capture Conjunctiva',
      subtitle: 'Layer 1 Eye Alignment Technique',
      icon: '👁️',
      content: (
        <div className="space-y-3">
          <div className="aspect-16/9 bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
            <div className="w-24 h-14 border-2 border-amber-400 rounded-full flex items-center justify-center relative">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-white flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
              </div>
              <div className="absolute -bottom-2 w-18 h-4 border-b-2 border-rose-400 rounded-b-full bg-rose-500/30" />
            </div>
            <span className="text-[11px] text-amber-300 font-semibold mt-3">
              1. Ask patient to look straight
            </span>
            <span className="text-[10px] text-slate-300">
              2. Gently pull down lower eyelid with clean thumb
            </span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 space-y-1">
            <div className="font-bold text-slate-900">Optimal Lighting Rule:</div>
            <div>Position patient facing natural daylight or enable phone torch. Avoid heavy shadows.</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Inflammation-Aware Decisions',
      subtitle: 'Solving the Anemia Misdiagnosis Problem',
      icon: '🛡️',
      content: (
        <div className="space-y-3">
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Why CRP Matters in Africa / High-Infection Regions
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              In malaria & infection endemic zones, ferritin levels can falsely elevate. HaemaScan AI simultaneously measures <strong>CRP (Inflammation)</strong> to ensure patients receive proper iron vs infection treatment.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Facility:</span>
              <span className="text-slate-900 font-bold">Pantang Health Centre</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>CHW ID:</span>
              <span className="text-slate-900 font-bold">CHW-042 (Kofi Owusu)</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  if (isWireframe) {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-200 p-4 font-mono text-xs select-none">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-3">
          <span className="font-bold text-slate-100">[ONBOARDING_TUTORIAL]</span>
          <span className="text-[10px] text-slate-500">STEP {currentStep + 1}/3</span>
        </div>

        <div className="flex-1 flex flex-col justify-between py-2">
          <div>
            <div className="text-sm font-bold text-slate-100 mb-1">
              [{steps[currentStep].title.toUpperCase()}]
            </div>
            <div className="text-[10px] text-slate-400 mb-4">
              {steps[currentStep].subtitle}
            </div>

            <div className="p-4 border border-slate-700 rounded bg-slate-950/40 min-h-[180px]">
              {steps[currentStep].content}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="text-slate-400 disabled:opacity-30"
            >
              [ &lt; PREV ]
            </button>

            <div className="flex gap-1">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    currentStep === idx ? 'bg-rose-500' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            {currentStep < 2 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="text-rose-400 font-bold"
              >
                [ NEXT &gt; ]
              </button>
            ) : (
              <button
                onClick={onFinishOnboarding}
                className="text-emerald-400 font-bold"
              >
                [ FINISH ➔ ]
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white text-slate-900 select-none">
      {/* Top Bar with Step Indicators */}
      <div className="px-5 pt-4 pb-2 flex justify-between items-center">
        <button
          onClick={onFinishOnboarding}
          className="text-xs font-semibold text-slate-400 hover:text-slate-700 py-1"
        >
          Skip
        </button>

        {/* Step Dots */}
        <div className="flex gap-1.5">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentStep === idx ? 'w-6 bg-[#8B1E3F]' : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>

        <span className="text-xs font-bold text-slate-500 font-mono">
          {currentStep + 1} / 3
        </span>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-4 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          <div className="text-center mt-1">
            <span className="text-3xl mb-2 inline-block">{steps[currentStep].icon}</span>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              {steps[currentStep].title}
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              {steps[currentStep].subtitle}
            </p>
          </div>

          <div className="pt-2">{steps[currentStep].content}</div>
        </div>

        {/* Navigation CTAs */}
        <div className="pt-4 mt-auto flex items-center gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="py-3.5 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-bold text-xs hover:bg-slate-100 active:scale-95 transition-all flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex-1 py-3.5 rounded-xl bg-[#8B1E3F] text-white font-bold text-sm shadow-md shadow-[#8B1E3F]/20 hover:bg-[#731833] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-complete-onboarding"
              onClick={onFinishOnboarding}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#8B1E3F] to-rose-600 text-white font-bold text-sm shadow-md shadow-[#8B1E3F]/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <span>Launch Clinic Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
