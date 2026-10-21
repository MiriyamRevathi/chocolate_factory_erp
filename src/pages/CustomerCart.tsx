import React from 'react';
import { useFactory } from '../context/FactoryContext';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ShieldCheck,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { ProductArtCard } from '../components/ChocolateGraphics';

export const CustomerCart: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    settings,
    setCurrentView
  } = useFactory();

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= settings.freeShippingThreshold;
  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : settings.standardShippingFee;
  const total = subtotal + shippingFee;
  const freeShippingDelta = Math.max(0, settings.freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / settings.freeShippingThreshold) * 100);

  if (cart.length === 0) {
    return (
      <div className="w-full px-3 sm:px-5 py-5">
        <div className="choco-card p-12 bg-white border border-[#EBDCD5] text-center rounded-2xl shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF5F0] text-[#5C311C] flex items-center justify-center mx-auto mb-4 border border-[#EBDCD5]">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2E160E] mb-2">
            Your Chocolate Cart is Empty
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-6">
            Explore our artisanal bean-to-bar collection including Criollo dark bars, Piedmont hazelnut pralines, and salted caramel truffles.
          </p>
          <button
            id="cart-start-shopping-btn"
            onClick={() => setCurrentView('customer-shop')}
            className="px-6 py-3 rounded-xl bg-[#2E160E] hover:bg-[#4A2818] text-amber-300 font-bold text-xs inline-flex items-center gap-2 transition-colors shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Chocolate Boutique</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 py-4 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#EBDCD5]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E160E]">
            Artisan Chocolate Basket
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Review your confectionery items before safe demo checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Empty Basket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free shipping banner */}
          <div className="p-4 rounded-xl bg-[#FFF9F6] border border-[#F5DADB]">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="flex items-center gap-1.5 text-amber-900">
                <Truck className="w-4 h-4 text-amber-700" />
                {isFreeShipping
                  ? 'You unlocked FREE Climate-Cold Delivery!'
                  : `Add $${Number(freeShippingDelta || 0).toFixed(2)} more for Free Shipping`}
              </span>
              <span className="text-stone-500 font-mono text-[11px]">
                Threshold: ${Number(settings?.freeShippingThreshold || 50).toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="choco-card bg-white border border-[#EBDCD5] divide-y divide-stone-100 overflow-hidden shadow-xs">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <ProductArtCard
                      category={item.product.category}
                      name={item.product.name}
                      className="h-full"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      {item.product.category} • {item.product.weight}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-[#2E160E]">
                      {item.product.name}
                    </h3>
                    <span className="text-xs text-stone-500 font-mono">
                      ${Number(item.product?.price || 0).toFixed(2)} each
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#EBDCD5] bg-[#FAF5F0] rounded-lg overflow-hidden shadow-2xs">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 text-stone-600 hover:bg-stone-200"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#2E160E] min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 text-stone-600 hover:bg-stone-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[4.5rem]">
                    <span className="text-[10px] text-stone-400 block leading-none">Subtotal</span>
                    <span className="font-serif font-bold text-sm text-[#2E160E]">
                      ${(Number(item.product?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="choco-card p-6 bg-white border border-[#EBDCD5] space-y-6 shadow-md rounded-2xl">
          <h2 className="font-serif text-lg font-bold text-[#2E160E] pb-3 border-b border-[#EBDCD5]">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-stone-600">
              <span>Items Subtotal:</span>
              <span className="font-bold text-[#2E160E] font-mono">${Number(subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-stone-600">
              <span>Insulated Cold Packaging:</span>
              <span className="font-bold text-emerald-700">Complimentary</span>
            </div>
            <div className="flex items-center justify-between text-stone-600">
              <span>Courier Delivery Fee:</span>
              <span className={`font-bold font-mono ${isFreeShipping ? 'text-emerald-700' : 'text-[#2E160E]'}`}>
                {isFreeShipping ? 'FREE' : `$${Number(shippingFee || 0).toFixed(2)}`}
              </span>
            </div>
            <div className="pt-3 border-t border-[#EBDCD5] flex items-center justify-between text-sm">
              <span className="font-bold text-[#2E160E]">Estimated Total:</span>
              <span className="font-serif font-bold text-xl text-[#2E160E] font-mono">
                ${Number(total || 0).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            id="proceed-to-checkout-btn"
            onClick={() => setCurrentView('customer-checkout')}
            className="w-full py-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <span>Proceed to Demo Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="space-y-2 pt-2 text-[11px] text-stone-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Safe local demo checkout (no real credit card charged)</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Real-time factory finished goods stock deduction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
