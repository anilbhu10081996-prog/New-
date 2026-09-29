import React, { useState } from 'react';
import { UserProfile, MembershipTier } from '../../types';
import { Crown, Check, Zap, Sparkles, ShieldCheck } from 'lucide-react';

interface MembershipViewProps {
  currentUser: UserProfile;
  onUpgradeTier: (tier: MembershipTier) => void;
}

export const MembershipView: React.FC<MembershipViewProps> = ({
  currentUser,
  onUpgradeTier,
}) => {
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);

  const plans = [
    {
      tier: 'free' as MembershipTier,
      name: 'Free Basic',
      price: 0,
      period: 'Forever',
      popular: false,
      badge: 'Starter',
      features: [
        'Standard booking response time (2-3 hrs)',
        'Access to basic Crack Exam mock tests',
        'Standard delivery rates',
        'Email customer support',
      ],
    },
    {
      tier: 'silver' as MembershipTier,
      name: 'Silver Club',
      price: 299,
      period: 'per month',
      popular: false,
      badge: 'Popular for Homes',
      features: [
        'Priority worker dispatch (Under 45 mins)',
        '5% Flat discount on all Shop hardware & tools',
        'Access to 25+ premium Crack Exam tests with solutions',
        'Direct technician chat support',
        'Free doorstep inspection once a month',
      ],
    },
    {
      tier: 'gold' as MembershipTier,
      name: 'Gold Pro',
      price: 699,
      period: 'per month',
      popular: true,
      badge: 'Best Value',
      features: [
        'VIP Express technician arrival in 30 mins',
        '12% Flat discount on Shop products',
        'Full unlimited access to all Crack Exam test series',
        'Zero commission on work postings',
        'Dedicated 24/7 personal manager',
        '2 Free express parcel deliveries/month',
      ],
    },
    {
      tier: 'platinum' as MembershipTier,
      name: 'Platinum VIP / Corporate',
      price: 1499,
      period: 'per month',
      popular: false,
      badge: 'For Contractors & High Volume',
      features: [
        'Zero platform commission across all services',
        '20% wholesale discount on all tools & machinery',
        'Custom Mock Test & Exam paper generator tools',
        'Emergency 15-minute emergency electrician response',
        'Unlimited free parcel deliveries in Delhi NCR',
        'Top verified worker matching priority',
      ],
    },
  ];

  const handleConfirmUpgrade = (tier: MembershipTier) => {
    onUpgradeTier(tier);
    setSelectedTier(null);
    alert(`🎉 Membership upgraded to ${tier.toUpperCase()} successfully!`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 p-6 sm:p-8 text-white shadow-xl text-center max-w-3xl mx-auto">
        <Crown className="w-10 h-10 mx-auto text-amber-200 mb-2" />
        <span className="text-xs font-bold uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full border border-white/20">
          ANY WORK SERVICE PRIVILEGE CLUBS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">
          Upgrade Your Membership For Exclusive Savings & Speed
        </h1>
        <p className="text-amber-100 text-sm mt-2 max-w-lg mx-auto">
          Get VIP priority dispatch, zero service commission, deep discounts on industrial tools, and full access to Crack Exam mock test papers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((p) => {
          const isCurrent = currentUser.membership === p.tier;

          return (
            <div
              key={p.tier}
              className={`bg-white border rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 ${
                p.popular
                  ? 'border-amber-500 shadow-xl ring-2 ring-amber-400 relative'
                  : 'border-slate-200 hover:shadow-md'
              }`}
            >
              <div>
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow">
                    Most Popular
                  </span>
                )}

                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  {p.badge}
                </span>

                <h3 className="text-lg font-bold text-slate-900 mt-2">{p.name}</h3>

                <div className="my-4">
                  <span className="text-3xl font-black text-slate-900">₹{p.price}</span>
                  <span className="text-xs text-slate-400 ml-1">/{p.period}</span>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  {p.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleConfirmUpgrade(p.tier)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow ${
                    isCurrent
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : p.popular
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isCurrent ? 'Current Plan ✓' : `Upgrade to ${p.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
