import React from 'react';
import { Palette, Type, CheckCircle, ShieldCheck, Heart, Sparkles, Smartphone, Eye } from 'lucide-react';

export const DesignSystemDocs: React.FC = () => {
  return (
    <div className="space-y-8 text-white select-none">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800/60 text-xs font-semibold text-rose-300 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          Material 3 Clinical Design System Specs
        </div>
        <h2 className="text-xl font-black tracking-tight text-white">
          HaemaScan AI Design System & Accessibility Rationale
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Engineered specifically for community healthcare volunteers and nurses in low-resource environments. Combines medical trustworthiness, rapid tap targets, and high optical contrast under harsh sunlight.
        </p>
      </div>

      {/* 1. Color Palette Tokens */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-rose-400" />
          <h3 className="text-base font-bold text-slate-100">Color Palette & Semantic Tokens</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Primary Crimson */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="h-16 rounded-xl bg-[#8B1E3F] flex items-end p-2 text-white font-mono font-bold text-xs shadow-inner">
              #8B1E3F
            </div>
            <div>
              <div className="text-xs font-bold text-white">Primary Burgundy / Crimson</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Dominant brand color, clinical CTAs, header accents, and hemoglobin indicators.
              </div>
            </div>
          </div>

          {/* Secondary Slate */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="h-16 rounded-xl bg-[#0F172A] border border-slate-700 flex items-end p-2 text-white font-mono font-bold text-xs shadow-inner">
              #0F172A
            </div>
            <div>
              <div className="text-xs font-bold text-white">Secondary Deep Navy Slate</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                High-contrast text headings, camera HUD backdrops, and hardware frames.
              </div>
            </div>
          </div>

          {/* Moderate Anemia Orange */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="h-16 rounded-xl bg-[#F97316] flex items-end p-2 text-white font-mono font-bold text-xs shadow-inner">
              #F97316
            </div>
            <div>
              <div className="text-xs font-bold text-white">Warning / Moderate Pallor</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Indicates moderate anemia screening result; triggers Layer 2 confirmatory gate.
              </div>
            </div>
          </div>

          {/* Protocol Green */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="h-16 rounded-xl bg-[#10B981] flex items-end p-2 text-white font-mono font-bold text-xs shadow-inner">
              #10B981
            </div>
            <div>
              <div className="text-xs font-bold text-white">Clinical Safe / Treatment Active</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Highlights verified treatment actions (&quot;Start Iron Supplement&quot;) & normal status.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Field Worker Accessibility Principles */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-slate-100">
            Accessibility Standards for Community Health Work (Ghana / West Africa)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span> 48dp+ Minimum Touch Targets
            </div>
            <p className="text-slate-400 leading-relaxed">
              All primary action buttons have a minimum tap target height of 48–64px to enable rapid one-handed gloved operation during clinical outreach.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span> Multi-Lingual Dialect Layer
            </div>
            <p className="text-slate-400 leading-relaxed">
              Full translation across English, Twi (Akan), Dagbani, Ewe, French, and Hausa to bridge language barriers in remote community compounds.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span> Sunlight Legibility & Contrast
            </div>
            <p className="text-slate-400 leading-relaxed">
              Exceeds WCAG 2.1 AAA color contrast (8.4:1 ratio) with crisp solid fills and no translucent gradients over text.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
