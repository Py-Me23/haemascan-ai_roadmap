import React, { useState } from 'react';
import { ChevronLeft, Camera, RefreshCw, CheckCircle2, Zap } from 'lucide-react';
import { LanguageCode } from '../../types';
import { TRANSLATIONS } from '../../data/translations';
import { BioSenseCassetteVisual } from '../visuals/ClinicalVisuals';

interface ScanTestStripScreenProps {
  lang: LanguageCode;
  patientName: string;
  onBack: () => void;
  onScanned: (result: {
    ferritin: 'Low' | 'Normal' | 'High';
    crp: 'Normal' | 'Elevated';
    confidence: number;
    interpretation: string;
  }) => void;
  isWireframe?: boolean;
}

export const ScanTestStripScreen: React.FC<ScanTestStripScreenProps> = ({
  lang,
  patientName,
  onBack,
  onScanned,
  isWireframe,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [isScanning, setIsScanning] = useState(false);
  const [stripScenario, setStripScenario] = useState<'iron_deficiency' | 'inflammation' | 'normal'>('iron_deficiency');

  const handleCapture = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (stripScenario === 'iron_deficiency') {
        // Ferritin: Low, CRP: Normal
        onScanned({
          ferritin: 'Low',
          crp: 'Normal',
          confidence: 88,
          interpretation: 'Likely Iron Deficiency (Inflammation Unlikely)',
        });
      } else if (stripScenario === 'inflammation') {
        // Ferritin: Low/Elevated, CRP: Elevated
        onScanned({
          ferritin: 'Low',
          crp: 'Elevated',
          confidence: 89,
          interpretation: 'Severe Anemia with Mixed Etiology / Acute Inflammation',
        });
      } else {
        // Normal
        onScanned({
          ferritin: 'Normal',
          crp: 'Normal',
          confidence: 93,
          interpretation: 'Normal Iron Stores & No Significant Inflammation',
        });
      }
    }, 1000);
  };

  if (isWireframe) {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-200 p-4 font-mono text-xs select-none">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-3">
          <button onClick={onBack} className="text-slate-400">
            [ &lt; BACK ]
          </button>
          <span className="font-bold text-slate-100">[SCAN_TEST_STRIP]</span>
          <span className="text-[10px] text-slate-500">STEP 5/7</span>
        </div>

        {/* Guidance Prompt */}
        <div className="p-2 border border-slate-700 bg-slate-950/40 rounded text-slate-300 text-center mb-3">
          &quot;{t.placeStripFlat}&quot;
        </div>

        {/* Viewfinder Target */}
        <div className="flex-1 flex flex-col items-center justify-center relative my-2">
          <BioSenseCassetteVisual
            ferritinLine={stripScenario !== 'normal'}
            crpLine={stripScenario === 'inflammation'}
            isScanning={isScanning}
            isWireframe={true}
          />
        </div>

        {/* Wireframe Scenario Picker */}
        <div className="flex gap-1.5 my-2">
          <button
            onClick={() => setStripScenario('iron_deficiency')}
            className={`flex-1 py-1 rounded border text-[10px] ${
              stripScenario === 'iron_deficiency' ? 'border-rose-400 bg-rose-950/60 font-bold' : 'border-slate-700'
            }`}
          >
            [LOW Fe + NORM CRP]
          </button>
          <button
            onClick={() => setStripScenario('inflammation')}
            className={`flex-1 py-1 rounded border text-[10px] ${
              stripScenario === 'inflammation' ? 'border-amber-400 bg-amber-950/60 font-bold' : 'border-slate-700'
            }`}
          >
            [HIGH CRP]
          </button>
        </div>

        {/* Wireframe Shutter */}
        <div className="mt-auto pt-3 border-t border-slate-800 flex justify-between items-center">
          <div className="text-[10px] text-slate-400">ALIGN: OPTIMAL</div>
          <button
            onClick={handleCapture}
            disabled={isScanning}
            className="w-16 h-16 rounded-full border-4 border-rose-500 bg-rose-950/60 flex items-center justify-center font-bold text-rose-200"
          >
            [SCAN]
          </button>
          <div className="text-[10px] text-slate-400">FLAT 90°</div>
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
          <h2 className="text-sm font-bold text-slate-100">{t.scanTestStrip}</h2>
          <div className="text-[10px] text-slate-400">{patientName} • Step 5/7</div>
        </div>

        <div className="w-10" />
      </div>

      {/* Guidance Banner as in Screenshot */}
      <div className="bg-slate-800/90 px-4 py-2 border-b border-slate-700/60 flex items-center justify-center text-center">
        <p className="text-xs font-medium text-slate-200">
          {t.placeStripFlat}
        </p>
      </div>

      {/* Main Viewfinder Section */}
      <div className="flex-1 px-4 py-2 flex flex-col items-center justify-center relative">
        <div className="w-full max-w-xs min-h-[290px] rounded-2xl bg-black border-2 border-slate-700 relative flex flex-col items-center justify-center p-3 shadow-2xl">
          {/* Rectangular Targeting Box matching the infographic */}
          <div className="absolute inset-4 border-2 border-dashed border-emerald-400/80 rounded-xl pointer-events-none flex flex-col justify-between p-2">
            <div className="flex justify-between text-[9px] font-mono text-emerald-300">
              <span>┌ CASSETTE FRAME</span>
              <span>AUTO-ALIGN ┐</span>
            </div>
            <div className="flex justify-between text-[9px] font-mono text-emerald-300">
              <span>└ FLAT SURFACE</span>
              <span>100% FOCUS ┘</span>
            </div>
          </div>

          <BioSenseCassetteVisual
            ferritinLine={stripScenario !== 'normal'}
            crpLine={stripScenario === 'inflammation'}
            isScanning={isScanning}
          />
        </div>

        {/* Scenario Toggle */}
        <div className="w-full max-w-xs mt-3">
          <div className="flex justify-between items-center mb-1 text-[11px] text-slate-400">
            <span>Simulate Cassette Result:</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setStripScenario('iron_deficiency')}
              className={`py-1 px-2 rounded-lg text-[10px] font-semibold border transition-all ${
                stripScenario === 'iron_deficiency'
                  ? 'bg-[#8B1E3F] text-white border-rose-400 shadow-xs'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              Fe Low + CRP Normal
            </button>
            <button
              onClick={() => setStripScenario('inflammation')}
              className={`py-1 px-2 rounded-lg text-[10px] font-semibold border transition-all ${
                stripScenario === 'inflammation'
                  ? 'bg-amber-600 text-white border-amber-400 shadow-xs'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              Fe Low + CRP High
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Shutter Action Bar */}
      <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-center items-center">
        <button
          id="btn-scan-strip-shutter"
          onClick={handleCapture}
          disabled={isScanning}
          className="w-16 h-16 rounded-full bg-white p-1 shadow-lg shadow-rose-900/30 active:scale-95 transition-all flex items-center justify-center group disabled:opacity-50"
        >
          <div className="w-13 h-13 rounded-full bg-[#8B1E3F] border-2 border-white flex items-center justify-center">
            {isScanning ? (
              <RefreshCw className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Camera className="w-6 h-6 text-white" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
