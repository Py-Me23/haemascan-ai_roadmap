import React, { useState } from 'react';
import {
  ShieldCheck,
  Table,
  CheckCircle2,
  MapPin,
  Users,
  Boxes,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Activity,
  Filter,
} from 'lucide-react';
import { Patient, Severity, VerificationStatus } from '../../types';
import { SupervisorHeader } from './SupervisorHeader';
import { SupervisorKpiSummary } from './SupervisorKpiSummary';
import { CentralizedTestTable } from './CentralizedTestTable';
import { QualityControlReviewDesk } from './QualityControlReviewDesk';
import { EpidemiologicalHeatmap } from './EpidemiologicalHeatmap';
import { CHWTeamDirectory } from './CHWTeamDirectory';
import { BioSenseInventoryDesk } from './BioSenseInventoryDesk';
import { DHIS2ReportGenerator } from './DHIS2ReportGenerator';
import { TestDetailModal } from './TestDetailModal';
import { ReferralSlipModal } from '../workflow/ReferralSlipModal';

interface SupervisorPlatformProps {
  patients: Patient[];
  onUpdatePatient: (updatedPatients: Patient[]) => void;
  onAddNewPatientTest: (newPatient: Patient) => void;
}

export type SupervisorTab =
  | 'all_tests'
  | 'qa_review'
  | 'surveillance_map'
  | 'chw_team'
  | 'lot_inventory'
  | 'dhis2_reports';

export const SupervisorPlatform: React.FC<SupervisorPlatformProps> = ({
  patients,
  onUpdatePatient,
  onAddNewPatientTest,
}) => {
  const [activeTab, setActiveTab] = useState<SupervisorTab>('all_tests');
  const [activeFacilityFilter, setActiveFacilityFilter] = useState<string>(
    'All Facilities (District-Wide)'
  );
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [selectedPatientForDetail, setSelectedPatientForDetail] = useState<Patient | null>(null);
  const [referralModalPatient, setReferralModalPatient] = useState<Patient | null>(null);

  // Unverified pending count
  const unverifiedCount = patients.filter(
    (p) =>
      !p.latestScreening?.supervisorReview ||
      p.latestScreening.supervisorReview.status === 'pending_review'
  ).length;

  const handleSyncCentralStream = () => {
    setIsSyncing(true);
    setTimeout(() => {
      // Mark all records as synced
      const updated = patients.map((p) => {
        if (p.latestScreening) {
          return {
            ...p,
            latestScreening: {
              ...p.latestScreening,
              syncStatus: 'synced' as const,
            },
          };
        }
        return p;
      });
      onUpdatePatient(updated);
      setIsSyncing(false);
    }, 1200);
  };

  const handleQuickVerifyTest = (patientId: string) => {
    const updated = patients.map((p) => {
      if (p.id === patientId && p.latestScreening) {
        return {
          ...p,
          latestScreening: {
            ...p.latestScreening,
            supervisorReview: {
              status: 'verified' as VerificationStatus,
              supervisorName: 'Dr. Kwesi Appiah (MD/MPH)',
              supervisorId: 'SUP-001',
              reviewedAt: new Date().toISOString(),
              reviewNotes: 'Verified & approved via Central Supervisor Table.',
            },
          },
        };
      }
      return p;
    });
    onUpdatePatient(updated);
  };

  const handleUpdateSupervisorReview = (
    patientId: string,
    status: VerificationStatus,
    notes: string,
    overrideSeverity?: Severity
  ) => {
    const updated = patients.map((p) => {
      if (p.id === patientId && p.latestScreening) {
        let updatedL1 = p.latestScreening.layer1;
        if (overrideSeverity) {
          updatedL1 = {
            ...updatedL1,
            severity: overrideSeverity,
            isPositive: overrideSeverity === 'Moderate' || overrideSeverity === 'Severe',
          };
        }

        return {
          ...p,
          latestScreening: {
            ...p.latestScreening,
            layer1: updatedL1,
            supervisorReview: {
              status,
              supervisorName: 'Dr. Kwesi Appiah (MD/MPH)',
              supervisorId: 'SUP-001',
              reviewedAt: new Date().toISOString(),
              reviewNotes: notes,
              overrideSeverity,
            },
          },
        };
      }
      return p;
    });
    onUpdatePatient(updated);
  };

  const handleSimulateIncomingTest = () => {
    const simulatedNames = ['Comfort Osei', 'Sulemana Yakubu', 'Rita Acheampong', 'Joshua Addo'];
    const randomName = simulatedNames[Math.floor(Math.random() * simulatedNames.length)];
    const randomAge = Math.floor(18 + Math.random() * 40);
    const randomId = `HS-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomScreeningId = `SCR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const isPregnant = Math.random() > 0.4;

    const newPatient: Patient = {
      id: randomId,
      name: randomName,
      age: randomAge,
      gender: 'Female',
      isPregnant,
      trimester: isPregnant ? '2nd' : undefined,
      village: 'Pantang West Sector',
      phone: '+233 24 000 ' + Math.floor(1000 + Math.random() * 9000),
      registeredAt: new Date().toISOString(),
      screeningsCount: 1,
      latestScreening: {
        id: randomScreeningId,
        patientId: randomId,
        patientName: randomName,
        patientAge: randomAge,
        patientGender: 'Female',
        patientIsPregnant: isPregnant,
        date: 'Just now (Live Packet)',
        facilityName: 'Pantang Health Centre',
        chwName: 'Kofi Owusu (CHW ID: CHW-042)',
        chwId: 'CHW-042',
        layer1: {
          severity: 'Moderate',
          confidence: 87,
          estimatedHb: 8.3,
          conjunctivaColorHex: '#E29578',
          isPositive: true,
          capturedAt: new Date().toISOString(),
          eyeSampleType: 'sample1',
          lightingLux: 560,
        },
        layer2: {
          ferritin: 'Low',
          crp: 'Normal',
          interpretation: 'Likely Iron Deficiency (Inflammation Unlikely)',
          confidence: 90,
          cassetteLotNumber: 'BIO-26-8812',
          analyteTimeRemaining: 0,
          detectedLines: {
            control: true,
            ferritinLine: true,
            crpLine: false,
          },
        },
        recommendation: {
          primaryAction: 'Start Standard Therapeutic Iron Protocol',
          actionType: 'supplement',
          supplementDetails: {
            type: 'Ferrous Sulfate 200mg + Folic Acid 400mcg',
            dosage: '1 tablet daily 30m before meals',
            duration: '3 months',
          },
          considerations: [
            'Dietary counseling on green leafy vegetables & liver',
            'Follow-up in 4 weeks for repeat conjunctiva scan',
          ],
          referralIndicated: false,
          followUpWeeks: 4,
        },
        syncStatus: 'synced',
        supervisorReview: {
          status: 'pending_review',
          supervisorName: '',
          supervisorId: '',
        },
      },
    };

    onAddNewPatientTest(newPatient);
  };

  const handleExportCsv = (filteredList: Patient[]) => {
    const rows = [
      [
        'Patient ID',
        'Name',
        'Age',
        'Sex',
        'Pregnant',
        'Village',
        'Facility',
        'CHW',
        'Date',
        'Severity',
        'Hb (g/dL)',
        'Vision Conf (%)',
        'Ferritin',
        'CRP',
        'Interpretation',
        'Primary Action',
        'Referral Indicated',
        'QA Status',
      ],
      ...filteredList.map((p) => [
        p.id,
        `"${p.name}"`,
        p.age,
        p.gender,
        p.isPregnant ? 'Yes' : 'No',
        `"${p.village}"`,
        `"${p.latestScreening?.facilityName || ''}"`,
        `"${p.latestScreening?.chwName || ''}"`,
        `"${p.latestScreening?.date || ''}"`,
        p.latestScreening?.layer1.severity || 'Unscreened',
        p.latestScreening?.layer1.estimatedHb || '',
        p.latestScreening?.layer1.confidence || '',
        p.latestScreening?.layer2?.ferritin || 'N/A',
        p.latestScreening?.layer2?.crp || 'N/A',
        `"${p.latestScreening?.layer2?.interpretation || ''}"`,
        `"${p.latestScreening?.recommendation.primaryAction || ''}"`,
        p.latestScreening?.recommendation.referralIndicated ? 'YES' : 'NO',
        p.latestScreening?.supervisorReview?.status || 'pending_review',
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HaemaScan_Centralized_Tests_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <SupervisorHeader
        onSyncCentralStream={handleSyncCentralStream}
        isSyncing={isSyncing}
        totalRecordsCount={patients.length}
        unverifiedCount={unverifiedCount}
        onQuickSimulateIncomingTest={handleSimulateIncomingTest}
        activeFacilityFilter={activeFacilityFilter}
        onSelectFacilityFilter={setActiveFacilityFilter}
      />

      {/* 2. Executive KPI Aggregate Summary */}
      <SupervisorKpiSummary patients={patients} />

      {/* 3. Navigation Tabs within the Supervisor Platform */}
      <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto max-w-full">
        <button
          id="subtab-all-tests"
          onClick={() => setActiveTab('all_tests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'all_tests'
              ? 'bg-[#8B1E3F] text-white shadow-md shadow-rose-950'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>All Centralized Tests</span>
        </button>

        <button
          id="subtab-qa-review"
          onClick={() => setActiveTab('qa_review')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'qa_review'
              ? 'bg-[#8B1E3F] text-white shadow-md shadow-rose-950'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Quality Control Audit Desk</span>
          {unverifiedCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold">
              {unverifiedCount}
            </span>
          )}
        </button>

        <button
          id="subtab-surveillance-map"
          onClick={() => setActiveTab('surveillance_map')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'surveillance_map'
              ? 'bg-[#8B1E3F] text-white shadow-md shadow-rose-950'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Epidemiological Heatmap</span>
        </button>

        <button
          id="subtab-chw-team"
          onClick={() => setActiveTab('chw_team')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'chw_team'
              ? 'bg-[#8B1E3F] text-white shadow-md shadow-rose-950'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>CHW Field Roster</span>
        </button>

        <button
          id="subtab-lot-inventory"
          onClick={() => setActiveTab('lot_inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'lot_inventory'
              ? 'bg-[#8B1E3F] text-white shadow-md shadow-rose-950'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>BioSense Lot Control</span>
        </button>

        <button
          id="subtab-dhis2-reports"
          onClick={() => setActiveTab('dhis2_reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'dhis2_reports'
              ? 'bg-[#8B1E3F] text-white shadow-md shadow-rose-950'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>GHS / DHIS2 Reporting</span>
        </button>
      </div>

      {/* 4. Active Tab Content Rendering */}
      {activeTab === 'all_tests' && (
        <CentralizedTestTable
          patients={patients}
          onSelectPatientForReview={setSelectedPatientForDetail}
          onQuickVerifyTest={handleQuickVerifyTest}
          onExportCsv={handleExportCsv}
          onOpenReferralSlip={setReferralModalPatient}
          activeFacilityFilter={activeFacilityFilter}
        />
      )}

      {activeTab === 'qa_review' && (
        <QualityControlReviewDesk
          patients={patients}
          onUpdateSupervisorReview={handleUpdateSupervisorReview}
          onOpenReferralModal={setReferralModalPatient}
        />
      )}

      {activeTab === 'surveillance_map' && <EpidemiologicalHeatmap patients={patients} />}

      {activeTab === 'chw_team' && <CHWTeamDirectory />}

      {activeTab === 'lot_inventory' && <BioSenseInventoryDesk />}

      {activeTab === 'dhis2_reports' && <DHIS2ReportGenerator patients={patients} />}

      {/* Detail & Audit Modal */}
      {selectedPatientForDetail && (
        <TestDetailModal
          patient={selectedPatientForDetail}
          onClose={() => setSelectedPatientForDetail(null)}
          onUpdateSupervisorReview={handleUpdateSupervisorReview}
          onOpenReferralModal={setReferralModalPatient}
        />
      )}

      {/* Printable Referral Slip Modal */}
      {referralModalPatient && (
        <ReferralSlipModal
          patient={referralModalPatient}
          onClose={() => setReferralModalPatient(null)}
        />
      )}
    </div>
  );
};
