import React from 'react';
import { Globe, ArrowRight, ShieldCheck, Sparkles, Smartphone, Droplet } from 'lucide-react';
import { LanguageCode } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../data/mockData';
import { TRANSLATIONS } from '../../data/translations';

interface SplashScreenProps {
  lang: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onStartOnboarding: () => void;
  onSkipToHome: () => void;
  isWireframe?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  lang,
  onSelectLanguage,
  onStartOnboarding,
  onSkipToHome,
  isWireframe,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  if (isWireframe) {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-200 p-5 font-mono text-xs select-none">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-4">
          <span className="font-bold text-slate-100">[SPLASH_SCREEN]</span>
          <span className="text-[10px] text-slate-500">ONBOARDING 0/3</span>
        </div>

        {/* Center Logo */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-rose-400 flex items-center justify-center text-3xl">
            🩸
          </div>
          <div className="text-xl font-bold text-slate-100">[HaemaScan AI]</div>
          <div className="text-xs text-slate-400">[Two-Layer Anemia Intelligence Platform]</div>

          {/* Wireframe Language Selector */}
          <div className="w-full max-w-xs mt-6 p-3 border border-slate-700 rounded bg-slate-950/40">
            <div className="text-[10px] text-slate-400 mb-2">[SELECT LOCAL LANGUAGE]</div>
            <div className="grid grid-cols-3 gap-1">
              {SUPPORTED_LANGUAGES.slice(0, 3).map((l) => (
                <button
                  key={l.code}
                  onClick={() => onSelectLanguage(l.code)}
                  className={`py-1 text-[10px] border rounded ${
                    lang === l.code ? 'border-rose-400 bg-rose-950/60 font-bold' : 'border-slate-700'
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-slate-800 space-y-2">
          <button
            onClick={onStartOnboarding}
            className="w-full h-12 border-2 border-rose-500 bg-rose-950/60 text-rose-200 font-bold rounded-xl flex items-center justify-center"
          >
            [ START ONBOARDING TUTORIAL ➔ ]
          </button>
          <button
            onClick={onSkipToHome}
            className="w-full py-2 text-[10px] text-slate-400 hover:text-slate-200 text-center"
          >
            [ SKIP DIRECTLY TO HOME CLINIC ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-[#1E1118] to-slate-950 text-white select-none relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#8B1E3F]/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />

      {/* Top Bar with Offline First Badge */}
      <div className="px-5 pt-4 pb-2 flex justify-between items-center z-10">
        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Offline-First Architecture
        </span>
        <span className="text-xs font-mono text-slate-400">Ghana Health Service</span>
      </div>

      {/* Hero Section matching Infographic Branding */}
      <div className="flex-1 px-6 flex flex-col items-center justify-center text-center z-10 py-6">
        {/* Teardrop Icon with Pulse */}
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#8B1E3F] to-rose-600 shadow-xl shadow-[#8B1E3F]/40 flex items-center justify-center border-2 border-rose-400/40">
            <svg
              viewBox="0 0 24 24"
              className="w-11 h-11 text-white fill-white"
              strokeWidth="0"
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
            AI
          </div>
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight font-sans">
          HaemaScan AI
        </h1>
        <p className="text-xs font-medium text-rose-200 mt-1 max-w-xs leading-relaxed">
          Two-Layer Anemia Intelligence Platform
        </p>

        {/* 5-Step Workflow Pill strip from Infographic */}
        <div className="mt-4 flex items-center gap-1 text-[10px] font-semibold text-slate-300 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full">
          <span>Screen</span>
          <span className="text-rose-400">➔</span>
          <span>Stratify</span>
          <span className="text-rose-400">➔</span>
          <span>Test</span>
          <span className="text-rose-400">➔</span>
          <span>Interpret</span>
          <span className="text-rose-400">➔</span>
          <span className="text-emerald-400">Act</span>
        </div>

        {/* Quick Language Selector for field workers */}
        <div className="w-full max-w-xs mt-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-lg backdrop-blur-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-rose-400" />
              Language / Kasa
            </span>
            <span className="text-[10px] font-normal text-slate-400">Tap to switch</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => onSelectLanguage(l.code)}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                  lang === l.code
                    ? 'bg-[#8B1E3F] text-white border-rose-400 shadow-xs scale-[1.02]'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {l.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="px-6 pb-6 pt-2 space-y-2 z-10">
        <button
          id="btn-start-onboarding"
          onClick={onStartOnboarding}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8B1E3F] to-rose-600 text-white font-bold text-sm shadow-xl shadow-rose-900/40 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>Get Started • CHW Onboarding</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onSkipToHome}
          className="w-full py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors text-center"
        >
          Skip Directly to Main Dashboard
        </button>
      </div>
    </div>
  );
};
