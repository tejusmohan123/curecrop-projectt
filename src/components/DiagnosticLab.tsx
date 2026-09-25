import React, { useState } from 'react';
import {
  Sparkles,
  Microscope,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { EnvironmentalControls } from './EnvironmentalControls';
import { SymptomQuickSelector } from './SymptomQuickSelector';
import { DiagnosticReportView } from './DiagnosticReportView';
import {
  DiagnosticResult,
  EnvironmentalContext,
  CureProduct,
} from '../types';

interface DiagnosticLabProps {
  onOpenConsultant: () => void;
  onSaveLog: (report: DiagnosticResult) => void;
  savedLogIds: string[];
  onAddToCart?: (product: CureProduct, quantity?: number) => void;
  cartItemIds?: string[];
}

export const DiagnosticLab: React.FC<DiagnosticLabProps> = ({
  onOpenConsultant,
  onSaveLog,
  savedLogIds,
  onAddToCart,
  cartItemIds = [],
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [selectedSymptomIds, setSelectedSymptomIds] = useState<string[]>([]);

  const [environmentalContext, setEnvironmentalContext] = useState<EnvironmentalContext>({
    temperature: 22,
    humidity: 78,
    recentRainfall: 'Light Dew / Showers',
    soilCondition: 'Well-Drained Sandy Loam',
  });

  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageSelected = (base64: string, mimeType: string) => {
    setImageSrc(base64);
    setImageMimeType(mimeType);
    setErrorMessage(null);
  };

  const handleClearImage = () => {
    setImageSrc(null);
  };

  const handleToggleSymptom = (symId: string) => {
    if (selectedSymptomIds.includes(symId)) {
      setSelectedSymptomIds(selectedSymptomIds.filter((id) => id !== symId));
    } else {
      setSelectedSymptomIds([...selectedSymptomIds, symId]);
    }
  };

  const executeDiagnosis = async () => {
    if (!imageSrc && selectedSymptomIds.length === 0) {
      setErrorMessage('Please either upload/capture a plant foliage specimen or select at least one observed symptom.');
      return;
    }

    setIsDiagnosing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: imageSrc,
          imageMimeType,
          cropHint: '', // Let AI detect the plant species automatically
          selectedSymptoms: selectedSymptomIds,
          environmentalContext,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Server returned an error during crop pathology analysis.');
      }

      const result: DiagnosticResult = {
        ...data.diagnosis,
        id: 'diag-' + Date.now(),
        timestamp: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        sampleImage: imageSrc || undefined,
        location: environmentalContext.gpsLocation
          ? {
              lat: environmentalContext.gpsLocation.lat,
              lng: environmentalContext.gpsLocation.lng,
              address: environmentalContext.gpsLocation.address,
              regionName: environmentalContext.gpsLocation.regionName,
            }
          : undefined,
      };

      setDiagnosticResult(result);
    } catch (err: any) {
      console.error('Diagnosis failed:', err);
      setErrorMessage(
        err.message || 'Diagnostic service error. Ensure GEMINI_API_KEY is configured.'
      );
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleResetScan = () => {
    setDiagnosticResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* If diagnostic result exists, show report with option to re-scan */}
      {diagnosticResult ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between no-print">
            <button
              type="button"
              onClick={handleResetScan}
              className="flex items-center gap-2 text-xs font-semibold text-emerald-800 hover:text-emerald-700 bg-white border border-stone-200 px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Diagnose Another Specimen</span>
            </button>

            <span className="text-xs text-stone-500 font-mono">
              Diagnostic Session ID: {diagnosticResult.id}
            </span>
          </div>

          <DiagnosticReportView
            report={diagnosticResult}
            onOpenConsultant={onOpenConsultant}
            onSaveLog={() => onSaveLog(diagnosticResult)}
            isSaved={diagnosticResult.id ? savedLogIds.includes(diagnosticResult.id) : false}
            onRescan={handleResetScan}
            onAddToCart={onAddToCart}
            cartItemIds={cartItemIds}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Diagnostic Lab Intro Header */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <Microscope className="w-4 h-4" />
              <span>AUTOMATED BOTANICAL IDENTIFICATION & PATHOLOGY DIAGNOSTIC STATION</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Crop Specimen Diagnostic Lab
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
              Upload foliage imagery and configure field microclimate conditions. Gemini AI automatically identifies the crop or plant species, distinguishes non-plant objects, evaluates disease markers, and prescribes actionable agronomic treatment protocols.
            </p>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Diagnosis Error: </span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Specimen Visual Workspace */}
          <div>
            <div className="text-xs font-semibold text-stone-800 mb-2">
              1. Foliar Visual Specimen (Upload or Camera Capture):
            </div>
            <ImageUploader
              imageSrc={imageSrc}
              onImageSelected={handleImageSelected}
              onClearImage={handleClearImage}
            />
          </div>

          {/* Environmental Field Controls */}
          <div>
            <div className="text-xs font-semibold text-stone-800 mb-2">
              2. Field Microclimate Conditions:
            </div>
            <EnvironmentalControls
              value={environmentalContext}
              onChange={setEnvironmentalContext}
            />
          </div>

          {/* Symptom Checklist */}
          <div>
            <div className="text-xs font-semibold text-stone-800 mb-2">
              3. Macroscopic Visual Symptoms (Optional Observation Aid):
            </div>
            <SymptomQuickSelector
              selectedSymptomIds={selectedSymptomIds}
              onToggleSymptom={handleToggleSymptom}
              onClearAll={() => setSelectedSymptomIds([])}
            />
          </div>

          {/* Main Action Bar */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-600">
              Crop Identification: <span className="font-semibold text-emerald-800">Auto-Detect via AI</span> ·{' '}
              Specimen: <span className="font-semibold text-stone-900">{imageSrc ? 'Loaded' : 'None (Symptom only)'}</span> ·{' '}
              Symptoms Tagged: <span className="font-semibold text-stone-900 font-mono">{selectedSymptomIds.length}</span>
            </div>

            <button
              type="button"
              onClick={executeDiagnosis}
              disabled={isDiagnosing}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isDiagnosing
                  ? 'bg-stone-400 cursor-wait'
                  : 'bg-emerald-800 hover:bg-emerald-700 active:scale-98'
              }`}
            >
              {isDiagnosing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                  <span>Identifying Plant & Analyzing Pathology...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Execute AI Botanical Diagnosis</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
