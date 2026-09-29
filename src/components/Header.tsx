import React, { useState } from 'react';
import { UserProfile, CartItem, NotificationItem } from '../types';
import {
  Wrench,
  ShoppingCart,
  Bell,
  User,
  ShieldCheck,
  Menu,
  X,
  Share2,
  Sparkles,
  BookOpen,
  ShoppingBag,
  Truck,
  Briefcase,
  Crown,
  GraduationCap,
  Users,
} from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  currentView: string;
  cart: CartItem[];
  notifications: NotificationItem[];
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenAdmin: () => void;
  onOpenUserDashboard: () => void;
  onToggleNotifications: () => void;
  onOpenCart: () => void;
  onShareWebsite: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentView,
  cart,
  notifications,
  onNavigate,
  onOpenAuth,
  onOpenAdmin,
  onOpenUserDashboard,
  onToggleNotifications,
  onOpenCart,
  onShareWebsite,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = currentUser.role === 'admin' || currentUser.email === 'anyworkservice24@gmail.com';
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'workers', label: 'Workers', icon: Users },
    { id: 'crack-exam', label: 'Crack Exam', icon: BookOpen, badge: 'Tests' },
    { id: 'shop', label: 'Hardware Shop', icon: ShoppingBag },
    { id: 'delivery', label: 'Delivery', icon: Truck },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'membership', label: 'Membership', icon: Crown },
    { id: 'affiliate', label: 'Affiliate', icon: Users },
    { id: 'ai-assistant', label: 'Smart AI', icon: Sparkles },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 font-semibold text-center flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Verified Local Technicians & Same-Day Doorstep Service</span>
        </div>
        <div className="mx-auto sm:mx-0 flex items-center gap-3">
          <span>Need Emergency Help? Call: <strong>+91 98110 00024</strong></span>
          <button
            onClick={onShareWebsite}
            className="hover:text-amber-400 flex items-center gap-1 text-[10px] bg-slate-800 px-2 py-0.5 rounded transition-colors"
          >
            <Share2 className="w-3 h-3" /> Share
          </button>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-md group-hover:scale-105 transition-transform">
              AWS
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 block leading-tight">
                ANY WORK SERVICE
              </span>
              <span className="text-[10px] font-bold text-amber-600 tracking-wider uppercase block">
                Work • Shop • Crack Exam
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-bold text-slate-600">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2.5 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              title="Cart"
              className="relative p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Notifications Button */}
            <button
              onClick={onToggleNotifications}
              title="Notifications"
              className="relative p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-600 rounded-full animate-ping"></span>
              )}
            </button>

            {/* Admin Badge & Portal Access Button */}
            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span className="hidden sm:inline">Admin Panel</span>
              </button>
            )}

            {/* User Profile Badge or Login */}
            {currentUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenUserDashboard}
                  className="flex items-center gap-2 p-1 pl-2 pr-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={currentUser.full_name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs font-bold text-slate-800 hidden md:inline truncate max-w-[100px]">
                    {currentUser.full_name}
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-lg">
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`p-2.5 rounded-xl flex items-center gap-2 text-left ${
                    isActive ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-amber-500" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenUserDashboard();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5"
            >
              <User className="w-4 h-4" /> My Profile & Tasks
            </button>

            <button
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              Switch / Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
