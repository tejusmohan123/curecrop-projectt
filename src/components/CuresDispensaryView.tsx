import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Search,
  Leaf,
  Filter,
  PackageCheck,
  Truck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { CURES_CATALOG } from '../data/curesDispensary';
import { CureProduct } from '../types';
import { CureCard } from './CureCard';

interface CuresDispensaryViewProps {
  onAddToCart: (product: CureProduct, quantity?: number) => void;
  cartItemIds: string[];
}

export const CuresDispensaryView: React.FC<CuresDispensaryViewProps> = ({
  onAddToCart,
  cartItemIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);

  const categories = [
    'All',
    'Organic Bio-Fungicide',
    'Systemic Curative',
    'Protective Contact',
    'Bio-Bactericide',
    'Nutrient Foliar',
    'Bio-Insecticide',
    'Soil Remediation',
  ];

  const filteredCures = useMemo(() => {
    return CURES_CATALOG.filter((cure) => {
      const matchesSearch =
        cure.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cure.activeIngredient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cure.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cure.targetInfections.some((inf) =>
          inf.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === 'All' || cure.category === selectedCategory;

      const matchesOrganic = !organicOnly || cure.certifiedOrganic;

      return matchesSearch && matchesCategory && matchesOrganic;
    });
  }, [searchQuery, selectedCategory, organicOnly]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 border border-emerald-900 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
            <Sparkles className="w-4 h-4" />
            <span>AGRONOMIC PHARMACY & CURE DISPENSARY</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Targeted Crop Disease Cures & Treatments
          </h2>
          <p className="text-xs text-emerald-200/80 leading-relaxed">
            EPA-registered and OMRI-certified biological and chemical crop cures. Formulated for field eradication of fungal blights, bacterial wilts, leaf spots, and physiological nutrient deficiencies.
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-emerald-900/80 flex flex-wrap items-center gap-4 text-xs text-emerald-200/90 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-amber-300 bg-emerald-900 px-2 py-0.5 rounded border border-emerald-700">Verified Indian Agri-Market MRPs (₹ INR)</span>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-semibold">⚡ Quick 60-Min Emergency Delivery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>Normal 1-2 Days Farm Shipping</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>CIBRC & OMRI Certified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            <span>Exact Dilution & PHI Charts</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by infection (e.g. Late Blight, Powdery Mildew), active ingredient, or product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-stone-300 rounded-xl focus:ring-1 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => setOrganicOnly(!organicOnly)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors shrink-0 cursor-pointer ${
              organicOnly
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'
            }`}
          >
            <Leaf className={`w-3.5 h-3.5 ${organicOnly ? 'text-emerald-700' : 'text-stone-400'}`} />
            <span>OMRI Organic Only</span>
          </button>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cure Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCures.length > 0 ? (
          filteredCures.map((cure) => (
            <CureCard
              key={cure.id}
              cure={cure}
              onAddToCart={onAddToCart}
              isInCart={cartItemIds.includes(cure.id)}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-stone-500 bg-white rounded-2xl border border-stone-200 p-8 space-y-2">
            <p className="text-sm font-semibold text-stone-800">No cure formulations match your criteria.</p>
            <p className="text-xs text-stone-500">
              Try adjusting your search terms or clearing the organic-only filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
