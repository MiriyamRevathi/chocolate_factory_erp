import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import { UserRole } from '../types';
import {
  Bell,
  ShoppingCart,
  Heart,
  LogOut,
  LogIn,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  Shield,
  Layers,
  CheckCircle2,
  PackageCheck,
  Store
} from 'lucide-react';
import { CocoaPodIcon } from './ChocolateGraphics';

export const Header: React.FC<{
  onToggleSidebar?: () => void;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}> = ({ onToggleSidebar, onToggleMobileMenu }) => {
  const toggleSidebar = onToggleSidebar || onToggleMobileMenu;
  const {
    currentUser,
    currentView,
    setCurrentView,
    logout,
    switchRoleDemo,
    cart,
    wishlist,
    notifications,
    markNotificationAsRead
  } = useFactory();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const roles: { role: UserRole; label: string; icon: any; color: string }[] = [
    { role: 'Admin', label: 'Admin (Full Access)', icon: Shield, color: 'text-[#D9A05B] bg-[#3D2B1F]' },
    { role: 'Production Manager', label: 'Production Manager', icon: Layers, color: 'text-amber-800 bg-[#F9E4E8]' },
    { role: 'QC Manager', label: 'Quality Control Manager', icon: CheckCircle2, color: 'text-emerald-800 bg-emerald-50' },
    { role: 'Inventory Manager', label: 'Inventory Manager', icon: PackageCheck, color: 'text-stone-800 bg-stone-100' },
    { role: 'Customer', label: 'Customer (Online Shop)', icon: Store, color: 'text-[#3D2B1F] bg-[#F9E4E8]' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-[#D9A05B]/15 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
      {/* Brand & Mobile Menu Button */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-sidebar-toggle"
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-[#3D2B1F] hover:bg-[#F9E4E8] lg:hidden transition-colors border border-[#D9A05B]/20"
          title="Toggle Navigation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <button
          onClick={() => setCurrentView(currentUser ? (currentUser.role === 'Customer' ? 'customer-shop' : `${currentUser.role.toLowerCase().split(' ')[0]}-dashboard`) : 'landing')}
          className="flex items-center gap-2.5 group text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-[#3D2B1F] flex items-center justify-center text-[#D9A05B] shadow-sm group-hover:scale-105 transition-transform">
            <CocoaPodIcon size={24} />
          </div>
          <div>
            <span className="block font-serif text-lg font-bold text-[#3D2B1F] tracking-tight leading-tight">
              COCOA<span className="text-[#D9A05B]">CRAFT</span>
            </span>
            <span className="block text-[10px] font-semibold text-[#3D2B1F]/60 uppercase tracking-[0.2em] leading-none mt-0.5">
              Artisanal Confectionery
            </span>
          </div>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Switcher Demo Dropdown */}
        <div className="relative">
          <button
            id="demo-role-switcher-btn"
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowNotifMenu(false);
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#D9A05B]/30 text-xs font-semibold text-[#3D2B1F] hover:bg-[#F9E4E8]/60 transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D9A05B]" />
            <span className="hidden sm:inline text-[#3D2B1F]/60">Role:</span>
            <span className="font-bold text-[#3D2B1F]">
              {currentUser ? currentUser.role : 'Public Visitor'}
            </span>
            <ChevronDown className="w-3 h-3 opacity-60 text-[#3D2B1F]" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#D9A05B]/20 p-2 z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#D9A05B] border-b border-stone-100">
                Switch Role (Instant Demo)
              </div>
              <div className="mt-1 space-y-1">
                {roles.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentUser?.role === item.role;
                  return (
                    <button
                      key={item.role}
                      onClick={() => {
                        switchRoleDemo(item.role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                        isActive
                          ? 'bg-[#3D2B1F] text-[#D9A05B] font-bold'
                          : 'text-[#3D2B1F] hover:bg-[#F9E4E8]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#D9A05B]' : 'text-[#3D2B1F]/70'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Wishlist Button (Customer only) */}
        {(!currentUser || currentUser.role === 'Customer') && (
          <button
            id="header-wishlist-btn"
            onClick={() => setCurrentView('customer-wishlist')}
            className={`p-2 rounded-xl transition-colors relative border ${
              currentView === 'customer-wishlist'
                ? 'bg-[#F9E4E8] text-[#3D2B1F] border-[#D9A05B]/40'
                : 'text-[#3D2B1F] border-transparent hover:bg-[#F9E4E8]/60'
            }`}
            title="Wishlist"
          >
            <Heart className="w-5 h-5 text-[#3D2B1F]" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D9A05B] text-white text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>
        )}

        {/* Cart Button (Customer only) */}
        {(!currentUser || currentUser.role === 'Customer') && (
          <button
            id="header-cart-btn"
            onClick={() => setCurrentView('customer-cart')}
            className={`p-2 rounded-xl transition-colors relative border ${
              currentView === 'customer-cart'
                ? 'bg-[#3D2B1F] text-[#D9A05B] border-[#D9A05B]/40'
                : 'text-[#3D2B1F] border-transparent hover:bg-[#F9E4E8]/60'
            }`}
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D9A05B] text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        )}

        {/* Notifications Popover */}
        <div className="relative">
          <button
            id="header-notifications-btn"
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowRoleMenu(false);
            }}
            className="p-2 rounded-xl text-[#3D2B1F] hover:bg-[#F9E4E8]/60 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#D9A05B] ring-2 ring-white" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#D9A05B]/20 p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#D9A05B]/15">
                <span className="font-serif font-bold text-sm text-[#3D2B1F]">Factory Notifications</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3D2B1F] bg-[#F9E4E8] px-2.5 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#D9A05B]/10 mt-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-stone-500 py-4 text-center">No notifications yet.</p>
                ) : (
                  notifications.slice(0, 8).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-2.5 rounded-xl cursor-pointer transition-colors text-left ${
                        notif.read ? 'opacity-70 hover:bg-stone-50' : 'bg-[#F9E4E8]/40 hover:bg-[#F9E4E8]/80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-[#D9A05B] uppercase tracking-wide">{notif.targetRole}</span>
                        <span className="text-stone-400 text-[10px]">{notif.timestamp.slice(5)}</span>
                      </div>
                      <p className="text-xs text-[#3D2B1F] leading-relaxed">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile / Auth Action */}
        {currentUser ? (
          <div className="flex items-center gap-2 pl-2 border-l border-[#D9A05B]/20">
            <div className="w-9 h-9 rounded-full bg-[#3D2B1F] flex items-center justify-center text-[#D9A05B] font-serif font-bold text-sm shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-[#3D2B1F] leading-tight">{currentUser.name}</span>
              <span className="text-[10px] font-semibold text-[#D9A05B] uppercase tracking-wider leading-none">{currentUser.role}</span>
            </div>
            <button
              id="logout-btn"
              onClick={logout}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#D9A05B]/25 text-xs font-semibold text-[#3D2B1F] hover:bg-[#F9E4E8] transition-colors shadow-2xs ml-1"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 text-[#D9A05B]" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <button
            id="header-login-btn"
            onClick={() => setCurrentView('login')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3D2B1F] text-[#D9A05B] hover:bg-[#4E3829] text-xs font-bold transition-all shadow-xs border border-[#D9A05B]/30"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Staff / Customer Login</span>
          </button>
        )}
      </div>
    </header>
  );
};
