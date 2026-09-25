import React from 'react';
import {
  Sprout,
  Microscope,
  Activity,
  BookOpen,
  History,
  PlusCircle,
  ShoppingCart,
  Package,
  MapPin,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'diagnose' | 'symptoms' | 'crops' | 'cures' | 'history' | 'map';
  setActiveTab: (tab: 'diagnose' | 'symptoms' | 'crops' | 'cures' | 'history' | 'map') => void;
  onNewScan: () => void;
  savedLogsCount: number;
  cartItemsCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onNewScan,
  savedLogsCount,
  cartItemsCount,
  onOpenCart,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#133826] text-white border-b border-[#1b4d35] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Editorial Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('diagnose')}>
            <div className="w-10 h-10 rounded-xl bg-[#266b49] flex items-center justify-center text-emerald-200 border border-emerald-400/30 shadow-inner">
              <Sprout className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg tracking-tight text-white">CureCrop</span>
                <span className="text-[11px] text-emerald-300/80 font-mono tracking-wider">AI PATHOLOGY</span>
              </div>
              <p className="text-xs text-emerald-200/70 hidden sm:block">
                Crop Pathology & Interactive Botanical Diagnostic System
              </p>
            </div>
          </div>

          {/* Nav Segmented Controls */}
          <nav className="flex items-center gap-1 bg-[#0a1f14]/60 p-1 rounded-xl border border-emerald-900/40">
            <button
              onClick={() => setActiveTab('diagnose')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'diagnose'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <Microscope className="w-3.5 h-3.5" />
              <span>Diagnostic Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('symptoms')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'symptoms'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Symptom Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('crops')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'crops'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Crop Finder</span>
            </button>

            <button
              onClick={() => setActiveTab('cures')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'cures'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Cures & Dispensary</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Outbreak Radar</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-emerald-200/80 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Field Logs</span>
              {savedLogsCount > 0 && (
                <span className="font-mono text-[10px] bg-emerald-500 text-emerald-950 font-semibold px-1.5 py-0.2 rounded-full">
                  {savedLogsCount}
                </span>
              )}
            </button>
          </nav>

          {/* New Scan Action & Cart Drawer Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 px-3 py-2 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 rounded-lg text-xs font-semibold border border-emerald-700/60 transition-colors cursor-pointer"
              title="View Agricultural Cart"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-300" />
              <span className="hidden md:inline">Pharmacy Cart</span>
              {cartItemsCount > 0 && (
                <span className="font-mono text-[11px] bg-amber-400 text-stone-950 font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <button
              onClick={onNewScan}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow transition-colors active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">New Specimen</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
