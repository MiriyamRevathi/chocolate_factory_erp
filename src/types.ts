export type UserRole = 'Admin' | 'Production Manager' | 'QC Manager' | 'Inventory Manager' | 'Customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  title?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  weight: string;
  ingredients: string;
  allergens: string;
  nutrition: {
    calories: string;
    fat: string;
    saturatedFat: string;
    carbs: string;
    sugar: string;
    protein: string;
  };
  stock: number;
  status: 'Active' | 'Inactive' | 'Out of Stock';
  rating: number;
  color?: string;
  badge?: string;
}

export interface RawMaterial {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  supplier: string;
  batchNumber: string;
  expiryDate: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expiring Soon';
  costPerUnit?: number;
}

export type ProductionStage =
  | 'Cocoa Preparation'
  | 'Roasting'
  | 'Grinding'
  | 'Mixing'
  | 'Conching'
  | 'Tempering'
  | 'Moulding'
  | 'Cooling'
  | 'Packaging';

export interface RecipeItem {
  materialId: string;
  name: string;
  amount: number;
  unit: string;
}

export interface ProductionBatch {
  id: string;
  productId: string;
  productName: string;
  plannedQuantity: number;
  producedQuantity: number;
  startDate: string;
  expectedCompletion: string;
  currentStage: ProductionStage;
  manager: string;
  status: 'Planned' | 'In Production' | 'Completed' | 'Sent to QC' | 'Approved' | 'Rejected';
  notes: string;
  recipe?: RecipeItem[];
}

export type Batch = ProductionBatch;

export interface QualityCheckTest {
  status: 'Pass' | 'Fail';
  value: string;
  notes: string;
}

export type RejectionReason =
  | 'Temperature issue'
  | 'Weight issue'
  | 'Texture issue'
  | 'Packaging issue'
  | 'Ingredient issue'
  | 'Other';

export interface QualityCheck {
  id: string;
  batchId: string;
  productName: string;
  inspector: string;
  date: string;
  status: 'Approved' | 'Rejected';
  overallResult: 'Pass' | 'Fail';
  rejectionReason?: RejectionReason | null;
  tests: {
    appearance?: QualityCheckTest;
    texture?: QualityCheckTest;
    weight?: QualityCheckTest;
    temperature?: QualityCheckTest;
    moisture?: QualityCheckTest;
    packaging?: QualityCheckTest;
    taste?: QualityCheckTest;
    [key: string]: QualityCheckTest | undefined;
  };
  notes: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderTimelineStep {
  status: string;
  time: string;
  note: string;
}

export type OrderStatus =
  | 'Placed'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  orderDate: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  items: OrderItem[];
  totalQuantity: number;
  subtotal: number;
  deliveryFee: number;
  shippingFee?: number;
  tax?: number;
  total: number;
  paymentMethod: 'Demo Card' | 'Cash on Delivery';
  paymentDetails: {
    cardholderName: string;
    cardType: string;
    reference: string;
  };
  paymentStatus: 'Paid' | 'Pending';
  orderStatus: OrderStatus;
  timeline: OrderTimelineStep[];
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  role: UserRole;
  email: string;
  phone: string;
  joiningDate: string;
  status: 'Active' | 'On Leave';
  password?: string;
}

export interface Supplier {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  materialsSupplied: string[];
  status: 'Active' | 'Preferred' | 'Under Review';
  leadTimeDays?: number;
  rating?: number;
}

export interface StockMovement {
  id: string;
  materialId: string;
  materialName: string;
  movementType: 'Received' | 'Issued' | 'Adjusted' | 'Finished Goods Stocked' | 'Order Fulfillment';
  quantity: number;
  unit: string;
  previousStock: number;
  newStock: number;
  date: string;
  reason: string;
  performedBy: string;
}

export interface AppNotification {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  targetRole: string;
  message: string;
  read: boolean;
}

export interface Settings {
  factoryName: string;
  facilityCode: string;
  currency: string;
  currencyCode: string;
  standardShippingFee: number;
  freeShippingThreshold: number;
  qcMaxMoisturePercent: number;
  temperingTargetTempC: number;
  conchingDurationHours: number;
  defaultTaxRate: number;
  address: string;
  supportEmail: string;
  supportPhone: string;
  autoReserveStock: boolean;
  operatingMode: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
