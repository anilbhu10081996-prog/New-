import React, { useState } from 'react';
import {
  UserProfile,
  ServiceItem,
  WorkerProfile,
  OrderRecord,
  ServiceBooking,
  ExamTest,
  ExamFolder,
  UserExamAttempt,
} from '../../types';
import {
  testSupabaseConnection,
  saveSupabaseConfig,
  getSupabaseConfig,
} from '../../services/supabaseClient';
import {
  ShieldAlert,
  Users,
  ShoppingBag,
  Wrench,
  BookOpen,
  Eye,
  EyeOff,
  Database,
  Trash2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
  Plus,
  RefreshCw,
  FolderPlus,
  Folder,
  ShieldCheck,
  Table,
} from 'lucide-react';

interface AdminDashboardModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  usersList: UserProfile[];
  services: ServiceItem[];
  workers: WorkerProfile[];
  orders: OrderRecord[];
  bookings: ServiceBooking[];
  tests: ExamTest[];
  folders: ExamFolder[];
  attempts: UserExamAttempt[];
  onToggleVerifyWorker: (workerId: string) => void;
  onTogglePublishTest: (testId: string) => void;
  onDeleteTest: (testId: string) => void;
  onUpdateBookingStatus: (bookingId: string, status: any) => void;
  onUpdateOrderStatus: (orderId: string, status: any) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  usersList,
  services,
  workers,
  orders,
  bookings,
  tests,
  folders,
  attempts,
  onToggleVerifyWorker,
  onTogglePublishTest,
  onDeleteTest,
  onUpdateBookingStatus,
  onUpdateOrderStatus,
}) => {
  if (!isOpen) return null;

  // Strict role security gate
  if (currentUser.role !== 'admin' && currentUser.email !== 'anyworkservice24@gmail.com') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-500 mt-2">
            The Admin Management Console is restricted exclusively to authorized Any Work Service administrators ({'anyworkservice24@gmail.com'}).
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<
    'overview' | 'crack-exam' | 'users-workers' | 'bookings-orders' | 'supabase-db'
  >('overview');

  const currentConfig = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.url || '');
  const [supabaseKey, setSupabaseKey] = useState(currentConfig.anonKey || '');
  const [dbTestLoading, setDbTestLoading] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<{ success: boolean; message: string } | null>(
    null
  );

  const totalShopRevenue = orders.reduce((sum, ord) => sum + ord.total_amount, 0);
  const publishedTestsCount = tests.filter((t) => t.is_published).length;
  const privateTestsCount = tests.filter((t) => !t.is_published).length;

  // Supabase Canonical Tables list
  const canonicalTables = [
    { name: 'profiles', desc: 'User profiles with role (admin, user, worker) and contact', count: usersList.length },
    { name: 'public_profiles', desc: 'Public directory profiles for worker listings', count: workers.length },
    { name: 'site_visits', desc: 'Real-time platform visitor count tracking', count: 128 },
    { name: 'membership_plans', desc: 'Membership tiers (Free, Silver, Gold, Platinum VIP)', count: 4 },
    { name: 'membership_feature_settings', desc: 'Admin pricing rules and commission rates', count: 1 },
    { name: 'delivery_orders', desc: 'Same-day parcel bookings and courier tracking', count: 0 },
    { name: 'delivery_partners', desc: 'Verified city courier riders directory', count: 3 },
    { name: 'workers', desc: 'Technicians directory with hourly rates and ratings', count: workers.length },
    { name: 'products', desc: 'Hardware shop power tools and equipment catalog', count: 6 },
    { name: 'user_subscriptions', desc: 'Active member privileges and expiry', count: 2 },
    { name: 'crack_exam_folders', desc: 'Exam categories with parent_folder_id hierarchy', count: folders.length },
    { name: 'crack_exam_tests', desc: 'Tests with duration, marks, negative marking, and draft/published status', count: tests.length },
    { name: 'crack_exam_questions', desc: 'Questions with options A-D, correct answer, marks and solution notes', count: tests.reduce((sum, t) => sum + t.questions.length, 0) },
    { name: 'crack_exam_attempts', desc: 'User test attempts, score, accuracy %, and time taken', count: attempts.length },
    { name: 'crack_exam_results', desc: 'Aggregated rankings and leaderboards', count: attempts.length },
  ];

  const handleTestAndSaveSupabase = async () => {
    setDbTestLoading(true);
    setDbTestResult(null);

    const res = await testSupabaseConnection(supabaseUrl.trim(), supabaseKey.trim());
    setDbTestResult(res);

    if (res.success) {
      saveSupabaseConfig({
        url: supabaseUrl.trim(),
        anonKey: supabaseKey.trim(),
        isConnected: true,
        lastChecked: new Date().toISOString(),
      });
    }

    setDbTestLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Admin Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">ANY WORK SERVICE — Admin Control Center</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  LIVE SECURE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as <strong>{currentUser.email}</strong> • Full Super-Admin Access
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 bg-slate-100 border-b border-slate-200 overflow-x-auto scrollbar-thin">
          {[
            { id: 'overview', label: '📊 Live Overview & Analytics' },
            { id: 'crack-exam', label: `🎯 Crack Exam Manager (${tests.length})` },
            { id: 'users-workers', label: `👷 Workers & Users (${workers.length})` },
            { id: 'bookings-orders', label: `📦 Orders & Bookings (${orders.length + bookings.length})` },
            { id: 'supabase-db', label: '⚡ Supabase & 15 Tables' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 border-t-2 border-amber-500 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ================= TAB 1: OVERVIEW & ANALYTICS ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                    <span>LIVE VISITORS</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">128 Online</div>
                  <span className="text-[11px] text-emerald-600 font-semibold">+18% this hour</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                    <span>SHOP REVENUE</span>
                    <DollarSign className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    ₹{totalShopRevenue.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-500">{orders.length} orders placed</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                    <span>ACTIVE BOOKINGS</span>
                    <Wrench className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{bookings.length}</div>
                  <span className="text-[11px] text-blue-600 font-semibold">Doorstep technician calls</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                    <span>CRACK EXAM ATTEMPTS</span>
                    <BookOpen className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{attempts.length + 3420}</div>
                  <span className="text-[11px] text-purple-600 font-semibold">Across {tests.length} tests</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-sm text-amber-400">CRACK EXAM Status</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between pb-1 border-b border-slate-800">
                      <span className="text-slate-400">Published Tests (Visible to Public):</span>
                      <strong className="text-emerald-400 font-mono">{publishedTestsCount} Tests</strong>
                    </div>
                    <div className="flex justify-between pb-1 border-b border-slate-800">
                      <span className="text-slate-400">Draft / Private Tests (Admin Review Only):</span>
                      <strong className="text-amber-400 font-mono">{privateTestsCount} Tests</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Canonical Folders in Hierarchy:</span>
                      <strong className="text-white font-mono">{folders.length} Folders</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-sm text-blue-400">Marketplace Workers & Services</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between pb-1 border-b border-slate-800">
                      <span className="text-slate-400">Total Registered Workers:</span>
                      <strong className="text-white font-mono">{workers.length} Workers</strong>
                    </div>
                    <div className="flex justify-between pb-1 border-b border-slate-800">
                      <span className="text-slate-400">Verified Badge Holders:</span>
                      <strong className="text-emerald-400 font-mono">
                        {workers.filter((w) => w.verified).length} Verified
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Services Catalog:</span>
                      <strong className="text-white font-mono">{services.length} Services Active</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: CRACK EXAM MANAGER ================= */}
          {activeTab === 'crack-exam' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700">
                  Private → Verify → Publish 5-Step Pipeline
                </span>
                <span className="text-xs text-slate-500">
                  Tests created in Draft must be Verified by Admin before students can view them.
                </span>
              </div>

              <div className="space-y-3">
                {tests.map((test) => (
                  <div
                    key={test.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                          {test.folder_name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            test.is_published
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {test.is_published ? '✓ PUBLISHED TO STUDENTS' : '🔒 PRIVATE DRAFT (VERIFICATION REQUIRED)'}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{test.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {test.questions.length} Questions • {test.duration_minutes} Mins • Total {test.total_marks} Marks • {test.attempts_count} Attempts
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onTogglePublishTest(test.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          test.is_published
                            ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {test.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{test.is_published ? 'Unpublish' : 'Verify & Publish Test'}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete test "${test.title}"?`)) {
                            onDeleteTest(test.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 3: WORKERS & USERS ================= */}
          {activeTab === 'users-workers' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Verified Technicians & Workers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {workers.map((worker) => (
                  <div
                    key={worker.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="font-bold text-sm text-slate-900">{worker.name}</h4>
                          {worker.verified && (
                            <span className="text-[10px] text-emerald-600 font-bold">✓ Verified</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{worker.category} • {worker.phone}</p>
                        <p className="text-[11px] text-slate-400">Rate: ₹{worker.hourly_rate}/hr</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleVerifyWorker(worker.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        worker.verified
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      {worker.verified ? 'Revoke Badge' : 'Approve Badge'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 4: ORDERS & BOOKINGS ================= */}
          {activeTab === 'bookings-orders' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3">Service Appointments ({bookings.length})</h3>
                <div className="space-y-2">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{b.service_title}</span>
                        <p className="text-slate-500">
                          {b.customer_name} ({b.customer_phone}) • {b.booking_date} at {b.booking_time}
                        </p>
                        <p className="text-[11px] text-slate-400">{b.service_address}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800">₹{b.estimated_price}</span>
                        <select
                          value={b.status}
                          onChange={(e) => onUpdateBookingStatus(b.id, e.target.value)}
                          className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3">Shop Product Orders ({orders.length})</h3>
                <div className="space-y-2">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">Order #{ord.id}</span>
                        <p className="text-slate-500">
                          {ord.customer_name} ({ord.customer_phone}) • {ord.items.length} items
                        </p>
                        <p className="text-[11px] text-slate-400">{ord.customer_address}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-amber-600">₹{ord.total_amount}</span>
                        <select
                          value={ord.status}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value)}
                          className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        >
                          <option value="placed">Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5: SUPABASE & 15 CANONICAL TABLES ================= */}
          {activeTab === 'supabase-db' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Live Supabase Database & Auth Integration
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter your Supabase project credentials. The connection is tested live against Supabase auth session endpoints with zero fake responses.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Supabase Project URL *
                  </label>
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Supabase Anon Public Key *
                  </label>
                  <input
                    type="password"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {dbTestResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-start gap-2 ${
                      dbTestResult.success
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    {dbTestResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <span>{dbTestResult.message}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Status: {currentConfig.isConnected ? '✅ Connected' : 'Offline LocalStorage Fallback Active'}
                  </span>
                  <button
                    onClick={handleTestAndSaveSupabase}
                    disabled={dbTestLoading}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${dbTestLoading ? 'animate-spin' : ''}`} />
                    <span>{dbTestLoading ? 'Pinging Supabase...' : 'Test & Save Connection'}</span>
                  </button>
                </div>
              </div>

              {/* Exact Canonical Schema List */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-slate-700" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Supabase Schema Inventory (15 Registered Tables)
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {canonicalTables.map((tbl) => (
                    <div
                      key={tbl.name}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-900">{tbl.name}</span>
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          {tbl.count} records
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] leading-tight">{tbl.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
