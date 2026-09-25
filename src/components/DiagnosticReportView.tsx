import React from 'react';
import {
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Leaf,
  Droplet,
  FlaskConical,
  Sprout,
  Printer,
  BookmarkPlus,
  MessageSquareText,
  Clock,
  ArrowRight,
  TrendingDown,
  Layers,
  HelpCircle,
  Camera,
  Image as ImageIcon,
  ShoppingCart,
  Sparkles,
  Zap,
} from 'lucide-react';
import { DiagnosticResult, CureProduct } from '../types';
import { CureCard } from './CureCard';
import { getTailoredCuresForCondition } from '../data/curesDispensary';

interface DiagnosticReportViewProps {
  report: DiagnosticResult;
  onOpenConsultant: () => void;
  onSaveLog: () => void;
  isSaved?: boolean;
  onRescan?: () => void;
  onAddToCart?: (product: CureProduct, quantity?: number) => void;
  cartItemIds?: string[];
}

export const DiagnosticReportView: React.FC<DiagnosticReportViewProps> = ({
  report,
  onOpenConsultant,
  onSaveLog,
  isSaved,
  onRescan,
  onAddToCart,
  cartItemIds = [],
}) => {
  const handlePrint = () => {
    window.print();
  };

  const targetedCures = report.prescribedCures && report.prescribedCures.length > 0
    ? report.prescribedCures
    : getTailoredCuresForCondition(report.conditionName, report.conditionCategory, report.cropIdentified);

  const totalCuresSum = targetedCures.reduce((sum, c) => sum + c.price, 0);

  // If the uploaded image is differentiated as a random non-plant object
  if (report.isPlantOrCrop === false) {
    return (
      <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Rejection Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 mb-1">
                <span>BOTANICAL VALIDATION ALERT</span>
                <span>·</span>
                <span className="font-mono">{report.timestamp || new Date().toLocaleDateString()}</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-stone-900 tracking-tight">
                Non-Plant Object Detected
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                The visual pathology engine verified this image and determined it is not agricultural crop foliage or plant tissue.
              </p>
            </div>
          </div>

          {onRescan && (
            <button
              type="button"
              onClick={onRescan}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              Upload Plant Specimen
            </button>
          )}
        </div>

        {/* Specimen vs Plant Requirement Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Detected Subject
              </span>
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                Non-Botanical
              </span>
            </div>
            <div className="text-base font-bold text-stone-900">
              {report.nonPlantDetected || 'Random Non-Plant Subject / Object'}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {report.pathologySummary}
            </p>
          </div>

          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Required Specimen Input
              </span>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Plant / Crop Only
              </span>
            </div>
            <div className="text-base font-bold text-emerald-950">
              Crop Foliage, Stems, Pods, or Fruits
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              CureCrop is calibrated strictly for agricultural botany and plant pathology to detect fungal blights, bacterial wilts, viruses, and nutrient deficiencies.
            </p>
          </div>
        </div>

        {/* Guidance for photographing crops */}
        <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 space-y-3">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-emerald-700" />
            Field Scout Guide: How to Photograph Crops for Diagnosis
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-700">
            <div className="bg-white p-3 rounded-lg border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">1. Close-up on Lesions</span>
              Focus on the transitional margin between healthy green tissue and active spots or chlorosis.
            </div>
            <div className="bg-white p-3 rounded-lg border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">2. Natural Sunlight</span>
              Avoid extreme glare or artificial indoor shadows; illuminate leaf veining clearly.
            </div>
            <div className="bg-white p-3 rounded-lg border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">3. Check Leaf Underside</span>
              For downy mildews and rusts, photograph the abaxial (underside) where spores congregate.
            </div>
          </div>

          {report.guidanceForRescan && (
            <p className="text-xs text-stone-600 pt-2 border-t border-stone-200">
              <span className="font-semibold text-stone-800">Specialist Tip: </span>
              {report.guidanceForRescan}
            </p>
          )}
        </div>

        {/* Action button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {onRescan && (
            <button
              type="button"
              onClick={onRescan}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Take or Upload Crop Specimen Photo
            </button>
          )}
        </div>
      </div>
    );
  }

  // Standard Botanical Pathology Report
  const getSeverityStyle = (level: string) => {
    switch (level) {
      case 'Healthy':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          barBg: 'bg-emerald-500',
          icon: CheckCircle2,
        };
      case 'Mild':
        return {
          bg: 'bg-lime-50',
          border: 'border-lime-200',
          text: 'text-lime-800',
          barBg: 'bg-lime-500',
          icon: AlertTriangle,
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          barBg: 'bg-amber-500',
          icon: AlertTriangle,
        };
      case 'Severe':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-800',
          barBg: 'bg-orange-500',
          icon: AlertOctagon,
        };
      case 'Critical':
      default:
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          barBg: 'bg-red-600',
          icon: ShieldAlert,
        };
    }
  };

  const severityStyle = getSeverityStyle(report.severityLevel);
  const SeverityIcon = severityStyle.icon;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
      {/* Top Clinical Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span className="font-semibold text-emerald-800">BOTANICAL PATHOLOGY REPORT</span>
            <span>·</span>
            <span className="font-mono">{report.timestamp || new Date().toLocaleDateString()}</span>
            <span>·</span>
            <span>Category: {report.conditionCategory}</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {report.conditionName}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-sm font-medium text-stone-600">
              Specimen Host: <span className="text-stone-900 font-semibold">{report.cropIdentified}</span>
            </p>
            {report.location?.address && (
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                📍 {report.location.address}
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions (Print, Consult, Save) */}
        <div className="flex items-center gap-2.5 no-print shrink-0">
          <button
            type="button"
            onClick={onOpenConsultant}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>Consult Agronomist AI</span>
          </button>

          <button
            type="button"
            onClick={onSaveLog}
            disabled={isSaved}
            className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isSaved
                ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-default'
                : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
            }`}
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isSaved ? 'Saved to Log' : 'Save Log'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="p-2 border border-stone-300 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
            title="Print or Save PDF Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Clinical Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Confidence Score */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
          <span className="text-xs font-medium text-stone-500">Diagnostic Confidence</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-2xl font-bold tabular-nums text-stone-900">
              {report.confidenceScore}%
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">Model Certainty</span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${report.confidenceScore}%` }}
            />
          </div>
        </div>

        {/* Severity Index */}
        <div className={`rounded-xl p-4 border ${severityStyle.bg} ${severityStyle.border}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-600">Severity Assessment</span>
            <SeverityIcon className={`w-4 h-4 ${severityStyle.text}`} />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`font-mono text-2xl font-bold tabular-nums ${severityStyle.text}`}>
              {report.severityLevel}
            </span>
            <span className="text-xs font-mono text-stone-500">
              ({report.severityScore}/100)
            </span>
          </div>
          <div className="w-full bg-stone-200/80 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`${severityStyle.barBg} h-full rounded-full transition-all duration-500`}
              style={{ width: `${report.severityScore}%` }}
            />
          </div>
        </div>

        {/* Urgency */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Action Urgency</span>
            <Clock className="w-4 h-4 text-stone-400" />
          </div>
          <div className="mt-1">
            <span className="text-base font-semibold text-stone-900 leading-tight block">
              {report.urgency}
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              Progression: {report.progressionStage}
            </span>
          </div>
        </div>

        {/* Estimated Yield Risk */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Yield Impact (Untreated)</span>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </div>
          <div className="mt-1">
            <span className="text-sm font-semibold text-stone-900 block leading-tight">
              {report.yieldImpactEstimate}
            </span>
            <span className="text-[11px] text-red-700 font-medium block mt-0.5">
              Rapid spread potential
            </span>
          </div>
        </div>
      </div>

      {/* Pathology Breakdown & Visual Markers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-stone-50/70 rounded-xl p-5 border border-stone-200">
            <h3 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-emerald-800" />
              Pathology & Organism Mechanism
            </h3>
            <div className="text-xs text-stone-600 font-mono mb-2">
              Causal Agent: <span className="font-semibold text-stone-900">{report.causalOrganism}</span>
            </div>
            <p className="text-xs leading-relaxed text-stone-700">
              {report.pathologySummary}
            </p>
          </div>

          {/* Visual Markers Recognized on Specimen */}
          <div className="bg-white rounded-xl p-5 border border-stone-200">
            <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-800" />
              Observed Pathological Markers on Foliage
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {report.detectedVisualMarkers.map((marker, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-200/80"
                >
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>{marker}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-stone-500">
              <span className="font-medium text-stone-700">Affected Plant Organs:</span>
              <span>{report.affectedOrgans.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Environmental Triggers */}
        <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Droplet className="w-4 h-4 text-blue-600" />
              Microclimate Acceleration Factors
            </h3>
            <p className="text-xs text-stone-600 mb-3">
              The following environmental conditions accelerate sporulation and lesion expansion in the field:
            </p>
            <ul className="space-y-2">
              {report.environmentalRiskFactors.map((factor, idx) => (
                <li
                  key={idx}
                  className="text-xs text-stone-700 flex items-start gap-2 bg-white p-2 rounded border border-stone-200/80"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200 text-[11px] text-stone-500">
            Field Scout Recommendation: Cease overhead sprinklers immediately to suppress leaf wetness hours.
          </div>
        </div>
      </div>

      {/* Multi-Tier Actionable Remediation Plan */}
      <div className="space-y-4 pt-2">
        <div className="border-b border-stone-200 pb-2">
          <h3 className="font-display text-lg font-bold text-stone-900">
            Precision Agronomic Remediation Protocol
          </h3>
          <p className="text-xs text-stone-500">
            Execute in order of immediacy to stop secondary spread and protect adjacent healthy rows
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Phase 1: Immediate Triage */}
          <div className="bg-red-50/50 rounded-xl p-5 border border-red-200 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-red-700 text-white text-xs font-bold flex items-center justify-center font-mono">
                1
              </span>
              <h4 className="text-sm font-bold text-red-950">Immediate Containment (0-48h)</h4>
            </div>
            <ul className="space-y-2 text-xs text-red-900 flex-1">
              {report.immediateContainmentSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Phase 2: Biological & Organic Solutions */}
          <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-200 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center font-mono">
                2
              </span>
              <h4 className="text-sm font-bold text-emerald-950">Organic & Bio-Control Tactics</h4>
            </div>
            <ul className="space-y-2 text-xs text-emerald-900 flex-1">
              {report.organicTreatments.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Sprout className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Phase 3: Chemical & Conventional Fungicides */}
          <div className="bg-amber-50/40 rounded-xl p-5 border border-amber-200 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-bold flex items-center justify-center font-mono">
                3
              </span>
              <h4 className="text-sm font-bold text-amber-950">Chemical & Active Ingredients</h4>
            </div>
            <ul className="space-y-2 text-xs text-amber-950 flex-1">
              {report.chemicalTreatments.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <FlaskConical className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cultural Agronomic Controls */}
        <div className="bg-stone-50 rounded-xl p-5 border border-stone-200">
          <h4 className="text-xs font-bold text-stone-900 mb-2 flex items-center gap-2">
            <Leaf className="w-3.5 h-3.5 text-emerald-700" />
            Cultural & Horticultural Modifications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {report.culturalPractices.map((practice, idx) => (
              <div key={idx} className="text-xs text-stone-700 bg-white p-3 rounded-lg border border-stone-200">
                {practice}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TARGETED CURE PRODUCTS WITH ADD TO CART */}
      {targetedCures.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-stone-200 no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-900 shadow-sm">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-300">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AGRONOMIC CURE DISPENSARY</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/40 text-[10px] font-semibold">
                  <Zap className="w-2.5 h-2.5 fill-amber-300" />
                  <span>⚡ 60 Mins Urgent or 1-2 Days Normal Dispatch Available</span>
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight">
                Recommended Cures for {report.conditionName}
              </h3>
              <p className="text-xs text-emerald-200/80 max-w-xl">
                Precision bio-fungicides and curative active ingredients formulated specifically to eradicate {report.causalOrganism} and prevent secondary foliar collapse.
              </p>
            </div>

            {onAddToCart && (
              <button
                type="button"
                onClick={() => {
                  targetedCures.forEach((cure) => onAddToCart(cure, 1));
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer self-start sm:self-center"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add Complete Cure Pack (₹{totalCuresSum.toFixed(0)})</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {targetedCures.map((cure) => (
              <CureCard
                key={cure.id}
                cure={cure}
                onAddToCart={(prod, qty) => onAddToCart?.(prod, qty)}
                isInCart={cartItemIds.includes(cure.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Differential Diagnoses (Lookalikes Table) */}
      {report.differentialDiagnoses && report.differentialDiagnoses.length > 0 && (
        <div className="border-t border-stone-200 pt-6">
          <h3 className="font-display text-base font-bold text-stone-900 mb-1">
            Differential Diagnoses & Lookalike Pathogens
          </h3>
          <p className="text-xs text-stone-500 mb-3">
            How to verify against conditions with overlapping symptomology in field scouting
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-stone-200 rounded-lg overflow-hidden">
              <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-4 w-1/3">Alternative Condition</th>
                  <th className="py-2.5 px-4">Primary Differentiating Characteristic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {report.differentialDiagnoses.map((diff, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/70">
                    <td className="py-2.5 px-4 font-medium text-stone-900">{diff.condition}</td>
                    <td className="py-2.5 px-4 text-stone-600">{diff.distinguishingMarker}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preventative Guidelines for Subsequent Cycles */}
      {report.preventativeGuidelines && report.preventativeGuidelines.length > 0 && (
        <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 text-xs">
          <h4 className="font-semibold text-stone-900 mb-2">Long-Term Field Resistance Strategy:</h4>
          <ul className="list-disc pl-5 space-y-1 text-stone-600">
            {report.preventativeGuidelines.map((guide, idx) => (
              <li key={idx}>{guide}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
