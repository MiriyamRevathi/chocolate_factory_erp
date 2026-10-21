import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import {
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  Search,
  ArrowLeft,
  Calendar
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export const OrderTracking: React.FC = () => {
  const {
    orders,
    activeTrackingOrderId,
    setActiveTrackingOrderId,
    setCurrentView,
    currentUser
  } = useFactory();

  const customerEmail = currentUser?.email || 'customer@chocofactory.com';
  const myOrders = orders.filter(
    (o) =>
      o.customer.email.toLowerCase() === customerEmail.toLowerCase() ||
      currentUser?.role === 'Admin'
  );

  const [inputOrderId, setInputOrderId] = useState<string>(activeTrackingOrderId || myOrders[0]?.id || '');

  const selectedOrder = orders.find(
    (o) => o.id.toLowerCase() === inputOrderId.trim().toLowerCase()
  ) || myOrders[0];

  const pipelineStages = ['Placed', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered'];

  const getStageIndex = (status: string) => {
    const norm = status.toLowerCase();
    if (norm === 'cancelled') return -1;
    return pipelineStages.findIndex((s) => s.toLowerCase() === norm);
  };

  const currentStageIndex = selectedOrder ? getStageIndex(selectedOrder.orderStatus) : 0;

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EBDCD5] gap-3">
        <div>
          <button
            onClick={() => setCurrentView('customer-orders')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[#2E160E] mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Orders</span>
          </button>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E160E]">
            Shipment & Fulfillment Tracker
          </h1>
        </div>

        {/* Quick order select */}
        {myOrders.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600">Select Order:</span>
            <select
              value={selectedOrder?.id || ''}
              onChange={(e) => {
                setInputOrderId(e.target.value);
                setActiveTrackingOrderId(e.target.value);
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#EBDCD5] text-xs font-bold font-mono text-[#2E160E]"
            >
              {myOrders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.id} ({o.orderStatus})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!selectedOrder ? (
        <div className="p-10 text-center choco-card bg-white">
          <p className="text-sm font-semibold text-stone-600 mb-4">No order found with ID {inputOrderId}.</p>
          <button
            onClick={() => setCurrentView('customer-shop')}
            className="px-4 py-2 rounded-xl bg-[#2E160E] text-amber-300 text-xs font-bold"
          >
            Go to Shop
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Order Snapshot Card */}
          <div className="choco-card p-6 bg-white border border-[#EBDCD5] rounded-2xl shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EBDCD5] gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800">
                  Tracking Reference
                </span>
                <h2 className="font-mono text-xl font-bold text-[#2E160E]">{selectedOrder.id}</h2>
                <span className="text-xs text-stone-500">Order Placed: {selectedOrder.orderDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedOrder.orderStatus} />
                <span className="text-xs font-mono font-bold text-[#2E160E] px-3 py-1 bg-[#FAF5F0] rounded-xl border border-[#EBDCD5]">
                  ${Number(selectedOrder.total || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Horizontal Pipeline Tracker */}
            <div className="py-8 px-2 overflow-x-auto">
              <div className="min-w-[500px] flex items-center justify-between relative">
                {/* Connecting background line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-200 -translate-y-1/2 z-0" />
                <div
                  className="absolute top-1/2 left-0 h-1 bg-amber-600 -translate-y-1/2 z-0 transition-all duration-500"
                  style={{
                    width: `${Math.max(0, (currentStageIndex / (pipelineStages.length - 1)) * 100)}%`
                  }}
                />

                {pipelineStages.map((stage, idx) => {
                  const isDone = idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;

                  return (
                    <div key={stage} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-xs ${
                          isDone
                            ? 'bg-[#2E160E] text-amber-300 ring-4 ring-amber-100'
                            : 'bg-white text-stone-400 border-2 border-stone-200'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span
                        className={`text-xs mt-2 font-bold whitespace-nowrap ${
                          isCurrent
                            ? 'text-amber-700'
                            : isDone
                            ? 'text-[#2E160E]'
                            : 'text-stone-400'
                        }`}
                      >
                        {stage}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier & Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#EBDCD5] text-xs">
              <div className="p-3.5 rounded-xl bg-[#FFF9F6] border border-[#F5DADB] flex items-start gap-3">
                <Truck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#2E160E] block">Climate-Cold Chain Logistics</span>
                  <span className="text-stone-600 leading-relaxed block mt-0.5">
                    Insulated thermal wrapping with re-freezable cryo-packs maintains internal vault temperatures between 15°C and 18°C.
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#5C311C] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#2E160E] block">Recipient Address:</span>
                  <span className="text-stone-600 block mt-0.5">
                    {selectedOrder.customer.name} • {selectedOrder.customer.address}, {selectedOrder.customer.city}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Events Log */}
          <div className="choco-card p-6 bg-white border border-[#EBDCD5] rounded-2xl shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-[#2E160E] flex items-center gap-2 pb-2 border-b border-[#EBDCD5]">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Activity & Production Milestones</span>
            </h3>

            <div className="space-y-4 relative pl-6 border-l-2 border-amber-300 ml-2">
              {selectedOrder.timeline.map((event, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#2E160E] border-2 border-white ring-2 ring-amber-400" />
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-[#2E160E]">{event.status}</span>
                    <span className="text-[11px] font-mono text-stone-400">{event.time}</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{event.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
