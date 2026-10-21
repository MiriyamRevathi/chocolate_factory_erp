import React, { useState } from 'react';
import { useFactory } from '../../context/FactoryContext';
import { X, Plus, PackagePlus, PackageMinus, SlidersHorizontal, Sparkles } from 'lucide-react';

interface AdminModalsProps {
  showProductModal: boolean;
  onCloseProductModal: () => void;
  showEmployeeModal: boolean;
  onCloseEmployeeModal: () => void;
  showSupplierModal: boolean;
  onCloseSupplierModal: () => void;
  showBatchModal: boolean;
  onCloseBatchModal: () => void;
  inventoryModalType: 'receive' | 'issue' | 'adjust' | null;
  selectedMaterialId?: string;
  onCloseInventoryModal: () => void;
}

export const AdminModals: React.FC<AdminModalsProps> = ({
  showProductModal,
  onCloseProductModal,
  showEmployeeModal,
  onCloseEmployeeModal,
  showSupplierModal,
  onCloseSupplierModal,
  showBatchModal,
  onCloseBatchModal,
  inventoryModalType,
  selectedMaterialId,
  onCloseInventoryModal
}) => {
  const {
    products,
    rawMaterials,
    suppliers,
    addProduct,
    addEmployee,
    addSupplier,
    createBatch,
    receiveStock,
    issueMaterial,
    adjustStock
  } = useFactory();

  // Product Form State
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('Milk Chocolate');
  const [productPrice, setProductPrice] = useState(7.0);
  const [productWeight, setProductWeight] = useState('100g');
  const [productDescription, setProductDescription] = useState('');

  // Employee Form State
  const [employeeName, setEmployeeName] = useState('');
  const [employeeRole, setEmployeeRole] = useState<'Production Manager' | 'QC Manager' | 'Inventory Manager' | 'Admin'>('Production Manager');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeePhone, setEmployeePhone] = useState('');

  // Supplier Form State
  const [supplierName, setSupplierName] = useState('');
  const [supplierContact, setSupplierContact] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [supplierAddress, setSupplierAddress] = useState('');
  const [supplierMaterials, setSupplierMaterials] = useState('Single-Origin Cocoa Beans, Cocoa Butter');

  // Batch Form State
  const [batchProductId, setBatchProductId] = useState(products[0]?.id || 'PROD-101');
  const [batchQty, setBatchQty] = useState(300);
  const [batchNotes, setBatchNotes] = useState('Special artisan single-origin production run');

  // Inventory Transaction State
  const [invMatId, setInvMatId] = useState(selectedMaterialId || rawMaterials[0]?.id || 'MAT-001');
  const [invQty, setInvQty] = useState(100);
  const [invReason, setInvReason] = useState('');

  // Sync selectedMaterialId
  React.useEffect(() => {
    if (selectedMaterialId) setInvMatId(selectedMaterialId);
  }, [selectedMaterialId]);

  return (
    <>
      {/* 1. ADD PRODUCT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 border border-[#D9A05B]/20 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#3D2B1F]/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9A05B]">Confectionery Catalog</span>
                <h3 className="font-serif font-bold text-xl text-[#3D2B1F] mt-0.5">New Artisan Recipe</h3>
              </div>
              <button onClick={onCloseProductModal} className="p-1 rounded-full hover:bg-[#F9E4E8] text-[#3D2B1F]/60">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#3D2B1F] mb-1">Product Title</label>
                <input
                  type="text"
                  placeholder="e.g. Single-Origin Madagascar 72%"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#3D2B1F] mb-1">Category</label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                  >
                    <option value="Milk Chocolate">Milk Chocolate</option>
                    <option value="Dark Chocolate">Dark Chocolate</option>
                    <option value="White Chocolate">White Chocolate</option>
                    <option value="Chocolate Bars">Chocolate Bars</option>
                    <option value="Truffles">Truffles</option>
                    <option value="Gift Boxes">Gift Boxes</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#3D2B1F] mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={productPrice}
                    onChange={(e) => setProductPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-[#3D2B1F] mb-1">Pack Weight</label>
                <input
                  type="text"
                  value={productWeight}
                  onChange={(e) => setProductWeight(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#3D2B1F] mb-1">Description & Terroir Notes</label>
                <textarea
                  rows={2}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Notes on roasting profile, notes of dried berries, and slow stone grinding..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                />
              </div>
            </div>
            <button
              onClick={async () => {
                if (!productName) return alert('Please enter product title');
                await addProduct({
                  name: productName,
                  category: productCategory,
                  description: productDescription || 'Handcrafted single-origin chocolate bar',
                  price: productPrice,
                  weight: productWeight,
                  ingredients: 'Direct-trade cocoa beans, cane sugar, cocoa butter',
                  allergens: productCategory.includes('Milk') ? 'Contains milk' : 'May contain traces of tree nuts',
                  nutrition: { calories: '540 kcal', fat: '34g', saturatedFat: '21g', carbs: '50g', sugar: '42g', protein: '8g' },
                  stock: 45,
                  status: 'Active',
                  rating: 4.9
                });
                onCloseProductModal();
                setProductName('');
                setProductDescription('');
              }}
              className="w-full py-3 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] border border-[#D9A05B]/30 font-bold text-xs shadow-md transition-colors"
            >
              Save Recipe & Add to Catalog
            </button>
          </div>
        </div>
      )}

      {/* 2. ADD EMPLOYEE MODAL */}
      {showEmployeeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 border border-[#D9A05B]/20 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#3D2B1F]/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9A05B]">Human Resources</span>
                <h3 className="font-serif font-bold text-xl text-[#3D2B1F] mt-0.5">Register Factory Staff</h3>
              </div>
              <button onClick={onCloseEmployeeModal} className="p-1 rounded-full hover:bg-[#F9E4E8] text-[#3D2B1F]/60">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#3D2B1F] mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Master Chocolatier Jean-Luc"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#3D2B1F] mb-1">Factory Role</label>
                <select
                  value={employeeRole}
                  onChange={(e) => setEmployeeRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                >
                  <option value="Production Manager">Production Manager</option>
                  <option value="QC Manager">Quality Control Manager</option>
                  <option value="Inventory Manager">Inventory Manager</option>
                  <option value="Admin">Factory Administrator</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#3D2B1F] mb-1">Email</label>
                <input
                  type="email"
                  placeholder="name@artisanfactory.com"
                  value={employeeEmail}
                  onChange={(e) => setEmployeeEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#3D2B1F] mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 234-5678"
                  value={employeePhone}
                  onChange={(e) => setEmployeePhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                />
              </div>
            </div>
            <button
              onClick={async () => {
                if (!employeeName || !employeeEmail) return alert('Name and email required');
                await addEmployee({
                  name: employeeName,
                  role: employeeRole,
                  department: employeeRole === 'QC Manager' ? 'Quality & Assurance' : employeeRole === 'Inventory Manager' ? 'Silo Logistics' : 'Bean-to-Bar Floor',
                  email: employeeEmail,
                  phone: employeePhone || '+1 (555) 000-0000',
                  joiningDate: new Date().toISOString().slice(0, 10),
                  status: 'Active'
                });
                onCloseEmployeeModal();
                setEmployeeName('');
                setEmployeeEmail('');
                setEmployeePhone('');
              }}
              className="w-full py-3 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] border border-[#D9A05B]/30 font-bold text-xs shadow-md transition-colors"
            >
              Register Staff Member
            </button>
          </div>
        </div>
      )}

      {/* 3. ADD SUPPLIER MODAL */}
      {showSupplierModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 border border-[#D9A05B]/20 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#3D2B1F]/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9A05B]">Supply Chain</span>
                <h3 className="font-serif font-bold text-xl text-[#3D2B1F] mt-0.5">Certify New Vendor</h3>
              </div>
              <button onClick={onCloseSupplierModal} className="p-1 rounded-full hover:bg-[#F9E4E8] text-[#3D2B1F]/60">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#3D2B1F] mb-1">Company / Plantation Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sambirano Estate Cocoa Co."
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#3D2B1F] mb-1">Contact Person</label>
                <input
                  type="text"
                  placeholder="e.g. Maria Gonzalez"
                  value={supplierContact}
                  onChange={(e) => setSupplierContact(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#3D2B1F] mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="trade@estate.com"
                    value={supplierEmail}
                    onChange={(e) => setSupplierEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#3D2B1F] mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 444-1122"
                    value={supplierPhone}
                    onChange={(e) => setSupplierPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-[#3D2B1F] mb-1">Headquarters / Plantation Address</label>
                <input
                  type="text"
                  placeholder="e.g. Valley Road, Ambanja, Madagascar"
                  value={supplierAddress}
                  onChange={(e) => setSupplierAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#3D2B1F] mb-1">Materials Supplied (comma separated)</label>
                <input
                  type="text"
                  value={supplierMaterials}
                  onChange={(e) => setSupplierMaterials(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                />
              </div>
            </div>
            <button
              onClick={async () => {
                if (!supplierName) return alert('Supplier name required');
                await addSupplier({
                  companyName: supplierName,
                  contactPerson: supplierContact || 'Procurement Rep',
                  phone: supplierPhone || '+1 (555) 000-0000',
                  email: supplierEmail || 'info@supplier.com',
                  address: supplierAddress || 'Global Cocoa Exchange',
                  materialsSupplied: supplierMaterials.split(',').map((s) => s.trim()).filter(Boolean),
                  status: 'Active',
                  leadTimeDays: 14,
                  rating: 4.8
                });
                onCloseSupplierModal();
                setSupplierName('');
                setSupplierContact('');
                setSupplierEmail('');
                setSupplierPhone('');
                setSupplierAddress('');
              }}
              className="w-full py-3 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] border border-[#D9A05B]/30 font-bold text-xs shadow-md transition-colors"
            >
              Certify & Add Supplier
            </button>
          </div>
        </div>
      )}

      {/* 4. PLAN NEW BATCH MODAL */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 border border-[#D9A05B]/20 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#3D2B1F]/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9A05B]">Bean-to-Bar Floor</span>
                <h3 className="font-serif font-bold text-xl text-[#3D2B1F] mt-0.5">Plan Production Run</h3>
              </div>
              <button onClick={onCloseBatchModal} className="p-1 rounded-full hover:bg-[#F9E4E8] text-[#3D2B1F]/60">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#3D2B1F] mb-1">Select Confectionery Recipe</label>
                <select
                  value={batchProductId}
                  onChange={(e) => setBatchProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#3D2B1F] mb-1">Target Yield (Finished Units)</label>
                <input
                  type="number"
                  step="25"
                  min="25"
                  value={batchQty}
                  onChange={(e) => setBatchQty(parseInt(e.target.value) || 50)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#3D2B1F] mb-1">Batch Run Notes</label>
                <textarea
                  rows={2}
                  value={batchNotes}
                  onChange={(e) => setBatchNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                />
              </div>
            </div>
            <button
              onClick={async () => {
                const prod = products.find((p) => p.id === batchProductId) || products[0];
                if (!prod) return;
                await createBatch({
                  productId: prod.id,
                  productName: prod.name,
                  plannedQuantity: batchQty,
                  notes: batchNotes
                });
                onCloseBatchModal();
              }}
              className="w-full py-3 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] border border-[#D9A05B]/30 font-bold text-xs shadow-md transition-colors"
            >
              Initiate Planned Batch
            </button>
          </div>
        </div>
      )}

      {/* 5. INVENTORY TRANSACTION MODAL (RECEIVE / ISSUE / ADJUST) */}
      {inventoryModalType && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 border border-[#D9A05B]/20 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#3D2B1F]/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9A05B]">
                  Silo Stock Ledger
                </span>
                <h3 className="font-serif font-bold text-xl text-[#3D2B1F] capitalize mt-0.5">
                  {inventoryModalType === 'receive'
                    ? 'Receive Raw Delivery'
                    : inventoryModalType === 'issue'
                    ? 'Issue Stock to Floor'
                    : 'Reconcile Stock Count'}
                </h3>
              </div>
              <button onClick={onCloseInventoryModal} className="p-1 rounded-full hover:bg-[#F9E4E8] text-[#3D2B1F]/60">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#3D2B1F] mb-1">Target Material</label>
                <select
                  value={invMatId}
                  onChange={(e) => setInvMatId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                >
                  {rawMaterials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (Current: {m.quantity} {m.unit})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#3D2B1F] mb-1">
                  {inventoryModalType === 'adjust' ? 'New Reconciled Stock Quantity' : 'Quantity Amount'}
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={invQty}
                  onChange={(e) => setInvQty(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#3D2B1F] mb-1">Audit Ledger Justification</label>
                <input
                  type="text"
                  placeholder={
                    inventoryModalType === 'receive'
                      ? 'e.g. Plantation bill of lading #4492'
                      : inventoryModalType === 'issue'
                      ? 'e.g. Issued to Conching Line 2'
                      : 'e.g. End of month physical weigh-in'
                  }
                  value={invReason}
                  onChange={(e) => setInvReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-[#3D2B1F] focus:outline-none focus:border-[#D9A05B]"
                />
              </div>
            </div>
            <button
              onClick={async () => {
                const mat = rawMaterials.find((m) => m.id === invMatId);
                if (!mat) return;
                if (inventoryModalType === 'receive') {
                  await receiveStock(mat.id, invQty, invReason || 'Received from supplier');
                } else if (inventoryModalType === 'issue') {
                  if (mat.quantity < invQty) {
                    alert(`Cannot issue ${invQty} ${mat.unit}. Only ${mat.quantity} ${mat.unit} available in silo.`);
                    return;
                  }
                  await issueMaterial(mat.id, invQty, invReason || 'Dispatched to floor');
                } else if (inventoryModalType === 'adjust') {
                  await adjustStock(mat.id, invQty, invReason || 'Physical inventory reconciliation');
                }
                onCloseInventoryModal();
              }}
              className="w-full py-3 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] border border-[#D9A05B]/30 font-bold text-xs shadow-md transition-colors"
            >
              Post Transaction to Ledger
            </button>
          </div>
        </div>
      )}
    </>
  );
};
