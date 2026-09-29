import React, { useState } from 'react';
import { JobVacancy, UserProfile } from '../../types';
import { Briefcase, MapPin, DollarSign, Clock, CheckCircle2, Plus, Search } from 'lucide-react';

interface JobsViewProps {
  currentUser: UserProfile;
  jobs: JobVacancy[];
  onApplyJob: (jobId: string, applicantName: string) => void;
  onPostJob: (job: JobVacancy) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({
  currentUser,
  jobs,
  onApplyJob,
  onPostJob,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [applyingJob, setApplyingJob] = useState<JobVacancy | null>(null);
  const [applicantName, setApplicantName] = useState(currentUser.full_name || '');
  const [applicantPhone, setApplicantPhone] = useState(currentUser.phone || '');
  const [applicantExp, setApplicantExp] = useState('2 Years');
  const [applicantNote, setApplicantNote] = useState('');
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  // Post Job modal state
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCompany, setNewJobCompany] = useState('');
  const [newJobLocation, setNewJobLocation] = useState('');
  const [newJobSalary, setNewJobSalary] = useState('₹20,000 - ₹28,000 / month');
  const [newJobType, setNewJobType] = useState<'Full-time' | 'Part-time' | 'Contract'>('Full-time');
  const [newJobCategory, setNewJobCategory] = useState('Electrical');
  const [newJobReqs, setNewJobReqs] = useState('Relevant certification, 1+ year experience, good communication');

  const filteredJobs = jobs.filter((j) => {
    const matchesCat = selectedCategory === 'all' || j.category === selectedCategory;
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;

    onApplyJob(applyingJob.id, applicantName);
    setAppliedJobIds((prev) => [...prev, applyingJob.id]);
    alert(`Application submitted successfully for "${applyingJob.title}" at ${applyingJob.company}!`);
    setApplyingJob(null);
  };

  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim() || !newJobCompany.trim() || !newJobLocation.trim()) {
      alert('Please fill out all required job details');
      return;
    }

    const createdJob: JobVacancy = {
      id: 'job_' + Date.now(),
      title: newJobTitle.trim(),
      company: newJobCompany.trim(),
      location: newJobLocation.trim(),
      salary_range: newJobSalary.trim(),
      type: newJobType,
      category: newJobCategory,
      openings: 2,
      requirements: newJobReqs.split(',').map((r) => r.trim()).filter(Boolean),
      contact_email: 'hiring@anyworkservice.com',
      posted_at: new Date().toISOString().split('T')[0],
    };

    onPostJob(createdJob);
    setShowPostJobModal(false);
    setNewJobTitle('');
    setNewJobCompany('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-violet-950 via-purple-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full">
            CAREERS & FIELD EMPLOYMENT PORTAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">
            Find High-Paying Technician & Field Operations Jobs
          </h1>
          <p className="text-purple-200 text-sm mt-2">
            Direct hiring from verified companies for electricians, HVAC engineers, maintenance technicians, plumbers, and delivery riders.
          </p>
        </div>

        <button
          onClick={() => setShowPostJobModal(true)}
          className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-2xl shadow-xl flex items-center gap-2 shrink-0 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Post a Job Vacancy</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search job title, company or city..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {['all', 'Electrical', 'HVAC', 'Logistics', 'Plumbing'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'All Jobs' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const isApplied = appliedJobIds.includes(job.id);

          return (
            <div
              key={job.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                    {job.category}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {job.type}
                  </span>
                  <span className="text-xs text-slate-400">
                    Posted on {job.posted_at}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {job.title}
                </h3>

                <p className="text-xs font-semibold text-slate-600 flex items-center gap-3">
                  <span>🏢 {job.company}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </span>
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.requirements.map((req, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md"
                    >
                      • {req}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:items-end justify-between w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 gap-3">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-400 block font-bold">SALARY OFFER</span>
                  <span className="text-base font-black text-emerald-600">{job.salary_range}</span>
                </div>

                <button
                  onClick={() => setApplyingJob(job)}
                  disabled={isApplied}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow ${
                    isApplied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isApplied ? 'Application Sent ✓' : 'Apply for Job'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===================== APPLY JOB MODAL ===================== */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Apply for: {applyingJob.title}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {applyingJob.company} • {applyingJob.location}
            </p>

            <form onSubmit={handleApplicationSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
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
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Total Experience
                </label>
                <select
                  value={applicantExp}
                  onChange={(e) => setApplicantExp(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Fresher / Less than 1 year">Fresher / Less than 1 year</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5+ Years Senior">5+ Years Senior</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Brief Bio / Certifications
                </label>
                <textarea
                  rows={2}
                  value={applicantNote}
                  onChange={(e) => setApplicantNote(e.target.value)}
                  placeholder="e.g. ITI wireman certificate, 2-wheeler available..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setApplyingJob(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== POST JOB VACANCY MODAL ===================== */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Post a Job Opening</h3>
            <p className="text-xs text-slate-500 mb-4">
              Reach thousands of skilled technicians across Delhi NCR.
            </p>

            <form onSubmit={handlePostJobSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="e.g. Commercial Electrician"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Company / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={newJobCompany}
                  onChange={(e) => setNewJobCompany(e.target.value)}
                  placeholder="e.g. Sharma Engineering"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={newJobLocation}
                    onChange={(e) => setNewJobLocation(e.target.value)}
                    placeholder="e.g. Noida Sector 18"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Job Type
                  </label>
                  <select
                    value={newJobType}
                    onChange={(e) => setNewJobType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Salary Range
                </label>
                <input
                  type="text"
                  value={newJobSalary}
                  onChange={(e) => setNewJobSalary(e.target.value)}
                  placeholder="e.g. ₹22,000 - ₹30,000 / month"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Requirements (comma-separated)
                </label>
                <input
                  type="text"
                  value={newJobReqs}
                  onChange={(e) => setNewJobReqs(e.target.value)}
                  placeholder="e.g. ITI certificate, 2-wheeler, Hindi speaking"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPostJobModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-xl shadow"
                >
                  Publish Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
