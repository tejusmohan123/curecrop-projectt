import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Smartphone,
  Landmark,
  Banknote,
  CheckCircle2,
  Lock,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Zap,
  Truck,
  Leaf,
} from 'lucide-react';
import { DeliverySpeed } from './CartDrawer';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

export interface PaymentDetails {
  method: PaymentMethod;
  upiId?: string;
  upiApp?: 'gpay' | 'phonepe' | 'paytm' | 'bhim';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardHolder?: string;
  bankName?: string;
  transactionId?: string;
}

interface PaymentInterfaceProps {
  amount: number;
  subtotal: number;
  shippingFee: number;
  deliverySpeed: DeliverySpeed;
  farmName: string;
  deliveryAddress: string;
  itemsCount: number;
  onBack: () => void;
  onPaymentComplete: (paymentDetails: PaymentDetails) => void;
}

export const PaymentInterface: React.FC<PaymentInterfaceProps> = ({
  amount,
  subtotal,
  shippingFee,
  deliverySpeed,
  farmName,
  deliveryAddress,
  itemsCount,
  onBack,
  onPaymentComplete,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [upiSubTab, setUpiSubTab] = useState<'qr' | 'id'>('qr');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(farmName || '');
  const [cardSave, setCardSave] = useState(true);

  // Net banking
  const [selectedBank, setSelectedBank] = useState('sbi');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Format card number with spaces (16 digits)
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  // Format expiry MM/YY
  const handleExpiryChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) {
      setCardExpiry(`${clean.slice(0, 2)}/${clean.slice(2, 4)}`);
    } else {
      setCardExpiry(clean);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('curecrop.agri@okaxis');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (selectedMethod === 'upi' && upiSubTab === 'id' && !upiIdInput.includes('@')) {
      setErrorMessage('Please enter a valid VPA / UPI ID (e.g., yourname@okaxis or mobile@upi)');
      return;
    }

    if (selectedMethod === 'card') {
      const cleanNum = cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 16) {
        setErrorMessage('Please enter a complete 16-digit card number');
        return;
      }
      if (cardExpiry.length < 5) {
        setErrorMessage('Please enter valid MM/YY expiration date');
        return;
      }
      if (cardCvv.length < 3) {
        setErrorMessage('Please enter a valid 3-digit CVV');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate safe cryptographic payment gateway authorization (UPI 2.0 / 3D Secure / Razorpay / NPCI gateway simulation)
    setTimeout(() => {
      setIsProcessing(false);
      const randomTxn = 'TXN-' + Math.floor(100000000 + Math.random() * 900000000);
      onPaymentComplete({
        method: selectedMethod,
        upiId: selectedMethod === 'upi' ? (upiSubTab === 'id' ? upiIdInput : 'scanned-qr@curecrop') : undefined,
        upiApp: selectedMethod === 'upi' ? selectedUpiApp : undefined,
        cardNumber: selectedMethod === 'card' ? `•••• ${cardNumber.slice(-4)}` : undefined,
        cardHolder: selectedMethod === 'card' ? cardHolder : undefined,
        bankName: selectedMethod === 'netbanking' ? selectedBank.toUpperCase() : undefined,
        transactionId: randomTxn,
      });
    }, 1400);
  };

  return (
    <div className="space-y-4 text-stone-800 animate-in fade-in duration-200">
      {/* Top back button and security badge */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-200">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-emerald-800 font-semibold cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Delivery</span>
        </button>

        <div className="flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
          <Lock className="w-3 h-3 text-emerald-700" />
          <span>256-Bit Encrypted Payment</span>
        </div>
      </div>

      {/* Order Amount Highlight Card */}
      <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 rounded-xl p-4 text-white shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[11px] text-emerald-200 font-mono uppercase tracking-wider block">
            Payable Amount
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-display text-2xl font-bold">₹{amount.toFixed(0)}</span>
            <span className="text-xs text-emerald-300 font-mono">INR</span>
          </div>
          <p className="text-[11px] text-emerald-300/80 mt-1 flex items-center gap-1">
            {deliverySpeed === 'quick' ? (
              <>
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Quick 60-Mins Dispatch (₹{shippingFee})</span>
              </>
            ) : (
              <>
                <Truck className="w-3 h-3 text-emerald-300" />
                <span>Normal Farm Delivery ({shippingFee === 0 ? 'FREE' : `₹${shippingFee}`})</span>
              </>
            )}
          </p>
        </div>

        <div className="text-right text-[11px] text-emerald-200 space-y-0.5">
          <div className="font-semibold text-white truncate max-w-[140px]">{farmName || 'Field Farm'}</div>
          <div className="font-mono text-emerald-300">{itemsCount} crop cure item{itemsCount > 1 ? 's' : ''}</div>
        </div>
      </div>

      {/* Error Message Notice */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Payment Method Selector Grid */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-stone-700 block">
          Select Payment Method
        </label>
        <div className="grid grid-cols-4 gap-1.5 text-xs">
          {/* UPI */}
          <button
            type="button"
            onClick={() => setSelectedMethod('upi')}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer ${
              selectedMethod === 'upi'
                ? 'border-emerald-700 bg-emerald-50/80 text-emerald-950 font-bold ring-1 ring-emerald-700 shadow-2xs'
                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-700" />
            <span className="text-[11px]">UPI / Apps</span>
          </button>

          {/* Cards */}
          <button
            type="button"
            onClick={() => setSelectedMethod('card')}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer ${
              selectedMethod === 'card'
                ? 'border-emerald-700 bg-emerald-50/80 text-emerald-950 font-bold ring-1 ring-emerald-700 shadow-2xs'
                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
            }`}
          >
            <CreditCard className="w-4 h-4 text-blue-700" />
            <span className="text-[11px]">Cards</span>
          </button>

          {/* Net Banking */}
          <button
            type="button"
            onClick={() => setSelectedMethod('netbanking')}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer ${
              selectedMethod === 'netbanking'
                ? 'border-emerald-700 bg-emerald-50/80 text-emerald-950 font-bold ring-1 ring-emerald-700 shadow-2xs'
                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
            }`}
          >
            <Landmark className="w-4 h-4 text-purple-700" />
            <span className="text-[11px]">Net Banking</span>
          </button>

          {/* Cash On Delivery */}
          <button
            type="button"
            onClick={() => setSelectedMethod('cod')}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer ${
              selectedMethod === 'cod'
                ? 'border-emerald-700 bg-emerald-50/80 text-emerald-950 font-bold ring-1 ring-emerald-700 shadow-2xs'
                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
            }`}
          >
            <Banknote className="w-4 h-4 text-amber-700" />
            <span className="text-[11px]">Cash/Pay</span>
          </button>
        </div>
      </div>

      {/* Selected Payment Mode Content Panels */}
      <form onSubmit={handleSubmitPayment} className="space-y-4">
        {/* UPI METHOD */}
        {selectedMethod === 'upi' && (
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3.5">
            {/* Sub-Tabs: QR Code vs UPI ID */}
            <div className="flex rounded-lg border border-stone-300 bg-white p-0.5 text-xs shadow-2xs">
              <button
                type="button"
                onClick={() => setUpiSubTab('qr')}
                className={`flex-1 py-1.5 rounded-md font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  upiSubTab === 'qr'
                    ? 'bg-emerald-800 text-white'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Instant QR Scan</span>
              </button>
              <button
                type="button"
                onClick={() => setUpiSubTab('id')}
                className={`flex-1 py-1.5 rounded-md font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  upiSubTab === 'id'
                    ? 'bg-emerald-800 text-white'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Enter UPI ID / VPA</span>
              </button>
            </div>

            {upiSubTab === 'qr' ? (
              <div className="space-y-3 text-center">
                {/* Simulated dynamic UPI QR Code */}
                <div className="bg-white p-3.5 rounded-xl border border-stone-300 inline-block shadow-xs mx-auto">
                  <div className="w-36 h-36 mx-auto relative bg-stone-900 rounded-lg p-2 flex items-center justify-center">
                    {/* SVG Realistic QR Code graphic */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                      <rect width="100" height="100" fill="white" />
                      {/* Corner 1 */}
                      <rect x="10" y="10" width="26" height="26" fill="#133826" />
                      <rect x="15" y="15" width="16" height="16" fill="white" />
                      <rect x="19" y="19" width="8" height="8" fill="#133826" />
                      {/* Corner 2 */}
                      <rect x="64" y="10" width="26" height="26" fill="#133826" />
                      <rect x="69" y="15" width="16" height="16" fill="white" />
                      <rect x="73" y="19" width="8" height="8" fill="#133826" />
                      {/* Corner 3 */}
                      <rect x="10" y="64" width="26" height="26" fill="#133826" />
                      <rect x="15" y="69" width="16" height="16" fill="white" />
                      <rect x="19" y="73" width="8" height="8" fill="#133826" />
                      {/* Internal pattern pixels */}
                      <rect x="42" y="14" width="6" height="6" fill="#133826" />
                      <rect x="52" y="14" width="6" height="6" fill="#133826" />
                      <rect x="42" y="24" width="6" height="6" fill="#133826" />
                      <rect x="52" y="34" width="6" height="6" fill="#133826" />
                      <rect x="14" y="44" width="6" height="6" fill="#133826" />
                      <rect x="24" y="52" width="6" height="6" fill="#133826" />
                      <rect x="44" y="44" width="14" height="14" fill="#047857" />
                      <rect x="64" y="44" width="6" height="6" fill="#133826" />
                      <rect x="74" y="52" width="6" height="6" fill="#133826" />
                      <rect x="42" y="64" width="6" height="6" fill="#133826" />
                      <rect x="52" y="74" width="6" height="6" fill="#133826" />
                      <rect x="64" y="64" width="6" height="6" fill="#133826" />
                      <rect x="74" y="74" width="16" height="6" fill="#133826" />
                    </svg>
                  </div>
                  <div className="text-[10px] font-mono text-stone-500 mt-1.5 flex items-center justify-center gap-1">
                    <span>Scan with any UPI App</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-stone-600 font-mono">UPI ID: curecrop.agri@okaxis</span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="p-1 text-emerald-700 hover:text-emerald-900 rounded cursor-pointer"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex justify-center items-center gap-3 pt-1 text-[11px] text-stone-500">
                  <span className="font-semibold text-stone-700">Supported:</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-stone-200 font-medium">GPay</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-stone-200 font-medium">PhonePe</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-stone-200 font-medium">Paytm</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-stone-200 font-medium">BHIM</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Your Virtual Payment Address (UPI ID) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210@paytm or farmer@okaxis"
                    value={upiIdInput}
                    onChange={(e) => setUpiIdInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none bg-white font-mono"
                  />
                </div>

                <div className="text-[11px] text-stone-500">
                  You will receive a notification to verify and approve payment on your UPI app.
                </div>
              </div>
            )}
          </div>
        )}

        {/* CREDIT / DEBIT CARD */}
        {selectedMethod === 'card' && (
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
              <span>Card Details</span>
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <span className="px-1.5 py-0.2 rounded bg-white border border-stone-200">RuPay</span>
                <span className="px-1.5 py-0.2 rounded bg-white border border-stone-200">Visa</span>
                <span className="px-1.5 py-0.2 rounded bg-white border border-stone-200">MasterCard</span>
                <span className="px-1.5 py-0.2 rounded bg-white border border-stone-200">Kisan Card</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Card Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="4532 •••• •••• 8910"
                  value={cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  className="w-full px-3 py-2 pl-9 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none bg-white font-mono tracking-wider"
                />
                <CreditCard className="w-4 h-4 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Expiry (MM/YY) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="MM/YY"
                  maxLength={5}
                  value={cardExpiry}
                  onChange={(e) => handleExpiryChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  CVV / CVC *
                </label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  placeholder="•••"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none bg-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Cardholder Name *
              </label>
              <input
                type="text"
                required
                placeholder="Name as printed on card"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none bg-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="save-card"
                checked={cardSave}
                onChange={(e) => setCardSave(e.target.checked)}
                className="accent-emerald-700 cursor-pointer"
              />
              <label htmlFor="save-card" className="text-[11px] text-stone-600 cursor-pointer select-none">
                Save card securely per RBI tokenization standards for future orders
              </label>
            </div>
          </div>
        )}

        {/* NET BANKING */}
        {selectedMethod === 'netbanking' && (
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3 text-xs">
            <label className="block font-medium text-stone-700">
              Select Agriculture Partner Bank *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'sbi', name: 'State Bank of India (SBI)' },
                { id: 'hdfc', name: 'HDFC Bank' },
                { id: 'icici', name: 'ICICI Bank' },
                { id: 'pnb', name: 'Punjab National Bank' },
                { id: 'bob', name: 'Bank of Baroda' },
                { id: 'axis', name: 'Axis Bank' },
              ].map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBank(b.id)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    selectedBank === b.id
                      ? 'border-emerald-700 bg-white ring-1 ring-emerald-700 font-bold text-stone-900 shadow-2xs'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{b.name}</span>
                    {selectedBank === b.id && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-stone-500 pt-1">
              Supports Kisan Credit Card (KCC) net-banking accounts and Direct Benefit Transfer subsidies.
            </p>
          </div>
        )}

        {/* CASH ON DELIVERY / PAY ON DISPATCH */}
        {selectedMethod === 'cod' && (
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs space-y-2 text-amber-950">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <Banknote className="w-4 h-4 text-amber-700" />
              <span>Pay on Field Delivery</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900/90">
              Pay ₹{amount.toFixed(0)} upon courier arrival at your farm gate via Cash, UPI QR on rider device, or Kisan Credit Card.
            </p>
            <div className="text-[10px] text-amber-800/80 font-mono bg-amber-100/60 p-2 rounded border border-amber-300/50">
              ✓ Zero advance payment required · Inspect sealed agrochemical safety seals before accepting
            </div>
          </div>
        )}

        {/* Submit Payment CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-3.5 rounded-xl font-bold text-xs text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isProcessing
                ? 'bg-stone-500 cursor-wait'
                : 'bg-emerald-800 hover:bg-emerald-700 active:scale-98'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                <span>Authorizing Payment of ₹{amount.toFixed(0)}...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>
                  {selectedMethod === 'cod'
                    ? `Confirm Order & Pay on Delivery (₹${amount.toFixed(0)})`
                    : `Pay ₹${amount.toFixed(0)} Securely`}
                </span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400 mt-2">
            <span>Powered by NPCI Bharat QR & CIBRC Certified Agri-Billing</span>
          </div>
        </div>
      </form>
    </div>
  );
};
