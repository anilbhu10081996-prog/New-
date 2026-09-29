import React from 'react';
import { NotificationItem } from '../../types';
import { Bell, Check, Trash2, X, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm h-full flex flex-col shadow-2xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-base">Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <span>No notifications at the moment</span>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-2xl border text-xs transition-colors ${
                  notif.read
                    ? 'bg-slate-50 border-slate-200 text-slate-600'
                    : 'bg-amber-50/60 border-amber-200 text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-bold text-slate-900">{notif.title}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                </div>
                <p className="leading-relaxed text-slate-600 text-[11px]">{notif.message}</p>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="pt-3 border-t border-slate-200 flex justify-between gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Mark all read
            </button>
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
