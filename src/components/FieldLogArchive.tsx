import React, { useState } from 'react';
import {
  History,
  Trash2,
  Download,
  Calendar,
  Eye,
  Columns,
  Search,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  MapPin,
} from 'lucide-react';
import { DiagnosticResult } from '../types';

interface FieldLogArchiveProps {
  logs: DiagnosticResult[];
  onSelectReport: (report: DiagnosticResult) => void;
  onDeleteLog: (id: string) => void;
  onClearAllLogs: () => void;
}

export const FieldLogArchive: React.FC<FieldLogArchiveProps> = ({
  logs,
  onSelectReport,
  onDeleteLog,
  onClearAllLogs,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    return (
      (log.cropIdentified || '').toLowerCase().includes(q) ||
      (log.conditionName || '').toLowerCase().includes(q) ||
      (log.conditionCategory || '').toLowerCase().includes(q)
    );
  });

  const toggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((item) => item !== id));
    } else {
      if (compareIds.length >= 2) {
        setCompareIds([compareIds[1], id]);
      } else {
        setCompareIds([...compareIds, id]);
      }
    }
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `curecrop-field-logs-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const comparedLog1 = logs.find((l) => l.id === compareIds[0]);
  const comparedLog2 = logs.find((l) => l.id === compareIds[1]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
              <History className="w-4 h-4" />
              <span>FIELD SCOUT ARCHIVE & LOG JOURNAL</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-stone-900 tracking-tight">
              Diagnostic Field History
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Review saved specimen records, evaluate multi-week disease progression, and export reports for agronomist extension records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {logs.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={exportJSON}
                  className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>

                <button
                  type="button"
                  onClick={onClearAllLogs}
                  className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search & Compare Toggle */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search field records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          {logs.length >= 2 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsComparing(!isComparing)}
                disabled={compareIds.length < 2 && !isComparing}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isComparing
                    ? 'bg-emerald-800 text-white'
                    : compareIds.length === 2
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>
                  {isComparing
                    ? 'Close Comparison Mode'
                    : `Compare Selected (${compareIds.length}/2)`}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Side-by-Side Comparison Modal / Box */}
      {isComparing && comparedLog1 && comparedLog2 && (
        <div className="bg-white rounded-2xl border-2 border-emerald-600 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <h3 className="font-display text-lg font-bold text-stone-900">
                Side-by-Side Specimen Progression Comparison
              </h3>
              <p className="text-xs text-stone-500">
                Track how condition, symptoms, and severity evolved across dates
              </p>
            </div>
            <button
              onClick={() => setIsComparing(false)}
              className="text-xs text-stone-500 hover:text-stone-800 font-semibold cursor-pointer"
            >
              Exit Comparison
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Record 1 */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <div className="text-xs font-mono text-emerald-700 font-bold">
                Specimen A · {comparedLog1.timestamp}
              </div>
              <div className="font-bold text-base text-stone-900">
                {comparedLog1.conditionName}
              </div>
              <div className="text-xs text-stone-600">
                Crop: {comparedLog1.cropIdentified}
              </div>
              <div className="text-xs text-stone-700">
                Severity: <span className="font-bold">{comparedLog1.severityLevel} ({comparedLog1.severityScore}%)</span>
              </div>
              <div className="text-xs text-stone-600">
                Progression: {comparedLog1.progressionStage}
              </div>
              <div className="text-xs text-stone-600">
                Yield Risk: {comparedLog1.yieldImpactEstimate}
              </div>
            </div>

            {/* Record 2 */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <div className="text-xs font-mono text-emerald-700 font-bold">
                Specimen B · {comparedLog2.timestamp}
              </div>
              <div className="font-bold text-base text-stone-900">
                {comparedLog2.conditionName}
              </div>
              <div className="text-xs text-stone-600">
                Crop: {comparedLog2.cropIdentified}
              </div>
              <div className="text-xs text-stone-700">
                Severity: <span className="font-bold">{comparedLog2.severityLevel} ({comparedLog2.severityScore}%)</span>
              </div>
              <div className="text-xs text-stone-600">
                Progression: {comparedLog2.progressionStage}
              </div>
              <div className="text-xs text-stone-600">
                Yield Risk: {comparedLog2.yieldImpactEstimate}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Entries Grid */}
      {logs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-xs">
          <History className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-stone-800">No Field Logs Saved Yet</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            When you complete an AI diagnosis in the Diagnostic Lab, click "Save Log" to retain the clinical record for seasonal tracking.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLogs.map((log) => {
            const id = log.id || '';
            const isCheckedForCompare = compareIds.includes(id);

            return (
              <div
                key={id}
                className={`bg-white rounded-xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                  isCheckedForCompare
                    ? 'border-emerald-600 ring-2 ring-emerald-600/30'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {log.timestamp}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold bg-stone-100 text-stone-700">
                      {log.conditionCategory}
                    </span>
                  </div>

                  <h4 className="font-bold text-stone-900 text-sm leading-snug">
                    {log.conditionName}
                  </h4>
                  <div className="text-xs text-stone-600 mt-1 font-medium">
                    {log.cropIdentified}
                  </div>

                  {log.location?.address && (
                    <div className="text-[10px] text-emerald-800 font-mono flex items-center gap-1 mt-1.5 truncate">
                      <MapPin className="w-2.5 h-2.5 shrink-0 text-emerald-600" />
                      <span className="truncate">{log.location.address}</span>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                    <span className="text-stone-500">Severity Level:</span>
                    <span className="font-bold text-stone-800 font-mono">
                      {log.severityLevel} ({log.severityScore}/100)
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`compare-${id}`}
                      checked={isCheckedForCompare}
                      onChange={() => toggleCompare(id)}
                      className="accent-emerald-700 cursor-pointer"
                    />
                    <label
                      htmlFor={`compare-${id}`}
                      className="text-[11px] text-stone-500 cursor-pointer select-none"
                    >
                      Compare
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectReport(log)}
                      className="p-1.5 text-stone-600 hover:text-emerald-700 rounded hover:bg-stone-50 transition-colors cursor-pointer"
                      title="View Full Diagnosis"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteLog(id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
