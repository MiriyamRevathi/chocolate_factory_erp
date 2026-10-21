import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Percent,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { ChocolateBarIcon, TruffleIcon } from './ChocolateGraphics';

interface HeroSliderProps {
  onExploreChocolates: () => void;
  onStaffLogin: () => void;
  onScrollToStages?: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  onExploreChocolates,
  onStaffLogin,
  onScrollToStages
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = 3;
  const slideDuration = 3000; // Exactly 3 seconds
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto slide every 3 seconds
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, slideDuration);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentSlide, isPaused, totalSlides]);

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div
      id="hero-slider-container"
      className="relative overflow-hidden w-full bg-[#1F120C] select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      <div className="relative min-h-[580px] sm:min-h-[620px] lg:min-h-[640px] flex items-center">
        {/* ========================================================================= */}
        {/* SLIDE 1: SPECIAL PROMOTION - CHOCOLATE DISCOUNT 50% (Image 1 Style) */}
        {/* ========================================================================= */}
        <div
          className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out flex items-center ${
            currentSlide === 0
              ? 'opacity-100 z-20 pointer-events-auto scale-100'
              : 'opacity-0 z-10 pointer-events-none scale-105'
          }`}
        >
          {/* Rich Dark Slate & Chocolate Atmosphere Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#170E0A] via-[#24150E] to-[#1A110D]" />
          
          {/* Subtle Ambient Light & Smoke effects */}
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#D97706]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-[#E5A885]/10 blur-3xl pointer-events-none" />
          
          {/* Radial noise dots pattern */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Floating Chocolate Chunks (Simulating 3D Chocolate blocks from Image 1) */}
          <div className="hidden md:block absolute top-12 left-10 w-24 h-24 bg-[#3E2114] rounded-2xl rotate-12 shadow-2xl border-t border-l border-amber-900/40 opacity-70 transform -translate-y-2 animate-pulse pointer-events-none">
            <div className="grid grid-cols-2 grid-rows-2 h-full p-2 gap-1 opacity-50">
              <div className="bg-[#2B140A] rounded-xs shadow-inner" />
              <div className="bg-[#2B140A] rounded-xs shadow-inner" />
              <div className="bg-[#2B140A] rounded-xs shadow-inner" />
              <div className="bg-[#2B140A] rounded-xs shadow-inner" />
            </div>
          </div>
          <div className="hidden lg:block absolute bottom-12 left-8 w-28 h-28 bg-[#331A0F] rounded-2xl -rotate-12 shadow-2xl border-t border-l border-amber-900/40 opacity-60 pointer-events-none">
            <div className="grid grid-cols-2 grid-rows-2 h-full p-2 gap-1 opacity-50">
              <div className="bg-[#220E06] rounded-xs shadow-inner" />
              <div className="bg-[#220E06] rounded-xs shadow-inner" />
              <div className="bg-[#220E06] rounded-xs shadow-inner" />
              <div className="bg-[#220E06] rounded-xs shadow-inner" />
            </div>
          </div>
          <div className="hidden md:block absolute top-14 right-14 w-20 h-20 bg-[#3A1E12] rounded-xl rotate-45 shadow-xl opacity-60 pointer-events-none" />
          <div className="hidden lg:block absolute bottom-16 right-16 w-24 h-24 bg-[#422215] rounded-xl -rotate-6 shadow-xl opacity-50 pointer-events-none" />

          {/* Slide Content */}
          <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Delightful Chocolate Model Photography */}
              <div className="lg:col-span-6 flex justify-center lg:justify-start order-2 lg:order-1">
                <div className="relative max-w-md w-full">
                  {/* Photo frame with soft dark chocolate vignette */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-amber-500/20 bg-[#25140D] group/photo">
                    <img
                      src="https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=900&q=85"
                      alt="Artisan Chocolate Tasting"
                      className="w-full h-80 sm:h-96 object-cover object-center transform scale-105 group-hover/photo:scale-100 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E08] via-transparent to-black/30" />
                    
                    {/* Badge on Photo */}
                    <div className="absolute top-4 left-4 backdrop-blur-md bg-black/60 border border-amber-400/30 px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                      <Percent className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[11px] font-bold tracking-wider text-amber-200 uppercase">Flash Confectionery Deal</span>
                    </div>

                    {/* Floating mini review chip */}
                    <div className="absolute bottom-4 left-4 right-4 backdrop-blur-md bg-[#1C0F0A]/85 border border-amber-500/20 p-3 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-serif font-bold text-white">Criollo Grand Cru Bars</p>
                        <p className="text-[10px] text-amber-200/70">Stone-conched 72 hours • Form V Temper</p>
                      </div>
                      <span className="text-sm font-mono font-bold text-amber-300">$6.50 <span className="line-through text-stone-500 text-[11px]">$13.00</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Promotional Typography matching Image 1 */}
              <div className="lg:col-span-6 text-center lg:text-left space-y-5 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Limited Seasonal Harvest Release</span>
                </div>

                <div>
                  <h2 className="font-serif italic text-4xl sm:text-6xl text-[#E5A885] tracking-wide font-normal">
                    Chocolate
                  </h2>
                  <div className="font-serif font-black text-5xl sm:text-7xl text-white tracking-tight -mt-1 drop-shadow-md">
                    Discount 50%
                  </div>
                </div>

                <p className="text-sm sm:text-base text-amber-100/85 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Savor the velvety melt of artisan bean-to-bar dark & milk chocolate. Handcrafted in micro-batches with single-origin beans, unrefined cane sugar, and pure cocoa butter.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <button
                    id="slider-slide1-order-btn"
                    onClick={onExploreChocolates}
                    className="px-8 py-3.5 rounded-full bg-[#C5832B] hover:bg-[#A96B1E] text-white font-bold text-sm shadow-xl hover:shadow-amber-500/20 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Order Now (50% Off)</span>
                  </button>

                  <div className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white/5 border border-white/10 text-xs text-amber-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Auto-applied at checkout</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-center lg:justify-start gap-6 text-xs text-amber-200/70">
                  <span>✦ Direct-Trade Cocoa</span>
                  <span>✦ Zero Palm Oil</span>
                  <span>✦ Cold-Chain Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SLIDE 2: HERO BEAN TO BAR - CRAFTING QUALITY CHOCOLATE (Image 2 Style) */}
        {/* ========================================================================= */}
        <div
          className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out flex items-center justify-center ${
            currentSlide === 1
              ? 'opacity-100 z-20 pointer-events-auto scale-100'
              : 'opacity-0 z-10 pointer-events-none scale-105'
          }`}
        >
          {/* Classic Deep Cocoa Warm Gradient Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2E160E] via-[#3D2013] to-[#4A2818]" />
          
          {/* Warm Amber Polka Dot Grid Matrix matching Image 2 */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D9A05B_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />

          {/* Slide Content */}
          <div className="w-full px-4 sm:px-8 lg:px-12 text-center relative z-10 py-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold uppercase tracking-widest mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Artisanal Bean to Bar Manufacture & E-Commerce</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto drop-shadow-sm">
              Crafting Quality Chocolate <br />
              <span className="text-amber-300 italic font-serif font-normal">From Bean to Bar</span>
            </h1>

            <p className="text-base sm:text-lg text-amber-100/90 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Manage production, inventory, quality and customer orders through one connected chocolate factory platform. From raw cocoa bean silos to luxury artisan boutiques.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="slider-slide2-explore-btn"
                onClick={onExploreChocolates}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                <span>Explore Chocolates</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="slider-slide2-staff-btn"
                onClick={onStaffLogin}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#FDFBF7] hover:bg-white text-[#2E160E] font-bold text-sm border border-amber-200 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                <span>Staff Login</span>
                <Layers className="w-4 h-4 text-amber-700" />
              </button>
            </div>

            {/* Quick Metrics ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 mt-12 max-w-4xl mx-auto pt-8 border-t border-white/10">
              <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10 text-center hover:bg-white/10 transition-colors">
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-amber-300">100%</span>
                <span className="text-[11px] text-amber-100/70 font-semibold tracking-wide uppercase">Direct Single Origin</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10 text-center hover:bg-white/10 transition-colors">
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-amber-300">72 hrs</span>
                <span className="text-[11px] text-amber-100/70 font-semibold tracking-wide uppercase">Stone Conching Time</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10 text-center hover:bg-white/10 transition-colors">
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-amber-300">9 Stages</span>
                <span className="text-[11px] text-amber-100/70 font-semibold tracking-wide uppercase">Rigorous QC Testing</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10 text-center hover:bg-white/10 transition-colors">
                <span className="block text-2xl sm:text-3xl font-serif font-bold text-amber-300">Form V</span>
                <span className="text-[11px] text-amber-100/70 font-semibold tracking-wide uppercase">Beta Crystals</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SLIDE 3: HAUTE CHOCOLATERIE & PRALINES (Image 3 Style) */}
        {/* ========================================================================= */}
        <div
          className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out flex items-center ${
            currentSlide === 2
              ? 'opacity-100 z-20 pointer-events-auto scale-100'
              : 'opacity-0 z-10 pointer-events-none scale-105'
          }`}
        >
          {/* Velvety Chocolate Canvas Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#211009] via-[#32170D] to-[#1F0E07]" />
          
          {/* Glowing Amber Glow */}
          <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-[#D9A05B]/15 blur-3xl pointer-events-none" />

          {/* Slide Content */}
          <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Gourmet Description & Badges */}
              <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9A05B]/20 border border-[#D9A05B]/30 text-amber-200 text-xs font-semibold tracking-widest uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#D9A05B]" />
                  <span>Grand Cru Reserve • Master Confectionery</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Handcrafted Pralines <br />
                  <span className="text-[#D9A05B] italic font-normal">Sculpted & Tempered</span>
                </h2>

                <p className="text-sm sm:text-base text-amber-100/85 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Each praline is poured into micro-moulds with polymorphic Form V crystals, filled with wild honey ganache, slow-roasted almonds, and enrobed in glossy 74% single-estate cocoa.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <button
                    id="slider-slide3-explore-btn"
                    onClick={onExploreChocolates}
                    className="px-8 py-3.5 rounded-xl bg-[#D9A05B] hover:bg-[#C28C47] text-[#2E160E] font-bold text-sm shadow-xl hover:shadow-amber-500/20 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <span>Discover Truffles & Pralines</span>
                    <ArrowRight className="w-4 h-4 text-[#2E160E]" />
                  </button>

                  {onScrollToStages && (
                    <button
                      id="slider-slide3-stages-btn"
                      onClick={onScrollToStages}
                      className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 shadow-md transition-all flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4 text-amber-300" />
                      <span>View 9-Stage Process</span>
                    </button>
                  )}
                </div>

                {/* Feature Chips */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="block text-xs font-bold text-amber-300">Wavy Ganache</span>
                    <span className="text-[10px] text-amber-100/60">Fluted Shells</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="block text-xs font-bold text-amber-300">Toasted Almond</span>
                    <span className="text-[10px] text-amber-100/60">Piedmont Nuts</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                    <span className="block text-xs font-bold text-amber-300">Gold Foil Seal</span>
                    <span className="text-[10px] text-amber-100/60">Gift Ready</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Artisan Praline / Truffle Visual matching Image 3 */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative max-w-sm w-full">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#D9A05B]/30 bg-[#25130A] group/praline">
                    <img
                      src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=85"
                      alt="Artisanal Chocolate Pralines"
                      className="w-full h-80 sm:h-96 object-cover object-center transform scale-105 group-hover/praline:scale-100 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1F0E07] via-transparent to-black/30" />

                    {/* Gourmet Spec Tag */}
                    <div className="absolute bottom-4 left-4 right-4 backdrop-blur-md bg-black/70 border border-[#D9A05B]/30 p-3.5 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-serif font-bold text-amber-200">Terroir Tasting Collection</p>
                          <p className="text-[10px] text-stone-300">Madagascar Sambirano 74% Cacao</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[#D9A05B] text-[#2E160E] text-[10px] font-bold">
                          Gold Medal
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MANUAL NAVIGATION ARROWS */}
      {/* ========================================================================= */}
      <button
        id="slider-prev-btn"
        onClick={goToPrev}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/10 shadow-lg transition-all transform hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        id="slider-next-btn"
        onClick={goToNext}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/10 shadow-lg transition-all transform hover:scale-110 active:scale-95"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* ========================================================================= */}
      {/* SLIDE INDICATORS & 3-SECOND TIMER PROGRESS BAR */}
      {/* ========================================================================= */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {[0, 1, 2].map((idx) => {
          const isActive = currentSlide === idx;
          return (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`relative transition-all duration-300 rounded-full overflow-hidden ${
                isActive ? 'w-12 h-3 bg-white/20' : 'w-3 h-3 bg-white/30 hover:bg-white/50'
              }`}
            >
              {isActive && (
                <div
                  key={`progress-${idx}-${isPaused ? 'paused' : 'running'}`}
                  className="h-full bg-amber-400 rounded-full"
                  style={{
                    animation: isPaused
                      ? 'none'
                      : `progressFill ${slideDuration}ms linear infinite`
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 3-Second Progress Bar Keyframes Style */}
      <style>{`
        @keyframes progressFill {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
