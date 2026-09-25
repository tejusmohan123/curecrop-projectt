import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CheckCircle2,
  Truck,
  ShieldCheck,
  ArrowRight,
  Package,
  Leaf,
  MapPin,
  Zap,
  Clock,
  Check,
  CreditCard,
  Lock,
} from 'lucide-react';
import { CartItem } from '../types';
import { PaymentInterface, PaymentDetails } from './PaymentInterface';

export type DeliverySpeed = 'quick' | 'standard';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  // Step state: 'cart' -> 'delivery' -> 'payment'
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'delivery' | 'payment'>('cart');
  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeed>('quick');
  const [farmName, setFarmName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<{
    id: string;
    speed: DeliverySpeed;
    payment: PaymentDetails;
    totalAmount: number;
  } | null>(null);

  if (!isOpen) return null;

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Delivery Pricing:
  // Normal Standard (1-2 Days): ₹50, or FREE for orders >= ₹500
  // Quick Express (60 Mins Urgent Dispatch): ₹99 flat priority courier
  const standardShipping = subtotal >= 500 || subtotal === 0 ? 0 : 50;
  const quickShipping = 99;
  const shippingFee = deliverySpeed === 'quick' ? quickShipping : standardShipping;
  const grandTotal = subtotal + shippingFee;

  // Validate delivery form and proceed to Payment Interface
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName.trim() || !deliveryAddress.trim()) {
      return;
    }
    setCheckoutStep('payment');
  };

  // Called after payment authorization in PaymentInterface
  const handlePaymentCompleted = (paymentDetails: PaymentDetails) => {
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderSuccess({
      id: orderId,
      speed: deliverySpeed,
      payment: paymentDetails,
      totalAmount: grandTotal,
    });
    setTimeout(() => {
      onClearCart();
    }, 400);
  };

  const handleCloseAndReset = () => {
    setOrderSuccess(null);
    setCheckoutStep('cart');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-300">
        
        {/* Header with Step Indicator */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-emerald-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-200">
              {checkoutStep === 'payment' ? (
                <CreditCard className="w-4 h-4 text-emerald-200" />
              ) : (
                <ShoppingBag className="w-4 h-4 text-emerald-200" />
              )}
            </div>
            <div>
              <h3 className="font-display font-bold text-base tracking-tight">
                {checkoutStep === 'payment'
                  ? 'Secure Payment Gateway'
                  : checkoutStep === 'delivery'
                  ? 'Farm Delivery Details'
                  : 'Agricultural Pharmacy Cart'}
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-emerald-300/80 font-mono">
                <span className={checkoutStep === 'cart' ? 'font-bold text-white' : 'text-emerald-400'}>1. Cart</span>
                <span>•</span>
                <span className={checkoutStep === 'delivery' ? 'font-bold text-white' : 'text-emerald-400'}>2. Delivery</span>
                <span>•</span>
                <span className={checkoutStep === 'payment' ? 'font-bold text-white' : 'text-emerald-400'}>3. Payment</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900/60 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {orderSuccess ? (
            /* SUCCESS & INVOICE RECEIPT SCREEN */
            <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-6 space-y-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-sm ${
                orderSuccess.speed === 'quick'
                  ? 'bg-amber-100 text-amber-700 border-amber-300'
                  : 'bg-emerald-100 text-emerald-700 border-emerald-300'
              }`}>
                {orderSuccess.speed === 'quick' ? (
                  <Zap className="w-8 h-8 text-amber-600 animate-pulse" />
                ) : (
                  <CheckCircle2 className="w-8 h-8" />
                )}
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  Payment Verified · Order Placed
                </span>
                <h4 className="font-display text-xl font-bold text-stone-900 mt-1.5">
                  {orderSuccess.speed === 'quick' ? '⚡ 60-Min Dispatch Commenced!' : 'Farm Delivery Confirmed!'}
                </h4>
              </div>

              <p className="text-xs text-stone-600 max-w-xs leading-relaxed">
                {orderSuccess.speed === 'quick'
                  ? 'Priority agri-runner allocated. Agrochemical bottles and bio-fungicides are being rushed directly from the nearest regional farm depot to arrive in 60 minutes.'
                  : 'Your crop health prescription has been scheduled for standard 1-2 days climate-controlled delivery.'}
              </p>

              {/* Digital Payment Receipt Card */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 w-full text-xs space-y-2 font-mono text-left">
                <div className="flex justify-between text-stone-500 pb-1.5 border-b border-stone-200">
                  <span>Order Reference:</span>
                  <span className="font-bold text-emerald-900">{orderSuccess.id}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Amount Paid:</span>
                  <span className="font-bold text-stone-900">₹{orderSuccess.totalAmount.toFixed(0)} INR</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Payment Mode:</span>
                  <span className="font-bold uppercase text-emerald-800">
                    {orderSuccess.payment.method === 'upi'
                      ? 'UPI Transfer'
                      : orderSuccess.payment.method === 'card'
                      ? `Card (${orderSuccess.payment.cardNumber})`
                      : orderSuccess.payment.method === 'netbanking'
                      ? `Net Banking (${orderSuccess.payment.bankName})`
                      : 'Pay on Delivery'}
                  </span>
                </div>
                {orderSuccess.payment.transactionId && (
                  <div className="flex justify-between text-stone-500">
                    <span>Txn Auth ID:</span>
                    <span className="text-stone-700">{orderSuccess.payment.transactionId}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-500">
                  <span>Dispatch Mode:</span>
                  <span className={`font-bold ${orderSuccess.speed === 'quick' ? 'text-amber-700' : 'text-emerald-800'}`}>
                    {orderSuccess.speed === 'quick' ? '⚡ Quick 60 Mins' : 'Normal (1-2 Days)'}
                  </span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Recipient Farm:</span>
                  <span className="font-bold text-stone-800">{farmName || 'Field Manager'}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 text-left space-y-1 w-full">
                <div className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>CIBRC & OMRI Certified Tamper-Proof Packaging</span>
                </div>
                <p className="text-[10px] text-emerald-800/80">
                  All formulations include pre-measured dosing syringes, tank dilution guidelines, and pre-harvest interval charts.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseAndReset}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Return to Crop Diagnostic Lab
              </button>
            </div>
          ) : checkoutStep === 'payment' ? (
            /* STEP 3: PAYMENT INTERFACE */
            <PaymentInterface
              amount={grandTotal}
              subtotal={subtotal}
              shippingFee={shippingFee}
              deliverySpeed={deliverySpeed}
              farmName={farmName}
              deliveryAddress={deliveryAddress}
              itemsCount={totalItemsCount}
              onBack={() => setCheckoutStep('delivery')}
              onPaymentComplete={handlePaymentCompleted}
            />
          ) : checkoutStep === 'delivery' ? (
            /* STEP 2: DELIVERY DETAILS & SPEED SELECTION */
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Farm Delivery & Speed Selection
                </span>
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="text-xs text-emerald-800 hover:underline font-medium cursor-pointer"
                >
                  Back to Cart
                </button>
              </div>

              {/* Delivery Speed Options Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-stone-700">
                  Select Delivery Mode *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Quick 60 mins */}
                  <div
                    onClick={() => setDeliverySpeed('quick')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all relative ${
                      deliverySpeed === 'quick'
                        ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500 text-amber-950 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                        <span>Quick Delivery</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-700">₹{quickShipping}</span>
                    </div>
                    <div className="text-[13px] font-bold text-stone-900 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>60 Mins</span>
                    </div>
                    <p className="text-[10px] text-stone-500 mt-1 leading-tight">
                      For rapid disease blight arrest & emergency pathogen intervention.
                    </p>
                    {deliverySpeed === 'quick' && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  {/* Standard 1-2 days */}
                  <div
                    onClick={() => setDeliverySpeed('standard')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all relative ${
                      deliverySpeed === 'standard'
                        ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600 text-emerald-950 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Truck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Normal Delivery</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-800">
                        {standardShipping === 0 ? 'FREE' : `₹${standardShipping}`}
                      </span>
                    </div>
                    <div className="text-[13px] font-bold text-stone-900 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-700" />
                      <span>1 - 2 Days</span>
                    </div>
                    <p className="text-[10px] text-stone-500 mt-1 leading-tight">
                      Standard regional hub shipping. Free for orders ₹500+.
                    </p>
                    {deliverySpeed === 'standard' && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Farm / Grower Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Green Valley Orchards / Field Scout John"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-stone-700">
                    Farm Location or Delivery Address *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (!navigator.geolocation) {
                        alert('Geolocation not supported');
                        return;
                      }
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          const lat = pos.coords.latitude;
                          const lng = pos.coords.longitude;
                          setDeliveryAddress(`Field GPS Plot: ${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`);
                        },
                        () => alert('Could not access current location.')
                      );
                    }}
                    className="text-[10px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-2.5 h-2.5" />
                    <span>Autofill GPS</span>
                  </button>
                </div>
                <textarea
                  required
                  rows={3}
                  placeholder="Street / Route, Village / Tehsil, District, State (or GPS / Field Plot Coordinates)"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Sprayer / Tank Application Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Backpack sprayer, 50 gal boom sprayer, or drip fertigation"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 text-xs text-stone-800">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-700">Subtotal:</span>
                  <span className="font-mono font-bold">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600 flex items-center gap-1">
                    {deliverySpeed === 'quick' ? (
                      <>
                        <Zap className="w-3 h-3 text-amber-600" />
                        <span>Quick 60-Min Fee:</span>
                      </>
                    ) : (
                      <>
                        <Truck className="w-3 h-3 text-emerald-700" />
                        <span>Standard 1-2 Days Fee:</span>
                      </>
                    )}
                  </span>
                  <span className="font-mono font-bold">
                    {shippingFee === 0 ? <span className="text-emerald-700">FREE</span> : `₹${shippingFee.toFixed(0)}`}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-stone-200 text-sm font-bold text-stone-900">
                  <span>Grand Total:</span>
                  <span className="font-mono text-emerald-950">₹{grandTotal.toFixed(0)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Continue to Payment (₹{grandTotal.toFixed(0)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : cartItems.length === 0 ? (
            /* EMPTY CART */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center">
                <Package className="w-7 h-7" />
              </div>
              <h4 className="font-semibold text-stone-800 text-sm">Your Cart is Empty</h4>
              <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                Run an AI crop diagnosis on a plant specimen to see recommended organic bio-fungicides and curative chemical formulations, or browse cures in the Cures Dispensary.
              </p>
            </div>
          ) : (
            /* STEP 1: CART ITEMS VIEW */
            <div className="space-y-3">
              {/* Delivery Speed Pre-Selector in Cart View */}
              <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-700" />
                    Delivery Speed
                  </span>
                  <span className="text-[11px] text-stone-500">Pick preferred timing</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDeliverySpeed('quick')}
                    className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                      deliverySpeed === 'quick'
                        ? 'border-amber-500 bg-amber-50 text-amber-950 font-semibold ring-1 ring-amber-500'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                        Quick Delivery
                      </span>
                      <span className="font-mono text-[10px]">₹99</span>
                    </div>
                    <div className="font-bold text-xs text-stone-900 mt-0.5">60 Mins</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliverySpeed('standard')}
                    className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                      deliverySpeed === 'standard'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Truck className="w-3 h-3 text-emerald-700" />
                        Normal Delivery
                      </span>
                      <span className="font-mono text-[10px]">{subtotal >= 500 ? 'FREE' : '₹50'}</span>
                    </div>
                    <div className="font-bold text-xs text-stone-900 mt-0.5">1-2 Days</div>
                  </button>
                </div>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 rounded-xl border border-stone-200 bg-white hover:border-emerald-200 transition-colors space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        {item.product.certifiedOrganic && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 flex items-center gap-0.5">
                            <Leaf className="w-2.5 h-2.5" />
                            ORGANIC
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-stone-500">
                          {item.product.category}
                        </span>
                      </div>
                      <h5 className="font-bold text-stone-900 text-xs leading-snug">
                        {item.product.name}
                      </h5>
                      <p className="text-[11px] text-stone-500">
                        {item.product.activeIngredient}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-stone-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                    <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="p-1 rounded text-stone-600 hover:bg-white hover:text-stone-900 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs font-semibold px-2 text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="p-1 rounded text-stone-600 hover:bg-white hover:text-stone-900 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-stone-900">
                        ₹{(item.product.price * item.quantity).toFixed(0)}
                      </span>
                      <span className="text-[10px] text-stone-400 block">
                        ₹{item.product.price.toFixed(0)} / {item.product.unit}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-xs text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Clear Cart
                </button>
                <div className="text-[11px] text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Agronomist Verified Formulations</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout CTA */}
        {!orderSuccess && checkoutStep === 'cart' && cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal ({totalItemsCount} items):</span>
                <span className="font-mono font-semibold text-stone-900">₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span className="flex items-center gap-1">
                  {deliverySpeed === 'quick' ? (
                    <>
                      <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                      <span>Quick Delivery (60 Mins):</span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-3 h-3 text-emerald-700" />
                      <span>Normal Delivery (1-2 Days):</span>
                    </>
                  )}
                </span>
                <span className="font-mono font-semibold text-stone-900">
                  {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${shippingFee.toFixed(0)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-1 border-t border-stone-200">
                <span>Total:</span>
                <span className="font-mono font-bold text-emerald-950">₹{grandTotal.toFixed(0)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCheckoutStep('delivery')}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Delivery & Payment ({deliverySpeed === 'quick' ? '⚡ 60 Mins' : '1-2 Days'})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
