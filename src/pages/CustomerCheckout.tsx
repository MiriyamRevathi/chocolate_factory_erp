import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Truck,
  ArrowRight,
  CheckCircle,
  Package,
  MapPin,
  User,
  Phone,
  Mail
} from 'lucide-react';

export const CustomerCheckout: React.FC = () => {
  const { cart, settings, placeOrder, setCurrentView, currentUser } = useFactory();

  const [customer, setCustomer] = useState({
    name: currentUser?.name || 'Alice Morgan',
    email: currentUser?.email || 'customer@chocofactory.com',
    phone: '+1 (555) 234-5678',
    address: '452 Maple Blossom Way, Suite 4B',
    city: 'San Francisco',
    postalCode: '94107'
  });

  const [paymentMethod, setPaymentMethod] = useState<'Demo Card' | 'Cash on Delivery'>('Demo Card');
  const [cardholderName, setCardholderName] = useState(currentUser?.name || 'Alice Morgan');
  const [cardType, setCardType] = useState('Visa Demo');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= settings.freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : settings.standardShippingFee;
  const total = subtotal + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="p-8 w-full max-w-xl mx-auto text-center choco-card bg-white mt-10">
        <h2 className="font-serif text-xl font-bold text-[#2E160E] mb-2">No items in your basket</h2>
        <p className="text-xs text-stone-500 mb-4">Please select chocolates before checking out.</p>
        <button
          onClick={() => setCurrentView('customer-shop')}
          className="px-5 py-2.5 rounded-xl bg-[#2E160E] text-amber-300 text-xs font-bold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const order = await placeOrder(
        customer,
        paymentMethod,
        {
          cardholderName: paymentMethod === 'Demo Card' ? cardholderName : customer.name,
          cardType: paymentMethod === 'Demo Card' ? cardType : 'COD',
          reference: `DEMO-${Date.now().toString().slice(-6)}`
        }
      );

      if (order) {
        alert(`Order ${order.id} placed successfully! Thank you for ordering with Maison Chocolat.`);
        setCurrentView('customer-tracking');
      }
    } catch (err) {
      alert('Failed placing order. Please check inputs and stock.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-6">
      <div className="pb-4 border-b border-[#EBDCD5]">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E160E]">
          Artisan Checkout
        </h1>
        <p className="text-xs text-stone-600 mt-0.5">
          Enter delivery destination and select demo payment method
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping & Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="choco-card p-6 bg-white border border-[#EBDCD5] rounded-2xl shadow-xs space-y-4">
            <h2 className="font-serif text-base font-bold text-[#2E160E] flex items-center gap-2 pb-2 border-b border-[#EBDCD5]">
              <MapPin className="w-4 h-4 text-amber-700" />
              <span>1. Delivery Destination</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2E160E] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] text-xs text-[#2E160E] focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E160E] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] text-xs text-[#2E160E] focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E160E] mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] text-xs text-[#2E160E] focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E160E] mb-1">City</label>
                <input
                  type="text"
                  required
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] text-xs text-[#2E160E] focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#2E160E] mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] text-xs text-[#2E160E] focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E160E] mb-1">Postal / Zip Code</label>
                <input
                  type="text"
                  required
                  value={customer.postalCode}
                  onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] text-xs text-[#2E160E] focus:outline-hidden focus:border-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="choco-card p-6 bg-white border border-[#EBDCD5] rounded-2xl shadow-xs space-y-4">
            <h2 className="font-serif text-base font-bold text-[#2E160E] flex items-center gap-2 pb-2 border-b border-[#EBDCD5]">
              <CreditCard className="w-4 h-4 text-amber-700" />
              <span>2. Payment Method (Demo Environment)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'Demo Card'
                    ? 'border-amber-600 bg-[#FFF9F6] shadow-2xs'
                    : 'border-[#EBDCD5] hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Demo Card'}
                  onChange={() => setPaymentMethod('Demo Card')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="font-bold text-xs text-[#2E160E] block">Demo Credit / Debit Card</span>
                  <span className="text-[11px] text-stone-500">Instant simulated checkout clearance</span>
                </div>
              </label>

              <label
                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-amber-600 bg-[#FFF9F6] shadow-2xs'
                    : 'border-[#EBDCD5] hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={() => setPaymentMethod('Cash on Delivery')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="font-bold text-xs text-[#2E160E] block">Cash on Delivery (COD)</span>
                  <span className="text-[11px] text-stone-500">Settle upon courier package handover</span>
                </div>
              </label>
            </div>

            {paymentMethod === 'Demo Card' && (
              <div className="p-4 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#EBDCD5] text-xs font-semibold text-[#2E160E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">Test Card Brand</label>
                    <select
                      value={cardType}
                      onChange={(e) => setCardType(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#EBDCD5] text-xs font-semibold text-[#2E160E]"
                    >
                      <option value="Visa Demo">Visa Demo (•••• 4242)</option>
                      <option value="Mastercard Demo">Mastercard Demo (•••• 5555)</option>
                      <option value="Amex Demo">Amex Demo (•••• 1005)</option>
                    </select>
                  </div>
                </div>
                <p className="text-[11px] text-stone-500 italic">
                  * Demo mode active: No real payment credentials or external processors are required.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Review Sidebar */}
        <div className="space-y-6">
          <div className="choco-card p-6 bg-white border border-[#EBDCD5] rounded-2xl shadow-md space-y-4">
            <h2 className="font-serif text-base font-bold text-[#2E160E] pb-2 border-b border-[#EBDCD5]">
              Order Basket Review ({cart.reduce((s, i) => s + i.quantity, 0)} items)
            </h2>

            <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-stone-100 pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#2E160E] block line-clamp-1">{item.product.name}</span>
                    <span className="text-stone-500 font-mono">
                      {item.quantity} × ${Number(item.product?.price || 0).toFixed(2)}
                    </span>
                  </div>
                  <span className="font-bold text-[#2E160E] font-mono">
                    ${(Number(item.product?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#EBDCD5] space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-[#2E160E]">${Number(subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {isFreeShipping ? 'FREE' : `$${Number(shippingFee || 0).toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-[#EBDCD5] flex justify-between text-sm font-bold text-[#2E160E]">
                <span>Total Amount:</span>
                <span className="font-serif text-xl font-bold font-mono text-[#2E160E]">
                  ${Number(total || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              id="confirm-place-order-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg disabled:bg-stone-300"
            >
              {isSubmitting ? (
                <span>Dispatching Order...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Place Order (${Number(total || 0).toFixed(2)})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
