import React, { useState } from 'react';
import {
  Smartphone,
  Layers,
  GitBranch,
  Palette,
  Globe,
  Wifi,
  WifiOff,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  FileText,
  ChevronRight,
  Droplets,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import {
  ScreenId,
  LanguageCode,
  AppViewMode,
  Patient,
  ScreeningRecord,
  Severity,
} from './types';
import { INITIAL_PATIENTS, SUPPORTED_LANGUAGES } from './data/mockData';
import { TRANSLATIONS } from './data/translations';
import { AndroidDeviceFrame } from './components/android/AndroidDeviceFrame';

// Screen Components
import { SplashScreen } from './components/screens/SplashScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { RegisterPatientScreen } from './components/screens/RegisterPatientScreen';
import { CaptureEyeScreen } from './components/screens/CaptureEyeScreen';
import { ScreeningResultScreen } from './components/screens/ScreeningResultScreen';
import { BioSenseTestScreen } from './components/screens/BioSenseTestScreen';
import { ScanTestStripScreen } from './components/screens/ScanTestStripScreen';
import { AiInterpretationScreen } from './components/screens/AiInterpretationScreen';
import { RecommendationScreen } from './components/screens/RecommendationScreen';
import { PatientListScreen } from './components/screens/PatientListScreen';
import { PatientSummaryScreen } from './components/screens/PatientSummaryScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { OfflineQueueManager } from './components/sync/OfflineQueueManager';

// Workflow & Matrix Views
import { WorkflowFlowMap } from './components/workflow/WorkflowFlowMap';
import { WireframeGallery } from './components/workflow/WireframeGallery';
import { DesignSystemDocs } from './components/workflow/DesignSystemDocs';
import { ReferralSlipModal } from './components/workflow/ReferralSlipModal';
import { SupervisorPlatform } from './components/supervisor/SupervisorPlatform';

export default function App() {
  const [viewMode, setViewMode] = useState<AppViewMode>('simulator');
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [lang, setLang] = useState<LanguageCode>('en');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatientForSummary, setSelectedPatientForSummary] = useState<Patient>(INITIAL_PATIENTS[0]);
  const [referralModalPatient, setReferralModalPatient] = useState<Patient | null>(null);

  // Active Screening In-Flight State
  const [currentPatientForm, setCurrentPatientForm] = useState<{
    name: string;
    age: number;
    gender: 'Female' | 'Male';
    isPregnant: boolean;
    village: string;
  }>({
    name: 'Ama Mensah',
    age: 28,
    gender: 'Female',
    isPregnant: true,
    village: 'Abokobi Community',
  });

  const [currentEyeData, setCurrentEyeData] = useState<{
    severity: Severity;
    confidence: number;
    estimatedHb: number;
  }>({
    severity: 'Moderate',
    confidence: 86,
    estimatedHb: 8.6,
  });

  const [currentStripData, setCurrentStripData] = useState<{
    ferritin: 'Low' | 'Normal' | 'High';
    crp: 'Normal' | 'Elevated';
    confidence: number;
    interpretation: string;
  }>({
    ferritin: 'Low',
    crp: 'Normal',
    confidence: 88,
    interpretation: 'Likely Iron Deficiency (Inflammation Unlikely)',
  });

  const pendingSyncCount = patients.filter((p) => p.latestScreening?.syncStatus === 'pending_sync').length;

  const handleSyncAll = () => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.latestScreening) {
          return {
            ...p,
            latestScreening: {
              ...p.latestScreening,
              syncStatus: 'synced',
            },
          };
        }
        return p;
      })
    );
  };

  // Screening Step 1 -> Step 2
  const handlePatientRegistered = (patientData: typeof currentPatientForm) => {
    setCurrentPatientForm(patientData);
    setCurrentScreen('capture_eye');
  };

  // Screening Step 2 -> Step 3
  const handleEyeCaptured = (eyeData: {
    sampleType: string;
    severity: Severity;
    confidence: number;
    estimatedHb: number;
  }) => {
    setCurrentEyeData({
      severity: eyeData.severity,
      confidence: eyeData.confidence,
      estimatedHb: eyeData.estimatedHb,
    });
    setCurrentScreen('screening_result');
  };

  // Screening Step 3 -> Step 4
  const handleProceedToBioSense = () => {
    setCurrentScreen('biosense_test');
  };

  // Screening Step 4 -> Step 5
  const handleProceedToScanStrip = () => {
    setCurrentScreen('scan_test_strip');
  };

  // Screening Step 5 -> Step 6
  const handleStripScanned = (result: typeof currentStripData) => {
    setCurrentStripData(result);
    setCurrentScreen('ai_interpretation');
  };

  // Screening Step 6 -> Step 7
  const handleProceedToRecommendation = () => {
    setCurrentScreen('recommendation');
  };

  // Screening Step 7 -> Save & Finish
  const handleSaveAndFinish = () => {
    const newRecordId = `SCR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatientId = `HS-${Math.floor(100000 + Math.random() * 900000)}`;

    const newScreening: ScreeningRecord = {
      id: newRecordId,
      patientId: newPatientId,
      patientName: currentPatientForm.name,
      patientAge: currentPatientForm.age,
      patientGender: currentPatientForm.gender,
      patientIsPregnant: currentPatientForm.isPregnant,
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      layer1: {
        severity: currentEyeData.severity,
        confidence: currentEyeData.confidence,
        estimatedHb: currentEyeData.estimatedHb,
        conjunctivaColorHex: currentEyeData.severity === 'Moderate' ? '#E29578' : '#C94C4C',
        isPositive: currentEyeData.severity === 'Moderate' || currentEyeData.severity === 'Severe',
        capturedAt: new Date().toISOString(),
        eyeSampleType: 'sample1',
      },
      layer2: {
        ferritin: currentStripData.ferritin,
        crp: currentStripData.crp,
        interpretation: currentStripData.interpretation,
        confidence: currentStripData.confidence,
        cassetteLotNumber: 'BIO-26-8812',
        analyteTimeRemaining: 0,
        detectedLines: {
          control: true,
          ferritinLine: currentStripData.ferritin === 'Low',
          crpLine: currentStripData.crp === 'Elevated',
        },
      },
      recommendation: {
        primaryAction: 'Start Iron Supplement as per protocol',
        actionType: 'supplement',
        supplementDetails: {
          type: 'Ferrous Sulfate 200mg (65mg elemental iron) + Folic Acid 400mcg',
          dosage: '1 tablet daily with vitamin C / water, 30 min before meals',
          duration: '3 months with 4-week clinical check',
        },
        considerations: [
          'Dietary counseling on iron-rich traditional foods',
          'Follow-up in 4 weeks for repeat Vision AI check',
          'Deworming if 2nd/3rd trimester ANC per protocol',
        ],
        referralIndicated: currentEyeData.severity === 'Severe' || currentStripData.crp === 'Elevated',
        followUpWeeks: 4,
      },
      syncStatus: isOnline ? 'synced' : 'pending_sync',
      chwName: 'Kofi Owusu (CHW-042)',
      facilityName: 'Pantang Health Centre',
    };

    const newPatient: Patient = {
      id: newPatientId,
      name: currentPatientForm.name,
      age: currentPatientForm.age,
      gender: currentPatientForm.gender,
      isPregnant: currentPatientForm.isPregnant,
      village: currentPatientForm.village,
      registeredAt: new Date().toISOString(),
      screeningsCount: 1,
      latestScreening: newScreening,
    };

    setPatients([newPatient, ...patients]);
    setSelectedPatientForSummary(newPatient);
    setCurrentScreen('patient_summary');
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <SplashScreen
            lang={lang}
            onSelectLanguage={setLang}
            onStartOnboarding={() => setCurrentScreen('onboarding')}
            onSkipToHome={() => setCurrentScreen('home')}
            isWireframe={isWireframe}
          />
        );

      case 'onboarding':
        return (
          <OnboardingScreen
            lang={lang}
            onFinishOnboarding={() => setCurrentScreen('home')}
            isWireframe={isWireframe}
          />
        );

      case 'home':
        return (
          <HomeScreen
            lang={lang}
            onNavigate={setCurrentScreen}
            pendingSyncCount={pendingSyncCount}
            isOnline={isOnline}
            isWireframe={isWireframe}
          />
        );

      case 'register_patient':
        return (
          <RegisterPatientScreen
            lang={lang}
            onBack={() => setCurrentScreen('home')}
            onNext={handlePatientRegistered}
            isWireframe={isWireframe}
          />
        );

      case 'capture_eye':
        return (
          <CaptureEyeScreen
            lang={lang}
            patientName={currentPatientForm.name}
            onBack={() => setCurrentScreen('register_patient')}
            onCaptured={handleEyeCaptured}
            isWireframe={isWireframe}
          />
        );

      case 'screening_result':
        return (
          <ScreeningResultScreen
            lang={lang}
            patientName={currentPatientForm.name}
            severity={currentEyeData.severity}
            confidence={currentEyeData.confidence}
            estimatedHb={currentEyeData.estimatedHb}
            onBack={() => setCurrentScreen('capture_eye')}
            onNext={handleProceedToBioSense}
            onSkipToRecommendation={() => setCurrentScreen('recommendation')}
            isWireframe={isWireframe}
          />
        );

      case 'biosense_test':
        return (
          <BioSenseTestScreen
            lang={lang}
            patientName={currentPatientForm.name}
            onBack={() => setCurrentScreen('screening_result')}
            onNext={handleProceedToScanStrip}
            isWireframe={isWireframe}
          />
        );

      case 'scan_test_strip':
        return (
          <ScanTestStripScreen
            lang={lang}
            patientName={currentPatientForm.name}
            onBack={() => setCurrentScreen('biosense_test')}
            onScanned={handleStripScanned}
            isWireframe={isWireframe}
          />
        );

      case 'ai_interpretation':
        return (
          <AiInterpretationScreen
            lang={lang}
            patientName={currentPatientForm.name}
            ferritin={currentStripData.ferritin}
            crp={currentStripData.crp}
            interpretation={currentStripData.interpretation}
            confidence={currentStripData.confidence}
            onBack={() => setCurrentScreen('scan_test_strip')}
            onNext={handleProceedToRecommendation}
            isWireframe={isWireframe}
          />
        );

      case 'recommendation':
        return (
          <RecommendationScreen
            lang={lang}
            patient={currentPatientForm}
            severity={currentEyeData.severity}
            onBack={() => setCurrentScreen('ai_interpretation')}
            onSaveAndFinish={handleSaveAndFinish}
            onViewReferralSlip={() => setReferralModalPatient(selectedPatientForSummary || patients[0])}
            isWireframe={isWireframe}
          />
        );

      case 'patient_list':
        return (
          <PatientListScreen
            lang={lang}
            patients={patients}
            onSelectPatient={(p) => {
              setSelectedPatientForSummary(p);
              setCurrentScreen('patient_summary');
            }}
            onNewPatient={() => setCurrentScreen('register_patient')}
            onOpenSyncQueue={() => setCurrentScreen('offline_queue')}
            isWireframe={isWireframe}
          />
        );

      case 'patient_summary':
        return (
          <PatientSummaryScreen
            lang={lang}
            patient={selectedPatientForSummary || patients[0]}
            onBack={() => setCurrentScreen('patient_list')}
            onViewReferralSlip={() => setReferralModalPatient(selectedPatientForSummary || patients[0])}
            onStartNewScreeningForPatient={() => setCurrentScreen('register_patient')}
            isWireframe={isWireframe}
          />
        );

      case 'reports':
        return <ReportsScreen lang={lang} isWireframe={isWireframe} />;

      case 'settings':
        return (
          <SettingsScreen
            lang={lang}
            onSelectLanguage={setLang}
            isOnline={isOnline}
            onToggleOnline={() => setIsOnline(!isOnline)}
            pendingSyncCount={pendingSyncCount}
            onSyncNow={handleSyncAll}
            onNavigate={setCurrentScreen}
            isWireframe={isWireframe}
          />
        );

      case 'offline_queue':
        return (
          <OfflineQueueManager
            patients={patients}
            onUpdatePatient={setPatients}
            onAddNewPatientTest={(newP) => {
              setPatients([newP, ...patients]);
              setSelectedPatientForSummary(newP);
            }}
            isOnline={isOnline}
            onToggleOnline={() => setIsOnline(!isOnline)}
            onBackToHome={() => setCurrentScreen('home')}
            isWireframe={isWireframe}
          />
        );

      default:
        return (
          <HomeScreen
            lang={lang}
            onNavigate={setCurrentScreen}
            pendingSyncCount={pendingSyncCount}
            isOnline={isOnline}
            isWireframe={isWireframe}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Application Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B1E3F] flex items-center justify-center shadow-md shadow-[#8B1E3F]/40 border border-rose-400/30">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-white fill-white"
                strokeWidth="0"
              >
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white tracking-tight">
                  HaemaScan AI
                </h1>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                  Android UI & Flow
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Two-Layer Anemia Intelligence Platform (Screen → Stratify → Test → Interpret → Act)
              </p>
            </div>
          </div>

          {/* Navigation View Mode Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto overflow-x-auto max-w-full">
            <button
              id="tab-supervisor-dashboard"
              onClick={() => setViewMode('supervisor_dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                viewMode === 'supervisor_dashboard'
                  ? 'bg-gradient-to-r from-[#8B1E3F] to-rose-800 text-white shadow-md shadow-rose-950'
                  : 'text-rose-300 hover:text-white bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/40'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>Supervisor Dashboard</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-500/30">
                ADMIN
              </span>
            </button>

            <button
              id="tab-simulator"
              onClick={() => setViewMode('simulator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                viewMode === 'simulator'
                  ? 'bg-[#8B1E3F] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Simulator</span>
            </button>

            <button
              id="tab-workflow-map"
              onClick={() => setViewMode('workflow_map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                viewMode === 'workflow_map'
                  ? 'bg-[#8B1E3F] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Workflow Flow Map</span>
            </button>

            <button
              id="tab-wireframe-gallery"
              onClick={() => setViewMode('wireframe_gallery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                viewMode === 'wireframe_gallery'
                  ? 'bg-[#8B1E3F] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Wireframes (All Screens)</span>
            </button>

            <button
              id="tab-design-system"
              onClick={() => setViewMode('design_system')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                viewMode === 'design_system'
                  ? 'bg-[#8B1E3F] text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Design System</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* VIEW 0: STANDALONE CENTRALIZED SUPERVISOR PLATFORM */}
        {viewMode === 'supervisor_dashboard' && (
          <SupervisorPlatform
            patients={patients}
            onUpdatePatient={setPatients}
            onAddNewPatientTest={(newP) => {
              setPatients([newP, ...patients]);
              setSelectedPatientForSummary(newP);
            }}
          />
        )}

        {/* VIEW 1: INTERACTIVE ANDROID PHONE SIMULATOR */}
        {viewMode === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Handset Frame Simulator */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <AndroidDeviceFrame
                currentScreen={currentScreen}
                onNavigate={setCurrentScreen}
                lang={lang}
                isOnline={isOnline}
                isWireframe={isWireframe}
                pendingSyncCount={pendingSyncCount}
                onToggleWireframe={() => setIsWireframe(!isWireframe)}
                onToggleOnline={() => setIsOnline(!isOnline)}
              >
                {renderActiveScreen()}
              </AndroidDeviceFrame>

              <div className="mt-3 text-center text-xs text-slate-500 font-mono">
                Android 14 (Material 3) • 360 x 800 dp • 48dp Minimum Touch Bounds
              </div>
            </div>

            {/* Right Column: Workflow Controller & Context Panel */}
            <div className="lg:col-span-7 space-y-6">
              {/* Simulator Action Quick Control Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">
                      Interactive Device Controller
                    </span>
                    <h2 className="text-lg font-bold text-white mt-0.5">
                      Clinical Simulation Studio
                    </h2>
                  </div>

                  {/* Wireframe vs Hi-Fi Toggle on the Phone */}
                  <button
                    id="btn-toggle-wireframe-mode"
                    onClick={() => setIsWireframe(!isWireframe)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isWireframe
                        ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-md font-mono'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <span>📐 {isWireframe ? 'Wireframe Blueprint (ON)' : 'Hi-Fi Android UI'}</span>
                  </button>
                </div>

                {/* Direct Screen Jump Controls */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">
                    Quick Jump to Screen:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                    {[
                      { id: 'splash', label: '0. Splash & Language' },
                      { id: 'onboarding', label: '0. CHW Tutorial' },
                      { id: 'home', label: 'Hub. Home Dashboard' },
                      { id: 'register_patient', label: '1. Register Patient' },
                      { id: 'capture_eye', label: '2. Capture Eye (Vision)' },
                      { id: 'screening_result', label: '3. Screening Result' },
                      { id: 'biosense_test', label: '4. BioSense 15m Test' },
                      { id: 'scan_test_strip', label: '5. Scan Test Strip' },
                      { id: 'ai_interpretation', label: '6. AI Interpretation' },
                      { id: 'recommendation', label: '7. Recommendation' },
                      { id: 'patient_list', label: 'Dir. Patient List' },
                      { id: 'patient_summary', label: 'Card. Patient Summary' },
                      { id: 'offline_queue', label: 'Sync. Visual Queue Mgr' },
                      { id: 'reports', label: 'Stat. Reports & Analytics' },
                      { id: 'settings', label: 'Cfg. Sync & Settings' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setCurrentScreen(s.id as ScreenId)}
                        className={`p-2 rounded-xl border text-left font-medium transition-all text-[11px] ${
                          currentScreen === s.id
                            ? 'bg-[#8B1E3F] text-white border-rose-400 font-bold shadow-xs'
                            : s.id === 'offline_queue' && pendingSyncCount > 0
                            ? 'bg-amber-950/40 border-amber-800 text-amber-200 hover:bg-amber-900/50'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {s.label}
                        {s.id === 'offline_queue' && pendingSyncCount > 0 && ` (${pendingSyncCount})`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Multi-language Bar */}
                <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-400">Language:</span>
                  </div>
                  <div className="flex gap-1">
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => setLang(l.code)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                          lang === l.code
                            ? 'bg-[#8B1E3F] text-white border-rose-400 shadow-xs'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {l.code.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Administrative Supervisor Platform Quick Jump Card */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/40 border border-rose-900/50 rounded-3xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#8B1E3F] flex items-center justify-center border border-rose-400/40 shadow-sm">
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block">
                        Linked Administrative Platform
                      </span>
                      <h3 className="text-sm font-bold text-white">Centralized Supervisor Dashboard</h3>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                    SUPERVISOR ACCESS
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  All tests performed on this Android mobile app are synced in real-time to the central district database ({patients.length} records). Supervisors can audit conjunctiva scans, review BioSense dual-analyte optical strips, override classifications, manage CHW field teams, and export DHIS2 reports.
                </p>

                <div className="pt-1 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 font-mono">
                    Pending QA Audits: <strong className="text-amber-400">{patients.filter(p => !p.latestScreening?.supervisorReview || p.latestScreening.supervisorReview.status === 'pending_review').length}</strong>
                  </div>
                  <button
                    id="btn-jump-to-supervisor-platform"
                    onClick={() => setViewMode('supervisor_dashboard')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#8B1E3F] hover:bg-[#A3234B] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-950 transition-all active:scale-95"
                  >
                    <span>Launch Supervisor Platform</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Two Layer Clinical Architecture Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-rose-400" />
                  <h3 className="text-base font-bold text-white">
                    Clinical Rationale: Two-Layer Anemia Strategy
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Layer 1 */}
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-rose-900/40 space-y-1.5">
                    <div className="font-bold text-rose-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      Layer 1: Smartphone Vision AI
                    </div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Non-invasive palpebral conjunctiva color estimation. Zero marginal cost, zero pain, 10-second assessment. Stratifies healthy individuals out immediately.
                    </p>
                  </div>

                  {/* Layer 2 */}
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-indigo-900/40 space-y-1.5">
                    <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      Layer 2: BioSense Rapid Strip
                    </div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Point-of-care dual analyte (Ferritin + CRP). Tests only the ~40% who screen positive. Distinguishes Iron Deficiency Anemia from chronic infection/inflammation.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Standard Clinical Protocol: WHO & Ghana Health Service</span>
                  <button
                    onClick={() => setReferralModalPatient(selectedPatientForSummary || patients[0])}
                    className="font-bold text-[#8B1E3F] hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Referral Form Sample</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: WORKFLOW & CLINICAL FLOW MAP */}
        {viewMode === 'workflow_map' && (
          <WorkflowFlowMap
            currentScreen={currentScreen}
            onSelectScreen={(screen) => {
              setCurrentScreen(screen);
              setViewMode('simulator');
            }}
          />
        )}

        {/* VIEW 3: COMPLETE WIREFRAME MATRIX GALLERY (ALL SCREENS) */}
        {viewMode === 'wireframe_gallery' && (
          <WireframeGallery
            lang={lang}
            patients={patients}
            onOpenInSimulator={(screen) => {
              setCurrentScreen(screen);
              setViewMode('simulator');
            }}
          />
        )}

        {/* VIEW 4: DESIGN SYSTEM & ACCESSIBILITY DOCS */}
        {viewMode === 'design_system' && <DesignSystemDocs />}
      </main>

      {/* Printable Clinical Referral Slip Modal */}
      {referralModalPatient && (
        <ReferralSlipModal
          patient={referralModalPatient}
          onClose={() => setReferralModalPatient(null)}
        />
      )}
    </div>
  );
}
