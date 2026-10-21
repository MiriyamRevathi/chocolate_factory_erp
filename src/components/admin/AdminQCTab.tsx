import React, { useState } from 'react';
import { useFactory } from '../../context/FactoryContext';
import { ProductionBatch, QualityCheckTest, RejectionReason } from '../../types';
import { StatusBadge } from '../StatusBadge';
import {
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
  ShieldCheck,
  Thermometer,
  Sparkles,
  X,
  Check,
  History,
  Eye
} from 'lucide-react';

export const AdminQCTab: React.FC = () => {
  const { batches, qualityChecks, evaluateQC } = useFactory();

  const [inspectingBatch, setInspectingBatch] = useState<ProductionBatch | null>(null);
  const [selectedQCLog, setSelectedQCLog] = useState<any | null>(null);

  // Test Checklist State
  const [testChecks, setTestChecks] = useState({
    temperCurve: true,
    moistureContent: true,
    particleFineness: true,
    snapAndGloss: true,
    flavorProfile: true,
    microbial: true
  });
  const [decision, setDecision] = useState<'Approve' | 'Reject'>('Approve');
  const [rejectionReason, setRejectionReason] = useState<RejectionReason>('Temperature issue');
  const [qcNotes, setQcNotes] = useState('Certified compliant with artisanal single-origin chocolate standards.');

  // Metrics
  const pendingBatches = batches.filter((b) => b.status === 'Sent to QC');
  const approvedBatches = batches.filter((b) => b.status === 'Approved');
  const rejectedBatches = batches.filter((b) => b.status === 'Rejected');
  const evaluatedCount = approvedBatches.length + rejectedBatches.length;
  const rejectionRate = evaluatedCount > 0 ? ((rejectedBatches.length / evaluatedCount) * 100).toFixed(1) : '0.0';

  const handleOpenAudit = (batch: ProductionBatch) => {
    setInspectingBatch(batch);
    setDecision('Approve');
    setTestChecks({
      temperCurve: true,
      moistureContent: true,
      particleFineness: true,
      snapAndGloss: true,
      flavorProfile: true,
      microbial: true
    });
    setQcNotes('Certified compliant with artisanal single-origin chocolate standards.');
  };

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectingBatch) return;

    const tests: { [key: string]: QualityCheckTest } = {
      temperCurve: {
        status: testChecks.temperCurve ? 'Pass' : 'Fail',
        value: '31.2°C (Form V crystals)',
        notes: 'Tempering curve compliant'
      },
      moistureContent: {
        status: testChecks.moistureContent ? 'Pass' : 'Fail',
        value: '1.2% (Codex < 1.5%)',
        notes: 'Moisture compliant'
      },
      particleFineness: {
        status: testChecks.particleFineness ? 'Pass' : 'Fail',
        value: '18 microns (Target < 20)',
        notes: 'Laser diffraction fineness certified'
      },
      snapAndGloss: {
        status: testChecks.snapAndGloss ? 'Pass' : 'Fail',
        value: 'Sharp acoustic snap & mirror sheen',
        notes: 'Surface gloss certified'
      },
      flavorProfile: {
        status: testChecks.flavorProfile ? 'Pass' : 'Fail',
        value: 'Rich cocoa acidity and floral notes',
        notes: 'Organoleptic panel approval'
      },
      microbialClearance: {
        status: testChecks.microbial ? 'Pass' : 'Fail',
        value: 'Pathogen clear',
        notes: 'Microbiological cultures clean'
      }
    };

    await evaluateQC({
      batchId: inspectingBatch.id,
      decision,
      rejectionReason: decision === 'Reject' ? rejectionReason : null,
      tests,
      notes: qcNotes
    });

    setInspectingBatch(null);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-wider">Awaiting Lab Audit</span>
            <div className="w-8 h-8 rounded-full bg-[#F9E4E8] flex items-center justify-center text-[#D9A05B]">
              <ClipboardCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className={`font-serif text-3xl font-bold ${pendingBatches.length > 0 ? 'text-amber-800' : 'text-[#3D2B1F]'}`}>
              {pendingBatches.length}
            </span>
            <span className="text-xs text-[#3D2B1F]/60 block mt-1">
              {pendingBatches.length > 0 ? 'Batches ready for physical & sensory release' : 'All production runs evaluated'}
            </span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-wider">Released to Inventory</span>
            <div className="w-8 h-8 rounded-full bg-[#F9E4E8] flex items-center justify-center text-[#D9A05B]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-3xl font-bold text-[#3D2B1F]">{approvedBatches.length}</span>
            <span className="text-xs text-[#3D2B1F]/60 block mt-1">Confectionery batches certified</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-wider">Rejection Rate</span>
            <div className="w-8 h-8 rounded-full bg-[#F9E4E8] flex items-center justify-center text-[#D9A05B]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-3xl font-bold text-[#3D2B1F]">{rejectionRate}%</span>
            <span className="text-xs text-[#3D2B1F]/60 block mt-1">Strict chocolate codex threshold</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-wider">Compliance Index</span>
            <div className="w-8 h-8 rounded-full bg-[#F9E4E8] flex items-center justify-center text-[#D9A05B]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-3xl font-bold text-[#3D2B1F]">99.4%</span>
            <span className="text-xs text-[#3D2B1F]/60 block mt-1">Food safety & GMP certified</span>
          </div>
        </div>
      </div>

      {/* Batches Awaiting Inspection */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#3D2B1F]/10">
          <div>
            <h3 className="font-serif font-bold text-base text-[#3D2B1F] flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-[#D9A05B]" />
              <span>Batches Pending Quality Assurance Audit</span>
            </h3>
            <p className="text-xs text-[#3D2B1F]/60 mt-0.5">Physical testing, crystalline temper curve verification, and organoleptic evaluation</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#3D2B1F] bg-[#F9E4E8] px-3 py-1 rounded-full">
            {pendingBatches.length} Pending Release
          </span>
        </div>

        {pendingBatches.length === 0 ? (
          <div className="p-8 text-center bg-[#F9E4E8]/20 rounded-2xl border border-[#D9A05B]/10">
            <Check className="w-8 h-8 text-[#D9A05B] mx-auto mb-2" />
            <p className="font-serif font-bold text-[#3D2B1F] text-sm">All Batches Inspected</p>
            <p className="text-xs text-[#3D2B1F]/60 mt-1">No batches currently in the QC staging queue.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingBatches.map((batch) => (
              <div
                key={batch.id}
                className="p-5 rounded-2xl bg-white border border-[#D9A05B]/20 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#D9A05B]">{batch.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                      Needs Inspection
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#3D2B1F] mt-1">{batch.productName}</h4>
                  <div className="text-xs text-[#3D2B1F]/70 mt-2 space-y-1">
                    <p>Planned Yield: <span className="font-mono font-bold text-[#3D2B1F]">{batch.plannedQuantity} units</span></p>
                    <p>Production Manager: <span className="font-medium text-[#3D2B1F]">{batch.manager}</span></p>
                    <p>Run Notes: <span className="italic text-[#3D2B1F]/60">{batch.notes}</span></p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAudit(batch)}
                  className="w-full py-2.5 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] border border-[#D9A05B]/30 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Perform Laboratory QC Audit</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QC Historical Audit Log */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#3D2B1F]/10">
          <div>
            <h3 className="font-serif font-bold text-base text-[#3D2B1F] flex items-center gap-2">
              <History className="w-4 h-4 text-[#D9A05B]" />
              <span>Completed Quality Inspection Records</span>
            </h3>
            <p className="text-xs text-[#3D2B1F]/60 mt-0.5">Historical verification records, organoleptic sensory logs, and certificate stamps</p>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#3D2B1F]/60">
            {qualityChecks.length} Records Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#3D2B1F]/10 text-[#3D2B1F]/60 uppercase font-mono text-[10px]">
                <th className="pb-3">Inspection ID</th>
                <th className="pb-3">Batch ID</th>
                <th className="pb-3">Confectionery Product</th>
                <th className="pb-3">Evaluation Date</th>
                <th className="pb-3">Chief Inspector</th>
                <th className="pb-3">Verdict</th>
                <th className="pb-3">Audit Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D2B1F]/5">
              {qualityChecks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#3D2B1F]/50 italic">
                    No quality check inspections logged yet.
                  </td>
                </tr>
              ) : (
                qualityChecks.map((qc) => (
                  <tr key={qc.id} className="hover:bg-[#F9E4E8]/20 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#D9A05B]">{qc.id}</td>
                    <td className="py-3.5 font-mono text-[#3D2B1F]">{qc.batchId}</td>
                    <td className="py-3.5 font-bold text-[#3D2B1F]">{qc.productName}</td>
                    <td className="py-3.5 font-mono text-[#3D2B1F]/60">{qc.checkDate}</td>
                    <td className="py-3.5 text-[#3D2B1F]/80">{qc.inspector}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          qc.status === 'Pass'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}
                      >
                        {qc.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-[#3D2B1F]/70 italic truncate max-w-xs">{qc.notes}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QC Inspection Modal */}
      {inspectingBatch && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <form
            onSubmit={handleAuditSubmit}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 border border-[#D9A05B]/20 shadow-xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#3D2B1F]/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9A05B]">
                  Laboratory Certification
                </span>
                <h2 className="font-serif font-bold text-xl text-[#3D2B1F] mt-0.5">
                  Audit: {inspectingBatch.productName}
                </h2>
                <p className="text-xs font-mono text-[#3D2B1F]/60 mt-0.5">Batch ID: {inspectingBatch.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setInspectingBatch(null)}
                className="p-1.5 rounded-full hover:bg-[#F9E4E8] text-[#3D2B1F]/60 hover:text-[#3D2B1F] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Test Checklist */}
            <div className="space-y-3">
              <span className="font-bold text-xs text-[#3D2B1F] uppercase tracking-wider block">
                Quality Criteria Verification Checklist
              </span>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-[#D9A05B]/20 bg-[#F9E4E8]/30 cursor-pointer hover:bg-[#F9E4E8]/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={testChecks.temperCurve}
                    onChange={(e) => setTestChecks({ ...testChecks, temperCurve: e.target.checked })}
                    className="rounded text-[#3D2B1F] focus:ring-[#D9A05B] w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-[#3D2B1F] block">Tempering Curve & Crystal Structure</span>
                    <span className="text-[11px] text-[#3D2B1F]/60">Target: Form V beta crystals stabilized at 31.2°C</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-[#D9A05B]/20 bg-[#F9E4E8]/30 cursor-pointer hover:bg-[#F9E4E8]/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={testChecks.moistureContent}
                    onChange={(e) => setTestChecks({ ...testChecks, moistureContent: e.target.checked })}
                    className="rounded text-[#3D2B1F] focus:ring-[#D9A05B] w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-[#3D2B1F] block">Moisture Analyzer Test</span>
                    <span className="text-[11px] text-[#3D2B1F]/60">Codex limit: &lt; 1.5% moisture content</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-[#D9A05B]/20 bg-[#F9E4E8]/30 cursor-pointer hover:bg-[#F9E4E8]/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={testChecks.particleFineness}
                    onChange={(e) => setTestChecks({ ...testChecks, particleFineness: e.target.checked })}
                    className="rounded text-[#3D2B1F] focus:ring-[#D9A05B] w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-[#3D2B1F] block">Laser Micrometer Fineness</span>
                    <span className="text-[11px] text-[#3D2B1F]/60">Target: particle diameter &lt; 20 microns (ultra-silky mouthfeel)</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-[#D9A05B]/20 bg-[#F9E4E8]/30 cursor-pointer hover:bg-[#F9E4E8]/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={testChecks.snapAndGloss}
                    onChange={(e) => setTestChecks({ ...testChecks, snapAndGloss: e.target.checked })}
                    className="rounded text-[#3D2B1F] focus:ring-[#D9A05B] w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-[#3D2B1F] block">Acoustic Snap & Mirror Gloss</span>
                    <span className="text-[11px] text-[#3D2B1F]/60">Audible fracture resonance and flawless high-gloss demoulding</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-[#D9A05B]/20 bg-[#F9E4E8]/30 cursor-pointer hover:bg-[#F9E4E8]/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={testChecks.flavorProfile}
                    onChange={(e) => setTestChecks({ ...testChecks, flavorProfile: e.target.checked })}
                    className="rounded text-[#3D2B1F] focus:ring-[#D9A05B] w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-[#3D2B1F] block">Organoleptic Sensory Panel</span>
                    <span className="text-[11px] text-[#3D2B1F]/60">Balanced bean acidity, roast profile, and notes of stone fruit</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-[#D9A05B]/20 bg-[#F9E4E8]/30 cursor-pointer hover:bg-[#F9E4E8]/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={testChecks.microbial}
                    onChange={(e) => setTestChecks({ ...testChecks, microbial: e.target.checked })}
                    className="rounded text-[#3D2B1F] focus:ring-[#D9A05B] w-4 h-4"
                  />
                  <div>
                    <span className="font-bold text-[#3D2B1F] block">Microbiological Food Safety</span>
                    <span className="text-[11px] text-[#3D2B1F]/60">Pathogen negative culture clearance</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Verdict Selector */}
            <div className="space-y-3 pt-2 border-t border-[#3D2B1F]/10">
              <span className="font-bold text-xs text-[#3D2B1F] uppercase tracking-wider block">
                Final Inspection Verdict
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDecision('Approve')}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    decision === 'Approve'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-[#3D2B1F] border-[#3D2B1F]/20 hover:bg-[#F9E4E8]'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Approve & Release to Vault</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDecision('Reject')}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    decision === 'Reject'
                      ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                      : 'bg-white text-[#3D2B1F] border-[#3D2B1F]/20 hover:bg-[#F9E4E8]'
                  }`}
                >
                  <X className="w-4 h-4" />
                  <span>Reject & Quarantine</span>
                </button>
              </div>

              {decision === 'Reject' && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-[#3D2B1F] mb-1">
                    Specific Non-Conformance Cause
                  </label>
                  <select
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value as RejectionReason)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9A05B]/30 text-xs text-[#3D2B1F]"
                  >
                    <option value="Temperature issue">Temperature issue (Bloom risk)</option>
                    <option value="Weight issue">Weight non-compliance</option>
                    <option value="Texture issue">Texture coarseness / particle failure</option>
                    <option value="Packaging defect">Damaged or flawed packaging</option>
                    <option value="Sensory defect">Astringent off-note in tasting</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#3D2B1F] mb-1">
                  Inspector Certificate Notes
                </label>
                <textarea
                  rows={2}
                  value={qcNotes}
                  onChange={(e) => setQcNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9A05B]/20 text-xs text-[#3D2B1F] placeholder:text-[#3D2B1F]/40 focus:outline-none focus:border-[#D9A05B]"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-[#3D2B1F]/10">
              <button
                type="button"
                onClick={() => setInspectingBatch(null)}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] font-bold text-xs hover:bg-[#F9E4E8] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] border border-[#D9A05B]/30 font-bold text-xs transition-colors shadow-2xs"
              >
                Submit Official Verdict
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
