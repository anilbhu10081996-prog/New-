import React, { useState } from 'react';
import {
  ServiceItem,
  WorkerProfile,
  WorkPost,
  ServiceBooking,
  UserProfile,
} from '../../types';
import {
  Wrench,
  Star,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  Plus,
  Briefcase,
  UserCheck,
  Search,
  Filter,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface ServicesAndWorkersViewProps {
  currentUser: UserProfile;
  services: ServiceItem[];
  workers: WorkerProfile[];
  workPosts: WorkPost[];
  onBookService: (booking: ServiceBooking) => void;
  onPostWork: (post: WorkPost) => void;
  onHireWorker: (worker: WorkerProfile) => void;
}

export const ServicesAndWorkersView: React.FC<ServicesAndWorkersViewProps> = ({
  currentUser,
  services,
  workers,
  workPosts,
  onBookService,
  onPostWork,
  onHireWorker,
}) => {
  const [activeTab, setActiveTab] = useState<'services' | 'workers' | 'post-work'>('services');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Service Booking Modal State
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingName, setBookingName] = useState<string>(currentUser.full_name || '');
  const [bookingPhone, setBookingPhone] = useState<string>(currentUser.phone || '');
  const [bookingAddress, setBookingAddress] = useState<string>(currentUser.address || '');
  const [bookingDate, setBookingDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState<string>('10:00 AM');
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [isBookingSubmitting, setIsBookingSubmitting] = useState<boolean>(false);

  // Worker Hire Modal State
  const [selectedWorkerForHire, setSelectedWorkerForHire] = useState<WorkerProfile | null>(null);

  // Post Work Form State
  const [postTitle, setPostTitle] = useState<string>('');
  const [postCategory, setPostCategory] = useState<string>('Electrical');
  const [postBudget, setPostBudget] = useState<number>(1500);
  const [postTimeline, setPostTimeline] = useState<string>('Within 2 days');
  const [postAddress, setPostAddress] = useState<string>(currentUser.address || '');
  const [postPhone, setPostPhone] = useState<string>(currentUser.phone || '');
  const [postDescription, setPostDescription] = useState<string>('');
  const [isPostingWork, setIsPostingWork] = useState<boolean>(false);

  const categories = ['all', 'Cleaning', 'Appliances', 'Electrical', 'Plumbing', 'Painting', 'Carpentry', 'Sanitization', 'Security'];

  // Filtered Services
  const filteredServices = services.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filtered Workers
  const filteredWorkers = workers.filter((w) => {
    const matchesCat = selectedCategory === 'all' || w.category === selectedCategory;
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.skills.some((sk) => sk.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    setIsBookingSubmitting(true);
    const newBooking: ServiceBooking = {
      id: 'bk_' + Date.now(),
      service_id: selectedService.id,
      service_title: selectedService.title,
      user_id: currentUser.id,
      customer_name: bookingName.trim(),
      customer_phone: bookingPhone.trim(),
      service_address: bookingAddress.trim(),
      booking_date: bookingDate,
      booking_time: bookingTime,
      estimated_price: selectedService.price_starting,
      status: 'confirmed',
      notes: bookingNotes.trim(),
      created_at: new Date().toISOString(),
    };

    setTimeout(() => {
      onBookService(newBooking);
      setIsBookingSubmitting(false);
      setSelectedService(null);
    }, 400);
  };

  const handlePostWorkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postAddress.trim() || !postPhone.trim()) {
      alert('Please fill in task title, address, and phone number');
      return;
    }

    setIsPostingWork(true);
    const newPost: WorkPost = {
      id: 'wp_' + Date.now(),
      user_id: currentUser.id,
      user_name: currentUser.full_name || 'Anonymous User',
      title: postTitle.trim(),
      category: postCategory,
      budget: Number(postBudget) || 1000,
      timeline: postTimeline,
      address: postAddress.trim(),
      phone: postPhone.trim(),
      description: postDescription.trim(),
      status: 'open',
      created_at: new Date().toISOString(),
      applicants_count: 0,
    };

    setTimeout(() => {
      onPostWork(newPost);
      setIsPostingWork(false);
      setPostTitle('');
      setPostDescription('');
      setActiveTab('services');
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Subnav Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'services'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Explore Services ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('workers')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'workers'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verified Workers ({workers.length})
          </button>
          <button
            onClick={() => setActiveTab('post-work')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'post-work'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + Post a Task
          </button>
        </div>

        {/* Live Work Board Count */}
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>{workPosts.length} Open Tasks Live</span>
        </span>
      </div>

      {/* Search & Category Filter (only for services and workers) */}
      {activeTab !== 'post-work' && (
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'services'
                  ? 'Search AC repair, wiring, deep clean, plumbing...'
                  : 'Search workers by name, skills or locality...'
              }
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 1: SERVICES ===================== */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                    {service.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{service.rating}</span>
                    <span className="text-slate-400 font-normal">({service.reviews_count})</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{service.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                  {service.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 bg-slate-50 p-2 rounded-xl">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Response Time: <strong>{service.delivery_time}</strong></span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">STARTING AT</span>
                  <span className="text-lg font-black text-slate-900">₹{service.price_starting}</span>
                </div>

                <button
                  onClick={() => setSelectedService(service)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Book Service</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================== TAB 2: WORKERS ===================== */}
      {activeTab === 'workers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorkers.map((worker) => (
            <div
              key={worker.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900">{worker.name}</h3>
                      {worker.verified && (
                        <span title="Verified Worker">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      {worker.category} ({worker.experience_years}y Exp)
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <strong>{worker.rating} Rating</strong>
                    </span>
                    <span className="font-semibold text-slate-700">{worker.jobs_completed}+ Tasks Done</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{worker.location}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {worker.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">SERVICE CHARGE</span>
                  <span className="text-base font-black text-slate-900">₹{worker.hourly_rate} / hr</span>
                </div>

                <button
                  onClick={() => setSelectedWorkerForHire(worker)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contact Worker</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================== TAB 3: POST A WORK / TASK ===================== */}
      {activeTab === 'post-work' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-900 mb-1">
              Post Your Work Requirement
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Describe your task, set your budget, and verified workers in your area will contact you instantly.
            </p>

            <form onSubmit={handlePostWorkSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Work / Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. Need electrician for 3-phase wiring and switchboard replacement"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Work Category
                  </label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Cleaning">Cleaning & Sanitization</option>
                    <option value="Painting">Painting & Renovation</option>
                    <option value="Carpentry">Carpentry & Woodwork</option>
                    <option value="Appliances">AC & Appliances</option>
                    <option value="Security">CCTV & Hardware</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Expected Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={postBudget}
                    onChange={(e) => setPostBudget(Number(e.target.value))}
                    min={100}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Timeline
                  </label>
                  <select
                    value={postTimeline}
                    onChange={(e) => setPostTimeline(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Immediate / Emergency">Immediate / Emergency</option>
                    <option value="Today itself">Today itself</option>
                    <option value="Within 2 days">Within 2 days</option>
                    <option value="This weekend">This weekend</option>
                    <option value="Flexible schedule">Flexible schedule</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={postPhone}
                    onChange={(e) => setPostPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Location / Address *
                </label>
                <input
                  type="text"
                  required
                  value={postAddress}
                  onChange={(e) => setPostAddress(e.target.value)}
                  placeholder="e.g. Sector 62, Noida, Near Fortis Hospital"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Task Details & Requirements
                </label>
                <textarea
                  rows={3}
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  placeholder="Explain any specific tools needed, problem description, or timing..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isPostingWork}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow transition-transform active:scale-98"
                >
                  {isPostingWork ? 'Publishing Task...' : 'Publish Task to Work Board'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Live Work Board Preview */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-5 rounded-2xl">
              <h3 className="font-bold text-sm text-amber-400 mb-1">Live Work Feed</h3>
              <p className="text-xs text-slate-400">
                Current tasks posted by nearby customers looking for technicians.
              </p>
            </div>

            {workPosts.map((wp) => (
              <div
                key={wp.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-amber-400 transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {wp.category}
                  </span>
                  <span>{wp.timeline}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mt-1 line-clamp-2">{wp.title}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{wp.description}</p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-black text-slate-900">₹{wp.budget} Budget</span>
                  <span className="text-emerald-600 font-semibold">{wp.applicants_count} Workers Applied</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== SERVICE BOOKING MODAL ===================== */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Book: {selectedService.title}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Starting from ₹{selectedService.price_starting} • Verified Professional Dispatch
            </p>

            <form onSubmit={handleBookingSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
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
                  value={bookingPhone}
                  onChange={(e) => setBookingPhone(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Service Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={bookingAddress}
                  onChange={(e) => setBookingAddress(e.target.value)}
                  placeholder="Address where technician will arrive"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Preferred Time
                  </label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="06:30 PM">06:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBookingSubmitting}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow"
                >
                  {isBookingSubmitting ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== WORKER CONTACT / HIRE MODAL ===================== */}
      {selectedWorkerForHire && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl text-center">
            <img
              src={selectedWorkerForHire.avatar}
              alt={selectedWorkerForHire.name}
              className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-amber-400 shadow-md mb-3"
            />
            <h3 className="text-lg font-bold text-slate-900">{selectedWorkerForHire.name}</h3>
            <p className="text-xs text-slate-500">
              {selectedWorkerForHire.category} • {selectedWorkerForHire.jobs_completed} Tasks Completed
            </p>

            <div className="my-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Hourly Rate:</span>
                <span className="font-bold text-slate-900">₹{selectedWorkerForHire.hourly_rate} / hr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Operational Zone:</span>
                <span className="font-semibold text-slate-800">{selectedWorkerForHire.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verified Mobile:</span>
                <span className="font-bold text-emerald-600">{selectedWorkerForHire.phone}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href={`tel:${selectedWorkerForHire.phone}`}
                onClick={() => onHireWorker(selectedWorkerForHire)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow"
              >
                <Phone className="w-4 h-4" />
                <span>Call Directly</span>
              </a>
              <button
                onClick={() => setSelectedWorkerForHire(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
