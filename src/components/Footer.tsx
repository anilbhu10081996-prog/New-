import React from 'react';
import { Wrench, Phone, Mail, MapPin, Share2, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onShareWebsite: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onShareWebsite }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
                AWS
              </div>
              <span className="text-lg font-black tracking-tight">ANY WORK SERVICE</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              India's premier hybrid service platform connecting verified electricians, plumbers, painters & technicians with households, alongside an integrated hardware shop and CRACK EXAM test series.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onShareWebsite}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Share Any Work Service</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Services & Work</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-amber-400">
                  Home Deep Cleaning
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-amber-400">
                  Electrician & Wiring
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-amber-400">
                  AC Repair & Gas Refill
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-services">
                  Plumbing Leak Fix
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('workers')} className="hover:text-amber-400">
                  Verified Workers List
                </button>
              </li>
            </ul>
          </div>

          {/* Crack Exam Links */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Crack Exam Series</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('crack-exam')} className="hover:text-amber-400">
                  SSC CGL & CHSL Mock Tests
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('crack-exam')} className="hover:text-amber-400">
                  Railway RRB NTPC Tests
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('crack-exam')} className="hover:text-amber-400">
                  State Police Constable
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('crack-exam')} className="hover:text-amber-400">
                  ITI Wireman & Trade Theory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('education')} className="hover:text-amber-400">
                  Vocational Skill Academy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Headquarters</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+91 98110 00024</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="truncate">anyworkservice24@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Sector 62, Noida, Delhi NCR, India - 201301</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} ANY WORK SERVICE. All rights reserved. Zero-Regression Architecture.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Privacy Policy</span>
            <span className="text-slate-400">Terms of Service</span>
            <span className="text-slate-400">Security Gate RLS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
