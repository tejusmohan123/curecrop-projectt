import React, { useState } from 'react';
import {
  ShoppingCart,
  Check,
  Leaf,
  Clock,
  FlaskConical,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { CureProduct } from '../types';

interface CureCardProps {
  cure: CureProduct;
  onAddToCart: (product: CureProduct, quantity?: number) => void;
  isInCart?: boolean;
}

export const CureCard: React.FC<CureCardProps> = ({
  cure,
  onAddToCart,
  isInCart = false,
}) => {
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(cure, 1);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1800);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 hover:border-emerald-300 transition-all shadow-xs overflow-hidden flex flex-col justify-between">
      <div className="p-4 space-y-3">
        {/* Top Badges & Price */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {cure.certifiedOrganic ? (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                <Leaf className="w-2.5 h-2.5 text-emerald-600" />
                OMRI ORGANIC
              </span>
            ) : (
              <span className="text-[10px] font-bold text-stone-700 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded flex items-center gap-1">
                <FlaskConical className="w-2.5 h-2.5 text-stone-500" />
                CONVENTIONAL AGRONOMIC
              </span>
            )}
            <span className="text-[10px] font-mono text-stone-500 bg-stone-50 px-1.5 py-0.5 rounded border border-stone-200/60">
              {cure.category}
            </span>
          </div>

          <div className="text-right shrink-0">
            <span className="font-mono text-base font-bold text-stone-900 block leading-none">
              ₹{cure.price.toFixed(0)}
            </span>
            <span className="text-[10px] text-stone-400 block mt-0.5">
              {cure.unit}
            </span>
          </div>
        </div>

        {/* Product Title */}
        <div>
          <h4 className="font-display font-bold text-stone-900 text-sm leading-snug">
            {cure.name}
          </h4>
          <div className="text-xs text-stone-600 font-mono mt-0.5">
            Active: <span className="font-medium text-stone-800">{cure.activeIngredient}</span>
          </div>
        </div>

        {/* Mechanism Description */}
        <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
          {cure.description}
        </p>

        {/* Dosage Instructions Box */}
        <div className="bg-stone-50/90 rounded-lg p-2.5 border border-stone-200/80 space-y-1">
          <div className="text-[11px] font-semibold text-stone-800 flex items-center gap-1">
            <span className="text-emerald-700">●</span> Application Dosage:
          </div>
          <p className="text-[11px] text-stone-600 leading-normal">
            {cure.dosageInstructions}
          </p>
        </div>

        {/* Safety Interval & Rating */}
        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-stone-400" />
            <span>Pre-Harvest Interval (PHI): </span>
            <span className="font-mono font-semibold text-stone-700">
              {cure.safetyIntervalDays === 0 ? 'Same Day (0 Days)' : `${cure.safetyIntervalDays} Days`}
            </span>
          </div>

          {cure.rating && (
            <div className="flex items-center gap-1 font-mono text-stone-700">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>{cure.rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2">
        <span className="text-[11px] font-mono text-emerald-800 font-medium">
          In Stock · Fast Farm Dispatch
        </span>

        <button
          type="button"
          onClick={handleAdd}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
            justAdded
              ? 'bg-emerald-700 text-white'
              : isInCart
              ? 'bg-emerald-800 hover:bg-emerald-700 text-white'
              : 'bg-emerald-800 hover:bg-emerald-700 text-white'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
