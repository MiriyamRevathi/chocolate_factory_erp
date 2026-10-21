import React from 'react';
import { useFactory } from '../context/FactoryContext';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Layers,
  CheckCircle,
  Truck,
  Users,
  Building2,
  FileBarChart,
  Settings as SettingsIcon,
  ShoppingBag,
  ShoppingCart,
  Clock,
  Heart,
  UserCheck,
  ChevronRight,
  ClipboardList,
  AlertTriangle,
  History,
  X
} from 'lucide-react';
import { CocoaPodIcon, ChocolateBarIcon } from './ChocolateGraphics';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isMobileOpen,
  onCloseMobile
}) => {
  const { currentUser, currentView, setCurrentView } = useFactory();
  const open = isMobileOpen ?? isOpen ?? false;
  const handleClose = onCloseMobile ?? onClose ?? (() => {});

  if (!currentUser && !currentView.startsWith('customer-')) {
    return null;
  }

  const role = currentUser?.role || 'Customer';

  interface NavItem {
    id: string;
    label: string;
    icon: any;
    badge?: string | number;
  }

  let navItems: NavItem[] = [];

  if (role === 'Admin') {
    navItems = [
      { id: 'admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
      { id: 'admin-products', label: 'Products Catalog', icon: Package },
      { id: 'admin-materials', label: 'Raw Materials', icon: Boxes },
      { id: 'admin-production', label: 'Production Batches', icon: Layers },
      { id: 'admin-qc', label: 'Quality Control', icon: CheckCircle },
      { id: 'admin-inventory', label: 'Inventory & Stock', icon: Boxes },
      { id: 'admin-orders', label: 'Customer Orders', icon: Truck },
      { id: 'admin-employees', label: 'Employee Directory', icon: Users },
      { id: 'admin-suppliers', label: 'Suppliers Directory', icon: Building2 },
      { id: 'admin-reports', label: 'Factory Analytics', icon: FileBarChart },
      { id: 'admin-settings', label: 'System Settings', icon: SettingsIcon }
    ];
  } else if (role === 'Production Manager') {
    navItems = [
      { id: 'production-dashboard', label: 'Production Overview', icon: LayoutDashboard },
      { id: 'production-plans', label: 'Plan New Batch', icon: Layers },
      { id: 'production-batches', label: 'Active Batches', icon: Boxes },
      { id: 'production-stages', label: '9-Stage Pipeline', icon: ClipboardList },
      { id: 'production-materials', label: 'Material Demands', icon: Boxes },
      { id: 'production-reports', label: 'Output Reports', icon: FileBarChart }
    ];
  } else if (role === 'QC Manager') {
    navItems = [
      { id: 'qc-dashboard', label: 'QC Dashboard', icon: LayoutDashboard },
      { id: 'qc-inspections', label: 'Pending Inspections', icon: AlertTriangle },
      { id: 'qc-tests', label: 'Sensory & Lab Standards', icon: CheckCircle },
      { id: 'qc-approved', label: 'Approved Batches', icon: CheckCircle },
      { id: 'qc-rejected', label: 'Rejected Batches', icon: AlertTriangle },
      { id: 'qc-reports', label: 'Compliance Reports', icon: FileBarChart }
    ];
  } else if (role === 'Inventory Manager') {
    navItems = [
      { id: 'inventory-dashboard', label: 'Inventory Overview', icon: LayoutDashboard },
      { id: 'inventory-materials', label: 'Raw Cocoa & Sugar', icon: Boxes },
      { id: 'inventory-packaging', label: 'Packaging Stock', icon: Package },
      { id: 'inventory-finished', label: 'Finished Goods', icon: ChocolateBarIcon },
      { id: 'inventory-movements', label: 'Stock Movements Log', icon: History },
      { id: 'inventory-restock', label: 'Restock Requisitions', icon: AlertTriangle },
      { id: 'inventory-suppliers', label: 'Vendor Directory', icon: Building2 },
      { id: 'inventory-reports', label: 'Stock Valuation', icon: FileBarChart }
    ];
  } else {
    // Customer
    navItems = [
      { id: 'customer-shop', label: 'Chocolatier Boutique', icon: ShoppingBag },
      { id: 'customer-cart', label: 'My Chocolate Cart', icon: ShoppingCart },
      { id: 'customer-orders', label: 'Order History', icon: Clock },
      { id: 'customer-tracking', label: 'Track Shipment', icon: Truck },
      { id: 'customer-wishlist', label: 'Saved Favorites', icon: Heart },
      { id: 'customer-profile', label: 'Customer Account', icon: UserCheck }
    ];
  }

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    handleClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Dark espresso sidebar (Artistic Flair Theme) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#3D2B1F] text-[#FCF9F2] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Banner */}
        <div className="p-6 border-b border-[#D9A05B]/15 flex items-center justify-between">
          <div>
            <h1 className="text-[#D9A05B] font-serif text-2xl font-bold tracking-tight">
              COCOA<span className="text-white">CRAFT</span>
            </h1>
            <p className="text-[#F9E4E8] text-[10px] uppercase tracking-[0.2em] opacity-60 mt-0.5">
              Factory Management
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <p className="px-3 pb-2 text-[10px] uppercase tracking-[0.2em] text-[#D9A05B] font-bold">
            {role === 'Customer' ? 'Boutique Menu' : 'Factory Operations'}
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg font-medium text-xs transition-colors group ${
                  isActive
                    ? 'bg-[#D9A05B] text-[#3D2B1F] font-bold shadow-sm'
                    : 'text-[#FCF9F2] hover:bg-[#4E3829]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {isActive ? (
                    <span className="w-2 h-2 rounded-full bg-[#3D2B1F] shrink-0" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full border border-[#D9A05B] shrink-0" />
                  )}
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#3D2B1F]' : 'text-[#D9A05B]/70 group-hover:text-[#D9A05B]'
                    }`}
                  />
                  <span className={isActive ? 'opacity-100 font-bold' : 'opacity-85'}>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F9E4E8] text-[#3D2B1F]">
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'opacity-100 translate-x-0.5 text-[#3D2B1F]' : 'opacity-25 group-hover:opacity-70 text-[#FCF9F2]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Shift Manager Box (Artistic Flair) */}
        <div className="p-5 mt-auto border-t border-[#D9A05B]/15 space-y-3">
          <div className="bg-[#4E3829] p-3.5 rounded-xl border border-[#D9A05B]/20">
            <p className="text-[10px] text-[#D9A05B] uppercase font-bold tracking-widest mb-0.5">
              {role === 'Customer' ? 'Customer Account' : 'Shift Manager'}
            </p>
            <p className="text-white text-sm font-semibold truncate">
              {currentUser?.name || (role === 'Customer' ? 'Valued Guest' : 'Arthur Confection')}
            </p>
          </div>

          {role !== 'Customer' ? (
            <button
              id="sidebar-switch-to-shop"
              onClick={() => handleNavClick('customer-shop')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#4E3829] hover:bg-[#5D4433] text-[#D9A05B] text-xs font-bold transition-colors border border-[#D9A05B]/20"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#D9A05B]" />
              <span>Preview Customer Shop</span>
            </button>
          ) : (
            <button
              id="sidebar-switch-to-staff"
              onClick={() => handleNavClick('admin-dashboard')}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#4E3829] hover:bg-[#5D4433] text-[#D9A05B] text-xs font-bold transition-colors border border-[#D9A05B]/20"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#D9A05B]" />
              <span>Staff Management Portal</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
