import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import { ProductionStage } from '../types';
import {
  Layers,
  Flame,
  Clock,
  ThermometerSnowflake,
  Package,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Boxes,
  ClipboardList,
  Sparkles,
  Award
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { CocoaPodIcon, ChocolateBarIcon } from '../components/ChocolateGraphics';

export const ProductionDashboard: React.FC = () => {
  const {
    batches,
    products,
    rawMaterials,
    createBatch,
    updateBatchStage,
    completeBatch,
    currentView,
    setCurrentView
  } = useFactory();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProdId, setSelectedProdId] = useState(products[0]?.id || 'PROD-101');
  const [plannedQty, setPlannedQty] = useState(300);
  const [batchNotes, setBatchNotes] = useState('');

  // Complete modal state
  const [completingBatchId, setCompletingBatchId] = useState<string | null>(null);
  const [producedQtyInput, setProducedQtyInput] = useState<number>(300);

  const selectedProduct = products.find((p) => p.id === selectedProdId) || products[0];

  const stages: ProductionStage[] = [
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

  // Stats
  const activeBatches = batches.filter((b) => b.status === 'In Production');
  const plannedBatches = batches.filter((b) => b.status === 'Planned');
  const completedBatches = batches.filter((b) => b.status === 'Completed' || b.status === 'Sent to QC' || b.status === 'Approved');

  const handleStartBatch = async () => {
    if (!selectedProduct) return;
    const ok = await createBatch({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      plannedQuantity: plannedQty,
      notes: batchNotes
    });
    if (ok) {
      setShowCreateModal(false);
      setBatchNotes('');
    }
  };

  const handleCompleteBatchAction = async () => {
    if (!completingBatchId) return;
    const ok = await completeBatch(completingBatchId, producedQtyInput);
    if (ok) {
      setCompletingBatchId(null);
      alert('Batch completed and forwarded to Quality Control for physical and sensory inspection!');
    }
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EBDCD5] gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
            Production & Processing Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E160E]">
            Factory Floor & Batch Execution
          </h1>
        </div>

        <button
          id="btn-create-new-batch"
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#2E160E] hover:bg-[#4A2818] text-amber-300 font-bold text-xs flex items-center gap-2 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Plan & Initiate Production Batch</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="choco-card p-4 bg-white border border-[#EBDCD5] rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase block">In Production</span>
          <span className="font-serif text-2xl font-bold text-amber-800 block mt-1">
            {activeBatches.length} Batches
          </span>
          <span className="text-[10px] text-stone-500 font-semibold mt-1 block">Active on floor</span>
        </div>

        <div className="choco-card p-4 bg-white border border-[#EBDCD5] rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase block">Scheduled / Planned</span>
          <span className="font-serif text-2xl font-bold text-[#2E160E] block mt-1">
            {plannedBatches.length} Batches
          </span>
          <span className="text-[10px] text-stone-500 font-semibold mt-1 block">Ingredients reserved</span>
        </div>

        <div className="choco-card p-4 bg-white border border-[#EBDCD5] rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase block">Awaiting QC Release</span>
          <span className="font-serif text-2xl font-bold text-orange-700 block mt-1">
            {batches.filter((b) => b.status === 'Sent to QC').length} Batches
          </span>
          <span className="text-[10px] text-orange-600 font-semibold mt-1 block">Sent to QC Manager</span>
        </div>

        <div className="choco-card p-4 bg-white border border-[#EBDCD5] rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase block">Total Output</span>
          <span className="font-serif text-2xl font-bold text-emerald-800 block mt-1 font-mono">
            {batches.reduce((sum, b) => sum + (b.producedQuantity || 0), 0)} units
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">YTD Yield Volume</span>
        </div>
      </div>

      {/* Production Batches Table */}
      <div className="choco-card p-5 bg-white border border-[#EBDCD5] rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#EBDCD5]">
          <h2 className="font-serif font-bold text-base text-[#2E160E] flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-700" />
            <span>Active & Historic Production Batches</span>
          </h2>
          <span className="text-xs text-stone-500 font-mono">
            {batches.length} total batches
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase font-mono text-[10px]">
                <th className="py-2.5">Batch ID</th>
                <th className="py-2.5">Product</th>
                <th className="py-2.5">Planned / Yield</th>
                <th className="py-2.5">Current Stage</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5">Supervisor</th>
                <th className="py-2.5 text-right">Floor Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {batches.map((batch) => {
                const currentStageIdx = stages.indexOf(batch.currentStage);
                const isCompleted = batch.status === 'Sent to QC' || batch.status === 'Approved' || batch.status === 'Rejected';

                return (
                  <tr key={batch.id} className="hover:bg-stone-50">
                    <td className="py-3 font-mono font-bold text-[#2E160E]">{batch.id}</td>
                    <td className="py-3 font-bold text-[#2E160E]">{batch.productName}</td>
                    <td className="py-3 font-mono">
                      <span className="font-bold text-[#2E160E]">{batch.producedQuantity || '-'}</span>
                      <span className="text-stone-400"> / {batch.plannedQuantity}</span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-600" />
                        <span className="font-semibold text-stone-800">{batch.currentStage}</span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          ({currentStageIdx + 1}/9)
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <StatusBadge status={batch.status} size="sm" />
                    </td>
                    <td className="py-3 text-stone-600">{batch.manager}</td>
                    <td className="py-3 text-right">
                      {!isCompleted ? (
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Progress to next stage */}
                          {currentStageIdx < stages.length - 1 ? (
                            <button
                              onClick={() =>
                                updateBatchStage(batch.id, stages[currentStageIdx + 1])
                              }
                              className="px-2.5 py-1 rounded-lg bg-[#FAF5F0] hover:bg-[#F5EBE6] text-[#2E160E] font-bold text-[11px] border border-[#EBDCD5] transition-colors"
                            >
                              Next: {stages[currentStageIdx + 1].split(' ')[0]} →
                            </button>
                          ) : null}

                          {/* Complete Batch & Send to QC */}
                          <button
                            onClick={() => {
                              setCompletingBatchId(batch.id);
                              setProducedQtyInput(batch.plannedQuantity);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-[11px] transition-colors shadow-2xs"
                          >
                            Complete & Send to QC
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-stone-400 italic">
                          {batch.status === 'Sent to QC' ? 'In QC Inspection Queue' : 'Batch Finalized'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 9-STAGE PIPELINE VISUAL FOR ACTIVE BATCH */}
      {activeBatches.length > 0 && (
        <div className="choco-card p-6 bg-white border border-[#EBDCD5] rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EBDCD5]">
            <div>
              <h3 className="font-serif font-bold text-base text-[#2E160E]">
                Active Batch Pipeline Progress: {activeBatches[0].id}
              </h3>
              <p className="text-xs text-stone-500">
                {activeBatches[0].productName} • Currently at {activeBatches[0].currentStage}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              Planned Output: {activeBatches[0].plannedQuantity} units
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
            {stages.map((stage, idx) => {
              const activeIdx = stages.indexOf(activeBatches[0].currentStage);
              const isPast = idx < activeIdx;
              const isCurrent = idx === activeIdx;

              return (
                <div
                  key={stage}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-[#2E160E] text-amber-300 border-[#2E160E] shadow-md ring-2 ring-amber-400'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-stone-50 text-stone-400 border-stone-200'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-[10px] font-bold mb-1 ${
                      isCurrent
                        ? 'bg-amber-500 text-white'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {isPast ? '✓' : idx + 1}
                  </div>
                  <span className="text-[10px] font-bold block truncate">{stage}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATE BATCH MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBDCD5]">
              <h3 className="font-serif font-bold text-lg text-[#2E160E]">
                Initiate New Production Batch
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-stone-700">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2E160E] mb-1">Select Confectionery</label>
                <select
                  value={selectedProdId}
                  onChange={(e) => setSelectedProdId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] text-xs font-semibold text-[#2E160E]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category} - Current Stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#2E160E] mb-1">Target Batch Quantity (Units)</label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={plannedQty}
                  onChange={(e) => setPlannedQty(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] text-xs font-semibold text-[#2E160E]"
                />
              </div>

              {/* Automatic Recipe & Material Check Preview */}
              <div className="p-4 rounded-xl bg-[#FFF9F6] border border-[#F5DADB] space-y-2">
                <span className="font-bold text-amber-900 block">
                  Automatic Ingredient Allocation (Recipe Check):
                </span>
                <div className="space-y-1 text-stone-600 text-[11px]">
                  <div className="flex justify-between">
                    <span>Raw Cocoa Beans (40%):</span>
                    <span className="font-mono font-bold">{Math.round(plannedQty * 0.4)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deodorized Cocoa Butter (15%):</span>
                    <span className="font-mono font-bold">{Math.round(plannedQty * 0.15)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fine Cane Sugar (30%):</span>
                    <span className="font-mono font-bold">{Math.round(plannedQty * 0.3)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alpine Whole Milk Powder (15%):</span>
                    <span className="font-mono font-bold">{Math.round(plannedQty * 0.15)} kg</span>
                  </div>
                </div>
                <p className="text-[10px] text-stone-500 italic mt-1">
                  * Starting this batch will record an authentic material issue transaction in the factory inventory ledger.
                </p>
              </div>

              <div>
                <label className="block font-bold text-[#2E160E] mb-1">Batch Floor Notes</label>
                <textarea
                  rows={2}
                  value={batchNotes}
                  onChange={(e) => setBatchNotes(e.target.value)}
                  placeholder="e.g. Calibrated for Swiss conche machine #3..."
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] text-xs"
                />
              </div>
            </div>

            <button
              onClick={handleStartBatch}
              className="w-full py-3 rounded-xl bg-[#2E160E] hover:bg-[#4A2818] text-amber-300 font-bold text-xs shadow-md transition-colors"
            >
              Confirm Recipe & Start Cocoa Preparation
            </button>
          </div>
        </div>
      )}

      {/* COMPLETE BATCH MODAL */}
      {completingBatchId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBDCD5]">
              <h3 className="font-serif font-bold text-lg text-[#2E160E]">
                Complete Production Batch {completingBatchId}
              </h3>
              <button onClick={() => setCompletingBatchId(null)} className="text-stone-400">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-stone-600">
                Record the final produced output quantity. Once completed, this batch will be dispatched to Quality Control for laboratory & sensory evaluation.
              </p>

              <div>
                <label className="block font-bold text-[#2E160E] mb-1">Actual Finished Output (Units)</label>
                <input
                  type="number"
                  value={producedQtyInput}
                  onChange={(e) => setProducedQtyInput(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] text-xs font-bold font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                <strong className="block mb-0.5">Strict Role Isolation:</strong>
                As Production Manager, you cannot approve or reject this batch. Only the certified QC Manager can perform inspections.
              </div>
            </div>

            <button
              onClick={handleCompleteBatchAction}
              className="w-full py-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs shadow-md"
            >
              Submit & Forward to QC Manager
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
