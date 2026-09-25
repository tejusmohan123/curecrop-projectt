import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ChevronRight,
  Sprout,
  ShieldAlert,
  Thermometer,
  Layers,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { CROPS_DATABASE } from '../data/crops';
import { CropInfo } from '../types';

interface CropEncyclopediaProps {
  onSelectCropForDiagnosis: (cropName: string) => void;
}

export const CropEncyclopedia: React.FC<CropEncyclopediaProps> = ({
  onSelectCropForDiagnosis,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeCrop, setActiveCrop] = useState<CropInfo>(CROPS_DATABASE[0]);

  const categories = [
    'All',
    'Vegetables & Solanaceae',
    'Cereals & Grains',
    'Fruits & Orchards',
    'Cash & Plantation',
  ];

  const filteredCrops = CROPS_DATABASE.filter((crop) => {
    const matchesCategory =
      selectedCategory === 'All' || crop.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.keyDiseases.some((d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <BookOpen className="w-4 h-4" />
              <span>BOTANICAL CROP FINDER & VULNERABILITY ARCHIVE</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-stone-900 tracking-tight">
              Crop Species Directory & Pathology Index
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
              Explore key agricultural cultivars, scientific taxonomy, critical regional pathogen vulnerabilities, and optimal microclimate parameters.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search crops, Latin names, or diseases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          <div className="flex flex-wrap gap-1 p-1 bg-stone-100 rounded-lg w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Directory Grid: Crop List on Left, Active Crop Profile on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Crop Cards List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
          {filteredCrops.map((crop) => {
            const isSelected = activeCrop.id === crop.id;
            return (
              <div
                key={crop.id}
                onClick={() => setActiveCrop(crop)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-600 shadow-xs ring-1 ring-emerald-600/30'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-900">
                      {crop.name}
                    </span>
                    <span className="text-[11px] font-mono text-stone-500 italic">
                      {crop.scientificName}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    {crop.family} · {crop.keyDiseases.length} Major Pathogens
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 transition-colors ${
                    isSelected ? 'text-emerald-700' : 'text-stone-400'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Right Side: Detailed Crop Dossier */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
            {/* Header with Direct Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <div className="text-xs text-emerald-800 font-semibold mb-1">
                  {activeCrop.category} · {activeCrop.family}
                </div>
                <h3 className="font-display text-2xl font-bold text-stone-900">
                  {activeCrop.name}
                </h3>
                <span className="text-xs font-mono italic text-stone-500">
                  {activeCrop.scientificName}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onSelectCropForDiagnosis(activeCrop.name)}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-center cursor-pointer"
              >
                <span>Launch Diagnostic Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed">
              {activeCrop.description}
            </p>

            {/* Environmental Requirements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                  Thermal & Moisture Range
                </div>
                <div className="text-xs text-stone-600">
                  Temp: {activeCrop.optimalTemp}
                </div>
                <div className="text-xs text-stone-600">
                  RH: {activeCrop.optimalHumidity}
                </div>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 mb-1">
                  <Layers className="w-3.5 h-3.5 text-stone-600" />
                  Soil & Drainage Needs
                </div>
                <div className="text-xs text-stone-600">
                  {activeCrop.soilRequirements}
                </div>
              </div>
            </div>

            {/* Critical Pathogens & Key Symptoms */}
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                High-Impact Vulnerabilities & Key Symptoms
              </h4>

              <div className="space-y-3">
                {activeCrop.keyDiseases.map((dis, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">
                        {dis.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold bg-red-100 text-red-800">
                        {dis.severity} Threat
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-stone-500 italic">
                      Agent: {dis.pathogen}
                    </div>
                    <p className="text-xs text-stone-600 mt-1">
                      {dis.symptoms}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Field Scouting Protocol */}
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
              <h4 className="text-xs font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                Agronomist Field Scouting Protocol
              </h4>
              <p className="text-xs text-emerald-900 leading-relaxed">
                {activeCrop.scoutingTips}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
