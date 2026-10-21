import React, { useState } from 'react';
import { FactoryProvider, useFactory } from './context/FactoryContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { NotificationBanner } from './components/NotificationBanner';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { CustomerShop } from './pages/CustomerShop';
import { CustomerCart } from './pages/CustomerCart';
import { CustomerCheckout } from './pages/CustomerCheckout';
import { CustomerOrders } from './pages/CustomerOrders';
import { OrderTracking } from './pages/OrderTracking';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProductionDashboard } from './pages/ProductionDashboard';
import { QCDashboard } from './pages/QCDashboard';
import { InventoryDashboard } from './pages/InventoryDashboard';

const FactoryAppContent: React.FC = () => {
  const { currentView, currentUser } = useFactory();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Full-page standalone views
  if (currentView === 'landing') {
    return <LandingPage />;
  }

  if (currentView === 'login') {
    return <LoginPage />;
  }

  const isCustomerView = currentView.startsWith('customer-');
  const isInternalStaff = currentUser && currentUser.role !== 'Customer';

  const renderActiveView = () => {
    switch (currentView) {
      // Customer Routes
      case 'customer-shop':
        return <CustomerShop />;
      case 'customer-cart':
        return <CustomerCart />;
      case 'customer-checkout':
        return <CustomerCheckout />;
      case 'customer-orders':
        return <CustomerOrders />;
      case 'customer-tracking':
        return <OrderTracking />;

      // Production Manager Routes
      case 'production-overview':
      case 'production-plans':
      case 'production-batches':
      case 'production-stages':
        return <ProductionDashboard />;

      // QC Manager Routes
      case 'qc-overview':
      case 'qc-pending':
      case 'qc-approved':
      case 'qc-rejected':
      case 'qc-checklist':
        return <QCDashboard />;

      // Inventory Manager Routes
      case 'inventory-overview':
      case 'inventory-raw':
      case 'inventory-packaging':
      case 'inventory-finished':
      case 'inventory-movements':
      case 'inventory-restock':
        return <InventoryDashboard />;

      // Admin Routes (and default fallback for internal)
      case 'admin-dashboard':
      case 'admin-products':
      case 'admin-materials':
      case 'admin-batches':
      case 'admin-production':
      case 'admin-qc':
      case 'admin-inventory':
      case 'admin-orders':
      case 'admin-employees':
      case 'admin-suppliers':
      case 'admin-reports':
      case 'admin-settings':
        return <AdminDashboard />;
      default:
        if (currentUser?.role === 'Production Manager') {
          return <ProductionDashboard />;
        }
        if (currentUser?.role === 'QC Manager') {
          return <QCDashboard />;
        }
        if (currentUser?.role === 'Inventory Manager') {
          return <InventoryDashboard />;
        }
        if (currentUser?.role === 'Customer') {
          return <CustomerShop />;
        }
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9E4E8] text-[#2D1E16] selection:bg-[#D9A05B]/30 selection:text-[#3D2B1F]">
      {/* Top Application Navigation */}
      <Header
        onToggleSidebar={() => setMobileMenuOpen(!mobileMenuOpen)}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMobileMenuOpen={mobileMenuOpen}
      />

      {/* Access Denied and Alert Banners */}
      <NotificationBanner />

      {/* Main Body Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Render Sidebar only for internal staff views */}
        {isInternalStaff && !isCustomerView && (
          <Sidebar
            isMobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-x-hidden min-h-[calc(100vh-4rem)]">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <FactoryProvider>
      <FactoryAppContent />
    </FactoryProvider>
  );
}
