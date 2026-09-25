import React, { useState, useMemo } from 'react';
import {
  Activity,
  Check,
  Search,
  Filter,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Droplets,
  Thermometer,
  Layers,
  Info,
} from 'lucide-react';
import { SYMPTOMS_LIST, calculateSymptomCorrelations } from '../data/symptoms';
import { PlantOrgan } from '../types';

interface SymptomMatrixDashboardProps {
  selectedSymptomIds: string[];
  onToggleSymptom: (id: string) => void;
  onClearSymptoms: () => void;
  onRunSymptomDiagnosis: (symptomIds: string[], environmentalData: any) => void;
  isAnalyzing: boolean;
}

export const SymptomMatrixDashboard: React.FC<SymptomMatrixDashboardProps> = ({
  selectedSymptomIds,
  onToggleSymptom,
  onClearSymptoms,
  onRunSymptomDiagnosis,
  isAnalyzing,
}) => {
  const [selectedOrgan, setSelectedOrgan] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [simTemp, setSimTemp] = useState<number>(22);
  const [simHumidity, setSimHumidity] = useState<number>(85);
  const [simWetness, setSimWetness] = useState<string>('Moderate Dew / Showers');

  const organs = ['All', 'Foliage / Leaf', 'Stem & Base', 'Fruit & Pod', 'Root & Soil'];

  // Filter symptoms
  const filteredSymptoms = useMemo(() => {
    return SYMPTOMS_LIST.filter((sym) => {
      const matchesOrgan = selectedOrgan === 'All' || sym.organ === selectedOrgan;
      const matchesQuery =
        searchQuery === '' ||
        sym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sym.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sym.correlatedConditions.some((c) =>
          c.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesOrgan && matchesQuery;
    });
  }, [selectedOrgan, searchQuery]);

  // Calculate live correlation matches
  const correlationResults = useMemo(() => {
    return calculateSymptomCorrelations(selectedSymptomIds);
  }, [selectedSymptomIds]);

  // Microclimate risk calculation
  const fungalRisk = useMemo(() => {
    let score = 20;
    if (simHumidity > 70) score += 35;
    if (simHumidity > 85) score += 20;
    if (simTemp >= 16 && simTemp <= 26) score += 25;
    return Math.min(100, score);
  }, [simTemp, simHumidity]);

  const handleSynthesize = () => {
    onRunSymptomDiagnosis(selectedSymptomIds, {
      temperature: simTemp,
      humidity: simHumidity,
      recentRainfall: simWetness,
      soilCondition: 'Well-Drained Sandy Loam',
    });
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <Activity className="w-4 h-4" />
              <span>INTERACTIVE SYMPTOM MATRIX & MICROCLIMATE SIMULATOR</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-stone-900 tracking-tight">
              Anatomical Pathology Correlation Engine
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
              Select macroscopic physical symptoms across plant anatomy to view real-time statistical pathogen correlations, evaluate microclimate infection risk, and execute AI diagnostic synthesis.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedSymptomIds.length > 0 && (
              <button
                type="button"
                onClick={onClearSymptoms}
                className="px-3 py-2 text-xs text-stone-600 hover:text-red-700 transition-colors cursor-pointer"
              >
                Reset Checklist ({selectedSymptomIds.length})
              </button>
            )}

            <button
              type="button"
              onClick={handleSynthesize}
              disabled={selectedSymptomIds.length === 0 || isAnalyzing}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                selectedSymptomIds.length === 0 || isAnalyzing
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-emerald-800 hover:bg-emerald-700 text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>{isAnalyzing ? 'Analyzing Pathogen...' : 'Synthesize AI Diagnosis'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left is Selector & Search, Right is Live Correlation & Microclimate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Symptom Filter & Checklist */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
            {/* Search & Organ Tabs */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search symptoms (e.g., chlorosis, pustule, wilt)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              {/* Organ Filter Tabs */}
              <div className="flex flex-wrap gap-1 p-1 bg-stone-100 rounded-lg w-full sm:w-auto">
                {organs.map((organ) => (
                  <button
                    key={organ}
                    type="button"
                    onClick={() => setSelectedOrgan(organ)}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                      selectedOrgan === organ
                        ? 'bg-white text-stone-900 shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {organ.replace(' / ', '/')}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptom Checklist Cards */}
            <div className="grid grid-cols-1 gap-2.5 max-h-[560px] overflow-y-auto pr-1">
              {filteredSymptoms.map((symptom) => {
                const isSelected = selectedSymptomIds.includes(symptom.id);
                return (
                  <div
                    key={symptom.id}
                    onClick={() => onToggleSymptom(symptom.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 shadow-xs'
                        : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'bg-emerald-700 border-emerald-700 text-white'
                          : 'border-stone-300 bg-stone-50'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-stone-900">
                          {symptom.name}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">
                          {symptom.organ}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1 leading-snug">
                        {symptom.description}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-stone-500">
                        <span className="font-medium text-stone-600">Correlates:</span>
                        <span>{symptom.correlatedConditions.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Live Correlation & Microclimate Simulator */}
        <div className="lg:col-span-5 space-y-4">
          {/* Live Pathogen Correlation Meter */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Statistical Pathogen Correlation
                </h3>
                <p className="text-xs text-stone-500">
                  Calculated against current checked symptoms
                </p>
              </div>
              <span className="text-xs font-mono text-stone-400">LIVE</span>
            </div>

            {selectedSymptomIds.length === 0 ? (
              <div className="py-10 text-center text-xs text-stone-400">
                <Info className="w-6 h-6 text-stone-300 mx-auto mb-2" />
                Select one or more symptoms on the left to activate statistical pathology matching.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {correlationResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-stone-900">
                          {result.condition}
                        </span>
                        <div className="text-[10px] text-stone-500">
                          Category: {result.category}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-base font-bold text-emerald-800 tabular-nums">
                          {result.confidenceEstimate}%
                        </span>
                        <span className="text-[10px] text-stone-400 block">Match Score</span>
                      </div>
                    </div>

                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${result.confidenceEstimate}%` }}
                      />
                    </div>

                    <div className="text-[11px] text-stone-500">
                      Matched: {result.matchedSymptoms.length} symptom(s) observed
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Microclimate Spore Incubation Simulator */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Microclimate Infection Pressure
                </h3>
                <p className="text-xs text-stone-500">
                  Simulate field temperature & humidity conditions
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Risk: {fungalRisk}%
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                    Field Temperature
                  </span>
                  <span className="font-mono tabular-nums font-semibold">{simTemp}°C</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={simTemp}
                  onChange={(e) => setSimTemp(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-700 cursor-pointer h-1.5 bg-stone-200 rounded-lg appearance-none"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-600" />
                    Relative Humidity
                  </span>
                  <span className="font-mono tabular-nums font-semibold">{simHumidity}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={simHumidity}
                  onChange={(e) => setSimHumidity(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-stone-200 rounded-lg appearance-none"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600">
                <span className="font-semibold text-stone-800">Field Scout Insight: </span>
                {fungalRisk > 75
                  ? 'Foliar wetness and optimal thermal windows trigger rapid secondary spore germination within 6 to 12 hours.'
                  : 'Foliar disease transmission remains in moderate dormancy; maintain scouting routine every 48 hours.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
