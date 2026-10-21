import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import { Product } from '../types';
import {
  Search,
  SlidersHorizontal,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Sparkles,
  Truck,
  Check,
  Filter
} from 'lucide-react';
import { ProductArtCard } from '../components/ChocolateGraphics';
import { StatusBadge } from '../components/StatusBadge';
import { ProductDetailModal } from '../components/ProductDetailModal';

export const CustomerShop: React.FC = () => {
  const {
    products,
    addToCart,
    wishlist,
    toggleWishlist,
    selectedProductId,
    setSelectedProductId,
    setCurrentView
  } = useFactory();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [addedNoticeId, setAddedNoticeId] = useState<string | null>(null);

  const categories = [
    'All',
    'Milk Chocolate',
    'Dark Chocolate',
    'White Chocolate',
    'Chocolate Bars',
    'Truffles',
    'Filled Chocolates',
    'Gift Boxes',
    'Seasonal Collection'
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured
  });

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedNoticeId(product.id);
    setTimeout(() => setAddedNoticeId(null), 1800);
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Banner */}
      <div className="w-full bg-gradient-to-r from-[#2E160E] via-[#4A2818] to-[#2E160E] text-white p-6 sm:p-8 relative overflow-hidden shadow-md">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Maison Chocolatier Boutique</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2">
            Single-Origin Artisan Chocolates
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed mb-4">
            Freshly tempered, slow-conched couvertures crafted in small batches. Free insulated ice-box shipping on orders over $50.00.
          </p>
          <div className="flex items-center gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
              <Truck className="w-3.5 h-3.5 text-amber-300" />
              <span>Cold Chain Shipping Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-2 sm:px-4 space-y-6">
        {/* Filter and Search Bar */}
      <div className="choco-card p-4 bg-white border border-[#EBDCD5] space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chocolate bars, truffles, hazelnuts..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] text-xs text-[#2E160E] placeholder-stone-400 focus:outline-hidden focus:border-amber-600"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600 whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#FAF5F0] border border-[#EBDCD5] text-xs font-semibold text-[#2E160E] focus:outline-hidden focus:border-amber-600"
            >
              <option value="featured">Featured Artisanal</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#2E160E] text-amber-300 shadow-xs'
                    : 'bg-[#FAF5F0] text-[#5C311C] hover:bg-[#F5EBE6] border border-[#EBDCD5]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-16 choco-card bg-white p-8">
          <p className="font-serif text-lg text-[#2E160E] mb-2">No chocolates match your search.</p>
          <p className="text-xs text-stone-500 mb-4">Try clearing filters or changing search keywords.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-[#2E160E] text-amber-300 text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((prod) => {
            const isWish = wishlist.includes(prod.id);
            const isAvailable = prod.status === 'Active' && prod.stock > 0;
            const isJustAdded = addedNoticeId === prod.id;

            return (
              <div
                key={prod.id}
                id={`product-card-${prod.id.toLowerCase()}`}
                onClick={() => setSelectedProductId(prod.id)}
                className="choco-card p-4 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group bg-white"
              >
                <div>
                  {/* Artwork & Badge */}
                  <div className="relative mb-3">
                    <ProductArtCard category={prod.category} name={prod.name} className="h-44" />
                    {prod.badge && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D97706] text-white shadow-xs">
                        {prod.badge}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(prod.id);
                      }}
                      className={`absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors shadow-xs ${
                        isWish ? 'text-rose-600' : 'text-stone-400 hover:text-rose-600'
                      }`}
                      title="Save to Wishlist"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Category & Weight */}
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-amber-800">{prod.category}</span>
                    <span className="text-stone-500 font-mono">{prod.weight}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif font-bold text-sm text-[#2E160E] line-clamp-1 group-hover:text-amber-800 transition-colors">
                    {prod.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-stone-600 line-clamp-2 mt-1 mb-3">
                    {prod.description}
                  </p>

                  {/* Rating & Stock */}
                  <div className="flex items-center justify-between text-xs mb-3">
                    <div className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current mr-1" />
                      <span>{Number(prod.rating ?? 5.0).toFixed(1)}</span>
                    </div>
                    <StatusBadge status={prod.status} size="sm" />
                  </div>
                </div>

                {/* Footer Price & Action */}
                <div className="pt-3 border-t border-[#EBDCD5] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block leading-none">Price</span>
                    <span className="font-serif font-bold text-base text-[#2E160E]">
                      ${Number(prod.price ?? 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProductId(prod.id);
                      }}
                      className="p-2 rounded-lg bg-[#FAF5F0] hover:bg-[#F5EBE6] text-[#5C311C] border border-[#EBDCD5] transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      disabled={!isAvailable}
                      onClick={(e) => handleQuickAdd(prod, e)}
                      className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                        isJustAdded
                          ? 'bg-emerald-700 text-white'
                          : isAvailable
                          ? 'bg-[#D97706] hover:bg-[#B45309] text-white'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>{isAvailable ? 'Add' : 'Sold Out'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>

      {/* Product Detail Modal */}
      {selectedProductId && (
        <ProductDetailModal
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </div>
  );
};
