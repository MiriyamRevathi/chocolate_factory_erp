import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import { RawMaterial } from '../types';
import {
  Boxes,
  PackagePlus,
  PackageMinus,
  SlidersHorizontal,
  AlertTriangle,
  History,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  CheckCircle2,
  X
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export const InventoryDashboard: React.FC = () => {
  const {
    rawMaterials,
    products,
    stockMovements,
    receiveMaterialStock,
    issueMaterialStock,
    adjustMaterialStock
  } = useFactory();

  // Modals state
  const [modalType, setModalType] = useState<'receive' | 'issue' | 'adjust' | null>(null);
  const [selectedMatId, setSelectedMatId] = useState(rawMaterials[0]?.id || 'MAT-001');
  const [quantityInput, setQuantityInput] = useState<number>(100);
  const [supplierInput, setSupplierInput] = useState('Equatorial Cocoa Co.');
  const [reasonInput, setReasonInput] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const selectedMaterial = rawMaterials.find((m) => m.id === selectedMatId) || rawMaterials[0];

  // Stats
  const rawMaterialItems = rawMaterials.filter((m) => m.category === 'Raw Material');
  const packagingItems = rawMaterials.filter((m) => m.category === 'Packaging');
  const lowStockCount = rawMaterials.filter((m) => m.status === 'Low Stock' || m.status === 'Out of Stock').length;
  const totalFinishedUnits = products.reduce((sum, p) => sum + p.stock, 0);

  const filteredMaterials = rawMaterials.filter((m) => {
    const matchesCat = categoryFilter === 'All' || m.category === categoryFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial) return;

    if (modalType === 'receive') {
      await receiveMaterialStock(selectedMaterial.id, quantityInput, supplierInput);
      alert(`Received ${quantityInput} ${selectedMaterial.unit} of ${selectedMaterial.name}. Stock updated.`);
    } else if (modalType === 'issue') {
      const ok = await issueMaterialStock(selectedMaterial.id, quantityInput, reasonInput || 'Production Floor Usage');
      if (ok) {
        alert(`Issued ${quantityInput} ${selectedMaterial.unit} of ${selectedMaterial.name}. Stock updated.`);
      } else {
        alert('Insufficient stock to issue!');
        return;
      }
    } else if (modalType === 'adjust') {
      await adjustMaterialStock(selectedMaterial.id, quantityInput, reasonInput || 'Cycle count adjustment');
      alert(`Adjusted stock of ${selectedMaterial.name} to ${quantityInput} ${selectedMaterial.unit}.`);
    }

    setModalType(null);
    setReasonInput('');
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EBDCD5] gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
            Supply Chain & Storage Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E160E]">
            Inventory & Raw Materials Vault
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setModalType('receive');
              setQuantityInput(250);
            }}
            className="px-3.5 py-2 rounded-xl bg-[#2E160E] hover:bg-[#4A2818] text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Receive Inbound Stock</span>
          </button>

          <button
            onClick={() => {
              setModalType('issue');
              setQuantityInput(50);
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <PackageMinus className="w-4 h-4" />
            <span>Issue to Production</span>
          </button>

          <button
            onClick={() => {
              setModalType('adjust');
              setQuantityInput(selectedMaterial?.quantity || 100);
            }}
            className="px-3.5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Adjust / Audit</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="choco-card p-4 bg-white border border-[#EBDCD5] rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase block">Raw Material Silos</span>
          <span className="font-serif text-2xl font-bold text-[#2E160E] block mt-1">
            {rawMaterialItems.length} Categories
          </span>
          <span className="text-[10px] text-stone-500 font-semibold mt-1 block">Cocoa, butter & sugar</span>
        </div>

        <div className="choco-card p-4 bg-white border border-[#EBDCD5] rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase block">Packaging Materials</span>
          <span className="font-serif text-2xl font-bold text-[#2E160E] block mt-1">
            {packagingItems.length} Formats
          </span>
          <span className="text-[10px] text-stone-500 font-semibold mt-1 block">Foil, boxes & ribbons</span>
        </div>

        <div className="choco-card p-4 bg-white border border-[#EBDCD5] rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase block">Low Stock Warnings</span>
          <span className={`font-serif text-2xl font-bold block mt-1 ${lowStockCount > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
            {lowStockCount} Silos
          </span>
          <span className="text-[10px] text-stone-500 font-semibold mt-1 block">Below safety reorder level</span>
        </div>

        <div className="choco-card p-4 bg-white border border-[#EBDCD5] rounded-xl shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase block">Finished Goods in Vault</span>
          <span className="font-serif text-2xl font-bold text-emerald-800 block mt-1 font-mono">
            {totalFinishedUnits} units
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Approved & ready for dispatch</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="choco-card p-4 bg-white border border-[#EBDCD5] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search material by name, ID or supplier..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#FAF5F0] border border-[#EBDCD5] text-xs focus:outline-hidden focus:border-amber-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-stone-500">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#FAF5F0] border border-[#EBDCD5] text-xs font-semibold text-[#2E160E]"
          >
            <option value="All">All Categories</option>
            <option value="Raw Material">Raw Ingredients</option>
            <option value="Packaging">Packaging Formats</option>
          </select>
        </div>
      </div>

      {/* Raw Materials Inventory Table */}
      <div className="choco-card p-5 bg-white border border-[#EBDCD5] rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#EBDCD5]">
          <h2 className="font-serif font-bold text-base text-[#2E160E] flex items-center gap-2">
            <Boxes className="w-4 h-4 text-amber-700" />
            <span>Materials Ledger & Silo Status</span>
          </h2>
          <span className="text-xs text-stone-500 font-mono">
            {filteredMaterials.length} items listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase font-mono text-[10px]">
                <th className="py-2.5">Material ID</th>
                <th className="py-2.5">Item Name</th>
                <th className="py-2.5">Category</th>
                <th className="py-2.5">Quantity</th>
                <th className="py-2.5">Min Threshold</th>
                <th className="py-2.5">Preferred Supplier</th>
                <th className="py-2.5">Stock Status</th>
                <th className="py-2.5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredMaterials.map((mat) => (
                <tr key={mat.id} className="hover:bg-stone-50">
                  <td className="py-3 font-mono font-bold text-[#2E160E]">{mat.id}</td>
                  <td className="py-3 font-bold text-[#2E160E]">{mat.name}</td>
                  <td className="py-3 text-stone-600">{mat.category}</td>
                  <td className="py-3 font-mono font-bold text-sm">
                    <span className={mat.quantity <= mat.minimumStock ? 'text-red-600 font-bold' : 'text-[#2E160E]'}>
                      {mat.quantity} {mat.unit}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-stone-500">
                    {mat.minimumStock} {mat.unit}
                  </td>
                  <td className="py-3 text-stone-600">{mat.supplier}</td>
                  <td className="py-3">
                    <StatusBadge status={mat.status} size="sm" />
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedMatId(mat.id);
                        setModalType('receive');
                        setQuantityInput(200);
                      }}
                      className="px-2.5 py-1 rounded bg-[#FAF5F0] hover:bg-[#F5EBE6] text-[#2E160E] font-bold text-[11px] border border-[#EBDCD5]"
                    >
                      + Receive
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movements History Ledger */}
      <div className="choco-card p-5 bg-white border border-[#EBDCD5] rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#EBDCD5]">
          <h2 className="font-serif font-bold text-base text-[#2E160E] flex items-center gap-2">
            <History className="w-4 h-4 text-amber-700" />
            <span>Traceable Inventory Transactions & Audit Trail</span>
          </h2>
          <span className="text-xs text-stone-500 font-mono">
            {stockMovements.length} log records
          </span>
        </div>

        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase font-mono text-[10px] sticky top-0 bg-white">
                <th className="py-2">Tx ID</th>
                <th className="py-2">Material / Product</th>
                <th className="py-2">Transaction Type</th>
                <th className="py-2">Quantity</th>
                <th className="py-2">Timestamp</th>
                <th className="py-2">Auditor / Agent</th>
                <th className="py-2">Reference / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {stockMovements.map((move) => {
                const isPositive = move.quantity > 0;
                return (
                  <tr key={move.id} className="hover:bg-stone-50">
                    <td className="py-2.5 font-mono text-stone-400">{move.id}</td>
                    <td className="py-2.5 font-semibold text-[#2E160E]">{move.materialName}</td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-1 font-semibold text-stone-800">
                        {isPositive ? (
                          <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5 text-amber-700" />
                        )}
                        <span>{move.movementType}</span>
                      </span>
                    </td>
                    <td className="py-2.5 font-mono font-bold">
                      <span className={isPositive ? 'text-emerald-700' : 'text-amber-800'}>
                        {isPositive ? `+${move.quantity}` : move.quantity} {move.unit}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-stone-400">{move.date}</td>
                    <td className="py-2.5 text-stone-600">{move.performedBy}</td>
                    <td className="py-2.5 text-stone-500 font-mono text-[11px] truncate max-w-xs">
                      {move.referenceBatchId || 'Inventory adjustment'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRANSACTION MODAL */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleActionSubmit}
            className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#EBDCD5]">
              <h3 className="font-serif font-bold text-lg text-[#2E160E] capitalize">
                {modalType === 'receive'
                  ? 'Receive Inbound Shipment'
                  : modalType === 'issue'
                  ? 'Issue Materials to Floor'
                  : 'Adjust Inventory Quantity'}
              </h3>
              <button type="button" onClick={() => setModalType(null)} className="text-stone-400">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#2E160E] mb-1">Target Material</label>
                <select
                  value={selectedMatId}
                  onChange={(e) => setSelectedMatId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] text-xs font-semibold text-[#2E160E]"
                >
                  {rawMaterials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (Current: {m.quantity} {m.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#2E160E] mb-1">
                  {modalType === 'adjust' ? 'New Exact Quantity Count' : 'Transaction Quantity'}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantityInput}
                  onChange={(e) => setQuantityInput(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] text-xs font-bold font-mono"
                />
              </div>

              {modalType === 'receive' && (
                <div>
                  <label className="block font-bold text-[#2E160E] mb-1">Supplier / Carrier</label>
                  <input
                    type="text"
                    value={supplierInput}
                    onChange={(e) => setSupplierInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] text-xs"
                  />
                </div>
              )}

              {(modalType === 'issue' || modalType === 'adjust') && (
                <div>
                  <label className="block font-bold text-[#2E160E] mb-1">Reason / Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. Batch BATCH-2026-004 ingredient allocation"
                    value={reasonInput}
                    onChange={(e) => setReasonInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] text-xs"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#2E160E] hover:bg-[#4A2818] text-amber-300 font-bold text-xs shadow-md transition-colors"
            >
              Confirm Transaction & Update Ledger
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
