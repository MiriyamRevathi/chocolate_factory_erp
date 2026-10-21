import React from 'react';
import { useFactory } from '../context/FactoryContext';
import {
  Clock,
  Truck,
  Eye,
  CheckCircle,
  Package,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export const CustomerOrders: React.FC = () => {
  const { orders, currentUser, setActiveTrackingOrderId, setCurrentView } = useFactory();

  // "Customer can only view their own orders"
  const customerEmail = currentUser?.email || 'customer@chocofactory.com';
  const customerOrders = orders.filter(
    (o) =>
      o.customer.email.toLowerCase() === customerEmail.toLowerCase() ||
      currentUser?.role === 'Admin' // Admin can view all
  );

  const handleTrack = (orderId: string) => {
    setActiveTrackingOrderId(orderId);
    setCurrentView('customer-tracking');
  };

  if (customerOrders.length === 0) {
    return (
      <div className="w-full px-3 sm:px-5 py-5">
        <div className="choco-card p-12 bg-white border border-[#EBDCD5] text-center rounded-2xl shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF5F0] text-[#5C311C] flex items-center justify-center mx-auto mb-4 border border-[#EBDCD5]">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2E160E] mb-2">
            No Orders Placed Yet
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-6">
            You haven't placed any chocolate orders under {customerEmail}. Explore our boutique to sample freshly conched single-origin selections.
          </p>
          <button
            onClick={() => setCurrentView('customer-shop')}
            className="px-6 py-3 rounded-xl bg-[#2E160E] hover:bg-[#4A2818] text-amber-300 font-bold text-xs inline-flex items-center gap-2 transition-colors shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Visit Chocolate Shop</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EBDCD5] gap-2">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E160E]">
            My Chocolate Orders
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Viewing purchases associated with <span className="font-bold text-[#2E160E]">{customerEmail}</span>
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FFF0F3] border border-[#F5DADB] text-amber-800 self-start sm:self-auto">
          {customerOrders.length} {customerOrders.length === 1 ? 'Order' : 'Orders'} Recorded
        </span>
      </div>

      <div className="space-y-4">
        {customerOrders.map((order) => (
          <div
            key={order.id}
            className="choco-card p-5 sm:p-6 bg-white border border-[#EBDCD5] rounded-2xl shadow-xs space-y-4 hover:border-amber-400 transition-colors"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EBDCD5] gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF5F0] text-amber-800 border border-[#EBDCD5] flex items-center justify-center font-bold font-mono text-xs">
                  #
                </div>
                <div>
                  <span className="font-mono font-bold text-sm text-[#2E160E]">{order.id}</span>
                  <span className="text-xs text-stone-500 block">Placed on {order.orderDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={order.orderStatus} />
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    order.paymentStatus === 'Paid'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  Payment: {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Items Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 bg-[#FAF5F0] p-3 rounded-xl border border-[#EBDCD5]">
                <span className="font-bold text-[#2E160E] block mb-1">Purchased Confections:</span>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-stone-600">
                    <span>
                      {item.quantity}× {item.name || (item as any).productName || 'Handcrafted Chocolate'}
                    </span>
                    <span className="font-mono font-semibold">${Number(item.subtotal ?? (Number(item.price || (item as any).unitPrice || 0) * (item.quantity || 1))).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-white border border-[#EFE4DC] flex flex-col justify-between">
                <div>
                  <span className="font-bold text-[#2E160E] block mb-1">Delivery Destination:</span>
                  <p className="text-stone-600 leading-relaxed">
                    {order.customer?.name || 'Valued Customer'}, {order.customer?.address || ''}, {order.customer?.city || ''} {order.customer?.postalCode || ''}
                  </p>
                  <span className="text-[11px] text-stone-500 font-mono mt-1 block">
                    Payment Method: {order.paymentMethod}
                  </span>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-500">Total Charged:</span>
                  <span className="font-serif font-bold text-base text-[#2E160E] font-mono">
                    ${Number(order.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-stone-500">
                Latest milestone: <strong className="text-[#2E160E]">{order.timeline[order.timeline.length - 1]?.status || order.orderStatus}</strong>
              </span>

              <button
                onClick={() => handleTrack(order.id)}
                className="px-4 py-2 rounded-xl bg-[#2E160E] hover:bg-[#4A2818] text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Track Progress</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
