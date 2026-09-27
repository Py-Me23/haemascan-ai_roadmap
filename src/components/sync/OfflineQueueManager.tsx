import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Wifi,
  WifiOff,
  AlertCircle,
  Clock,
  CheckCircle2,
  Play,
  Pause,
  ArrowUpCircle,
  Eye,
  FileCode,
  Download,
  Plus,
  Shield,
  Zap,
  Radio,
  Signal,
  Smartphone,
  ChevronDown,
  ChevronUp,
  X,
  Copy,
  Check,
  HardDrive,
  Activity,
  Layers,
  ArrowRight,
  Database,
} from 'lucide-react';
import { Patient, ScreeningRecord, SyncAttemptStatus, SyncMetadata, Severity } from '../../types';

interface OfflineQueueManagerProps {
  patients: Patient[];
  onUpdatePatient: (updatedPatients: Patient[]) => void;
  onAddNewPatientTest?: (newPatient: Patient) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  onBackToHome?: () => void;
  isWireframe?: boolean;
}

export type NetworkSimulationMode = 'online_4g' | 'weak_3g' | 'edge_2g' | 'offline';

export const OfflineQueueManager: React.FC<OfflineQueueManagerProps> = ({
  patients,
  onUpdatePatient,
  onAddNewPatientTest,
  isOnline,
  onToggleOnline,
  onBackToHome,
  isWireframe,
}) => {
  const [networkMode, setNetworkMode] = useState<NetworkSimulationMode>(
    isOnline ? 'online_4g' : 'offline'
  );
  const [activeSyncingPatientId, setActiveSyncingPatientId] = useState<string | null>(null);
  const [syncAllInProgress, setSyncAllInProgress] = useState<boolean>(false);
  const [selectedPayloadPatient, setSelectedPayloadPatient] = useState<Patient | null>(null);
  const [expandedHistoryPatientId, setExpandedHistoryPatientId] = useState<string | null>(null);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);
  const [autoRetryTimers, setAutoRetryTimers] = useState<Record<string, number>>({});
  const [syncProgress, setSyncProgress] = useState<Record<string, number>>({});

  // Filter patients with pending sync
  const pendingPatients = patients.filter(
    (p) => p.latestScreening && p.latestScreening.syncStatus === 'pending_sync'
  );

  const syncedPatientsCount = patients.filter(
    (p) => p.latestScreening && p.latestScreening.syncStatus === 'synced'
  ).length;

  // Total payload size in bytes
  const totalPayloadBytes = pendingPatients.reduce((acc, p) => {
    return acc + (p.latestScreening?.syncMetadata?.payloadSizeBytes || 14500);
  }, 0);

  // Sync state counts
  const failedCount = pendingPatients.filter(
    (p) => p.latestScreening?.syncMetadata?.status === 'failed'
  ).length;
  const queuedCount = pendingPatients.filter(
    (p) => !p.latestScreening?.syncMetadata || p.latestScreening.syncMetadata.status === 'queued'
  ).length;
  const pausedCount = pendingPatients.filter(
    (p) => p.latestScreening?.syncMetadata?.status === 'paused'
  ).length;

  // Live countdown timer for failed retry items
  useEffect(() => {
    const interval = setInterval(() => {
      setAutoRetryTimers((prev) => {
        const next: Record<string, number> = {};
        pendingPatients.forEach((p) => {
          if (p.latestScreening?.syncMetadata?.status === 'failed') {
            const currentSeconds =
              prev[p.id] !== undefined
                ? prev[p.id]
                : p.latestScreening.syncMetadata.nextRetryInSeconds || 15;

            if (currentSeconds <= 1) {
              // Trigger auto-retry if network is not offline
              if (networkMode !== 'offline' && !activeSyncingPatientId && !syncAllInProgress) {
                handleSyncIndividualRecord(p.id);
              }
              next[p.id] = 20; // reset retry countdown
            } else {
              next[p.id] = currentSeconds - 1;
            }
          }
        });
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pendingPatients, networkMode, activeSyncingPatientId, syncAllInProgress]);

  // Sync a single record with realistic staged progression
  const handleSyncIndividualRecord = (patientId: string) => {
    if (networkMode === 'offline') {
      // Mark as failed due to no network
      updateRecordSyncState(patientId, {
        status: 'failed',
        attemptCount: (getMetadata(patientId)?.attemptCount || 0) + 1,
        lastAttemptAt: new Date().toISOString(),
        nextRetryInSeconds: 20,
        lastErrorReason: 'Offline: No cellular or WiFi transceiver connection',
        progressPercent: 0,
        history: [
          ...(getMetadata(patientId)?.history || []),
          {
            timestamp: new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
            status: 'failed',
            message: 'Connection failed: Network transceiver is offline',
            errorCode: 'NET_UNREACHABLE',
          },
        ],
      });
      return;
    }

    setActiveSyncingPatientId(patientId);
    setSyncProgress((prev) => ({ ...prev, [patientId]: 15 }));

    // Stage 1: Handshake & Encryption
    setTimeout(() => {
      setSyncProgress((prev) => ({ ...prev, [patientId]: 45 }));

      // Stage 2: Transmitting payload
      setTimeout(() => {
        // If 2G with high packet loss, 30% chance of random timeout simulation if on edge_2g
        if (networkMode === 'edge_2g' && Math.random() < 0.35) {
          setActiveSyncingPatientId(null);
          setSyncProgress((prev) => ({ ...prev, [patientId]: 0 }));
          updateRecordSyncState(patientId, {
            status: 'failed',
            attemptCount: (getMetadata(patientId)?.attemptCount || 0) + 1,
            lastAttemptAt: new Date().toISOString(),
            nextRetryInSeconds: 15,
            lastErrorReason: 'HTTP 408 Timeout: Dropped packet over 2G EDGE link',
            progressPercent: 0,
            history: [
              ...(getMetadata(patientId)?.history || []),
              {
                timestamp: new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                }),
                status: 'failed',
                message: 'Socket timeout during multipart upload (MTN Cell #3912)',
                errorCode: 'HTTP_408',
              },
            ],
          });
          return;
        }

        setSyncProgress((prev) => ({ ...prev, [patientId]: 85 }));

        // Stage 3: Confirmation & Ingestion
        setTimeout(() => {
          setSyncProgress((prev) => ({ ...prev, [patientId]: 100 }));
          setActiveSyncingPatientId(null);
          markRecordAsSynced(patientId);
        }, 500);
      }, networkMode === 'edge_2g' ? 1200 : 700);
    }, 400);
  };

  // Batch Sync All Pending Records sequentially
  const handleSyncAllPending = async () => {
    if (networkMode === 'offline') {
      alert('Cannot sync while Offline. Please switch network mode to 4G LTE, 3G, or 2G.');
      return;
    }

    setSyncAllInProgress(true);
    const queueToSync = [...pendingPatients];

    for (let i = 0; i < queueToSync.length; i++) {
      const patient = queueToSync[i];
      setActiveSyncingPatientId(patient.id);
      setSyncProgress((prev) => ({ ...prev, [patient.id]: 30 }));

      await new Promise((r) => setTimeout(r, 400));
      setSyncProgress((prev) => ({ ...prev, [patient.id]: 70 }));

      await new Promise((r) => setTimeout(r, 400));
      setSyncProgress((prev) => ({ ...prev, [patient.id]: 100 }));

      markRecordAsSynced(patient.id);
      await new Promise((r) => setTimeout(r, 200));
    }

    setActiveSyncingPatientId(null);
    setSyncAllInProgress(false);
  };

  const getMetadata = (patientId: string): SyncMetadata | undefined => {
    const patient = patients.find((p) => p.id === patientId);
    return patient?.latestScreening?.syncMetadata;
  };

  const updateRecordSyncState = (patientId: string, metadataUpdates: Partial<SyncMetadata>) => {
    const updated = patients.map((p) => {
      if (p.id === patientId && p.latestScreening) {
        const existingMeta = p.latestScreening.syncMetadata || {
          status: 'queued' as SyncAttemptStatus,
          attemptCount: 0,
          maxRetries: 5,
          payloadSizeBytes: 15200,
          priority: 'normal' as const,
        };
        return {
          ...p,
          latestScreening: {
            ...p.latestScreening,
            syncMetadata: {
              ...existingMeta,
              ...metadataUpdates,
            },
          },
        };
      }
      return p;
    });
    onUpdatePatient(updated);
  };

  const markRecordAsSynced = (patientId: string) => {
    const updated = patients.map((p) => {
      if (p.id === patientId && p.latestScreening) {
        return {
          ...p,
          latestScreening: {
            ...p.latestScreening,
            syncStatus: 'synced' as const,
            syncMetadata: {
              status: 'synced' as const,
              attemptCount: (p.latestScreening.syncMetadata?.attemptCount || 0) + 1,
              maxRetries: 5,
              lastAttemptAt: new Date().toISOString(),
              progressPercent: 100,
              lastErrorReason: undefined,
              history: [
                ...(p.latestScreening.syncMetadata?.history || []),
                {
                  timestamp: new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  }),
                  status: 'synced' as const,
                  message: `Acknowledged by GHS Gateway (Server ID: GHS-2026-REC-${Math.floor(
                    10000 + Math.random() * 90000
                  )})`,
                  durationMs: 640,
                },
              ],
            },
          },
        };
      }
      return p;
    });
    onUpdatePatient(updated);
  };

  const handleTogglePause = (patientId: string) => {
    const currentStatus = getMetadata(patientId)?.status;
    const newStatus: SyncAttemptStatus = currentStatus === 'paused' ? 'queued' : 'paused';
    updateRecordSyncState(patientId, {
      status: newStatus,
      lastErrorReason:
        newStatus === 'paused' ? 'Sync paused manually by CHW' : 'Queued for next available cycle',
    });
  };

  const handlePrioritize = (patientId: string) => {
    const currentPriority = getMetadata(patientId)?.priority;
    const newPriority = currentPriority === 'urgent' ? 'normal' : 'urgent';
    updateRecordSyncState(patientId, {
      priority: newPriority,
    });
  };

  // Simulate generating a new offline screening record in the field
  const handleSimulateNewOfflineRecord = () => {
    const newPatientId = `HS-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomVillages = ['Abokobi Ward 4', 'Teiman East', 'Sesemi Hillside', 'Danfa North'];
    const randomNames = ['Esi Ansah', 'Kweku Frimpong', 'Akua Appiah', 'Seth Addo'];
    const randomSeverities: Severity[] = ['Moderate', 'Severe', 'Mild'];

    const chosenSeverity =
      randomSeverities[Math.floor(Math.random() * randomSeverities.length)];
    const chosenName = randomNames[Math.floor(Math.random() * randomNames.length)];
    const chosenVillage = randomVillages[Math.floor(Math.random() * randomVillages.length)];

    const newScreening: ScreeningRecord = {
      id: `SCR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: newPatientId,
      patientName: chosenName,
      patientAge: Math.floor(18 + Math.random() * 40),
      patientGender: Math.random() > 0.3 ? 'Female' : 'Male',
      patientIsPregnant: Math.random() > 0.5,
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      district: 'Ga East Municipal',
      facilityName: 'Pantang Health Centre',
      chwName: 'Kofi Owusu (CHW ID: CHW-042)',
      chwId: 'CHW-042',
      layer1: {
        severity: chosenSeverity,
        confidence: Math.floor(82 + Math.random() * 14),
        estimatedHb: chosenSeverity === 'Severe' ? 5.8 : chosenSeverity === 'Moderate' ? 8.4 : 10.9,
        conjunctivaColorHex: chosenSeverity === 'Severe' ? '#F4D4C8' : '#E29578',
        isPositive: chosenSeverity === 'Moderate' || chosenSeverity === 'Severe',
        capturedAt: new Date().toISOString(),
        eyeSampleType: 'sample1',
      },
      layer2: {
        ferritin: 'Low',
        crp: chosenSeverity === 'Severe' ? 'Elevated' : 'Normal',
        interpretation:
          chosenSeverity === 'Severe'
            ? 'Severe Anemia with Acute Inflammatory Phase'
            : 'Nutritional Iron Deficiency Anemia (IDA)',
        confidence: 89,
        cassetteLotNumber: 'BIO-26-8812',
        analyteTimeRemaining: 0,
        detectedLines: {
          control: true,
          ferritinLine: true,
          crpLine: chosenSeverity === 'Severe',
        },
      },
      recommendation: {
        primaryAction:
          chosenSeverity === 'Severe'
            ? 'Urgent Hospital Referral & Complete Blood Count'
            : 'Initiate Therapeutic Oral Iron Therapy',
        actionType: chosenSeverity === 'Severe' ? 'refer' : 'supplement',
        supplementDetails: {
          type: 'Ferrous Sulfate 200mg + Folic Acid 400mcg',
          dosage: '1 tablet daily before meals',
          duration: '3 months',
        },
        considerations: [
          'Dietary counseling on iron-rich indigenous vegetables',
          'Follow-up in 4 weeks for repeat check',
        ],
        referralIndicated: chosenSeverity === 'Severe',
        followUpWeeks: chosenSeverity === 'Severe' ? 1 : 4,
      },
      syncStatus: 'pending_sync',
      syncMetadata: {
        status: 'queued',
        attemptCount: 0,
        maxRetries: 5,
        payloadSizeBytes: Math.floor(13500 + Math.random() * 4000),
        priority: chosenSeverity === 'Severe' ? 'urgent' : 'high',
        progressPercent: 0,
        lastErrorReason: 'Saved offline in SQLite storage; pending sync',
        history: [
          {
            timestamp: new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
            status: 'attempting',
            message: 'Record created during offline field screening session',
          },
        ],
      },
    };

    const newPatient: Patient = {
      id: newPatientId,
      name: chosenName,
      age: newScreening.patientAge,
      gender: newScreening.patientGender as any,
      isPregnant: newScreening.patientIsPregnant,
      village: chosenVillage,
      registeredAt: new Date().toISOString(),
      screeningsCount: 1,
      latestScreening: newScreening,
    };

    if (onAddNewPatientTest) {
      onAddNewPatientTest(newPatient);
    } else {
      onUpdatePatient([newPatient, ...patients]);
    }
  };

  const handleExportOfflineArchive = () => {
    const payload = JSON.stringify(
      {
        archiveVersion: '2.4.0-GHS',
        exportedAt: new Date().toISOString(),
        deviceChw: 'CHW-042 (Kofi Owusu)',
        facility: 'Pantang Health Centre',
        totalPendingRecords: pendingPatients.length,
        records: pendingPatients.map((p) => ({
          patientId: p.id,
          name: p.name,
          demographics: { age: p.age, gender: p.gender, village: p.village },
          screening: p.latestScreening,
          sha256Checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        })),
      },
      null,
      2
    );

    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `haemascan_offline_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleCopyJsonPayload = () => {
    if (!selectedPayloadPatient) return;
    const jsonStr = JSON.stringify(
      {
        header: {
          protocolVersion: 'GHS-FHIR-v2.4',
          deviceId: 'ANDR-DEV-9921',
          chwId: selectedPayloadPatient.latestScreening?.chwId || 'CHW-042',
          facility: selectedPayloadPatient.latestScreening?.facilityName || 'Pantang Health Centre',
          sha256: 'a71e8f9024cba3912efc49019283748291038472910283746591029384756102',
          encryption: 'AES-256-GCM',
        },
        patient: {
          id: selectedPayloadPatient.id,
          name: selectedPayloadPatient.name,
          age: selectedPayloadPatient.age,
          gender: selectedPayloadPatient.gender,
          isPregnant: selectedPayloadPatient.isPregnant,
          village: selectedPayloadPatient.village,
        },
        clinicalRecord: selectedPayloadPatient.latestScreening,
      },
      null,
      2
    );
    navigator.clipboard.writeText(jsonStr);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  if (isWireframe) {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-200 p-4 font-mono text-xs select-none">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-3">
          <span className="font-bold text-slate-100">[OFFLINE_QUEUE_MANAGER]</span>
          <span className="text-[10px] text-amber-400">PENDING: {pendingPatients.length}</span>
        </div>

        {/* Action Controls */}
        <div className="p-3 border border-slate-700 rounded bg-slate-950/40 mb-3 space-y-2">
          <div className="text-[10px] text-slate-400">
            TOTAL_BUFFER: {formatBytes(totalPayloadBytes)} | SYNCED_CLOUD: {syncedPatientsCount}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSyncAllPending}
              disabled={pendingPatients.length === 0}
              className="py-1.5 border border-rose-500 rounded text-rose-300 font-bold"
            >
              [ SYNC_ALL_QUEUE ]
            </button>
            <button
              onClick={handleSimulateNewOfflineRecord}
              className="py-1.5 border border-slate-600 rounded text-slate-300 font-bold"
            >
              [ + SIMULATE_REC ]
            </button>
          </div>
        </div>

        {/* Queue List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {pendingPatients.map((p) => (
            <div
              key={p.id}
              className="p-2 border border-slate-700 rounded bg-slate-950/30 text-[11px]"
            >
              <div className="flex justify-between items-center font-bold text-slate-200">
                <span>{p.name}</span>
                <span className="text-[10px] px-1 py-0.5 border border-amber-500 text-amber-400">
                  {p.latestScreening?.syncMetadata?.status?.toUpperCase() || 'QUEUED'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {p.id} | {p.village} | {p.latestScreening?.layer1.severity} (
                {p.latestScreening?.layer1.estimatedHb} g/dL)
              </div>
              {p.latestScreening?.syncMetadata?.lastErrorReason && (
                <div className="text-[9px] text-rose-400 mt-1">
                  ERR: {p.latestScreening.syncMetadata.lastErrorReason}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 select-none overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-white border-b border-slate-200/80 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold">
            <Radio className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 leading-tight">
              Offline Queue Manager
            </h1>
            <p className="text-[10px] font-medium text-slate-500">
              Field Local Storage • Sync Dispatcher
            </p>
          </div>
        </div>

        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-all"
          >
            Done
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3">
        {/* Network Emulation Ribbon */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-2xs space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5 text-slate-700" />
              <span className="text-xs font-bold text-slate-800">Network Simulation</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                networkMode === 'online_4g'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : networkMode === 'weak_3g'
                  ? 'bg-sky-50 text-sky-800 border border-sky-200'
                  : networkMode === 'edge_2g'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {networkMode === 'offline' ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
              {networkMode === 'online_4g'
                ? '4G LTE (Online)'
                : networkMode === 'weak_3g'
                ? '3G HSPA (Fair)'
                : networkMode === 'edge_2g'
                ? '2G EDGE (Unstable)'
                : 'Offline Mode'}
            </span>
          </div>

          {/* Quick Network Selector Chips */}
          <div className="grid grid-cols-4 gap-1 pt-0.5">
            <button
              onClick={() => {
                setNetworkMode('online_4g');
                if (!isOnline) onToggleOnline();
              }}
              className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center border ${
                networkMode === 'online_4g'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              4G LTE
            </button>

            <button
              onClick={() => {
                setNetworkMode('weak_3g');
                if (!isOnline) onToggleOnline();
              }}
              className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center border ${
                networkMode === 'weak_3g'
                  ? 'bg-sky-600 text-white border-sky-700 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              3G Cell
            </button>

            <button
              onClick={() => {
                setNetworkMode('edge_2g');
                if (!isOnline) onToggleOnline();
              }}
              className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center border ${
                networkMode === 'edge_2g'
                  ? 'bg-amber-600 text-white border-amber-700 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              2G EDGE
            </button>

            <button
              onClick={() => {
                setNetworkMode('offline');
                if (isOnline) onToggleOnline();
              }}
              className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center border ${
                networkMode === 'offline'
                  ? 'bg-rose-600 text-white border-rose-700 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Offline
            </button>
          </div>
        </div>

        {/* Queue Overview KPI Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-xl border border-slate-200 p-2.5 text-center shadow-2xs">
            <div className="text-[10px] text-slate-500 font-medium">Pending Sync</div>
            <div className="text-lg font-black text-amber-700 mt-0.5 leading-none">
              {pendingPatients.length}
            </div>
            <div className="text-[9px] text-slate-400 mt-1 font-mono">
              {formatBytes(totalPayloadBytes)}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-2.5 text-center shadow-2xs">
            <div className="text-[10px] text-slate-500 font-medium">Failed/Retrying</div>
            <div className="text-lg font-black text-rose-700 mt-0.5 leading-none">
              {failedCount}
            </div>
            <div className="text-[9px] text-slate-400 mt-1">Backoff active</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-2.5 text-center shadow-2xs">
            <div className="text-[10px] text-slate-500 font-medium">Synced to Cloud</div>
            <div className="text-lg font-black text-emerald-700 mt-0.5 leading-none">
              {syncedPatientsCount}
            </div>
            <div className="text-[9px] text-slate-400 mt-1">GHS Ingested</div>
          </div>
        </div>

        {/* Master Action Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs space-y-2">
          <div className="flex gap-2">
            <button
              onClick={handleSyncAllPending}
              disabled={syncAllInProgress || pendingPatients.length === 0}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#8B1E3F] text-white text-xs font-bold shadow-xs hover:bg-[#731833] disabled:opacity-50 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncAllInProgress ? 'animate-spin' : ''}`} />
              <span>
                {syncAllInProgress
                  ? 'Syncing Queue with Cloud...'
                  : `Sync All Records (${pendingPatients.length})`}
              </span>
            </button>

            <button
              onClick={handleSimulateNewOfflineRecord}
              title="Add a simulated field screening record to the offline queue"
              className="px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-bold flex items-center gap-1 shrink-0 active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-[#8B1E3F]" />
              <span>+ Record</span>
            </button>
          </div>

          <div className="flex justify-between items-center pt-1 text-[10px] text-slate-500">
            <div className="flex items-center gap-1">
              <Database className="w-3 h-3 text-slate-400" />
              <span>Encrypted Room SQLite DB</span>
            </div>
            <button
              onClick={handleExportOfflineArchive}
              disabled={pendingPatients.length === 0}
              className="font-bold text-[#8B1E3F] hover:underline flex items-center gap-1 disabled:opacity-40"
            >
              <Download className="w-3 h-3" />
              <span>Export Archive (.json)</span>
            </button>
          </div>
        </div>

        {/* Individual Pending Records Header */}
        <div className="flex justify-between items-center pt-1 px-1">
          <h2 className="text-xs font-bold text-slate-800">
            Individual Queue Items ({pendingPatients.length})
          </h2>
          <span className="text-[10px] text-slate-500 font-mono">FIFO Dispatch Order</span>
        </div>

        {/* Empty State when queue is cleared */}
        {pendingPatients.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-6 text-center shadow-2xs space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Offline Queue is Empty</h3>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              All field screening telemetry, patient demographics, and conjunctiva images are
              securely synchronized with the Ghana Health Service Central Cloud.
            </p>
            <button
              onClick={handleSimulateNewOfflineRecord}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#8B1E3F] text-xs font-bold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Test Offline Screening</span>
            </button>
          </div>
        )}

        {/* List of Pending Patient Record Cards */}
        {pendingPatients.map((patient) => {
          const screening = patient.latestScreening;
          const meta = screening?.syncMetadata;
          const status = meta?.status || 'queued';
          const isSyncingThis = activeSyncingPatientId === patient.id;
          const progress = syncProgress[patient.id] || 0;
          const retrySeconds = autoRetryTimers[patient.id] ?? meta?.nextRetryInSeconds ?? 15;
          const isHistoryExpanded = expandedHistoryPatientId === patient.id;

          return (
            <div
              key={patient.id}
              className={`bg-white rounded-2xl border transition-all shadow-2xs overflow-hidden ${
                status === 'failed'
                  ? 'border-rose-200 ring-1 ring-rose-100'
                  : status === 'paused'
                  ? 'border-slate-300 bg-slate-50/60'
                  : isSyncingThis
                  ? 'border-sky-300 ring-2 ring-sky-100'
                  : 'border-slate-200/90'
              }`}
            >
              {/* Card Top Section: Patient & Severity */}
              <div className="p-3 border-b border-slate-100 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                      {patient.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">{patient.name}</span>
                        {patient.isPregnant && (
                          <span className="text-[9px] font-bold bg-rose-50 text-[#8B1E3F] px-1.5 py-0.2 rounded-md border border-rose-100">
                            ANC
                          </span>
                        )}
                        {meta?.priority === 'urgent' && (
                          <span className="text-[9px] font-bold bg-rose-600 text-white px-1.5 py-0.2 rounded-md animate-pulse">
                            Urgent
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.2">
                        ID: {patient.id} • {patient.village}
                      </div>
                    </div>
                  </div>

                  {/* Clinical Tag */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      screening?.layer1.severity === 'Severe'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : screening?.layer1.severity === 'Moderate'
                        ? 'bg-orange-50 text-orange-800 border border-orange-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {screening?.layer1.severity} ({screening?.layer1.estimatedHb} g/dL)
                  </span>
                </div>

                {/* Specific Sync Attempt Status Banner */}
                <div
                  className={`p-2 rounded-xl text-xs flex flex-col gap-1 border ${
                    status === 'failed'
                      ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                      : status === 'paused'
                      ? 'bg-slate-100 border-slate-200 text-slate-700'
                      : isSyncingThis
                      ? 'bg-sky-50 border-sky-200 text-sky-900'
                      : 'bg-amber-50/60 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 font-bold text-[11px]">
                      {status === 'failed' && (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Sync Attempt #{meta?.attemptCount || 1} Failed</span>
                        </>
                      )}
                      {status === 'paused' && (
                        <>
                          <Pause className="w-3.5 h-3.5 text-slate-500" />
                          <span>Sync Paused by Worker</span>
                        </>
                      )}
                      {status === 'queued' && !isSyncingThis && (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Queued in Local Storage</span>
                        </>
                      )}
                      {isSyncingThis && (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 text-sky-600 animate-spin" />
                          <span>Transmitting Payload ({progress}%)...</span>
                        </>
                      )}
                    </div>

                    {/* Secondary Status Countdown */}
                    {status === 'failed' && (
                      <span className="text-[10px] font-mono text-rose-700 font-semibold">
                        Retry in {retrySeconds}s
                      </span>
                    )}
                    {status === 'queued' && !isSyncingThis && (
                      <span className="text-[10px] text-amber-800 font-mono">
                        Ready to transmit
                      </span>
                    )}
                  </div>

                  {/* Specific error message if failed */}
                  {status === 'failed' && meta?.lastErrorReason && (
                    <div className="text-[10px] text-rose-700 font-medium pl-5">
                      Reason: {meta.lastErrorReason}
                    </div>
                  )}

                  {/* Active Upload Progress Bar */}
                  {isSyncingThis && (
                    <div className="w-full bg-sky-200 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div
                        className="bg-sky-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Encrypted Payload Components Tag Row */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="bg-slate-100 text-slate-700 font-mono px-1.5 py-0.5 rounded border border-slate-200">
                      📦 {formatBytes(meta?.payloadSizeBytes || 15400)}
                    </span>
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      Vision ROI
                    </span>
                    {screening?.layer2 && (
                      <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        BioSense Strip
                      </span>
                    )}
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      Rx Guidance
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      setExpandedHistoryPatientId(isHistoryExpanded ? null : patient.id)
                    }
                    className="text-[#8B1E3F] font-bold hover:underline flex items-center gap-0.5 text-[10px]"
                  >
                    <span>Logs ({meta?.history?.length || 1})</span>
                    {isHistoryExpanded ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible History Drawer */}
              {isHistoryExpanded && (
                <div className="bg-slate-900 text-slate-200 p-3 font-mono text-[10px] space-y-1.5 border-b border-slate-200">
                  <div className="text-slate-400 font-bold flex justify-between">
                    <span>TRANSMISSION DISPATCH LOGS</span>
                    <span>ATTEMPTS: {meta?.attemptCount || 0} / 5</span>
                  </div>
                  <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                    {meta?.history && meta.history.length > 0 ? (
                      meta.history.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-slate-300">
                          <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                          <span
                            className={
                              log.status === 'failed'
                                ? 'text-rose-400'
                                : log.status === 'synced'
                                ? 'text-emerald-400'
                                : 'text-sky-300'
                            }
                          >
                            {log.message}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500">No previous transmission logs found.</div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Toolbar per Record */}
              <div className="px-3 py-2 bg-slate-50 flex justify-between items-center gap-2">
                <div className="flex items-center gap-1">
                  {/* Inspect Payload Button */}
                  <button
                    onClick={() => setSelectedPayloadPatient(patient)}
                    className="px-2 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                  >
                    <FileCode className="w-3 h-3 text-[#8B1E3F]" />
                    <span>Payload</span>
                  </button>

                  {/* Prioritize Button */}
                  <button
                    onClick={() => handlePrioritize(patient.id)}
                    className={`px-2 py-1 border rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                      meta?.priority === 'urgent'
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ArrowUpCircle className="w-3 h-3 text-rose-600" />
                    <span>{meta?.priority === 'urgent' ? 'Urgent' : 'Prioritize'}</span>
                  </button>

                  {/* Pause / Resume Button */}
                  <button
                    onClick={() => handleTogglePause(patient.id)}
                    className="px-2 py-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                  >
                    {status === 'paused' ? (
                      <>
                        <Play className="w-3 h-3 text-emerald-600" />
                        <span>Resume</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-3 h-3 text-slate-500" />
                        <span>Pause</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Primary Sync Record Now Button */}
                <button
                  onClick={() => handleSyncIndividualRecord(patient.id)}
                  disabled={isSyncingThis || syncAllInProgress}
                  className="px-3 py-1 bg-[#8B1E3F] text-white hover:bg-[#731833] disabled:opacity-50 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncingThis ? 'animate-spin' : ''}`} />
                  <span>{isSyncingThis ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payload Inspector Modal */}
      {selectedPayloadPatient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-700 text-slate-200 rounded-2xl w-full max-w-sm max-h-[85vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-slate-100">Encrypted Telemetry Payload</span>
              </div>
              <button
                onClick={() => setSelectedPayloadPatient(null)}
                className="w-6 h-6 rounded-md hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Formatted Telemetry JSON */}
            <div className="p-3.5 overflow-y-auto space-y-2.5 flex-1 text-[11px]">
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] space-y-0.5">
                <div className="text-slate-400">
                  PATIENT: <span className="text-slate-100 font-bold">{selectedPayloadPatient.name}</span>
                </div>
                <div className="text-slate-400">
                  ID: <span className="text-slate-200">{selectedPayloadPatient.id}</span> | SIZE:{' '}
                  <span className="text-amber-400">
                    {formatBytes(
                      selectedPayloadPatient.latestScreening?.syncMetadata?.payloadSizeBytes || 15400
                    )}
                  </span>
                </div>
                <div className="text-slate-400">
                  CIPHER: <span className="text-emerald-400">AES-256-GCM (GHS Hardware Keystore)</span>
                </div>
                <div className="text-slate-400 truncate">
                  SHA-256:{' '}
                  <span className="text-sky-300">
                    3c90e48271a9bf81920cd4918237e19a0293847561028374
                  </span>
                </div>
              </div>

              <div className="relative">
                <pre className="bg-black/80 border border-slate-800 p-3 rounded-xl overflow-x-auto text-slate-300 text-[10px] max-h-60 leading-relaxed">
                  {JSON.stringify(
                    {
                      protocol: 'GHS-HAEMASCAN-FHIR-V2.4',
                      recordId: selectedPayloadPatient.latestScreening?.id,
                      patient: {
                        id: selectedPayloadPatient.id,
                        name: selectedPayloadPatient.name,
                        demographics: {
                          age: selectedPayloadPatient.age,
                          gender: selectedPayloadPatient.gender,
                          isPregnant: selectedPayloadPatient.isPregnant,
                          village: selectedPayloadPatient.village,
                        },
                      },
                      screeningSession: {
                        timestamp: selectedPayloadPatient.latestScreening?.date,
                        facility: selectedPayloadPatient.latestScreening?.facilityName,
                        chwOperator: selectedPayloadPatient.latestScreening?.chwName,
                        layer1Vision: selectedPayloadPatient.latestScreening?.layer1,
                        layer2BioSense: selectedPayloadPatient.latestScreening?.layer2,
                        prescription: selectedPayloadPatient.latestScreening?.recommendation,
                      },
                      syncDiagnostics: selectedPayloadPatient.latestScreening?.syncMetadata,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-950 flex justify-between items-center">
              <button
                onClick={handleCopyJsonPayload}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                {copiedPayload ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  handleSyncIndividualRecord(selectedPayloadPatient.id);
                  setSelectedPayloadPatient(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#8B1E3F] hover:bg-[#731833] text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
