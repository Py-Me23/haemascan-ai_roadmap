import React, { useState, useEffect } from 'react';
import { ChevronLeft, Play, Pause, FastForward, Clock, AlertCircle, Droplets } from 'lucide-react';
import { LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../data/translations';

interface BioSenseTestScreenProps {
  lang: LanguageCode;
  patientName: string;
  onBack: () => void;
  onNext: () => void;
  isWireframe?: boolean;
}

export const BioSenseTestScreen: React.FC<BioSenseTestScreenProps> = ({
  lang,
  patientName,
  onBack,
  onNext,
  isWireframe,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // 15 minutes timer (900 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [timerFinished, setTimerFinished] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setTimerFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainderSecs).padStart(2, '0')}`;
  };

  const handleFastForward = () => {
    setSecondsRemaining(0);
    setIsRunning(false);
    setTimerFinished(true);
  };

  if (isWireframe) {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-200 p-4 font-mono text-xs select-none">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-3">
          <button onClick={onBack} className="text-slate-400">
            [ &lt; BACK ]
          </button>
          <span className="font-bold text-slate-100">[BIOSENSE_TEST_TIMER]</span>
          <span className="text-[10px] text-slate-500">STEP 4/7</span>
        </div>

        {/* Guidance Prompt */}
        <div className="p-2 border border-slate-700 bg-slate-950/40 rounded text-slate-300 text-center mb-3">
          &quot;{t.applyOneDrop}&quot;
        </div>

        {/* Wireframe Dropper & Well */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 my-2">
          <div className="w-36 h-36 border-2 border-dashed border-rose-500/70 rounded-full flex flex-col items-center justify-center p-3">
            <span className="text-2xl">🩸</span>
            <span className="text-[10px] text-rose-300 mt-1">[1 DROP SAMPLE WELL]</span>
          </div>

          <div className="text-center">
            <div className="text-3xl font-extrabold text-slate-100 tracking-wider">
              {formatTime(secondsRemaining)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{t.timeRemaining.toUpperCase()}</div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-3 py-1.5 border border-slate-600 rounded bg-slate-800"
            >
              {isRunning ? '[PAUSE]' : '[RESUME]'}
            </button>
            <button
              onClick={handleFastForward}
              className="px-3 py-1.5 border border-amber-500 rounded bg-amber-950/40 text-amber-300"
            >
              [DEMO: 00:00]
            </button>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-slate-800">
          <button
            onClick={onNext}
            className="w-full h-12 border-2 border-rose-500 bg-rose-950/50 text-rose-200 font-bold rounded-xl flex items-center justify-center"
          >
            [ NEXT ➔ SCAN_TEST_STRIP ]
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
          <h2 className="text-sm font-bold text-slate-900">{t.bioSenseTest}</h2>
          <div className="text-[10px] text-slate-400">{patientName} • Step 4/7</div>
        </div>

        <div className="w-10" />
      </div>

      {/* Main Guidance and Visual Dropper */}
      <div className="flex-1 px-6 py-4 flex flex-col items-center justify-between overflow-y-auto">
        <div className="w-full flex flex-col items-center">
          {/* Subtitle */}
          <p className="text-xs text-slate-600 font-medium text-center max-w-xs mb-4">
            {t.applyOneDrop}
          </p>

          {/* Animated Dropper & Cassette Illustration matching infographic */}
          <div className="relative w-64 h-44 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col items-center justify-center shadow-xs overflow-hidden">
            {/* Pipette / Dropper Illustration */}
            <div className="flex flex-col items-center mb-1 animate-bounce">
              {/* Dropper Rubber Bulb */}
              <div className="w-6 h-6 rounded-t-full bg-rose-900" />
              {/* Glass Tube */}
              <div className="w-2.5 h-10 bg-slate-300 relative flex flex-col justify-end items-center">
                <div className="w-full h-5 bg-[#8B1E3F]" />
              </div>
              {/* Nozzle & Hanging Blood Drop */}
              <div className="w-1.5 h-2 bg-slate-400" />
              <div className="w-3 h-3 rounded-full bg-[#8B1E3F] shadow-sm animate-pulse" />
            </div>

            {/* Cassette Sample Well Diagram */}
            <div className="w-44 h-10 bg-white border border-slate-300 rounded-lg shadow-inner flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border-2 border-rose-300 bg-rose-50 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8B1E3F]" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-700">Sample Well (S)</span>
              </div>
              <span className="text-[9px] font-mono text-slate-400">LOT: 8812</span>
            </div>
          </div>

          {/* Active 15-minute Timer Display */}
          <div className="mt-5 flex flex-col items-center">
            <div className="text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
              {formatTime(secondsRemaining)}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              {t.timeRemaining}
            </div>

            {/* Timer Control Buttons */}
            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => setIsRunning(!isRunning)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100 flex items-center gap-1.5 active:scale-95"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Resume
                  </>
                )}
              </button>

              {/* Fast Forward For Quick Clinical Demo */}
              <button
                type="button"
                onClick={handleFastForward}
                className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-[#8B1E3F] text-xs font-semibold hover:bg-rose-100 flex items-center gap-1.5 active:scale-95"
                title="Fast forward timer for instant demonstration"
              >
                <FastForward className="w-3.5 h-3.5" /> Fast-Forward (00:00)
              </button>
            </div>

            {timerFinished && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold animate-pulse">
                <span>🔔 Incubation Complete — Ready to Scan!</span>
              </div>
            )}
          </div>
        </div>

        {/* Proceed to Scan Button */}
        <div className="w-full max-w-xs pt-4 mt-auto">
          <button
            id="btn-biosense-next-scan"
            onClick={onNext}
            className="w-full py-3.5 rounded-xl bg-[#8B1E3F] text-white font-bold text-sm shadow-md shadow-[#8B1E3F]/20 hover:bg-[#731833] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <span>{t.next} (Scan Test Strip)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
