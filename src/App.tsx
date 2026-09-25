import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DiagnosticLab } from './components/DiagnosticLab';
import { SymptomMatrixDashboard } from './components/SymptomMatrixDashboard';
import { CropEncyclopedia } from './components/CropEncyclopedia';
import { FieldLogArchive } from './components/FieldLogArchive';
import { AgronomistConsultant } from './components/AgronomistConsultant';
import { CuresDispensaryView } from './components/CuresDispensaryView';
import { CropOutbreakMap } from './components/CropOutbreakMap';
import { CartDrawer } from './components/CartDrawer';
import { CURES_CATALOG } from './data/curesDispensary';
import { DiagnosticResult, EnvironmentalContext, CartItem, CureProduct } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'diagnose' | 'symptoms' | 'crops' | 'cures' | 'history' | 'map'>('diagnose');
  const [savedLogs, setSavedLogs] = useState<DiagnosticResult[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSymptomIds, setSelectedSymptomIds] = useState<string[]>([]);
  const [isConsultantOpen, setIsConsultantOpen] = useState(false);
  const [currentDiagnosticResult, setCurrentDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [isSynthesizingSymptomAI, setIsSynthesizingSymptomAI] = useState(false);

  // Load saved logs and cart from localStorage on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem('curecrop_field_logs') || localStorage.getItem('agroscan_field_logs');
      if (stored) {
        setSavedLogs(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to parse field logs from localStorage', e);
    }

    try {
      const storedCart = localStorage.getItem('curecrop_cart_items');
      if (storedCart) {
        const parsed: CartItem[] = JSON.parse(storedCart);
        // Refresh with latest catalog details & prices
        const refreshed = parsed.map((item) => {
          const fresh = CURES_CATALOG.find((c) => c.id === item.product.id);
          return fresh ? { ...item, product: fresh } : item;
        });
        setCartItems(refreshed);
      }
    } catch (e) {
      console.warn('Failed to parse cart items from localStorage', e);
    }
  }, []);

  // Save to localStorage when logs update
  const persistLogs = (newLogs: DiagnosticResult[]) => {
    setSavedLogs(newLogs);
    try {
      localStorage.setItem('curecrop_field_logs', JSON.stringify(newLogs));
    } catch (e) {
      console.warn('Failed to save field logs to localStorage', e);
    }
  };

  // Save to localStorage when cart items update
  const persistCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    try {
      localStorage.setItem('curecrop_cart_items', JSON.stringify(newCart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  };

  const handleAddToCart = (product: CureProduct, quantity: number = 1) => {
    const existingIndex = cartItems.findIndex((item) => item.product.id === product.id);
    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [...cartItems, { product, quantity }];
    }
    persistCart(updated);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];
    persistCart(updated);
  };

  const handleRemoveCartItem = (productId: string) => {
    const updated = cartItems.filter((item) => item.product.id !== productId);
    persistCart(updated);
  };

  const handleClearCart = () => {
    persistCart([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSaveLog = (report: DiagnosticResult) => {
    const reportToSave: DiagnosticResult = {
      ...report,
      id: report.id || 'log-' + Date.now(),
      timestamp: report.timestamp || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };

    if (savedLogs.some((l) => l.id === reportToSave.id)) {
      return;
    }

    const updated = [reportToSave, ...savedLogs];
    persistLogs(updated);
  };

  const handleDeleteLog = (id: string) => {
    const updated = savedLogs.filter((l) => l.id !== id);
    persistLogs(updated);
  };

  const handleClearAllLogs = () => {
    if (window.confirm('Are you sure you want to clear all saved field scout logs?')) {
      persistLogs([]);
    }
  };

  const handleToggleSymptom = (symId: string) => {
    if (selectedSymptomIds.includes(symId)) {
      setSelectedSymptomIds(selectedSymptomIds.filter((id) => id !== symId));
    } else {
      setSelectedSymptomIds([...selectedSymptomIds, symId]);
    }
  };

  const handleSelectCropForDiagnosis = (cropName: string) => {
    setActiveTab('diagnose');
  };

  const handleSelectReportFromArchive = (report: DiagnosticResult) => {
    setCurrentDiagnosticResult(report);
    setActiveTab('diagnose');
  };

  const handleNewScan = () => {
    setCurrentDiagnosticResult(null);
    setSelectedSymptomIds([]);
    setActiveTab('diagnose');
  };

  // Run symptom-only synthesis from Symptom Matrix Dashboard
  const handleRunSymptomDiagnosis = async (
    symptomIds: string[],
    environmentalData: EnvironmentalContext
  ) => {
    setIsSynthesizingSymptomAI(true);
    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropHint: 'General Agricultural Crop (Diagnose from symptoms)',
          selectedSymptoms: symptomIds,
          environmentalContext: environmentalData,
        }),
      });

      const data = await response.json();
      if (data.success && data.diagnosis) {
        const result: DiagnosticResult = {
          ...data.diagnosis,
          id: 'symptom-diag-' + Date.now(),
          timestamp: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setCurrentDiagnosticResult(result);
        setActiveTab('diagnose');
      } else {
        alert(data.error || 'Failed to synthesize diagnosis from symptoms.');
      }
    } catch (err: any) {
      alert(err.message || 'Error communicating with diagnostic service.');
    } finally {
      setIsSynthesizingSymptomAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] flex flex-col font-sans">
      {/* Primary Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewScan={handleNewScan}
        savedLogsCount={savedLogs.length}
        cartItemsCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'diagnose' && (
          <DiagnosticLab
            onOpenConsultant={() => setIsConsultantOpen(true)}
            onSaveLog={handleSaveLog}
            savedLogIds={savedLogs.map((l) => l.id || '')}
            onAddToCart={handleAddToCart}
            cartItemIds={cartItems.map((i) => i.product.id)}
          />
        )}

        {activeTab === 'symptoms' && (
          <SymptomMatrixDashboard
            selectedSymptomIds={selectedSymptomIds}
            onToggleSymptom={handleToggleSymptom}
            onClearSymptoms={() => setSelectedSymptomIds([])}
            onRunSymptomDiagnosis={handleRunSymptomDiagnosis}
            isAnalyzing={isSynthesizingSymptomAI}
          />
        )}

        {activeTab === 'crops' && (
          <CropEncyclopedia
            onSelectCropForDiagnosis={handleSelectCropForDiagnosis}
          />
        )}

        {activeTab === 'cures' && (
          <CuresDispensaryView
            onAddToCart={handleAddToCart}
            cartItemIds={cartItems.map((i) => i.product.id)}
          />
        )}

        {activeTab === 'map' && (
          <div className="space-y-6">
            <CropOutbreakMap
              savedLogs={savedLogs}
              currentDiagnosis={currentDiagnosticResult}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <FieldLogArchive
            logs={savedLogs}
            onSelectReport={handleSelectReportFromArchive}
            onDeleteLog={handleDeleteLog}
            onClearAllLogs={handleClearAllLogs}
          />
        )}
      </main>

      {/* Farm Pharmacy Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* AI Agronomist Side-Drawer / Modal */}
      <AgronomistConsultant
        isOpen={isConsultantOpen}
        onClose={() => setIsConsultantOpen(false)}
        diagnosticContext={currentDiagnosticResult}
      />

      {/* Editorial Footer */}
      <footer className="bg-white border-t border-stone-200 mt-12 py-8 text-xs text-stone-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-stone-800">CureCrop</span>
            <span>·</span>
            <span>Botanical Pathology & Diagnostic Intelligence</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span>Server-Side Gemini 3.8 Flash Multimodal Engine</span>
            <span>·</span>
            <span>Specimens Evaluated Ephemerally</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
