import React, { useState } from 'react';
import { Camera, Zap, ZapOff, Sparkles, AlertCircle, RefreshCw, CheckCircle2, ChevronLeft } from 'lucide-react';
import { LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { ConjunctivaEyeVisual } from '../visuals/ClinicalVisuals';

interface CaptureEyeScreenProps {
  lang: LanguageCode;
  patientName: string;
  onBack: () => void;
  onCaptured: (eyeData: {
    sampleType: 'sample1' | 'sample2' | 'sample3';
    severity: 'Normal' | 'Mild' | 'Moderate' | 'Severe';
    confidence: number;
    estimatedHb: number;
  }) => void;
  isWireframe?: boolean;
}

export const CaptureEyeScreen: React.FC<CaptureEyeScreenProps> = ({
  lang,
  patientName,
  onBack,
  onCaptured,
  isWireframe,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [selectedSample, setSelectedSample] = useState<'sample1' | 'sample2' | 'sample3'>('sample1');
  const [flashOn, setFlashOn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lightingLux, setLightingLux] = useState(480); // optimal lighting > 350 lux

  const handleCapture = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (selectedSample === 'sample1') {
        // Moderate Anemia
        onCaptured({
          sampleType: 'sample1',
          severity: 'Moderate',
          confidence: 86,
          estimatedHb: 8.6,
        });
      } else if (selectedSample === 'sample2') {
        // Normal
        onCaptured({
          sampleType: 'sample2',
          severity: 'Normal',
          confidence: 94,
          estimatedHb: 13.8,
        });
      } else {
        // Severe Anemia
        onCaptured({
          sampleType: 'sample3',
          severity: 'Severe',
          confidence: 91,
          estimatedHb: 6.4,
        });
      }
    }, 900);
  };

  if (isWireframe) {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-200 p-4 font-mono text-xs select-none">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-3">
          <button onClick={onBack} className="text-slate-400">
            [ &lt; BACK ]
          </button>
          <span className="font-bold text-slate-100">[CAPTURE_EYE_IMAGE]</span>
          <span className="text-[10px] text-slate-500">STEP 2/7</span>
        </div>

        {/* Guidance Prompt */}
        <div className="p-2 border border-dashed border-amber-500/80 bg-amber-950/30 rounded text-amber-300 text-[11px] mb-3 text-center">
          &quot;{t.pullDownEyelid}&quot;
        </div>

        {/* Viewfinder Target */}
        <div className="flex-1 flex flex-col items-center justify-center relative my-2">
          <ConjunctivaEyeVisual type={selectedSample} isWireframe={true} />
        </div>

        {/* Sample Selection */}
        <div className="flex gap-2 my-2">
          <button
            onClick={() => setSelectedSample('sample1')}
            className={`flex-1 py-1.5 rounded border text-[10px] ${
              selectedSample === 'sample1' ? 'border-amber-400 bg-amber-950/60 font-bold' : 'border-slate-700'
            }`}
          >
            [MODERATE PALLOR]
          </button>
          <button
            onClick={() => setSelectedSample('sample2')}
            className={`flex-1 py-1.5 rounded border text-[10px] ${
              selectedSample === 'sample2' ? 'border-emerald-400 bg-emerald-950/60 font-bold' : 'border-slate-700'
            }`}
          >
            [NORMAL]
          </button>
          <button
            onClick={() => setSelectedSample('sample3')}
            className={`flex-1 py-1.5 rounded border text-[10px] ${
              selectedSample === 'sample3' ? 'border-rose-400 bg-rose-950/60 font-bold' : 'border-slate-700'
            }`}
          >
            [SEVERE]
          </button>
        </div>

        {/* Wireframe Shutter */}
        <div className="mt-auto pt-3 border-t border-slate-800 flex justify-between items-center">
          <button
            onClick={() => setFlashOn(!flashOn)}
            className="w-10 h-10 border border-slate-600 rounded-full flex items-center justify-center text-slate-400"
          >
            ⚡
          </button>

          <button
            onClick={handleCapture}
            disabled={isProcessing}
            className="w-16 h-16 rounded-full border-4 border-rose-500 bg-rose-950/60 flex items-center justify-center font-bold text-rose-200"
          >
            [O]
          </button>

          <div className="w-10 text-right text-[10px] text-slate-500">
            480LX
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white select-none relative overflow-hidden">
      {/* Top Bar matching screenshot */}
      <div className="px-4 py-3 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 flex justify-between items-center z-10">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-400 hover:text-white py-1 px-2 rounded-lg flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          {t.back}
        </button>

        <div className="text-center">
          <h2 className="text-sm font-bold text-slate-100">{t.captureImage}</h2>
          <div className="text-[10px] text-slate-400">{patientName} • Step 2/7</div>
        </div>

        <button
          onClick={() => setFlashOn(!flashOn)}
          className={`p-1.5 rounded-full border transition-all ${
            flashOn
              ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-xs'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
          title="Toggle Flash / Torch"
        >
          {flashOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
        </button>
      </div>

      {/* Guidance Banner as in Infographic */}
      <div className="bg-slate-800/90 px-4 py-2 border-b border-slate-700/60 flex items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          {t.pullDownEyelid}
        </p>
      </div>

      {/* Main Viewfinder Section */}
      <div className="flex-1 px-4 py-2 flex flex-col items-center justify-center relative">
        <div className="w-full max-w-xs aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700 relative bg-black">
          <ConjunctivaEyeVisual type={selectedSample} />

          {/* Alignment HUD Overlays */}
          <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
            {/* Top HUD indicators */}
            <div className="flex justify-between items-center text-[10px] bg-black/60 backdrop-blur-xs px-2 py-1 rounded-md text-slate-300">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Focus Locked
              </span>
              <span className="font-mono text-emerald-300 font-semibold">{lightingLux} Lux (Optimal)</span>
            </div>

            {/* Bottom HUD indicator */}
            <div className="text-center">
              <span className="text-[10px] font-mono tracking-wider bg-rose-900/80 text-rose-200 px-2 py-0.5 rounded-full border border-rose-700">
                LOWER CONJUNCTIVA ROI
              </span>
            </div>
          </div>
        </div>

        {/* Clinical Eye Case Selector (Preset Samples to test the AI) */}
        <div className="w-full max-w-xs mt-3">
          <div className="flex justify-between items-center mb-1 text-[11px] text-slate-400">
            <span>Simulation Preset:</span>
            <span className="text-rose-400 font-medium">
              {selectedSample === 'sample1'
                ? 'Moderate Pallor'
                : selectedSample === 'sample2'
                ? 'Healthy Normal'
                : 'Severe Pallor'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => setSelectedSample('sample1')}
              className={`py-1 px-2 rounded-lg text-[10px] font-semibold border transition-all ${
                selectedSample === 'sample1'
                  ? 'bg-[#8B1E3F] text-white border-rose-400 shadow-xs'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              1. Moderate (8.6g)
            </button>
            <button
              onClick={() => setSelectedSample('sample2')}
              className={`py-1 px-2 rounded-lg text-[10px] font-semibold border transition-all ${
                selectedSample === 'sample2'
                  ? 'bg-emerald-700 text-white border-emerald-400 shadow-xs'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              2. Normal (13.8g)
            </button>
            <button
              onClick={() => setSelectedSample('sample3')}
              className={`py-1 px-2 rounded-lg text-[10px] font-semibold border transition-all ${
                selectedSample === 'sample3'
                  ? 'bg-rose-700 text-white border-rose-400 shadow-xs'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              3. Severe (6.4g)
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Shutter Action Bar */}
      <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
        <button
          onClick={() => setSelectedSample(selectedSample === 'sample1' ? 'sample2' : 'sample1')}
          className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 active:scale-95"
          title="Switch Sample"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Shutter Button matching Android Camera design */}
        <button
          id="btn-capture-shutter"
          onClick={handleCapture}
          disabled={isProcessing}
          className="w-16 h-16 rounded-full bg-white p-1 shadow-lg shadow-rose-900/30 active:scale-95 transition-all flex items-center justify-center group disabled:opacity-50"
        >
          <div className="w-13 h-13 rounded-full bg-[#8B1E3F] border-2 border-white flex items-center justify-center">
            {isProcessing ? (
              <RefreshCw className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Camera className="w-6 h-6 text-white" />
            )}
          </div>
        </button>

        <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-mono">
          RAW
        </div>
      </div>
    </div>
  );
};
