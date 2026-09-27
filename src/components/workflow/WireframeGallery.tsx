import React, { useState } from 'react';
import { WIREFRAME_SPECS } from '../../data/mockData';
import { ScreenId, LanguageCode, Patient } from '../../types';
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { RegisterPatientScreen } from '../screens/RegisterPatientScreen';
import { CaptureEyeScreen } from '../screens/CaptureEyeScreen';
import { ScreeningResultScreen } from '../screens/ScreeningResultScreen';
import { BioSenseTestScreen } from '../screens/BioSenseTestScreen';
import { ScanTestStripScreen } from '../screens/ScanTestStripScreen';
import { AiInterpretationScreen } from '../screens/AiInterpretationScreen';
import { RecommendationScreen } from '../screens/RecommendationScreen';
import { PatientListScreen } from '../screens/PatientListScreen';
import { PatientSummaryScreen } from '../screens/PatientSummaryScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { OfflineQueueManager } from '../sync/OfflineQueueManager';
import { Eye, Layers, ShieldCheck, CheckCircle2, Sliders, Smartphone, Maximize2 } from 'lucide-react';

interface WireframeGalleryProps {
  lang: LanguageCode;
  patients: Patient[];
  onOpenInSimulator: (screen: ScreenId) => void;
}

export const WireframeGallery: React.FC<WireframeGalleryProps> = ({
  lang,
  patients,
  onOpenInSimulator,
}) => {
  const [globalWireframeMode, setGlobalWireframeMode] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Onboarding' | 'Clinical Task Execution' | 'Data & Management'>('All');

  const filteredSpecs = WIREFRAME_SPECS.filter(
    (spec) => selectedCategory === 'All' || spec.category === selectedCategory
  );

  const renderScreenPreview = (screenId: ScreenId, isWireframe: boolean) => {
    const dummyPatient = patients[0];

    switch (screenId) {
      case 'splash':
        return (
          <SplashScreen
            lang={lang}
            onSelectLanguage={() => {}}
            onStartOnboarding={() => {}}
            onSkipToHome={() => {}}
            isWireframe={isWireframe}
          />
        );
      case 'onboarding':
        return (
          <OnboardingScreen
            lang={lang}
            onFinishOnboarding={() => {}}
            isWireframe={isWireframe}
          />
        );
      case 'home':
        return (
          <HomeScreen
            lang={lang}
            onNavigate={() => {}}
            pendingSyncCount={1}
            isOnline={true}
            isWireframe={isWireframe}
          />
        );
      case 'register_patient':
        return (
          <RegisterPatientScreen
            lang={lang}
            onBack={() => {}}
            onNext={() => {}}
            isWireframe={isWireframe}
          />
        );
      case 'capture_eye':
        return (
          <CaptureEyeScreen
            lang={lang}
            patientName={dummyPatient.name}
            onBack={() => {}}
            onCaptured={() => {}}
            isWireframe={isWireframe}
          />
        );
      case 'screening_result':
        return (
          <ScreeningResultScreen
            lang={lang}
            patientName={dummyPatient.name}
            severity="Moderate"
            confidence={86}
            estimatedHb={8.6}
            onBack={() => {}}
            onNext={() => {}}
            isWireframe={isWireframe}
          />
        );
      case 'biosense_test':
        return (
          <BioSenseTestScreen
            lang={lang}
            patientName={dummyPatient.name}
            onBack={() => {}}
            onNext={() => {}}
            isWireframe={isWireframe}
          />
        );
      case 'scan_test_strip':
        return (
          <ScanTestStripScreen
            lang={lang}
            patientName={dummyPatient.name}
            onBack={() => {}}
            onScanned={() => {}}
            isWireframe={isWireframe}
          />
        );
      case 'ai_interpretation':
        return (
          <AiInterpretationScreen
            lang={lang}
            patientName={dummyPatient.name}
            ferritin="Low"
            crp="Normal"
            interpretation="Likely Iron Deficiency (Inflammation Unlikely)"
            confidence={88}
            onBack={() => {}}
            onNext={() => {}}
            isWireframe={isWireframe}
          />
        );
      case 'recommendation':
        return (
          <RecommendationScreen
            lang={lang}
            patient={dummyPatient}
            severity="Moderate"
            onBack={() => {}}
            onSaveAndFinish={() => {}}
            onViewReferralSlip={() => {}}
            isWireframe={isWireframe}
          />
        );
      case 'patient_list':
        return (
          <PatientListScreen
            lang={lang}
            patients={patients}
            onSelectPatient={() => {}}
            onNewPatient={() => {}}
            isWireframe={isWireframe}
          />
        );
      case 'patient_summary':
        return (
          <PatientSummaryScreen
            lang={lang}
            patient={dummyPatient}
            onBack={() => {}}
            onViewReferralSlip={() => {}}
            onStartNewScreeningForPatient={() => {}}
            isWireframe={isWireframe}
          />
        );
      case 'reports':
        return (
          <ReportsScreen
            lang={lang}
            isWireframe={isWireframe}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            lang={lang}
            onSelectLanguage={() => {}}
            isOnline={true}
            onToggleOnline={() => {}}
            pendingSyncCount={1}
            onSyncNow={() => {}}
            isWireframe={isWireframe}
          />
        );
      case 'offline_queue':
        return (
          <OfflineQueueManager
            patients={patients}
            onUpdatePatient={() => {}}
            isOnline={false}
            onToggleOnline={() => {}}
            isWireframe={isWireframe}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Top Gallery Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-rose-400" />
            Complete Screen Wireframe & UI Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compare Low-Fidelity Architectural Wireframe Blueprints vs High-Fidelity Production Android UI with accessibility annotations.
          </p>
        </div>

        {/* Global Master Toggle */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setGlobalWireframeMode(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              globalWireframeMode
                ? 'bg-rose-900 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📐 Wireframe Blueprints</span>
          </button>
          <button
            onClick={() => setGlobalWireframeMode(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              !globalWireframeMode
                ? 'bg-[#8B1E3F] text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🎨 High-Fidelity UI</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {(['All', 'Onboarding', 'Clinical Task Execution', 'Data & Management'] as const).map(
          (category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0 ${
                selectedCategory === category
                  ? 'bg-slate-100 text-slate-900 shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {category}
            </button>
          )
        )}
      </div>

      {/* Grid of Wireframe Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpecs.map((spec) => (
          <div
            key={spec.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between"
          >
            {/* Card Header with Specs */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/80">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded">
                  {spec.stepNumber ? `STEP ${spec.stepNumber}/7` : spec.category.toUpperCase()}
                </span>
                <button
                  onClick={() => onOpenInSimulator(spec.id)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-rose-400 bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-lg transition-all"
                  title="Test in playable phone simulator"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Launch In Simulator</span>
                </button>
              </div>

              <h3 className="text-sm font-extrabold text-white mt-2">{spec.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{spec.description}</p>

              {/* Spec Badges */}
              <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-mono">
                <span className="bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-emerald-400 font-bold">
                  Contrast: {spec.contrastRatio}
                </span>
                <span className="bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-indigo-300">
                  Touch Target: {spec.minTouchTarget}
                </span>
              </div>
            </div>

            {/* Embedded Live Screen Rendering */}
            <div className="p-4 bg-slate-950 flex items-center justify-center">
              <div className="w-[300px] h-[520px] rounded-[32px] overflow-hidden border-2 border-slate-700 shadow-2xl relative flex flex-col">
                {renderScreenPreview(spec.id, globalWireframeMode)}
              </div>
            </div>

            {/* Accessibility & Component List Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/50 space-y-2 text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Accessibility Highlights:
              </div>
              <ul className="space-y-1 text-[11px] text-slate-300">
                {spec.accessibilityFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
