import React from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, Eye, TestTube, FileText, Users, BarChart3, Settings, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';
import { ScreenId } from '../../types';

interface WorkflowFlowMapProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
}

export const WorkflowFlowMap: React.FC<WorkflowFlowMapProps> = ({
  currentScreen,
  onSelectScreen,
}) => {
  return (
    <div className="space-y-8 select-none">
      {/* Overview Intro Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800/60 text-xs font-semibold text-rose-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              Two-Layer Anemia Intelligence Platform Architecture
            </div>
            <h2 className="text-xl font-black tracking-tight text-white">
              End-to-End Android Workflow & Clinical Logic Flow
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Designed for Community Health Workers (CHWs) and primary clinics. Combines $0 non-invasive Vision AI conjunctival screening with confirmatory rapid dual-analyte point-of-care BioSense testing.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive: Click any node to preview screen</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: ONBOARDING & SETUP WORKFLOW */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#8B1E3F] text-white flex items-center justify-center text-xs font-bold">
            A
          </div>
          <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
            User Onboarding & Facility Setup Flow
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Node 1: Splash & Language */}
          <div
            onClick={() => onSelectScreen('splash')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-slate-500 relative ${
              currentScreen === 'splash'
                ? 'bg-rose-950/40 border-[#8B1E3F] shadow-lg shadow-rose-950/40'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                STEP 0.1
              </span>
              {currentScreen === 'splash' && (
                <span className="text-[10px] font-bold text-rose-400">ACTIVE IN PHONE</span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white">Splash & Dialect Selection</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Instant 1-tap dialect switch (English, Twi, Dagbani, Ewe, Hausa) & offline storage verification.
            </p>
          </div>

          {/* Node 2: CHW Calibration Guide */}
          <div
            onClick={() => onSelectScreen('onboarding')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-slate-500 relative ${
              currentScreen === 'onboarding'
                ? 'bg-rose-950/40 border-[#8B1E3F] shadow-lg shadow-rose-950/40'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                STEP 0.2
              </span>
              {currentScreen === 'onboarding' && (
                <span className="text-[10px] font-bold text-rose-400">ACTIVE IN PHONE</span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white">Two-Layer Education & Tutorial</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Illustrated protocol training on lower palpebral conjunctiva inversion & inflammation-aware CRP.
            </p>
          </div>

          {/* Node 3: Home Dashboard */}
          <div
            onClick={() => onSelectScreen('home')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-slate-500 relative ${
              currentScreen === 'home'
                ? 'bg-rose-950/40 border-[#8B1E3F] shadow-lg shadow-rose-950/40'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                HUB
              </span>
              {currentScreen === 'home' && (
                <span className="text-[10px] font-bold text-rose-400">ACTIVE IN PHONE</span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white">Clinical Hub Dashboard</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Dominant primary trigger: &quot;Start New Screening&quot; (&lt;2s cold-start field speed).
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: MAIN 7-STEP CLINICAL TASK EXECUTION FLOW (Screen -> Stratify -> Test -> Interpret -> Act) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#8B1E3F] text-white flex items-center justify-center text-xs font-bold">
              B
            </div>
            <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
              Main Clinical Task Execution (7-Step Protocol)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-rose-400">Screen ➔ Stratify ➔ Test ➔ Interpret ➔ Act</span>
        </div>

        {/* 7-Step Interactive Node Chain */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Step 1: Register Patient */}
          <div
            onClick={() => onSelectScreen('register_patient')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-slate-500 ${
              currentScreen === 'register_patient'
                ? 'bg-rose-950/40 border-[#8B1E3F] shadow-lg'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono mb-1.5 text-slate-400">
              <span className="font-bold text-slate-300">1. REGISTER</span>
              <span className="text-rose-400">DEMOGRAPHICS</span>
            </div>
            <h5 className="text-xs font-bold text-white">Patient Intake & Risk</h5>
            <p className="text-[11px] text-slate-400 mt-1">
              Auto ID, Age, Sex, and Pregnancy ANC flags for hemoglobin thresholds.
            </p>
          </div>

          {/* Step 2: Capture Eye Image */}
          <div
            onClick={() => onSelectScreen('capture_eye')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-slate-500 ${
              currentScreen === 'capture_eye'
                ? 'bg-rose-950/40 border-[#8B1E3F] shadow-lg'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono mb-1.5 text-slate-400">
              <span className="font-bold text-slate-300">2. CAPTURE EYE</span>
              <span className="text-amber-400">LAYER 1 VISION</span>
            </div>
            <h5 className="text-xs font-bold text-white">Conjunctiva Eye Scan</h5>
            <p className="text-[11px] text-slate-400 mt-1">
              Lower eyelid guide, real-time lighting check (480 Lux) & microvascular ROI.
            </p>
          </div>

          {/* Step 3: Screening Result */}
          <div
            onClick={() => onSelectScreen('screening_result')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-slate-500 ${
              currentScreen === 'screening_result'
                ? 'bg-rose-950/40 border-[#8B1E3F] shadow-lg'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono mb-1.5 text-slate-400">
              <span className="font-bold text-slate-300">3. AI RESULT</span>
              <span className="text-orange-400">STRATIFY</span>
            </div>
            <h5 className="text-xs font-bold text-white">Layer 1 Severity Dial</h5>
            <p className="text-[11px] text-slate-400 mt-1">
              Hb estimate (8.6 g/dL), confidence gauge (86%), and confirmatory test gate.
            </p>
          </div>

          {/* Decision Gate Badge */}
          <div className="p-3.5 rounded-2xl border border-dashed border-amber-500/80 bg-amber-950/20 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300 font-mono">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              CLINICAL STRATIFICATION
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              • <strong>Normal/Mild</strong>: Routine monitoring<br />
              • <strong>Moderate/Severe</strong>: Proceed to Layer 2 BioSense
            </p>
          </div>

          {/* Step 4: Perform BioSense Test */}
          <div
            onClick={() => onSelectScreen('biosense_test')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-slate-500 ${
              currentScreen === 'biosense_test'
                ? 'bg-rose-950/40 border-[#8B1E3F] shadow-lg'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono mb-1.5 text-slate-400">
              <span className="font-bold text-slate-300">4. BIOSENSE TEST</span>
              <span className="text-indigo-400">LAYER 2 RAPID</span>
            </div>
            <h5 className="text-xs font-bold text-white">15-Min Timer & Blood Drop</h5>
            <p className="text-[11px] text-slate-400 mt-1">
              1 drop in cassette sample well with interactive countdown & completion chime.
            </p>
          </div>

          {/* Step 5: Scan Test Strip */}
          <div
            onClick={() => onSelectScreen('scan_test_strip')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-slate-500 ${
              currentScreen === 'scan_test_strip'
                ? 'bg-rose-950/40 border-[#8B1E3F] shadow-lg'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono mb-1.5 text-slate-400">
              <span className="font-bold text-slate-300">5. SCAN STRIP</span>
              <span className="text-emerald-400">OPTICAL CV</span>
            </div>
            <h5 className="text-xs font-bold text-white">Cassette Alignment Box</h5>
            <p className="text-[11px] text-slate-400 mt-1">
              Camera alignment overlay reading Control C, Ferritin, and CRP band intensities.
            </p>
          </div>

          {/* Step 6: AI Interpretation */}
          <div
            onClick={() => onSelectScreen('ai_interpretation')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-slate-500 ${
              currentScreen === 'ai_interpretation'
                ? 'bg-rose-950/40 border-[#8B1E3F] shadow-lg'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono mb-1.5 text-slate-400">
              <span className="font-bold text-slate-300">6. INTERPRETATION</span>
              <span className="text-emerald-400">AI DIAGNOSIS</span>
            </div>
            <h5 className="text-xs font-bold text-white">Ferritin + CRP Readout</h5>
            <p className="text-[11px] text-slate-400 mt-1">
              &quot;Likely Iron Deficiency (Inflammation Unlikely)&quot; with 88% confidence.
            </p>
          </div>

          {/* Step 7: Action & Recommendation */}
          <div
            onClick={() => onSelectScreen('recommendation')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-slate-500 ${
              currentScreen === 'recommendation'
                ? 'bg-rose-950/40 border-[#8B1E3F] shadow-lg'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono mb-1.5 text-slate-400">
              <span className="font-bold text-slate-300">7. ACTION & ACT</span>
              <span className="text-emerald-400">CLINICAL GHS</span>
            </div>
            <h5 className="text-xs font-bold text-white">Decision Support & Referral</h5>
            <p className="text-[11px] text-slate-400 mt-1">
              Iron dosage, traditional dietary advice, referral trigger, and offline save.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: DATA & MANAGEMENT FLOWS */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#8B1E3F] text-white flex items-center justify-center text-xs font-bold">
            C
          </div>
          <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
            Patient History, Reporting & Offline Engine
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div
            onClick={() => onSelectScreen('patient_list')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-slate-500 ${
              currentScreen === 'patient_list'
                ? 'bg-rose-950/40 border-[#8B1E3F]'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="text-[10px] font-mono text-slate-400 mb-1">DIRECTORY</div>
            <h5 className="text-xs font-bold text-white">Patient Records</h5>
            <p className="text-[11px] text-slate-400 mt-1">
              Instant offline search, pregnancy badges, and historical filters.
            </p>
          </div>

          <div
            onClick={() => onSelectScreen('patient_summary')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-slate-500 ${
              currentScreen === 'patient_summary'
                ? 'bg-rose-950/40 border-[#8B1E3F]'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="text-[10px] font-mono text-slate-400 mb-1">RECORD</div>
            <h5 className="text-xs font-bold text-white">Patient Summary</h5>
            <p className="text-[11px] text-slate-400 mt-1">
              Clinical trend card with 1-tap print / export of hospital referral slip.
            </p>
          </div>

          <div
            onClick={() => onSelectScreen('offline_queue')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-slate-500 ${
              currentScreen === 'offline_queue'
                ? 'bg-rose-950/40 border-[#8B1E3F]'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="text-[10px] font-mono text-amber-400 mb-1">SYNC DISPATCHER</div>
            <h5 className="text-xs font-bold text-white">Visual Queue Mgr</h5>
            <p className="text-[11px] text-slate-400 mt-1">
              Granular sync attempt statuses, backoff timers, and encrypted payload telemetry.
            </p>
          </div>

          <div
            onClick={() => onSelectScreen('reports')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-slate-500 ${
              currentScreen === 'reports'
                ? 'bg-rose-950/40 border-[#8B1E3F]'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="text-[10px] font-mono text-slate-400 mb-1">EPIDEMIOLOGY</div>
            <h5 className="text-xs font-bold text-white">Outreach Reports</h5>
            <p className="text-[11px] text-slate-400 mt-1">
              128 Screened, 52 Positive (40.6%), 33 Likely IDA (63.5%), 7 Referred.
            </p>
          </div>

          <div
            onClick={() => onSelectScreen('settings')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-slate-500 ${
              currentScreen === 'settings'
                ? 'bg-rose-950/40 border-[#8B1E3F]'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            <div className="text-[10px] font-mono text-slate-400 mb-1">SETTINGS</div>
            <h5 className="text-xs font-bold text-white">Sync & Calibration</h5>
            <p className="text-[11px] text-slate-400 mt-1">
              Language switcher, BioSense lot calibration & CHW credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
