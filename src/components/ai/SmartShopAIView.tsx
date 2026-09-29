import React, { useState } from 'react';
import { ServiceItem, ProductItem } from '../../types';
import { Sparkles, Bot, ArrowRight, CheckCircle2, Search, Wrench, ShoppingBag } from 'lucide-react';

interface SmartShopAIViewProps {
  services: ServiceItem[];
  products: ProductItem[];
  onSelectService: (service: ServiceItem) => void;
  onAddToCart: (product: ProductItem) => void;
}

export const SmartShopAIView: React.FC<SmartShopAIViewProps> = ({
  services,
  products,
  onSelectService,
  onAddToCart,
}) => {
  const [query, setQuery] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{
    estimatedCost: string;
    suggestedServices: ServiceItem[];
    suggestedProducts: ProductItem[];
    expertAdvice: string;
  } | null>(null);

  const quickPrompts = [
    'My AC is blowing warm air and making humming sound',
    'Water leaking under bathroom sink and pipe is rusted',
    'Short circuit in bedroom switchboard and sparks flying',
    'Full house deep cleaning after white-wash renovation',
  ];

  const handleAnalyze = (inputQuery: string) => {
    const q = inputQuery.trim().toLowerCase();
    if (!q) return;

    setAnalyzing(true);
    setTimeout(() => {
      let cost = '₹350 - ₹850';
      let matchingServices = services.slice(0, 2);
      let matchingProducts = products.slice(0, 2);
      let advice =
        'Based on your issue, a verified technician should inspect the connection. Do not attempt electrical or high pressure gas repairs without insulated tools.';

      if (q.includes('ac') || q.includes('cool') || q.includes('air')) {
        cost = '₹499 - ₹1,800';
        matchingServices = services.filter((s) => s.category === 'Appliances');
        matchingProducts = products.filter((p) => p.category === 'Electrical' || p.category === 'Safety Gear');
        advice =
          'Warm air indicates either dust choked condenser coils or refrigerant leak. Recommended action: Split AC Jet Service and Gas pressure check.';
      } else if (q.includes('leak') || q.includes('pipe') || q.includes('sink') || q.includes('water')) {
        cost = '₹249 - ₹650';
        matchingServices = services.filter((s) => s.category === 'Plumbing');
        matchingProducts = products.filter((p) => p.category === 'Plumbing Tools');
        advice =
          'Turn off the main supply valve to prevent floor seepage. The waste coupling or thread seal Teflon tape likely needs replacement.';
      } else if (q.includes('circuit') || q.includes('spark') || q.includes('electric') || q.includes('switch')) {
        cost = '₹199 - ₹750';
        matchingServices = services.filter((s) => s.category === 'Electrical');
        matchingProducts = products.filter((p) => p.category === 'Electrical' || p.category === 'Power Tools');
        advice =
          'Turn off the main MCB immediately. Sparking usually occurs due to loose terminal screws or overloaded neutral wire.';
      } else if (q.includes('clean') || q.includes('dust') || q.includes('wash')) {
        cost = '₹799 - ₹2,400';
        matchingServices = services.filter((s) => s.category === 'Cleaning' || s.category === 'Sanitization');
        matchingProducts = products.filter((p) => p.category === 'Cleaning Gear');
        advice =
          'Post-renovation dust contains cement particles. Industrial vacuuming and chemical floor buffing is recommended.';
      }

      setAiResult({
        estimatedCost: cost,
        suggestedServices: matchingServices,
        suggestedProducts: matchingProducts,
        expertAdvice: advice,
      });
      setAnalyzing(false);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-black/30 w-fit px-3 py-1 rounded-full border border-white/20 mb-3">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>SMART SHOP & SERVICE AI ASSISTANT</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">
          Describe Any Repair or Project — Get Instant Cost & Solution
        </h1>
        <p className="text-amber-100 text-sm mt-2 max-w-2xl">
          Enter your problem in plain words. Our smart algorithm matches the exact service specialist, estimates local repair costs, and recommends essential tools.
        </p>
      </div>

      {/* Input Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <label className="block text-xs font-bold text-slate-700 uppercase">
          Describe the problem or requirement
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze(query)}
            placeholder="e.g. My bathroom tap is broken and water is dripping constantly..."
            className="flex-1 px-4 py-3 border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
          />
          <button
            onClick={() => handleAnalyze(query)}
            disabled={analyzing || !query.trim()}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-2xl text-sm font-bold shadow flex items-center justify-center gap-2 transition-transform active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{analyzing ? 'Analyzing Issue...' : 'Diagnose & Estimate'}</span>
          </button>
        </div>

        {/* Quick Sample Prompts */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[11px] font-semibold text-slate-400">Try these common issues:</span>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(p);
                  handleAnalyze(p);
                }}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-xl transition-colors text-left"
              >
                "{p}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendation Result */}
      {aiResult && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full uppercase">
                AI Diagnostic Summary
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                Estimated Local Cost: <span className="text-emerald-600">{aiResult.estimatedCost}</span>
              </h3>
            </div>
          </div>

          {/* Expert Advice Note */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
            <strong className="text-amber-900 block mb-1">🛠 Technical Recommendation:</strong>
            {aiResult.expertAdvice}
          </div>

          {/* Recommended Services */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
              Recommended Professional Services:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aiResult.suggestedServices.map((srv) => (
                <div
                  key={srv.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">{srv.title}</h5>
                    <p className="text-xs text-slate-500">From ₹{srv.price_starting}</p>
                  </div>
                  <button
                    onClick={() => onSelectService(srv)}
                    className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow hover:bg-slate-800"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended DIY Tools */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
              Essential Hardware & Replacement Parts:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aiResult.suggestedProducts.map((prd) => (
                <div
                  key={prd.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3"
                >
                  <img
                    src={prd.image}
                    alt={prd.title}
                    className="w-12 h-12 object-cover rounded-xl shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-slate-900 truncate">{prd.title}</h5>
                    <p className="text-xs font-black text-amber-600">₹{prd.price}</p>
                  </div>
                  <button
                    onClick={() => onAddToCart(prd)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow shrink-0"
                  >
                    Buy Tool
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
