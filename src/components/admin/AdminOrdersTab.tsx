import React, { useState } from 'react';
import { useFactory } from '../../context/FactoryContext';
import { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../StatusBadge';
import {
  Truck,
  DollarSign,
  Clock,
  CheckCircle,
  Search,
  Download,
  Eye,
  X,
  MapPin,
  Mail,
  Phone,
  Package
} from 'lucide-react';

export const AdminOrdersTab: React.FC = () => {
  const { orders, updateOrderStatus } = useFactory();

  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => (o.paymentStatus === 'Paid' ? sum + o.total : sum), 0);
  const pendingOrders = orders.filter((o) => ['Placed', 'Confirmed', 'Processing'].includes(o.orderStatus));
  const shippedOrders = orders.filter((o) => o.orderStatus === 'Shipped' || o.orderStatus === 'Delivered');
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === 'All' || o.paymentStatus === paymentFilter;
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPayment && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Email', 'Total ($)', 'Payment Status', 'Fulfillment Status', 'Address'];
    const rows = filteredOrders.map((o) => [
      o.id,
      o.orderDate,
      o.customer?.name || 'Customer',
      o.customer?.email || '',
      Number(o.total || 0).toFixed(2),
      o.paymentStatus,
      o.orderStatus,
      `"${o.customer?.address || ''}, ${o.customer?.city || ''}"`
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `orders-registry-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-wider">Total Sales Volume</span>
            <div className="w-8 h-8 rounded-full bg-[#F9E4E8] flex items-center justify-center text-[#D9A05B]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-3xl font-bold text-[#3D2B1F]">${Number(totalRevenue || 0).toFixed(2)}</span>
            <span className="text-xs text-[#3D2B1F]/60 block mt-1">Paid customer dispatches</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-wider">Orders In Queue</span>
            <div className="w-8 h-8 rounded-full bg-[#F9E4E8] flex items-center justify-center text-[#D9A05B]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-3xl font-bold text-[#3D2B1F]">{pendingOrders.length}</span>
            <span className="text-xs text-[#3D2B1F]/60 block mt-1">Awaiting packing or shipping</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-wider">Dispatched & Delivered</span>
            <div className="w-8 h-8 rounded-full bg-[#F9E4E8] flex items-center justify-center text-[#D9A05B]">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-3xl font-bold text-[#3D2B1F]">{shippedOrders.length}</span>
            <span className="text-xs text-[#3D2B1F]/60 block mt-1">Completed shipments</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-wider">Average Basket Size</span>
            <div className="w-8 h-8 rounded-full bg-[#F9E4E8] flex items-center justify-center text-[#D9A05B]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-serif text-3xl font-bold text-[#3D2B1F]">${Number(avgOrderValue || 0).toFixed(2)}</span>
            <span className="text-xs text-[#3D2B1F]/60 block mt-1">Across all orders</span>
          </div>
        </div>
      </div>

      {/* Orders Management Table */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-[#D9A05B]/15 shadow-xs space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#3D2B1F]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search orders by ID, customer name, email, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D9A05B]/20 text-xs text-[#3D2B1F] placeholder:text-[#3D2B1F]/40 focus:outline-none focus:border-[#D9A05B]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap items-center gap-1">
              {['All', 'Placed', 'Processing', 'Packed', 'Shipped', 'Delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    statusFilter === status
                      ? 'bg-[#3D2B1F] text-[#D9A05B] border border-[#D9A05B]/30 shadow-xs'
                      : 'bg-white text-[#3D2B1F]/70 border border-[#D9A05B]/15 hover:bg-[#F9E4E8]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 rounded-xl bg-[#D9A05B] hover:bg-[#c28b49] text-[#3D2B1F] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#3D2B1F]/10 text-[#3D2B1F]/60 uppercase font-mono text-[10px]">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Items Summary</th>
                <th className="pb-3">Total Amount</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Order Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D2B1F]/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#3D2B1F]/50 italic">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F9E4E8]/20 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#D9A05B]">{order.id}</td>
                    <td className="py-3.5">
                      <span className="font-bold text-[#3D2B1F] block">{order.customer.name}</span>
                      <span className="text-[10px] text-[#3D2B1F]/60">{order.customer.city}</span>
                    </td>
                    <td className="py-3.5 font-mono text-[#3D2B1F]/60">{order.orderDate}</td>
                    <td className="py-3.5 text-[#3D2B1F]/80">
                      <span className="font-medium">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} units
                      </span>{' '}
                      <span className="text-[10px] text-[#3D2B1F]/50">
                        ({order.items.map((i) => i.productName || i.name).join(', ').slice(0, 24)}...)
                      </span>
                    </td>
                    <td className="py-3.5 font-mono font-bold text-[#3D2B1F]">${Number(order.total || 0).toFixed(2)}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="px-2.5 py-1 rounded-xl bg-white border border-[#D9A05B]/30 text-[11px] font-bold text-[#3D2B1F] shadow-2xs focus:outline-none focus:border-[#D9A05B]"
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
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] border border-[#D9A05B]/30 text-[11px] font-bold inline-flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Slip</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Packing Slip Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 border border-[#D9A05B]/20 shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#3D2B1F]/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9A05B]">
                  Packing Slip & Dispatch Manifest
                </span>
                <h2 className="font-serif font-bold text-xl text-[#3D2B1F] mt-0.5">
                  Order Ref: {selectedOrder.id}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-[#F9E4E8] text-[#3D2B1F]/60 hover:text-[#3D2B1F] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#F9E4E8]/40 p-4 rounded-2xl border border-[#D9A05B]/15">
              <div className="space-y-1.5">
                <span className="font-bold text-[#3D2B1F] uppercase tracking-wider text-[10px] block">
                  Customer Information
                </span>
                <p className="font-semibold text-sm text-[#3D2B1F]">{selectedOrder.customer.name}</p>
                <p className="text-[#3D2B1F]/70 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#D9A05B]" /> {selectedOrder.customer.email}
                </p>
                <p className="text-[#3D2B1F]/70 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#D9A05B]" /> {selectedOrder.customer.phone}
                </p>
              </div>
              <div className="space-y-1.5">
                <span className="font-bold text-[#3D2B1F] uppercase tracking-wider text-[10px] block">
                  Delivery Destination
                </span>
                <p className="text-[#3D2B1F]/80 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D9A05B] shrink-0 mt-0.5" />
                  <span>
                    {selectedOrder.customer.address}, {selectedOrder.customer.city}
                  </span>
                </p>
                <p className="text-[#3D2B1F]/60 text-[11px] pt-1">
                  Courier Tracking: <span className="font-mono font-bold text-[#3D2B1F]">{selectedOrder.trackingNumber || 'Pending pickup'}</span>
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2">
              <span className="font-bold text-xs text-[#3D2B1F] uppercase tracking-wider block">
                Manifest Contents ({selectedOrder.items.length} items)
              </span>
              <div className="border border-[#3D2B1F]/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F9E4E8]/50 text-[#3D2B1F]/70 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3 text-center">Quantity</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3D2B1F]/5">
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-stone-50">
                        <td className="p-3 font-medium text-[#3D2B1F]">{item.name || (item as any).productName || 'Chocolate'}</td>
                        <td className="p-3 text-center font-mono font-bold">{item.quantity}</td>
                        <td className="p-3 text-right font-mono text-[#3D2B1F]/70">
                          ${Number(item.price ?? (item as any).unitPrice ?? 0).toFixed(2)}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-[#3D2B1F]">
                          ${Number(item.subtotal ?? ((item.price ?? (item as any).unitPrice ?? 0) * (item.quantity || 1))).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Financials */}
            <div className="flex justify-end pt-2 border-t border-[#3D2B1F]/10">
              <div className="w-64 space-y-1.5 text-xs">
                {(() => {
                  const deliveryFee = Number(selectedOrder.deliveryFee ?? selectedOrder.shippingFee ?? 0);
                  const tax = Number(selectedOrder.tax ?? 0);
                  const total = Number(selectedOrder.total ?? 0);
                  const subtotal = Number(selectedOrder.subtotal ?? (total - deliveryFee - tax));
                  return (
                    <>
                      <div className="flex justify-between text-[#3D2B1F]/70">
                        <span>Subtotal</span>
                        <span className="font-mono">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[#3D2B1F]/70">
                        <span>Insured Courier Shipping</span>
                        <span className="font-mono">${deliveryFee.toFixed(2)}</span>
                      </div>
                      {tax > 0 && (
                        <div className="flex justify-between text-[#3D2B1F]/70">
                          <span>Sales Tax</span>
                          <span className="font-mono">${tax.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-bold text-[#3D2B1F] pt-2 border-t border-[#3D2B1F]/10">
                        <span>Total Paid</span>
                        <span className="font-mono font-bold text-base text-[#D9A05B]">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-[#3D2B1F]/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#3D2B1F]">Status:</span>
                <StatusBadge status={selectedOrder.orderStatus} size="sm" />
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl bg-[#3D2B1F] hover:bg-[#4E3829] text-[#D9A05B] border border-[#D9A05B]/30 font-bold text-xs transition-colors shadow-2xs"
              >
                Close Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
