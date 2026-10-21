import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import {
  Product,
  RawMaterial,
  Employee,
  Supplier,
  Order
} from '../types';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Layers,
  CheckCircle2,
  CheckCircle,
  Truck,
  Users,
  Building2,
  FileBarChart,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
  Download,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Check,
  X,
  PackagePlus,
  PackageMinus,
  SlidersHorizontal,
  History,
  Eye,
  Clock,
  ArrowRight,
  ClipboardCheck,
  ShieldAlert,
  Flame,
  Thermometer,
  FileText,
  MapPin,
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { ProductArtCard } from '../components/ChocolateGraphics';
import { AdminProductionTab } from '../components/admin/AdminProductionTab';
import { AdminInventoryTab } from '../components/admin/AdminInventoryTab';
import { AdminOrdersTab } from '../components/admin/AdminOrdersTab';
import { AdminQCTab } from '../components/admin/AdminQCTab';
import { AdminModals } from '../components/admin/AdminModals';

export const AdminDashboard: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    products,
    rawMaterials,
    batches,
    qualityChecks,
    orders,
    employees,
    suppliers,
    stockMovements,
    settings,
    deleteProduct,
    deleteEmployee,
    updateOrderStatus,
    updateSettings
  } = useFactory();

  // Active section inside admin
  const activeTab = currentView.replace('admin-', '') || 'dashboard';

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => (o.paymentStatus === 'Paid' ? sum + o.total : sum), 0);
  const activeBatchesCount = batches.filter((b) => b.status === 'In Production' || b.status === 'Planned').length;
  const pendingQCCount = batches.filter((b) => b.status === 'Sent to QC').length;
  const lowStockItems = rawMaterials.filter((m) => m.status === 'Low Stock' || m.status === 'Out of Stock');
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Placed' || o.orderStatus === 'Confirmed' || o.orderStatus === 'Processing');

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [inventoryModalType, setInventoryModalType] = useState<'receive' | 'issue' | 'adjust' | null>(null);
  const [selectedMatId, setSelectedMatId] = useState<string | undefined>(undefined);

  // Settings edit state
  const [editSettings, setEditSettings] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(editSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleExportCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#3D2B1F]/10 gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D9A05B]">
            Factory Management • Administration
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3D2B1F] capitalize mt-0.5">
            {activeTab.replace('-', ' ')}
          </h1>
          <p className="text-xs text-[#3D2B1F]/60 font-medium uppercase tracking-tight mt-0.5">
            Batch Status • Inventory • QC Monitoring
          </p>
        </div>

        {/* Action button depending on tab */}
        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'products' && (
            <button
              onClick={() => setShowProductModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] border border-[#D9A05B]/30 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          )}

          {(activeTab === 'production' || activeTab === 'batches') && (
            <button
              onClick={() => setShowBatchModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] border border-[#D9A05B]/30 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Plan New Batch</span>
            </button>
          )}

          {activeTab === 'inventory' && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setSelectedMatId(rawMaterials[0]?.id);
                  setInventoryModalType('receive');
                }}
                className="px-3.5 py-2 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] border border-[#D9A05B]/30 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <PackagePlus className="w-4 h-4" />
                <span>Receive Stock</span>
              </button>
              <button
                onClick={() => {
                  setSelectedMatId(rawMaterials[0]?.id);
                  setInventoryModalType('issue');
                }}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F9E4E8] text-[#3D2B1F] border border-[#D9A05B]/30 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <PackageMinus className="w-4 h-4" />
                <span>Issue to Floor</span>
              </button>
              <button
                onClick={() => {
                  setSelectedMatId(rawMaterials[0]?.id);
                  setInventoryModalType('adjust');
                }}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F9E4E8] text-[#3D2B1F] border border-[#D9A05B]/30 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Audit Adjust</span>
              </button>
            </div>
          )}

          {activeTab === 'orders' && (
            <button
              onClick={() =>
                handleExportCSV(
                  'customer-orders-report',
                  ['Order ID', 'Date', 'Customer', 'Email', 'Total', 'Payment', 'Status', 'Shipping Address'],
                  orders.map((o) => [
                    o.id,
                    o.orderDate,
                    o.customer.name,
                    o.customer.email,
                    o.total,
                    o.paymentStatus,
                    o.orderStatus,
                    `${o.customer.address}, ${o.customer.city}`
                  ])
                )
              }
              className="px-4 py-2.5 rounded-xl bg-[#D9A05B] hover:bg-[#c28b49] text-[#3D2B1F] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export Orders CSV</span>
            </button>
          )}

          {activeTab === 'qc' && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#3D2B1F] bg-[#F9E4E8] border border-[#D9A05B]/30 px-3 py-1.5 rounded-xl">
                {batches.filter((b) => b.status === 'Sent to QC').length} Batches Pending Release
              </span>
            </div>
          )}

          {activeTab === 'employees' && (
            <button
              onClick={() => setShowEmployeeModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] border border-[#D9A05B]/30 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Staff Member</span>
            </button>
          )}

          {activeTab === 'suppliers' && (
            <button
              onClick={() => setShowSupplierModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] border border-[#D9A05B]/30 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Supplier</span>
            </button>
          )}

          {activeTab === 'reports' && (
            <button
              onClick={() =>
                handleExportCSV(
                  'factory-complete-audit',
                  ['Order ID', 'Date', 'Customer', 'Total', 'Payment', 'Status'],
                  orders.map((o) => [o.id, o.orderDate, o.customer.name, o.total, o.paymentStatus, o.orderStatus])
                )
              }
              className="px-4 py-2.5 rounded-xl bg-[#D9A05B] hover:bg-[#c28b49] text-[#3D2B1F] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export All Data (CSV)</span>
            </button>
          )}
        </div>
      </div>

      {/* DASHBOARD OVERVIEW TAB */}
      {(activeTab === 'dashboard' || activeTab === '') && (
        <div className="space-y-6">
          {/* Key Metric Cards (Artistic Flair 4-Card Hero Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Revenue / Daily Yield */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#D9A05B]/15 flex flex-col justify-between">
              <div>
                <p className="text-[#3D2B1F]/50 text-xs uppercase font-bold tracking-wider">Total Dispatched Revenue</p>
                <h3 className="text-3xl font-serif text-[#3D2B1F] mt-1 font-mono font-bold">
                  ${Number(totalRevenue || 0).toFixed(2)}
                </h3>
              </div>
              <div className="mt-4">
                <div className="w-full bg-[#F9E4E8] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#D9A05B] h-full w-3/4 rounded-full"></div>
                </div>
                <p className="text-[10px] text-[#3D2B1F]/60 font-semibold mt-2">
                  {orders.length} orders recorded this cycle
                </p>
              </div>
            </div>

            {/* Card 2: Active Floor Batches */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#D9A05B]/15 flex flex-col justify-between">
              <div>
                <p className="text-[#3D2B1F]/50 text-xs uppercase font-bold tracking-wider">Active Floor Batches</p>
                <h3 className="text-3xl font-serif text-[#3D2B1F] mt-1">
                  {activeBatchesCount} <span className="text-sm italic text-[#D9A05B]">Batches</span>
                </h3>
              </div>
              <p className="text-[10px] text-emerald-700 font-bold mt-4 uppercase tracking-wide">
                14 Active Floor Lines Running
              </p>
            </div>

            {/* Card 3: Deep Espresso Dark Card */}
            <div className="bg-[#3D2B1F] p-6 rounded-3xl shadow-xl text-white border border-[#D9A05B]/20 flex flex-col justify-between">
              <div>
                <p className="text-[#D9A05B] text-xs uppercase font-bold tracking-wider">Pending Orders</p>
                <h3 className="text-3xl font-serif mt-1 font-bold">{pendingOrders.length}</h3>
              </div>
              <p className="text-[10px] text-white/70 mt-4 tracking-wider uppercase font-mono">
                EST. REVENUE ${(pendingOrders.reduce((sum, o) => sum + (o.total || 0), 0)).toFixed(0)} READY TO DISPATCH
              </p>
            </div>

            {/* Card 4: Low Stock Alert / Cocoa Supply */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#D9A05B]/15 flex flex-col justify-between">
              <div>
                <p className="text-[#3D2B1F]/50 text-xs uppercase font-bold tracking-wider">QC Release Queue</p>
                <h3 className="text-3xl font-serif text-[#3D2B1F] mt-1">
                  {pendingQCCount} <span className="text-sm italic text-[#D9A05B]">Batches</span>
                </h3>
              </div>
              <p className={`text-[10px] font-bold mt-4 uppercase ${lowStockItems.length > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                {lowStockItems.length > 0 ? `${lowStockItems.length} Low Stock Silo Warnings` : 'All Raw Ingredients In Spec'}
              </p>
            </div>
          </div>

          {/* Secondary stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/80 border border-[#D9A05B]/15 shadow-2xs">
              <span className="text-xs text-[#3D2B1F]/60 block font-medium">Confectionery Catalog</span>
              <span className="font-bold text-base text-[#3D2B1F] font-serif">{products.length} Products</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/80 border border-[#D9A05B]/15 shadow-2xs">
              <span className="text-xs text-[#3D2B1F]/60 block font-medium">Raw Materials Silos</span>
              <span className="font-bold text-base text-[#3D2B1F] font-serif">{rawMaterials.length} Silos</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/80 border border-[#D9A05B]/15 shadow-2xs">
              <span className="text-xs text-[#3D2B1F]/60 block font-medium">Factory Staff</span>
              <span className="font-bold text-base text-[#3D2B1F] font-serif">{employees.length} Members</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/80 border border-[#D9A05B]/15 shadow-2xs">
              <span className="text-xs text-[#3D2B1F]/60 block font-medium">Certified Suppliers</span>
              <span className="font-bold text-base text-[#3D2B1F] font-serif">{suppliers.length} Vendors</span>
            </div>
          </div>

          {/* Critical Alerts & Quality Milestone Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Low Stock Alerts (col-span-8) */}
            <div className="lg:col-span-8 bg-white/90 rounded-3xl p-6 border border-[#D9A05B]/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#3D2B1F]/10">
                <h3 className="font-serif font-bold text-base text-[#3D2B1F] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#D9A05B]" />
                  <span>Low Stock & Reorder Alerts</span>
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3D2B1F] bg-[#F9E4E8] px-2.5 py-1 rounded-full">
                  {lowStockItems.length} Warnings
                </span>
              </div>

              <div className="space-y-2.5">
                {lowStockItems.length === 0 ? (
                  <p className="text-xs text-[#3D2B1F]/60 py-4 text-center">All cocoa silos and packaging stocks remain above safety thresholds.</p>
                ) : (
                  lowStockItems.map((mat) => (
                    <div
                      key={mat.id}
                      className="p-3.5 rounded-2xl bg-[#F9E4E8]/40 border border-[#D9A05B]/20 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#3D2B1F] block text-sm">{mat.name}</span>
                        <span className="text-[11px] text-[#3D2B1F]/60">
                          Supplier: {mat.supplier} • Safety Baseline: {mat.minimumStock} {mat.unit}
                        </span>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={mat.status} size="sm" />
                        <span className="block font-mono font-bold text-[#3D2B1F] mt-1 text-sm">
                          {mat.quantity} {mat.unit}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quality Milestone Accent Card (col-span-4) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-[#D9A05B] p-6 rounded-3xl shadow-lg flex flex-col items-center justify-center text-center">
                <p className="text-[#3D2B1F] text-[10px] uppercase font-bold tracking-[0.2em] mb-2">
                  Artisanal Quality Milestone
                </p>
                <h5 className="text-white font-serif text-2xl font-bold leading-tight">
                  12 Days Since<br />Last Rejection
                </h5>
                <p className="text-white/80 text-[11px] mt-2">
                  98.4% First-Pass Temper Rate
                </p>
              </div>

              {/* QC Quick Box */}
              <div className="bg-white/90 rounded-3xl p-5 border border-[#D9A05B]/15 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#3D2B1F]/10">
                  <h4 className="font-serif font-bold text-sm text-[#3D2B1F]">Recent QC Releases</h4>
                  <span className="text-[10px] font-bold text-[#D9A05B] uppercase tracking-wider">Lab Records</span>
                </div>
                <div className="space-y-2">
                  {qualityChecks.slice(0, 3).map((qc) => (
                    <div
                      key={qc.id}
                      className="p-2.5 rounded-xl bg-[#F9E4E8]/30 border border-[#D9A05B]/15 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-[#D9A05B]">{qc.batchId}</span>
                        <span className="text-[11px] text-[#3D2B1F]/70 block truncate max-w-[140px]">{qc.productName}</span>
                      </div>
                      <StatusBadge status={qc.status} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders table */}
          <div className="bg-white/90 rounded-3xl p-6 border border-[#D9A05B]/15 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#3D2B1F]/10">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#3D2B1F]">Recent Customer Orders</h3>
                <p className="text-xs text-[#3D2B1F]/60">Dispatched from boutique vault and cold-chain packed</p>
              </div>
              <button
                onClick={() => setCurrentView('admin-orders')}
                className="text-xs font-bold text-[#D9A05B] hover:text-[#3D2B1F] transition-colors"
              >
                View All Orders →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#3D2B1F]/10 text-[#3D2B1F]/50 uppercase font-mono text-[10px] tracking-wider">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3D2B1F]/5">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-[#F9E4E8]/20 transition-colors">
                      <td className="py-3 font-mono font-bold text-[#D9A05B]">{order.id}</td>
                      <td className="py-3 font-medium text-[#3D2B1F]">{order.customer.name}</td>
                      <td className="py-3 text-[#3D2B1F]/60 font-mono">{order.orderDate}</td>
                      <td className="py-3 font-mono font-bold text-[#3D2B1F]">${Number(order.total || 0).toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3">
                        <StatusBadge status={order.orderStatus} size="sm" />
                      </td>
                      <td className="py-3 text-right">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#D9A05B]/30 text-[11px] font-semibold text-[#3D2B1F] shadow-2xs"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTION PIPELINE TAB */}
      {(activeTab === 'production' || activeTab === 'batches') && (
        <AdminProductionTab onOpenCreateBatch={() => setShowBatchModal(true)} />
      )}

      {/* INVENTORY & RAW SILOS TAB */}
      {activeTab === 'inventory' && (
        <AdminInventoryTab
          onOpenModal={(type, matId) => {
            setInventoryModalType(type);
            setSelectedMatId(matId);
          }}
        />
      )}

      {/* ORDERS & BOUTIQUE DISPATCH TAB */}
      {activeTab === 'orders' && <AdminOrdersTab />}

      {/* QUALITY CONTROL AUDIT & SENSORY LAB TAB */}
      {activeTab === 'qc' && <AdminQCTab />}

      {/* PRODUCTS CATALOG TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-xs p-5 rounded-3xl border border-[#D9A05B]/15 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-[#3D2B1F]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search recipe, terroir, cacao percentage..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-xs text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#3D2B1F]/60">
                {products.length} Recipes Registered
              </span>
              <button
                onClick={() => setShowProductModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] border border-[#D9A05B]/30 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>New Recipe</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products
              .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white/90 backdrop-blur-xs p-5 rounded-3xl border border-[#D9A05B]/15 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#D9A05B]/35 transition-colors"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#D9A05B] px-2 py-0.5 rounded-md bg-[#F9E4E8]">
                        {prod.id}
                      </span>
                      <StatusBadge status={prod.status} size="sm" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#3D2B1F]">{prod.name}</h3>
                      <span className="text-xs text-[#3D2B1F]/60 font-medium">{prod.category} • {prod.weight}</span>
                    </div>
                    <p className="text-xs text-[#3D2B1F]/70 line-clamp-2 italic">
                      "{prod.description}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#3D2B1F]/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-[#3D2B1F]/40 block font-bold uppercase tracking-wider">Unit Price</span>
                      <span className="font-bold text-base text-[#3D2B1F] font-mono">${Number(prod.price || 0).toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#3D2B1F]/40 block font-bold uppercase tracking-wider">Vault Stock</span>
                      <span className="font-bold text-sm text-[#3D2B1F] font-mono">{prod.stock} units</span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Remove recipe for ${prod.name}?`)) deleteProduct(prod.id);
                      }}
                      className="p-2 rounded-xl text-[#3D2B1F]/40 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Product Recipe"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* RAW MATERIALS TAB */}
      {activeTab === 'materials' && (
        <div className="bg-white/90 backdrop-blur-xs p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3D2B1F]/10">
            <div>
              <h2 className="font-serif font-bold text-lg text-[#3D2B1F]">Artisan Raw Silos & Ingredients</h2>
              <p className="text-xs text-[#3D2B1F]/60">Monitored single-origin cocoa, fair-trade sweeteners, and boutique packaging</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedMatId(rawMaterials[0]?.id);
                  setInventoryModalType('receive');
                }}
                className="px-3.5 py-2 rounded-xl bg-[#3D2B1F] text-[#D9A05B] border border-[#D9A05B]/30 font-bold text-xs flex items-center gap-1.5 shadow-2xs"
              >
                <PackagePlus className="w-3.5 h-3.5" />
                <span>Receive Silo Delivery</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#3D2B1F]/10 text-[#3D2B1F]/50 uppercase font-mono text-[10px] tracking-wider">
                  <th className="pb-3">Silo ID</th>
                  <th className="pb-3">Ingredient / Spec</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Available On Hand</th>
                  <th className="pb-3">Minimum Buffer</th>
                  <th className="pb-3">Certified Vendor</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3D2B1F]/5">
                {rawMaterials.map((mat) => (
                  <tr key={mat.id} className="hover:bg-[#F9E4E8]/20 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#D9A05B]">{mat.id}</td>
                    <td className="py-3.5 font-bold text-[#3D2B1F]">{mat.name}</td>
                    <td className="py-3.5 text-[#3D2B1F]/70">{mat.category}</td>
                    <td className="py-3.5 font-mono font-bold text-[#3D2B1F]">
                      {mat.quantity} {mat.unit}
                    </td>
                    <td className="py-3.5 text-[#3D2B1F]/60 font-mono">
                      {mat.minimumStock} {mat.unit}
                    </td>
                    <td className="py-3.5 text-[#3D2B1F]/70">{mat.supplier}</td>
                    <td className="py-3.5">
                      <StatusBadge status={mat.status} size="sm" />
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedMatId(mat.id);
                          setInventoryModalType('issue');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#D9A05B]/30 hover:bg-[#F9E4E8]/50 text-[11px] font-bold text-[#3D2B1F] shadow-2xs"
                      >
                        Issue to Floor
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EMPLOYEES TAB */}
      {activeTab === 'employees' && (
        <div className="bg-white/90 backdrop-blur-xs p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3D2B1F]/10">
            <div>
              <h2 className="font-serif font-bold text-lg text-[#3D2B1F]">Confectionery Roster & Floor Staff</h2>
              <p className="text-xs text-[#3D2B1F]/60">Master chocolatiers, sensory scientists, and production technicians</p>
            </div>
            <button
              onClick={() => setShowEmployeeModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] border border-[#D9A05B]/30 font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Register Staff Member</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#3D2B1F]/10 text-[#3D2B1F]/50 uppercase font-mono text-[10px] tracking-wider">
                  <th className="pb-3">Staff ID</th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Assigned Role</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3D2B1F]/5">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-[#F9E4E8]/20 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#D9A05B]">{emp.id}</td>
                    <td className="py-3.5 font-bold text-[#3D2B1F]">{emp.name}</td>
                    <td className="py-3.5 font-semibold text-[#D9A05B]">{emp.role}</td>
                    <td className="py-3.5 text-[#3D2B1F]/70">{emp.department}</td>
                    <td className="py-3.5 font-mono text-[#3D2B1F]/60">{emp.email}</td>
                    <td className="py-3.5 font-mono text-[#3D2B1F]/60">{emp.phone}</td>
                    <td className="py-3.5">
                      <StatusBadge status={emp.status} size="sm" />
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Remove staff record for ${emp.name}?`)) deleteEmployee(emp.id);
                        }}
                        className="p-1.5 rounded-lg text-[#3D2B1F]/40 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete staff record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUPPLIERS TAB */}
      {activeTab === 'suppliers' && (
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-xs p-5 rounded-3xl border border-[#D9A05B]/15 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-[#3D2B1F]">Certified Terroir Estates & Suppliers</h2>
              <p className="text-xs text-[#3D2B1F]/60">Direct-trade single-origin cocoa plantations and pure organic ingredient partners</p>
            </div>
            <button
              onClick={() => setShowSupplierModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] border border-[#D9A05B]/30 font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Estate / Vendor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {suppliers.map((sup) => (
              <div
                key={sup.id}
                className="bg-white/90 backdrop-blur-xs p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs space-y-4 hover:border-[#D9A05B]/35 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#D9A05B] px-2.5 py-0.5 rounded-full bg-[#F9E4E8]">
                    {sup.id}
                  </span>
                  <StatusBadge status={sup.status} size="sm" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#3D2B1F]">{sup.companyName}</h3>
                  <span className="text-xs text-[#3D2B1F]/60">Estate Director: {sup.contactPerson}</span>
                </div>
                <div className="text-xs text-[#3D2B1F]/80 space-y-1.5 bg-[#F9E4E8]/30 p-4 rounded-2xl border border-[#D9A05B]/15">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#D9A05B]" />
                    <span>{sup.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-[#3D2B1F]/70">{sup.phone} • {sup.email}</span>
                  </p>
                  <div className="pt-2 border-t border-[#3D2B1F]/10">
                    <span className="text-[10px] uppercase font-bold text-[#D9A05B] tracking-wider block mb-1">
                      Supplied Harvests & Materials:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sup.materialsSupplied.map((mat, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-[#D9A05B]/20 text-[10px] font-semibold text-[#3D2B1F]">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORTS TAB */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-xs p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs">
            <h2 className="font-serif font-bold text-xl text-[#3D2B1F]">Factory Operations Audit & Exports</h2>
            <p className="text-xs text-[#3D2B1F]/60 mt-1">Generate certified offline CSV audit files for accounting, compliance, and yield analysis</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white/90 backdrop-blur-xs p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs text-center space-y-3">
              <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-wider block">Boutique Sales Ledger</span>
              <span className="font-serif text-3xl font-bold text-[#3D2B1F] block font-mono">
                ${Number(totalRevenue || 0).toFixed(2)}
              </span>
              <p className="text-[11px] text-[#3D2B1F]/60">{orders.length} Dispatched Customer Orders</p>
              <button
                onClick={() =>
                  handleExportCSV(
                    'sales-report',
                    ['Order ID', 'Date', 'Customer', 'Total', 'Payment Status', 'Order Status'],
                    orders.map((o) => [o.id, o.orderDate, o.customer?.name || 'Customer', Number(o.total || 0).toFixed(2), o.paymentStatus, o.orderStatus])
                  )
                }
                className="w-full py-2.5 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <Download className="w-4 h-4" />
                <span>Export Sales CSV</span>
              </button>
            </div>

            <div className="bg-white/90 backdrop-blur-xs p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs text-center space-y-3">
              <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-wider block">Production Run Log</span>
              <span className="font-serif text-3xl font-bold text-[#3D2B1F] block">
                {batches.length} <span className="text-sm italic text-[#D9A05B]">Batches</span>
              </span>
              <p className="text-[11px] text-[#3D2B1F]/60">Full bean-to-bar processing logs</p>
              <button
                onClick={() =>
                  handleExportCSV(
                    'production-batches',
                    ['Batch ID', 'Product', 'Planned Qty', 'Produced Qty', 'Stage', 'Status', 'Yield %'],
                    batches.map((b) => [
                      b.id,
                      b.productName,
                      b.plannedQuantity,
                      b.producedQuantity,
                      b.currentStage,
                      b.status,
                      (b.plannedQuantity ? ((b.producedQuantity / b.plannedQuantity) * 100).toFixed(1) : '0.0') + '%'
                    ])
                  )
                }
                className="w-full py-2.5 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <Download className="w-4 h-4" />
                <span>Export Batches CSV</span>
              </button>
            </div>

            <div className="bg-white/90 backdrop-blur-xs p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs text-center space-y-3">
              <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-wider block">Silo Stock Movement Ledger</span>
              <span className="font-serif text-3xl font-bold text-[#3D2B1F] block">
                {stockMovements.length} <span className="text-sm italic text-[#D9A05B]">Audits</span>
              </span>
              <p className="text-[11px] text-[#3D2B1F]/60">Physical ledger & replenishment records</p>
              <button
                onClick={() =>
                  handleExportCSV(
                    'stock-movements',
                    ['Movement ID', 'Material', 'Type', 'Quantity', 'Date', 'Performed By', 'Reason'],
                    stockMovements.map((m) => [m.id, m.materialName, m.movementType, m.quantity, m.date, m.performedBy, m.reason])
                  )
                }
                className="w-full py-2.5 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <Download className="w-4 h-4" />
                <span>Export Stock Ledger CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <form
          onSubmit={handleSaveSettings}
          className="bg-white/90 backdrop-blur-xs p-6 sm:p-8 rounded-3xl border border-[#D9A05B]/15 shadow-xs space-y-6 max-w-3xl"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#3D2B1F]/10">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#3D2B1F]">Artisan Facility Configuration</h2>
              <p className="text-xs text-[#3D2B1F]/60">Tempering physics parameters, quality codex tolerances, and boutique rates</p>
            </div>
            {settingsSaved && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Standards Saved</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#3D2B1F] mb-1">Factory Name</label>
              <input
                type="text"
                value={editSettings.factoryName}
                onChange={(e) => setEditSettings({ ...editSettings, factoryName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#3D2B1F] mb-1">Facility Registry Code</label>
              <input
                type="text"
                value={editSettings.facilityCode}
                onChange={(e) => setEditSettings({ ...editSettings, facilityCode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#3D2B1F] mb-1">Courier Cold-Chain Shipping Fee ($)</label>
              <input
                type="number"
                step="0.5"
                value={editSettings.standardShippingFee}
                onChange={(e) => setEditSettings({ ...editSettings, standardShippingFee: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#3D2B1F] mb-1">Free Boutique Shipping Threshold ($)</label>
              <input
                type="number"
                step="5"
                value={editSettings.freeShippingThreshold}
                onChange={(e) => setEditSettings({ ...editSettings, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#3D2B1F] mb-1">Max Moisture Codex Tolerance (%)</label>
              <input
                type="number"
                step="0.1"
                value={editSettings.qcMaxMoisturePercent}
                onChange={(e) => setEditSettings({ ...editSettings, qcMaxMoisturePercent: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#3D2B1F] mb-1">Target Tempering Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                value={editSettings.temperingTargetTempC}
                onChange={(e) => setEditSettings({ ...editSettings, temperingTargetTempC: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] border border-[#D9A05B]/30 font-bold text-xs shadow-md transition-colors"
          >
            Update & Enforce Factory Standards
          </button>
        </form>
      )}

      {/* MODALS COMPONENT */}
      <AdminModals
        showProductModal={showProductModal}
        onCloseProductModal={() => setShowProductModal(false)}
        showEmployeeModal={showEmployeeModal}
        onCloseEmployeeModal={() => setShowEmployeeModal(false)}
        showSupplierModal={showSupplierModal}
        onCloseSupplierModal={() => setShowSupplierModal(false)}
        showBatchModal={showBatchModal}
        onCloseBatchModal={() => setShowBatchModal(false)}
        inventoryModalType={inventoryModalType}
        selectedMaterialId={selectedMatId}
        onCloseInventoryModal={() => setInventoryModalType(null)}
      />
    </div>
  );
};
