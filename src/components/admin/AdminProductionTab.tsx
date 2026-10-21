import React, { useState } from 'react';
import { useFactory } from '../../context/FactoryContext';
import { ProductionBatch, ProductionStage } from '../../types';
import { StatusBadge } from '../StatusBadge';
import {
  Layers,
  Flame,
  Clock,
  CheckCircle2,
  Boxes,
  Search,
  Plus,
  ArrowRight,
  Sparkles,
  ClipboardList
} from 'lucide-react';

const PRODUCTION_STAGES: ProductionStage[] = [
  'Cocoa Preparation',
  'Roasting',
  'Grinding',
  'Mixing',
  'Conching',
  'Tempering',
  'Moulding',
  'Cooling',
  'Packaging'
];

interface AdminProductionTabProps {
  onOpenCreateBatch: () => void;
}

export const AdminProductionTab: React.FC<AdminProductionTabProps> = ({ onOpenCreateBatch }) => {
  const { batches, updateBatchStage, completeBatch } = useFactory();

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Metrics
  const inProductionBatches = batches.filter((b) => b.status === 'In Production');
  const plannedBatches = batches.filter((b) => b.status === 'Planned');
  const qcBatches = batches.filter((b) => b.status === 'Sent to QC');
  const totalPlannedUnits = batches.reduce((sum, b) => sum + b.plannedQuantity, 0);

  const filteredBatches = batches.filter((b) => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesSearch =
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.currentStage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAdvance = async (batch: ProductionBatch) => {
    const currentIndex = PRODUCTION_STAGES.indexOf(batch.currentStage);
    if (currentIndex < PRODUCTION_STAGES.length - 1) {
      const nextStage = PRODUCTION_STAGES[currentIndex + 1];
      await updateBatchStage(batch.id, nextStage);
    } else {
      await completeBatch(batch.id, batch.plannedQuantity, 'Production packaging finished, transferred to lab');
    }
  };

  const handleStartPlanned = async (batch: ProductionBatch) => {
    await updateBatchStage(batch.id, 'Cocoa Preparation', 'Batch initiated on production floor');
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-wider">Active In Production</span>
            <div className="w-8 h-8 rounded-full bg-[#F9E4E8] flex items-center justify-center text-[#D9A05B]">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-3xl font-bold text-[#3D2B1F]">{inProductionBatches.length}</span>
            <span className="text-xs text-[#3D2B1F]/60 block mt-1">Live roast, conche & temper lines</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-wider">Planned Production</span>
            <div className="w-8 h-8 rounded-full bg-[#F9E4E8] flex items-center justify-center text-[#D9A05B]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-3xl font-bold text-[#3D2B1F]">{plannedBatches.length}</span>
            <span className="text-xs text-[#3D2B1F]/60 block mt-1">Queued for cocoa staging</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-wider">Sent to QC Inspection</span>
            <div className="w-8 h-8 rounded-full bg-[#F9E4E8] flex items-center justify-center text-[#D9A05B]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-3xl font-bold text-[#3D2B1F]">{qcBatches.length}</span>
            <span className="text-xs text-[#3D2B1F]/60 block mt-1">Awaiting organoleptic release</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-wider">Pipeline Output Target</span>
            <div className="w-8 h-8 rounded-full bg-[#F9E4E8] flex items-center justify-center text-[#D9A05B]">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-3xl font-bold text-[#3D2B1F]">{totalPlannedUnits.toLocaleString()}</span>
            <span className="text-xs text-[#3D2B1F]/60 block mt-1">Total artisanal units</span>
          </div>
        </div>
      </div>

      {/* 9-Stage Pipeline Overview */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-base text-[#3D2B1F]">Factory Processing Stages</h3>
            <p className="text-xs text-[#3D2B1F]/60 mt-0.5">Real-time distribution of batches across bean-to-bar craftsmanship</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9A05B] bg-[#F9E4E8] px-3 py-1 rounded-full">
            9 Monitored Stages
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 pt-2">
          {PRODUCTION_STAGES.map((stage, idx) => {
            const count = batches.filter((b) => b.status === 'In Production' && b.currentStage === stage).length;
            return (
              <div
                key={stage}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  count > 0
                    ? 'bg-[#F9E4E8] border-[#D9A05B]/40 shadow-xs'
                    : 'bg-white/60 border-[#D9A05B]/10 opacity-70'
                }`}
              >
                <span className="block text-[10px] font-bold text-[#D9A05B] uppercase tracking-tighter">
                  0{idx + 1}
                </span>
                <span className="font-bold text-xs text-[#3D2B1F] block mt-0.5 truncate" title={stage}>
                  {stage}
                </span>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  count > 0 ? 'bg-[#3D2B1F] text-[#D9A05B]' : 'bg-[#3D2B1F]/5 text-[#3D2B1F]/40'
                }`}>
                  {count} {count === 1 ? 'batch' : 'batches'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Batches Management */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#3D2B1F]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search batches by ID, product, or manager..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-xs text-[#3D2B1F] placeholder:text-[#3D2B1F]/40 focus:outline-none focus:border-[#D9A05B]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'In Production', 'Planned', 'Sent to QC', 'Approved', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  statusFilter === status
                    ? 'bg-[#3D2B1F] text-[#D9A05B] border border-[#D9A05B]/30 shadow-xs'
                    : 'bg-white text-[#3D2B1F]/70 border border-[#D9A05B]/15 hover:bg-[#F9E4E8]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Batches Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#3D2B1F]/10 text-[#3D2B1F]/60 uppercase font-mono text-[10px]">
                <th className="pb-3">Batch ID</th>
                <th className="pb-3">Product Name</th>
                <th className="pb-3">Planned Qty</th>
                <th className="pb-3">Current Stage</th>
                <th className="pb-3">Progress</th>
                <th className="pb-3">Start Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Floor Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D2B1F]/5">
              {filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#3D2B1F]/50 italic">
                    No production batches matching current filter.
                  </td>
                </tr>
              ) : (
                filteredBatches.map((batch) => {
                  const stageIndex = PRODUCTION_STAGES.indexOf(batch.currentStage);
                  const progressPercent = Math.round(((stageIndex + 1) / PRODUCTION_STAGES.length) * 100);
                  const isLastStage = stageIndex === PRODUCTION_STAGES.length - 1;

                  return (
                    <tr key={batch.id} className="hover:bg-[#F9E4E8]/20 transition-colors">
                      <td className="py-3.5 font-mono font-bold text-[#D9A05B]">{batch.id}</td>
                      <td className="py-3.5">
                        <span className="font-bold text-[#3D2B1F] block">{batch.productName}</span>
                        <span className="text-[10px] text-[#3D2B1F]/60">Mgr: {batch.manager}</span>
                      </td>
                      <td className="py-3.5 font-mono font-bold text-[#3D2B1F]">
                        {batch.plannedQuantity} units
                      </td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#F9E4E8] text-[#3D2B1F] border border-[#D9A05B]/20">
                          {batch.currentStage}
                        </span>
                      </td>
                      <td className="py-3.5 w-36">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-[#3D2B1F]/70">
                            <span>Stage {stageIndex + 1}/9</span>
                            <span>{progressPercent}%</span>
                          </div>
                          <div className="w-full bg-[#3D2B1F]/10 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#D9A05B] h-full rounded-full transition-all duration-300"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 font-mono text-[#3D2B1F]/60">
                        {batch.startDate}
                      </td>
                      <td className="py-3.5">
                        <StatusBadge status={batch.status} size="sm" />
                      </td>
                      <td className="py-3.5 text-right">
                        {batch.status === 'In Production' && (
                          <button
                            onClick={() => handleAdvance(batch)}
                            className="px-3 py-1.5 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] border border-[#D9A05B]/30 font-bold text-[11px] inline-flex items-center gap-1 shadow-2xs transition-colors"
                          >
                            <span>{isLastStage ? 'Send to QC' : 'Advance'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        {batch.status === 'Planned' && (
                          <button
                            onClick={() => handleStartPlanned(batch)}
                            className="px-3 py-1.5 rounded-xl bg-[#D9A05B] hover:bg-[#c28b49] text-[#3D2B1F] font-bold text-[11px] inline-flex items-center gap-1 shadow-2xs transition-colors"
                          >
                            <span>Start Line</span>
                          </button>
                        )}
                        {batch.status === 'Sent to QC' && (
                          <span className="text-[11px] font-bold text-[#D9A05B] italic">
                            In Lab Testing
                          </span>
                        )}
                        {batch.status === 'Approved' && (
                          <span className="text-[11px] font-bold text-emerald-800">
                            ✓ Released to Vault
                          </span>
                        )}
                        {batch.status === 'Rejected' && (
                          <span className="text-[11px] font-bold text-rose-800">
                            Quarantined
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
