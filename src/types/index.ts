export type Severity = 'Normal' | 'Mild' | 'Moderate' | 'Severe';

export type LanguageCode = 'en' | 'tw' | 'dag' | 'ee' | 'fr' | 'ha';

export type VerificationStatus = 'verified' | 'pending_review' | 'flagged' | 'overridden';

export type SyncAttemptStatus = 'synced' | 'queued' | 'attempting' | 'failed' | 'paused';

export interface SyncAttemptLog {
  timestamp: string;
  status: 'attempting' | 'failed' | 'synced' | 'paused';
  message: string;
  errorCode?: string;
  durationMs?: number;
}

export interface SyncMetadata {
  status: SyncAttemptStatus;
  attemptCount: number;
  maxRetries: number;
  lastAttemptAt?: string;
  nextRetryInSeconds?: number;
  lastErrorReason?: string;
  payloadSizeBytes?: number;
  priority?: 'normal' | 'high' | 'urgent';
  progressPercent?: number;
  transferSpeedKbps?: number;
  history?: SyncAttemptLog[];
}

export interface SupervisorReview {
  status: VerificationStatus;
  supervisorName: string;
  supervisorId: string;
  reviewedAt?: string;
  reviewNotes?: string;
  overrideSeverity?: Severity;
  overrideReason?: string;
  flagReason?: string;
}

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export interface Patient {
  id: string; // e.g. HS-000123
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  isPregnant?: boolean;
  trimester?: '1st' | '2nd' | '3rd' | 'Lactating' | 'None';
  village: string;
  phone?: string;
  avatarUrl?: string;
  registeredAt: string;
  screeningsCount: number;
  latestScreening?: ScreeningRecord;
}

export interface Layer1VisionResult {
  severity: Severity;
  confidence: number;
  estimatedHb: number; // e.g. 8.6 g/dL
  conjunctivaColorHex: string;
  isPositive: boolean; // moderate or severe requires layer 2
  capturedAt: string;
  eyeSampleType: 'camera' | 'sample1' | 'sample2' | 'sample3';
  lightingLux?: number;
  erythemaIndex?: number;
}

export interface Layer2BioSenseResult {
  ferritin: 'Low' | 'Normal' | 'High';
  crp: 'Normal' | 'Elevated';
  interpretation: string; // e.g. "Likely Iron Deficiency (Inflammation Unlikely)"
  confidence: number;
  cassetteLotNumber: string;
  analyteTimeRemaining: number;
  detectedLines: {
    control: boolean;
    ferritinLine: boolean;
    crpLine: boolean;
  };
  opticalDensity?: {
    controlLine: number;
    ferritinLine: number;
    crpLine: number;
  };
}

export interface ClinicalRecommendation {
  primaryAction: string; // "Start Iron Supplement as per protocol"
  actionType: 'supplement' | 'investigate' | 'refer' | 'monitor';
  supplementDetails: {
    type: string;
    dosage: string;
    duration: string;
  };
  considerations: string[];
  referralIndicated: boolean;
  referralReason?: string;
  followUpWeeks: number;
  notes?: string;
}

export interface ScreeningRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Female' | 'Male' | 'Other';
  patientIsPregnant?: boolean;
  date: string;
  district?: string;
  facilityName: string;
  chwName: string;
  chwId?: string;
  layer1: Layer1VisionResult;
  layer2?: Layer2BioSenseResult;
  recommendation: ClinicalRecommendation;
  syncStatus: 'synced' | 'pending_sync';
  syncMetadata?: SyncMetadata;
  supervisorReview?: SupervisorReview;
}

export interface CHWProfile {
  id: string; // e.g. CHW-042
  name: string;
  facility: string;
  district: string;
  phone: string;
  activeStatus: 'active' | 'in_field' | 'offline';
  totalScreenings: number;
  accuracyScore: number;
  assignedLotNumber: string;
  lastActive: string;
  avatarUrl?: string;
  zone: string;
}

export interface TestKitInventory {
  lotNumber: string;
  facility: string;
  totalReceived: number;
  remaining: number;
  expiryDate: string;
  status: 'optimal' | 'low_stock' | 'expired';
  calibratedAt: string;
  manufacturer: string;
}

export type ScreenId =
  | 'splash'
  | 'onboarding'
  | 'home'
  | 'register_patient'
  | 'capture_eye'
  | 'screening_result'
  | 'biosense_test'
  | 'scan_test_strip'
  | 'ai_interpretation'
  | 'recommendation'
  | 'patient_list'
  | 'patient_summary'
  | 'reports'
  | 'settings'
  | 'offline_queue';

export type AppViewMode =
  | 'simulator' // Playable Android Phone Simulator
  | 'supervisor_dashboard' // Standalone Centralized Supervisor Platform with Administrative Access
  | 'workflow_map' // Full End-to-End Workflow Diagram with connected arrows
  | 'wireframe_gallery' // All screens side-by-side (Lo-Fi vs Hi-Fi switchable)
  | 'design_system'; // Typography, Colors, Accessibility guidelines

export interface WireframeScreenSpec {
  id: ScreenId;
  title: string;
  stepNumber?: number;
  category: 'Onboarding' | 'Clinical Task Execution' | 'Data & Management';
  description: string;
  userGoal: string;
  accessibilityFeatures: string[];
  keyComponents: string[];
  contrastRatio: string;
  minTouchTarget: string;
}
