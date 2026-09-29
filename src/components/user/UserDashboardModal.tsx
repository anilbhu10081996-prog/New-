import React, { useState } from 'react';
import {
  UserProfile,
  ServiceBooking,
  OrderRecord,
  WorkPost,
  UserExamAttempt,
} from '../../types';
import {
  User,
  Calendar,
  ShoppingBag,
  Briefcase,
  Award,
  Crown,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
} from 'lucide-react';

interface UserDashboardModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  bookings: ServiceBooking[];
  orders: OrderRecord[];
  workPosts: WorkPost[];
  attempts: UserExamAttempt[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  bookings,
  orders,
  workPosts,
  attempts,
  onUpdateProfile,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'orders' | 'posts' | 'exams'>('profile');

  // Edit profile form
  const [name, setName] = useState(currentUser.full_name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const myBookings = bookings.filter((b) => b.user_id === currentUser.id);
  const myOrders = orders.filter((o) => o.user_id === currentUser.id);
  const myPosts = workPosts.filter((p) => p.user_id === currentUser.id);
  const myAttempts = attempts.filter((a) => a.user_id === currentUser.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      full_name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={currentUser.full_name}
              className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
            />
            <div>
              <h2 className="text-base font-bold text-white">{currentUser.full_name}</h2>
              <p className="text-xs text-slate-400">
                {currentUser.email} • {currentUser.membership.toUpperCase()} Member
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

        {/* Tab Strip */}
        <div className="flex items-center gap-1 px-6 pt-3 bg-slate-100 border-b border-slate-200 overflow-x-auto scrollbar-thin">
          {[
            { id: 'profile', label: '👤 Profile & Settings' },
            { id: 'bookings', label: `📅 My Bookings (${myBookings.length})` },
            { id: 'orders', label: `🛍️ My Orders (${myOrders.length})` },
            { id: 'posts', label: `📌 My Tasks (${myPosts.length})` },
            { id: 'exams', label: `🎯 Exam Attempts (${myAttempts.length})` },
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
          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-xl space-y-5">
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Registered Email (Read-Only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full px-3.5 py-2 bg-slate-100 border border-slate-300 rounded-xl text-sm text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Default Service & Shipping Address
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {savedSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Profile updated successfully!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-3">
              {myBookings.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No service bookings found.
                </div>
              ) : (
                myBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-sm text-slate-900">{b.service_title}</span>
                      <p className="text-slate-500 mt-0.5">
                        {b.booking_date} at {b.booking_time} • {b.service_address}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900">₹{b.estimated_price}</span>
                      <span className="block text-[11px] font-bold text-emerald-600 uppercase">
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {myOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No shop orders found.
                </div>
              ) : (
                myOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                      <span className="font-mono font-bold text-slate-900">Order #{ord.id}</span>
                      <span className="text-xs font-black text-amber-600">₹{ord.total_amount}</span>
                    </div>
                    <p className="text-slate-500">Shipped to: {ord.customer_address}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {ord.items.map((item, i) => (
                        <span key={i} className="bg-white border px-2 py-0.5 rounded font-medium">
                          {item.product.title} (x{item.quantity})
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* EXAM ATTEMPTS */}
          {activeTab === 'exams' && (
            <div className="space-y-3">
              {myAttempts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No exam attempts recorded yet.
                </div>
              ) : (
                myAttempts.map((att) => (
                  <div
                    key={att.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-sm text-slate-900">{att.test_title}</span>
                      <p className="text-slate-500 mt-0.5">
                        {att.folder_name} • {new Date(att.attempted_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-amber-600">
                        {att.score} / {att.total_marks}
                      </span>
                      <span className="block text-[11px] font-bold text-blue-600">
                        {att.accuracy_percentage}% Accuracy
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* MY POSTS */}
          {activeTab === 'posts' && (
            <div className="space-y-3">
              {myPosts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  You haven't posted any work requirements yet.
                </div>
              ) : (
                myPosts.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1"
                  >
                    <span className="font-bold text-sm text-slate-900">{p.title}</span>
                    <p className="text-slate-500">{p.description}</p>
                    <div className="pt-2 flex justify-between font-bold text-slate-800">
                      <span>₹{p.budget} Budget</span>
                      <span className="text-emerald-600">{p.applicants_count} Workers Applied</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
