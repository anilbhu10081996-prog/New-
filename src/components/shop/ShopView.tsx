import React, { useState } from 'react';
import { ProductItem, CartItem, OrderRecord, UserProfile } from '../../types';
import {
  ShoppingBag,
  Star,
  Plus,
  Minus,
  Trash2,
  Share2,
  Check,
  Search,
  ShoppingCart,
  X,
  CreditCard,
  Truck,
  ShieldCheck,
} from 'lucide-react';

interface ShopViewProps {
  currentUser: UserProfile;
  products: ProductItem[];
  cart: CartItem[];
  onAddToCart: (product: ProductItem) => void;
  onUpdateCartQty: (productId: string, delta: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: OrderRecord) => void;
  onShare: (title: string, text: string, url: string) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  currentUser,
  products,
  cart,
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onClearCart,
  onPlaceOrder,
  onShare,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProductModal, setActiveProductModal] = useState<ProductItem | null>(null);
  const [showCartDrawer, setShowCartDrawer] = useState<boolean>(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);

  // Checkout form state
  const [customerName, setCustomerName] = useState<string>(currentUser.full_name || '');
  const [customerPhone, setCustomerPhone] = useState<string>(currentUser.phone || '');
  const [customerAddress, setCustomerAddress] = useState<string>(currentUser.address || '');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);

  const categories = ['all', 'Power Tools', 'Electrical', 'Plumbing Tools', 'Safety Gear', 'Hardware', 'Cleaning Gear'];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert('Please fill out all address details for delivery');
      return;
    }

    setIsSubmittingOrder(true);

    const newOrder: OrderRecord = {
      id: 'ord_' + Date.now(),
      user_id: currentUser.id,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      customer_address: customerAddress.trim(),
      items: [...cart],
      total_amount: cartTotal,
      status: 'placed',
      payment_method: paymentMethod,
      created_at: new Date().toISOString(),
    };

    setTimeout(() => {
      onPlaceOrder(newOrder);
      onClearCart();
      setIsSubmittingOrder(false);
      setShowCheckoutModal(false);
      setShowCartDrawer(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Shop Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full border border-white/20">
            ANY WORK HARDWARE & TOOL SHOP
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">
            Professional Tools & Equipment Delivered To Your Doorstep
          </h1>
          <p className="text-amber-100 text-sm mt-2">
            100% genuine industrial tools, wiring testers, plumbing kits, safety helmets & consumables with express 24-hour delivery across Delhi NCR.
          </p>
        </div>

        {/* Floating Cart Button */}
        <button
          onClick={() => setShowCartDrawer(true)}
          className="relative px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl flex items-center gap-3 transition-transform active:scale-95 shrink-0"
        >
          <ShoppingCart className="w-5 h-5 text-amber-400" />
          <span>View Cart</span>
          {cartItemCount > 0 && (
            <span className="bg-amber-500 text-slate-950 text-xs px-2 py-0.5 rounded-full font-black">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search power tools, multimeter, pipes, safety gear..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors capitalize ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'All Products' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((product) => {
          const discountPct = Math.round(
            ((product.original_price - product.price) / product.original_price) * 100
          );
          const cartItem = cart.find((i) => i.product.id === product.id);

          return (
            <div
              key={product.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              {/* Product Image & Badges */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer" onClick={() => setActiveProductModal(product)}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow">
                  {discountPct}% OFF
                </span>
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  {product.rating}
                </span>
              </div>

              {/* Product Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3
                    onClick={() => setActiveProductModal(product)}
                    className="text-sm sm:text-base font-bold text-slate-900 mt-1 hover:text-amber-600 cursor-pointer line-clamp-2"
                  >
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Price and Cart Action */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-black text-slate-900">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹{product.original_price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {cartItem ? (
                      <div className="flex items-center justify-between border border-amber-500 bg-amber-50/50 rounded-xl px-2 py-1 flex-1">
                        <button
                          onClick={() => onUpdateCartQty(product.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-800 hover:bg-slate-100"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-extrabold text-sm text-slate-900 px-3">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateCartQty(product.id, 1)}
                          className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-800 hover:bg-slate-100"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onAddToCart(product)}
                        className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                        <span>Add to Cart</span>
                      </button>
                    )}

                    {/* Share Product Button */}
                    <button
                      onClick={() =>
                        onShare(
                          `${product.title} - ANY WORK SERVICE`,
                          `Check out ${product.title} for ₹${product.price} on ANY WORK SERVICE Shop!`,
                          window.location.href
                        )
                      }
                      title="Share product"
                      className="p-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===================== PRODUCT DETAILS MODAL ===================== */}
      {activeProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveProductModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 mb-4">
              <img
                src={activeProductModal.image}
                alt={activeProductModal.title}
                className="w-full h-full object-cover"
              />
            </div>

            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              {activeProductModal.category}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              {activeProductModal.title}
            </h2>

            <div className="flex items-center gap-3 my-3">
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-xs font-bold text-amber-700">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {activeProductModal.rating} ({activeProductModal.reviews_count} reviews)
              </div>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg">
                In Stock & Verified
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {activeProductModal.description}
            </p>

            {/* Specifications */}
            <div className="bg-slate-50 rounded-xl p-3 mb-6 border border-slate-200 text-xs">
              <span className="font-bold text-slate-800 block mb-2">Specifications & Warranty:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                {activeProductModal.specifications.map((spec, i) => (
                  <li key={i}>{spec}</li>
                ))}
              </ul>
            </div>

            {/* Price and Action */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <div>
                <span className="text-2xl font-black text-slate-900">
                  ₹{activeProductModal.price.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 line-through ml-2">
                  ₹{activeProductModal.original_price.toLocaleString()}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onAddToCart(activeProductModal);
                    setActiveProductModal(null);
                    setShowCartDrawer(true);
                  }}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== SLIDE-OUT CART DRAWER ===================== */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-lg">Your Cart ({cartItemCount})</h3>
              </div>
              <button
                onClick={() => setShowCartDrawer(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="font-medium text-sm">Your cart is currently empty</p>
                  <button
                    onClick={() => setShowCartDrawer(false)}
                    className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    Browse Tools & Hardware
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-14 h-14 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.product.title}
                      </h4>
                      <p className="text-xs font-extrabold text-amber-600 mt-0.5">
                        ₹{item.product.price}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateCartQty(item.product.id, -1)}
                          className="w-6 h-6 rounded bg-white border border-slate-300 flex items-center justify-center text-xs font-bold hover:bg-slate-100"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateCartQty(item.product.id, 1)}
                          className="w-6 h-6 rounded bg-white border border-slate-300 flex items-center justify-center text-xs font-bold hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-900">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express Delivery:</span>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Amount:</span>
                    <span className="text-amber-600">₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl shadow text-sm transition-transform active:scale-98"
                >
                  Proceed to Checkout (₹{cartTotal.toLocaleString()})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== CHECKOUT MODAL ===================== */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Confirm Delivery Details</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your address to receive your order within 24 hours.
            </p>

            <form onSubmit={handleCheckoutSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Delivery Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="House/Flat No., Landmark, City, Pincode"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'cod'
                        ? 'border-amber-500 bg-amber-50 text-slate-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <span>💵 Cash on Delivery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'upi'
                        ? 'border-amber-500 bg-amber-50 text-slate-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <span>📱 UPI / QR Pay</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOrder}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow flex items-center gap-1.5"
                >
                  {isSubmittingOrder ? 'Placing Order...' : `Confirm Order (₹${cartTotal})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
