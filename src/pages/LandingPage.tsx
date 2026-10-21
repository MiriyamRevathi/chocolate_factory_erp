import React, { useState } from 'react';
import { useFactory } from '../context/FactoryContext';
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Flame,
  CheckCircle,
  Truck,
  Heart,
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  Layers,
  ThermometerSnowflake,
  Star
} from 'lucide-react';
import { CocoaPodIcon, ChocolateBarIcon, TruffleIcon, ProductArtCard } from '../components/ChocolateGraphics';
import { HeroSlider } from '../components/HeroSlider';

export const LandingPage: React.FC = () => {
  const { setCurrentView, products, addToCart, currentUser } = useFactory();
  const [activeStage, setActiveStage] = useState<number>(0);
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const stages = [
    {
      num: 1,
      title: 'Cocoa Preparation',
      short: 'Sorting & Cleaning',
      desc: 'Carefully grading single-origin Criollo & Trinitario beans, removing impurities, and calibrating moisture for optimal roasting.',
      icon: CocoaPodIcon
    },
    {
      num: 2,
      title: 'Roasting',
      short: 'Flavor Development',
      desc: 'Gentle convective thermal roasting at 120°C–140°C to release aromatic precursors, rich nutty notes, and deep cocoa esters.',
      icon: Flame
    },
    {
      num: 3,
      title: 'Grinding & Winnowing',
      short: 'Nib Extraction',
      desc: 'Hulling the outer shells with air winnowers and grinding crisp roasted cocoa nibs into glossy, warm cocoa liquor (mass).',
      icon: Layers
    },
    {
      num: 4,
      title: 'Mixing & Blending',
      short: 'Formula Balancing',
      desc: 'Combining pure cocoa liquor, deodorized cocoa butter, alpine milk cream, and fine cane sugar according to master recipes.',
      icon: Sparkles
    },
    {
      num: 5,
      title: 'Conching',
      short: 'Silky Texture Aeration',
      desc: 'Slow mechanical scraping and aerating for 24 to 72 hours at controlled temperatures, evaporating volatiles and refining particles under 18 microns.',
      icon: Clock
    },
    {
      num: 6,
      title: 'Tempering',
      short: 'Polymorphic Form V',
      desc: 'Strict thermal cycling (45°C down to 27°C then up to 31.5°C) to seed uniform Beta-V crystals for brilliant gloss and clean auditory snap.',
      icon: ThermometerSnowflake
    },
    {
      num: 7,
      title: 'Moulding & Vibrating',
      short: 'Shaping & De-aerating',
      desc: 'Depositing liquid tempered chocolate into artisanal bar moulds and truffle shells, with sonic vibrating tables to evacuate micro-bubbles.',
      icon: ChocolateBarIcon
    },
    {
      num: 8,
      title: 'Cooling Tunnel',
      short: 'Controlled Solidification',
      desc: 'Gradual three-zone cooling tunnel (16°C to 12°C) allowing crystal lattice contraction for easy demoulding and mirror-sheen surfaces.',
      icon: CheckCircle
    },
    {
      num: 9,
      title: 'Packaging & QC Release',
      short: 'Gold Foil Seal',
      desc: 'Airtight protective foil wrapping, batch code imprinting, cold storage quarantine, and release after rigorous physical & sensory QC checks.',
      icon: Award
    }
  ];

  const featuredChocolates = products.slice(0, 4);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <div className="bg-[#FAF5F0] min-h-screen text-[#22120A]">
      {/* 3-SLIDE AUTOMATIC MOVING HERO SLIDER (3 SECONDS DURATION) */}
      <HeroSlider
        onExploreChocolates={() => setCurrentView('customer-shop')}
        onStaffLogin={() => setCurrentView('login')}
        onScrollToStages={() => {
          const el = document.getElementById('bean-to-bar-stages');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* ABOUT OUR FACTORY */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F3] border border-[#F5DADB] text-[#B45309] text-xs font-bold uppercase tracking-wider mb-4">
              About Our Factory
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2E160E] leading-tight mb-6">
              Heritage Craftsmanship Meets Modern Food Science
            </h2>
            <p className="text-stone-700 leading-relaxed mb-4 text-sm sm:text-base">
              Founded with an uncompromising passion for authentic cocoa, Maison Chocolat operates a unified bean-to-bar facility where artisanal Swiss techniques marry precision thermodynamic batch engineering.
            </p>
            <p className="text-stone-700 leading-relaxed mb-6 text-sm sm:text-base">
              We roast exclusively in micro-batches to preserve delicate terroir floral notes, maintain closed-loop inventory traceability, and enforce zero-defect release criteria before any bar leaves our climate-controlled vault.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#EBDCD5]">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#2E160E]">Zero Artificial Additives</h4>
                  <p className="text-xs text-stone-600">Pure cocoa butter, unrefined cane sugar, and authentic vanilla caviar.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#2E160E]">Farm Traceability</h4>
                  <p className="text-xs text-stone-600">Direct fair-trade co-ops in Ecuador, Costa Rica, and Madagascar.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="relative">
            <div className="choco-card p-6 bg-gradient-to-br from-[#FFFBF7] to-[#FFF0F3] border border-[#EBDCD5] shadow-lg relative z-10">
              <div className="flex items-center justify-between pb-4 border-b border-[#EBDCD5] mb-4">
                <div className="flex items-center gap-2">
                  <CocoaPodIcon size={22} className="text-amber-700" />
                  <span className="font-serif font-bold text-[#2E160E]">Maison Batch Traceability</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Certified Active
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs p-3 rounded-lg bg-white border border-[#EFE4DC]">
                  <span className="font-semibold text-stone-600">Silo Origin:</span>
                  <span className="font-bold text-[#2E160E]">Ecuador Criollo (Harvest 2026)</span>
                </div>
                <div className="flex items-center justify-between text-xs p-3 rounded-lg bg-white border border-[#EFE4DC]">
                  <span className="font-semibold text-stone-600">Conching Profile:</span>
                  <span className="font-bold text-[#2E160E]">55°C • Continuous 48 Hours</span>
                </div>
                <div className="flex items-center justify-between text-xs p-3 rounded-lg bg-white border border-[#EFE4DC]">
                  <span className="font-semibold text-stone-600">Fineness Laser Test:</span>
                  <span className="font-bold text-emerald-700">16.8 microns (Target &lt; 18)</span>
                </div>
                <div className="flex items-center justify-between text-xs p-3 rounded-lg bg-white border border-[#EFE4DC]">
                  <span className="font-semibold text-stone-600">Tempering Stability:</span>
                  <span className="font-bold text-[#2E160E]">Form V Polymorph (31.4°C)</span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-[#2E160E] text-amber-200 text-xs flex items-center justify-between">
                <div>
                  <span className="block font-bold">Annual Output Capacity</span>
                  <span className="text-[11px] text-amber-100/70">120,000 Kilograms Fine Cacao</span>
                </div>
                <Award className="w-7 h-7 text-amber-400" />
              </div>
            </div>
            {/* Background decorative blob */}
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-200 to-rose-200 rounded-2xl opacity-40 blur-lg -z-0" />
          </div>
        </div>
      </section>

      {/* OUR CHOCOLATE COLLECTION */}
      <section className="py-20 bg-[#FDFBF7] border-y border-[#EBDCD5] px-4 sm:px-8 lg:px-12 w-full">
        <div className="w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F3] border border-[#F5DADB] text-[#B45309] text-xs font-bold uppercase tracking-wider mb-2">
                Our Chocolate Collection
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2E160E]">
                Handcrafted Masterpieces
              </h2>
            </div>
            <button
              onClick={() => setCurrentView('customer-shop')}
              className="mt-4 sm:mt-0 px-5 py-2.5 rounded-xl bg-[#2E160E] hover:bg-[#4A2818] text-amber-300 text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
            >
              <span>View All 10 Chocolates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredChocolates.map((prod) => (
              <div
                key={prod.id}
                className="choco-card p-4 flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  <ProductArtCard category={prod.category} name={prod.name} className="h-44 mb-3" />
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-amber-700">{prod.category}</span>
                    <span className="text-stone-500 font-mono">{prod.weight}</span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-[#2E160E] line-clamp-1 group-hover:text-amber-800 transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 mt-1 mb-3">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EBDCD5] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-500 block leading-none">Price</span>
                    <span className="font-bold text-base text-[#2E160E]">
                      ${Number(prod.price ?? 0).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        setCurrentView('login');
                        return;
                      }
                      addToCart(prod, 1);
                      alert(`Added 1x ${prod.name} to cart!`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW CHOCOLATE IS MADE: 9-STAGE INTERACTIVE DIAGRAM */}
      <section id="bean-to-bar-stages" className="py-20 px-4 sm:px-8 lg:px-12 w-full scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F3] border border-[#F5DADB] text-[#B45309] text-xs font-bold uppercase tracking-wider mb-3">
            Manufacturing Pipeline
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2E160E] mb-4">
            How Chocolate Is Made: Bean to Bar
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Every batch at Maison Chocolat transitions through nine precision phases under strict temperature, moisture, and sensory control.
          </p>
        </div>

        {/* Stages timeline buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 mb-8">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = activeStage === idx;
            return (
              <button
                key={stage.num}
                onClick={() => setActiveStage(idx)}
                className={`p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                  isSelected
                    ? 'bg-[#2E160E] text-amber-300 shadow-md ring-2 ring-amber-500'
                    : 'bg-white text-stone-700 border border-[#EBDCD5] hover:bg-[#FFF5F7]'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${
                    isSelected ? 'bg-amber-500 text-white' : 'bg-[#FAF5F0] text-[#5C311C]'
                  }`}
                >
                  {stage.num}
                </div>
                <span className="text-[11px] font-bold truncate max-w-full">
                  {stage.short}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Showcase */}
        <div className="choco-card p-6 sm:p-8 bg-gradient-to-br from-[#FFFDFB] to-[#FFF4F6] border border-[#EBDCD5]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#2E160E] text-amber-300 flex items-center justify-center shadow-md">
                {React.createElement(stages[activeStage].icon, { size: 32 })}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Stage 0{stages[activeStage].num} of 09
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#2E160E]">
                  {stages[activeStage].title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStage((prev) => (prev > 0 ? prev - 1 : stages.length - 1))}
                className="px-4 py-2 rounded-lg bg-white border border-[#EBDCD5] text-xs font-bold text-stone-700 hover:bg-[#FDFBF7]"
              >
                Previous Stage
              </button>
              <button
                onClick={() => setActiveStage((prev) => (prev < stages.length - 1 ? prev + 1 : 0))}
                className="px-4 py-2 rounded-lg bg-[#2E160E] text-amber-300 text-xs font-bold hover:bg-[#4A2818]"
              >
                Next Stage
              </button>
            </div>
          </div>

          <p className="text-sm sm:text-base text-stone-700 mt-6 leading-relaxed bg-white/70 p-4 rounded-xl border border-[#EFE4DC]">
            {stages[activeStage].desc}
          </p>
        </div>
      </section>

      {/* QUALITY & SAFETY */}
      <section className="py-20 bg-[#FDFBF7] border-y border-[#EBDCD5] px-4 sm:px-8 lg:px-12 w-full">
        <div className="w-full">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F3] border border-[#F5DADB] text-[#B45309] text-xs font-bold uppercase tracking-wider mb-3">
              Quality & Food Safety
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2E160E] mb-4">
              Rigorous Laboratory & Sensory Standards
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              No batch enters sellable finished stock without passing through chemical, physical, and sensory inspection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="choco-card p-6 bg-white">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2E160E] mb-2">
                HACCP & Moisture Analysis
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Water activity is strictly kept below 0.60 aw (moisture &lt; 1.2%), preventing any microbiological proliferation while safeguarding shelf freshness for 18 months.
              </p>
            </div>

            <div className="choco-card p-6 bg-white">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2E160E] mb-2">
                Particle Size Micrometry
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Refining and conching ensure particles are ground below 18 microns. Human palates detect graininess at 25 microns—ours melts with seamless liquid silkiness.
              </p>
            </div>

            <div className="choco-card p-6 bg-white">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <ThermometerSnowflake className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2E160E] mb-2">
                Beta-V Tempering Index
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Continuous Tempermeter monitoring checks the slope and inflection point of crystallization, guaranteeing zero fat bloom, heat resistance, and clean snap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F3] border border-[#F5DADB] text-[#B45309] text-xs font-bold uppercase tracking-wider mb-3">
            The Maison Distinction
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2E160E] mb-4">
            Why Discerning Chocolatiers Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#EBDCD5] text-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF5F0] text-amber-700 flex items-center justify-center mx-auto mb-4">
              <CocoaPodIcon size={24} />
            </div>
            <h4 className="font-bold text-sm text-[#2E160E] mb-2">Single-Origin Terroir</h4>
            <p className="text-xs text-stone-600">Preserving distinct microclimates, from volcanic Ecuadorian slopes to Madagascar river valleys.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EBDCD5] text-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF5F0] text-amber-700 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#2E160E] mb-2">Slow Conching</h4>
            <p className="text-xs text-stone-600">Never rushed. We let natural air and friction gently evaporate astringent acids over days.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EBDCD5] text-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF5F0] text-amber-700 flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-[#2E160E] mb-2">Climate-Cold Shipping</h4>
            <p className="text-xs text-stone-600">Insulated thermal foil and freeze packs protect all courier orders against temperature spikes.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EBDCD5] text-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF5F0] text-amber-700 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-rose-600" />
            </div>
            <h4 className="font-bold text-sm text-[#2E160E] mb-2">100% Traceable</h4>
            <p className="text-xs text-stone-600">Fair pricing paid directly to cocoa farmers with certified social community reinvestment.</p>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-20 bg-[#2E160E] text-white px-4 sm:px-8 lg:px-12 w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-4">
              Factory Inquiries & Tasting Tours
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-6">
              Connect With Our Master Chocolatier
            </h2>
            <p className="text-amber-100/80 leading-relaxed text-sm mb-8">
              Whether you represent a luxury boutique requiring bespoke couverture or wish to schedule a private sensory tour of our mill, our production team is delighted to connect.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm text-amber-100">740 Cocoa Mill Way, Suite 100, Vallejo, CA 94590</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm text-amber-100">+1 (555) 100-2462 (Factory HQ)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm text-amber-100">contact@artisanalchocofactory.com</span>
              </div>
            </div>
          </div>

          <div className="bg-[#3D2013] p-8 rounded-2xl border border-amber-900/50 shadow-2xl">
            {contactSubmitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-emerald-900/50 text-emerald-300 border border-emerald-500 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-xl text-white mb-2">Message Dispatched!</h3>
                <p className="text-xs text-amber-100/80 max-w-sm mx-auto">
                  Thank you, {contactForm.name || 'Friend'}. Our production concierge will respond to {contactForm.email || 'your email'} within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <h3 className="font-serif font-bold text-xl text-white mb-4">Send a Factory Dispatch</h3>
                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Marie Laurent"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#2A140B] border border-amber-900/60 text-white text-xs placeholder-amber-200/40 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="marie@chocoboutique.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#2A140B] border border-amber-900/60 text-white text-xs placeholder-amber-200/40 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1">Inquiry / Custom Batch Order</label>
                  <textarea
                    required
                    rows={3}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Inquire about wholesale couverture, private labelling, or tour reservations..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#2A140B] border border-amber-900/60 text-white text-xs placeholder-amber-200/40 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Factory HQ</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1A0A04] text-stone-400 py-8 border-t border-stone-800 text-xs px-4 sm:px-6 lg:px-8 text-center">
        <p>© 2026 Maison Artisanal Chocolate Mills • All Rights Reserved • Fully Local Functional Build</p>
      </footer>
    </div>
  );
};
