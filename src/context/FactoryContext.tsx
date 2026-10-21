import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Product,
  RawMaterial,
  ProductionBatch,
  QualityCheck,
  Order,
  Employee,
  Supplier,
  StockMovement,
  AppNotification,
  Settings,
  CartItem,
  ProductionStage,
  QualityCheckTest
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_RAW_MATERIALS,
  INITIAL_PRODUCTION_BATCHES,
  INITIAL_QUALITY_CHECKS,
  INITIAL_ORDERS,
  INITIAL_EMPLOYEES,
  INITIAL_SUPPLIERS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS
} from '../data/seedData';

interface FactoryContextType {
  currentUser: User | null;
  currentView: string;
  accessDeniedMessage: string | null;
  products: Product[];
  rawMaterials: RawMaterial[];
  batches: ProductionBatch[];
  qualityChecks: QualityCheck[];
  orders: Order[];
  employees: Employee[];
  suppliers: Supplier[];
  stockMovements: StockMovement[];
  notifications: AppNotification[];
  settings: Settings;
  cart: CartItem[];
  wishlist: string[];
  activeTrackingOrderId: string | null;
  selectedProductId: string | null;
  inspectingBatchId: string | null;

  // Navigation
  setCurrentView: (view: string) => void;
  clearAccessDenied: () => void;
  setActiveTrackingOrderId: (id: string | null) => void;
  setSelectedProductId: (id: string | null) => void;
  setInspectingBatchId: (id: string | null) => void;

  // Authentication
  login: (usernameOrEmail: string, role?: UserRole) => boolean;
  logout: () => void;
  switchRoleDemo: (role: UserRole) => void;

  // Business Actions
  addProduct: (product: Omit<Product, 'id'>) => Promise<boolean>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;

  receiveStock: (materialId: string, quantity: number, reason: string) => Promise<boolean>;
  issueMaterial: (materialId: string, quantity: number, reason: string) => Promise<boolean>;
  adjustStock: (materialId: string, quantity: number, reason: string) => Promise<boolean>;
  addRawMaterial: (material: Omit<RawMaterial, 'id'>) => Promise<boolean>;

  createBatch: (data: {
    productId: string;
    productName: string;
    plannedQuantity: number;
    notes?: string;
  }) => Promise<boolean>;
  updateBatchStage: (batchId: string, stage: ProductionStage, notes?: string) => Promise<boolean>;
  completeBatch: (batchId: string, producedQuantity: number, notes?: string) => Promise<boolean>;

  evaluateQC: (data: {
    batchId: string;
    decision: 'Approve' | 'Reject';
    rejectionReason?: 'Temperature issue' | 'Weight issue' | 'Texture issue' | 'Packaging issue' | 'Ingredient issue' | 'Other' | null;
    tests: { [key: string]: QualityCheckTest };
    notes?: string;
  }) => Promise<boolean>;

  placeOrder: (customer: Order['customer'], paymentMethod: Order['paymentMethod'], details: Order['paymentDetails']) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, newStatus: Order['orderStatus'], note?: string) => Promise<boolean>;

  addEmployee: (emp: Omit<Employee, 'id'>) => Promise<boolean>;
  updateEmployee: (id: string, updates: Partial<Employee>) => Promise<boolean>;
  deleteEmployee: (id: string) => Promise<boolean>;

  addSupplier: (sup: Omit<Supplier, 'id'>) => Promise<boolean>;
  updateSupplier: (id: string, updates: Partial<Supplier>) => Promise<boolean>;

  updateSettings: (newSettings: Partial<Settings>) => Promise<boolean>;
  markNotificationAsRead: (id: string) => void;

  // Cart
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
}

const FactoryContext = createContext<FactoryContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'choco_factory_';

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed saving to localStorage', err);
  }
}

export const FactoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    getStored<User | null>('currentUser', null)
  );

  const [currentView, setCurrentViewRaw] = useState<string>(() =>
    getStored<string>('currentView', 'landing')
  );

  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string | null>(null);

  // Core Data
  const [products, setProducts] = useState<Product[]>(() =>
    getStored<Product[]>('products', INITIAL_PRODUCTS)
  );
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(() =>
    getStored<RawMaterial[]>('rawMaterials', INITIAL_RAW_MATERIALS)
  );
  const [batches, setBatches] = useState<ProductionBatch[]>(() =>
    getStored<ProductionBatch[]>('batches', INITIAL_PRODUCTION_BATCHES)
  );
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>(() =>
    getStored<QualityCheck[]>('qualityChecks', INITIAL_QUALITY_CHECKS)
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    getStored<Order[]>('orders', INITIAL_ORDERS)
  );
  const [employees, setEmployees] = useState<Employee[]>(() =>
    getStored<Employee[]>('employees', INITIAL_EMPLOYEES)
  );
  const [suppliers, setSuppliers] = useState<Supplier[]>(() =>
    getStored<Supplier[]>('suppliers', INITIAL_SUPPLIERS)
  );
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() =>
    getStored<StockMovement[]>('stockMovements', INITIAL_STOCK_MOVEMENTS)
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    getStored<AppNotification[]>('notifications', INITIAL_NOTIFICATIONS)
  );
  const [settings, setSettings] = useState<Settings>(() =>
    getStored<Settings>('settings', INITIAL_SETTINGS)
  );

  // UI state
  const [cart, setCart] = useState<CartItem[]>(() =>
    getStored<CartItem[]>('cart', [])
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    getStored<string[]>('wishlist', ['PROD-101', 'PROD-106'])
  );
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [inspectingBatchId, setInspectingBatchId] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => setStored('currentUser', currentUser), [currentUser]);
  useEffect(() => setStored('currentView', currentView), [currentView]);
  useEffect(() => setStored('products', products), [products]);
  useEffect(() => setStored('rawMaterials', rawMaterials), [rawMaterials]);
  useEffect(() => setStored('batches', batches), [batches]);
  useEffect(() => setStored('qualityChecks', qualityChecks), [qualityChecks]);
  useEffect(() => setStored('orders', orders), [orders]);
  useEffect(() => setStored('employees', employees), [employees]);
  useEffect(() => setStored('suppliers', suppliers), [suppliers]);
  useEffect(() => setStored('stockMovements', stockMovements), [stockMovements]);
  useEffect(() => setStored('notifications', notifications), [notifications]);
  useEffect(() => setStored('settings', settings), [settings]);
  useEffect(() => setStored('cart', cart), [cart]);
  useEffect(() => setStored('wishlist', wishlist), [wishlist]);

  // Initial load from backend API if available
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await fetch('/api/products');
        if (pRes.ok) {
          const data = await pRes.json();
          if (Array.isArray(data) && data.length) setProducts(data);
        }
        const mRes = await fetch('/api/raw-materials');
        if (mRes.ok) {
          const data = await mRes.json();
          if (Array.isArray(data) && data.length) setRawMaterials(data);
        }
        const bRes = await fetch('/api/production/batches');
        if (bRes.ok) {
          const data = await bRes.json();
          if (Array.isArray(data) && data.length) setBatches(data);
        }
        const qRes = await fetch('/api/qc/inspections');
        if (qRes.ok) {
          const data = await qRes.json();
          if (Array.isArray(data) && data.length) setQualityChecks(data);
        }
        const oRes = await fetch('/api/orders', {
          headers: {
            'x-user-role': currentUser?.role || 'Customer',
            'x-user-email': currentUser?.email || 'customer@chocofactory.com'
          }
        });
        if (oRes.ok) {
          const data = await oRes.json();
          if (Array.isArray(data) && data.length) setOrders(data);
        }
        const sRes = await fetch('/api/suppliers', {
          headers: { 'x-user-role': 'Admin' }
        });
        if (sRes.ok) {
          const data = await sRes.json();
          if (Array.isArray(data) && data.length) setSuppliers(data);
        }
        const nRes = await fetch('/api/notifications');
        if (nRes.ok) {
          const data = await nRes.json();
          if (Array.isArray(data) && data.length) setNotifications(data);
        }
      } catch (e) {
        // Backend offline or local fallback
      }
    };
    fetchData();
  }, [currentUser?.role, currentUser?.email]);

  // Role Access Verification Guard
  const setCurrentView = (view: string) => {
    // Landing and Login are accessible to anyone
    if (view === 'landing' || view === 'login') {
      setCurrentViewRaw(view);
      setAccessDeniedMessage(null);
      return;
    }

    // Customer views
    if (view.startsWith('customer-')) {
      setCurrentViewRaw(view);
      setAccessDeniedMessage(null);
      return;
    }

    // Internal Factory views require logged-in employee
    if (!currentUser) {
      setAccessDeniedMessage('Access denied. Please log in with staff credentials.');
      setCurrentViewRaw('login');
      return;
    }

    const role = currentUser.role;

    if (role === 'Customer') {
      setAccessDeniedMessage('Access denied. Customers cannot access internal factory management pages.');
      setCurrentViewRaw('customer-shop');
      return;
    }

    // Admin can access everything
    if (role === 'Admin') {
      setCurrentViewRaw(view);
      setAccessDeniedMessage(null);
      return;
    }

    // Role-specific views check
    if (view.startsWith('production-')) {
      if (role === 'Production Manager') {
        setCurrentViewRaw(view);
        setAccessDeniedMessage(null);
      } else {
        setAccessDeniedMessage('Access denied. This section is restricted to Production Managers.');
        redirectDefaultRole(role);
      }
      return;
    }

    if (view.startsWith('qc-')) {
      if (role === 'QC Manager') {
        setCurrentViewRaw(view);
        setAccessDeniedMessage(null);
      } else {
        setAccessDeniedMessage('Access denied. This section is restricted to Quality Control Managers.');
        redirectDefaultRole(role);
      }
      return;
    }

    if (view.startsWith('inventory-')) {
      if (role === 'Inventory Manager') {
        setCurrentViewRaw(view);
        setAccessDeniedMessage(null);
      } else {
        setAccessDeniedMessage('Access denied. This section is restricted to Inventory Managers.');
        redirectDefaultRole(role);
      }
      return;
    }

    if (view.startsWith('admin-')) {
      setAccessDeniedMessage('Access denied. Admin privileges required.');
      redirectDefaultRole(role);
      return;
    }

    setCurrentViewRaw(view);
    setAccessDeniedMessage(null);
  };

  const redirectDefaultRole = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        setCurrentViewRaw('admin-dashboard');
        break;
      case 'Production Manager':
        setCurrentViewRaw('production-dashboard');
        break;
      case 'QC Manager':
        setCurrentViewRaw('qc-dashboard');
        break;
      case 'Inventory Manager':
        setCurrentViewRaw('inventory-dashboard');
        break;
      case 'Customer':
        setCurrentViewRaw('customer-shop');
        break;
    }
  };

  const clearAccessDenied = () => {
    setAccessDeniedMessage(null);
  };

  // Login handler
  const login = (usernameOrEmail: string, role?: UserRole): boolean => {
    // If role is explicitly chosen
    if (role === 'Customer' || usernameOrEmail.toLowerCase().includes('customer')) {
      const custUser: User = {
        id: 'CUST-001',
        name: 'Alice Morgan',
        email: 'customer@chocofactory.com',
        role: 'Customer',
        title: 'Valued Chocolate Club Member'
      };
      setCurrentUser(custUser);
      setCurrentViewRaw('customer-shop');
      setAccessDeniedMessage(null);
      return true;
    }

    // Check employee list
    const found = employees.find(
      (e) =>
        e.email.toLowerCase() === usernameOrEmail.toLowerCase() ||
        e.name.toLowerCase() === usernameOrEmail.toLowerCase() ||
        e.role.toLowerCase() === usernameOrEmail.toLowerCase() ||
        (role && e.role === role)
    );

    if (found) {
      const user: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        department: found.department,
        title: found.department
      };
      setCurrentUser(user);
      redirectDefaultRole(found.role);
      setAccessDeniedMessage(null);
      return true;
    }

    // Fallback demo matching
    if (role) {
      const fallback: User = {
        id: `DEMO-${role.slice(0, 3).toUpperCase()}`,
        name: `${role} Demo`,
        email: `${role.toLowerCase().replace(/\s+/g, '')}@chocofactory.com`,
        role: role
      };
      setCurrentUser(fallback);
      redirectDefaultRole(role);
      setAccessDeniedMessage(null);
      return true;
    }

    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentViewRaw('landing');
    setAccessDeniedMessage(null);
  };

  const switchRoleDemo = (role: UserRole) => {
    login('', role);
  };

  // BUSINESS ACTIONS: PRODUCTS (Admin only)
  const addProduct = async (productData: Omit<Product, 'id'>): Promise<boolean> => {
    if (currentUser?.role !== 'Admin') {
      setAccessDeniedMessage('Access denied: Only Admin can add products.');
      return false;
    }

    const newProd: Product = {
      ...productData,
      id: `PROD-${(products.length + 101).toString()}`
    };

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': currentUser.role },
        body: JSON.stringify(newProd)
      });
    } catch {}

    setProducts((prev) => [newProd, ...prev]);
    return true;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    if (currentUser?.role !== 'Admin') {
      setAccessDeniedMessage('Access denied: Only Admin can update products.');
      return false;
    }

    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-role': currentUser.role },
        body: JSON.stringify(updates)
      });
    } catch {}

    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    return true;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    if (currentUser?.role !== 'Admin') {
      setAccessDeniedMessage('Access denied: Only Admin can delete products.');
      return false;
    }

    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-role': currentUser.role }
      });
    } catch {}

    setProducts((prev) => prev.filter((p) => p.id !== id));
    return true;
  };

  // BUSINESS ACTIONS: RAW MATERIALS & INVENTORY
  const receiveStock = async (materialId: string, quantity: number, reason: string): Promise<boolean> => {
    if (currentUser?.role !== 'Admin' && currentUser?.role !== 'Inventory Manager') {
      setAccessDeniedMessage('Access denied: Only Inventory Managers or Admin can receive stock.');
      return false;
    }

    const mat = rawMaterials.find((m) => m.id === materialId);
    if (!mat) return false;

    const prevQty = mat.quantity;
    const newQty = prevQty + quantity;
    const newStatus = newQty === 0 ? 'Out of Stock' : newQty <= mat.minimumStock ? 'Low Stock' : 'In Stock';

    const movement: StockMovement = {
      id: `SM-2026-${Date.now().toString().slice(-4)}`,
      materialId: mat.id,
      materialName: mat.name,
      movementType: 'Received',
      quantity,
      unit: mat.unit,
      previousStock: prevQty,
      newStock: newQty,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      reason: reason || 'Goods replenishment intake',
      performedBy: currentUser.name
    };

    try {
      await fetch('/api/inventory/movement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': currentUser.role },
        body: JSON.stringify({
          materialId,
          movementType: 'Received',
          quantity,
          reason,
          performedBy: currentUser.name
        })
      });
    } catch {}

    setRawMaterials((prev) =>
      prev.map((m) => (m.id === materialId ? { ...m, quantity: newQty, status: newStatus } : m))
    );
    setStockMovements((prev) => [movement, ...prev]);

    return true;
  };

  const issueMaterial = async (materialId: string, quantity: number, reason: string): Promise<boolean> => {
    if (currentUser?.role !== 'Admin' && currentUser?.role !== 'Inventory Manager') {
      setAccessDeniedMessage('Access denied: Only Inventory Managers or Admin can issue materials.');
      return false;
    }

    const mat = rawMaterials.find((m) => m.id === materialId);
    if (!mat || mat.quantity < quantity) {
      alert(`Insufficient stock. Current stock is ${mat?.quantity || 0} ${mat?.unit || ''}`);
      return false;
    }

    const prevQty = mat.quantity;
    const newQty = prevQty - quantity;
    const newStatus = newQty === 0 ? 'Out of Stock' : newQty <= mat.minimumStock ? 'Low Stock' : 'In Stock';

    const movement: StockMovement = {
      id: `SM-2026-${Date.now().toString().slice(-4)}`,
      materialId: mat.id,
      materialName: mat.name,
      movementType: 'Issued',
      quantity: -quantity,
      unit: mat.unit,
      previousStock: prevQty,
      newStock: newQty,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      reason: reason || 'Material issued for production floor',
      performedBy: currentUser.name
    };

    try {
      await fetch('/api/inventory/movement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': currentUser.role },
        body: JSON.stringify({
          materialId,
          movementType: 'Issued',
          quantity,
          reason,
          performedBy: currentUser.name
        })
      });
    } catch {}

    setRawMaterials((prev) =>
      prev.map((m) => (m.id === materialId ? { ...m, quantity: newQty, status: newStatus } : m))
    );
    setStockMovements((prev) => [movement, ...prev]);

    return true;
  };

  const adjustStock = async (materialId: string, quantity: number, reason: string): Promise<boolean> => {
    if (currentUser?.role !== 'Admin' && currentUser?.role !== 'Inventory Manager') {
      setAccessDeniedMessage('Access denied: Only Inventory Managers or Admin can adjust stock.');
      return false;
    }

    const mat = rawMaterials.find((m) => m.id === materialId);
    if (!mat) return false;

    const prevQty = mat.quantity;
    const newQty = Math.max(0, quantity);
    const delta = newQty - prevQty;
    const newStatus = newQty === 0 ? 'Out of Stock' : newQty <= mat.minimumStock ? 'Low Stock' : 'In Stock';

    const movement: StockMovement = {
      id: `SM-2026-${Date.now().toString().slice(-4)}`,
      materialId: mat.id,
      materialName: mat.name,
      movementType: 'Adjusted',
      quantity: delta,
      unit: mat.unit,
      previousStock: prevQty,
      newStock: newQty,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      reason: reason || 'Physical inventory audit adjustment',
      performedBy: currentUser.name
    };

    try {
      await fetch('/api/inventory/movement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': currentUser.role },
        body: JSON.stringify({
          materialId,
          movementType: 'Adjusted',
          quantity: delta,
          reason,
          performedBy: currentUser.name
        })
      });
    } catch {}

    setRawMaterials((prev) =>
      prev.map((m) => (m.id === materialId ? { ...m, quantity: newQty, status: newStatus } : m))
    );
    setStockMovements((prev) => [movement, ...prev]);

    return true;
  };

  const addRawMaterial = async (materialData: Omit<RawMaterial, 'id'>): Promise<boolean> => {
    if (currentUser?.role !== 'Admin' && currentUser?.role !== 'Inventory Manager') {
      setAccessDeniedMessage('Access denied: Only Inventory Managers or Admin can add materials.');
      return false;
    }

    const newMat: RawMaterial = {
      ...materialData,
      id: `MAT-${(rawMaterials.length + 1).toString().padStart(3, '0')}`
    };

    try {
      await fetch('/api/raw-materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': currentUser.role },
        body: JSON.stringify(newMat)
      });
    } catch {}

    setRawMaterials((prev) => [...prev, newMat]);
    return true;
  };

  // BUSINESS ACTIONS: PRODUCTION (Production Manager & Admin)
  const createBatch = async (data: {
    productId: string;
    productName: string;
    plannedQuantity: number;
    notes?: string;
  }): Promise<boolean> => {
    if (currentUser?.role !== 'Admin' && currentUser?.role !== 'Production Manager') {
      setAccessDeniedMessage('Access denied: Only Production Managers or Admin can create batches.');
      return false;
    }

    const batchId = `CH-BATCH-${(batches.length + 1).toString().padStart(3, '0')}`;

    // Estimated recipe requirements based on product
    const recipeItems = [
      { materialId: 'MAT-001', name: 'Raw Cocoa Beans (Ecuador)', amount: Math.round(data.plannedQuantity * 0.4), unit: 'kg' },
      { materialId: 'MAT-004', name: 'Deodorized Cocoa Butter', amount: Math.round(data.plannedQuantity * 0.15), unit: 'kg' },
      { materialId: 'MAT-005', name: 'Fine Caster Cane Sugar', amount: Math.round(data.plannedQuantity * 0.3), unit: 'kg' },
      { materialId: 'MAT-006', name: 'Whole Alpine Milk Powder', amount: Math.round(data.plannedQuantity * 0.15), unit: 'kg' }
    ];

    // Check materials availability
    for (const item of recipeItems) {
      const m = rawMaterials.find((mat) => mat.id === item.materialId);
      if (m && m.quantity < item.amount) {
        alert(`Cannot start batch: ${m.name} has only ${m.quantity} ${m.unit} available (requires ${item.amount} ${item.unit}). Please restock or lower quantity.`);
        return false;
      }
    }

    // Material consumption is represented through an inventory transaction!
    const newMovements: StockMovement[] = [];
    const updatedMaterials = [...rawMaterials];

    for (const item of recipeItems) {
      const idx = updatedMaterials.findIndex((m) => m.id === item.materialId);
      if (idx !== -1) {
        const prev = updatedMaterials[idx].quantity;
        const nextQty = Math.max(0, prev - item.amount);
        updatedMaterials[idx] = {
          ...updatedMaterials[idx],
          quantity: nextQty,
          status: nextQty === 0 ? 'Out of Stock' : nextQty <= updatedMaterials[idx].minimumStock ? 'Low Stock' : 'In Stock'
        };

        newMovements.push({
          id: `SM-2026-${Date.now().toString().slice(-4)}-${item.materialId}`,
          materialId: item.materialId,
          materialName: item.name,
          movementType: 'Issued',
          quantity: -item.amount,
          unit: item.unit,
          previousStock: prev,
          newStock: nextQty,
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          reason: `Consumed for Production Batch ${batchId} (${data.productName})`,
          performedBy: currentUser.name
        });
      }
    }

    const newBatch: ProductionBatch = {
      id: batchId,
      productId: data.productId,
      productName: data.productName,
      plannedQuantity: data.plannedQuantity,
      producedQuantity: 0,
      startDate: new Date().toISOString().slice(0, 10),
      expectedCompletion: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
      currentStage: 'Cocoa Preparation',
      manager: currentUser.name,
      status: 'In Production',
      notes: data.notes || 'Production plan initiated',
      recipe: recipeItems
    };

    try {
      await fetch('/api/production/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': currentUser.role },
        body: JSON.stringify({
          ...newBatch,
          recipe: recipeItems
        })
      });
    } catch {}

    setBatches((prev) => [newBatch, ...prev]);
    setRawMaterials(updatedMaterials);
    setStockMovements((prev) => [...newMovements, ...prev]);

    // Push notification
    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        type: 'info',
        targetRole: 'All',
        message: `Production Batch ${batchId} started for ${data.productName} (${data.plannedQuantity} units).`,
        read: false
      },
      ...prev
    ]);

    return true;
  };

  const updateBatchStage = async (batchId: string, stage: ProductionStage, notes?: string): Promise<boolean> => {
    if (currentUser?.role !== 'Admin' && currentUser?.role !== 'Production Manager') {
      setAccessDeniedMessage('Access denied: Only Production Managers or Admin can update stages.');
      return false;
    }

    try {
      await fetch(`/api/production/batches/${batchId}/stage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-role': currentUser.role },
        body: JSON.stringify({ stage, notes })
      });
    } catch {}

    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, currentStage: stage, notes: notes || b.notes } : b))
    );
    return true;
  };

  const completeBatch = async (batchId: string, producedQuantity: number, notes?: string): Promise<boolean> => {
    if (currentUser?.role !== 'Admin' && currentUser?.role !== 'Production Manager') {
      setAccessDeniedMessage('Access denied: Only Production Managers or Admin can complete batches.');
      return false;
    }

    const b = batches.find((item) => item.id === batchId);
    if (!b) return false;

    // Batch completion sends batch to QC
    const updatedBatch: Partial<ProductionBatch> = {
      producedQuantity: producedQuantity || b.plannedQuantity,
      currentStage: 'Packaging',
      status: 'Sent to QC',
      notes: notes || 'Production completed. Sent to Quality Control for physical & sensory inspection.'
    };

    try {
      await fetch(`/api/production/batches/${batchId}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-role': currentUser.role },
        body: JSON.stringify(updatedBatch)
      });
    } catch {}

    setBatches((prev) =>
      prev.map((item) => (item.id === batchId ? { ...item, ...updatedBatch } : item))
    );

    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        type: 'info',
        targetRole: 'Quality Control Manager',
        message: `Batch ${batchId} (${b.productName}) completed production and is awaiting QC inspection.`,
        read: false
      },
      ...prev
    ]);

    return true;
  };

  // BUSINESS ACTIONS: QUALITY CONTROL (QC Manager & Admin only, NOT Production Manager)
  const evaluateQC = async (data: {
    batchId: string;
    decision: 'Approve' | 'Reject';
    rejectionReason?: 'Temperature issue' | 'Weight issue' | 'Texture issue' | 'Packaging issue' | 'Ingredient issue' | 'Other' | null;
    tests: { [key: string]: QualityCheckTest };
    notes?: string;
  }): Promise<boolean> => {
    // Crucial business rule: A Production Manager cannot approve their own production batch
    if (currentUser?.role === 'Production Manager') {
      setAccessDeniedMessage('Access denied: A Production Manager is strictly forbidden from approving or rejecting QC inspections.');
      return false;
    }

    if (currentUser?.role !== 'Admin' && currentUser?.role !== 'QC Manager') {
      setAccessDeniedMessage('Access denied: Only Quality Control Managers or Admin can evaluate batches.');
      return false;
    }

    if (data.decision === 'Reject' && !data.rejectionReason) {
      alert('A rejection reason is required when rejecting a production batch.');
      return false;
    }

    const batch = batches.find((b) => b.id === data.batchId);
    if (!batch) return false;

    const isApproved = data.decision === 'Approve';
    const status = isApproved ? 'Approved' : 'Rejected';
    const overallResult = isApproved ? 'Pass' : 'Fail';

    const qcRecord: QualityCheck = {
      id: `QC-2026-${Date.now().toString().slice(-4)}`,
      batchId: data.batchId,
      productName: batch.productName,
      inspector: currentUser.name,
      date: new Date().toISOString().slice(0, 10),
      status,
      overallResult,
      rejectionReason: isApproved ? null : data.rejectionReason,
      tests: data.tests,
      notes: data.notes || (isApproved ? 'All quality and sensory tests passed.' : `Batch rejected: ${data.rejectionReason}`)
    };

    try {
      await fetch('/api/qc/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': currentUser.role },
        body: JSON.stringify({
          batchId: data.batchId,
          inspector: currentUser.name,
          decision: data.decision,
          rejectionReason: data.rejectionReason,
          tests: data.tests,
          notes: data.notes
        })
      });
    } catch {}

    // Update batch status
    setBatches((prev) =>
      prev.map((b) => (b.id === data.batchId ? { ...b, status } : b))
    );
    setQualityChecks((prev) => [qcRecord, ...prev]);

    if (isApproved) {
      // Connect to finished goods inventory:
      // "A batch must be approved by QC before it becomes available as approved finished stock"
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === batch.productId || p.name === batch.productName) {
            const newStock = p.stock + batch.producedQuantity;
            return {
              ...p,
              stock: newStock,
              status: p.status === 'Out of Stock' && newStock > 0 ? 'Active' : p.status
            };
          }
          return p;
        })
      );

      // Log movement to stock movements
      setStockMovements((prev) => [
        {
          id: `SM-2026-${Date.now().toString().slice(-4)}`,
          materialId: batch.productId,
          materialName: batch.productName,
          movementType: 'Finished Goods Stocked',
          quantity: batch.producedQuantity,
          unit: 'units',
          previousStock: 0,
          newStock: batch.producedQuantity,
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          reason: `QC Approved batch ${batch.id} stocked into finished warehouse`,
          performedBy: currentUser.name
        },
        ...prev
      ]);

      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          type: 'success',
          targetRole: 'All',
          message: `Batch ${batch.id} (${batch.productName}) APPROVED by QC. ${batch.producedQuantity} units added to sellable stock.`,
          read: false
        },
        ...prev
      ]);
    } else {
      // Rejected batches must NOT become sellable finished stock
      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          type: 'danger',
          targetRole: 'Production Manager',
          message: `Batch ${batch.id} (${batch.productName}) was REJECTED by QC due to: ${data.rejectionReason}. Rework needed.`,
          read: false
        },
        ...prev
      ]);
    }

    return true;
  };

  // BUSINESS ACTIONS: ORDERS & CHECKOUT
  const placeOrder = async (
    customer: Order['customer'],
    paymentMethod: Order['paymentMethod'],
    details: Order['paymentDetails']
  ): Promise<Order | null> => {
    if (cart.length === 0) return null;

    let subtotal = 0;
    let totalQty = 0;
    const items = cart.map((c) => {
      const itemSub = c.product.price * c.quantity;
      subtotal += itemSub;
      totalQty += c.quantity;
      return {
        productId: c.product.id,
        name: c.product.name,
        price: c.product.price,
        quantity: c.quantity,
        subtotal: itemSub
      };
    });

    const fee = subtotal >= settings.freeShippingThreshold ? 0 : settings.standardShippingFee;
    const total = subtotal + fee;
    const orderId = `ORD-2026-${(orders.length + 1001).toString()}`;
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    // Check inventory availability
    let needsProduction = false;
    const updatedProducts = [...products];
    const newMovements: StockMovement[] = [];

    for (const item of items) {
      const pIdx = updatedProducts.findIndex((p) => p.id === item.productId);
      if (pIdx !== -1) {
        const prev = updatedProducts[pIdx].stock;
        if (prev < item.quantity) {
          needsProduction = true;
        }
        const nextStock = Math.max(0, prev - item.quantity);
        updatedProducts[pIdx] = {
          ...updatedProducts[pIdx],
          stock: nextStock,
          status: nextStock === 0 ? 'Out of Stock' : updatedProducts[pIdx].status
        };

        newMovements.push({
          id: `SM-2026-${Date.now().toString().slice(-4)}-${item.productId}`,
          materialId: item.productId,
          materialName: item.name,
          movementType: 'Order Fulfillment',
          quantity: -item.quantity,
          unit: 'units',
          previousStock: prev,
          newStock: nextStock,
          date: nowStr,
          reason: `Customer order ${orderId}`,
          performedBy: 'Customer E-Commerce'
        });
      }
    }

    const newOrder: Order = {
      id: orderId,
      orderDate: nowStr,
      customer,
      items,
      totalQuantity: totalQty,
      subtotal: Number(subtotal.toFixed(2)),
      deliveryFee: fee,
      total: Number(total.toFixed(2)),
      paymentMethod,
      paymentDetails: details,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      orderStatus: 'Placed',
      timeline: [
        { status: 'Placed', time: nowStr, note: 'Order placed online through Customer Shop' },
        { status: 'Confirmed', time: nowStr, note: 'Inventory verified in Finished Goods' }
      ]
    };

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'Customer' },
        body: JSON.stringify(newOrder)
      });
    } catch {}

    setProducts(updatedProducts);
    setStockMovements((prev) => [...newMovements, ...prev]);
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setActiveTrackingOrderId(orderId);

    // Push notifications
    if (needsProduction) {
      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now().toString().slice(-4)}`,
          timestamp: nowStr,
          type: 'warning',
          targetRole: 'Production Manager',
          message: `Order ${orderId} received with items exceeding current stock. New production batch needed!`,
          read: false
        },
        ...prev
      ]);
    } else {
      setNotifications((prev) => [
        {
          id: `NOTIF-${Date.now().toString().slice(-4)}`,
          timestamp: nowStr,
          type: 'success',
          targetRole: 'Inventory Manager',
          message: `New Customer Order ${orderId} confirmed ($${total.toFixed(2)}). Ready for packing.`,
          read: false
        },
        ...prev
      ]);
    }

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['orderStatus'], note?: string): Promise<boolean> => {
    if (currentUser?.role !== 'Admin' && currentUser?.role !== 'Inventory Manager') {
      setAccessDeniedMessage('Access denied: Only Inventory Managers or Admin can update order statuses.');
      return false;
    }

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-role': currentUser.role },
        body: JSON.stringify({ status: newStatus, note })
      });
    } catch {}

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedTimeline = [
            ...o.timeline,
            { status: newStatus, time: nowStr, note: note || `Order updated to ${newStatus}` }
          ];
          return {
            ...o,
            orderStatus: newStatus,
            paymentStatus: newStatus === 'Delivered' && o.paymentMethod === 'Cash on Delivery' ? 'Paid' : o.paymentStatus,
            timeline: updatedTimeline
          };
        }
        return o;
      })
    );

    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        timestamp: nowStr,
        type: 'info',
        targetRole: 'Customer',
        message: `Order ${orderId} status updated to: ${newStatus}.`,
        read: false
      },
      ...prev
    ]);

    return true;
  };

  // BUSINESS ACTIONS: EMPLOYEES (Admin only)
  const addEmployee = async (empData: Omit<Employee, 'id'>): Promise<boolean> => {
    if (currentUser?.role !== 'Admin') {
      setAccessDeniedMessage('Access denied: Only Admin can add employees.');
      return false;
    }

    const newEmp: Employee = {
      ...empData,
      id: `EMP-${(employees.length + 1).toString().padStart(3, '0')}`
    };

    try {
      await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': currentUser.role },
        body: JSON.stringify(newEmp)
      });
    } catch {}

    setEmployees((prev) => [...prev, newEmp]);
    return true;
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>): Promise<boolean> => {
    if (currentUser?.role !== 'Admin') {
      setAccessDeniedMessage('Access denied: Only Admin can update employees.');
      return false;
    }

    try {
      await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-role': currentUser.role },
        body: JSON.stringify(updates)
      });
    } catch {}

    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    return true;
  };

  const deleteEmployee = async (id: string): Promise<boolean> => {
    if (currentUser?.role !== 'Admin') {
      setAccessDeniedMessage('Access denied: Only Admin can delete employees.');
      return false;
    }

    try {
      await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-role': currentUser.role }
      });
    } catch {}

    setEmployees((prev) => prev.filter((e) => e.id !== id));
    return true;
  };

  // BUSINESS ACTIONS: SUPPLIERS (Admin & Inventory)
  const addSupplier = async (supData: Omit<Supplier, 'id'>): Promise<boolean> => {
    if (currentUser?.role !== 'Admin' && currentUser?.role !== 'Inventory Manager') {
      setAccessDeniedMessage('Access denied: Insufficient privileges.');
      return false;
    }

    const newSup: Supplier = {
      ...supData,
      id: `SUP-${(suppliers.length + 1).toString().padStart(2, '0')}`
    };

    try {
      await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': currentUser.role },
        body: JSON.stringify(newSup)
      });
    } catch {}

    setSuppliers((prev) => [...prev, newSup]);
    return true;
  };

  const updateSupplier = async (id: string, updates: Partial<Supplier>): Promise<boolean> => {
    if (currentUser?.role !== 'Admin' && currentUser?.role !== 'Inventory Manager') {
      setAccessDeniedMessage('Access denied: Insufficient privileges.');
      return false;
    }

    try {
      await fetch(`/api/suppliers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-role': currentUser.role },
        body: JSON.stringify(updates)
      });
    } catch {}

    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    return true;
  };

  // SETTINGS (Admin only)
  const updateSettings = async (newSettings: Partial<Settings>): Promise<boolean> => {
    if (currentUser?.role !== 'Admin') {
      setAccessDeniedMessage('Access denied: Only Admin can modify factory settings.');
      return false;
    }

    const merged = { ...settings, ...newSettings };
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-role': currentUser.role },
        body: JSON.stringify(merged)
      });
    } catch {}

    setSettings(merged);
    return true;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
    } catch {}
  };

  // CART & WISHLIST
  const addToCart = (product: Product, quantity = 1) => {
    if (product.status === 'Inactive' || product.status === 'Out of Stock') {
      alert(`${product.name} is currently ${product.status.toLowerCase()} and cannot be added to cart.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  return (
    <FactoryContext.Provider
      value={{
        currentUser,
        currentView,
        accessDeniedMessage,
        products,
        rawMaterials,
        batches,
        qualityChecks,
        orders,
        employees,
        suppliers,
        stockMovements,
        notifications,
        settings,
        cart,
        wishlist,
        activeTrackingOrderId,
        selectedProductId,
        inspectingBatchId,

        setCurrentView,
        clearAccessDenied,
        setActiveTrackingOrderId,
        setSelectedProductId,
        setInspectingBatchId,

        login,
        logout,
        switchRoleDemo,

        addProduct,
        updateProduct,
        deleteProduct,

        receiveStock,
        issueMaterial,
        adjustStock,
        addRawMaterial,

        createBatch,
        updateBatchStage,
        completeBatch,

        evaluateQC,

        placeOrder,
        updateOrderStatus,

        addEmployee,
        updateEmployee,
        deleteEmployee,

        addSupplier,
        updateSupplier,

        updateSettings,
        markNotificationAsRead,

        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist
      }}
    >
      {children}
    </FactoryContext.Provider>
  );
};

export const useFactory = () => {
  const context = useContext(FactoryContext);
  if (!context) {
    throw new Error('useFactory must be used within a FactoryProvider');
  }
  return context;
};
