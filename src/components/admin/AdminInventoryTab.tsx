import React, { useState } from 'react';
import { useFactory } from '../../context/FactoryContext';
import { RawMaterial } from '../../types';
import { StatusBadge } from '../StatusBadge';
import {
  Boxes,
  Package,
  PackagePlus,
  PackageMinus,
  SlidersHorizontal,
  AlertTriangle,
  Search,
  Download,
  History,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

interface AdminInventoryTabProps {
  onOpenModal: (type: 'receive' | 'issue' | 'adjust', materialId?: string) => void;
}

export const AdminInventoryTab: React.FC<AdminInventoryTabProps> = ({ onOpenModal }) => {
  const { rawMaterials, products, stockMovements } = useFactory();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Metrics
  const rawItems = rawMaterials.filter((m) => m.category === 'Raw Material');
  const packagingItems = rawMaterials.filter((m) => m.category === 'Packaging');
  const lowStockCount = rawMaterials.filter((m) => m.status === 'Low Stock' || m.status === 'Out of Stock').length;
  const totalFinishedGoodsUnits = products.reduce((sum, p) => sum + p.stock, 0);

  const filteredMaterials = rawMaterials.filter((m) => {
    const matchesCat = categoryFilter === 'All' || m.category === categoryFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleExportMovements = () => {
    const headers = ['Movement ID', 'Material', 'Type', 'Quantity', 'Unit', 'Date', 'Performed By', 'Reason'];
    const rows = stockMovements.map((m) => [
      m.id,
      m.materialName,
      m.movementType,
      m.quantity,
      m.unit,
      m.date,
      m.performedBy,
      m.reason
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `stock-movements-ledger-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-wider">Raw Ingredient Silos</span>
            <div className="w-8 h-8 rounded-full bg-[#F9E4E8] flex items-center justify-center text-[#D9A05B]">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-3xl font-bold text-[#3D2B1F]">{rawItems.length}</span>
            <span className="text-xs text-[#3D2B1F]/60 block mt-1">Beans, cocoa butter, sweeteners</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-wider">Packaging Supplies</span>
            <div className="w-8 h-8 rounded-full bg-[#F9E4E8] flex items-center justify-center text-[#D9A05B]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-3xl font-bold text-[#3D2B1F]">{packagingItems.length}</span>
            <span className="text-xs text-[#3D2B1F]/60 block mt-1">Luxury foil, ballotins & cartons</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-wider">Finished Vault Stock</span>
            <div className="w-8 h-8 rounded-full bg-[#F9E4E8] flex items-center justify-center text-[#D9A05B]">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-3xl font-bold text-[#3D2B1F]">{totalFinishedGoodsUnits.toLocaleString()}</span>
            <span className="text-xs text-[#3D2B1F]/60 block mt-1">Ready for packaging & dispatch</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-wider">Low Stock Warnings</span>
            <div className="w-8 h-8 rounded-full bg-[#F9E4E8] flex items-center justify-center text-[#D9A05B]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className={`font-serif text-3xl font-bold ${lowStockCount > 0 ? 'text-amber-800' : 'text-[#3D2B1F]'}`}>
              {lowStockCount}
            </span>
            <span className="text-xs text-[#3D2B1F]/60 block mt-1">
              {lowStockCount > 0 ? 'Urgent purchase orders required' : 'All materials at optimum level'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Stock Inventory Table */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#3D2B1F]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ingredients, packaging, suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-xs text-[#3D2B1F] placeholder:text-[#3D2B1F]/40 focus:outline-none focus:border-[#D9A05B]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Raw Material', 'Packaging'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  categoryFilter === cat
                    ? 'bg-[#3D2B1F] text-[#D9A05B] border border-[#D9A05B]/30 shadow-xs'
                    : 'bg-white text-[#3D2B1F]/70 border border-[#D9A05B]/15 hover:bg-[#F9E4E8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stock Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#3D2B1F]/10 text-[#3D2B1F]/60 uppercase font-mono text-[10px]">
                <th className="pb-3">Item ID</th>
                <th className="pb-3">Ingredient / Supply Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Stock On Hand</th>
                <th className="pb-3">Stock Health</th>
                <th className="pb-3">Reorder Point</th>
                <th className="pb-3">Certified Supplier</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Quick Ledger Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D2B1F]/5">
              {filteredMaterials.map((mat) => {
                const ratio = mat.minimumStock > 0 ? Math.min(100, Math.round((mat.quantity / (mat.minimumStock * 2)) * 100)) : 100;
                const isLow = mat.quantity <= mat.minimumStock;

                return (
                  <tr key={mat.id} className="hover:bg-[#F9E4E8]/20 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#D9A05B]">{mat.id}</td>
                    <td className="py-3.5">
                      <span className="font-bold text-[#3D2B1F] block">{mat.name}</span>
                      <span className="text-[10px] text-[#3D2B1F]/60">Batch ref: {mat.batchNumber}</span>
                    </td>
                    <td className="py-3.5 text-[#3D2B1F]/70">{mat.category}</td>
                    <td className="py-3.5 font-mono font-bold text-[#3D2B1F]">
                      {mat.quantity} {mat.unit}
                    </td>
                    <td className="py-3.5 w-32">
                      <div className="w-full bg-[#3D2B1F]/10 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            mat.quantity === 0
                              ? 'bg-rose-500'
                              : isLow
                              ? 'bg-amber-500'
                              : 'bg-emerald-600'
                          }`}
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 font-mono text-[#3D2B1F]/60">
                      {mat.minimumStock} {mat.unit}
                    </td>
                    <td className="py-3.5 text-[#3D2B1F]/80">{mat.supplier}</td>
                    <td className="py-3.5">
                      <StatusBadge status={mat.status} size="sm" />
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onOpenModal('receive', mat.id)}
                          className="px-2 py-1 rounded-lg bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] text-[10px] font-bold transition-colors"
                          title="Receive Stock"
                        >
                          + Receive
                        </button>
                        <button
                          onClick={() => onOpenModal('issue', mat.id)}
                          className="px-2 py-1 rounded-lg bg-white hover:bg-[#F9E4E8] text-[#3D2B1F] border border-[#D9A05B]/20 text-[10px] font-bold transition-colors"
                          title="Issue to Floor"
                        >
                          - Issue
                        </button>
                        <button
                          onClick={() => onOpenModal('adjust', mat.id)}
                          className="px-2 py-1 rounded-lg bg-white hover:bg-[#F9E4E8] text-[#3D2B1F]/70 border border-[#D9A05B]/20 text-[10px] font-bold transition-colors"
                          title="Adjust Count"
                        >
                          Audit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movements Log (Ledger) */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#3D2B1F]/10">
          <div>
            <h3 className="font-serif font-bold text-base text-[#3D2B1F] flex items-center gap-2">
              <History className="w-4 h-4 text-[#D9A05B]" />
              <span>Material Movement Ledger Audit</span>
            </h3>
            <p className="text-xs text-[#3D2B1F]/60 mt-0.5">Automated inventory intake, production consumption, and adjustments</p>
          </div>
          <button
            onClick={handleExportMovements}
            className="px-3 py-1.5 rounded-xl bg-[#D9A05B] hover:bg-[#c28b49] text-[#3D2B1F] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Ledger CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#3D2B1F]/10 text-[#3D2B1F]/60 uppercase font-mono text-[10px]">
                <th className="pb-2.5">Log ID</th>
                <th className="pb-2.5">Date & Time</th>
                <th className="pb-2.5">Material</th>
                <th className="pb-2.5">Movement Type</th>
                <th className="pb-2.5">Quantity Change</th>
                <th className="pb-2.5">Operator</th>
                <th className="pb-2.5">Reason / Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D2B1F]/5">
              {stockMovements.slice(0, 10).map((sm) => (
                <tr key={sm.id} className="hover:bg-[#F9E4E8]/20 transition-colors">
                  <td className="py-2.5 font-mono font-bold text-[#D9A05B]">{sm.id}</td>
                  <td className="py-2.5 font-mono text-[#3D2B1F]/60">{sm.date}</td>
                  <td className="py-2.5 font-semibold text-[#3D2B1F]">{sm.materialName}</td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        sm.movementType === 'Received'
                          ? 'bg-emerald-100 text-emerald-900'
                          : sm.movementType === 'Issued'
                          ? 'bg-[#F9E4E8] text-[#3D2B1F]'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {sm.movementType}
                    </span>
                  </td>
                  <td className={`py-2.5 font-mono font-bold ${sm.quantity > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {sm.quantity > 0 ? `+${sm.quantity}` : sm.quantity} {sm.unit}
                  </td>
                  <td className="py-2.5 text-[#3D2B1F]/70">{sm.performedBy}</td>
                  <td className="py-2.5 text-[#3D2B1F]/60 italic truncate max-w-xs">{sm.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
