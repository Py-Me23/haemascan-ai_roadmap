import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  CheckSquare,
  Square,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Droplets,
  ExternalLink,
  ChevronDown,
  ArrowUpDown,
  FileSpreadsheet,
  BadgeCheck,
  ShieldAlert,
  Edit3,
} from 'lucide-react';
import { Patient, Severity, VerificationStatus } from '../../types';

interface CentralizedTestTableProps {
  patients: Patient[];
  onSelectPatientForReview: (patient: Patient) => void;
  onQuickVerifyTest: (patientId: string) => void;
  onExportCsv: (filteredPatients: Patient[]) => void;
  onOpenReferralSlip: (patient: Patient) => void;
  activeFacilityFilter: string;
}

export const CentralizedTestTable: React.FC<CentralizedTestTableProps> = ({
  patients,
  onSelectPatientForReview,
  onQuickVerifyTest,
  onExportCsv,
  onOpenReferralSlip,
  activeFacilityFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [verificationFilter, setVerificationFilter] = useState<string>('All');
  const [layerFilter, setLayerFilter] = useState<string>('All');
  const [pregnantFilter, setPregnantFilter] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'date' | 'hb' | 'name'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter and sort logic
  const filteredPatients = useMemo(() => {
    return patients
      .filter((p) => {
        // Facility filter
        if (activeFacilityFilter !== 'All Facilities (District-Wide)') {
          if (p.latestScreening?.facilityName !== activeFacilityFilter) return false;
        }

        // Search
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(term);
          const matchesId = p.id.toLowerCase().includes(term);
          const matchesVillage = p.village.toLowerCase().includes(term);
          const matchesChw = p.latestScreening?.chwName.toLowerCase().includes(term) || false;
          if (!matchesName && !matchesId && !matchesVillage && !matchesChw) return false;
        }

        // Severity filter
        if (severityFilter !== 'All') {
          if (p.latestScreening?.layer1.severity !== severityFilter) return false;
        }

        // Verification status
        if (verificationFilter !== 'All') {
          const status = p.latestScreening?.supervisorReview?.status || 'pending_review';
          if (status !== verificationFilter) return false;
        }

        // Layer filter
        if (layerFilter === 'Layer 1 Only') {
          if (p.latestScreening?.layer2) return false;
        } else if (layerFilter === 'Layer 1 + 2 (BioSense)') {
          if (!p.latestScreening?.layer2) return false;
        }

        // Pregnant filter
        if (pregnantFilter === 'Pregnant Only') {
          if (!p.isPregnant) return false;
        } else if (pregnantFilter === 'Non-Pregnant') {
          if (p.isPregnant) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortField === 'name') {
          return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        if (sortField === 'hb') {
          const hbA = a.latestScreening?.layer1.estimatedHb || 0;
          const hbB = b.latestScreening?.layer1.estimatedHb || 0;
          return sortAsc ? hbA - hbB : hbB - hbA;
        }
        // default date
        const dateA = new Date(a.latestScreening?.layer1.capturedAt || a.registeredAt).getTime();
        const dateB = new Date(b.latestScreening?.layer1.capturedAt || b.registeredAt).getTime();
        return sortAsc ? dateA - dateB : dateB - dateA;
      });
  }, [
    patients,
    activeFacilityFilter,
    searchTerm,
    severityFilter,
    verificationFilter,
    layerFilter,
    pregnantFilter,
    sortField,
    sortAsc,
  ]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPatients.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPatients.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkVerify = () => {
    selectedIds.forEach((id) => onQuickVerifyTest(id));
    setSelectedIds([]);
  };

  const getSeverityBadge = (sev?: Severity) => {
    switch (sev) {
      case 'Normal':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Normal
          </span>
        );
      case 'Mild':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Mild Pallor
          </span>
        );
      case 'Moderate':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-950 text-orange-300 border border-orange-800 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            Moderate Anemia
          </span>
        );
      case 'Severe':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1 w-fit animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Severe Anemia
          </span>
        );
      default:
        return <span className="text-slate-500 text-xs">Unscreened</span>;
    }
  };

  const getVerificationBadge = (review?: { status: VerificationStatus; supervisorName?: string }) => {
    const status = review?.status || 'pending_review';
    switch (status) {
      case 'verified':
        return (
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
            <BadgeCheck className="w-3 h-3 text-emerald-400" />
            Verified & Approved
          </span>
        );
      case 'flagged':
        return (
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            Flagged Escalation
          </span>
        );
      case 'overridden':
        return (
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1">
            <Edit3 className="w-3 h-3 text-purple-400" />
            MD Override
          </span>
        );
      case 'pending_review':
      default:
        return (
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-800 text-amber-300 border border-amber-800/60 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            Pending QA Audit
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
      {/* Table Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <span>Central Test Repository & Stream</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-rose-400 border border-slate-700">
              {filteredPatients.length} records matching
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Real-time multi-facility test ledger with Layer 1 Vision AI and Layer 2 BioSense dual-analyte verification.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              id="btn-bulk-verify"
              onClick={handleBulkVerify}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-all"
            >
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>Bulk Verify Selected ({selectedIds.length})</span>
            </button>
          )}

          <button
            id="btn-export-csv"
            onClick={() => onExportCsv(filteredPatients)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export DHIS2 CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 pt-2 border-t border-slate-800 text-xs">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient, ID, village, or CHW..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-xs font-medium"
          />
        </div>

        {/* Severity */}
        <div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium focus:outline-none focus:border-rose-500"
          >
            <option value="All">All Severities</option>
            <option value="Severe">Severe Anemia</option>
            <option value="Moderate">Moderate Anemia</option>
            <option value="Mild">Mild Pallor</option>
            <option value="Normal">Normal (No Anemia)</option>
          </select>
        </div>

        {/* QA Status */}
        <div>
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium focus:outline-none focus:border-rose-500"
          >
            <option value="All">All QA Statuses</option>
            <option value="pending_review">Pending QA Audit</option>
            <option value="verified">Verified & Approved</option>
            <option value="flagged">Flagged Escalations</option>
            <option value="overridden">MD Overrides</option>
          </select>
        </div>

        {/* Test Layer */}
        <div>
          <select
            value={layerFilter}
            onChange={(e) => setLayerFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium focus:outline-none focus:border-rose-500"
          >
            <option value="All">All Test Types</option>
            <option value="Layer 1 Only">Layer 1 Vision Only</option>
            <option value="Layer 1 + 2 (BioSense)">Layer 1 + BioSense Rapid</option>
          </select>
        </div>
      </div>

      {/* Main Interactive Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="p-3 w-10 text-center">
                <button onClick={toggleSelectAll} className="text-slate-400 hover:text-white">
                  {selectedIds.length > 0 && selectedIds.length === filteredPatients.length ? (
                    <CheckSquare className="w-4 h-4 text-[#8B1E3F]" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="p-3">
                <button
                  onClick={() => {
                    setSortField('name');
                    setSortAsc(!sortAsc);
                  }}
                  className="flex items-center gap-1 hover:text-white"
                >
                  <span>Patient Demographics</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </button>
              </th>
              <th className="p-3">
                <button
                  onClick={() => {
                    setSortField('date');
                    setSortAsc(!sortAsc);
                  }}
                  className="flex items-center gap-1 hover:text-white"
                >
                  <span>Facility / CHW / Date</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </button>
              </th>
              <th className="p-3">
                <button
                  onClick={() => {
                    setSortField('hb');
                    setSortAsc(!sortAsc);
                  }}
                  className="flex items-center gap-1 hover:text-white"
                >
                  <span>Layer 1: Vision AI</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </button>
              </th>
              <th className="p-3">Layer 2: BioSense (Dual)</th>
              <th className="p-3">Clinical Action</th>
              <th className="p-3">QA Sign-Off</th>
              <th className="p-3 text-right">Supervisor Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/70 bg-slate-900/50">
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">
                  No screening records found matching the active filter criteria.
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient) => {
                const screening = patient.latestScreening;
                const isSelected = selectedIds.includes(patient.id);

                return (
                  <tr
                    key={patient.id}
                    className={`hover:bg-slate-800/50 transition-colors ${
                      isSelected ? 'bg-rose-950/20' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => toggleSelectOne(patient.id)}
                        className="text-slate-400 hover:text-white"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-rose-500" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Patient Demographics */}
                    <td className="p-3">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{patient.name}</span>
                        {patient.isPregnant && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-purple-950 text-purple-300 border border-purple-800 font-semibold">
                            ANC {patient.trimester || 'Pregnant'}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {patient.age}y • {patient.gender} • {patient.village}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">{patient.id}</div>
                    </td>

                    {/* Facility & Date */}
                    <td className="p-3">
                      <div className="font-medium text-slate-200">
                        {screening?.facilityName || 'Pantang HC'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {screening?.chwName.split('(')[0] || 'CHW Field Lead'}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {screening?.date || 'Today'}
                      </div>
                    </td>

                    {/* Layer 1 Vision */}
                    <td className="p-3">
                      {screening ? (
                        <div className="space-y-1">
                          {getSeverityBadge(screening.layer1.severity)}
                          <div className="text-[11px] font-mono text-slate-300">
                            Hb: <strong className="text-white">{screening.layer1.estimatedHb} g/dL</strong> ({screening.layer1.confidence}%)
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    {/* Layer 2 BioSense */}
                    <td className="p-3">
                      {screening?.layer2 ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                screening.layer2.ferritin === 'Low'
                                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              Ferritin: {screening.layer2.ferritin}
                            </span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                screening.layer2.crp === 'Elevated'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              CRP: {screening.layer2.crp}
                            </span>
                          </div>
                          <div className="text-[10px] text-indigo-300 truncate max-w-[160px]" title={screening.layer2.interpretation}>
                            {screening.layer2.interpretation}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">
                          Stratified Out (Non-Invasive Only)
                        </span>
                      )}
                    </td>

                    {/* Clinical Action */}
                    <td className="p-3">
                      {screening?.recommendation ? (
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-200 text-[11px] truncate max-w-[150px]" title={screening.recommendation.primaryAction}>
                            {screening.recommendation.primaryAction}
                          </div>
                          {screening.recommendation.referralIndicated && (
                            <span className="inline-block text-[10px] font-bold text-rose-400">
                              ⚠️ Referral Hospital Action
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    {/* QA Sign-Off Badge */}
                    <td className="p-3">
                      {getVerificationBadge(screening?.supervisorReview)}
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectPatientForReview(patient)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-rose-400" />
                          <span>Audit</span>
                        </button>

                        {screening?.supervisorReview?.status !== 'verified' && (
                          <button
                            onClick={() => onQuickVerifyTest(patient.id)}
                            title="Instant Supervisor Sign-Off & Approve"
                            className="p-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
