import React, { useState } from 'react';
import {
  Boxes,
  PackageCheck,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Building2,
  Truck,
  Plus,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { TestKitInventory } from '../../types';
import { INITIAL_INVENTORY } from '../../data/mockData';

export const BioSenseInventoryDesk: React.FC = () => {
  const [inventoryList, setInventoryList] = useState<TestKitInventory[]>(INITIAL_INVENTORY);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const totalCassettesRemaining = inventoryList.reduce((acc, curr) => acc + curr.remaining, 0);

  const handleRequestStock = (lotNumber: string) => {
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
    }, 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">
            Supply Chain & Cold Chain Governance
          </span>
          <h3 className="text-base font-extrabold text-white mt-0.5">
            BioSense Dual-Analyte Cassette Lot Inventory
          </h3>
          <p className="text-xs text-slate-400">
            Track test strip lot batch calibration, expiration dates, and facility stock buffers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-slate-950 text-rose-400 border border-slate-800 text-xs font-mono font-bold">
            Total District Buffer: <strong className="text-white">{totalCassettesRemaining}</strong> tests
          </span>
        </div>
      </div>

      {requestSubmitted && (
        <div className="p-3 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Replenishment order dispatched to Regional Central Medical Store (Accra Cold Chain)!</span>
        </div>
      )}

      {/* Lot Inventory Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inventoryList.map((item) => {
          const percentLeft = Math.round((item.remaining / item.totalReceived) * 100);
          const isLow = item.status === 'low_stock' || percentLeft < 20;

          return (
            <div
              key={item.lotNumber}
              className={`p-4 rounded-2xl bg-slate-950 border transition-all space-y-3 ${
                isLow ? 'border-amber-700/60 bg-amber-950/10' : 'border-slate-800'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">
                      Lot #{item.lotNumber}
                    </span>
                    <span
                      className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                        isLow
                          ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {isLow ? 'Low Stock Buffer' : 'Optimal'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>{item.facility}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleRequestStock(item.lotNumber)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold flex items-center gap-1 transition-all"
                >
                  <Truck className="w-3 h-3 text-rose-400" />
                  <span>Reorder</span>
                </button>
              </div>

              {/* Progress Bar of Stock */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Stock Remaining: <strong>{item.remaining}</strong> / {item.totalReceived}</span>
                  <span>{percentLeft}% remaining</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${percentLeft}%` }}
                  />
                </div>
              </div>

              {/* Specs & Expiration */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 border-t border-slate-900 pt-2 font-mono">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>Expires: <strong className="text-slate-200">{item.expiryDate}</strong></span>
                </div>
                <div>
                  <span>Calibrated: <strong className="text-slate-200">{item.calibratedAt}</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lot Calibration Curve Info */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
        <div className="font-bold text-white flex items-center gap-1.5">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          <span>Optical Density Calibration Standard (GHS Protocol)</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          All BioSense cassette lots are calibrated against WHO standard 94/572 (Ferritin threshold: 15 ng/mL non-pregnant, 30 ng/mL pregnant) and CRP cutoff at 5.0 mg/L. Verification hashes are cross-checked on every test strip scan.
        </p>
      </div>
    </div>
  );
};
