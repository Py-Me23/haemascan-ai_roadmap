import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  CheckCircle2,
  FileText,
  Building2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Patient } from '../../types';

interface DHIS2ReportGeneratorProps {
  patients: Patient[];
}

export const DHIS2ReportGenerator: React.FC<DHIS2ReportGeneratorProps> = ({ patients }) => {
  const [reportPeriod, setReportPeriod] = useState<'May 2026' | 'Q2 2026' | 'Year-to-Date'>('May 2026');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const totalScreened = patients.length;
  const pregnantPatients = patients.filter((p) => p.isPregnant);
  const severeCases = patients.filter((p) => p.latestScreening?.layer1.severity === 'Severe');
  const moderateCases = patients.filter((p) => p.latestScreening?.layer1.severity === 'Moderate');
  const mildCases = patients.filter((p) => p.latestScreening?.layer1.severity === 'Mild');
  const normalCases = patients.filter((p) => p.latestScreening?.layer1.severity === 'Normal');

  const handleDownloadDhis2Json = () => {
    const dhis2Payload = {
      orgUnit: 'GH-GA-EAST-001',
      period: '202605',
      program: 'ANEMIA_SURVEILLANCE_GHS',
      dataValues: [
        { dataElement: 'TOTAL_SCREENED_L1', value: totalScreened },
        { dataElement: 'PREGNANT_ANC_SCREENED', value: pregnantPatients.length },
        { dataElement: 'SEVERE_ANEMIA_COUNT', value: severeCases.length },
        { dataElement: 'MODERATE_ANEMIA_COUNT', value: moderateCases.length },
        { dataElement: 'MILD_ANEMIA_COUNT', value: mildCases.length },
        { dataElement: 'NORMAL_COUNT', value: normalCases.length },
        { dataElement: 'BIOSENSE_CONFIRMED_IDA', value: Math.round(totalScreened * 0.63) },
        { dataElement: 'HOSPITAL_REFERRALS', value: severeCases.length },
      ],
      generatedBy: 'Dr. Kwesi Appiah (Lead Supervisor)',
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dhis2Payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DHIS2_GHS_Anemia_Report_${reportPeriod.replace(' ', '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess('DHIS2 JSON Payload Generated & Downloaded');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleDownloadSummaryCsv = () => {
    const rows = [
      ['Indicator', 'Category', 'Count', 'Percentage of Total'],
      ['Total Screenings', 'Overall', totalScreened, '100%'],
      ['Normal (No Anemia)', 'Layer 1 Vision', normalCases.length, `${((normalCases.length / totalScreened) * 100).toFixed(1)}%`],
      ['Mild Pallor', 'Layer 1 Vision', mildCases.length, `${((mildCases.length / totalScreened) * 100).toFixed(1)}%`],
      ['Moderate Anemia', 'Layer 1 Vision', moderateCases.length, `${((moderateCases.length / totalScreened) * 100).toFixed(1)}%`],
      ['Severe Anemia (Emergency)', 'Layer 1 Vision', severeCases.length, `${((severeCases.length / totalScreened) * 100).toFixed(1)}%`],
      ['Pregnant ANC Mothers Screened', 'Demographic', pregnantPatients.length, `${((pregnantPatients.length / totalScreened) * 100).toFixed(1)}%`],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GHS_Monthly_Anemia_Report_${reportPeriod.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess('GHS Official Summary CSV Exported');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">
            National Health Data Interoperability
          </span>
          <h3 className="text-base font-extrabold text-white mt-0.5">
            Ghana Health Service (GHS) & DHIS2 Reporting Suite
          </h3>
          <p className="text-xs text-slate-400">
            Generate standardized monthly returns and epidemiological reports for the Ministry of Health.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-xs focus:outline-none focus:border-rose-500"
          >
            <option value="May 2026">Reporting Month: May 2026</option>
            <option value="Q2 2026">Quarter 2 (Q2 2026)</option>
            <option value="Year-to-Date">Year-to-Date 2026</option>
          </select>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Official GHS Report Preview Card */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="font-extrabold text-white text-sm">
              Form GHS-ANM-2026: Community Anemia Screening Return
            </div>
            <div className="text-[11px] text-slate-400">
              Ga East Municipal Health Directorate • Sub-District Code: GHS-GAR-GAE-04
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400">Period: <strong>{reportPeriod}</strong></span>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Total Screened (L1)</span>
            <span className="text-xl font-extrabold text-white mt-1 block">{totalScreened}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">ANC Pregnant Mothers</span>
            <span className="text-xl font-extrabold text-purple-400 mt-1 block">
              {pregnantPatients.length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Moderate / Severe Anemia</span>
            <span className="text-xl font-extrabold text-rose-400 mt-1 block">
              {moderateCases.length + severeCases.length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Urgent Referrals</span>
            <span className="text-xl font-extrabold text-amber-400 mt-1 block">
              {severeCases.length}
            </span>
          </div>
        </div>

        {/* Action Export Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
          <button
            id="btn-download-dhis2-json"
            onClick={handleDownloadDhis2Json}
            className="px-4 py-2 rounded-xl bg-[#8B1E3F] hover:bg-[#A3234B] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-rose-950"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download DHIS2 JSON Payload</span>
          </button>

          <button
            id="btn-download-summary-csv"
            onClick={handleDownloadSummaryCsv}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export GHS CSV Table</span>
          </button>
        </div>
      </div>
    </div>
  );
};
