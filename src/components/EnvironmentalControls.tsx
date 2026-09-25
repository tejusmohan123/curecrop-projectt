import React, { useState } from 'react';
import { Thermometer, Droplets, CloudRain, Layers, AlertTriangle, MapPin, Loader2 } from 'lucide-react';
import { EnvironmentalContext } from '../types';

interface EnvironmentalControlsProps {
  value: EnvironmentalContext;
  onChange: (updated: EnvironmentalContext) => void;
}

export const EnvironmentalControls: React.FC<EnvironmentalControlsProps> = ({
  value,
  onChange,
}) => {
  // Calculate microclimate pathogen risk score
  const isHighHumidity = value.humidity >= 75;
  const isFungalTemp = value.temperature >= 15 && value.temperature <= 28;
  const isHeavyRain = value.recentRainfall === 'Heavy Continuous Rain' || value.recentRainfall === 'Flooding';

  let sporeRisk = 'Low Spore Incubation Risk';
  let sporeRiskColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let riskPercentage = 22;

  if (isHighHumidity && isFungalTemp && isHeavyRain) {
    sporeRisk = 'Critical Spore Germination Window (High Risk)';
    sporeRiskColor = 'text-red-700 bg-red-50 border-red-200';
    riskPercentage = 94;
  } else if ((isHighHumidity && isFungalTemp) || isHeavyRain) {
    sporeRisk = 'Elevated Foliar Pathogen Pressure';
    sporeRiskColor = 'text-amber-800 bg-amber-50 border-amber-200';
    riskPercentage = 68;
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
        <div>
          <h4 className="text-sm font-semibold text-stone-900">Microclimate & Field Environment</h4>
          <p className="text-xs text-stone-500">Environmental parameters refine pathogen infection prediction</p>
        </div>
        <div className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5 ${sporeRiskColor}`}>
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{sporeRisk}</span>
          <span className="font-mono text-[11px] font-bold">({riskPercentage}%)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Temperature */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-stone-700">
            <span className="flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-amber-600" />
              Canopy Temp
            </span>
            <span className="font-mono tabular-nums font-semibold text-stone-900">
              {value.temperature}°C ({Math.round(value.temperature * 1.8 + 32)}°F)
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="45"
            step="1"
            value={value.temperature}
            onChange={(e) =>
              onChange({ ...value, temperature: parseInt(e.target.value, 10) })
            }
            className="w-full accent-emerald-700 cursor-pointer h-1.5 bg-stone-200 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-stone-400 font-mono">
            <span>5°C Cold</span>
            <span>25°C Optimal</span>
            <span>45°C Heat</span>
          </div>
        </div>

        {/* Relative Humidity */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-stone-700">
            <span className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-600" />
              Relative Humidity
            </span>
            <span className="font-mono tabular-nums font-semibold text-stone-900">
              {value.humidity}%
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            step="1"
            value={value.humidity}
            onChange={(e) =>
              onChange({ ...value, humidity: parseInt(e.target.value, 10) })
            }
            className="w-full accent-blue-600 cursor-pointer h-1.5 bg-stone-200 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-stone-400 font-mono">
            <span>20% Arid</span>
            <span>60% Moderate</span>
            <span>100% Saturation</span>
          </div>
        </div>

        {/* Recent Rainfall */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-stone-700">
            <CloudRain className="w-4 h-4 text-sky-600" />
            Leaf Wetness & Rain
          </label>
          <select
            value={value.recentRainfall}
            onChange={(e) =>
              onChange({
                ...value,
                recentRainfall: e.target.value as EnvironmentalContext['recentRainfall'],
              })
            }
            className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
          >
            <option value="None">Dry (No recent rain)</option>
            <option value="Light Dew / Showers">Morning Dew / Light Showers</option>
            <option value="Heavy Continuous Rain">Heavy Continuous Rain (&gt;24h)</option>
            <option value="Flooding">Waterlogged / Flooding Event</option>
          </select>
        </div>

        {/* Soil Condition */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-stone-700">
            <Layers className="w-4 h-4 text-stone-600" />
            Root Zone Soil Status
          </label>
          <select
            value={value.soilCondition}
            onChange={(e) =>
              onChange({
                ...value,
                soilCondition: e.target.value as EnvironmentalContext['soilCondition'],
              })
            }
            className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
          >
            <option value="Well-Drained Sandy Loam">Well-Drained Sandy Loam</option>
            <option value="Heavy Clay / Waterlogged">Heavy Clay / Poor Drainage</option>
            <option value="Dry / Drought-Stressed">Dry / Drought-Stressed</option>
            <option value="Saline / Compacted">Compacted / Saline Subsoil</option>
          </select>
        </div>
      </div>

      {/* Field Geotag Location with Google Maps Coordinates */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
          <div>
            <span className="font-semibold text-stone-800">Plot Geotag: </span>
            {value.gpsLocation ? (
              <span className="text-stone-700 font-mono text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {value.gpsLocation.address || `${value.gpsLocation.lat.toFixed(4)}, ${value.gpsLocation.lng.toFixed(4)}`}
              </span>
            ) : (
              <span className="text-stone-400 italic">Not tagged (Regional defaults applied)</span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!navigator.geolocation) {
              alert('Geolocation is not supported by your browser.');
              return;
            }
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                onChange({
                  ...value,
                  gpsLocation: {
                    lat,
                    lng,
                    address: `GPS: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`,
                  },
                });
              },
              (err) => {
                console.warn(err);
                alert('Could not retrieve GPS coordinates. Please ensure location permissions are granted.');
              }
            );
          }}
          className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-lg text-[11px] transition-colors cursor-pointer border border-stone-300"
        >
          <MapPin className="w-3 h-3 text-emerald-700" />
          <span>{value.gpsLocation ? 'Re-tag GPS' : 'Tag Field Coordinates'}</span>
        </button>
      </div>
    </div>
  );
};
