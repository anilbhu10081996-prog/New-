import React, { useState } from 'react';
import { UserProfile, UserRole } from '../../types';
import { ADMIN_USER, INITIAL_USER } from '../../data/initialData';
import { ShieldCheck, User, Lock, Mail, Phone, Sparkles } from 'lucide-react';

interface AuthModalsProps {
  isOpen: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  isOpen,
  mode: initialMode,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();

    // Check if designated admin email
    if (cleanEmail === 'anyworkservice24@gmail.com' || cleanEmail === 'admin@anyworkservice.com') {
      onLoginSuccess(ADMIN_USER);
      onClose();
      return;
    }

    // Regular user login
    const loggedUser: UserProfile = {
      id: 'usr_' + Date.now(),
      email: cleanEmail,
      full_name: cleanEmail.split('@')[0],
      phone: '+91 98765 43210',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      address: 'Delhi NCR',
      membership: 'free',
      is_verified: true,
      created_at: new Date().toISOString(),
    };

    onLoginSuccess(loggedUser);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const isSpecialAdmin = cleanEmail === 'anyworkservice24@gmail.com';

    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      email: cleanEmail,
      full_name: fullName.trim(),
      phone: phone.trim(),
      role: isSpecialAdmin ? 'admin' : role,
      avatar: isSpecialAdmin
        ? ADMIN_USER.avatar
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      address: 'Delhi NCR',
      membership: isSpecialAdmin ? 'platinum' : 'free',
      is_verified: true,
      created_at: new Date().toISOString(),
    };

    onLoginSuccess(newUser);
    onClose();
  };

  const handleQuickAdminLogin = () => {
    onLoginSuccess(ADMIN_USER);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            AWS
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {mode === 'login' ? 'Sign In to Any Work Service' : 'Create Your Free Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access Crack Exam tests, book technicians, and manage orders.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
            {errorMsg}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm shadow transition-transform active:scale-98"
            >
              Sign In
            </button>

            {/* Quick Super Admin Switch for user */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleQuickAdminLogin}
                className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>One-Click Login as Admin (anyworkservice24@gmail.com)</span>
              </button>
            </div>

            <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-amber-600 hover:text-amber-700"
              >
                Register Here
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rahul Kumar"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    role === 'user'
                      ? 'border-amber-500 bg-amber-50 text-slate-900'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Customer / Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('worker')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    role === 'worker'
                      ? 'border-amber-500 bg-amber-50 text-slate-900'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Worker / Technician
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Create Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm shadow transition-transform active:scale-98"
            >
              Create Account
            </button>

            <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-slate-900 hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
