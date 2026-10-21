import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import { Batch } from '../types';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ClipboardCheck,
  ShieldAlert,
  Sparkles,
  FlaskConical,
  Award,
  Thermometer,
  Eye,
  Check,
  X,
  FileText
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export const QCDashboard: React.FC = () => {
  const { batches, qualityChecks, approveBatchQC, rejectBatchQC } = useFactory();

  const [inspectingBatch, setInspectingBatch] = useState<Batch | null>(null);

  // Inspection Checklist State
  const [tests, setTests] = useState({
    temperIndex: true,
    moistureContent: true,
    particleFineness: true,
    snapAndGloss: true,
    meltingProfile: true,
    sensoryFlavor: true,
    microbiological: true
  });

  const [rejectionReason, setRejectionReason] = useState('Moisture Content High');
  const [qcNotes, setQcNotes] = useState('Complies with international chocolate confectionery codex standards.');

  // Queues
  const pendingQC = batches.filter((b) => b.status === 'Sent to QC');
  const approvedCount = batches.filter((b) => b.status === 'Approved').length;
  const rejectedCount = batches.filter((b) => b.status === 'Rejected').length;
  const totalEvaluated = approvedCount + rejectedCount;
  const passRate = totalEvaluated > 0 ? Math.round((approvedCount / totalEvaluated) * 100) : 100;

  const handleOpenInspection = (batch: Batch) => {
    setInspectingBatch(batch);
    setTests({
      temperIndex: true,
      moistureContent: true,
      particleFineness: true,
      snapAndGloss: true,
      meltingProfile: true,
      sensoryFlavor: true,
      microbiological: true
    });
    setQcNotes(`Batch ${batch.id} sample passed laboratory analytical and organoleptic testing.`);
  };

  const handleApprove = async () => {
    if (!inspectingBatch) return;
    const ok = await approveBatchQC(inspectingBatch.id, qcNotes);
    if (ok) {
      alert(`Batch ${inspectingBatch.id} APPROVED! ${inspectingBatch.producedQuantity || inspectingBatch.plannedQuantity} units added to finished sellable stock.`);
      setInspectingBatch(null);
    }
  };

  const handleReject = async () => {
    if (!inspectingBatch) return;
    const ok = await rejectBatchQC(inspectingBatch.id, rejectionReason, qcNotes);
    if (ok) {
      alert(`Batch ${inspectingBatch.id} REJECTED due to "${rejectionReason}". Units will NOT enter finished stock.`);
      setInspectingBatch(null);
    }
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EBDCD5] gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
            Quality Assurance & Laboratory Release
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E160E]">
            Quality Control Center
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Pass Rate: {passRate}%</span>
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="choco-card p-4 bg-white border border-[#EBDCD5] rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase block">Pending Inspection</span>
          <span className="font-serif text-2xl font-bold text-orange-700 block mt-1">
            {pendingQC.length} Batches
          </span>
          <span className="text-[10px] text-stone-500 font-semibold mt-1 block">Awaiting release</span>
        </div>

        <div className="choco-card p-4 bg-white border border-[#EBDCD5] rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase block">Approved (Vault Ready)</span>
          <span className="font-serif text-2xl font-bold text-emerald-700 block mt-1">
            {approvedCount} Batches
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Added to sellable stock</span>
        </div>

        <div className="choco-card p-4 bg-white border border-[#EBDCD5] rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase block">Rejected (Quarantine)</span>
          <span className="font-serif text-2xl font-bold text-red-600 block mt-1">
            {rejectedCount} Batches
          </span>
          <span className="text-[10px] text-red-500 font-semibold mt-1 block">Excluded from stock</span>
        </div>

        <div className="choco-card p-4 bg-white border border-[#EBDCD5] rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase block">Total Laboratory Audits</span>
          <span className="font-serif text-2xl font-bold text-[#2E160E] block mt-1">
            {qualityChecks.length} Records
          </span>
          <span className="text-[10px] text-stone-400 font-semibold mt-1 block">Traceability log</span>
        </div>
      </div>

      {/* Batches Awaiting QC Inspection */}
      <div className="choco-card p-6 bg-white border border-[#EBDCD5] rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#EBDCD5]">
          <h2 className="font-serif font-bold text-base text-[#2E160E] flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-amber-700" />
            <span>Batches Awaiting Physical & Sensory Inspection</span>
          </h2>
          <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full">
            {pendingQC.length} Pending
          </span>
        </div>

        {pendingQC.length === 0 ? (
          <div className="text-center py-8 text-stone-500 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-stone-700">All completed batches have been inspected.</p>
            <p className="mt-1">When the Production Manager completes a batch, it will appear here immediately.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingQC.map((batch) => (
              <div
                key={batch.id}
                className="p-4 rounded-xl border border-amber-300 bg-[#FFFDF9] space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-[#2E160E]">{batch.id}</span>
                  <StatusBadge status={batch.status} size="sm" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#2E160E]">
                    {batch.productName}
                  </h3>
                  <span className="text-xs text-stone-500 font-mono">
                    Yield Quantity: {batch.producedQuantity || batch.plannedQuantity} units ready for release
                  </span>
                </div>
                <div className="text-xs text-stone-600 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200">
                  <span className="font-bold text-amber-900 block">Production Supervisor:</span>
                  <span>{batch.manager} • Completed Packaging</span>
                </div>
                <button
                  onClick={() => handleOpenInspection(batch)}
                  className="w-full py-2.5 rounded-xl bg-[#2E160E] hover:bg-[#4A2818] text-amber-300 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Perform Laboratory Inspection</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QC Inspection Records Table */}
      <div className="choco-card p-6 bg-white border border-[#EBDCD5] rounded-2xl shadow-xs space-y-4">
        <h2 className="font-serif font-bold text-base text-[#2E160E] flex items-center gap-2 pb-2 border-b border-[#EBDCD5]">
          <ClipboardCheck className="w-4 h-4 text-emerald-700" />
          <span>Certificate of Analysis & QC Inspection Ledger</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase font-mono text-[10px]">
                <th className="py-2.5">Record ID</th>
                <th className="py-2.5">Batch ID</th>
                <th className="py-2.5">Product Name</th>
                <th className="py-2.5">Date</th>
                <th className="py-2.5">Inspector</th>
                <th className="py-2.5">Outcome</th>
                <th className="py-2.5">Findings / Rejection Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {qualityChecks.map((qc) => (
                <tr key={qc.id} className="hover:bg-stone-50">
                  <td className="py-3 font-mono text-stone-500">{qc.id}</td>
                  <td className="py-3 font-mono font-bold text-[#2E160E]">{qc.batchId}</td>
                  <td className="py-3 font-semibold text-[#2E160E]">{qc.productName}</td>
                  <td className="py-3 font-mono text-stone-500">{qc.date}</td>
                  <td className="py-3 text-stone-700">{qc.inspector}</td>
                  <td className="py-3">
                    <StatusBadge status={qc.status} size="sm" />
                  </td>
                  <td className="py-3 text-stone-600 max-w-xs truncate">
                    {qc.rejectionReason ? (
                      <span className="text-red-600 font-bold">Failed: {qc.rejectionReason}</span>
                    ) : (
                      <span>{qc.notes}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECTION MODAL */}
      {inspectingBatch && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBDCD5]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Official QC Inspection Form
                </span>
                <h3 className="font-serif font-bold text-lg text-[#2E160E]">
                  Batch {inspectingBatch.id}: {inspectingBatch.productName}
                </h3>
              </div>
              <button onClick={() => setInspectingBatch(null)} className="text-stone-400">✕</button>
            </div>

            {/* 7 Tests Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#2E160E] block uppercase tracking-wider">
                Laboratory & Organoleptic Parameters:
              </span>

              {[
                { key: 'temperIndex', label: '1. Cocoa Butter Temper Index (Form V Beta Crystals)' },
                { key: 'moistureContent', label: '2. Moisture Content (< 1.5% target)' },
                { key: 'particleFineness', label: '3. Particle Fineness (< 20 microns)' },
                { key: 'snapAndGloss', label: '4. Snap Test & Surface Gloss Visual' },
                { key: 'meltingProfile', label: '5. Melting Profile & Smoothness (34°C palate melt)' },
                { key: 'sensoryFlavor', label: '6. Sensory & Flavor Profile Balance' },
                { key: 'microbiological', label: '7. Microbiological Screening Clearance' }
              ].map((item) => (
                <label
                  key={item.key}
                  className="p-2.5 rounded-lg border border-[#EBDCD5] bg-[#FAF5F0] flex items-center justify-between text-xs cursor-pointer hover:bg-[#F5EBE6]"
                >
                  <span className="font-medium text-stone-800">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={(tests as any)[item.key]}
                    onChange={(e) =>
                      setTests({ ...tests, [item.key]: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
              ))}
            </div>

            {/* Rejection Reason Selector (active if tests fail or manual reject) */}
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <label className="block text-xs font-bold text-[#2E160E]">
                Rejection Reason (Required if Rejecting Batch):
              </label>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] text-xs font-semibold text-[#2E160E]"
              >
                <option value="Moisture Content High">Moisture Content High (&gt; 1.5%)</option>
                <option value="Fat Bloom Detected">Fat Bloom Detected / Polymorphic Instability</option>
                <option value="Texture Inconsistent">Texture Inconsistent / Granular Graininess</option>
                <option value="Off Flavor Detected">Off Flavor Detected / Fermentation Defect</option>
                <option value="Tempering Failure">Tempering Failure / Soft Snap</option>
                <option value="Packaging Seal Defect">Packaging Seal Defect</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2E160E] mb-1">
                Inspector Findings & Notes
              </label>
              <textarea
                rows={2}
                value={qcNotes}
                onChange={(e) => setQcNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] text-xs"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3 border-t border-stone-200">
              <button
                onClick={handleReject}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Batch (Quarantine)</span>
              </button>

              <button
                onClick={handleApprove}
                className="flex-1 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Release to Stock</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
