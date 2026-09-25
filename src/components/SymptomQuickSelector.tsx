import React, { useState } from 'react';
import { Check, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { SYMPTOMS_LIST } from '../data/symptoms';
import { PlantOrgan } from '../types';

interface SymptomQuickSelectorProps {
  selectedSymptomIds: string[];
  onToggleSymptom: (symptomId: string) => void;
  onClearAll: () => void;
}

export const SymptomQuickSelector: React.FC<SymptomQuickSelectorProps> = ({
  selectedSymptomIds,
  onToggleSymptom,
  onClearAll,
}) => {
  const [selectedOrgan, setSelectedOrgan] = useState<PlantOrgan>('Foliage / Leaf');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const organs: PlantOrgan[] = [
    'Foliage / Leaf',
    'Stem & Base',
    'Fruit & Pod',
    'Root & Soil',
  ];

  const filteredSymptoms = SYMPTOMS_LIST.filter(
    (sym) => sym.organ === selectedOrgan
  );

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-700" />
          <h4 className="text-sm font-semibold text-stone-900">
            Observed Symptom Checklist
          </h4>
          {selectedSymptomIds.length > 0 && (
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
              {selectedSymptomIds.length} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedSymptomIds.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-stone-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-stone-400 hover:text-stone-700 rounded cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          {/* Organ Filter Segmented Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-stone-100 rounded-lg">
            {organs.map((organ) => {
              const activeCount = SYMPTOMS_LIST.filter(
                (s) => s.organ === organ && selectedSymptomIds.includes(s.id)
              ).length;
              return (
                <button
                  key={organ}
                  type="button"
                  onClick={() => setSelectedOrgan(organ)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                    selectedOrgan === organ
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>{organ}</span>
                  {activeCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center font-mono">
                      {activeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Symptom Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {filteredSymptoms.map((symptom) => {
              const isSelected = selectedSymptomIds.includes(symptom.id);
              return (
                <button
                  key={symptom.id}
                  type="button"
                  onClick={() => onToggleSymptom(symptom.id)}
                  className={`text-left p-2.5 rounded-lg border text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500/80 text-emerald-950 shadow-xs'
                      : 'bg-stone-50/60 border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-emerald-700 border-emerald-700 text-white'
                        : 'border-stone-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <div className="font-medium text-stone-900 leading-snug">
                      {symptom.name}
                    </div>
                    <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      {symptom.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
