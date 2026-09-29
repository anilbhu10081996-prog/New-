import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Share2, Copy, Check, Users, DollarSign, Gift, ArrowRight } from 'lucide-react';

interface AffiliateViewProps {
  currentUser: UserProfile;
  onShare: (title: string, text: string, url: string) => void;
}

export const AffiliateView: React.FC<AffiliateViewProps> = ({
  currentUser,
  onShare,
}) => {
  const [copied, setCopied] = useState(false);
  const [payoutRequested, setPayoutRequested] = useState(false);

  // Generate personalized referral code based on user name/id
  const referralCode = `AWS-${currentUser.full_name.replace(/\s+/g, '').slice(0, 5).toUpperCase() || 'PRO'}-${currentUser.id.slice(-4)}`;
  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRequestPayout = () => {
    setPayoutRequested(true);
    alert('✅ Payout request for ₹1,250 submitted. Payment will be transferred to your registered UPI address within 24 hours.');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
            AFFILIATE & PARTNER PROGRAM
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">
            Earn Up To 15% Commission On Every Service & Shop Order
          </h1>
          <p className="text-emerald-100 text-sm mt-2">
            Share your unique referral link with friends, neighbours, and technicians. Earn instant cash rewards directly into your bank or UPI wallet.
          </p>
        </div>

        <button
          onClick={() =>
            onShare(
              'Join ANY WORK SERVICE & Get ₹100 Off',
              `Use my referral code ${referralCode} to get ₹100 discount on your first service booking or exam test series!`,
              referralLink
            )
          }
          className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 shrink-0 transition-transform active:scale-95"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Referral Link</span>
        </button>
      </div>

      {/* Referral Link Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-2">Your Unique Referral Link</h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-slate-800 truncate">
            {referralLink}
          </div>
          <button
            onClick={handleCopyLink}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* Metrics & Earnings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center">
          <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <span className="text-xs text-slate-400 uppercase font-bold">Total Referred Users</span>
          <div className="text-2xl font-black text-slate-900 mt-1">14 Friends</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center">
          <DollarSign className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <span className="text-xs text-slate-400 uppercase font-bold">Total Earnings</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">₹3,450</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center">
          <Gift className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <span className="text-xs text-slate-400 uppercase font-bold">Available for Payout</span>
          <div className="text-2xl font-black text-amber-600 mt-1">₹1,250</div>
          <button
            onClick={handleRequestPayout}
            disabled={payoutRequested}
            className="mt-3 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-200 disabled:text-slate-500 text-slate-950 rounded-xl text-xs font-bold shadow"
          >
            {payoutRequested ? 'Payout Pending' : 'Request Instant Payout'}
          </button>
        </div>
      </div>
    </div>
  );
};
