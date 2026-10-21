import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import { Product } from '../types';
import {
  X,
  Star,
  ShieldAlert,
  ShoppingCart,
  Heart,
  Sparkles,
  CheckCircle,
  Plus,
  Minus,
  Check
} from 'lucide-react';
import { ProductArtCard } from './ChocolateGraphics';
import { StatusBadge } from './StatusBadge';

interface ProductDetailModalProps {
  productId: string;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ productId, onClose }) => {
  const { products, addToCart, wishlist, toggleWishlist, setCurrentView } = useFactory();
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  const product = products.find((p) => p.id === productId);
  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const isAvailable = product.status === 'Active' && product.stock > 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    setCurrentView('customer-cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#EBDCD5] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Art */}
        <div className="relative">
          <ProductArtCard
            category={product.category}
            name={product.name}
            className="h-56 rounded-none"
          />
          {product.badge && (
            <span className="absolute bottom-3 left-4 px-3 py-1 rounded-full text-xs font-bold bg-[#D97706] text-white shadow-md">
              {product.badge}
            </span>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Title & Rating */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                {product.category} • {product.weight}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#2E160E]">{product.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-500 text-xs font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-current mr-1" />
                <span>{Number(product.rating ?? 5.0).toFixed(1)}</span>
              </div>
              <StatusBadge status={product.status} />
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-stone-700 leading-relaxed bg-[#FAF5F0] p-4 rounded-xl border border-[#EBDCD5]">
            {product.description}
          </p>

          {/* Pricing & Stock Bar */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#FFF9F6] border border-[#F5DADB]">
            <div>
              <span className="text-xs text-stone-500 block leading-none">Artisanal Price</span>
              <span className="font-serif text-2xl font-bold text-[#2E160E]">
                ${Number(product.price ?? 0).toFixed(2)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-500 block leading-none">Finished Stock</span>
              <span className={`text-xs font-bold ${product.stock > 10 ? 'text-emerald-700' : product.stock > 0 ? 'text-amber-700' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} units ready in vault` : 'Sold out (In production)'}
              </span>
            </div>
          </div>

          {/* Ingredients & Allergens */}
          <div className="space-y-3 text-xs">
            <div>
              <h4 className="font-bold text-[#2E160E] mb-1">Pure Ingredients:</h4>
              <p className="text-stone-600 leading-relaxed">{product.ingredients}</p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900 block">Allergen Information</span>
                <span className="text-amber-800">{product.allergens}</span>
              </div>
            </div>
          </div>

          {/* Nutrition Facts Table */}
          <div>
            <h4 className="font-bold text-xs text-[#2E160E] mb-2 uppercase tracking-wider">
              Nutritional Profile (per 100g)
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                <span className="block text-[10px] text-stone-500">Energy</span>
                <span className="font-bold text-[#2E160E]">{product.nutrition.calories}</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                <span className="block text-[10px] text-stone-500">Total Fat</span>
                <span className="font-bold text-[#2E160E]">{product.nutrition.fat}</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                <span className="block text-[10px] text-stone-500">Sat. Fat</span>
                <span className="font-bold text-[#2E160E]">{product.nutrition.saturatedFat}</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                <span className="block text-[10px] text-stone-500">Carbs</span>
                <span className="font-bold text-[#2E160E]">{product.nutrition.carbs}</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                <span className="block text-[10px] text-stone-500">Sugars</span>
                <span className="font-bold text-[#2E160E]">{product.nutrition.sugar}</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                <span className="block text-[10px] text-stone-500">Protein</span>
                <span className="font-bold text-[#2E160E]">{product.nutrition.protein}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 bg-[#FAF5F0] border-t border-[#EBDCD5] flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-[#EBDCD5] bg-white rounded-xl overflow-hidden shadow-2xs">
              <button
                disabled={quantity <= 1 || !isAvailable}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 hover:bg-stone-100 disabled:opacity-30 text-stone-700"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-4 py-1 text-xs font-bold text-[#2E160E] min-w-[2.5rem] text-center">
                {quantity}
              </span>
              <button
                disabled={!isAvailable || quantity >= product.stock}
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2.5 hover:bg-stone-100 disabled:opacity-30 text-stone-700"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isWishlisted
                  ? 'bg-rose-50 border-rose-300 text-rose-600'
                  : 'bg-white border-[#EBDCD5] text-stone-500 hover:text-rose-600'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              disabled={!isAvailable}
              onClick={handleAddToCart}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs ${
                addedNotice
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#2E160E] hover:bg-[#4A2818] text-amber-300 disabled:bg-stone-300 disabled:text-stone-500'
              }`}
            >
              {addedNotice ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              disabled={!isAvailable}
              onClick={handleBuyNow}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] disabled:bg-stone-300 disabled:text-stone-500 text-white font-bold text-xs transition-colors shadow-xs"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
