import React from 'react';

// Conjunctiva eye diagram & simulated sample views
export const ConjunctivaEyeVisual: React.FC<{
  type: 'sample1' | 'sample2' | 'sample3' | 'custom';
  isWireframe?: boolean;
}> = ({ type, isWireframe }) => {
  // Sample 1: Moderate Pallor (Pale pink/salmon conjunctiva)
  // Sample 2: Normal (Healthy rich red conjunctiva)
  // Sample 3: Mild/Severe Pallor
  if (isWireframe) {
    return (
      <div className="w-full h-full bg-slate-900 border-2 border-dashed border-slate-600 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
        <div className="w-48 h-28 border-2 border-slate-400 rounded-full flex items-center justify-center relative">
          <div className="w-16 h-16 rounded-full border-2 border-slate-400 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-slate-400" />
          </div>
          {/* Lower palpebral conjunctiva guide */}
          <div className="absolute -bottom-3 w-36 h-8 border-2 border-amber-400/80 rounded-b-full border-dashed flex items-center justify-center text-[10px] text-amber-300 font-mono">
            [Target Conjunctiva]
          </div>
        </div>
        <span className="text-xs font-mono text-slate-400 mt-4">WIREFRAME: EYE_VIEWFINDER_TARGET</span>
      </div>
    );
  }

  const getConjunctivaColor = () => {
    switch (type) {
      case 'sample1':
        return '#F2A285'; // Moderate pale salmon
      case 'sample2':
        return '#B83232'; // Healthy rich red
      case 'sample3':
        return '#FCD5CE'; // Severe very pale
      default:
        return '#E59880';
    }
  };

  const getIrisColor = () => {
    switch (type) {
      case 'sample1':
        return '#3D2314'; // Dark brown
      case 'sample2':
        return '#2C1B10';
      case 'sample3':
        return '#4A3525';
      default:
        return '#3D2314';
    }
  };

  return (
    <div className="relative w-full h-full min-h-[220px] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
      {/* Sclera & Iris Simulation SVG */}
      <svg viewBox="0 0 400 250" className="w-full h-full object-cover">
        <defs>
          <radialGradient id={`iris-grad-${type}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0a0a0a" />
            <stop offset="60%" stopColor={getIrisColor()} />
            <stop offset="85%" stopColor="#1a0f08" />
            <stop offset="100%" stopColor="#050505" />
          </radialGradient>
          <linearGradient id={`conjunctiva-grad-${type}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF0EB" />
            <stop offset="50%" stopColor={getConjunctivaColor()} />
            <stop offset="100%" stopColor="#C94C4C" />
          </linearGradient>
          <filter id="blur-filter">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* Ambient Face Skin tone */}
        <rect width="400" height="250" fill="#7A4B3A" />

        {/* Upper eyelid contour */}
        <path
          d="M 40 120 Q 200 40 360 120 Q 200 70 40 120"
          fill="#5C3426"
        />

        {/* Eye Opening (Sclera) */}
        <path
          d="M 50 120 Q 200 50 350 120 Q 200 190 50 120"
          fill="#FFF6F2"
        />

        {/* Sclera fine capillaries */}
        <path d="M 60 120 Q 100 115 130 118" stroke="#E29578" strokeWidth="0.8" fill="none" opacity="0.6" />
        <path d="M 340 120 Q 290 125 270 122" stroke="#E29578" strokeWidth="0.8" fill="none" opacity="0.6" />

        {/* Iris */}
        <circle cx="200" cy="120" r="54" fill={`url(#iris-grad-${type})`} />
        {/* Pupil */}
        <circle cx="200" cy="120" r="22" fill="#000000" />
        {/* Light reflection */}
        <circle cx="186" cy="108" r="7" fill="#FFFFFF" opacity="0.85" />
        <circle cx="212" cy="132" r="3.5" fill="#FFFFFF" opacity="0.6" />

        {/* Inverted Lower Eyelid (Palpebral Conjunctiva Zone - Key Clinical Area) */}
        <path
          d="M 70 140 Q 200 215 330 140 Q 200 180 70 140"
          fill={`url(#conjunctiva-grad-${type})`}
          filter="url(#blur-filter)"
        />

        {/* Microvascular capillary network in conjunctiva */}
        <path d="M 120 165 Q 160 185 200 178" stroke="#9E2A2B" strokeWidth="1.2" fill="none" opacity="0.5" />
        <path d="M 200 178 Q 240 185 280 168" stroke="#9E2A2B" strokeWidth="1.2" fill="none" opacity="0.5" />
        <path d="M 150 172 Q 180 188 220 182" stroke="#B83232" strokeWidth="0.9" fill="none" opacity="0.4" />

        {/* Lower Eyelid Pull-down Thumb / Finger position simulation */}
        <path
          d="M 130 205 Q 200 240 270 205 Q 200 260 130 205"
          fill="#5C3426"
          opacity="0.8"
        />

        {/* Target Region of Interest (ROI) Reticle */}
        <rect
          x="100"
          y="150"
          width="200"
          height="45"
          rx="12"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};

// BioSense Dual-Analyte Rapid Test Strip Visual
export const BioSenseCassetteVisual: React.FC<{
  ferritinLine: boolean;
  crpLine: boolean;
  isScanning?: boolean;
  isWireframe?: boolean;
}> = ({ ferritinLine, crpLine, isScanning, isWireframe }) => {
  if (isWireframe) {
    return (
      <div className="w-44 h-80 bg-slate-900 border-2 border-slate-400 rounded-xl p-3 flex flex-col items-center justify-between font-mono text-[11px] text-slate-400">
        <div className="w-full text-center border-b border-slate-700 pb-1">
          [CASSETTE_HEAD: S_WELL]
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-slate-500 flex items-center justify-center">
          ( S )
        </div>
        <div className="w-20 h-40 border border-slate-500 rounded p-2 flex flex-col justify-around">
          <div className="flex justify-between items-center text-xs">
            <span>C</span>
            <span className="w-10 h-1.5 bg-slate-400 rounded"></span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span>F</span>
            <span className={`w-10 h-1.5 ${ferritinLine ? 'bg-slate-400' : 'bg-transparent border border-slate-600'} rounded`}></span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span>CRP</span>
            <span className={`w-10 h-1.5 ${crpLine ? 'bg-slate-400' : 'bg-transparent border border-slate-600'} rounded`}></span>
          </div>
        </div>
        <div className="text-[9px] text-slate-500">LOT: BIO-26-8812</div>
      </div>
    );
  }

  return (
    <div className="relative w-44 h-84 bg-gradient-to-b from-slate-100 to-slate-200 border-2 border-slate-300 rounded-2xl shadow-xl p-3 flex flex-col items-center justify-between text-slate-800 font-sans select-none">
      {/* Brand & Cassette Header */}
      <div className="w-full flex items-center justify-between px-1">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#8B1E3F]" />
          <span className="text-[11px] font-bold tracking-tight text-[#8B1E3F]">BioSense</span>
        </div>
        <span className="text-[8px] font-mono text-slate-500 uppercase">Fe + CRP</span>
      </div>

      {/* Sample Well (S) */}
      <div className="flex flex-col items-center">
        <div className="w-11 h-11 rounded-full bg-slate-300 shadow-inner border border-slate-400 flex items-center justify-center relative overflow-hidden">
          <div className="w-7 h-7 rounded-full bg-slate-200 shadow-inner flex items-center justify-center">
            {/* Blood sample drop residue */}
            <div className="w-4 h-4 rounded-full bg-[#8B1E3F]/80 blur-[0.5px]" />
          </div>
        </div>
        <span className="text-[9px] font-semibold text-slate-500 mt-1 font-mono">S</span>
      </div>

      {/* Readout Nitrocellulose Membrane Window */}
      <div className="relative w-24 h-44 bg-white rounded-lg shadow-inner border border-slate-300 p-2 flex flex-col justify-between">
        {/* Flow indicator arrow */}
        <div className="absolute top-1 right-1 text-[8px] text-slate-300">▼</div>

        {/* Control Line (C) - Always present if valid test */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-700 w-6">C</span>
          <div className="flex-1 h-1.5 bg-[#B83232] rounded-full mx-1 shadow-sm" />
        </div>

        {/* Ferritin Test Line (F) */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-700 w-6">F</span>
          {ferritinLine ? (
            <div className="flex-1 h-1.5 bg-[#B83232]/85 rounded-full mx-1 shadow-sm" />
          ) : (
            <div className="flex-1 h-1.5 bg-slate-100 border border-dashed border-slate-300 rounded-full mx-1" />
          )}
        </div>

        {/* CRP Test Line (CRP) */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-700 w-6">CRP</span>
          {crpLine ? (
            <div className="flex-1 h-1.5 bg-[#B83232]/85 rounded-full mx-1 shadow-sm" />
          ) : (
            <div className="flex-1 h-1.5 bg-slate-100 border border-dashed border-slate-300 rounded-full mx-1" />
          )}
        </div>
      </div>

      {/* Scanning Laser Line FX */}
      {isScanning && (
        <div className="absolute inset-x-2 top-24 h-0.5 bg-emerald-500 shadow-[0_0_8px_#10b981] animate-bounce" />
      )}

      {/* Footer Barcode & Lot Number */}
      <div className="w-full flex items-center justify-between text-[8px] font-mono text-slate-400 border-t border-slate-200 pt-1">
        <span>LOT: BIO-26-8812</span>
        <span>EXP: 2027/12</span>
      </div>
    </div>
  );
};
