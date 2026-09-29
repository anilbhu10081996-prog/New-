import React, { useState } from 'react';
import {
  ServiceItem,
  WorkerProfile,
  ProductItem,
  ExamTest,
  UserProfile,
} from '../../types';
import {
  Wrench,
  Search,
  BookOpen,
  ShoppingBag,
  Truck,
  Users,
  Star,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

interface HomeViewProps {
  currentUser: UserProfile;
  services: ServiceItem[];
  workers: WorkerProfile[];
  products: ProductItem[];
  tests: ExamTest[];
  onNavigate: (view: string) => void;
  onBookService: (service: ServiceItem) => void;
  onHireWorker: (worker: WorkerProfile) => void;
  onAddToCart: (product: ProductItem) => void;
  onOpenBusinessModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentUser,
  services,
  workers,
  products,
  tests,
  onNavigate,
  onBookService,
  onHireWorker,
  onAddToCart,
  onOpenBusinessModal,
}) => {
  const [globalSearch, setGlobalSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const isAdmin = currentUser.role === 'admin' || currentUser.email === 'anyworkservice24@gmail.com';
  const publicTests = tests.filter((t) => isAdmin || t.is_published);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;

    const term = globalSearch.toLowerCase();
    if (term.includes('exam') || term.includes('test') || term.includes('cgl') || term.includes('railway')) {
      onNavigate('crack-exam');
    } else if (term.includes('tool') || term.includes('drill') || term.includes('shop') || term.includes('buy')) {
      onNavigate('shop');
    } else if (term.includes('worker') || term.includes('hire') || term.includes('electrician') || term.includes('plumber')) {
      onNavigate('workers');
    } else if (term.includes('business') || term.includes('दुकान')) {
      onOpenBusinessModal();
    } else {
      onNavigate('services');
    }
  };

  const faqs = [
    {
      q: 'How does ANY WORK SERVICE work for booking technicians?',
      a: 'Choose your desired service (electrical, plumbing, AC repair, cleaning), pick your convenient date and time, and our certified local specialist will arrive at your doorstep equipped with professional tools.',
    },
    {
      q: 'What is the CRACK EXAM test series platform?',
      a: 'CRACK EXAM is an official-pattern test preparation engine with the mission "Your Success, Our Mission". It features full mock tests for SSC CGL, Railway RRB NTPC, State Police Constable, ITI Electrician, and Banking exams with real countdown timers, negative marking (-0.5 / -0.66), instant scorecards, and step-by-step Hindi/English solutions.',
    },
    {
      q: 'Are workers on the platform background verified?',
      a: 'Yes, all technicians holding the green "Verified" badge have passed identity verification, background screening, and trade certification checks.',
    },
    {
      q: 'Can I purchase tools and hardware with doorstep delivery?',
      a: 'Yes, our Hardware & Tool Shop stocks 100% genuine impact drills, digital multimeters, pipe wrenches, safety helmets, and adhesives with same-day express delivery across Delhi NCR.',
    },
  ];

  return (
    <div className="space-y-12">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ANY WORK SERVICE • ONE PLATFORM. MANY POSSIBILITIES.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            सही काम के लिए सही साथी <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
              Work • Shop • Crack Exam
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            One Platform. Many Possibilities. From doorstep AC repairs and verified technician hiring to hardware tool delivery, business registration, and Crack Exam competitive mock tests.
          </p>

          {/* Global Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
            <div className="flex flex-col sm:flex-row gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Search 'Electrician', 'AC Repair', 'SSC Mock Test', 'Impact Drill'..."
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-white text-sm focus:outline-none placeholder:text-slate-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm shadow transition-transform active:scale-95 shrink-0 flex items-center justify-center gap-2"
              >
                <span>Find Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Categories Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-semibold">
            {[
              { label: '⚡ Electrician', view: 'services' },
              { label: '🎯 Crack Exam', view: 'crack-exam' },
              { label: '🔧 Plumber', view: 'services' },
              { label: '❄️ AC Repair', view: 'services' },
              { label: '🛍️ Tool Shop', view: 'shop' },
              { label: '📦 Express Delivery', view: 'delivery' },
            ].map((cat, i) => (
              <button
                key={i}
                onClick={() => onNavigate(cat.view)}
                className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              >
                {cat.label}
              </button>
            ))}
            <button
              onClick={onOpenBusinessModal}
              className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 transition-colors"
            >
              🏪 Register Business
            </button>
          </div>
        </div>
      </section>

      {/* ================= CRACK EXAM HIGHLIGHT SECTION ================= */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>CRACK EXAM • YOUR SUCCESS, OUR MISSION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Official Pattern Practice Tests & Solution Keys
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Attempt full-length mock tests with real countdown timers, negative marking, and step-by-step Hindi/English solutions.
            </p>
          </div>

          <button
            onClick={() => onNavigate('crack-exam')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow flex items-center gap-1.5 transition-transform active:scale-95 shrink-0"
          >
            <span>View All Tests ({publicTests.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Featured Tests */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {publicTests.slice(0, 3).map((test) => (
            <div
              key={test.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/50 transition-colors flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-800">
                  {test.folder_name}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-white mt-2 line-clamp-2">
                  {test.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-3 pt-2 border-t border-slate-900">
                  <span>{test.questions.length} Questions</span>
                  <span>•</span>
                  <span>{test.duration_minutes} Mins</span>
                  <span>•</span>
                  <span className="text-rose-400">-{test.negative_marks} Neg.</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('crack-exam')}
                className="mt-4 w-full py-2 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white rounded-xl text-xs font-bold transition-all text-center"
              >
                Attempt Mock Test →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURED POPULAR SERVICES ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Popular Doorstep Services
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified technicians arriving in under 45 minutes across Delhi NCR.
            </p>
          </div>

          <button
            onClick={() => onNavigate('services')}
            className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <span>See All ({services.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.slice(0, 4).map((srv) => (
            <div
              key={srv.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                  {srv.category}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-2 line-clamp-1">{srv.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{srv.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">FROM</span>
                  <span className="text-base font-black text-slate-900">₹{srv.price_starting}</span>
                </div>
                <button
                  onClick={() => onBookService(srv)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HARDWARE & TOOLS SHOP HIGHLIGHT ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Hardware & Power Tools Shop
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Industrial grade tools with 1-year warranty and same-day delivery.
            </p>
          </div>

          <button
            onClick={() => onNavigate('shop')}
            className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <span>Open Shop ({products.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.slice(0, 3).map((prod) => (
            <div
              key={prod.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="aspect-16/9 bg-slate-100 overflow-hidden relative">
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
                <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow">
                  ₹{prod.price}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{prod.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{prod.description}</p>
                </div>
                <button
                  onClick={() => onAddToCart(prod)}
                  className="mt-3 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= VERIFIED WORKERS SPOTLIGHT ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Verified Independent Technicians
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hire trusted electricians, plumbers, and technicians directly.
            </p>
          </div>

          <button
            onClick={() => onNavigate('workers')}
            className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <span>All Workers ({workers.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workers.slice(0, 3).map((w) => (
            <div
              key={w.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <img
                  src={w.avatar}
                  alt={w.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-sm text-slate-900">{w.name}</h4>
                    {w.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-xs text-amber-700 font-semibold">{w.category}</span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-slate-700">{w.rating}</span>
                    <span>({w.jobs_completed}+ jobs)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onHireWorker(w)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow shrink-0"
              >
                Call
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FREQUENTLY ASKED QUESTIONS (FAQ) ================= */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Help & Guidance
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 font-bold text-sm text-slate-900 flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
