import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import { UserRole } from '../types';
import {
  Shield,
  Layers,
  CheckCircle2,
  PackageCheck,
  Store,
  LogIn,
  AlertCircle,
  KeyRound,
  Mail,
  Lock,
  ArrowRight
} from 'lucide-react';
import { CocoaPodIcon } from '../components/ChocolateGraphics';

export const LoginPage: React.FC = () => {
  const { login, switchRoleDemo, accessDeniedMessage, setCurrentView } = useFactory();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const ok = login(identifier);
    if (!ok) {
      setError('Invalid credentials. You can use the Quick Demo buttons below to log into any role immediately.');
    }
  };

  const demoRoles: { role: UserRole; title: string; email: string; icon: any; color: string; desc: string }[] = [
    {
      role: 'Admin',
      title: 'Factory Administrator',
      email: 'admin@chocofactory.com',
      icon: Shield,
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      desc: 'Full system control, employee directory, suppliers, settings & analytics'
    },
    {
      role: 'Production Manager',
      title: 'Production Manager',
      email: 'production@chocofactory.com',
      icon: Layers,
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      desc: 'Manage 9-stage pipeline, create production batches & send to QC'
    },
    {
      role: 'QC Manager',
      title: 'Quality Control Manager',
      email: 'qc@chocofactory.com',
      icon: CheckCircle2,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      desc: 'Conduct physical/sensory inspections, approve or reject finished batches'
    },
    {
      role: 'Inventory Manager',
      title: 'Inventory & Supply Manager',
      email: 'inventory@chocofactory.com',
      icon: PackageCheck,
      color: 'bg-stone-200 text-stone-800 border-stone-300',
      desc: 'Control raw material silos, receive stock, issue ingredients & restock'
    },
    {
      role: 'Customer',
      title: 'Online Boutique Customer',
      email: 'customer@chocofactory.com',
      icon: Store,
      color: 'bg-rose-100 text-rose-800 border-rose-300',
      desc: 'Browse chocolates, cart checkout, order tracking & personal history'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF5F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Cocoa Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-5 pointer-events-none text-[#2E160E]">
        <CocoaPodIcon size={400} />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <button
          onClick={() => setCurrentView('landing')}
          className="inline-flex items-center gap-2 mb-4 text-xs font-semibold text-[#5C311C] hover:text-[#2E160E] transition-colors"
        >
          <span>← Back to Public Website</span>
        </button>

        <div className="w-14 h-14 rounded-2xl bg-[#2E160E] flex items-center justify-center text-amber-300 mx-auto shadow-xl mb-3">
          <CocoaPodIcon size={32} />
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#22120A] tracking-tight">
          Chocolate Factory Management System
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-stone-600">
          Sign in to access factory operations, quality control, or your customer account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0 relative z-10">
        <div className="choco-card p-6 sm:p-8 bg-white border border-[#EBDCD5] shadow-xl rounded-2xl">
          {accessDeniedMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-[#FFF0F3] border border-[#FCD6DF] text-[#9E2A2B] text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{accessDeniedMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2E160E] mb-1">
                Username or Staff Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-username-input"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@chocofactory.com or admin"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] text-xs text-[#2E160E] placeholder-stone-400 focus:outline-hidden focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2E160E] mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] text-xs text-[#2E160E] placeholder-stone-400 focus:outline-hidden focus:border-amber-600"
                />
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="w-full py-3 rounded-xl bg-[#2E160E] hover:bg-[#4A2818] text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Factory System</span>
            </button>
          </form>

          {/* Quick Demo Role Section */}
          <div className="mt-8 pt-6 border-t border-[#EBDCD5]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                Instant Demo Access (One Click)
              </span>
              <span className="text-[10px] text-stone-500 font-mono">No password required</span>
            </div>

            <div className="space-y-2.5">
              {demoRoles.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.role}
                    id={`demo-login-${item.role.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => switchRoleDemo(item.role)}
                    className="w-full p-3 rounded-xl border border-[#EFE4DC] hover:border-amber-500 bg-[#FDFBF7] hover:bg-[#FFF8F3] text-left transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#2E160E]">{item.title}</span>
                          <span className="text-[10px] font-mono text-stone-400">{item.email}</span>
                        </div>
                        <p className="text-[11px] text-stone-600 line-clamp-1">{item.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
